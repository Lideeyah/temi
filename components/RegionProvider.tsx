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
 * The unit a merchant reads in, held separately from the jurisdiction.
 *
 * Someone trading in Lagos who funds their vault in tCTC wants tCTC on the dashboard; the region
 * still decides which fiat the other option means. Two questions, two answers.
 */
const DENOMINATION_KEY = 'temi.denomination';

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
  const [denomination, setDenominationState] = useState<Denomination>('fiat');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as RegionId | null;
      if (stored && stored in REGIONS) setRegionId(stored);
      const unit = localStorage.getItem(DENOMINATION_KEY) as Denomination | null;
      if (unit === 'fiat' || unit === 'tCTC') setDenominationState(unit);
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

  /**
   * The unit follows what the merchant actually does.
   *
   * A toggle that resets to naira on every reload is not a preference, it is a suggestion. And a
   * merchant who funds their vault in tCTC and then sees a naira dashboard has been told their
   * balance in a currency they did not choose. So this persists, and the deposit rails call it on
   * settlement: fund over NIP and the app speaks naira; fund in tCTC or through Sepolia and it
   * speaks tCTC. The header toggle is the same switch, so whichever the merchant touched last
   * wins — which is the only rule that never surprises them.
   */
  const setDenomination = useCallback((next: Denomination) => {
    setDenominationState(next);
    try {
      localStorage.setItem(DENOMINATION_KEY, next);
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
    [region, setRegion, denomination, setDenomination],
  );

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (!context) throw new Error('useRegion must be used inside a RegionProvider');
  return context;
}
