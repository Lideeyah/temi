import { NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, isAddress, parseEther, formatEther, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinTestnet } from '@/lib/chains';

/**
 * Gas sponsorship for freshly provisioned merchant accounts.
 *
 * A trader whose shop just flooded cannot be told to go and acquire a testnet token before they
 * can file a claim. The premise of the product is that they open the app and it works, so a
 * newly created account is topped up with enough tCTC to register an asset and settle a claim.
 *
 * This is the honest version of a paymaster: on cc3-testnet, gas is cheap enough (0.5 gwei) that
 * a direct drip is simpler and more transparent than ERC-4337 infrastructure. A production
 * deployment would sponsor through a real paymaster so the merchant never holds gas at all.
 *
 * Guards, because the sponsor key holds real testnet funds:
 *   - only tops up accounts that are genuinely empty, which makes it self-limiting rather than
 *     dependent on server memory that resets on redeploy
 *   - a hard cap on total spend for the lifetime of the process
 *   - a per-address record, so a single account cannot drain it by looping
 */

const SPONSOR_AMOUNT = parseEther(process.env.SPONSOR_AMOUNT ?? '0.05');
/** Above this an account can pay for itself and does not need help. */
const EMPTY_THRESHOLD = parseEther('0.01');
/** Ceiling for this process. Small on purpose — the faucet is not infinite. */
const LIFETIME_CAP = parseEther(process.env.SPONSOR_LIFETIME_CAP ?? '5');

let spent = 0n;
const sponsored = new Set<string>();

const publicClient = createPublicClient({
  chain: creditcoinTestnet,
  transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
});

export async function POST(request: Request) {
  const key = process.env.SPONSOR_PRIVATE_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: 'Sponsorship is not configured',
        detail: 'Set SPONSOR_PRIVATE_KEY to enable gasless merchant onboarding.',
      },
      { status: 503 },
    );
  }

  let address: string | undefined;
  try {
    ({ address } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'A valid address is required' }, { status: 400 });
  }

  const beneficiary = address as Address;

  if (sponsored.has(beneficiary.toLowerCase())) {
    return NextResponse.json({ error: 'This account has already been sponsored' }, { status: 429 });
  }
  if (spent + SPONSOR_AMOUNT > LIFETIME_CAP) {
    return NextResponse.json(
      { error: 'Sponsorship budget exhausted', detail: `Cap is ${formatEther(LIFETIME_CAP)} tCTC.` },
      { status: 429 },
    );
  }

  // The real guard: only help an account that cannot help itself.
  const balance = await publicClient.getBalance({ address: beneficiary });
  if (balance >= EMPTY_THRESHOLD) {
    return NextResponse.json(
      { sponsored: false, reason: 'already funded', balance: formatEther(balance) },
      { status: 200 },
    );
  }

  try {
    const account = privateKeyToAccount(key as `0x${string}`);
    const wallet = createWalletClient({
      account,
      chain: creditcoinTestnet,
      transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
    });

    const hash = await wallet.sendTransaction({ to: beneficiary, value: SPONSOR_AMOUNT });
    await publicClient.waitForTransactionReceipt({ hash });

    spent += SPONSOR_AMOUNT;
    sponsored.add(beneficiary.toLowerCase());

    return NextResponse.json({
      sponsored: true,
      hash,
      amount: formatEther(SPONSOR_AMOUNT),
      remaining: formatEther(LIFETIME_CAP - spent),
    });
  } catch (cause) {
    return NextResponse.json(
      { error: 'Sponsorship transaction failed', detail: cause instanceof Error ? cause.message : undefined },
      { status: 502 },
    );
  }
}
