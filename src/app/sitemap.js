import { getAllPoemSlugs } from '@/lib/poems'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL
  const poems = await getAllPoemSlugs()

  return [
    { url: `${base}/`, lastModified: new Date() },
    ...poems.map(p => ({
      url: `${base}/poem/${p.slug}`,
      lastModified: p.updatedAt || new Date()
    }))
  ]
}
