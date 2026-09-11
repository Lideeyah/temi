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

### Live valuation through the same precompile

Attestcoin is not just the onboarding rail. A cross-chain deposit arrives denominated in the
source chain's asset, so the vault prices it by *reading Chainlink off Ethereum* — proving a
`transmit` transaction's inclusion via `0x0FD2` and taking the price out of the resulting
`AnswerUpdated` log.

`current` and `roundId` are both indexed, so the price sits in `topics[1]`, not the data payload:

```
answerWad = uint256(topics[1]) * 1e10     // Chainlink 8dp -> vault 18dp
require roundId > lastRoundId             // blocks replaying a favourable historical round
require now <= updatedAt + 6 hours        // backstop against a dead feed
```

Refreshing is permissionless — anyone can push a newer round, nobody can push an older one — and
if the observation goes stale the vault refuses to price a deposit rather than guessing. The one
trusted input left is tCTC/USD, a governance parameter until an attested CTC feed exists, and the
UI labels it separately from the proven leg.

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

**Serial plate.** Movable machinery carries a third gate: the sweep must read the machine's
serial plate, and `settleClaim` requires `keccak256(serial) == assetId`. Parallax proves the
claimant is in front of something real; only the plate proves it is theirs. OCR runs on-device
against a full-resolution crop of the viewfinder's inner box, and because we only need *some*
token in the output to hash to the registered id, plate noise is free — with a nearest-first
expansion over O/0, I/1, S/5 shape confusions to absorb misreads without ever loosening the
equality check.

**Spatial lock.** Commercial property carries a third gate: live GPS must resolve to the same
Uber H3 resolution-10 hexagon the shop was registered in, with a fix no worse than ±100 m.

A res-10 cell is ~12,300 m², about 150 m across — not the 66 m² an earlier draft claimed, which
mistook the average *edge length in metres* for an area. The coarseness is still correct: consumer
GPS drifts by tens of metres, and a cell tight enough to isolate one stall (res 12, ~22 m across)
would be smaller than the error bar. The lock proves presence *at the premises*; the DisCo meter
number bound into the asset id is what identifies the unit.

Because the match is exact, a merchant near a cell edge can drift out and be refused. Rather than
widening the accepted area — which would multiply the impersonation surface by seven — the
boundary is made visible: a live watch reports whether you are inside, how many metres past the
*edge* you are, and which way to walk, and the sweep is held until you are back in. Only the hexagon is written on-chain — the raw coordinate never leaves the device, which
is enough to prove someone is standing at their own stall and not enough to track them.

---

## Opening an account

A merchant verifies their phone number, then chooses a 4-digit PIN. Those two things *are* the
vault — the account is derived, not generated, so the same number and PIN reproduce the same
address on any handset. Nothing to write down, nothing to lose, and no fingerprint sensor
required, which matters on the phones this product is actually for.

### Why the PIN is not salted with the phone number alone

The obvious derivation is `PBKDF2(PIN, salt = phone)`. It does not survive contact with an
attacker. A salt is public by design and a trader's number is on their shop sign, so the whole key
rests on four digits:

```
Exhausting the ENTIRE 4-digit PIN space against a known phone number
  candidates tried : 10,000
  wall clock       : 77.1 seconds   (single core, unoptimised)
```

Derive all 10,000 candidate addresses, find the funded one, drain it. So a second input is
required — a high-entropy share held server-side and released only after the number is verified:

```
privateKey = PBKDF2-SHA256(PIN, salt = serverShare ‖ phone ‖ "temi:cc3:vault", 600_000)
```

Neither half suffices. The server never receives the PIN and cannot derive a merchant's key even
from its own database; an attacker holding the phone number has nothing to grind against.

**What this does not fix:** someone with the unlocked handset can still try 10,000 PINs against
the local ciphertext — about 15 minutes. No KDF makes four digits strong. So the defence is the one
a SIM card uses: after 10 wrong PINs the local share is destroyed and the vault can only be reached
by re-verifying the number over SMS. Nothing is lost, because the key is derived rather than
stored.

In production the pepper belongs in an HSM, the codes go over real SMS, and rate limiting must
survive a restart. `lib/otpStore.ts` is explicit about being the demo-grade version of all three.



Biometric unlock is offered as an opt-in convenience on devices that have it, never as a
requirement. A second, deliberately quiet path connects an injected EVM wallet so a reviewer can
drive the same contracts from a funded account. All paths produce a viem wallet client and an
address, so everything downstream is one code path.

Not account abstraction: no smart account, no session keys, and sponsorship is a rate-limited drip
rather than a paymaster.

## Protocol revenue

No premium, so the protocol earns only on delivery:

| Stream | Rate | Charged on |
| --- | --- | --- |
| Mutual settlement fee | 1.5% | the **Tier 2 draw only** — never Tier 1 |
| Yield spread | 15% | yield only, never principal |
| Deposits / withdrawals / rejected claims | — | nothing |

The fee deliberately spares the Tier 1 draw. Charging it would contradict the guarantee the
product rests on — that your own reserve is unencumbered — and it would be arbitrageable, since
`withdrawTier1()` is free: anyone whose loss was covered by their own balance would withdraw
instead of claiming, bypassing the attestation pipeline for exactly the small repairs it should be
capturing.

```
Claimed loss                          ₦120,000
Tier 1 draw · own funds                ₦50,000   0% fee
Tier 2 draw · mutual buffer            ₦70,000
Mutual settlement fee · 1.5% of Tier 2  −₦1,050
Net dispatched                        ₦118,950
```

**Nothing is generating yield today.** `yieldStrategy` is `address(0)` and the UI says so.
Creditcoin exposes no staking precompile to the EVM, so a contract cannot nominate validators;
PenguinSwap is live on testnet but we could not verify a router or USD1 address on cc3-testnet.
The 85/15 accounting is built and tested behind a payable, permissionless `distributeYield()` —
the split is the part that has to be right, and it is the same wherever the yield comes from.

## Optimistic settlement

A browser cannot prove where a sensor reading came from, so large draws on *other people's*
money are not taken on trust. The window is keyed to the Tier 2 draw, not the claim size — a
merchant taking their own Tier 1 back is never delayed:

| Tier 2 draw | What happens |
| --- | --- |
| ≤ 1% of the buffer | settles in the same block |
| above that | Tier 1 paid immediately; the buffer's share escrowed 24h with a 10% bond |

Anyone may challenge by matching the bond. Challenge upheld: escrow returns to the buffer, the
claimant forfeits the bond, half goes to whoever caught it, and the asset returns to cover so an
honest re-claim is still possible. Challenge rejected: the challenger's stake goes to the merchant
they delayed — without that, the window would be a free denial-of-service against honest users.

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
npm test                 # bytecode-level vault tests, serial matcher, sensor maths,
                         # then the Attestcoin path against live infrastructure
npm run dev              # vendors the Tesseract runtime first, then serves
```

`npm run dev` and `npm run build` both run `vendor:ocr`, which copies the Tesseract worker and
WASM core out of `node_modules` and fetches the English model into `public/tesseract`. It is
gitignored — 16 MB of binaries do not belong in the repo — and reproduced automatically. Serving
it from our own origin is what lets a claim be filed on a bad connection.

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

- `tests/vault.test.mjs` — executes the compiled `TemiVault` bytecode in a local EVM: real
  storage, real reverts, real value transfers. Covers the 85/15 split, global asset identity,
  both attestation gates, the serial-plate gate, the spatial lock, unencumbered withdrawal,
  write-once portal configuration, vault solvency, and the multi-asset drain attack.
- `tests/challenge.test.mjs` — optimistic settlement end to end: instant vs escrowed paths, the
  window, both challenge outcomes, allowance and asset restoration on rejection, and a solvency
  assertion at every state transition.
- `tests/oracle.test.mjs` — the live-valuation path against the real bytecode, with a stub
  verifier standing in at `0x0FD2`: the indexed-topic decode checked against a genuine Sepolia
  log, 8→18 decimal scaling, monotonic rounds, the staleness backstop, and conversion.
- `tests/proximity.test.mjs` — spatial guidance geometry against real Lagos H3 cells, including
  the assertion that pins a res-10 cell at ~12,300 m².
- `tests/serial.test.mjs` — the serial matcher against real OCR failure modes.
- `tests/parallax.test.mjs` — the parallax discriminator and tremor gate on synthetic scenes.
- `tests/attestcoin.test.mjs` — pulls a real attested Sepolia transaction, fetches a real proof,
  checks `EvmTxDecoder`'s chunk layout against Sepolia RPC ground truth, round-trips
  `encodeProofBundle`, calls the live `0x0FD2` precompile (returns `true`), and confirms a forged
  Merkle root reverts inside the precompile.

---

## Deployed

| Contract | Chain | Address |
| --- | --- | --- |
| `TemiVault` | Creditcoin cc3-testnet (102031) | [`0x17766312…4272a2c`](https://creditcoin-testnet.blockscout.com/address/0x17766312c7300d01aed58174bc6ff39944272a2c) |
| `TemiSourcePortal` | Ethereum Sepolia (Attestcoin chain key 1) | [`0x81b78bc8…a66819c`](https://sepolia.etherscan.io/address/0x81b78bc835267408d851fae39a15e123ea66819c) |
| Block Prover precompile | Creditcoin runtime | [`0x…0FD2`](https://creditcoin-testnet.blockscout.com/address/0x0000000000000000000000000000000000000FD2) |
| Chainlink ETH/USD aggregator | Ethereum Sepolia | `0x719E22E3D4b690E5d96cCb40619180B5427F14AE` |

Both source-chain bindings are write-once and already set, so neither can be repointed.

### Live Attestcoin transactions

The readability path has been exercised end to end on the deployed contracts, in both of its roles:

| What | Transaction |
| --- | --- |
| **Live valuation** — a real Chainlink round read off Ethereum through `0x0FD2` and adopted as the vault's rate (round 35950, $2478.30, 356k gas) | [`0x01040a3c…c9e3534bb`](https://creditcoin-testnet.blockscout.com/tx/0x01040a3c6282eadf6c21e3b367e1083f7499e056c37bf4e2b3cc228c9e3534bb) |
| **Source deposit** — 0.001 ETH funded on Ethereum Sepolia, emitting `ReserveFunded` | [`0xa3081650…601c7174`](https://sepolia.etherscan.io/tx/0xa3081650daaea03f0a6c4186ff3827460b5224957a4b31bb124d1993601c7174) |
| **Cross-chain credit** — that Sepolia deposit proven and read into Creditcoin, priced at the proven rate, split 85/15 (319k gas) | [`0x2298335e…4e9994b1c`](https://creditcoin-testnet.blockscout.com/tx/0x2298335e7189d1fb203a5672a8bd3e4ad0f7f1ee7092f85632703c44e9994b1c) |

```
0.001 ETH on Sepolia
  -> attestor quorum reaches block 11,681,064   (~44 blocks, ~9 min)
  -> 0x0FD2 verifies inclusion + continuity
  -> priced at the proven ETH/USD of $2478.30 against tCTC/USD of $0.90
  -> credited 2.753666666666666666 tCTC
     tier 1  2.340616666666666666   (withdrawable)
     tier 2  0.413050000000000000   (mutual buffer)
```

## Regional adaptation

`TemiVault` is currency-agnostic — it moves 18-decimal base units and knows nothing about Naira,
Cedi or Shilling. Every fiat figure is a presentation layer resolved from the merchant's declared
jurisdiction, which is what lets one deployed contract serve four markets without a redeploy. No
conversion rate ever reaches the chain.

| Jurisdiction | Dialing | Currency | Rate per tCTC | Settlement rail |
| --- | --- | --- | --- | --- |
| Nigeria *(pilot)* | +234 | ₦ NGN | 1,450 | Trugi NIP Instant Transfer |
| Ghana | +233 | GH₵ GHS | 14.8 | MTN MoMo |
| Kenya | +254 | KSh KES | 128 | M-Pesa Express |
| Global | +1 / injected | $ USD1 | 1.0 | Attestcoin cross-chain |

The rails differ because the payment infrastructure genuinely differs — Nigeria runs on instant
bank transfer, Ghana and Kenya on mobile money. Selecting a jurisdiction propagates to the currency
toggle, every balance, the sizing card, the funding modal and the settlement receipt. Jurisdictions
we have not operated in say so on the selector rather than implying a live pilot.

Onboarding is three stages: **identity** (jurisdiction, trading entity, mobile number in E.164,
then passkey provisioning), **reserve sizing**, then **funding** on the region's own rail. Each
local rail carries a simulate control, because a judge has no Nigerian bank account, no MTN wallet
and no M-Pesa line — without it the local rail is a dead end for exactly the people assessing it.

## The zero state

A merchant with no vault has nothing to look at — every balance is zero and every tile is a row
of dashes. Rather than showing them that and asking them to commit first, the uninitialised
dashboard is replaced by the one thing they can act on without an account: sizing their own
reserve. They pick machinery or property, type what it is worth, and see the target, the monthly
contribution and the 85/15 split before anything is signed. Those numbers carry into funding.

`useVault` skips every per-operator read when there is no operator, so an unauthenticated visitor
costs one `protocolTelemetry` call and a block number rather than a dozen `eth_call`s against the
zero address on every poll. The live network console stays visible throughout — it is the part
that proves the protocol is real, and it does not depend on the visitor having an account.

The dashboard flips to the live ledger once `lifetimeDeposits > 0 || assets.length > 0` — the
honest on-chain signal that a merchant has actually started.

There is no telemetry sidebar. Every protocol figure lives where it is relevant rather than in a
column competing with the product: the precompile address and attested Sepolia height sit behind
the network badge in the header, cross-chain proof count and read cost appear in the Attestcoin
deposit tab when cross-chain money is actually moving, the tremor and parallax thresholds are read
out live on the sweep viewfinder beside the reticle, the settlement fee is itemised on the receipt,
and the proven ETH/USD rate sits on the line that converts Naira into tCTC. One hairline footer
carries the chain, the precompile and the spatial resolution permanently.

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
  SerialPlateReader.ts     on-device OCR + hash-matching of the serial plate
  AttestcoinConduit.ts     proof-builder client + ABI packing
  ChainlinkOracle.ts       finds a provable price round and packs it for submitPriceProof
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
