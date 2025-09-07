export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/', '/success', '/failure', '/add-poem', '/lib'],
    },
    sitemap: 'https://mictale.in/sitemap.xml',
    host: 'https://mictale.in'
  }
}