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
You are an expert SEO content writer for
tempmailin.in — a FREE Indian temp mail service.

KEYWORD TO TARGET: "${nextKeyword}"

RECENT ARTICLES ALREADY WRITTEN:
${recentTitles}
Make this article COMPLETELY different
from above! Different angle, different
opening, different examples!

════════════════════════════════
ANTI-REPETITION RULES (CRITICAL!):
════════════════════════════════
- NEVER start with "In today's digital world"
- NEVER start with "In this article we will"
- NEVER start with "Are you tired of"
- NEVER use "Furthermore" or "Moreover"  
- NEVER repeat same sentence structure
- Each article MUST have unique opening
- Use specific Indian examples not generic
- Add one unique tip nobody else mentions

════════════════════════════════
QUALITY RULES (Google E-E-A-T):
════════════════════════════════
- Every paragraph must add NEW value
- No filler sentences allowed
- No obvious statements
- Specific beats generic always
- Show real expertise about temp mail
- Include real India scenario in intro
- Make reader feel understood
- Example of BAD: "Privacy is important"
- Example of GOOD: "After signing up on
  Zomato with real email, Indians receive
  4-5 spam emails every single week"

════════════════════════════════
SEO RULES:
════════════════════════════════
- Keyword in FIRST 100 words (mandatory!)
- Keyword in LAST paragraph (mandatory!)
- Use exact keyword: 3-5 times only
- Use keyword variations: 5-8 times
- NEVER stuff keywords (spam penalty!)
- Minimum 5 H2 headings with ##
- Use ### for subheadings where needed
- Word count: 1000-1500 words exactly
- Natural Hindi words mixed in throughout
- Short sentences: maximum 20 words each
- Short paragraphs: maximum 3 lines each

════════════════════════════════
CONTENT STRUCTURE (follow exactly):
════════════════════════════════
## [Unique Hook Related to Topic]
   (NOT generic — relate to real India problem)

## What is [Topic]?
   (explain simply for Indian users)

## Why Indians Need This in 2026
   (specific India context)

## Step by Step Guide
   (numbered steps, very clear)

## Pro Tips Nobody Tells You
   (unique advice — this makes us stand out!)

## Why Choose TempMailin.in
   (mention our features naturally)

## Conclusion
   (call to action to use our tool)

════════════════════════════════
LANGUAGE RULES:
════════════════════════════════
- Mix Hindi naturally: "Aap ko pata hai"
  "Yeh bahut useful hai" etc
- Simple English for non-Hindi sections
- Friendly conversational tone
- Write like helping a friend
- NOT formal or corporate

════════════════════════════════
META DESCRIPTION RULES:
════════════════════════════════
- Exactly 150-160 characters
- Must contain main keyword
- Must have clear benefit
- Must have call to action
- Format: "[Keyword] ke liye free temp 
  mail use karo. No signup. Auto-delete 
  24hrs. Try tempmailin.in now! ✓"

════════════════════════════════
FAQ RULES (critical for Google!):
════════════════════════════════
- Exactly 5 FAQs
- Questions people ACTUALLY Google
- NOT generic questions
- Answers: 50-100 words each
- Include keyword in 2+ questions
- Mix Hindi + English in answers

════════════════════════════════
SLUG RULES:
════════════════════════════════
- Maximum 60 characters
- Lowercase only
- Hyphens between words
- Include main keyword
- No special characters

Return ONLY valid JSON.
No markdown. No backticks. No extra text.
Just pure JSON:
{
  "slug": "keyword-based-url-slug",
  "title": "Keyword | Free & Instant — TempMailin.in",
  "meta": "exactly 150-160 char description here",
  "content": "full 1000-1500 word markdown article",
  "faqs": [
    {
      "q": "Real question people search?",
      "a": "Helpful 50-100 word answer here"
    },
    {
      "q": "Second question with keyword?",
      "a": "Answer here"
    },
    {
      "q": "Third question?",
      "a": "Answer here"
    },
    {
      "q": "Fourth question?",
      "a": "Answer here"
    },
    {
      "q": "Fifth question?",
      "a": "Answer here"
    }
  ]
}
      `
    });

    // Clean JSON response
    let clean = text.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Parse article
    const article = JSON.parse(clean);

    // Validate minimum quality
    if (!article.slug || !article.title ||
      !article.content || !article.faqs) {
      throw new Error('Article missing required fields');
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