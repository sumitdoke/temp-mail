import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  const article = await req.json();

  const { data, error } = await supabase
    .from('seo_pages')
    .insert({
      slug: article.slug,
      title: article.title,
      meta: article.meta,
      content: article.content,
      faqs: article.faqs,
      keyword: article.keyword,
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
}