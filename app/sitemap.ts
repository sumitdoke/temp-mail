import { createClient } from '@supabase/supabase-js';
import { MetadataRoute } from 'next';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): 
  Promise<MetadataRoute.Sitemap> {
  
  const baseUrl = 'https://tempmailin-psi.vercel.app';

  // Get all SEO pages
  const { data: pages } = await supabase
    .from('seo_pages')
    .select('slug, published_at');

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Dynamic SEO pages
  const dynamicPages = pages?.map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || [];

  return [...staticPages, ...dynamicPages];
}