import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/out/'],
      },
    ],
    sitemap: 'https://genz-tech.in/sitemap.xml',
  };
}
