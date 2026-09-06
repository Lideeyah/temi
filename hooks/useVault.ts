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

export interface OracleState {
  /** USD per unit of the source asset, 18dp, as proven through 0x0FD2. */
  answerWad: bigint;
  roundId: bigint;
  updatedAt: bigint;
  provenAt: bigint;
  sourceHeight: bigint;
  /** USD per tCTC — the governance-set leg. */
  ctcUsdWad: bigint;
  fresh: boolean;
}

export interface PendingClaim {
  claimId: bigint;
  assetId: `0x${string}`;
  escrowedTier2: bigint;
  bond: bigint;
  challengeBond: bigint;
  challenger: Address;
  filedAt: bigint;
  /** 1 Pending · 2 Challenged · 3 Settled · 4 Rejected */
  status: number;
  challengeableUntil: bigint;
}

export interface RevenueState {
  /** Yield this operator has earned but not yet compounded. */
  pendingYield: bigint;
  /** Fees + protocol yield share collected since deployment. */
  totalProtocolFees: bigint;
  /** Yield credited to operators, cumulative. */
  totalYieldDistributed: bigint;
  /** address(0) while nothing is put to work — see the whitepaper. */
  yieldStrategy: Address;
  protocolTreasury: Address;
}

export interface VaultState {
  tier1PersonalBalance: bigint;
  lifetimeDeposits: bigint;
  lastDepositTimestamp: bigint;
  tier2Headroom: bigint;
  assets: VaultAsset[];
  telemetry: VaultTelemetry | null;
  oracle: OracleState | null;
  claims: PendingClaim[];
  revenue: RevenueState | null;
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
  oracle: null,
  claims: [],
  revenue: null,
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

      const [
        reserve, headroom, assets, telemetry, priceObs, ctcUsd, fresh, blockNumber,
        pendingYield, protocolFees, yieldDistributed, strategy, protoTreasury,
      ] = await Promise.all([
        creditcoinPublicClient.readContract({ ...contract, functionName: 'getReserve', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'quoteTier2Headroom', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'getOwnedAssets', args: [operator] }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'protocolTelemetry' }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'sourceAssetUsd' }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'ctcUsdWad' }),
        creditcoinPublicClient.readContract({ ...contract, functionName: 'isPriceFresh' }),
        creditcoinPublicClient.getBlockNumber(),
        // The revenue surface postdates the live deployment, so these are read defensively:
        // a vault that predates them should render as "unavailable" rather than taking the
        // whole dashboard down with a rejected batch. `npm run drift` shows the gap.
        creditcoinPublicClient
          .readContract({ ...contract, functionName: 'pendingYield', args: [operator] })
          .catch(() => null),
        creditcoinPublicClient
          .readContract({ ...contract, functionName: 'totalProtocolFees' })
          .catch(() => null),
        creditcoinPublicClient
          .readContract({ ...contract, functionName: 'totalYieldDistributed' })
          .catch(() => null),
        creditcoinPublicClient
          .readContract({ ...contract, functionName: 'yieldStrategy' })
          .catch(() => null),
        creditcoinPublicClient
          .readContract({ ...contract, functionName: 'protocolTreasury' })
          .catch(() => null),
      ]);

      const t = telemetry as readonly bigint[];
      const p = priceObs as readonly bigint[];

      // Escrowed claims are found through their event rather than by scanning ids — the
      // claimant is indexed, so this is one filtered query instead of N reads.
      let claims: PendingClaim[] = [];
      if (address) {
        const window = (await creditcoinPublicClient.readContract({
          ...contract,
          functionName: 'CHALLENGE_WINDOW',
        })) as bigint;

        const logs = await creditcoinPublicClient
          .getLogs({
            address: TEMI_VAULT_ADDRESS,
            event: {
              type: 'event',
              name: 'ClaimEscrowed',
              inputs: [
                { name: 'claimId', type: 'uint256', indexed: true },
                { name: 'claimant', type: 'address', indexed: true },
                { name: 'assetId', type: 'bytes32', indexed: true },
                { name: 'immediatePayout', type: 'uint256' },
                { name: 'escrowedTier2', type: 'uint256' },
                { name: 'bond', type: 'uint256' },
                { name: 'challengeableUntil', type: 'uint64' },
              ],
            },
            args: { claimant: address },
            fromBlock: 'earliest',
          })
          .catch(() => []);

        const states = await Promise.all(
          logs.map((log) =>
            creditcoinPublicClient.readContract({
              ...contract,
              functionName: 'pendingClaims',
              args: [log.args.claimId as bigint],
            }),
          ),
        );

        claims = states
          .map((raw, i) => {
            const c = raw as readonly [Address, `0x${string}`, bigint, bigint, bigint, Address, bigint, number];
            return {
              claimId: logs[i].args.claimId as bigint,
              assetId: c[1],
              escrowedTier2: c[2],
              bond: c[3],
              challengeBond: c[4],
              challenger: c[5],
              filedAt: c[6],
              status: Number(c[7]),
              challengeableUntil: c[6] + window,
            };
          })
          // Settled and Rejected claims are history, not something to act on.
          .filter((c) => c.status === 1 || c.status === 2);
      }

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
        claims,
        // Null across the board means this vault predates the revenue functions entirely.
        revenue:
          strategy === null && protocolFees === null
            ? null
            : {
                pendingYield: (pendingYield as bigint | null) ?? 0n,
                totalProtocolFees: (protocolFees as bigint | null) ?? 0n,
                totalYieldDistributed: (yieldDistributed as bigint | null) ?? 0n,
                yieldStrategy:
                  (strategy as Address | null) ?? '0x0000000000000000000000000000000000000000',
                protocolTreasury:
                  (protoTreasury as Address | null) ?? '0x0000000000000000000000000000000000000000',
              },
        oracle: {
          answerWad: p[0],
          roundId: p[1],
          updatedAt: p[2],
          provenAt: p[3],
          sourceHeight: p[4],
          ctcUsdWad: ctcUsd as bigint,
          fresh: fresh as boolean,
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
