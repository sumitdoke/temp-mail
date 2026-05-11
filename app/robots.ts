import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/test'],
        crawlDelay: 1,
      },
    ],

    sitemap: 'https://tempmailin-psi.vercel.app/sitemap.xml',

    host: 'https://tempmailin-psi.vercel.app',
  };
}