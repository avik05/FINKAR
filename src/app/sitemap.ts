import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generator for Finkar Dashboard
 * Includes only public-facing marketing pages for optimal SEO.
 * Authenticated/Private routes (dashboard, analytics, etc.) are strictly excluded.
 * 
 * Target: Google Search Console (getfinkar.com/sitemap.xml)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://getfinkar.com'

  // Only include high-level public marketing pages
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
