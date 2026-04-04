import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/test', '/api/'],
    },
    sitemap: 'https://tempmailin-psi.vercel.app/sitemap.xml',
  };
}