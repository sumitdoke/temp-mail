import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

// ── Competitor Spy Function ──────────────────────────
async function spyCompetitors() {
  const competitors = [
    'https://temp-mail.org/sitemap.xml',
    'https://guerrillamail.com/sitemap.xml',
    'https://10minutemail.com/sitemap.xml'
  ];

  const newKeywords: string[] = [];

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
          newKeywords.push(keyword);
        }
      });
    } catch (e) {
      console.log(`Skipping competitor: ${sitemap}`);
    }
  }

  return newKeywords;
}

// ── Our Base Keywords ────────────────────────────────
const BASE_KEYWORDS = [
  "temp mail for instagram india",
  "temp mail for facebook verification",
  "temp mail for telegram india",
  "disposable email for OTP india",
  "temp mail for netflix free trial",
  "fake email for amazon india",
  "temp mail for flipkart",
  "temporary email for zomato",
  "temp mail for swiggy offers",
  "disposable email for paytm",
  "temp mail for google account",
  "temp mail for youtube",
  "fake email generator india",
  "temp mail for whatsapp",
  "disposable email hindi",
  "temp mail for linkedin india",
  "throwaway email india",
  "temp mail for twitter india",
  "anonymous email india",
  "temp mail for online shopping india"
];

// ── Main Agent Function ──────────────────────────────
export async function POST(req: Request) {
  try {

    // Check secret key
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
      (p: any) => p.keyword
    ) || [];

    // Spy on competitors for fresh keywords
    const competitorKeywords = await spyCompetitors();
    console.log(
      `Found ${competitorKeywords.length} competitor keywords`
    );

    // Combine competitor + base keywords
    // Competitor keywords go first — attack their rankings!
    const allKeywords = [
      ...competitorKeywords,
      ...BASE_KEYWORDS
    ];

    // Remove duplicates
    const uniqueKeywords = [...new Set(allKeywords)];

    // Find next keyword not yet published
    const nextKeyword = uniqueKeywords.find(
      k => !doneKeywords.includes(k)
    );

    if (!nextKeyword) {
      return NextResponse.json({
        success: true,
        message: 'All keywords published! Add more keywords.',
        totalPublished: doneKeywords.length
      });
    }

    console.log(`Writing article for: ${nextKeyword}`);

    // Generate article with Gemini
    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `
        You are an expert SEO content writer for 
        tempmailin.in - a free Indian temp mail website.
        
        Write a complete SEO article for: "${nextKeyword}"
        
        Requirements:
        - Target Indian users specifically
        - Mention tempmailin.in naturally
        - Simple English + some Hindi words mixed in
        - Step by step guide on how to use temp mail
        - 800+ words
        - FAQ section with 5 questions
        
        Return ONLY valid JSON, absolutely no markdown, 
        no backticks, no extra text:
        {
          "slug": "url-friendly-slug-here",
          "title": "SEO Title Here - India 2026",
          "meta": "Meta description under 160 chars",
          "content": "Full 800+ word article here",
          "faqs": [
            {"q": "Question here?", "a": "Answer here"}
          ]
        }
      `
    });

    // Clean response
    let clean = text.trim();
    clean = clean.replace(/```json/g, '');
    clean = clean.replace(/```/g, '');
    clean = clean.trim();

    // Parse JSON
    const article = JSON.parse(clean);

    // Check if slug already exists
    const { data: slugExists } = await supabase
      .from('seo_pages')
      .select('slug')
      .eq('slug', article.slug)
      .single();

    if (slugExists) {
      article.slug = `${article.slug}-${Date.now()}`;
    }

    // Save to Supabase
    const { error: insertError } = await supabase
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

    if (insertError) throw insertError;

    console.log(`✅ Published: ${article.slug}`);

    return NextResponse.json({
      success: true,
      keyword: nextKeyword,
      slug: article.slug,
      title: article.title,
      totalPublished: doneKeywords.length + 1,
      message: `Successfully published: ${article.slug}`
    });

  } catch (error: any) {
    console.error('Auto Agent Error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        hint: 'Check Gemini API key and Supabase connection'
      },
      { status: 500 }
    );
  }
}