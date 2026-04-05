import { NextRequest, NextResponse } from 'next/server';

// Force dynamic - never cache!
export const dynamic = 'force-dynamic';

const rateLimit = new Map();

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')
      || 'unknown';

    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const maxRequests = 50;

    const userRequests = rateLimit.get(ip) || [];
    const recent = userRequests.filter(
      (t: number) => now - t < windowMs
    );

    if (recent.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    recent.push(now);
    rateLimit.set(ip, recent);

    // Always unique email
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString(36);
    const randomPart = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    const email = `${randomPart}${timestamp}@tempmailin.in`;

    return NextResponse.json(
      {
        email,
        expiresIn: 24 * 60 * 60 * 1000,
        createdAt: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}