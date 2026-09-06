import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/otpStore';

export async function POST(request: Request) {
  let phone: string | undefined;
  let code: string | undefined;
  try {
    ({ phone, code } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!phone || !code) {
    return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
  }

  const result = verifyCode(phone, code);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, attemptsRemaining: result.attemptsRemaining },
      { status: 401 },
    );
  }

  // The server's half of the key. The PIN never reaches this service, so this share alone
  // derives nothing.
  return NextResponse.json({ verified: true, keyShare: result.keyShare });
}
