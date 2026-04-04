import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Cache 1 hour

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
      .select('slug, published_at')
      .order('published_at', { ascending: false });

    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
    ];

    const dynamicPages: MetadataRoute.Sitemap =
      pages?.map(page => ({
        url: `${baseUrl}/${page.slug}`,
        lastModified: new Date(page.published_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) || [];

    return [...staticPages, ...dynamicPages];

  } catch (error) {
    // Return at least static pages if DB fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}