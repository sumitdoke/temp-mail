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
    "temp mail for phonepe india",
    "temp mail for swiggy india",
    "temp mail for meesho india",
    "temp mail for hotstar india",
    "temp mail for cred india",
    "temp mail for rapido india",
    "temp mail for zomato india",
    "temp mail for myntra india",
    "temp mail for flipkart india",
    "temp mail for amazon india",
    "temp mail for jiocinema india",
    "temp mail for whatsapp india",
    "temp mail for telegram india",
    "temp mail for youtube india",
    "temp mail for spotify india",
    "temp mail for gpay india",
    "temp mail for paytm india",
    "temp mail for groww india",
    "temp mail for blinkit india",
    "temp mail for zepto india",
    "temp mail for nykaa india",
    "temp mail for ajio india",
    "temp mail for ola india",
    "temp mail for uber india",
    "temp mail for sonyliv india",
    "disposable email for otp india",
    "fake email generator india 2026",
    "temp mail hindi",
    "best temp mail india 2026",
    "free temporary email india"
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
            .replace(/'''json/g, '')
            .replace(/'''/g, '')
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