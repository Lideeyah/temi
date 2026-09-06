# Tèmi

**Tèmi** — *"Mine"* in Yorùbá — is a non-custodial, hardware-attested emergency micro-liquidity
platform for emerging-market SMEs, settled on **Creditcoin cc3-testnet** (chain ID `102031`).

A Lagos trader whose generator burns out does not need an insurance policy. They need their own
money back, today, without an adjuster. Tèmi replaces the sunk-cost premium with an
**unencumbered dual reserve**: 85% stays in a personal vault the operator can withdraw at any
moment, and 15% joins a mutual buffer that covers losses larger than any one operator saved for.

Claims are not adjudicated by a human. They are settled against physical evidence that the
operator's own phone produces and their own browser verifies.

---

## Attestcoin Protocol integration

Tèmi is an **Attestcoin Smart Contract (ASC)** operating strictly within the hackathon's
**readability** scope. Creditcoin attestors watch Ethereum Sepolia and reach quorum; `TemiVault`
then *reads* that attested state by verifying an inclusion proof through the on-chain Block
Prover. Nothing is ever written back to Sepolia, and reads consume no ATC.

```
Ethereum Sepolia                 Creditcoin cc3-testnet
────────────────                 ──────────────────────
TemiSourcePortal                 attestors reach quorum
  .fundReserveFor(operator)   →  post attestation
  emits ReserveFunded                     │
                                          ▼
                                 TemiVault.verifyAndDeposit(proof, sepTxHash, amount)
                                   ├─ 0x0FD2 verifyAndEmit()  ← Merkle + continuity proof
                                   ├─ EvmTxDecoder reads the proven receipt logs
                                   ├─ requires ReserveFunded from the trusted portal
                                   └─ credits 85% Tier 1 / 15% Tier 2
```

| Component | Value |
| --- | --- |
| Block Prover precompile | `0x0000000000000000000000000000000000000FD2` |
| Source chain | Ethereum Sepolia, **chain key `1`** |
| Proof builder | `https://prover.cc3-testnet.creditcoin.network` |
| Attestation lag | ~35–45 Sepolia blocks (~8 min) |

> cc3-testnet's attestor set covers chain keys `1` (Ethereum Sepolia) and `3` (Ethereum Mainnet)
> only — confirmed against the live prover, which rejects every other key. Base Sepolia is not
> provable here, so Tèmi's source portal targets Ethereum Sepolia.

### Why the beneficiary cannot be spoofed

`verifyAndDeposit` credits the operator named **inside the attested log**, never the caller. Any
relayer can therefore submit somebody else's proof without being able to redirect the funds.
Replay is blocked twice: once on the Sepolia transaction hash, and once on `keccak256(txBytes)`
— a commitment to the exact bytes the precompile verified, so relabelling the hash achieves
nothing.

### Decoding the attested payload

The proof builder attests to `abi.encode(uint8 txType, bytes[] chunks)` — the source transaction
*and its receipt*. Chunk layout varies across EIP-2718 types 0–4, but two positions are
invariant: `chunks[0]` is always the common transaction fields and `chunks[last]` is always the
receipt. `EvmTxDecoder` reads only those two, which makes it type-agnostic — a legacy
transaction and an EIP-7702 transaction take the identical code path.

---

## Hardware attestation

Two physical facts are measured on-device for every claim. Neither is checkable from a photo,
and no video, image or sensor trace ever leaves the phone.

**Gate 1 — tremor.** A phone held in a hand is never still. Tèmi takes the population standard
deviation of `|a| = √(x²+y²+z²)` across the three-second sweep. Below `σ = 0.01` the device is
resting on something, and the claim is refused before the camera is even consulted.

**Gate 2 — motion parallax.** When you pan across a real 3-D scene, near objects sweep the frame
faster than far ones. When you pan across a *flat* surface — a photograph, a laptop showing
damage — the whole image translates by one uniform amount, because a plane's image motion under
camera rotation is a single homography with no depth term.

So Tèmi measures per-quadrant horizontal displacement by normalised cross-correlation of column-
luminance profiles, refined to sub-pixel by parabolic interpolation, and looks at the **spread**
of the four displacements. Real scene: the quadrants disagree. Flat screen: they agree almost
exactly. That spread is then cross-checked against integrated gyroscope rotation, so a video
replayed on a monitor cannot supply the image half on its own.

Measured on synthetic scenes with known ground truth (`npm test`), against the contract's 850 gate:

| Scene | Quadrant spread | Score | Verdict |
| --- | --- | --- | --- |
| Real 3-D, handheld pan | 2.05 px | **901** | accepted |
| Flat screen / photograph | 0.003 px | **455** | `ERR_PARALLAX_REJECTED` |
| Video replayed on a screen | 0.005 px | **260** | `ERR_PARALLAX_REJECTED` |
| Static camera | — | **9** | `ERR_PARALLAX_REJECTED` |

**Spatial lock.** Commercial property carries a third gate: live GPS must resolve to the same
Uber H3 resolution-10 hexagon (~66 m²) the shop was registered in, with a fix no worse than
±100 m. Only the hexagon is written on-chain — the raw coordinate never leaves the device, which
is enough to prove someone is standing at their own stall and not enough to track them.

---

## Solvency invariant

```
tier1Draw = min(claimedLoss, tier1PersonalBalance)          // your own money drains first
tier2Draw = min(remainingLoss, 10% × tier2Pool, 3 × lifetimeDeposits, tier2Pool)
payout    = tier1Draw + tier2Draw
```

The mutual buffer is bounded twice — once for pool solvency, once against an operator draining
more than they ever contributed.

---

## Running it

```bash
npm install
npm run compile          # solc 0.8.28 → artifacts/ + typed ABIs in lib/abi/
npm test                 # parallax + tremor maths, then the live Attestcoin path
npm run dev
```

### Deploying

```bash
PRIVATE_KEY=0x... SEPOLIA_PRIVATE_KEY=0x... CONDUIT_FLOAT=2.0 npm run deploy
```

Deploys `TemiVault` to cc3-testnet and `TemiSourcePortal` to Ethereum Sepolia, registers the
portal as trusted for chain key 1, seeds the settlement float, and writes `.env.local`. Fund the
deployer at <https://faucet.creditcoin.org> first.

### Cross-chain deposit, end to end

1. On Ethereum Sepolia, call `TemiSourcePortal.fundReserveFor(yourCreditcoinAddress)` with value.
2. Wait ~8 minutes for the attestor quorum to cover that block (the UI polls and shows you how
   many blocks remain).
3. Paste the Sepolia transaction hash into **Deposit → Attestcoin**. Tèmi fetches the proof,
   dry-runs it through the precompile's `view` overload, then submits `verifyAndDeposit`.

---

## Verification

`npm test` runs against live infrastructure, not fixtures:

- `tests/parallax.test.mjs` — the parallax discriminator and tremor gate on synthetic scenes.
- `tests/attestcoin.test.mjs` — pulls a real attested Sepolia transaction, fetches a real proof,
  checks `EvmTxDecoder`'s chunk layout against Sepolia RPC ground truth, round-trips
  `encodeProofBundle`, calls the live `0x0FD2` precompile (returns `true`), and confirms a forged
  Merkle root reverts inside the precompile.

---

## Two surfaces

| Route | What it is |
| --- | --- |
| `/` | The public case. Hero, an interactive value-equation widget, the problem grid against Nigerian commercial insurance, and a live network telemetry strip. |
| `/app` | The merchant vault. Dual reserve, asset registry, the three-second sweep, and the Attestcoin telemetry console. |

The landing page's telemetry strip and the vault's console both read live cc3-testnet and proof-
builder state on an interval. Nothing is seeded — an undeployed vault renders zeroes.

## Architecture

```
contracts/
  TemiVault.sol            ASC: Attestcoin readability, dual reserve, settlement invariant
  TemiSourcePortal.sol     Ethereum Sepolia intake, emits ReserveFunded
  EvmTxDecoder.sol         decodes the USC v1 attested payload (type-agnostic)
  INativeQueryVerifier.sol precompile interface, verbatim from Blockscout
lib/
  SpatialSweepEngine.ts    IMU tremor + motion-parallax computer vision, all on-device
  H3SpatialLock.ts         high-accuracy GPS → H3 res-10 cell
  AttestcoinConduit.ts     proof-builder client + ABI packing
components/
  landing/                 public landing page: value equation + live telemetry strip
  BentoDashboard.tsx       reserve · incident · inventory · Attestcoin telemetry console
  SpatialSweepModal.tsx    viewfinder, oscilloscope, rejection banners, settlement receipt
  DepositModal.tsx         Attestcoin (Sepolia) · native tCTC · Trugi NGN virtual account
  RegisterAssetModal.tsx   serial-plate track · GPS + prepaid-meter track
  SensorOscilloscope.tsx   60Hz canvas trace of raw accelerometer magnitude
```

## Design

Tactile Paper & Cool Slate — warm paper canvas `#F4F1EA`, crisp white cards on hairline rules,
deep slate ink `#1F242F`, and desaturated accents: cool moss `#4A6B5D` for the mutual buffer,
ochre `#8C733E` for machinery, dusty rust `#8C4A4A` for claims and rejections, steel blue
`#4A627A` for the Attestcoin rail. Geist Sans for editorial labels, Geist Mono with tabular
figures for every financial metric, coordinate and hash. It should read as a premium physical
ledger, not a crypto dashboard.

## Notes on simulation

Everything on-chain is real: deposits, registrations, Attestcoin proof verification and claim
settlement are genuine cc3-testnet transactions. Two things are explicitly labelled simulations
in the UI — the Trugi NGN virtual-account webhook (which fires a real `depositReserve()`
transaction, standing in for a production NIBSS relayer) and the fiat off-ramp receipt shown
after settlement. The NGN figures throughout are a display conversion and are never used in
on-chain math.
