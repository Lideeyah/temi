import { NextResponse } from 'next/server';
import { DEMO_MODE, issueCode } from '@/lib/otpStore';

export async function POST(request: Request) {
  let phone: string | undefined;
  try {
    ({ phone } = await request.json());
  } catch {
    return NextResponse.json({ error: 'Malformed request' }, { status: 400 });
  }

  if (!phone || !/^\+\d{7,15}$/.test(phone)) {
    return NextResponse.json({ error: 'A valid E.164 number is required' }, { status: 400 });
  }

  const result = issueCode(phone);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, retryInSeconds: result.retryInSeconds },
      { status: 429 },
    );
  }

  return NextResponse.json({
    sent: true,
    demoMode: DEMO_MODE,
    // Returned only in demo mode, so a reviewer can verify ownership without SMS credit in four
    // jurisdictions. A real deployment hands this to a gateway and returns nothing.
    demoCode: result.demoCode,
    expiresInSeconds: result.expiresInSeconds,
  });
}
