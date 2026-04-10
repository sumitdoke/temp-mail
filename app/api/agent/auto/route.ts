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
tempmailin.in — a FREE temp mail service.

KEYWORD TO TARGET: "${nextKeyword}"

RECENT ARTICLES WRITTEN (avoid repetition!):
${recentTitles}
Write COMPLETELY different angle from above!

════════════════════════════════
ANTI-REPETITION RULES:
════════════════════════════════
- NEVER start with "In today's digital world"
- NEVER start with "In this article we will"
- NEVER start with "Are you tired of"
- NEVER use "Furthermore" or "Moreover"
- NEVER write "Why Indians Need This" 
  for non-India keywords!
- Each article MUST have unique opening
- Specific examples not generic statements

════════════════════════════════
DYNAMIC STRUCTURE RULES:
════════════════════════════════
Detect keyword type and adjust:

IF keyword contains "usa" or "uk" or 
"europe" or "germany" or "netherlands":
USE this structure:
## [Unique Hook for that country]
## What is Temp Mail?
## Why [Country] Users Need Temp Mail
## How to Use TempMailin.in in [Country]
## Step by Step Guide
## Pro Tips for [Country] Users
## Conclusion

IF keyword contains "india" or "hindi"
or Indian app names:
USE this structure:
## [Unique Hindi/English Hook]
## Temp Mail Kya Hai?
## [Indian App] Ke Liye Temp Mail Kyun?
## Step by Step Guide (Hindi + English)
## TempMailin.in Ke Faayde
## Pro Tips
## Conclusion

IF keyword is GLOBAL (discord, reddit etc):
USE this structure:
## [Unique Hook About Platform]
## What is Temp Mail?
## Why Use Temp Mail for [Platform]
## Step by Step Guide
## Benefits and Warnings
## Pro Tips
## Conclusion

════════════════════════════════
WORD COUNT RULES (STRICT!):
════════════════════════════════
MINIMUM 1200 words — NO EXCEPTIONS!
MAXIMUM 1500 words
If you finish early ADD MORE:
→ More detailed steps
→ More examples
→ Bigger FAQ answers
→ More pro tips

Count your words before returning!
If under 1200 — keep writing!

════════════════════════════════
SEO RULES:
════════════════════════════════
- Keyword in FIRST 100 words (mandatory!)
- Keyword in LAST paragraph (mandatory!)
- Exact keyword: 3-5 times only
- Keyword variations: 5-8 times
- Minimum 5 H2 headings with ##
- Short sentences: max 20 words
- Short paragraphs: max 3 lines

════════════════════════════════
LANGUAGE RULES:
════════════════════════════════
FOR INDIA keywords:
- Mix Hindi naturally throughout
- "Aap ko pata hai ki..."
- "Yeh bahut kaam aata hai"
- Friendly desi tone

FOR USA/UK/EUROPE keywords:
- Pure English only
- Professional but friendly
- NO Hindi words
- Relate to their daily life

FOR GLOBAL keywords:
- Simple English
- Casual friendly tone
- Universal examples

════════════════════════════════
QUALITY RULES:
════════════════════════════════
- Every paragraph adds NEW value
- No filler sentences
- Specific beats generic
- Real scenarios not hypothetical
- Show expertise naturally
- Include actual helpful tips

════════════════════════════════
META RULES:
════════════════════════════════
- Exactly 150-160 characters
- Contains main keyword
- Has clear benefit
- Has call to action

════════════════════════════════
FAQ RULES:
════════════════════════════════
- Exactly 5 FAQs
- Real questions people Google
- Answers: 80-100 words each
  (longer = more words overall!)
- Keyword in 2+ questions
- Match language to keyword type

Return ONLY valid JSON:
{
  "slug": "url-slug-max-60-chars",
  "title": "Keyword | TempMailin.in",
  "meta": "150-160 chars",
  "content": "1200-1500 word markdown",
  "faqs": [
    {"q": "Question?", "a": "80-100 word answer"}
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