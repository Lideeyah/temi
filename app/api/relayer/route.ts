import { NextResponse } from 'next/server';
import {
  createWalletClient,
  createPublicClient,
  http,
  isAddress,
  parseEther,
  formatEther,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinTestnet } from '@/lib/chains';

/**
 * The settlement relayer — what a bank webhook actually does.
 *
 * A merchant funding through Trugi, MoMo or M-Pesa is transferring *fiat*. They hold no crypto,
 * which is the entire premise. So the simulate control cannot ask their account to pay: money
 * has to arrive from outside, exactly as an inbound NIP transfer credits a bank account before
 * the holder does anything with it.
 *
 * This endpoint is that inbound credit. In production the trigger is a signed webhook from the
 * settlement provider; here it is a button, and the money is testnet tCTC rather than the USD1
 * a real Trugi swap would deliver. What is faithful is the direction: the merchant receives,
 * then allocates.
 *
 * Guarded, because the key behind it holds real testnet funds:
 *   - a per-request ceiling, so one click cannot drain the float
 *   - a lifetime ceiling for the process
 *   - it tops up only the shortfall, never the full amount if the merchant already holds some
 */

const MAX_PER_REQUEST = parseEther(process.env.RELAYER_MAX_PER_REQUEST ?? '300');
const LIFETIME_CAP = parseEther(process.env.RELAYER_LIFETIME_CAP ?? '2000');
/** Headroom so the merchant can still pay gas on the deposit that follows. */
const GAS_HEADROOM = parseEther('0.02');

let relayed = 0n;

const publicClient = createPublicClient({
  chain: creditcoinTestnet,
  transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
});

export async function POST(request: Request) {
  const key = process.env.SPONSOR_PRIVATE_KEY;
  if (!key) {
    return NextResponse.json(
      {
        error: 'Settlement relayer is not configured',
        detail:
          'Set SPONSOR_PRIVATE_KEY in .env.local to enable the simulated inbound transfer. Without it a merchant account has no funds and the deposit cannot be paid for.',
      },
      { status: 503 },
    );
  }

  let address: string | undefined;
  let amount: string | undefined;
  try {
    ({ address, amount } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'A valid merchant address is required' }, { status: 400 });
  }

  let requested: bigint;
  try {
    requested = BigInt(amount ?? '0');
  } catch {
    return NextResponse.json({ error: 'Amount must be a wei string' }, { status: 400 });
  }
  if (requested <= 0n) {
    return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
  }
  if (requested > MAX_PER_REQUEST) {
    return NextResponse.json(
      {
        error: 'Above the per-transfer ceiling',
        detail: `This demo relayer settles at most ${formatEther(MAX_PER_REQUEST)} tCTC per transfer. Size a smaller asset or a longer horizon.`,
      },
      { status: 422 },
    );
  }

  const merchant = address as Address;
  const held = await publicClient.getBalance({ address: merchant });
  const target = requested + GAS_HEADROOM;

  if (held >= target) {
    return NextResponse.json({ credited: false, reason: 'already funded', balance: formatEther(held) });
  }

  const shortfall = target - held;
  if (relayed + shortfall > LIFETIME_CAP) {
    return NextResponse.json(
      { error: 'Relayer budget exhausted', detail: `Cap is ${formatEther(LIFETIME_CAP)} tCTC.` },
      { status: 429 },
    );
  }

  try {
    const account = privateKeyToAccount(key as `0x${string}`);
    const wallet = createWalletClient({
      account,
      chain: creditcoinTestnet,
      transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
    });

    const treasuryBalance = await publicClient.getBalance({ address: account.address });
    if (treasuryBalance < shortfall) {
      return NextResponse.json(
        {
          error: 'Settlement float is empty',
          detail: `The relayer holds ${formatEther(treasuryBalance)} tCTC and needs ${formatEther(shortfall)}.`,
        },
        { status: 503 },
      );
    }

    const hash = await wallet.sendTransaction({ to: merchant, value: shortfall });
    await publicClient.waitForTransactionReceipt({ hash });
    relayed += shortfall;

    return NextResponse.json({
      credited: true,
      hash,
      amount: formatEther(shortfall),
      remaining: formatEther(LIFETIME_CAP - relayed),
    });
  } catch (cause) {
    return NextResponse.json(
      {
        error: 'Inbound settlement failed',
        detail: cause instanceof Error ? cause.message.split('\n')[0] : undefined,
      },
      { status: 502 },
    );
  }
}
