import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { data } = await supabase
    .from('seo_pages')
    .select('title, meta')
    .eq('slug', slug)
    .single();

  if (!data) return { title: 'TempMail.in' };

  return {
    title: data.title,
    description: data.meta
  };
}

export default async function SEOPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  const { data: page } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!page) return notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <a href="/" className="text-blue-400 font-bold text-xl">
            ⚡ TempMail.in
          </a>
          <a href="/"
            className="bg-blue-600 text-white px-3 py-1 
            rounded-lg text-sm">
            Get Free Email →
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {page.title}
        </h1>

        {/* Tool embedded — users can use immediately */}
        <div className="bg-blue-950 border border-blue-800 
          rounded-2xl p-6 mb-8">
          <p className="text-blue-300 text-sm mb-3">
            🚀 Get your free temp mail instantly:
          </p>
          <a href="/"
            className="block bg-blue-600 hover:bg-blue-700 
            text-white text-center py-3 rounded-xl 
            font-bold transition-all">
            Generate Free Temp Mail Now →
          </a>
        </div>

        {/* Article Content */}
        <div className="text-gray-300 text-sm leading-relaxed
          whitespace-pre-wrap mb-8">
          {page.content}
        </div>

        {/* FAQ Section */}
        {page.faqs && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq: any, i: number) => (
                <div key={i}
                  className="bg-gray-900 rounded-xl p-4 
                  border border-gray-800">
                  <p className="font-semibold text-white mb-2">
                    {faq.q}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gray-900 rounded-2xl p-6 
          text-center border border-gray-800">
          <p className="text-white font-bold mb-2">
            Ready to protect your privacy?
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Get free disposable email in 1 click
          </p>
          <a href="/"
            className="bg-blue-600 hover:bg-blue-700 
            text-white px-6 py-3 rounded-xl 
            font-bold transition-all inline-block">
            Get Free Temp Mail →
          </a>
        </div>

      </div>
    </main>
  );
}