import { NextRequest, NextResponse } from 'next/server';

const rateLimit = new Map();

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')
      || 'unknown';

    // Rate limit: 50 per hour (increased!)
    const now = Date.now();
    const windowMs = 60 * 60 * 1000;
    const maxRequests = 50; // ← increased from 10!

    const userRequests = rateLimit.get(ip) || [];
    const recent = userRequests.filter(
      (t: number) => now - t < windowMs
    );

    if (recent.length >= maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    recent.push(now);
    rateLimit.set(ip, recent);

    // Generate TRULY random email every time
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString(36); // adds uniqueness!
    const randomPart = Array.from({ length: 8 }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    // Combine timestamp + random = always unique!
    const randomId = `${randomPart}${timestamp}`;
    const email = `${randomId}@tempmailin.in`;

    return NextResponse.json({
      email,
      expiresIn: 24 * 60 * 60 * 1000,
      createdAt: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}