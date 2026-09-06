'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_REGION,
  REGIONS,
  formatFiat,
  type Region,
  type RegionId,
} from '@/lib/regions';
import { formatTctc } from '@/lib/format';

export type Denomination = 'fiat' | 'tCTC';

interface RegionContextValue {
  region: Region;
  setRegion: (id: RegionId) => void;
  denomination: Denomination;
  setDenomination: (d: Denomination) => void;
  /** Base units rendered in whichever unit the merchant is currently reading. */
  money: (wei: bigint) => string;
  /** Always the local currency, regardless of the toggle. */
  fiat: (wei: bigint) => string;
}

const RegionContext = createContext<RegionContextValue | null>(null);

const STORAGE_KEY = 'temi.region';

/**
 * Jurisdiction, held once and read everywhere.
 *
 * Currency lives in context rather than being threaded through props because it reaches almost
 * every surface — balances, sizing, receipts, the deposit rails — and prop-drilling it would
 * mean every new component has to remember to accept it. A component that forgets simply shows
 * the wrong currency, which is the kind of bug nobody notices until a merchant does.
 */
export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = useState<RegionId>(DEFAULT_REGION);
  const [denomination, setDenomination] = useState<Denomination>('fiat');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as RegionId | null;
      if (stored && stored in REGIONS) setRegionId(stored);
    } catch {
      // Private browsing, or storage disabled. The default is a fine answer.
    }
  }, []);

  const setRegion = useCallback((id: RegionId) => {
    setRegionId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* not worth failing over */
    }
  }, []);

  const region = REGIONS[regionId];

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      setRegion,
      denomination,
      setDenomination,
      money: (wei) =>
        denomination === 'fiat' ? formatFiat(wei, region) : `${formatTctc(wei)} tCTC`,
      fiat: (wei) => formatFiat(wei, region),
    }),
    [region, setRegion, denomination],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (!context) throw new Error('useRegion must be used inside a RegionProvider');
  return context;
}
