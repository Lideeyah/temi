import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { nairaToKobo, provisionAccount, signNotification, type CreditNotification } from '@/lib/TrugiRail';

/**
 * Stand in for the bank.
 *
 * In production nothing calls this: a merchant transfers money and their provider posts the
 * notification. Here that transfer cannot happen, so this constructs the notification the
 * provider would have sent, signs it with the same key, and posts it over HTTP to the same
 * webhook — which verifies the signature, checks the account belongs to the beneficiary, and
 * settles.
 *
 * The loop is deliberately not short-circuited. Calling the handler directly would prove nothing
 * about the endpoint a real provider will hit; going over the wire exercises the signature, the
 * idempotency key and the error paths exactly as the live integration will.
 */
export async function POST(request: Request) {
  let address: string | undefined;
  let naira: number | undefined;
  let businessName: string | undefined;
  try {
    ({ address, naira, businessName } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'A beneficiary address is required' }, { status: 400 });
  }
  if (!naira || !(naira > 0)) {
    return NextResponse.json({ error: 'An amount in NGN is required' }, { status: 400 });
  }

  const account = provisionAccount(address, businessName ?? '', 'sandbox');

  const notification: CreditNotification = {
    // NIP session ids are 30 characters; the shape matters because downstream systems parse it.
    reference: `TRG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    accountNumber: account.accountNumber,
    amountKobo: nairaToKobo(naira),
    currency: 'NGN',
    beneficiary: address,
    sessionId: `0000${account.bankCode}${Date.now()}`.slice(0, 30),
    paidAt: new Date().toISOString(),
  };

  const body = JSON.stringify(notification);
  const origin = new URL(request.url).origin;

  const delivered = await fetch(`${origin}/api/trugi/webhook`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-trugi-signature': signNotification(body),
    },
    body,
  });

  const result = await delivered.json();
  return NextResponse.json(
    { notification: { reference: notification.reference, sessionId: notification.sessionId }, ...result },
    { status: delivered.status },
  );
}
