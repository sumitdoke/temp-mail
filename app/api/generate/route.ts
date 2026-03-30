import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Simple in-memory rate limiter
const rateLimit = new Map();

export async function GET(req: NextRequest) {

  // Get user IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';

  // Allow max 10 emails per hour per IP
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 10;

  const userRequests = rateLimit.get(ip) || [];
  const recentRequests = userRequests.filter(
    (time: number) => now - time < windowMs
  );

  if (recentRequests.length >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 }
    );
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);

  // Generate email
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const randomId = Array.from({ length: 10 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  const email = `${randomId}@tempmail.in`;

  return NextResponse.json({
    email,
    expiresIn: 24 * 60 * 60 * 1000,
    createdAt: new Date().toISOString()
  });
}