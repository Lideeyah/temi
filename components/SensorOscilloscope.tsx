'use client';

import { useEffect, useRef } from 'react';
import type { AccelSample } from '@/lib/SpatialSweepEngine';

const MOSS = '#4A6B5D';
const INK_FAINT = 'rgba(31, 36, 47, 0.10)';
const SLATE_SOFT = '#7A8496';

/** Seconds of history on screen. Matches the sweep window exactly. */
const WINDOW_MS = 3000;

/** Vertical span around the running mean, in m/s². Wide enough for a real hand, tight enough
 *  that a phone resting on a table renders as a visibly flat line. */
const AMPLITUDE = 2.4;

export interface SensorOscilloscopeProps {
  samples: AccelSample[];
  /** Live sigma, drawn as the readout in the corner. */
  sigma: number;
  /** Draw the sub-threshold band in dusty rust once we know the device is too still. */
  belowThreshold?: boolean;
  height?: number;
  className?: string;
}

/**
 * A 60Hz oscilloscope for raw accelerometer gravity magnitude.
 *
 * This is the operator's proof that Tèmi is reading their actual hardware — the trace moves
 * with their hand and flattens the instant they put the phone down. It renders on a paper-white
 * canvas with a hairline grid, so it reads as an instrument trace rather than a Web3 chart.
 */
export function SensorOscilloscope({
  samples,
  sigma,
  belowThreshold = false,
  height = 96,
  className,
}: SensorOscilloscopeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const samplesRef = useRef(samples);
  samplesRef.current = samples;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.clientWidth;
      const cssHeight = height;

      if (canvas.width !== cssWidth * dpr || canvas.height !== cssHeight * dpr) {
        canvas.width = cssWidth * dpr;
        canvas.height = cssHeight * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Paper ground.
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Hairline graticule — quarters horizontally, thirds vertically.
      ctx.strokeStyle = INK_FAINT;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 1; i < 4; i++) {
        const x = Math.round((cssWidth * i) / 4) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cssHeight);
      }
      for (let i = 1; i < 3; i++) {
        const y = Math.round((cssHeight * i) / 3) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(cssWidth, y);
      }
      ctx.stroke();

      const data = samplesRef.current;
      const midY = cssHeight / 2;

      // Zero axis.
      ctx.strokeStyle = 'rgba(31, 36, 47, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, Math.round(midY) + 0.5);
      ctx.lineTo(cssWidth, Math.round(midY) + 0.5);
      ctx.stroke();

      if (data.length >= 2) {
        // Centre the trace on the window mean so gravity's ~9.81 offset drops out and what
        // remains on screen is purely the tremor.
        const window = data.filter((s) => s.t >= data[data.length - 1].t - WINDOW_MS);
        const source = window.length >= 2 ? window : data;
        let mean = 0;
        for (const s of source) mean += s.magnitude;
        mean /= source.length;

        const tEnd = source[source.length - 1].t;
        const tStart = Math.max(0, tEnd - WINDOW_MS);
        const span = Math.max(1, tEnd - tStart);

        ctx.strokeStyle = belowThreshold ? '#8C4A4A' : MOSS;
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();

        source.forEach((sample, index) => {
          const x = ((sample.t - tStart) / span) * cssWidth;
          const normalised = (sample.magnitude - mean) / AMPLITUDE;
          const y = midY - Math.max(-1, Math.min(1, normalised)) * (cssHeight / 2 - 4);
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      } else {
        ctx.fillStyle = SLATE_SOFT;
        ctx.font = '10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText('AWAITING IMU STREAM', 10, midY + 3);
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [height, belowThreshold]);

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-[3px] border border-hairline">
        <canvas ref={canvasRef} style={{ height, width: '100%', display: 'block' }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-2 py-1.5">
          <span className="eyebrow">|a| = √(x²+y²+z²)</span>
          <span
            className="tabular text-[10px] font-medium"
            style={{ color: belowThreshold ? '#8C4A4A' : MOSS }}
          >
            σ {sigma.toFixed(4)}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-2 py-1.5">
          <span className="tabular text-[9px] text-slate-soft">{samples.length} samples</span>
          <span className="tabular text-[9px] text-slate-soft">3.0s window</span>
        </div>
      </div>
    </div>
  );
}
