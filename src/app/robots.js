export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/', '/success', '/failure', '/add-poem', '/lib', '/add-poet', '/show'],
    },
    sitemap: 'https://mictale.in/sitemap.xml',
    host: 'https://mictale.in'
  }
}