import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

// ── Step 1: Agent researches keywords itself ──
async function researchKeywords(): Promise<string[]> {
  const { text } = await generateText({
    model: google('gemini-2.5-flash-lite'),
    prompt: `
      You are an SEO keyword researcher for India.
      
      Find 10 high traffic keyword opportunities for 
      a temp mail website targeting Indian users.
      
      Research these sources mentally:
      1. Trending apps in India right now 2026
      2. Popular Indian websites needing email signup
      3. Services Indians use daily
      4. Gaming platforms popular in India
      5. Food delivery, shopping, finance apps
      
      Rules for keywords:
      - Must be specific to India
      - Format: "temp mail for [app/service] india"
      - Choose apps that are currently popular
      - Avoid banned or inactive apps
      - Mix different categories
      
      Return ONLY a JSON array, no markdown:
      ["keyword 1", "keyword 2", "keyword 3"]
    `
  });

  try {
    let clean = text.trim();
    clean = clean.replace(/```json/g, '');
    clean = clean.replace(/```/g, '');
    clean = clean.trim();
    const keywords = JSON.parse(clean);
    console.log('Agent researched keywords:', keywords);
    return keywords;
  } catch {
    // Fallback keywords if research fails
    return [
      "temp mail for phonepe india",
      "temp mail for swiggy india",
      "temp mail for meesho india"
    ];
  }
}

// ── Step 2: Agent spies on competitors ──
async function spyCompetitors(): Promise<string[]> {
  const competitors = [
    'https://temp-mail.org/sitemap.xml',
    'https://guerrillamail.com/sitemap.xml',
  ];

  const keywords: string[] = [];

  for (const sitemap of competitors) {
    try {
      const res = await fetch(sitemap);
      const text = await res.text();
      const urls = text.match(/<loc>(.*?)<\/loc>/g) || [];

      urls.slice(0, 5).forEach(url => {
        const slug = url
          .replace(/<\/?loc>/g, '')
          .split('/').pop() || '';

        const keyword = slug
          .replace(/-/g, ' ')
          .replace('.html', '')
          .trim();

        if (keyword.length > 5) {
          keywords.push(keyword + ' india');
        }
      });
    } catch {
      console.log(`Skipping competitor: ${sitemap}`);
    }
  }

  return keywords;
}

// ── Step 3: Write article ──
async function writeArticle(keyword: string) {
  const { text } = await generateText({
    model: google('gemini-2.5-flash-lite'),
    prompt: `
      You are an SEO content writer for 
      tempmailin.in - a free Indian temp mail website.
      
      Write complete SEO article for: "${keyword}"
      
      Requirements:
      - Target Indian users
      - Mention tempmailin.in naturally
      - Mix simple English + Hindi words
      - Step by step guide
      - 800+ words
      - 5 FAQs
      
      Return ONLY valid JSON, no markdown:
      {
        "slug": "url-slug-here",
        "title": "SEO Title - India 2026",
        "meta": "Under 160 chars description",
        "content": "800+ word article",
        "faqs": [
          {"q": "Question?", "a": "Answer"}
        ]
      }
    `
  });

  let clean = text.trim();
  clean = clean.replace(/```json/g, '');
  clean = clean.replace(/```/g, '');
  return JSON.parse(clean.trim());
}

// ── Main Agent ────────────────────────────────
export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (secret !== SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get already published keywords
    const { data: existing } = await supabase
      .from('seo_pages')
      .select('keyword');

    const doneKeywords = existing?.map(
      (p: any) => p.keyword?.toLowerCase().trim()
    ) || [];

    // Agent researches keywords itself!
    console.log('🔍 Agent researching keywords...');
    const researchedKeywords = await researchKeywords();

    // Agent spies on competitors!
    console.log('🕵️ Agent spying on competitors...');
    const competitorKeywords = await spyCompetitors();

    // Combine all keywords
    const allKeywords = [
      ...competitorKeywords,
      ...researchedKeywords,
    ];

    // Remove duplicates
    const uniqueKeywords = [...new Set(allKeywords)];

    // Find next unpublished keyword
    const nextKeyword = uniqueKeywords.find(
      k => !doneKeywords.includes(k.toLowerCase().trim())
    );

    if (!nextKeyword) {
      // No keywords left — research fresh ones!
      return NextResponse.json({
        success: true,
        message: 'Agent will research new keywords tomorrow!',
        totalPublished: doneKeywords.length
      });
    }


    // Write article
    console.log(`✍️ Writing article for: ${nextKeyword}`);
    const article = await writeArticle(nextKeyword);

    // Handle duplicate slugs
    const { data: slugExists } = await supabase
      .from('seo_pages')
      .select('slug')
      .eq('slug', article.slug)
      .single();

    if (slugExists) {
      article.slug = `${article.slug}-${Date.now()}`;
    }

    // Save to database
    const { error } = await supabase
      .from('seo_pages')
      .insert({
        slug: article.slug,
        title: article.title,
        meta: article.meta,
        content: article.content,
        faqs: article.faqs,
        keyword: nextKeyword,
        published_at: new Date().toISOString()
      });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      keyword: nextKeyword,
      slug: article.slug,
      title: article.title,
      totalPublished: doneKeywords.length + 1,
      message: `Published: ${article.slug}`
    });

  } catch (error: any) {
    console.error('Agent Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}