import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'], // Protect admin portal from public crawler indexing
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
