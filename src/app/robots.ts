import { MetadataRoute } from 'next'

/**
 * Dynamic Robots.txt Generator for Finkar Dashboard
 * Helps search engines discover the sitemap while excluding restricted app zones.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://getfinkar.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow all authenticated-only routes
      disallow: [
        '/dashboard/', 
        '/analytics/', 
        '/stocks/', 
        '/mutual-funds/', 
        '/banks/', 
        '/expenses/', 
        '/goals/', 
        '/settings/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
