import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // 1 hour cache

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {

  const baseUrl = 'https://tempmailin-psi.vercel.app';

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: pages } = await supabase
      .from('seo_pages')
      .select('slug, updated_at, published_at, published')
      .eq('published', true)
      .order('published_at', { ascending: false });

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'daily',
        priority: 1,
      },

      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'monthly',
        priority: 0.3,
      },

      {
        url: `${baseUrl}/terms`,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'monthly',
        priority: 0.3,
      },

      {
        url: `${baseUrl}/best-temp-mail-india-2026`,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'weekly',
        priority: 0.9,
      },

      {
        url: `${baseUrl}/best-temp-mail-usa-2026`,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'weekly',
        priority: 0.9,
      },
    ];

    const dynamicPages: MetadataRoute.Sitemap =
      pages?.map((page) => ({
        url: `${baseUrl}/${page.slug}`,

        lastModified: new Date(
          page.updated_at || page.published_at
        ),

        changeFrequency: 'weekly' as const,

        priority:
          page.slug.includes('best-temp-mail')
            ? 0.9
            : page.slug.includes('instagram')
            ? 0.8
            : 0.7,
      })) || [];

    return [...staticPages, ...dynamicPages];

  } catch (error) {

    return [
      {
        url: baseUrl,
        lastModified: new Date('2026-05-01'),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}