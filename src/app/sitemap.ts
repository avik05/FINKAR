import { MetadataRoute } from 'next'

/**
 * Dynamic Sitemap Generator for Finkar Dashboard
 * Includes only public-facing marketing and legal pages for optimal SEO.
 * Authenticated/Private routes (dashboard, analytics, etc.) are strictly excluded
 * to prevent Google Search Console indexing errors.
 * 
 * Target: Google Search Console (getfinkar.com/sitemap.xml)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://getfinkar.com'
  const currentDate = new Date().toISOString()

  // Use a map to simplify the configuration
  const routes = [
    { path: "", priority: 1, changeFreq: "daily" },
    { path: "/about", priority: 0.8, changeFreq: "monthly" },
    { path: "/contact", priority: 0.5, changeFreq: "monthly" },
    { path: "/faq", priority: 0.5, changeFreq: "monthly" },
    { path: "/login", priority: 0.3, changeFreq: "yearly" },
    { path: "/privacy", priority: 0.2, changeFreq: "yearly" },
    { path: "/terms", priority: 0.2, changeFreq: "yearly" },
    { path: "/license", priority: 0.2, changeFreq: "yearly" },
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFreq as any,
    priority: route.priority,
  }))
}
