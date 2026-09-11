'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createWalletClient, custom, http, type Address, type WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinPublicClient, creditcoinTestnet } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import { deriveAccountKey } from '@/lib/MerchantIdentity';
import { isPlatformAuthenticatorAvailable } from '@/lib/MerchantAccount';
import {
  IdentityError,
  createIdentity,
  enableBiometricUnlock,
  forgetIdentity,
  hasBiometricUnlock,
  loadIdentity,
  unlockIdentity,
  unlockWithBiometric,
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
  /** True when a merchant asked for one-touch unlock and this device could not provide it. */
  const [biometricFellBack, setBiometricFellBack] = useState(false);

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
        setPrivateKey(key);

        // Arm one-touch unlock only if the device can genuinely seal a key. Where it cannot, the
        // record keeps the PIN as the only door and the interface says so, rather than leaving a
        // toggle switched on that does nothing.
        let active = created;
        if (params.biometricEnabled) {
          const sealed = await enableBiometricUnlock(created, key);
          if (sealed) active = sealed;
          else setBiometricFellBack(true);
        }
        setRecord(active);

        await requestSponsorship(active.address);
      } catch (cause) {
        const identityError = cause as IdentityError;
        setError({ title: identityError.message, detail: identityError.detail });
      } finally {
        setBusy(false);
      }
    },
    [requestSponsorship],
  );

  /**
   * Open a vault that already exists, from a number and a PIN.
   *
   * This is the flow a merchant uses on a new handset, and it is not the same as creating one —
   * though until now it was the only flow there was, and that was dangerous. The key is derived,
   * never stored, so a mistyped PIN does not fail: it derives a *different*, valid, empty account.
   * The merchant would have been shown a vault with nothing in it and no explanation, and would
   * reasonably conclude their savings were gone.
   *
   * So the derived address is looked up on chain before anything is written to this device. A
   * vault that exists is opened; one that does not is reported as what it is — "no vault for this
   * number and PIN" — leaving the merchant to retry rather than quietly stranding them in an
   * empty account that is not theirs.
   */
  const openVault = useCallback(
    async (params: {
      pin: string;
      phoneE164: string;
      keyShare: string;
      regionId: string;
    }): Promise<'opened' | 'not-found'> => {
      setBusy(true);
      setError(null);
      try {
        const key = await deriveAccountKey(params.pin, params.phoneE164, params.keyShare);
        const address = privateKeyToAccount(key).address;

        let exists = false;
        if (TEMI_VAULT_ADDRESS) {
          const contract = { address: TEMI_VAULT_ADDRESS, abi: temiVaultAbi } as const;
          const [reserve, assets] = await Promise.all([
            creditcoinPublicClient.readContract({ ...contract, functionName: 'getReserve', args: [address] }),
            creditcoinPublicClient.readContract({ ...contract, functionName: 'getOwnedAssets', args: [address] }),
          ]);
          const r = reserve as { lifetimeDeposits: bigint };
          exists = r.lifetimeDeposits > 0n || (assets as readonly unknown[]).length > 0;
        }

        if (!exists) return 'not-found';

        // Only now is anything written to this device.
        const { record: restored } = await createIdentity({
          ...params,
          businessName: '',
          biometricEnabled: false,
          derivedKey: key,
        });
        setPrivateKey(key);
        setRecord(restored);
        await requestSponsorship(address);
        return 'opened';
      } catch (cause) {
        const identityError = cause as IdentityError;
        setError({ title: identityError.message, detail: identityError.detail });
        return 'not-found';
      } finally {
        setBusy(false);
      }
    },
    [requestSponsorship],
  );

  /** Unlock with the biometric, when this device has it armed. */
  const unlockWithTouch = useCallback(async (): Promise<boolean> => {
    const active = record ?? (await loadIdentity());
    if (!active || !hasBiometricUnlock(active)) return false;
    setBusy(true);
    setError(null);
    try {
      setPrivateKey(await unlockWithBiometric(active));
      setRecord(active);
      return true;
    } catch (cause) {
      const identityError = cause as IdentityError;
      setError({ title: identityError.message, detail: identityError.detail });
      return false;
    } finally {
      setBusy(false);
    }
  }, [record]);

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
    openVault,
    unlockWithPin,
    unlockWithTouch,
    biometricArmed: hasBiometricUnlock(record),
    biometricFellBack,
    lock,
    forget,

    // injected path
    injected,

    busy: busy || injected.connecting,
    error: error ?? (injected.error ? { title: injected.error } : null),
  };
}
