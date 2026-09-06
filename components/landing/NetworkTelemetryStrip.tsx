'use client';

import { useEffect, useState } from 'react';
import { creditcoinPublicClient, ATTESTCOIN_CHAIN_KEYS } from '@/lib/chains';
import { TEMI_VAULT_ADDRESS } from '@/lib/config';
import { temiVaultAbi } from '@/lib/abi';
import { getAttestedHeight } from '@/lib/AttestcoinConduit';
import { formatTctc } from '@/lib/format';
import { StatusDot } from '../ui/Primitives';

interface Telemetry {
  blockHeight: bigint | null;
  attestedSepoliaHeight: number | null;
  spatialCells: bigint | null;
  crossChainProofs: bigint | null;
  crossChainValue: bigint | null;
}

/**
 * Live network reach.
 *
 * Every figure here is read from cc3-testnet or the Creditcoin proof builder on an interval.
 * Nothing is seeded or padded — an undeployed vault renders zeroes, which is the honest state.
 */
export function NetworkTelemetryStrip() {
  const [t, setT] = useState<Telemetry>({
    blockHeight: null,
    attestedSepoliaHeight: null,
    spatialCells: null,
    crossChainProofs: null,
    crossChainValue: null,
  });

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const [blockHeight, attested] = await Promise.all([
        creditcoinPublicClient.getBlockNumber().catch(() => null),
        getAttestedHeight(ATTESTCOIN_CHAIN_KEYS.ETHEREUM_SEPOLIA).catch(() => null),
      ]);

      let registry: readonly bigint[] | null = null;
      if (TEMI_VAULT_ADDRESS) {
        registry = (await creditcoinPublicClient
          .readContract({
            address: TEMI_VAULT_ADDRESS,
            abi: temiVaultAbi,
            functionName: 'registryTelemetry',
          })
          .catch(() => null)) as readonly bigint[] | null;
      }

      if (cancelled) return;
      setT({
        blockHeight,
        attestedSepoliaHeight: attested,
        spatialCells: registry?.[1] ?? null,
        crossChainProofs: registry?.[2] ?? null,
        crossChainValue: registry?.[3] ?? null,
      });
    };

    void poll();
    const timer = setInterval(() => void poll(), 15_000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const cells = [
    {
      label: 'Creditcoin cc3 block',
      value: t.blockHeight ? t.blockHeight.toLocaleString() : '—',
      tone: 'ink' as const,
    },
    {
      label: 'H3 cells locked · Lagos',
      value: t.spatialCells !== null ? t.spatialCells.toString() : '0',
      tone: 'ink' as const,
    },
    {
      label: 'Sepolia attested height',
      value: t.attestedSepoliaHeight ? t.attestedSepoliaHeight.toLocaleString() : '—',
      tone: 'steel' as const,
    },
    {
      label: 'Cross-chain reserves read',
      value:
        t.crossChainValue !== null
          ? `${formatTctc(t.crossChainValue, 2)} tCTC`
          : '0.00 tCTC',
      tone: 'steel' as const,
    },
  ];

  return (
    <div className="border-y border-hairline bg-paper-raised">
      <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-8">
        <div className="grid grid-cols-2 divide-x divide-hairline sm:grid-cols-4">
          {cells.map((cell, index) => (
            <div
              key={cell.label}
              className={`px-3 py-3.5 sm:px-4 ${index < 2 ? 'border-b border-hairline sm:border-b-0' : ''}`}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <StatusDot tone={cell.tone === 'steel' ? 'steel' : 'moss'} />
                <span className="eyebrow">{cell.label}</span>
              </div>
              <p
                className={`tabular text-[15px] font-semibold leading-none tracking-[-0.02em] sm:text-[17px] ${
                  cell.tone === 'steel' ? 'text-steel' : 'text-ink'
                }`}
              >
                {cell.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
