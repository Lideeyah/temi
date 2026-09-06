'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Address } from 'viem';
import { creditcoinPublicClient } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';

export interface VaultAsset {
  assetId: `0x${string}`;
  category: 0 | 1;
  declaredValue: bigint;
  h3CellIndex: bigint;
  isActive: boolean;
}

export interface VaultTelemetry {
  tier1Total: bigint;
  tier2Pool: bigint;
  claimsSettled: bigint;
  valueDisbursed: bigint;
  crossChainCount: bigint;
  crossChainValue: bigint;
  conduitBacking: bigint;
  lastSourceHeight: bigint;
  lastChainKey: bigint;
}

export interface VaultState {
  tier1PersonalBalance: bigint;
  lifetimeDeposits: bigint;
  lastDepositTimestamp: bigint;
  tier2Headroom: bigint;
  assets: VaultAsset[];
  telemetry: VaultTelemetry | null;
  blockNumber: bigint | null;
  loading: boolean;
  error: string | null;
}

const EMPTY: VaultState = {
  tier1PersonalBalance: 0n,
  lifetimeDeposits: 0n,
  lastDepositTimestamp: 0n,
  tier2Headroom: 0n,
  assets: [],
  telemetry: null,
  blockNumber: null,
  loading: true,
  error: null,
};

/** Reads every piece of on-chain state the dashboard renders, in one multicall-shaped batch. */
export function useVault(address: Address | null, pollMs = 12_000) {
  const [state, setState] = useState<VaultState>(EMPTY);

  const refresh = useCallback(async () => {
    // Even with no deployment configured, keep the telemetry console honest by showing the
    // live cc3-testnet head rather than a dash.
    if (!TEMI_VAULT_ADDRESS) {
      const blockNumber = await creditcoinPublicClient.getBlockNumber().catch(() => null);
      setState((s) => ({
        ...s,
        blockNumber,
        loading: false,
        error: 'NEXT_PUBLIC_TEMI_VAULT_ADDRESS is not set',
      }));
      return;
    }

    try {
      const contract = { address: TEMI_VAULT_ADDRESS, abi: temiVaultAbi } as const;
      const operator = address ?? '0x0000000000000000000000000000000000000000';

      const [reserve, headroom, assets, telemetry, blockNumber] = await Promise.all([
        creditcoinPublicClient.readContract({ ...contract, functionName: 'getReserve', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'quoteTier2Headroom', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'getOwnedAssets', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'protocolTelemetry' }),
        creditcoinPublicClient.getBlockNumber(),
      ]);

      const t = telemetry as readonly bigint[];

      setState({
        tier1PersonalBalance: reserve.tier1PersonalBalance,
        lifetimeDeposits: reserve.lifetimeDeposits,
        lastDepositTimestamp: reserve.lastDepositTimestamp,
        tier2Headroom: headroom as bigint,
        assets: (assets as readonly VaultAsset[]).map((a) => ({ ...a })),
        telemetry: {
          tier1Total: t[0],
          tier2Pool: t[1],
          claimsSettled: t[2],
          valueDisbursed: t[3],
          crossChainCount: t[4],
          crossChainValue: t[5],
          conduitBacking: t[6],
          lastSourceHeight: t[7],
          lastChainKey: t[8],
        },
        blockNumber,
        loading: false,
        error: null,
      });
    } catch (cause) {
      setState((s) => ({
        ...s,
        loading: false,
        error: cause instanceof Error ? cause.message : 'Failed to read TemiVault',
      }));
    }
  }, [address]);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), pollMs);
    return () => clearInterval(timer);
  }, [refresh, pollMs]);

  return { ...state, refresh };
}
