# Deployment state

Contract changes are being **batched into one final deploy** rather than redeployed as they land,
so the current instances stay the working demo until the contract work is settled.

Run `npm run drift` at any time to see how far source has moved ahead of the chain.

## Live now

| Contract | Chain | Address |
| --- | --- | --- |
| `TemiVault` | Creditcoin cc3-testnet (102031) | `0x17766312c7300d01aed58174bc6ff39944272a2c` |
| `TemiSourcePortal` | Ethereum Sepolia | `0x81b78bc835267408d851fae39a15e123ea66819c` |

`npm run drift` reports **no drift** — deployed bytecode matches source.

Deployer / treasury / arbiter: `0x042C27cBF84003e59D08d85b1Bda54235D1F576F` (key in `.deployer.json`, gitignored).

Configured and verified on-chain: Chainlink ETH/USD aggregator registered for chain key 1,
source portal registered for chain key 1 (both **write-once, already set**), tCTC/USD at $0.90,
200 tCTC of conduit float seeded.

## Superseded — kept for the record

Everything below shipped in the deploy above. The previous instances
(`0x83c7841d…` on both chains) are abandoned, with ~197 tCTC of conduit float and
0.001 ETH stranded in them — they predate the withdrawal paths that would have
released it.

### Was pending

- `TemiVault.withdrawConduitLiquidity` — treasury reclaim of unallocated float.
- `TemiSourcePortal` constructor takes a treasury, and gains `sweep`.
- **Protocol revenue**: 1.5% settlement fee, 15% yield spread, `distributeYield` /
  `compoundYield` / `pendingYield`, `protocolTreasury`, `yieldStrategy`.
- **Reserve sizing**: `Asset` gains `targetReserve`, `targetHorizonMonths`, `registeredAt`;
  `registerAsset` takes two more arguments; `suggestedTargetReserve` and `coverageHealthBps`.

The app reads the revenue functions, so those calls are wrapped individually and fall back to
"not on this deployment" rather than rejecting the batch and blanking the dashboard. Verified
against the live vault. `npm run drift` lists the gap.

## Cost of redeploying

- **~197 tCTC written off.** The deployed vault has no withdrawal path for its conduit float —
  that is precisely the bug the pending change fixes, and it cannot be applied retroactively.
- **0.001 ETH written off** in the deployed portal, for the same reason.
- A fresh faucet request on both chains.
- The demo transaction links in `README.md` must be regenerated, since they point at the old
  vault. `scripts/live-attestcoin.mjs` reproduces them in two runs about ten minutes apart —
  the gap is the attestor quorum catching up to the Sepolia funding block.

## Redeploy procedure

```bash
npm run compile
npm test                       # 192 assertions, incl. a full deployment rehearsal
PRIVATE_KEY=... CONDUIT_FLOAT=20 CTC_USD=0.90 npm run deploy
PRIVATE_KEY=... VAULT=0x... npm run deploy:portal
```

Seed a **smaller** float next time. 200 tCTC was far more than a demo needs — 20 covers roughly
0.007 ETH of cross-chain deposits at current prices, which is several full run-throughs.
