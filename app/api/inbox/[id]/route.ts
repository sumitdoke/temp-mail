import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Next.js 15 — params is now a Promise, must await
  const { id } = await context.params;
  
  const recipient = `${id}@tempmail.in`;

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('recipient', recipient)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}