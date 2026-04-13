import { listPoemSlugs } from '@/app/lib/poems'
import { listPoetSlugs } from '@/app/lib/poets'

export const revalidate = 300

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.mictale.in"

  let poems = []
  let poets = []

  try {
    poems = await listPoemSlugs()
  } catch (e) {
    console.error("SITEMAP POEMS FAIL:", e)
  }

  try {
    poets = await listPoetSlugs()
  } catch (e) {
    console.error("SITEMAP POETS FAIL:", e)
  }

  const staticRoutes = [
    "",
    "about",
    "treasury",
    "privacy-policy",
    "terms-and-conditions",
  ].map(path => ({
    url: `${base}/${path}`,
    lastModified: new Date(),
  }))

  const poemRoutes = (poems || []).map(p => ({
    url: `${base}/poem/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  const poetRoutes = (poets || []).map(p => ({
    url: `${base}/poet/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }))

  return [
    ...staticRoutes,
    ...poemRoutes,
    ...poetRoutes,
  ]
}