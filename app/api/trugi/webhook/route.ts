import { NextResponse } from 'next/server';
import { createWalletClient, createPublicClient, http, isAddress, parseEther, formatEther, type Address } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { creditcoinTestnet } from '@/lib/chains';
import {
  koboToNaira,
  provisionAccount,
  verifyNotification,
  type CreditNotification,
} from '@/lib/TrugiRail';

/**
 * Money landed in a merchant's virtual account.
 *
 * This is the endpoint a payment provider posts to. It is written as though a bank were calling
 * it, because that is the point: the signature is checked before anything moves, the account is
 * confirmed to belong to the beneficiary named, and a reference that has already settled is
 * refused rather than paid a second time. A rail that pays twice on a retried webhook is worse
 * than no rail.
 *
 * What it does after that is the settlement leg — crediting the merchant on cc3-testnet so their
 * own deposit transaction can follow. In production the float behind this is the provider's
 * collection account; here it is a sponsor key, and every surface says sandbox.
 */

const NGN_PER_TCTC = Number(process.env.NEXT_PUBLIC_NGN_PER_TCTC ?? '1450');
const MAX_PER_CREDIT = parseEther(process.env.RELAYER_MAX_PER_REQUEST ?? '300');

const publicClient = createPublicClient({
  chain: creditcoinTestnet,
  transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
});

/** References already settled. Per-instance, and the honest limit of that is noted below. */
const settled = new Map<string, string>();

export async function POST(request: Request) {
  // Signature is computed over the raw bytes, so the body is read as text first.
  const raw = await request.text();
  const signature = request.headers.get('x-trugi-signature');

  if (!verifyNotification(raw, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let notification: CreditNotification;
  try {
    notification = JSON.parse(raw) as CreditNotification;
  } catch {
    return NextResponse.json({ error: 'Malformed notification' }, { status: 400 });
  }

  const { reference, accountNumber, amountKobo, beneficiary } = notification;
  if (!reference || !accountNumber || !beneficiary || !isAddress(beneficiary)) {
    return NextResponse.json({ error: 'Incomplete notification' }, { status: 400 });
  }

  // Idempotency. A provider retries until it gets a 200, so this will be called twice.
  const already = settled.get(reference);
  if (already) {
    return NextResponse.json({ credited: true, hash: already, replay: true });
  }

  // The account must be the one this beneficiary was actually issued — a notification naming
  // someone else's account is either a mistake or an attempt.
  const expected = provisionAccount(beneficiary, '', 'sandbox');
  if (expected.accountNumber !== accountNumber) {
    return NextResponse.json(
      { error: 'Account does not belong to this beneficiary' },
      { status: 409 },
    );
  }

  const naira = koboToNaira(amountKobo);
  if (!(naira > 0)) {
    return NextResponse.json({ error: 'Amount must be positive' }, { status: 400 });
  }

  const tctc = parseEther((naira / NGN_PER_TCTC).toFixed(18));
  if (tctc > MAX_PER_CREDIT) {
    return NextResponse.json(
      { error: 'Above the per-credit ceiling', detail: `Max ${formatEther(MAX_PER_CREDIT)} tCTC.` },
      { status: 400 },
    );
  }

  const key = process.env.SPONSOR_PRIVATE_KEY;
  if (!key) {
    return NextResponse.json(
      { error: 'Settlement float unavailable', detail: 'No settlement key configured.' },
      { status: 503 },
    );
  }

  try {
    const settler = privateKeyToAccount(key as `0x${string}`);
    const wallet = createWalletClient({
      account: settler,
      chain: creditcoinTestnet,
      transport: http(creditcoinTestnet.rpcUrls.default.http[0]),
    });

    const float = await publicClient.getBalance({ address: settler.address });
    if (float < tctc) {
      return NextResponse.json(
        { error: 'Settlement float is empty', detail: `Holds ${formatEther(float)} tCTC.` },
        { status: 503 },
      );
    }

    const hash = await wallet.sendTransaction({ to: beneficiary as Address, value: tctc });
    await publicClient.waitForTransactionReceipt({ hash });
    settled.set(reference, hash);

    return NextResponse.json({
      credited: true,
      reference,
      hash,
      naira,
      tctc: formatEther(tctc),
    });
  } catch (cause) {
    return NextResponse.json(
      { error: 'Settlement failed', detail: cause instanceof Error ? cause.message : 'unknown' },
      { status: 502 },
    );
  }
}
