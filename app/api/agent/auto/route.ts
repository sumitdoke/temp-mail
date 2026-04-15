import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

const KEYWORDS = [
  // ── USA HIGH PRIORITY (highest CPM!) ──
  "best temp mail usa 2026",
  "disposable email usa free no signup",
  "temporary email address usa instant",
  "burner email address usa free",
  "temp mail for amazon usa",
  "temp mail for netflix usa free",
  "fake email generator usa 2026",
  "temp mail usa no registration",
  "throwaway email usa instant",
  "temp mail for paypal usa",

  // ── Instagram HIGH PRIORITY (already ranking!) ──
  "temp mail instagram business account india",
  "temp mail multiple instagram accounts india",
  "temp mail instagram reels india 2026",
  "fake email instagram signup india",
  "temp mail instagram verification code india",
  "instagram disposable email india free",

  // ── Europe HIGH PRIORITY (high CPM!) ──
  "best temp mail europe 2026",
  "disposable email netherlands free",
  "temp mail germany free 2026",
  "temporary email uk free instant",
  "temp mail france free",

  // ── India ──
  "temp mail for phonepe india",
  "temp mail for swiggy india",
  "temp mail for meesho india",
  "temp mail for hotstar india",
  "temp mail for cred india",
  "temp mail for zomato india",
  "temp mail for myntra india",
  "temp mail for flipkart india",
  "temp mail for jiocinema india",
  "temp mail for whatsapp india",
  "temp mail for youtube india",
  "temp mail for gpay india",
  "temp mail for paytm india",
  "temp mail for groww india",
  "temp mail for blinkit india",
  "temp mail for rapido india",
  "disposable email for otp india",
  "temp mail hindi 2026",
  "best temp mail india 2026",
  "free temporary email india",

  // ── Global High Traffic ──
  "best free temp mail 2026",
  "temp mail without phone number",
  "disposable email address free",
  "10 minute mail alternative 2026",
  "temp mail for discord",
  "temp mail for reddit",
  "temp mail for spotify",
  "temp mail for steam",
  "temp mail for roblox",
  "temp mail for tiktok",
  "temp mail for twitter",
  "temp mail for chatgpt",
  "temp mail for openai",
  "fake email no verification 2026",
  "instant disposable email free",
];

export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (secret !== SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get published keywords
    const { data: existing } = await supabase
      .from('seo_pages')
      .select('keyword, title');

    const doneKeywords = existing?.map(
      (p: any) => p.keyword?.toLowerCase().trim()
    ) || [];

    // Get recent titles to avoid repetition
    const recentTitles = existing
      ?.slice(-5)
      .map((p: any) => p.title)
      .join(', ') || '';

    // Find next unpublished keyword
    const nextKeyword = KEYWORDS.find(
      k => !doneKeywords.includes(k.toLowerCase().trim())
    );

    if (!nextKeyword) {
      return NextResponse.json({
        success: true,
        message: 'All keywords published! Add more keywords.',
        total: doneKeywords.length
      });
    }

    // Write article with Gemini + strict rules
    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `
Write an SEO article for tempmailin.in

Topic: "${nextKeyword}"

Recent articles (write differently):
${recentTitles}

Rules:
1. Mix Hindi + English if India keyword
2. Pure English if USA/UK/Europe keyword
3. Minimum 1000 words
4. Use ## for headings
5. Include 5 FAQs at end

Structure:
## Introduction
## What is Temp Mail?
## How to Use for ${nextKeyword}
## Step by Step Guide
## Benefits
## Conclusion

Return ONLY this JSON with no extra text:
{
  "slug": "keyword-url-slug",
  "title": "Article Title Here",
  "meta": "Description under 160 chars",
  "content": "full article here",
  "faqs": [
    {"q": "Question?", "a": "Answer here"}
  ]
}
`
    });

    // Clean JSON response
    let clean = text.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Log for debugging
    console.log('Raw response length:', text.length);
    console.log('Clean start:', clean.substring(0, 100));

    // Find JSON in response
    // Sometimes Gemini adds text before/after JSON!
    const jsonStart = clean.indexOf('{');
    const jsonEnd = clean.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in response: ' + clean.substring(0, 200));
    }

    clean = clean.substring(jsonStart, jsonEnd + 1);

    // Parse article
    let article;
    try {
      article = JSON.parse(clean);
    } catch (parseError) {
      throw new Error('JSON parse failed: ' + clean.substring(0, 200));
    }

    // Validate minimum quality
    if (!article.slug) {
      article.slug = nextKeyword
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .substring(0, 60);
    }
    if (!article.title) {
      article.title = nextKeyword + ' | TempMailin.in';
    }
    if (!article.meta) {
      article.meta = 'Free temp mail for ' +
        nextKeyword + '. No signup. Try tempmailin.in!';
    }
    if (!article.content) {
      throw new Error('Content missing - retry');
    }
    if (!article.faqs || !Array.isArray(article.faqs)) {
      article.faqs = [{
        q: 'What is temp mail?',
        a: 'Temp mail is a free disposable email service.'
      }];
    }

    // Ensure slug is clean
    article.slug = article.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60);

    // Handle duplicate slug
    const { data: slugExists } = await supabase
      .from('seo_pages')
      .select('slug')
      .eq('slug', article.slug)
      .single();

    if (slugExists) {
      article.slug = article.slug + '-' +
        Date.now().toString(36);
    }

    // Save to database
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

    return NextResponse.json({
      success: true,
      keyword: nextKeyword,
      slug: article.slug,
      title: article.title,
      wordsApprox: article.content.split(' ').length,
      total: doneKeywords.length + 1,
      message: 'Published: ' + article.slug
    });

  } catch (error: any) {
    console.error('Agent Error:', error.message);
    return NextResponse.json(
      {
        error: error.message,
        hint: 'Check Gemini API and Supabase'
      },
      { status: 500 }
    );
  }
}