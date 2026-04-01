import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

const SECRET = process.env.AGENT_SECRET || 'tempmail2026';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Add secret protection!
    if (body.secret !== SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { keyword } = body;

    // Validate keyword
    if (!keyword || keyword.length > 100) {
      return NextResponse.json(
        { error: 'Invalid keyword' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `
        You are an SEO content writer for
        tempmailin.in - Indian temp mail website.
        
        Write SEO article for: "${keyword}"
        
        Return ONLY valid JSON no markdown:
        {
          "slug": "url-slug-here",
          "title": "Title Here",
          "meta": "Under 160 chars",
          "content": "800+ words",
          "faqs": [
            {"q": "Question?", "a": "Answer"}
          ]
        }
      `
    });

    let clean = text.trim()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const article = JSON.parse(clean);
    return NextResponse.json(article);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}