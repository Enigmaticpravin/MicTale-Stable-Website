import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { upsertPoem, getPoemBySlug } from '@/app/lib/poems'
import { poemSlug } from '@/app/lib/slugify'
import { submitToGoogleIndexing } from '@/app/lib/googleIndexing'

export async function GET (req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  const poem = await getPoemBySlug(slug)

  return NextResponse.json(poem || null)
}

export async function POST (req) {
  try {
    const body = await req.json()

    const {
      title,
      author,
      category = 'poem',
      lines,
      language = 'hi',
      excerpt,
      publishedAt
    } = body

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

    const url = `https://mictale.in/poem/${slug}`

    submitToGoogleIndexing(url)

    revalidateTag('poems')
    revalidateTag(`poem:${slug}`)
    revalidatePath(`/poem/${slug}`)
    revalidatePath('/sitemap.xml')

    const sitemapUrl = 'https://mictale.in/sitemap.xml'

    try {
      await Promise.all([
        fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`),
        fetch(`https://www.bing.com/ping?sitemap=${sitemapUrl}`)
      ])
    } catch (e) {
      console.log('Ping failed (non-blocking):', e.message)
    }

    return NextResponse.json({ ok: true, slug })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
