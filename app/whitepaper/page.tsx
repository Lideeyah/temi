import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Claim, Code, H3, Mono, P, Section, Table } from '@/components/whitepaper/Prose';
import { creditcoinTestnet } from '@/lib/chains';
import { ATTESTCOIN_VERIFIER_ADDRESS } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Whitepaper & ASC Audit — Tèmi',
  description:
    'The dual-reserve model, the on-device physical attestation that replaces the loss adjuster, and the Attestcoin readability path — with its threat model and known limitations.',
};

const CONTENTS = [
  ['1', 'The problem', 'problem'],
  ['2', 'The dual reserve', 'reserve'],
  ['3', 'Solvency invariant', 'invariant'],
  ['3b', 'Optimistic settlement', 'optimistic'],
  ['4', 'Physical attestation', 'attestation'],
  ['5', 'Spatial lock', 'spatial'],
  ['6', 'Attestcoin readability', 'attestcoin'],
  ['7', 'ASC audit & threat model', 'audit'],
  ['8', 'Known limitations', 'limitations'],
  ['9', 'Parameters', 'parameters'],
] as const;

export default function WhitepaperPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/92 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1180px] items-center gap-4 px-5 py-3.5 sm:px-8">
          <Link
            href="/"
            className="focus-ring inline-flex items-center gap-1.5 text-[13px] text-slate-strong transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} strokeWidth={1.75} />
            <span className="text-[19px] font-semibold leading-none tracking-[-0.035em] text-ink">
              Tèmi
            </span>
          </Link>
          <span className="tabular ml-auto hidden text-[10.5px] text-slate-soft sm:inline">
            Whitepaper v1.0 · cc3-testnet {creditcoinTestnet.id}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-5 pb-24 pt-10 sm:px-8 sm:pt-14">
        {/* ---------------- title block ---------------- */}
        <div className="mb-10 max-w-[64ch]">
          <p className="eyebrow mb-3">Whitepaper &amp; ASC audit</p>
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] text-ink sm:text-[44px]">
            Emergency micro-liquidity without a premium, an adjuster, or a bridge.
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-slate-strong">
            Tèmi lets a Nigerian SME hold an unencumbered reserve against the failure of the
            equipment their income depends on, prove physical damage with the phone already in
            their pocket, and be paid in the same block. This paper sets out the reserve model,
            the attestation that replaces the loss adjuster, the Attestcoin path that lets
            offshore capital back a Lagos merchant without a bridge — and what we have not solved.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[190px_1fr] lg:gap-14">
          {/* ---------------- contents ---------------- */}
          <nav className="lg:sticky lg:top-[72px] lg:self-start">
            <p className="eyebrow mb-2.5">Contents</p>
            <ol className="space-y-1.5">
              {CONTENTS.map(([n, label, id]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="focus-ring group flex gap-2 text-[12px] leading-snug text-slate-strong transition-colors hover:text-ink"
                  >
                    <span className="tabular shrink-0 text-slate-soft">{n}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="space-y-10">
            {/* ---------------------------------------------------- */}
            <Section id="problem" index="1" title="The problem">
              <P>
                Nigerian SMEs are chronically underinsured, and the usual explanation — that
                owners are short-termist or financially unsophisticated — does not survive
                contact with the arithmetic they face. A trader running a ₦450,000 generator is
                quoted an annual premium in the region of five per cent of replacement value.
                If nothing breaks, that money is gone. It does not accrue, it is not refunded,
                and it cannot be borrowed against.
              </P>
              <P>
                Against that, the same trader can simply hold the cash. Self-insurance dominates
                a commercial policy for any business whose expected annual loss is below the
                premium — which is most of them, most years. The failure is not that SMEs refuse
                to manage risk. It is that the product on offer is worse than the obvious
                alternative.
              </P>
              <P>
                What self-insurance cannot do is cover a loss larger than the reserve accumulated
                so far. A trader four months into saving cannot replace a generator that dies in
                month five. That gap — not the premium — is the real product opportunity.
              </P>
              <Claim>
                Tèmi keeps the dominant strategy intact and closes its one hole: your money stays
                yours, and a mutual buffer covers the shortfall when a loss arrives early.
              </Claim>
              <P>
                Three further frictions make conventional cover unattractive independently of
                price. Claim adjustment in the Nigerian commercial market routinely runs to
                months, which is irrelevant to a business whose generator is the reason it can
                open. Denial is discretionary and opaque. And the insurer&apos;s solvency is
                unauditable by the policyholder, who discovers whether the cover was real at
                precisely the moment it matters.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="reserve" index="2" title="The dual reserve">
              <P>
                Every deposit into <Mono>TemiVault</Mono> splits in a fixed ratio. Eighty-five per
                cent is credited to the depositor&apos;s Tier 1 personal vault. Fifteen per cent
                joins a shared Tier 2 mutual buffer.
              </P>
              <Code label="TemiVault._creditReserve">{`tier1Amount = (grossAmount * 8500) / 10000
tier2Amount = grossAmount - tier1Amount        // remainder, so no wei is stranded

reserves[operator].tier1PersonalBalance += tier1Amount
reserves[operator].lifetimeDeposits     += grossAmount
totalTier2PoolBalance                   += tier2Amount`}</Code>
              <P>
                Tier 1 is unencumbered. <Mono>withdrawTier1</Mono> has no lock-up, no notice
                period, no forfeiture and no discretionary gate — it is a balance, not a payment.
                This is the whole structural difference from insurance, and it is why the name is{' '}
                <em>Tèmi</em>: Yorùbá for <em>mine</em>.
              </P>
              <P>
                Tier 2 is the part that is genuinely mutual, and the only part a depositor gives
                up unilateral control of. Fifteen per cent is deliberately small: it is enough to
                cover early-cycle shortfalls across a pool, and small enough that a merchant
                comparing Tèmi to a coffee tin is not being asked to surrender much.
              </P>
              <H3>Why three funding rails converge on one accounting path</H3>
              <P>
                Capital arrives three ways — native tCTC, a Naira transfer settled by Trugi
                through PenguinSwap USD1, and cross-chain capital read in from Ethereum Sepolia
                by the Attestcoin precompile. All three call the same private{' '}
                <Mono>_creditReserve</Mono>. There is exactly one place in the contract where the
                85/15 split happens, which means there is exactly one place to audit it.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="invariant" index="3" title="Solvency invariant">
              <P>
                A settlement drains the claimant&apos;s own money first, then draws the shortfall
                from the mutual buffer subject to two independent caps.
              </P>
              <Code label="TemiVault.settleClaim">{`tier1Draw     = min(claimedLoss, tier1PersonalBalance)
remainingLoss = claimedLoss - tier1Draw

poolCap       = 10% × totalTier2PoolBalance          // pool solvency
lifetimeCap   = 3  × lifetimeDeposits                // anti-drain
allowance     = lifetimeCap - lifetimeTier2Drawn     // what is LEFT of that cap

tier2Draw     = min(remainingLoss, poolCap, allowance, totalTier2PoolBalance)
payout        = tier1Draw + tier2Draw

lifetimeTier2Drawn += tier2Draw                      // the cap has to accumulate`}</Code>
              <P>
                The pool cap bounds the damage any single claim can do to everyone else: no one
                event can remove more than a tenth of the buffer, so a cluster of correlated
                losses — a market fire, a flood down one street — degrades the pool gradually
                rather than emptying it.
              </P>
              <P>
                The lifetime cap bounds adverse selection. A merchant who deposits once and
                immediately claims can draw at most three times what they contributed, so the
                strategy of joining to extract is capped at 3× and requires capital up front. It
                also means the buffer&apos;s exposure to any member scales with that
                member&apos;s participation, which is the property that makes a mutual work.
              </P>
              <P>
                The cap is evaluated against a running total, <Mono>lifetimeTier2Drawn</Mono>,
                and not per claim. This matters more than it looks. Our first implementation
                applied the 3× bound to each settlement independently, and because settlement
                only deactivates the asset it settled, an operator could register any number of
                assets and collect the full allowance on every one. Simulated against a
                ₦40,000,000 buffer, a ₦250,000 deposit extracted 155× and left the pool at three
                per cent. The bound did not compose. It does now, and the regression test drives
                the real bytecode: nine of ten fraudulent claims revert once the allowance is
                spent.
              </P>
              <H3>Worked example</H3>
              <P>
                A trader has deposited ₦1,500,000 over six months: ₦1,275,000 in Tier 1, and
                ₦225,000 of their contribution now sits in a buffer that stands at ₦40,000,000
                across the pool. Their stall floods; they claim ₦2,000,000.
              </P>
              <Table
                head={['Step', 'Amount', 'Bound by']}
                rows={[
                  ['Tier 1 draw', '₦1,275,000', 'their own balance'],
                  ['Shortfall', '₦725,000', '—'],
                  ['Pool cap', '₦4,000,000', '10% of the buffer'],
                  ['Lifetime cap', '₦4,500,000', '3× contributions'],
                  ['Tier 2 draw', '₦725,000', 'neither cap binds'],
                  ['Payout', '₦2,000,000', 'settled in one block'],
                ]}
                caption="Both caps are slack here, which is the normal case. They bind on early claims and on outsized ones — exactly where a mutual is fragile."
              />
              <P>
                Had the same trader claimed in month one, with ₦250,000 deposited, the lifetime
                cap would hold their Tier 2 draw to ₦750,000 and their payout to ₦962,500. The
                cover grows with participation rather than being sold up front.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="optimistic" index="3b" title="Optimistic settlement">
              <P>
                A browser cannot prove where a sensor reading came from. That is not a bug in
                Tèmi&apos;s implementation, it is a property of the platform, and section 8 says
                so plainly. What a protocol can do is make forging one expensive and give
                somebody standing to object.
              </P>
              <P>
                The first question is what actually needs protecting. A Tier 1 draw is the
                claimant&apos;s own money — forging telemetry to reach it is pointless, because{' '}
                <Mono>withdrawTier1</Mono> already hands it over for free. The only thing worth
                attacking is the draw from the mutual buffer. So the challenge window is keyed to
                that, and not to the size of the claim.
              </P>
              <Claim>
                A merchant taking their own reserve back is never delayed, whatever the headline
                figure. Only other people&apos;s money waits.
              </Claim>
              <Code label="TemiVault.settleClaim">{`instantCap = 1% × totalTier2PoolBalance

tier2Draw <= instantCap   ->  paid in the same block, as before
tier2Draw >  instantCap   ->  tier1Draw paid immediately
                              tier2Draw escrowed for 24 hours
                              bond = 10% of the escrow, withheld from the payout`}</Code>
              <P>
                The bond is <em>withheld</em> rather than demanded. A merchant whose shop has just
                burned down should not have to find spare tCTC before they can file, so any part
                of the bond they do not send with the transaction is simply taken out of their own
                immediate payout and returned when the claim settles.
              </P>

              <H3>Both sides have to stake</H3>
              <P>
                Anyone may challenge an open claim by matching the bond. If an arbiter finds the
                claim fraudulent, the escrow returns to the buffer, the claimant forfeits their
                bond, and half of it goes to whoever caught it. If the challenge was wrong, the
                challenger&apos;s stake goes to the merchant they delayed.
              </P>
              <P>
                That symmetry is the point. Without a stake on the challenger&apos;s side, the
                window would be a free denial-of-service against honest merchants — exactly the
                people the product exists for.
              </P>
              <P>
                A rejected claim also restores what it consumed: the buffer is made whole, the
                asset returns to cover so an honest re-claim is still possible, and the
                operator&apos;s lifetime allowance is given back. Being wrongly accused should not
                cost a merchant their headroom.
              </P>
              <Table
                head={['Outcome', 'Claimant', 'Challenger', 'Mutual buffer']}
                rows={[
                  ['Unchallenged', 'escrow + bond returned', '—', 'unchanged'],
                  ['Challenge upheld', 'forfeits the bond', 'stake back + 50% of the bond', 'escrow returned + 50% of the bond'],
                  ['Challenge rejected', 'escrow + bond + the stake', 'loses the stake', 'unchanged'],
                ]}
                caption="Every branch is asserted in tests/challenge.test.mjs against the real bytecode, including that the contract's balance still covers Tier 1 plus the pool plus everything escrowed at each step."
              />
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="attestation" index="4" title="Physical attestation">
              <P>
                Removing the loss adjuster means something else has to establish that a physical
                thing was physically damaged, at the time of the claim, by the person claiming.
                Tèmi does this with the sensors already in the claimant&apos;s phone, computed
                entirely on-device. No video is uploaded, no frame reaches a server, and no cloud
                vision API is involved.
              </P>

              <H3>Gate 1 — handheld tremor</H3>
              <P>
                A phone held in a human hand is never still. Over the three-second sweep we take
                the population standard deviation of accelerometer magnitude.
              </P>
              <Code>{`σ = sqrt( Σ(|aᵢ| - ā)² / n )      where |a| = √(x² + y² + z²)

reject if σ < 0.01 m/s²           ERR_STATIC_DEVICE
on-chain: jitterVariance = round(σ × 10 000) ≥ 100`}</Code>
              <P>
                This is a cheap gate and it is not the interesting one, but it eliminates the
                laziest attack: propping the phone on a desk in front of a picture. Measured
                separation is roughly two orders of magnitude — a resting device reads σ ≈ 0.001,
                a handheld one σ ≈ 0.3.
              </P>

              <H3>Gate 2 — motion parallax</H3>
              <P>
                This is the gate a screen cannot pass. When a camera pans across a real
                three-dimensional scene, near objects sweep across the frame faster than far
                ones. When it pans across a flat surface — a photograph, a laptop displaying
                damage — the entire image translates by one uniform amount, because a
                plane&apos;s image motion under camera rotation is a single homography with no
                depth term.
              </P>
              <Claim>
                Depth disagreement between regions of the frame is the physical signature of a
                real scene. A display cannot produce it, whatever it is showing.
              </Claim>
              <P>
                We sample three WebP keyframes at t = 0, 1.5 and 3.0 s, downscale to 160×120
                greyscale, and split each into quadrants. Each quadrant is collapsed to a
                column-luminance profile — summing down columns turns a 2-D patch into a signal
                whose horizontal translation <em>is</em> the horizontal image motion, at a
                fraction of the cost of a full 2-D search. Profiles are mean-centred so a global
                exposure change cannot read as motion. We then find each quadrant&apos;s
                displacement by normalised cross-correlation, refined to sub-pixel by parabolic
                interpolation around the peak.
              </P>
              <Code label="Per transition">{`shiftᵢ, confᵢ = argmax NCC( profileᵢ(k), profileᵢ(k+1) )   for i in 4 quadrants

spread   = confidence-weighted stddev of shiftᵢ     ← the parallax signal
meanPan  = |confidence-weighted mean of shiftᵢ|
rotation = ∫|gyro| dt across the transition

structural = spread   / (spread + 0.45)
motion     = min(1, meanPan / 4)
gyro       = min(1, rotation / 8)

parallaxScore = 1000 × (0.55·structural + 0.25·motion + 0.20·gyro)
reject if parallaxScore < 850                       ERR_PARALLAX_REJECTED`}</Code>
              <P>
                Three terms, because each alone is defeatable. <em>Structural</em> is the
                parallax itself. <em>Motion</em> requires the camera to have actually panned — a
                still camera has no parallax to measure and must not score by default.{' '}
                <em>Gyro coupling</em> ties the image evidence to the IMU, so a video replayed on
                a monitor, which can supply image motion, cannot supply the physical rotation
                that must accompany it.
              </P>
              <P>
                Sub-pixel refinement is not a nicety. The discriminator is the <em>difference</em>{' '}
                between quadrant displacements, which for a genuine handheld sweep is often well
                under one pixel at this resolution.
              </P>
              <Table
                head={['Scene', 'Quadrant spread', 'Score', 'Outcome']}
                rows={[
                  ['Real 3-D, handheld pan', '2.05 px', '901', 'accepted'],
                  ['Flat screen / photograph', '0.003 px', '455', 'rejected'],
                  ['Video replayed on a screen', '0.005 px', '260', 'rejected'],
                  ['Static camera', '—', '9', 'rejected'],
                  ['Blank / undelivered frames', '—', '200', 'rejected'],
                ]}
                caption="Measured on synthetic scenes with known ground-truth depth structure, against the contract's 850 gate. Reproducible with npm test."
              />
              <P>
                There is also an explicit coplanarity rejection independent of the score: if the
                camera demonstrably panned (mean shift &gt; 2 px) while every quadrant agreed to
                within 0.35 px, the scene is provably planar and the claim is refused with a
                specific error rather than a low number.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="spatial" index="5" title="Spatial lock">
              <P>
                Movable machinery is identified by its serial plate:{' '}
                <Mono>assetId = keccak256(serialNumber)</Mono>. Because the registry is global, a
                plate binds to exactly one operator forever — the same generator cannot be
                registered twice.
              </P>
              <P>
                The plate is also checked <em>at claim time</em>, and this is what stops a
                merchant registering an expensive generator and later sweeping a broken
                lawnmower. The viewfinder carries an inner box; whatever sits inside it is
                cropped at full resolution three times around the sweep midpoint, binarised, and
                read by an OCR pass running entirely on the device. The resulting hash is passed
                to <Mono>settleClaim</Mono>, which requires it to equal the assetId for movable
                hardware. The Tesseract runtime is served from Tèmi&apos;s own origin rather than
                a CDN, so the claim path survives the bad connection a merchant is most likely to
                have during an emergency.
              </P>
              <Claim>
                Parallax proves the claimant is standing in front of something real. Only the
                serial plate proves it is theirs.
              </Claim>
              <P>
                Hash equality is unforgiving, and OCR of a stamped plate through a moving phone
                camera is not reliable enough to survive it naively — so the matcher is built
                around two observations. We never need to know the serial: it is enough to find{' '}
                <em>some</em> token in the OCR output whose hash equals the assetId, so every
                word on the plate is tokenised and tested and only one has to come through clean.
                And OCR errors on alphanumerics are overwhelmingly a small set of shape
                confusions — O/0, I/1/L, S/5, B/8, Z/2, G/6 — so each candidate is expanded
                across those substitutions, nearest-first. A clean read never pays for the
                variant search; a three-character misread still recovers. Adjacent words are
                joined up to five deep, because die-stamped runs are routinely split on every
                gap.
              </P>
              <P>
                None of this loosens the equality check. The search is over candidate readings,
                and the test each candidate must pass is still an exact keccak256 match against
                what was registered.
              </P>
              <P>
                Fixed property cannot use a plate, so it is bound to two things that are hard to
                move: its position and its electricity supply.
              </P>
              <Code>{`h3Index = latLngToCell(lat, lng, 10)          // ~12,300 m2 cell, ~150 m across
assetId = keccak256(abi.encodePacked(h3Index, meterNumber))

registration: GPS accuracy must be ≤ 100 m
claim time:   liveH3Cell == asset.h3CellIndex, enforced on-chain`}</Code>
              <P>
                Neither half is sufficient alone. Knowing a shop&apos;s prepaid DisCo meter number
                does not let you register it, because you must be standing in the hexagon.
                Standing in the hexagon does not let you register your neighbour&apos;s stall,
                because you need the meter on their wall.
              </P>
              <Claim>
                The raw coordinate never leaves the device. Only the hexagon is written on-chain
                — enough to prove someone is at their own stall, not enough to track them.
              </Claim>
              <P>
                Resolution 10 needs stating precisely, because it is easy to get wrong — and we
                did, initially. A resolution-10 cell is about <Mono>12,300 m²</Mono>, roughly 150 m
                across. The figure of 66 is the average <em>edge length in metres</em>, not an
                area, and an earlier draft of this paper repeated it as though a cell were the
                footprint of a single stall. It is not: a res-10 cell could hold on the order of a
                thousand of them.
              </P>
              <Claim>
                The spatial lock proves a claimant is at the premises, within about 150 m. It does
                not prove which stall they are standing in.
              </Claim>
              <P>
                That coarseness is nonetheless the right choice, for a reason unrelated to the one
                first given. Consumer GPS in a dense market drifts by tens of metres, and the
                registration ceiling already tolerates a ±100 m fix. A cell tight enough to isolate
                one stall — resolution 12, at ~250 m² and ~22 m across — would be smaller than the
                error bar on the measurement, and would refuse honest claims constantly. Precision
                the sensor cannot support is not security.
              </P>
              <P>
                What identifies the individual shop is the pairing: the asset id is{' '}
                <Mono>keccak256(h3Index, meterNumber)</Mono>, so the DisCo meter on the wall
                disambiguates units within a cell. That pairing is bound at registration and, with
                the global registry, cannot be claimed twice. The honest limit is that only the
                cell is re-checked at claim time — the meter is not — so the on-chain geofence is
                a premises-level check, not a stall-level one.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="attestcoin" index="6" title="Attestcoin readability">
              <P>
                Diaspora remitters, grant programmes and institutional backers hold capital on
                Ethereum, not on Creditcoin. Tèmi lets that capital back a Lagos merchant without
                a bridge, a wrapped asset, or a trusted relayer, by <em>reading</em> the offshore
                deposit rather than moving it.
              </P>
              <Code label="Cross-chain intake">{`Ethereum Sepolia                    Creditcoin cc3-testnet
────────────────                    ──────────────────────
TemiSourcePortal
  .fundReserveFor(operator)     →   attestors observe, reach quorum,
  emits ReserveFunded                post attestation on Creditcoin
                                              │
                                              ▼
                            TemiVault.verifyAndDeposit(proof, sepTxHash, amount)
                              1. 0x0FD2 verifyAndEmit(chainKey, height,
                                   txBytes, merkleProof, continuityProof)
                              2. EvmTxDecoder reads the proven receipt logs
                              3. require ReserveFunded from the trusted portal
                              4. credit 85% Tier 1 / 15% Tier 2`}</Code>
              <P>
                This is strictly within the protocol&apos;s <strong>readability</strong> scope.
                Creditcoin reads attested Ethereum state; nothing is ever written back to
                Sepolia, and reading attested state consumes no ATC — the caller pays only
                Creditcoin gas.
              </P>

              <H3>Decoding the attested payload</H3>
              <P>
                The proof builder attests to{' '}
                <Mono>abi.encode(uint8 txType, bytes[] chunks)</Mono> — the source transaction{' '}
                <em>and its receipt</em>. The chunk layout varies across EIP-2718 transaction
                types, but two positions are invariant: <Mono>chunks[0]</Mono> is always the
                common transaction fields and <Mono>chunks[last]</Mono> is always the receipt.{' '}
                <Mono>EvmTxDecoder</Mono> reads only those two, so one code path handles a legacy
                transaction and an EIP-7702 transaction identically, and a reverted source
                transaction is rejected even though it is perfectly provable.
              </P>

              <H3>The same path, used for live valuation</H3>
              <P>
                Attestcoin is not only an onboarding step in Tèmi. A cross-chain deposit arrives
                denominated in the source chain&apos;s asset, and crediting it 1:1 into a
                tCTC-denominated reserve would simply be wrong. So the vault prices it by reading
                Chainlink off Ethereum through the same precompile.
              </P>
              <Code label="TemiVault.submitPriceProof">{`0x0FD2 proves a Chainlink transmit tx was included in an attested block
      ↓
AnswerUpdated(int256 indexed current, uint256 indexed roundId, uint256 updatedAt)
      ↓
current and roundId are INDEXED, so:
  topics[1] = the price      (8 decimals)
  topics[2] = the round id
  data      = updatedAt      (source-chain time)
      ↓
answerWad = uint256(answer) * 1e10        // 8dp -> 18dp
require roundId > lastRoundId             // blocks a replayed favourable round
require now <= updatedAt + 6 hours        // backstop against a dead feed
require answer > 0                        // a Chainlink answer is signed`}</Code>
              <P>
                Three guards, doing different work. The monotonic round id is the one that
                matters: without it, anyone could resurrect a favourable historical round and
                submit it during a swing. The staleness window is an outer backstop for a feed
                that has stopped writing altogether, and it is deliberately loose — two latencies
                stack, since the Sepolia ETH/USD feed only writes roughly hourly and the attestor
                quorum trails Sepolia&apos;s head by around thirty-five blocks before a proof can
                be built at all. A tight window would make the feed unusable rather than safe.
              </P>
              <P>
                Refreshing the price is permissionless. Anyone can push a newer round, nobody can
                push an older one, and if the last observation goes stale the vault refuses to
                price a deposit rather than falling back to a guess. There is no privileged price
                setter to compromise. The one trusted input left is tCTC/USD, which stays a
                governance parameter because no attested CTC feed exists on any chain the
                cc3-testnet quorum covers — and the interface labels it as such rather than
                blending it in with the proven leg.
              </P>
              <Claim>
                Attestcoin stops being an onboarding step and becomes the contract&apos;s
                operational price source — no oracle operator, no bridge, no push.
              </Claim>

              <H3>Two properties that matter</H3>
              <P>
                <strong>The beneficiary is read out of the proof, never from calldata.</strong>{' '}
                <Mono>verifyAndDeposit</Mono> credits the operator named inside the attested{' '}
                <Mono>ReserveFunded</Mono> log. Any third party can therefore submit somebody
                else&apos;s proof — useful for relaying — without being able to redirect a single
                wei of it.
              </P>
              <P>
                <strong>Replay is blocked twice.</strong> Once on the Sepolia transaction hash,
                and once on <Mono>keccak256(txBytes)</Mono> — a commitment to the exact bytes the
                precompile verified. The second guard is the binding one: relabelling the hash
                achieves nothing, because the payload commitment is unchanged.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="audit" index="7" title="ASC audit & threat model">
              <P>
                What follows is our own adversarial review. It has not been through an external
                audit, and section 8 says so plainly.
              </P>
              <Table
                head={['Attack', 'Mitigation', 'Verified']}
                rows={[
                  [
                    'Forged inclusion proof',
                    'The 0x0FD2 precompile reverts on a bad Merkle or continuity proof before any accounting runs.',
                    'Yes — a tampered Merkle root reverts inside the precompile in the live test.',
                  ],
                  [
                    'Replaying a valid proof',
                    'Guards on both sepTxHash and keccak256(txBytes).',
                    'By construction; state written before the credit.',
                  ],
                  [
                    'Relayer redirecting funds',
                    'Beneficiary is read from the attested log, not from calldata.',
                    'By construction.',
                  ],
                  [
                    'Proving an unrelated Ethereum transaction',
                    'The log must come from the portal address this vault trusts for that chain key, with the right topic0 and topic count.',
                    'By construction.',
                  ],
                  [
                    'Crediting from a reverted source tx',
                    'EvmTxDecoder rejects any receipt whose status ≠ 1.',
                    'By construction.',
                  ],
                  [
                    'Claiming from a photograph or screen',
                    'Motion-parallax gate plus explicit coplanarity rejection.',
                    'Yes — 455 and 260 against an 850 gate.',
                  ],
                  [
                    'Phone propped on a desk',
                    'Tremor gate at σ ≥ 0.01.',
                    'Yes — two orders of magnitude of separation.',
                  ],
                  [
                    'Sweeping a different machine than the one registered',
                    'The claim sweep must read the serial plate; settleClaim requires keccak256(serial) == assetId for movable hardware.',
                    'Yes — bytecode test: a mismatched or omitted plate hash reverts with SerialPlateMismatch.',
                  ],
                  [
                    'Claiming a shop you are not at',
                    'Live H3 cell must equal the registered cell, checked on-chain.',
                    'By construction.',
                  ],
                  [
                    'Forged telemetry on a large mutual-buffer draw',
                    'Escrowed 24h with a 10% bond at risk; anyone may challenge and take half the forfeited bond.',
                    'Yes — bytecode test: every branch conserves value and the vault stays solvent throughout.',
                  ],
                  [
                    'Griefing honest merchants with spurious challenges',
                    'A challenge requires a matching stake, forfeited to the merchant if the challenge fails.',
                    'Yes — bytecode test: a wrong challenger ends down exactly their stake.',
                  ],
                  [
                    'Replaying a favourable historical price round',
                    'Round ids must strictly increase, and an observation older than 6h is refused outright.',
                    'Yes — bytecode test: resubmitting a round and submitting an earlier one both revert with NonMonotonicRound.',
                  ],
                  [
                    'Spoofing a price from another contract',
                    'The AnswerUpdated log must come from the aggregator registered for that chain key.',
                    'Yes — bytecode test: a log from an impostor address reverts with AnswerUpdatedLogNotFound.',
                  ],
                  [
                    'Compromised treasury repointing the source portal',
                    'setTrustedSourcePortal is write-once per chain key. There is no legitimate reason to change where a chain’s attested deposits originate.',
                    'Yes — bytecode test: a second write reverts with PortalAlreadyConfigured.',
                  ],
                  [
                    'Registering someone else’s asset',
                    'Global registry; a serial plate or (hexagon, meter) pair binds once, forever.',
                    'By construction.',
                  ],
                  [
                    'Draining the mutual buffer across many assets',
                    'The 3× bound accumulates in lifetimeTier2Drawn, so it holds across every claim an operator ever files, not just each one individually.',
                    'Yes — found in our own review, where the per-claim form allowed 155× extraction. Now covered by a bytecode-level regression test.',
                  ],
                  [
                    'Reentrancy on payout',
                    'Guard plus effects-before-interaction on both settleClaim and withdrawTier1.',
                    'By construction.',
                  ],
                  [
                    'Client-side threshold tampering',
                    'The client is untrusted. Every threshold is re-checked on-chain; a patched frontend can only produce a reverting transaction.',
                    'By construction.',
                  ],
                ]}
              />
              <P>
                The last row is the important one. The attestation engine runs in the
                claimant&apos;s browser, which they control completely. Tèmi does not assume
                otherwise: the browser&apos;s job is to <em>produce</em> telemetry, and the
                contract&apos;s job is to <em>gate</em> on it. A modified client can submit any
                numbers it likes and the contract will still refuse anything below the public
                constants.
              </P>
              <Claim>
                This bounds the attack rather than eliminating it. An attacker who can fabricate
                telemetry that passes the on-chain thresholds is not stopped by the contract —
                they are stopped, if at all, by the physics being expensive to fake.
              </Claim>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="limitations" index="8" title="Known limitations">
              <P>
                We would rather state these than have them found. Several are live research
                problems, not oversights we intend to quietly close before submission.
              </P>

              <H3>The telemetry is self-reported</H3>
              <P>
                A claimant who patches the client can submit <Mono>jitterVariance</Mono> and{' '}
                <Mono>parallaxScore</Mono> above the thresholds without ever pointing a camera at
                anything. Nothing in the current design prevents this, because nothing signs the
                sensor stream, and no amount of cryptography inside the page can fix it: a
                zero-knowledge proof would establish that the score was computed correctly, never
                that the inputs were real.
              </P>
              <P>
                So the defence is economic and procedural rather than cryptographic. Three things
                stack. The cumulative invariant caps total extraction at 3× what the attacker
                deposited, across their whole history. Anything drawing materially on the mutual
                buffer is escrowed for 24 hours with a bond at risk, so a forgery has to survive a
                period in which anyone can object to it and profit from being right. And the
                serial-plate gate requires the registered machine to be physically in frame.
              </P>
              <P>
                None of that makes forgery impossible. It makes it slow, capital-intensive,
                bounded, and observable — which is the most a web application can honestly claim.
                Closing the gap properly needs hardware attestation of the sensor pipeline —
                Android Play Integrity or iOS App Attest — signing the telemetry before it reaches
                the chain, which requires a native shell. That remains the single most valuable
                thing to build next.
              </P>

              <H3>A physical diorama defeats the parallax gate</H3>
              <P>
                The gate proves depth structure, not damage. An attacker who builds a real
                three-dimensional scene passes honestly, because the scene genuinely has depth.
                Both tracks now narrow this: fixed property by the spatial lock, movable hardware
                by the serial-plate check, which requires the registered machine to be physically
                in frame. What remains is that neither proves the machine is <em>damaged</em> —
                a merchant can sweep their own working generator, with its own plate, and claim.
                Damage assessment from a three-second handheld sweep is a genuinely open problem
                and we do not claim to have solved it; the invariant is what bounds the cost.
              </P>

              <H3>Thresholds are calibrated on synthetic scenes</H3>
              <P>
                The 850 gate and the 0.45 px coplanarity floor were tuned against synthetic
                scenes with known ground-truth depth and a limited number of real devices. Camera
                field of view, rolling-shutter behaviour and IMU noise floors vary widely across
                the handsets common in Lagos. Field calibration across a real device population
                is required before these numbers should be trusted, and we expect the false-
                rejection rate on low-end hardware to be the binding practical problem. Note also
                that the σ ≥ 0.01 tremor floor is close to the resting noise floor of some
                accelerometers, which makes it a weak gate on those devices.
              </P>

              <H3>The arbiter is a trusted party</H3>
              <P>
                A challenged claim is decided by a single <Mono>arbiter</Mono> address, set by the
                treasury. That is a real centralisation point: a corrupt arbiter could uphold
                every challenge and confiscate honest merchants&apos; bonds, or dismiss every
                challenge and let fraud through. The role is separable — <Mono>setArbiter</Mono>{' '}
                can hand it to a DAO or a dispute-resolution contract — but nothing more
                decentralised is wired up today. The bounded blast radius is that an arbiter can
                only touch claims that are actually under challenge, and never the instant path.
              </P>

              <H3>OCR will refuse some honest claims</H3>
              <P>
                The serial gate can only fail closed: if no candidate reading hashes to the
                assetId, the claim is refused. A corroded, painted-over or unlit plate, or one
                the merchant cannot physically get into frame alongside the damage, will block a
                legitimate claim. The tokenisation and confusion search widen the funnel
                substantially but cannot fix an illegible plate. A production system needs a
                fallback — most likely an attested photo escalating to human review — and it does
                not have one today.
              </P>

              <H3>Cell-boundary false negatives</H3>
              <P>
                The spatial lock still requires an exact cell match, and a merchant near a
                boundary can drift across it and be refused. We considered accepting the
                registered cell plus its six neighbours and rejected it: that trades a small
                convenience for a sevenfold increase in the area a shop could be claimed from,
                and it would be security spent on a user-interface problem.
              </P>
              <P>
                Instead the boundary is now visible. Before the sweep starts, a live watch reports
                whether the claimant is inside the registered cell, how many metres past its edge
                they are if not, and which way to walk — and the sweep is held until they are
                inside, so nobody spends three seconds filming a claim the contract would refuse.
                The distance quoted is to the cell <em>boundary</em>, not its centre: at this
                resolution someone standing legitimately inside their own cell can still be fifty
                metres from the middle of it, so centre distance would be alarming and useless.
              </P>
              <P>
                What this does not fix is a shop whose premises genuinely straddle two cells. That
                case still needs a registration flow that can bind more than one, and there is not
                one today.
              </P>

              <H3>Half the valuation is still a governance parameter</H3>
              <P>
                ETH/USD is now proven from Ethereum through the precompile, so the source leg of
                the conversion is trustless. The other leg — tCTC/USD — is set by the treasury,
                because no attested CTC/USD feed exists on Ethereum Sepolia or Ethereum Mainnet,
                the only chains the cc3-testnet quorum covers. A dishonest treasury could
                therefore still misprice cross-chain intake, bounded by the conduit float. The
                fix is a CTC feed on an attested chain; until then the parameter is surfaced
                separately in the UI so nobody mistakes it for a proven price.
              </P>

              <H3>The conduit float is a centralisation point</H3>
              <P>
                Sepolia ETH does not physically arrive on Creditcoin, so a cross-chain credit is
                honoured only while <Mono>conduitBackingAvailable</Mono> can back it. That float
                is funded by the treasury. It keeps the vault solvent — a credit is never issued
                that a later claim could not pay — but it means cross-chain intake is capacity-
                limited by a party the merchant must trust to keep it topped up.
              </P>

              <H3>Declared value is self-reported</H3>
              <P>
                Nothing checks that a generator declared at ₦450,000 is worth ₦450,000. Over-
                declaration is bounded by the same 3× lifetime cap rather than by any valuation
                mechanism.
              </P>

              <H3>No external audit, and a treasury role</H3>
              <P>
                <Mono>TemiVault</Mono> has not been formally audited. The treasury address can
                set the trusted source portal per chain key; a compromised treasury could point
                the vault at a portal it controls and mint reserve credit up to the available
                float. This should be a timelock or a multisig before any mainnet deployment.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <Section id="parameters" index="9" title="Parameters">
              <Table
                head={['Parameter', 'Value', 'Where enforced']}
                rows={[
                  ['Tier 1 split', '85%', 'TIER1_SPLIT_BPS = 8500'],
                  ['Tier 2 split', '15%', 'remainder'],
                  ['Per-claim pool cap', '10% of buffer', 'TIER2_DRAW_CAP_BPS = 1000'],
                  ['Per-claim lifetime cap', '3× deposits', 'LIFETIME_DEPOSIT_MULTIPLE = 3'],
                  ['Tremor floor', 'σ ≥ 0.01 m/s²', 'MIN_JITTER_VARIANCE = 100'],
                  ['Parallax floor', '850 / 1000', 'MIN_PARALLAX_SCORE = 850'],
                  ['Coplanarity rejection', '< 0.35 px spread', 'client, isCoplanar()'],
                  ['Sweep duration', '3.0 s, 3 keyframes', 'client'],
                  ['Serial plate match', 'keccak256(serial) == assetId', 'on-chain, movable only'],
                  ['OCR crop points', 't = 1.2, 1.5, 1.8 s', 'client, full resolution'],
                  ['GPS accuracy ceiling', '≤ 100 m', 'client, at registration'],
                  ['Spatial resolution', 'H3 res 10 (~12,300 m², ~150 m across)', 'on-chain exact match'],
                  ['Settlement chain', `cc3-testnet ${creditcoinTestnet.id}`, '—'],
                  ['Attestcoin source chain', 'Ethereum Sepolia, key 1', 'trustedSourcePortal, write-once'],
                  ['Challenge window', '24 hours', 'CHALLENGE_WINDOW'],
                  ['Instant settlement cap', '1% of the buffer', 'INSTANT_TIER2_CAP_BPS'],
                  ['Claim bond', '10% of the escrow', 'CLAIM_BOND_BPS'],
                  ['Challenger reward', '50% of a forfeited bond', 'CHALLENGER_REWARD_BPS'],
                  ['Oracle staleness window', '6 hours', 'MAX_ORACLE_STALENESS'],
                  ['Oracle scaling', '8dp → 18dp (×1e10)', 'ORACLE_SCALE_TO_WAD'],
                  ['Price feed', 'Chainlink ETH/USD, Sepolia', 'trustedPriceFeed, write-once'],
                  ['Verify precompile', ATTESTCOIN_VERIFIER_ADDRESS, '0x0FD2'],
                ]}
              />
              <P>
                Every constant above is public and readable on-chain. There is no privileged
                path that adjusts a threshold for an individual claim.
              </P>
            </Section>

            {/* ---------------------------------------------------- */}
            <div className="border-t border-hairline pt-8">
              <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-[46ch]">
                  <h2 className="text-[17px] font-semibold tracking-[-0.025em] text-ink">
                    Verify it rather than believe it
                  </h2>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-strong">
                    <Mono>npm test</Mono> runs the parallax and tremor maths against synthetic
                    ground truth, then exercises the Attestcoin path against the live proof
                    builder and the live precompile — including the forged-proof rejection.
                  </p>
                </div>
                <a
                  href={`${creditcoinTestnet.blockExplorers.default.url}/address/${ATTESTCOIN_VERIFIER_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-[3px] border border-hairline-strong px-4 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-[rgba(31,36,47,0.04)]"
                >
                  Verify precompile
                  <ArrowUpRight size={13} strokeWidth={1.75} />
                </a>
              </div>
            </div>
          </article>
        </div>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-6 sm:px-8">
          <span className="text-[15px] font-semibold tracking-[-0.03em] text-ink">Tèmi</span>
          <span className="text-[11px] text-slate-soft">“Mine” — Yorùbá</span>
          <Link href="/app" className="focus-ring text-[11.5px] text-ink underline underline-offset-2">
            Launch Merchant Vault
          </Link>
        </div>
      </footer>
    </div>
  );
}
