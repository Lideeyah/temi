# Deployment state

Contract changes are being **batched into one final deploy** rather than redeployed as they land,
so the current instances stay the working demo until the contract work is settled.

Run `npm run drift` at any time to see how far source has moved ahead of the chain.

## Live now

| Contract | Chain | Address |
| --- | --- | --- |
| `TemiVault` | Creditcoin cc3-testnet (102031) | `0x83c7841dc38bb662e1e7d7a47d300b2ddd676449` |
| `TemiSourcePortal` | Ethereum Sepolia | `0x83C7841dC38bb662E1E7D7a47d300b2DdD676449` |

Deployer / treasury / arbiter: `0x042C27cBF84003e59D08d85b1Bda54235D1F576F` (key in `.deployer.json`, gitignored).

Configured and verified on-chain: Chainlink ETH/USD aggregator registered for chain key 1,
source portal registered for chain key 1 (both **write-once, already set**), tCTC/USD at $0.90,
200 tCTC of conduit float seeded.

## Pending for the final deploy

- `TemiVault.withdrawConduitLiquidity` — treasury reclaim of unallocated float. Not on-chain.
- `TemiSourcePortal` constructor now takes a treasury, and gains `sweep`. Not on-chain.

Neither is called by the app, so the running UI is safe against the deployed bytecode.

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
