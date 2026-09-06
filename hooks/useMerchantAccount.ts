'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createWalletClient, custom, http, type Address, type WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinTestnet } from '@/lib/chains';
import {
  MerchantError,
  createMerchantAccount,
  describeProtection,
  forgetMerchantAccount,
  isPlatformAuthenticatorAvailable,
  loadMerchantRecord,
  unlockMerchantAccount,
  type MerchantRecord,
} from '@/lib/MerchantAccount';
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

  const [record, setRecord] = useState<MerchantRecord | null>(null);
  const [privateKey, setPrivateKey] = useState<`0x${string}` | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ title: string; detail?: string } | null>(null);
  const [sponsorship, setSponsorship] = useState<SponsorResult | null>(null);

  useEffect(() => {
    void loadMerchantRecord().then(setRecord);
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

  const openMerchantVault = useCallback(
    async (label: string, profile?: { regionId?: string; phoneE164?: string }) => {
      setBusy(true);
      setError(null);
      try {
        const existing = record ?? (await loadMerchantRecord());
        const active = existing ?? (await createMerchantAccount(label.trim() || 'My business', profile));
        setRecord(active);

        const key = await unlockMerchantAccount(active);
        setPrivateKey(key);

        // A new account has no gas. Cover it before the merchant hits a wall they cannot parse.
        if (!existing) await requestSponsorship(active.address);
      } catch (cause) {
        const merchantError = cause as MerchantError;
        setError({ title: merchantError.message, detail: merchantError.detail });
      } finally {
        setBusy(false);
      }
    },
    [record, requestSponsorship],
  );

  const lock = useCallback(() => setPrivateKey(null), []);

  const forget = useCallback(async () => {
    await forgetMerchantAccount();
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
    protection: record ? describeProtection(record.protection) : null,
    sponsorship,
    openMerchantVault,
    lock,
    forget,

    // injected path
    injected,

    busy: busy || injected.connecting,
    error: error ?? (injected.error ? { title: injected.error } : null),
  };
}
