import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  try {
    const { keyword } = await req.json();

    const { text } = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `
        You are an SEO content writer for 
        tempmailin.in - an Indian temp mail website.
        
        Write SEO article for: "${keyword}"
        
        Return ONLY valid JSON, no markdown, no backticks:
        {
          "slug": "url-slug-here",
          "title": "Title Here",
          "meta": "Meta description under 160 chars",
          "content": "Full article 800+ words",
          "faqs": [
            {"q": "Question?", "a": "Answer here"}
          ]
        }
      `
    });

    let clean = text.trim();
    clean = clean.replace(/```json/g, '');
    clean = clean.replace(/```/g, '');
    clean = clean.trim();

    const article = JSON.parse(clean);
    return NextResponse.json(article);

  } catch (error: any) {
    console.error('SEO Agent Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}