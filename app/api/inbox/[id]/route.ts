import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Rate limiter
const rateLimit = new Map();

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { id } = await params;

    // Validate ID format
    // Only allow alphanumeric, 8-20 chars
    if (!/^[a-z0-9]{8,20}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid email ID' },
        { status: 400 }
      );
    }

    // Rate limit per IP
    const ip = request.headers.get('x-forwarded-for')
      || 'unknown';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requests per minute

    const requests = rateLimit.get(ip) || [];
    const recent = requests.filter(
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

    const recipient = `${id}@tempmailin.in`;

    const { data, error } = await supabase
      .from('emails')
      .select('*')
      .eq('recipient', recipient)
      .order('created_at', { ascending: false })
      .limit(50); // Max 50 emails per inbox

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch inbox' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}