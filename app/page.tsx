import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Ban,
  Camera,
  Clock,
  FileX2,
  Landmark,
  Link2,
  MapPin,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { ValueEquation, LaunchLink } from '@/components/landing/ValueEquation';
import { NetworkTelemetryStrip } from '@/components/landing/NetworkTelemetryStrip';
import { creditcoinTestnet } from '@/lib/chains';

export const metadata: Metadata = {
  title: 'Tèmi — Emergency liquidity for working businesses',
  description:
    'Keep 85% of your reserve unencumbered. Verify physical damage in three seconds on your own device. Settle instantly on Creditcoin.',
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <TopBar />
      <Hero />
      <NetworkTelemetryStrip />
      <ProblemGrid />
      <HowItWorks />
      <ClosingCta />
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function TopBar() {
  return (
    <header className="border-b border-hairline">
      <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-5 py-4 sm:px-8">
        <span className="text-[22px] font-semibold leading-none tracking-[-0.035em] text-ink">
          Tèmi
        </span>
        <span className="hidden text-[11px] leading-none text-slate-soft sm:inline">
          Emergency micro-liquidity · Lagos
        </span>
        <a
          href="/app"
          className="focus-ring ml-auto inline-flex items-center gap-1.5 rounded-[3px] border border-hairline-strong px-3 py-[7px] text-[12px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
        >
          <Wallet size={13} strokeWidth={1.75} />
          Merchant Vault
        </a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
      <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-[2px] border border-hairline bg-card px-2.5 py-1">
            <span className="inline-block size-[5px] rounded-[1px] bg-moss" />
            <span className="tabular text-[10px] uppercase tracking-[0.09em] text-slate-strong">
              Live on Creditcoin cc3-testnet · {creditcoinTestnet.id}
            </span>
          </div>

          {/* The headline is the entire thesis. Set it large and let it breathe. */}
          <h1 className="max-w-[15ch] text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] text-ink sm:text-[52px] lg:text-[58px]">
            Emergency liquidity for working businesses.
            <span className="block text-slate-soft">Not sunk-cost insurance.</span>
          </h1>

          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-slate-strong sm:text-[16px]">
            Keep 85% of your reserve unencumbered. Verify physical damage in three seconds
            directly on your device. Settle instantly on Creditcoin.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <LaunchLink />
            <Link
              href="/whitepaper"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-[3px] border border-hairline-strong px-5 py-3 text-[13px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
            >
              Read whitepaper &amp; ASC audit
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-hairline pt-5">
            <Assurance icon={<Wallet size={13} strokeWidth={1.75} />} label="Non-custodial" />
            <Assurance icon={<Clock size={13} strokeWidth={1.75} />} label="Settles in one block" />
            <Assurance icon={<Camera size={13} strokeWidth={1.75} />} label="No video leaves your phone" />
          </div>
        </div>

        <ValueEquation />
      </div>
    </section>
  );
}

function Assurance({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-slate-strong">
      <span className="text-slate-soft">{icon}</span>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */

const PROBLEMS = [
  {
    icon: <Clock size={15} strokeWidth={1.75} />,
    insurance: 'Six months of claim adjustment',
    temi: 'Settlement in a single block',
    detail:
      'A loss adjuster visits, files, disputes and schedules. Your generator is dead the whole time. Tèmi verifies on your own hardware and releases funds in the same transaction.',
  },
  {
    icon: <FileX2 size={15} strokeWidth={1.75} />,
    insurance: '100% of the premium is gone',
    temi: '85% stays yours, always',
    detail:
      'A year without a claim means a year of premium you will never see. A Tèmi reserve is a balance, not a payment — withdraw it whenever you want.',
  },
  {
    icon: <Ban size={15} strokeWidth={1.75} />,
    insurance: 'Denial at the adjuster’s discretion',
    temi: 'Thresholds fixed in the contract',
    detail:
      'No one reviews your claim. The contract checks tremor, parallax and spatial lock against public constants and pays out, or it does not — the same rules for everyone.',
  },
  {
    icon: <ShieldCheck size={15} strokeWidth={1.75} />,
    insurance: 'Solvency you cannot inspect',
    temi: 'A pool you can read on-chain',
    detail:
      'Every claim is capped at 10% of the mutual buffer and 3× what you have contributed. The pool balance is public, so the arithmetic is checkable by anyone.',
  },
];

function ProblemGrid() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
      <div className="mb-8 max-w-[62ch]">
        <p className="eyebrow mb-2.5">The problem</p>
        <h2 className="text-[26px] font-semibold leading-[1.14] tracking-[-0.03em] text-ink sm:text-[32px]">
          Nigerian SMEs are underinsured because commercial insurance is a bad deal, not because
          they are careless.
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {PROBLEMS.map((row) => (
          <article key={row.insurance} className="card flex flex-col p-4">
            <div className="mb-3 flex items-center gap-2 text-slate-soft">{row.icon}</div>

            <div className="mb-2.5 flex items-baseline gap-2">
              <span className="text-[12.5px] text-rust line-through decoration-rust/40">
                {row.insurance}
              </span>
            </div>
            <div className="mb-3 flex items-baseline gap-2">
              <ArrowRight size={12} className="shrink-0 translate-y-[2px] text-moss" strokeWidth={2} />
              <span className="text-[14px] font-semibold tracking-[-0.015em] text-ink">
                {row.temi}
              </span>
            </div>

            <p className="mt-auto text-[12px] leading-relaxed text-slate-strong">{row.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: '01',
    icon: <Landmark size={15} strokeWidth={1.75} />,
    title: 'Fund your reserve',
    body: 'Transfer Naira to your dedicated virtual account and Trugi settles it into the vault through PenguinSwap USD1 — or a diaspora backer funds you from Ethereum Sepolia, read into Creditcoin by the Attestcoin precompile.',
    tag: 'Dual rail',
    tone: 'steel' as const,
  },
  {
    n: '02',
    icon: <MapPin size={15} strokeWidth={1.75} />,
    title: 'Register what you own',
    body: 'A generator is bound by the hash of its serial plate. A stall is bound by its Uber H3 hexagon and the prepaid meter on the wall — so nobody can register your shop, and you cannot claim from somewhere else.',
    tag: 'On-chain identity',
    tone: 'ochre' as const,
  },
  {
    n: '03',
    icon: <Camera size={15} strokeWidth={1.75} />,
    title: 'Sweep the damage',
    body: 'Pan your phone across the loss for three seconds. Your accelerometer proves a hand is holding it; the depth structure of the scene proves it is not a photograph. Nothing is uploaded.',
    tag: '3 seconds',
    tone: 'rust' as const,
  },
  {
    n: '04',
    icon: <Link2 size={15} strokeWidth={1.75} />,
    title: 'Take the money',
    body: 'The contract drains your own Tier 1 first, tops up from the mutual buffer within the invariant, and pays out in the same block. Trugi pushes Naira to your bank on the NIBSS rail in under thirty seconds.',
    tag: 'Under 30s to bank',
    tone: 'moss' as const,
  },
];

function HowItWorks() {
  return (
    <section id="how" className="border-t border-hairline bg-paper-raised">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-8 max-w-[58ch]">
          <p className="eyebrow mb-2.5">How it works</p>
          <h2 className="text-[26px] font-semibold leading-[1.14] tracking-[-0.03em] text-ink sm:text-[32px]">
            Four steps, and the only one that happens during an emergency takes three seconds.
          </h2>
        </div>

        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <li key={step.n} className="card flex flex-col p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="tabular text-[11px] font-semibold text-slate-soft">{step.n}</span>
                <span
                  className={`text-${step.tone}`}
                  style={{
                    color: {
                      steel: '#4A627A',
                      ochre: '#8C733E',
                      rust: '#8C4A4A',
                      moss: '#4A6B5D',
                    }[step.tone],
                  }}
                >
                  {step.icon}
                </span>
              </div>
              <h3 className="mb-2 text-[14.5px] font-semibold tracking-[-0.02em] text-ink">
                {step.title}
              </h3>
              <p className="mb-3 text-[12px] leading-relaxed text-slate-strong">{step.body}</p>
              <span
                className="tabular mt-auto inline-flex w-fit items-center rounded-[2px] border px-2 py-[3px] text-[9.5px] uppercase tracking-[0.07em]"
                style={{
                  color: { steel: '#4A627A', ochre: '#8C733E', rust: '#8C4A4A', moss: '#4A6B5D' }[step.tone],
                  borderColor: {
                    steel: 'rgba(74,98,122,0.28)',
                    ochre: 'rgba(140,115,62,0.28)',
                    rust: 'rgba(140,74,74,0.28)',
                    moss: 'rgba(74,107,93,0.28)',
                  }[step.tone],
                }}
              >
                {step.tag}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function ClosingCta() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
      <div className="card flex flex-col items-start gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div className="max-w-[46ch]">
          <h2 className="text-[24px] font-semibold leading-[1.15] tracking-[-0.03em] text-ink sm:text-[28px]">
            Your money should still be yours the day nothing goes wrong.
          </h2>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-strong">
            Open a vault, register your generator, and keep every Naira you do not claim.
          </p>
        </div>
        <LaunchLink className="shrink-0 px-6 py-3.5" />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-6 sm:px-8">
        <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">Tèmi</span>
        <span className="text-[11px] text-slate-soft">“Mine” — Yorùbá</span>
        <Link href="/whitepaper" className="focus-ring text-[11.5px] text-ink underline underline-offset-2">
          Whitepaper &amp; ASC audit
        </Link>
        <span className="tabular ml-auto text-[10.5px] text-slate-soft">
          Creditcoin cc3-testnet · Attestcoin chain key 1 · Ethereum Sepolia
        </span>
      </div>
    </footer>
  );
}
