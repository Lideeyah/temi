'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createWalletClient, custom, http, type Address, type WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinTestnet } from '@/lib/chains';
import { isPlatformAuthenticatorAvailable } from '@/lib/MerchantAccount';
import {
  IdentityError,
  createIdentity,
  forgetIdentity,
  loadIdentity,
  unlockIdentity,
  type IdentityRecord,
} from '@/lib/MerchantIdentity';
import { useWallet } from './useWallet';

export type AccountKind = 'merchant' | 'injected';

export interface SponsorResult {
  sponsored: boolean;
  amount?: string;
  reason?: string;
}

/**
 * One account interface over two very different onboarding paths.
 *
 * Everything downstream — deposits, registration, claims — takes a viem `WalletClient` and an
 * address. Both paths produce exactly that, so the merchant who signed in with a fingerprint and
 * the judge who connected MetaMask travel identical code from here on. No branch in the
 * contract layer, no second implementation to keep in step.
 */
export function useMerchantAccount() {
  const injected = useWallet();

  const [record, setRecord] = useState<IdentityRecord | null>(null);
  const [privateKey, setPrivateKey] = useState<`0x${string}` | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null);
  const [sponsorship, setSponsorship] = useState<SponsorResult | null>(null);

  useEffect(() => {
    void loadIdentity().then(setRecord);
    void isPlatformAuthenticatorAvailable().then(setBiometricAvailable);
  }, []);

  /** Ask the sponsor to cover gas for a brand-new account. Never fatal. */
  const requestSponsorship = useCallback(async (address: Address) => {
    try {
      const response = await fetch('/api/sponsor', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const body = (await response.json()) as SponsorResult & { error?: string };
      setSponsorship(response.ok ? body : { sponsored: false, reason: body.error });
    } catch {
      setSponsorship({ sponsored: false, reason: 'sponsor unreachable' });
    }
  }, []);

  /**
   * Create the vault from a verified number and a chosen PIN.
   *
   * The key is derived, never generated: the same number and PIN reproduce the same account on
   * any device, which is what makes losing a handset survivable.
   */
  const createVault = useCallback(
    async (params: {
      pin: string;
      phoneE164: string;
      keyShare: string;
      regionId: string;
      businessName: string;
      biometricEnabled: boolean;
    }) => {
      setBusy(true);
      setError(null);
      try {
        const { record: created, privateKey: key } = await createIdentity(params);
        setRecord(created);
        setPrivateKey(key);
        await requestSponsorship(created.address);
      } catch (cause) {
        const identityError = cause as IdentityError;
        setError({ title: identityError.message, detail: identityError.detail });
      } finally {
        setBusy(false);
      }
    },
    [requestSponsorship],
  );

  /** Re-derive the account for an existing vault on this device. */
  const unlockWithPin = useCallback(
    async (pin: string): Promise<boolean> => {
      const active = record ?? (await loadIdentity());
      if (!active) {
        setError({ title: 'No vault on this device' });
        return false;
      }
      setBusy(true);
      setError(null);
      try {
        const key = await unlockIdentity(active, pin);
        setRecord(active);
        setPrivateKey(key);
        return true;
      } catch (cause) {
        const identityError = cause as IdentityError;
        setError({ title: identityError.message, detail: identityError.detail });
        if (identityError.code === 'ERR_PIN_LOCKED') setRecord(null);
        return false;
      } finally {
        setBusy(false);
      }
    },
    [record],
  );

  const lock = useCallback(() => setPrivateKey(null), []);

  const forget = useCallback(async () => {
    await forgetIdentity();
    setRecord(null);
    setPrivateKey(null);
    setSponsorship(null);
  }, []);

  /** The merchant path signs locally and broadcasts over plain RPC — no extension involved. */
  const merchantWalletClient: WalletClient | null = useMemo(() => {
    if (!privateKey) return null;
    return createWalletClient({
      account: privateKeyToAccount(privateKey),
      chain: creditcoinTestnet,
      transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
    });
  }, [privateKey]);

  const injectedWalletClient: WalletClient | null = useMemo(() => {
    if (!injected.address || typeof window === 'undefined' || !window.ethereum) return null;
    return createWalletClient({
      account: injected.address,
      chain: creditcoinTestnet,
      transport: custom(window.ethereum),
    });
  }, [injected.address]);

  // An unlocked merchant account wins: it is the path the product is designed around, and a
  // judge with an extension installed is still explicitly choosing the other one.
  const kind: AccountKind | null = privateKey ? 'merchant' : injected.address ? 'injected' : null;

  const address: Address | null =
    kind === 'merchant' ? (record?.address ?? null) : kind === 'injected' ? injected.address : null;

  const walletClient = kind === 'merchant' ? merchantWalletClient : injectedWalletClient;

  return {
    kind,
    address,
    walletClient,
    connected: address !== null && walletClient !== null,

    // merchant path
    record,
    unlocked: privateKey !== null,
    biometricAvailable,
    sponsorship,
    createVault,
    unlockWithPin,
    lock,
    forget,

    // injected path
    injected,

    busy: busy || injected.connecting,
    error: error ?? (injected.error ? { title: injected.error } : null),
  };
}
