# Tèmi Protocol (`cc3-testnet`)

> **Autonomous micro-liquidity clearinghouse & real-world asset underwriting engine built on Creditcoin CC3.**

**Live Demo:** [https://temi-vault.vercel.app/](https://temi-vault.vercel.app/)
**Execution Layer:** Creditcoin CC3 Testnet (`Chain ID: 102031`)
**Core Precompile:** Attestcoin Native Query Verifier (`0x0FD2`)
**License:** MIT

---

## 01. System Thesis

Informal MSMEs across emerging markets power over 80% of regional employment and trade, yet they remain structurally uninsurable and credit-invisible. When a commercial generator fails, a milling machine breaks, or a market fire occurs, years of working capital vanish overnight.

Traditional commercial insurance fails these enterprises:
1. **Drains Liquidity:** Converts critical cash reserves into dead, sunk corporate premiums.
2. **Weaponizes Latency:** Imposes predatory 8–12 week manual loss adjustments that shutter active stalls.
3. **Ignores Productive Assets:** Relies on nonexistent paper credit records rather than verified physical capital.

**Tèmi inverts this paradigm.**

Instead of extracting non-refundable premiums, Tèmi deploys an autonomous **85/15 dual-reserve vault**. 85% of capital remains unencumbered on the merchant's balance sheet, while an automated 15% mutual pool resolves verified catastrophic overages in seconds.

Crucially, Tèmi is designed as **Creditcoin's real-world underwriting rail**. By capturing daily fiat reserve velocity, client-side OCR hardware anchors, and spatial-telemetry claims, Tèmi transforms informal businesses into verified onchain borrowers — unlocking under-collateralized lending without paper credit bureaus.

```
+-----------------------------------------------------------------------+
|                        MERCHANT BALANCE SHEET                         |
|                                                                       |
|  +------------------------------------+  +-----------------------+    |
|  | 85% Tier 1 Personal Reserve        |  | 15% Mutual Buffer     |    |
|  | • 100% liquid, withdrawable at 0%  |  | • Pooled communal pool|    |
|  | • Non-custodial merchant asset     |  | • Catastrophic payout |    |
|  | • First line of emergency defense  |  | • 1.5% fee, this tier |    |
|  +------------------------------------+  +-----------------------+    |
+-----------------------------------------------------------------------+
              |
              +-------------------------+-------------------------+
              |                                                   |
              v                                                   v
   [Hardware Claim Settlement]                      [Proof of Business Health]
   • OCR serial hash bound                          • Reserve velocity audit
   • Tremor variance (σ ≥ 0.01)                     • Spatial stability record
   • 3D parallax depth (≥ 850/1000)                 • Creditcoin micro-lending
   • H3 cell check (res 10)                         • Collateral-free underwriting
```

---

## 02. Protocol Deployments & Parameters

| Component | Network / Environment | Identifier / Address |
| :--- | :--- | :--- |
| **Execution Layer** | Creditcoin CC3 Testnet | Chain ID `102031` |
| **RPC Endpoint** | CC3 Testnet EVM | `https://rpc.cc3-testnet.creditcoin.network` |
| **`TemiVault`** | CC3 Testnet | [`0x17766312c7300d01aed58174bc6ff39944272a2c`](https://creditcoin-testnet.blockscout.com/address/0x17766312c7300d01aed58174bc6ff39944272a2c) |
| **`TemiSourcePortal`** | Ethereum Sepolia | [`0x81b78bc835267408d851fae39a15e123ea66819c`](https://sepolia.etherscan.io/address/0x81b78bc835267408d851fae39a15e123ea66819c) |
| **State Prover** | Attestcoin precompile | `0x0000000000000000000000000000000000000FD2` |
| **Proof Builder** | Attestcoin attestor API | `https://prover.cc3-testnet.creditcoin.network` |
| **Attested Source Chains** | Attestcoin chain keys | `1` = Ethereum Sepolia · `3` = Ethereum Mainnet |
| **Price Oracle** | Chainlink ETH/USD on Sepolia | `0x694AA1769357215DE4FAC081bf1f309aDC325306` |
| **Fiat Custody Rail** | Trugi NIP · Providus NUBAN | Per-merchant dedicated virtual account, sandbox counterparty |
| **Rail Endpoints** | Next.js route handlers | `/api/trugi/account` · `/api/trugi/webhook` |

### On-chain economic constants

Every figure below is a `public constant` on the deployed `TemiVault` and can be read directly from the contract.

| Constant | Value | Meaning |
| :--- | :--- | :--- |
| `TIER1_SPLIT_BPS` | `8500` | 85% of every deposit stays the merchant's |
| `PROTOCOL_SETTLEMENT_FEE_BPS` | `150` | 1.5%, charged **on the mutual draw only** |
| `TIER2_DRAW_CAP_BPS` | `1000` | a single claim may draw at most 10% of the pool |
| `INSTANT_TIER2_CAP_BPS` | `100` | mutual draws ≤ 1% of the pool settle in the same block |
| `CLAIM_BOND_BPS` | `1000` | 10% bond on escrowed claims, withheld from payout if unfunded |
| `LIFETIME_DEPOSIT_MULTIPLE` | `3` | cumulative mutual draws capped at 3× lifetime deposits |
| `CHALLENGE_WINDOW` | `24 hours` | escrow period for claims above the instant cap |
| `MIN_JITTER_VARIANCE` | `100` | σ ≥ 0.01, scaled by 10,000 |
| `MIN_PARALLAX_SCORE` | `850` | out of 1000 |
| `MAX_ORACLE_STALENESS` | `6 hours` | a price round older than this is refused |

---

## 03. Cryptographic & Operational Architecture

### 3.1 Zero-Friction Deterministic Key Derivation

To onboard non-crypto-native merchants without seed phrases or gas friction, accounts are derived client-side via high-iteration PBKDF2:

```
privateKey = PBKDF2-SHA256(
    password = PIN,
    salt     = serverKeyShare ‖ phoneE164 ‖ "temi:cc3:vault",
    rounds   = 600,000,
    length   = 256 bits
)
```

**The server key share is load-bearing, not incidental.** A salt is not a secret and a trader's phone number is printed on their shop sign — deriving from the PIN and phone alone leaves the entire key resting on four digits. Exhausting all 10,000 candidates was measured at **77.1 seconds on a single core**. The salt therefore includes a 512-bit share held server-side and released only after the merchant proves control of the number by OTP:

```
serverKeyShare = HMAC-SHA512(pepper, "share:" ‖ phoneE164)
```

Neither half is sufficient. The service never sees the PIN, so it cannot derive a merchant's key even from its own database. An attacker holding the phone number has nothing to grind against.

* **Deterministic Recovery:** the same number and PIN reconstruct the identical non-custodial vault on any handset. Verified across Node and browser to the same address.
* **Chain-Verified Sign-In:** signing in derives the key, looks the address up on cc3-testnet, and only writes to the device once a vault is found there — so a mistyped PIN reports *"no vault for this number with that PIN"* instead of silently creating an empty one.
* **Automated Gas Grant:** a `0.05 tCTC` sponsorship is dispatched to the derived address on vault creation, so the merchant transacts without ever buying a token.
* **Local Attempt Limit:** 10 wrong PINs wipe the device's stored share. The vault is unaffected; the number and PIN restore it elsewhere.

### 3.2 State Verification via the Attestcoin Precompile (`0x0FD2`)

Tèmi reads cross-chain state through Creditcoin's Native Query Verifier precompile. Capital deposited on Ethereum Sepolia is *read* into Creditcoin — attestors watch the source chain, reach quorum, and post an attestation; the vault then verifies the transaction's inclusion and credits the operator named inside the attested log. **Nothing is written back to Sepolia**, which is the readability-only scope this integration targets.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {INativeQueryVerifier} from "./INativeQueryVerifier.sol";

contract TemiVault {
    INativeQueryVerifier public constant ATTESTCOIN_VERIFIER =
        INativeQueryVerifier(0x0000000000000000000000000000000000000FD2);

    uint32 public constant CHAIN_KEY_ETHEREUM_SEPOLIA = 1;

    error ProofRejected();

    /// Verifies a source-chain transaction's inclusion, then credits the operator
    /// named inside the attested ReserveFunded log.
    function verifyAndDeposit(bytes calldata bundle) external {
        (
            uint32 chainKey,
            uint64 height,
            bytes memory txBytes,
            INativeQueryVerifier.MerkleProof memory merkleProof,
            INativeQueryVerifier.ContinuityProof memory continuityProof
        ) = _decodeBundle(bundle);

        // Reverts inside the precompile on a forged root or a broken continuity chain.
        ATTESTCOIN_VERIFIER.verifyAndEmit(chainKey, height, txBytes, merkleProof, continuityProof);
        // ... decode the receipt, credit the beneficiary, split 85/15
    }
}
```

The same precompile proves the **Chainlink ETH/USD round** used for valuation: the round's `AnswerUpdated` log is proven from Sepolia, the answer recovered from `topics[1]`, scaled from 8 to 18 decimals, and refused if older than six hours.

> Verified live, not mocked. The test suite locates a real attested Sepolia transaction, fetches its proof from the attestor API, confirms `0x0FD2` accepts it, and confirms **`0x0FD2` reverts on a forged merkle root**.

### 3.3 The Trugi NIP Settlement Rail

A Nigerian merchant funds a vault by bank transfer, not by holding a token. The rail that makes that possible is a **dedicated virtual account**: the merchant is issued a NUBAN of their own, money sent to it credits them specifically, and the provider posts a signed notification the moment it lands.

**Accounts are issued, not written.** Each is derived from the merchant's own address, so the same merchant always receives the same number — a dedicated account that moved between visits would not be dedicated, and money sent to yesterday's number would have nowhere to land. Every account carries a valid **CBN NUBAN check digit**, computed with the standard 3-7-3 weighting over the institution code and nine-digit serial:

```
accountNumber = serial(9) ‖ checkDigit
checkDigit    = (10 − (Σ digitᵢ × weightᵢ mod 10)) mod 10
weights       = 3,7,3, 3,7,3, 3,7,3, 3,7,3   over bankCode(3) ‖ serial(9)
```

A number without one is a string that looks like an account and fails validation in any system that checks — including the provider that will eventually replace this.

**Credits arrive as signed webhooks.** `POST /api/trugi/webhook` verifies an HMAC-SHA512 signature over the raw request bytes *before anything moves*, confirms the account belongs to the beneficiary named in the notification, and refuses a reference that has already settled. Payment providers retry until they receive a `200`, so the idempotent path is exercised in normal operation, not only under attack. Amounts travel in **kobo**, as they do on the wire.

```
merchant transfer → provider → signed webhook → verify → settle → depositReserve → 85/15
```

> **What is simulated, stated plainly.** The counterparty. No licensed provider stands behind this, no naira moves, and the credit notification is generated by the sandbox rather than by a bank — that requires a payment licence and a signed partner agreement, which is not a thing code produces. **Every surface that displays an account prints its mode**, so nothing reads as provisioned infrastructure. The sandbox trigger does not shortcut into the handler: it signs a notification server-side and posts it over HTTP to the same webhook a live provider will call.
>
> Swapping in Paystack, Monnify, Flutterwave or Trugi proper means replacing `provisionAccount` with their create-virtual-account call and pointing their webhook at the route that already exists. Verification, idempotency, settlement and the on-chain deposit are unchanged.

### 3.4 Three-Gate Edge Sensor Fraud Defense

Claims bypass subjective human loss adjusters through deterministic hardware telemetry, validated on-chain before any payout executes.

* **OCR Hardware Anchor.** Stamped manufacturer serial plates are read on-device via Tesseract WASM inside a fixed reticle, and the asset is bound to the hash of the string the camera actually read:

  ```
  movable machinery   assetId = keccak256(serialNumber)
  commercial property assetId = keccak256(h3Index ‖ prepaidMeterNumber)
  ```

  Registration **requires a capture** — the serial field is disabled until the plate has been photographed and read. A serial typed from memory would hash to something no future claim could ever match, and the merchant would be locked out of their own asset with nothing on screen to explain it.

* **Micro-Tremor Telemetry.** Asserts natural hand micro-oscillation (`σ ≥ 0.01`) from the device accelerometer at 60 Hz, defeating a static mount. Measured: a resting device reads `0.00141`; a genuine handheld sweep reads `0.276`.

* **3D Parallax Vector Field.** Per-quadrant column-luminance cross-correlation with sub-pixel parabolic refinement. The *spread* of disparity across quadrants separates a real 3D scene from a flat plane. Measured: real scene `901`, flat screen `455`, replayed video `260`, static camera `9`. Threshold `850`.

* **Spatial Cell Enforcement.** Uber H3 **resolution 10** — roughly 12,291 m², about **150 m across** — with a hard `±100 m` GPS accuracy ceiling, because a weaker fix cannot reliably place a claimant inside their own cell. Only the cell index reaches the chain; raw coordinates never leave the device.

**Evaluator mode.** Hardware without an accelerometer *fails these gates by construction*, and that refusal is the strongest evidence the gates work. After a genuine failure — and only then — the interface offers to replay a handheld sensor trace so a reviewer can walk the rest of the flow. The camera stays real; the receipt states `Sensor telemetry: replayed, not measured`.

---

## 04. Sustainable Commercial Engine & Unit Economics

```
[Incoming Fiat / NGN]
         |
         v
+------------------+     0.40% gateway margin            [DESIGNED]
| Trugi Fiat Rail  | ------------------------------------> [Tèmi Treasury]
+------------------+
         |
         v
+------------------+     0.00% draw fee (100% unencumbered)   [LIVE]
| 85% Tier 1 Vault | ------------------------------------> [Merchant Liquid Cash]
+------------------+
         |
         +-------------> [Creditcoin Underwriting Registry]  [DESIGNED]
                                   |
                                   | 0.75% B2B referral bounty
                                   v
                         [Institutional Lenders]
                                   |
                                   v
+------------------+     1.50% settlement fee (mutual draw)   [LIVE]
| 15% Mutual Pool  | ------------------------------------> [Protocol Clearing Margin]
+------------------+
```

### Live on-chain today

* **Personal Tier 1 Reserve (85%)** — `0.00%` withdrawal fee, no lock-up, no notice period, no forfeiture. Enforced by `withdrawTier1`.
* **Mutual Buffer Settlement (15%)** — `1.50%` performance fee applied **strictly** to the portion of a claim that draws from the communal pool. A loss covered entirely by the merchant's own Tier 1 costs them nothing. This is the two-line invariant that separates a reserve from a premium, and it is enforced in `_disburseClaim`.
* **Protocol Yield Share** — `YIELD_PROTOCOL_SHARE_BPS = 1500`. The engine exists and distributes by O(1) cumulative index, **but `yieldStrategy` is `address(0)` on this deployment**: Creditcoin cc3-testnet exposes no staking precompile to the EVM, so no yield is claimed, quoted, or earned. The interface says "none connected" rather than advertising an APY nobody received.

### Designed, not yet implemented

The two revenue lines below are part of the economic architecture and are **not** in the deployed contract. They are stated here as roadmap, not as live behaviour.

* **Fiat Rail Gateway Spread** — `0.40%` margin on virtual-account deposit and payout routing via Trugi NGN rails.
* **B2B Underwriting Bounty** — `0.75%` origination referral paid by micro-lenders on Creditcoin when consuming Tèmi's verified business-health telemetry.

### Pan-African Distribution Horizon

The app ships four jurisdictions today. Nigeria is piloted; the others are wired and labelled *configured but not yet piloted* in the interface itself.

* **Phase 1 · Nigeria (live).** Distribution through organized trade associations and market cooperative unions. NGN settlement via Trugi NIP and Providus Bank dedicated virtual accounts. Rate ₦1,450/tCTC.
* **Phase 2 · Ghana (configured).** Merchant trade associations (GUTA) over MTN MoMo and Zeepay. GH₵ rails present in `lib/regions.ts`.
* **Phase 3 · Kenya (configured).** Cooperative onboarding via Chamas over M-PESA B2C/C2B through the Daraja API. KSh rails present.
* **Global (configured).** Attestcoin cross-chain direct, for merchants outside the fiat rails.
* **Cross-Border Hedging.** Regional pool volatility rebalanced through PenguinSwap USD1 liquidity pairs. *No verifiable cc3-testnet router exists yet; this leg is designed and named in the interface, not executed on-chain.*

---

## 05. Codebase Layout

```
.
├── contracts/
│   ├── TemiVault.sol              # 85/15 dual-reserve accounting, claims, challenge window,
│   │                              #   revenue, and the 0x0FD2 cross-chain read path
│   ├── TemiSourcePortal.sol       # Ethereum Sepolia ingress — emits ReserveFunded(operator)
│   ├── INativeQueryVerifier.sol   # Attestcoin precompile interface (0x0FD2)
│   └── EvmTxDecoder.sol           # EIP-2718 tx/receipt decoding for attested payloads
├── app/
│   ├── page.tsx                   # Landing page
│   ├── app/page.tsx               # Merchant vault
│   ├── whitepaper/page.tsx        # Protocol whitepaper
│   └── api/
│       ├── otp/{request,verify}/  # Phone verification + server key-share release
│       ├── trugi/account/         # Issue a merchant's dedicated NUBAN
│       ├── trugi/webhook/         # Signed credit notification → settlement
│       ├── trugi/simulate/        # Sandbox: signs a credit and posts it to the webhook
│       ├── relayer/               # Legacy direct settlement path
│       └── sponsor/               # 0.05 tCTC gas grant
├── components/
│   ├── ui/Primitives.tsx          # The entire design system — no control is defined elsewhere
│   ├── landing/                   # Landing sections
│   ├── whitepaper/                # Whitepaper sections
│   ├── BentoDashboard.tsx         # Merchant dashboard shell
│   ├── VaultSetup.tsx             # Sign in / create, reserve sizing, funding
│   ├── DepositModal.tsx           # Trugi NGN · Native tCTC · Attestcoin rails
│   ├── RegisterAssetModal.tsx     # Track A serial plate · Track B H3 + meter
│   ├── SpatialSweepModal.tsx      # Three-second sweep, gates, settlement receipt
│   └── PendingClaimsCard.tsx      # Challenge-window finalisation
├── lib/
│   ├── MerchantIdentity.ts        # PBKDF2 600k derivation, PIN check, biometric PRF sealing
│   ├── otpStore.ts                # Derived OTP codes + HMAC-SHA512 server key share
│   ├── SpatialSweepEngine.ts      # Tremor variance + parallax scoring
│   ├── SerialPlateReader.ts       # Reticle crop, binarisation, Tesseract, confusion-set match
│   ├── H3SpatialLock.ts           # Resolution-10 cell resolution and proximity
│   ├── AttestcoinConduit.ts       # Proof fetch, attested height, bundle encoding
│   ├── ChainlinkOracle.ts         # Proven ETH/USD round, 8→18 decimal scaling
│   ├── TrugiRail.ts               # NUBAN issuance with CBN check digit, webhook signing
│   ├── regions.ts                 # NG · GH · KE · GLOBAL rails, currency, phone plans
│   └── abi/                       # Generated ABIs
├── hooks/
│   ├── useMerchantAccount.ts      # Phone+PIN and injected-wallet paths behind one interface
│   └── useVault.ts                # On-chain reads, claims, telemetry, oracle
├── tests/                         # 15 suites, 295 assertions, Node + ethereumjs EVM (Cancun)
│   ├── vault.test.mjs             # Solvency invariants against real deployed bytecode
│   ├── challenge.test.mjs         # Escrow, bond, challenge, finalisation
│   ├── revenue.test.mjs           # Fee charged on the Tier 2 draw only
│   ├── attestcoin.test.mjs        # Live Sepolia proof → 0x0FD2 accept + forged-root reject
│   ├── oracle.test.mjs            # Live provable Chainlink round
│   ├── identity.test.mjs          # PBKDF2 recovery, collision, server-share dependence
│   ├── signin.test.mjs            # Right PIN opens the vault; wrong PIN finds nothing
│   ├── parallax.test.mjs          # 3D vs flat vs replay vs static discrimination
│   ├── serial.test.mjs            # OCR confusion sets, bounded search
│   ├── proximity.test.mjs         # H3 cell geometry and boundary distance
│   ├── signer.test.mjs            # Every writeContract signs locally, not via the node
│   ├── trugi.test.mjs             # NUBAN validity, signature rejection, tamper detection
│   ├── phone.test.mjs             # Exact national length in all four jurisdictions
│   ├── otp.test.mjs               # Verification across two separate processes
│   ├── deploy-preflight.test.mjs  # Constructor, write-once, recoverable float
│   └── evm-harness.mjs            # Cancun EVM harness over deployed bytecode
└── scripts/
    ├── compile.mjs · gen-abi.mjs  # solc 0.8.28 → ABIs
    ├── deploy.mjs · deploy-portal.mjs
    ├── check-drift.mjs            # Deployed selectors vs source ABI
    └── live-attestcoin.mjs        # End-to-end Sepolia → CC3 proof run
```

> **Toolchain note:** this repository does **not** use Foundry. Contracts compile with `solc 0.8.28` via `scripts/compile.mjs`, and the invariant suite executes **real deployed bytecode** on an `ethereumjs` EVM pinned to the **Cancun** hardfork — chosen because solc 0.8.28 emits `MCOPY`, and an earlier hardfork silently turns genuine reverts into `invalid opcode`, which made several assertions pass for the wrong reason.

---

## 06. Live Demo & Evaluator Quickstart

Judges and evaluators do not need to configure environment variables, clone the repository, or pre-fund a wallet.

**Live application:** [https://temi-vault.vercel.app/](https://temi-vault.vercel.app/)

### Zero-friction walkthrough

1. **Launch.** Visit [temi-vault.vercel.app](https://temi-vault.vercel.app/) and open **Access Merchant Vault**. Choose **"No, this is my first"**.

2. **Deterministic onboarding.** Pick a jurisdiction, enter a mobile number (exactly 10 digits after `+234`), and request a code. **No SMS is sent — the demo code is `123456`**, shown on screen, so ownership can be proved without SMS credit in four jurisdictions. Name the business, then set and confirm a 4-digit PIN. The vault address is derived in the browser at 600,000 PBKDF2 rounds. No extension, no seed phrase.

3. **Automated gas provisioning.** A `0.05 tCTC` grant is dispatched to the derived address, so the first transaction costs the merchant nothing.

4. **Interactive flows.**
   * **Vault ingress** — size a reserve (30% of declared value for machinery, 20% for property) over a **1–24 month** horizon, then fund it. The deposit modal opens on **your** rail: Trugi NGN by default, with Native tCTC and Attestcoin alongside. Fire the simulated NIP transfer and watch the automated 85/15 split land on-chain.
   * **Hardware registry** — register a productive asset. **Track A** photographs a serial plate and runs Tesseract on-device, offering candidate strings; **Track B** resolves your position to an H3 res-10 cell and binds it to a prepaid meter number.
   * **Telemetry claims** — file a claim and run the three-second sweep. **On a laptop this will be refused**, because the gate needs an accelerometer and a laptop has none. That refusal is the point. The interface then offers a replayed sensor trace so the rest of the flow can be walked, and the receipt records that the telemetry was replayed.

> **Recording sandbox.** `/demo` runs the entire journey automatically for screen recording. It drives the real components and is not part of the shipped product.

### Local developer setup (optional)

```bash
git clone https://github.com/Lideeyah/temi.git
cd temi
npm install

# Compile contracts (solc 0.8.28) and regenerate ABIs
npm run compile

# Full suite — 295 assertions, including live Sepolia and Chainlink proofs
npm test

# Confirm deployed bytecode still matches source
npm run drift

# Run the web application
npm run dev
```

---

## 07. Security & Invariant Guarantees

* **Zero Rehypothecation.** Tier 1 reserves are ring-fenced and withdrawable at any moment with no fee, notice or penalty. The yield engine exists but **`yieldStrategy` is `address(0)` on this deployment** — no merchant capital is deployed anywhere, and the interface states so rather than quoting an APY.
* **Cumulative Draw Ceilings.** A single claim may draw at most **10% of the pool**. Cumulatively, an operator may never draw more than **3× their lifetime deposits**. An earlier revision capped this per-claim, which allowed registering N assets for N × 3× extraction — measured at **155× ROI on a ₦250,000 deposit**, draining the pool to 3%. The ceiling is now tracked as `lifetimeTier2Drawn` across every asset an operator owns.
* **Optimistic Challenge Window.** Mutual draws above **1% of the pool** escrow for **24 hours** against a **10% bond**, which is withheld from the merchant's own immediate payout if they cannot fund it — an honest merchant whose shop just burned down should not need to find spare tCTC before they can file. A successful challenger takes 50% of the bond.
* **Hardware Deduplication.** `keccak256` asset identities are checked globally; `registerAsset` reverts with `AssetAlreadyRegistered`, blocking duplicate registration across market clusters.
* **Oracle Staleness.** A price round older than **6 hours** is refused, and the round itself must be proven through `0x0FD2` rather than asserted by a caller.
* **Recoverable Float.** Every funding path has a counterpart. Conduit liquidity and portal balances can be withdrawn by their owner — an earlier revision stranded 200 tCTC and 0.001 ETH in one-way sinks.

### Known limitations, stated plainly

* **Sensor telemetry is client-attested.** The contract cannot distinguish a measured reading from a replayed one. This is the open problem hardware attestation would close, and evaluator mode performs that forgery deliberately and in the open rather than hiding it.
* **The fiat rail's counterparty is simulated, the integration is not.** Accounts are genuinely issued per merchant with valid NUBAN check digits, and credits are genuinely authenticated, verified against the beneficiary, and settled idempotently. What is absent is a licensed provider: no naira moves, and the credit notification originates from the sandbox rather than a bank. MTN MoMo and M-PESA are named and modelled only — no adapter exists for them yet.
* **PenguinSwap has no verifiable cc3-testnet router**, so the USD1 hedging leg is designed rather than executed.

---

## 08. License

MIT License. Designed and engineered for the Creditcoin CC3 Ecosystem.
