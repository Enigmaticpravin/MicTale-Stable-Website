import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { upsertPoem, getPoemBySlug } from '@/app/lib/poems'
import { poemSlug } from '@/app/lib/slugify'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  const poem = await getPoemBySlug(slug)
  return NextResponse.json(poem || null)
}

export async function POST(req) {
  const body = await req.json()
  const { title, author, category = 'poem', lines, language = 'hi', excerpt, publishedAt } = body

  const slug = poemSlug({ title, author, category })
  const poem = {
    slug,
    title,
    author,
    category,
    createdAt: new Date().toISOString(),
    lines,
    language,
    excerpt,
    publishedAt: publishedAt || new Date().toISOString()
  }

  await upsertPoem(poem)

  revalidateTag('poems')
  revalidateTag(`poem:${slug}`)
  revalidatePath(`/poem/${slug}`)
  revalidatePath('/sitemap.xml')

  return NextResponse.json({ ok: true, slug })
}
