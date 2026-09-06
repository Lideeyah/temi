'use client';

import { useEffect, useState } from 'react';
import { Check, LocateFixed, Navigation, Satellite } from 'lucide-react';
import {
  MAX_GPS_ACCURACY_METERS,
  SpatialLockError,
  watchSpatialProximity,
  type SpatialProximity,
} from '@/lib/H3SpatialLock';
import { cn } from '@/lib/utils';
import { Notice } from './ui/Primitives';

/**
 * Live guidance back inside a registered cell.
 *
 * The on-chain check is unchanged and unforgiving: the live cell must equal the registered one.
 * Widening it to the six neighbours would have been the easy fix and the wrong one — it trades a
 * small convenience for a sevenfold increase in the area from which a shop could be impersonated.
 * So the boundary stays put and the merchant gets to see where it is instead of guessing why
 * their claim was refused.
 */
export function SpatialProximityIndicator({
  boundCellIndex,
  onChange,
}: {
  boundCellIndex: bigint;
  onChange?: (proximity: SpatialProximity | null) => void;
}) {
  const [proximity, setProximity] = useState<SpatialProximity | null>(null);
  const [error, setError] = useState<SpatialLockError | null>(null);

  useEffect(() => {
    setProximity(null);
    setError(null);
    const stop = watchSpatialProximity(
      boundCellIndex,
      (next) => {
        setProximity(next);
        setError(null);
        onChange?.(next);
      },
      (cause) => {
        setError(cause);
        setProximity(null);
        onChange?.(null);
      },
    );
    return stop;
    // onChange is intentionally excluded: callers pass an inline closure and re-subscribing on
    // every render would restart the GPS watch continuously.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundCellIndex]);

  if (error) {
    return (
      <Notice tone="rust" title={error.message} icon={<Satellite size={12} />}>
        {error.detail}
      </Notice>
    );
  }

  if (!proximity) {
    return (
      <div className="flex items-center gap-2 border border-hairline bg-paper-raised px-3 py-2.5">
        <LocateFixed size={13} className="animate-pulse text-slate-soft" strokeWidth={1.75} />
        <span className="text-[11.5px] text-slate-strong">Acquiring GPS fix…</span>
      </div>
    );
  }

  const weakFix = proximity.accuracy > MAX_GPS_ACCURACY_METERS;
  const inside = proximity.inside && !weakFix;

  return (
    <div
      className={cn(
        'border border-hairline border-l-2 px-3.5 py-3',
        inside ? 'border-l-moss bg-[rgba(74,107,93,0.06)]' : 'border-l-ochre bg-[rgba(140,115,62,0.06)]',
      )}
    >
      <div className="flex items-start gap-3">
        {inside ? (
          <Check size={16} className="mt-[1px] shrink-0 text-moss" strokeWidth={2} />
        ) : (
          <CompassNeedle bearing={proximity.bearingDeg} />
        )}

        <div className="min-w-0 flex-1">
          {inside ? (
            <>
              <p className="text-[12.5px] font-semibold text-moss">Inside your registered cell</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-strong">
                You can file from here. Stay put while the sweep runs.
              </p>
            </>
          ) : weakFix ? (
            <>
              <p className="text-[12.5px] font-semibold text-ochre">GPS fix too weak to place you</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-strong">
                ±{proximity.accuracy.toFixed(0)} m, and Tèmi needs ±{MAX_GPS_ACCURACY_METERS} m or
                better. Step into open sky and wait a moment.
              </p>
            </>
          ) : (
            <>
              <p className="text-[12.5px] font-semibold text-ochre">
                {proximity.metersOutside < 1
                  ? 'Just outside your registered cell'
                  : `${proximity.metersOutside.toFixed(0)} m outside your registered cell`}
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-strong">
                Move <span className="font-semibold text-ink">{proximity.compass}</span>
                {proximity.gridDistance === 1
                  ? ' — you are one cell over the line, so a few steps back toward your counter should do it.'
                  : ' toward the premises this shop was registered at.'}
              </p>
            </>
          )}

          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 border-t border-hairline pt-2">
            <Readout label="Live cell" value={proximity.h3Index} />
            <Readout label="Registered" value={proximity.boundH3Index} match={proximity.inside} />
            <Readout label="Accuracy" value={`±${proximity.accuracy.toFixed(0)} m`} match={!weakFix} />
            <Readout
              label="Cells away"
              value={proximity.gridDistance === null ? 'far' : proximity.gridDistance.toString()}
              match={proximity.gridDistance === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Readout({ label, value, match }: { label: string; value: string; match?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-[9.5px] uppercase tracking-[0.08em] text-slate-soft">{label}</span>
      <span
        className={cn(
          'tabular truncate text-[10px]',
          match === undefined ? 'text-slate-strong' : match ? 'text-moss' : 'text-ochre',
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** A hairline compass rose. The needle points the way back, not the way you are facing. */
function CompassNeedle({ bearing }: { bearing: number }) {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" className="mt-[1px] shrink-0" aria-hidden>
      <circle cx="17" cy="17" r="15" fill="none" stroke="rgba(31,36,47,0.16)" strokeWidth="1" />
      <circle cx="17" cy="17" r="1.5" fill="#8C733E" />
      {[0, 90, 180, 270].map((tick) => (
        <line
          key={tick}
          x1="17"
          y1="3.5"
          x2="17"
          y2="6.5"
          stroke="rgba(31,36,47,0.22)"
          strokeWidth="1"
          transform={`rotate(${tick} 17 17)`}
        />
      ))}
      <g transform={`rotate(${bearing} 17 17)`} style={{ transition: 'transform 400ms ease-out' }}>
        <path d="M17 5 L21 19 L17 16.5 L13 19 Z" fill="#8C733E" />
      </g>
      <Navigation size={0} />
    </svg>
  );
}
