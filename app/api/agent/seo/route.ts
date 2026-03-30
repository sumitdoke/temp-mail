import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const { keyword } = await req.json();

  const { text } = await generateText({
    model: google('gemini-1.5-flash'),
    prompt: `
      You are an expert SEO content writer for an 
      Indian temp mail website called tempmailin.in
      
      Write a complete SEO optimized article for:
      Keyword: "${keyword}"
      
      Requirements:
      - Title (catchy, keyword included)
      - Meta description (under 160 chars)
      - Main article (800+ words)
      - Target Indian users
      - Simple English + some Hindi words
      - Include step by step how to use temp mail
      - FAQ section (5 questions)
      - Natural keyword usage
      
      Return ONLY this JSON format:
      {
        "slug": "url-friendly-slug",
        "title": "Page Title Here",
        "meta": "Meta description here",
        "content": "Full article content here",
        "faqs": [
          {"q": "Question?", "a": "Answer"}
        ]
      }
    `
  });

  // Clean and parse response
  const clean = text.replace(/```json|```/g, '').trim();
  const article = JSON.parse(clean);
  

  return NextResponse.json(article);
}