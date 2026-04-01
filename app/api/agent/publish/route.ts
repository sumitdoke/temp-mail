import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

export async function POST(req: Request) {
  try {
    // Add secret check!
    const body = await req.json();
    
    if (body.secret !== SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize slug
    const cleanSlug = body.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .substring(0, 100);

    const { data, error } = await supabase
      .from('seo_pages')
      .insert({
        slug: cleanSlug,
        title: body.title.substring(0, 200),
        meta: body.meta?.substring(0, 160),
        content: body.content,
        faqs: body.faqs,
        keyword: body.keyword,
        published_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: data.slug
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}