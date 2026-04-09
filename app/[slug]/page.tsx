import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import AdUnit from '../components/AdUnit';

// Cache page for 1 hour, revalidate automatically
export const revalidate = 3600;

const BASE_URL = 'https://tempmailin-psi.vercel.app';

// Supabase client
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Generate Metadata (SEO) ───────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = getSupabase();

  const { data } = await supabase
    .from('seo_pages')
    .select('title, meta, published_at')
    .eq('slug', slug)
    .single();

  if (!data) {
    return {
      title: 'Page Not Found — TempMailin.in',
      description: 'This page could not be found.'
    };
  }

  return {
    // Title and description
    title: data.title,
    description: data.meta,

    // Keywords
    keywords: [
      'temp mail',
      'temporary email',
      'disposable email',
      'fake email india',
      slug.replace(/-/g, ' ')
    ],

    // Canonical URL — prevents duplicate content!
    alternates: {
      canonical: `${BASE_URL}/${slug}`
    },

    // Robots — tell Google to index this page
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      }
    },

    // Open Graph — for social sharing
    openGraph: {
      title: data.title,
      description: data.meta,
      url: `${BASE_URL}/${slug}`,
      siteName: 'TempMailin.in',
      locale: 'en_IN',
      type: 'article',
      publishedTime: data.published_at,
      authors: ['TempMailin.in'],
    },

    // Twitter card
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.meta,
      site: '@tempmailin',
    },
  };
}

// ── Main Page Component ───────────────────────────────
export default async function SEOPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = getSupabase();

  // Fetch page data
  const { data: page } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  // 404 if page not found
  if (!page) return notFound();



  // ── Schema Markup (JSON-LD) ───────────────────────

  // FAQ Schema — shows FAQs in Google results!
  const faqSchema = page.faqs && page.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": page.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  } : null;

  // Article Schema — tells Google this is an article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": page.title,
    "description": page.meta,
    "url": `${BASE_URL}/${slug}`,
    "datePublished": page.published_at,
    "dateModified": page.published_at,
    "author": {
      "@type": "Organization",
      "name": "TempMailin.in",
      "url": BASE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": "TempMailin.in",
      "url": BASE_URL
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/${slug}`
    }
  };

  // Breadcrumb Schema — shows path in Google results
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": page.title,
        "item": `${BASE_URL}/${slug}`
      }
    ]
  };

  // Website Schema — for homepage authority
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TempMailin.in",
    "url": BASE_URL,
    "description": "Free disposable temporary email service for India",
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${BASE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* ── Schema Markup ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-blue-400 font-bold text-xl">
            ⚡ TempMailin.in
          </a>
          <a
            href="/"
            className="bg-blue-600 hover:bg-blue-700
              text-white px-3 py-1 rounded-lg text-sm
              transition-all"
          >
            Get Free Email →
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* ── Breadcrumb Navigation ── */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-2 
            text-xs text-gray-600">
            <li>
              <a
                href="/"
                className="hover:text-blue-400 transition-colors"
              >
                Home
              </a>
            </li>
            <li className="text-gray-700">→</li>
            <li className="text-gray-400 truncate max-w-xs">
              {page.title}
            </li>
          </ol>
        </nav>

        {/* ── Page Title (H1) ── */}
        <h1 className="text-2xl font-bold text-white mb-2">
          {page.title}
        </h1>

        {/* ── Published Date ── */}
        <p className="text-gray-600 text-xs mb-6">
          Published:{' '}
          {new Date(page.published_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>

        {/* ── Tool CTA (embedded above content) ── */}
        <div className="bg-blue-950 border border-blue-800
          rounded-2xl p-6 mb-8">
          <p className="text-blue-300 text-sm mb-1 font-medium">
            🚀 Try it instantly — no signup needed!
          </p>
          <p className="text-gray-400 text-xs mb-3">
            Generate your free temp mail in 1 click
          </p>
          <a
            href="/"
            className="block bg-blue-600 hover:bg-blue-700
              text-white text-center py-3 rounded-xl
              font-bold transition-all text-sm"
          >
            ⚡ Generate Free Temp Mail Now →
          </a>
        </div>

        {/* ── Article Content (Markdown Rendered) ── */}
        <article className="mb-8">
          <div className="text-gray-300 text-sm leading-relaxed">
            <ReactMarkdown
              components={{
                // H1 — main heading
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold
                    text-white mt-6 mb-3">
                    {children}
                  </h1>
                ),


                // H2 — section headings
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold
                    text-white mt-6 mb-3 pb-1
                    border-b border-gray-800">
                    {children}
                  </h2>
                ),
                // H3 — sub headings
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold
                    text-blue-400 mt-4 mb-2">
                    {children}
                  </h3>
                ),
                // Paragraphs
                p: ({ children }) => (
                  <p className="text-gray-300 mb-4
                    leading-relaxed">
                    {children}
                  </p>
                ),
                // Bold text
                strong: ({ children }) => (
                  <strong className="text-white font-bold">
                    {children}
                  </strong>
                ),
                // Italic
                em: ({ children }) => (
                  <em className="text-blue-300 italic">
                    {children}
                  </em>
                ),
                // Unordered lists
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4
                    text-gray-300 space-y-1">
                    {children}
                  </ul>
                ),
                // Ordered lists
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4
                    text-gray-300 space-y-1">
                    {children}
                  </ol>
                ),
                // List items
                li: ({ children }) => (
                  <li className="text-gray-300 leading-relaxed">
                    {children}
                  </li>
                ),
                // Blockquotes
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4
                    border-blue-600 pl-4 my-4
                    text-gray-400 italic">
                    {children}
                  </blockquote>
                ),
                // Code blocks
                code: ({ children }) => (
                  <code className="bg-gray-800 text-blue-300
                    px-2 py-1 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                // Horizontal rule
                hr: () => (
                  <hr className="border-gray-800 my-6" />
                ),
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-blue-400 hover:text-blue-300
                      underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {page.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* ad  */}
        <AdUnit
          adKey="285f7a3a830b78ba2bc47f294129ec09"
          height={250}
          width={300}
          uniqueId="content-ad"
        />


        {/* ── Middle CTA ── */}
        <div className="bg-gray-900 border border-gray-800
          rounded-2xl p-5 mb-8 text-center">
          <p className="text-white font-semibold mb-1">
            Ready to protect your privacy?
          </p>
          <p className="text-gray-500 text-xs mb-3">
            Free temp mail — works instantly
          </p>
          <a
            href="/"
            className="inline-block bg-blue-600
              hover:bg-blue-700 text-white px-6 py-2
              rounded-xl font-bold transition-all text-sm"
          >
            Get Free Temp Mail →
          </a>
        </div>

        {/* Ad before FAQ */}
        {/* <AdUnit
          adKey="285f7a3a830b78ba2bc47f294129ec09"
          height={250}
          width={300}
          uniqueId="faq-ad-2"
        />
         */}

        <AdUnit
          adKey="8417fd24a6f755b707c66c5e90f75362"
          height={50}
          width={320}
          uniqueId="home-mobile-ad"
        />

        {/* ── FAQ Section ── */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq: any, i: number) => (
                <div
                  key={i}
                  className="bg-gray-900 rounded-xl p-4
                    border border-gray-800"
                >
                  <h3 className="font-semibold text-white mb-2 text-sm">
                    {faq.q}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom CTA ── */}
        <div className="bg-gradient-to-r from-blue-900
          to-purple-900 rounded-2xl p-6 text-center
          border border-blue-800 mb-8">
          <p className="text-white font-bold text-lg mb-1">
            ⚡ Try TempMailin.in Free!
          </p>
          <p className="text-blue-300 text-sm mb-4">
            No signup • No ads • Auto-deletes in 24hrs
          </p>
          <a
            href="/"
            className="inline-block bg-white text-blue-900
              px-8 py-3 rounded-xl font-bold
              hover:bg-blue-50 transition-all"
          >
            Generate Free Email Now 🚀
          </a>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center text-gray-700
          text-xs pb-8">
          <p className="mb-2">
            Made for India 🇮🇳 • Auto-deletes in 24hrs
            • No signup required
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/privacy"
              className="hover:text-gray-500 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="hover:text-gray-500 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/"
              className="hover:text-gray-500 transition-colors"
            >
              Home
            </a>
          </div>
        </footer>

      </div>
    </main>
  );
}