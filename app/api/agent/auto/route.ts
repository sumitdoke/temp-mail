import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

// Pre-researched keywords — no API call needed!
// Agent already researched these — best India keywords 
const KEYWORDS = [


    // ── Instagram (Already working!) ────────────
    "temp mail for instagram",
    "temp mail for multiple instagram accounts",
    "temp mail for instagram verification",
    "temp mail for instagram reels",
    "fake email for instagram signup",

    // ── USA Traffic (Highest CPM!) ──────────────
    "best temp mail usa 2026",
    "temporary email address usa free",
    "disposable email for amazon usa",
    "temp mail for netflix usa",
    "fake email generator usa",
    "temp mail no registration usa",
    "throwaway email address usa",
    "burner email address usa",
    "temp mail for paypal usa",
    "disposable email for reddit usa",

    // ── UK Traffic (67% US CPM) ─────────────────
    "temp mail uk free 2026",
    "disposable email uk no signup",
    "temporary email address uk",
    "fake email uk free",
    "temp mail for amazon uk",
    "burner email uk",
    "throwaway email uk",
    "temp mail for ebay uk",

    // ── Canada Traffic (62% US CPM) ─────────────
    "temp mail canada free",
    "disposable email canada",
    "temporary email canada no signup",
    "fake email address canada",
    "temp mail for amazon canada",

    // ── Australia Traffic (59% US CPM) ──────────
    "temp mail australia free",
    "disposable email australia",
    "temporary email address australia",
    "fake email australia",
    "temp mail for netflix australia",

    // ── Germany Traffic ─────────────────────────
    "temp mail germany free",
    "disposable email germany",
    "temporary email address germany",
    "wegwerf email kostenlos 2026",

    // ── Global High Traffic ──────────────────────
    "best free temp mail 2026",
    "temp mail without phone number",
    "disposable email address free",
    "10 minute mail alternative 2026",
    "guerrilla mail alternative 2026",
    "temp mail that works 2026",
    "fake email address generator free",
    "temporary email no verification",
    "instant temp mail free",
    "temp mail for social media",

    // ── Use Case Specific (High Intent) ─────────
    "temp mail for free trial",
    "temp mail for discord",
    "temp mail for reddit",
    "temp mail for spotify",
    "temp mail for steam",
    "temp mail for roblox",
    "temp mail for gaming",
    "temp mail for tiktok",
    "temp mail for twitter",
    "temp mail for linkedin",
    "temp mail for github",
    "temp mail for chatgpt",
    "temp mail for openai",
    "temp mail for microsoft",


    // ── India Specific ───────────────────────────
    "temp mail for phonepe india",
    "temp mail for swiggy india",
    "temp mail for meesho india",
    "temp mail for hotstar india",
    "temp mail for cred india",
    "temp mail for zomato india",
    "temp mail for myntra india",
    "temp mail for flipkart india",
    "temp mail for amazon india",
    "temp mail for jiocinema india",
    "temp mail for whatsapp india",
    "temp mail for telegram india",
    "temp mail for youtube india",
    "temp mail for gpay india",
    "temp mail for paytm india",
    "temp mail for groww india",
    "temp mail for blinkit india",
    "temp mail for rapido india",
    "disposable email for otp india",
    "temp mail hindi 2026",
    "best temp mail india 2026",
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
            .select('keyword');

        const doneKeywords = existing?.map(
            (p: any) => p.keyword?.toLowerCase().trim()
        ) || [];

        // Find next keyword
        const nextKeyword = KEYWORDS.find(
            k => !doneKeywords.includes(k.toLowerCase().trim())
        );

        if (!nextKeyword) {
            return NextResponse.json({
                success: true,
                message: 'All keywords done!',
                total: doneKeywords.length
            });
        }

        // Write article — ONE Gemini call only
        const { text } = await generateText({
            model: google('gemini-2.5-flash-lite'),
            prompt: `
        SEO writer for tempmailin.in India temp mail site.
        Write article for: "${nextKeyword}"
        Mix English + Hindi words naturally.
        Return ONLY JSON no markdown:
        {
          "slug": "url-slug",
          "title": "Title in Hindi/English mix",
          "meta": "under 160 chars",
          "content": "600+ words",
          "faqs": [
            {"q": "Question?", "a": "Answer"}
          ]
        }
      `
        });

        // Clean JSON
        let clean = text.trim()
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const article = JSON.parse(clean);

        // Handle duplicate slug
        const { data: exists } = await supabase
            .from('seo_pages')
            .select('slug')
            .eq('slug', article.slug)
            .single();

        if (exists) {
            article.slug = `${article.slug}-${Date.now()}`;
        }

        // Save to Supabase
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
            total: doneKeywords.length + 1
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}