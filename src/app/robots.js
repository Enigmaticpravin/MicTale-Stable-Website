export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/'],
    },
    sitemap: 'https://mictale.in/sitemap.xml',
    host: 'https://mictale.in'
  }
}