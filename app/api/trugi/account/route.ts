import { NextResponse } from 'next/server';
import { isAddress } from 'viem';
import { provisionAccount } from '@/lib/TrugiRail';

/**
 * Issue a merchant their dedicated virtual account.
 *
 * This is the call a live provider integration replaces: Paystack's create-dedicated-account,
 * Monnify's reserved account, or Trugi's own. The response shape is deliberately the shape those
 * return, so the swap is a change of implementation rather than a change of contract.
 */
export async function POST(request: Request) {
  let address: string | undefined;
  let businessName: string | undefined;
  try {
    ({ address, businessName } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!address || !isAddress(address)) {
    return NextResponse.json({ error: 'A beneficiary address is required' }, { status: 400 });
  }

  const account = provisionAccount(address, businessName ?? '', 'sandbox');
  return NextResponse.json({ account });
}
