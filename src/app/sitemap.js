import { listPoemSlugs } from '@/app/lib/poems'
import { listBlogSlugs } from '@/app/lib/blogs'
import { listPoetSlugs } from '@/app/lib/poets'

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.mictale.in"

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

  const poems = await listPoemSlugs()
  const poemRoutes = poems.map(p => ({
    url: `${base}/poem/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
  }))

  const blogs = await listBlogSlugs()
  const blogRoutes = blogs.map(b => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: b.updatedAt || new Date(),
  }))

  const poets = await listPoetSlugs()
  const poetRoutes = poets.map(p => ({
    url: `${base}/poet/${p.slug}`,
    lastModified: p.updatedAt || new Date(),
  }))

  return [
    ...staticRoutes,
    ...poemRoutes,
    ...blogRoutes,
    ...poetRoutes,
  ]
}
