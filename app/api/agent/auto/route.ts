import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SECRET = process.env.AGENT_SECRET!;

// ── CONTENT VARIATION ARRAYS ─────────────────────
const INTRO_STYLES = [
  'Start with a shocking India statistic about spam/privacy',
  'Start with a relatable personal story from Indian user',
  'Start with a question that hits the exact pain point',
  'Start with before vs after comparison',
  'Start with specific real scenario happening in India',
];

const USE_CASE_ANGLES = [
  'Focus on privacy protection angle',
  'Focus on spam prevention angle',
  'Focus on managing multiple accounts',
  'Focus on saving money on free trials',
  'Focus on data breach protection',
];

const STRUCTURE_STYLES = [
  'Use numbered steps throughout article',
  'Use comparison table in middle',
  'Use real examples from India throughout',
  'Mix Hindi phrases naturally throughout',
  'Use problem then solution format',
];

// ── CLUSTER DEFINITIONS WITH SCORES ─────────────
const CLUSTERS = {
  usa: {
    name: 'USA Cluster',
    hub: '/best-temp-mail-usa-2026',
    priority: 10,
    keywords: [
      { kw: 'best disposable email usa 2026', cpc: 9, volume: 8, ease: 6 },
      { kw: 'temp mail for discord usa', cpc: 7, volume: 7, ease: 9 },
      { kw: 'temp mail for spotify usa', cpc: 7, volume: 6, ease: 9 },
      { kw: 'temp mail for chatgpt signup', cpc: 8, volume: 8, ease: 8 },
      { kw: 'temp mail for steam games', cpc: 6, volume: 7, ease: 9 },
      { kw: 'does temp mail work for gmail', cpc: 8, volume: 9, ease: 7 },
      { kw: 'temp mail for roblox free', cpc: 5, volume: 8, ease: 9 },
    ]
  },
  europe: {
    name: 'Europe Cluster',
    hub: '/best-temp-mail-europe-2026',
    priority: 8,
    keywords: [
      { kw: 'best temp mail germany 2026', cpc: 8, volume: 6, ease: 9 },
      { kw: 'disposable email netherlands 2026', cpc: 8, volume: 5, ease: 9 },
      { kw: 'temp mail uk no signup 2026', cpc: 7, volume: 7, ease: 8 },
      { kw: 'temp mail france free 2026', cpc: 7, volume: 5, ease: 9 },
      { kw: 'temp mail spain free', cpc: 6, volume: 5, ease: 9 },
    ]
  },
  instagram: {
    name: 'Instagram Cluster',
    hub: '/temp-mail-for-instagram-india',
    priority: 7,
    keywords: [
      { kw: 'temp mail for instagram india 2026', cpc: 3, volume: 8, ease: 7 },
      { kw: 'how to make multiple instagram accounts india', cpc: 2, volume: 9, ease: 8 },
      { kw: 'instagram without phone number india', cpc: 3, volume: 8, ease: 7 },
      { kw: 'fake instagram account email india', cpc: 3, volume: 7, ease: 8 },
    ]
  },
  global: {
    name: 'Global Cluster',
    hub: '/best-temp-mail-usa-2026',
    priority: 6,
    keywords: [
      { kw: 'does temp mail work 2026', cpc: 5, volume: 9, ease: 7 },
      { kw: 'why temp mail gets blocked', cpc: 4, volume: 7, ease: 9 },
      { kw: 'best temp mail that works 2026', cpc: 6, volume: 9, ease: 7 },
      { kw: 'temp mail without ads 2026', cpc: 5, volume: 7, ease: 8 },
      { kw: 'most reliable temp mail 2026', cpc: 6, volume: 8, ease: 7 },
    ]
  },
  india: {
    name: 'India OTP Cluster',
    hub: '/disposable-email-otp-india',
    priority: 5,
    keywords: [
      { kw: 'temp mail for online shopping india', cpc: 2, volume: 8, ease: 8 },
      { kw: 'fake email for free trial india', cpc: 3, volume: 7, ease: 8 },
      { kw: 'disposable email without phone india', cpc: 2, volume: 7, ease: 8 },
      { kw: 'temp mail for gaming india', cpc: 2, volume: 7, ease: 8 },
      { kw: 'best free temp mail app india', cpc: 2, volume: 8, ease: 7 },
      { kw: 'temp mail for ott platforms india', cpc: 3, volume: 7, ease: 8 },
    ]
  }
};

// ── SEO SCORING ENGINE ───────────────────────────
function scoreKeyword(kw: { cpc: number; volume: number; ease: number }): number {
  return (kw.cpc * 3) + (kw.volume * 2) + kw.ease;
}

// ── CLUSTER SELECTOR (PRIORITY + BALANCE) ────────
function selectCluster(
  existingPages: any[]
): keyof typeof CLUSTERS {

  // Count existing pages per cluster
  const counts: Record<string, number> = {
    usa: 0, europe: 0, instagram: 0,
    global: 0, india: 0
  };

  existingPages.forEach((p: any) => {
    const s = p.slug || '';
    if (s.includes('usa') || s.includes('discord')
      || s.includes('steam') || s.includes('chatgpt')
      || s.includes('roblox') || s.includes('spotify'))
      counts.usa++;
    else if (s.includes('europe') || s.includes('germany')
      || s.includes('netherlands') || s.includes('france')
      || s.includes('spain') || s.includes('uk'))
      counts.europe++;
    else if (s.includes('instagram'))
      counts.instagram++;
    else if (s.includes('india') || s.includes('hindi')
      || s.includes('otp') || s.includes('paytm')
      || s.includes('whatsapp'))
      counts.india++;
    else counts.global++;
  });

  // Score each cluster
  // Higher priority + fewer pages = gets selected
  const scores = Object.entries(CLUSTERS).map(([key, cluster]) => ({
    key,
    score: (cluster.priority * 10) - (counts[key] * 15)
  }));

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  console.log('Cluster scores:', scores);
  return scores[0].key as keyof typeof CLUSTERS;
}

// ── KEYWORD PICKER (SCORED) ──────────────────────
function pickKeyword(
  clusterKey: keyof typeof CLUSTERS,
  existingPages: any[]
): string | null {

  const cluster = CLUSTERS[clusterKey];
  const usedKeywords = existingPages
    .map((p: any) => p.keyword?.toLowerCase())
    .filter(Boolean);

  // Filter available keywords
  const available = cluster.keywords.filter(item => {
    const kw = item.kw.toLowerCase();
    return !usedKeywords.some(used => {
      if (!used) return false;
      // Better overlap detection
      const kwWords = kw.split(' ').filter(w => w.length > 3);
      const usedWords = used.split(' ').filter((w: string) => w.length > 3);
      const matches = kwWords.filter(w => usedWords.includes(w)).length;
      return matches / kwWords.length > 0.5;
    });
  });

  if (available.length === 0) return null;

  // Sort by score - highest first!
  available.sort((a, b) => scoreKeyword(b) - scoreKeyword(a));

  console.log('Top keyword score:', scoreKeyword(available[0]),
    'keyword:', available[0].kw);

  return available[0].kw;
}

// ── INTENT CHECKER ───────────────────────────────
function checkIntent(
  keyword: string,
  existingPages: any[]
): boolean {
  const newWords = keyword.toLowerCase()
    .split(' ')
    .filter(w => w.length > 3);

  for (const page of existingPages) {
    const existing = (page.keyword || page.title || '')
      .toLowerCase()
      .split(' ')
      .filter((w: string) => w.length > 3);

    const matches = newWords.filter(
      w => existing.includes(w)
    ).length;

    if (matches / newWords.length > 0.55) {
      console.log(`Intent overlap: "${keyword}" vs "${page.keyword}"`);
      return false;
    }
  }
  return true;
}

// ── QUALITY GATE ─────────────────────────────────
function validateQuality(article: any): {
  pass: boolean; score: string; reason: string
} {
  const words = article.content?.split(' ').length || 0;

  if (words < 900) {
    return { 
      pass: false, 
      score: '4/10',
      reason: `Only ${words} words - need 900+`
    };
  }
  if (!article.content?.includes('##')) {
    return { 
      pass: false, 
      score: '5/10',
      reason: 'No H2 headings found'
    };
  }
  if (!article.faqs || article.faqs.length < 3) {
    return { 
      pass: false, 
      score: '5/10',
      reason: 'Less than 3 FAQs'
    };
  }
  if (!article.slug) {
    return { 
      pass: false, 
      score: '3/10',
      reason: 'No slug generated'
    };
  }

  const score = words > 1300 ? '9/10' :
    words > 1100 ? '8/10' :
    words > 900 ? '7/10' : '6/10';

  return { 
    pass: true, 
    score,
    reason: `Passed with ${words} words`
  };
}

// ── INTERNAL LINKING ENGINE ──────────────────────
function getInternalLinks(
  clusterKey: keyof typeof CLUSTERS,
  existingPages: any[]
): string[] {
  const cluster = CLUSTERS[clusterKey];

  // Get cluster siblings
  const siblings = existingPages
    .filter((p: any) => {
      const s = p.slug || '';
      if (clusterKey === 'usa')
        return s.includes('usa') || s.includes('disposable');
      if (clusterKey === 'instagram')
        return s.includes('instagram');
      if (clusterKey === 'europe')
        return s.includes('europe') || s.includes('uk')
          || s.includes('germany');
      if (clusterKey === 'india')
        return s.includes('india') || s.includes('otp');
      return true;
    })
    .slice(0, 2)
    .map((p: any) => `/${p.slug}`);

  // Get cross-cluster page (dynamic not always same!)
  const crossCluster = clusterKey === 'india'
    ? '/best-temp-mail-usa-2026'
    : '/disposable-email-otp-india';

  return [
    cluster.hub,
    ...siblings,
    crossCluster
  ].filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 4);
}

// ── MAIN AGENT ───────────────────────────────────
export async function POST(req: Request) {
  try {
    const { secret } = await req.json();
    if (secret !== SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all existing pages
    const { data: existing } = await supabase
      .from('seo_pages')
      .select('slug, keyword, title')
      .order('published_at', { ascending: false });

    const existingPages = existing || [];

    // Recent titles for anti-repetition
    const recentTitles = existingPages
      .slice(0, 5)
      .map((p: any) => p.title)
      .filter(Boolean)
      .join(' | ');

    // ── Select cluster (scored) ──
    const clusterKey = selectCluster(existingPages);
    const cluster = CLUSTERS[clusterKey];

    // ── Pick best keyword ──
    let keyword = pickKeyword(clusterKey, existingPages);

    if (!keyword) {
      // Try other clusters
      for (const key of Object.keys(CLUSTERS)) {
        keyword = pickKeyword(
          key as keyof typeof CLUSTERS,
          existingPages
        );
        if (keyword) break;
      }
    }

    if (!keyword) {
      return NextResponse.json({
        success: false,
        message: 'All keywords exhausted! Add more.',
        total: existingPages.length
      });
    }

    // ── Check intent ──
    if (!checkIntent(keyword, existingPages)) {
      // Find next unique keyword
      const allKws = Object.values(CLUSTERS)
        .flatMap(c => c.keywords.map(k => k.kw));
      keyword = allKws.find(kw =>
        checkIntent(kw, existingPages) &&
        !existingPages.some(p =>
          p.keyword?.toLowerCase() === kw.toLowerCase()
        )
      ) || keyword;
    }

    // ── Get internal links ──
    const internalLinks = getInternalLinks(
      clusterKey, existingPages
    );

    // ── Pick random content style ──
    const introStyle = INTRO_STYLES[
      Math.floor(Math.random() * INTRO_STYLES.length)
    ];
    const useCase = USE_CASE_ANGLES[
      Math.floor(Math.random() * USE_CASE_ANGLES.length)
    ];
    const structure = STRUCTURE_STYLES[
      Math.floor(Math.random() * STRUCTURE_STYLES.length)
    ];

    console.log(`Cluster: ${cluster.name}`);
    console.log(`Keyword: ${keyword}`);
    console.log(`Style: ${introStyle}`);

    // ── Generate with retries ──
    let article = null;
    let attempts = 0;
    let qualityResult = { pass: false, score: '0/10', reason: 'Not checked' };

    while (!article && attempts < 2) {
      attempts++;

      const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        prompt: `
You are an SEO expert writing for tempmailin.in

CLUSTER: ${cluster.name}
KEYWORD: "${keyword}"
RECENT ARTICLES (be different!): ${recentTitles}

WRITING STYLE FOR THIS ARTICLE:
- Intro style: ${introStyle}
- Content angle: ${useCase}
- Structure style: ${structure}

INTERNAL LINKS TO ADD NATURALLY:
${internalLinks.join(', ')}
Add these as natural anchor text links!

RULES:
1. Follow the intro style EXACTLY
2. Minimum 1000 words
3. 5+ H2 headings using ##
4. Natural Hindi if India keyword
5. Pure English if USA/UK/Europe
6. No generic AI phrases
7. Include internal links naturally
8. 5 FAQs that people actually search

STRUCTURE:
## [Hook based on intro style above]
## What is [topic]?
## [Angle from use case above]
## Step by Step Guide
## Pro Tips
## Why TempMailin.in?
## Conclusion

Return ONLY valid JSON:
{
  "slug": "url-slug-max-60",
  "title": "Specific Title | TempMailin.in",
  "meta": "150-160 chars",
  "content": "full markdown article",
  "faqs": [
    {"q": "Question?", "a": "Answer"}
  ]
}
        `
      });

      // Extract JSON safely
      let clean = text.trim()
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const start = clean.indexOf('{');
      const end = clean.lastIndexOf('}');

      if (start === -1 || end === -1) {
        console.log(`Attempt ${attempts}: No JSON found`);
        continue;
      }

      clean = clean.substring(start, end + 1);

      try {
        const parsed = JSON.parse(clean);

        // Auto fix missing fields
        if (!parsed.slug) {
          parsed.slug = keyword
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 60);
        }
        if (!parsed.title) {
          parsed.title = keyword + ' | TempMailin.in';
        }
        if (!parsed.meta) {
          parsed.meta = 'Free temp mail for '
            + keyword.substring(0, 100) + '.';
        }
        if (!Array.isArray(parsed.faqs) || !parsed.faqs.length) {
          parsed.faqs = [
            {
              q: 'What is temp mail?',
              a: 'Free disposable email.'
            },
            {
              q: 'Is tempmailin.in free?',
              a: 'Yes, completely free!'
            },
            {
              q: 'How long does temp mail last?',
              a: 'Auto-deletes in 24 hours.'
            }
          ];
        }

        // Quality gate
        qualityResult = validateQuality(parsed);
        if (qualityResult.pass) {
          article = parsed;
          console.log(`Quality: ${qualityResult.score} ✅`);
        } else {
          console.log(`Quality failed: ${qualityResult.reason}`);
        }

      } catch (e) {
        console.log(`Parse failed attempt ${attempts}`);
      }
    }

    if (!article) {
      return NextResponse.json({
        error: `Quality gate failed: ${qualityResult.reason}`,
        keyword,
        hint: `Last failure: ${qualityResult.reason}`
      }, { status: 500 });
    }

    // Clean slug
    article.slug = article.slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 60);

    // Handle duplicate slug
    const { data: exists } = await supabase
      .from('seo_pages')
      .select('slug')
      .eq('slug', article.slug)
      .single();

    if (exists) {
      article.slug += '-' + Date.now().toString(36);
    }

    // Publish!
    const { error } = await supabase
      .from('seo_pages')
      .insert({
        slug: article.slug,
        title: article.title,
        meta: article.meta,
        content: article.content,
        faqs: article.faqs,
        keyword,
        published_at: new Date().toISOString()
      });

    if (error) throw error;

    const wordCount = article.content.split(' ').length;

    return NextResponse.json({
      success: true,
      cluster: cluster.name,
      keyword,
      slug: article.slug,
      title: article.title,
      wordCount,
      qualityScore: qualityResult.score,
      introStyle,
      internalLinks,
      total: existingPages.length + 1,
      message: `Published: ${article.slug}`
    });

  } catch (error: any) {
    console.error('Agent Error:', error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}