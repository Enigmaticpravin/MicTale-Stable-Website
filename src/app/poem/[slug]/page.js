import React from 'react'
import { notFound } from 'next/navigation'
import { getPoemBySlug } from '@/app/lib/poems'
import {
  db,
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  getDocs
} from '@/app/lib/firebase'
import PoemPageClient from './PoemPageClient'
import Script from 'next/script'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = params
  const poem = await getPoemBySlug(slug)
  if (!poem) return { title: 'Poem not found' }

  const title = `${poem.title} by ${poem.author} | ${poem.category} Poem`
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/poem/${slug}`
const description = poem.lines?.slice(0, 2).join(' ') 
  || `${poem.title} by ${poem.author} | Read full poem at MicTale`


  return {
    title,
    description,
    alternates: { canonical: url },
    other: {
    "description": description
  },
    keywords: [
      poem.title,
      poem.author,
      poem.category,
      `${poem.title} ${poem.author}`,
      `${poem.author} poetry`,
      `${poem.category} poem`
    ],
    authors: [{ name: poem.author }],
    robots: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: 'large',
      maxVideoPreview: -1
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'MicTale',
      authors: [poem.author],
      publishedTime: poem.createdAt || undefined,
      images: [
        {
          url: 'https://i.imgur.com/YFpScQU.png',
          width: 1200,
          height: 630,
          alt: `${poem.title} by ${poem.author}`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: 'https://i.imgur.com/YFpScQU.png'
    }
  }
}


function buildShersFromContent (content = '') {
  if (!content) return []
  const raw = content
    .split(/।\s*|\r?\n/)
    .map(s => s.trim())
    .filter(Boolean)
  const shers = []
  for (let i = 0; i < raw.length; i += 2) {
    const first = raw[i] || ''
    const second = raw[i + 1] || ''
    shers.push({ first, second })
  }
  return shers
}

function toPlain (d) {
  if (!d) return d
  const out = {}
  for (const [k, v] of Object.entries(d)) {
    if (v && typeof v.toDate === 'function') {
      try {
        out[k] = v.toDate().toISOString()
      } catch {
        out[k] = String(v)
      }
    } else if (Array.isArray(v)) {
      out[k] = v.map(x =>
        x && typeof x.toDate === 'function' ? x.toDate().toISOString() : x
      )
    } else {
      out[k] = v
    }
  }
  return out
}

async function fetchSimilarPoems ({ author, category, excludeSlug, limit = 4 }) {
  const poemsRef = collection(db, 'poems')
  const collected = new Map()

  async function runAndCollect (q) {
    try {
      const snap = await getDocs(q)
      for (const doc of snap.docs) {
        const data = doc.data()
        const slug = data.slug || doc.id
        if (!slug || slug === excludeSlug) continue
        if (collected.has(slug)) continue

        const plain = toPlain({
          id: doc.id,
          slug,
          title: data.title,
          author: data.author || data.poet,
          excerpt: data.excerpt,
          createdAt: data.createdAt
        })
        collected.set(slug, plain)
        if (collected.size >= limit) break
      }
    } catch (e) {}
  }

  if (author) {
    const qAuthor = query(
      poemsRef,
      where('author', '==', author),
      orderBy('createdAt', 'desc'),
      fbLimit(limit)
    )
    await runAndCollect(qAuthor)
  }

  if (collected.size < limit && category) {
    const qCat = query(
      poemsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc'),
      fbLimit(limit)
    )
    await runAndCollect(qCat)
  }

  if (collected.size < limit) {
    const qRecent = query(
      poemsRef,
      orderBy('createdAt', 'desc'),
      fbLimit(limit * 2)
    )
    await runAndCollect(qRecent)
  }

  const arr = Array.from(collected.values())
    .sort((a, b) => {
      const aTs = a.createdAt ? Date.parse(a.createdAt) : 0
      const bTs = b.createdAt ? Date.parse(b.createdAt) : 0
      return bTs - aTs
    })
    .slice(0, limit)

  return arr
}

export default async function PoemPage ({ params }) {
  const { slug } = params
  const poem = await getPoemBySlug(slug)
  if (!poem) notFound()

  const title = poem.title || ''
  const author = poem.author || poem.poet || ''
  const category = (poem.category || '').toString()
  const content =
    typeof poem.content === 'string' && poem.content
      ? poem.content
      : Array.isArray(poem.lines)
      ? poem.lines.join('\n')
      : ''
  const isGhazal = category.toLowerCase().includes('ghazal')
  const shers = isGhazal ? buildShersFromContent(content) : []

  const similar = await fetchSimilarPoems({
    author,
    category,
    excludeSlug: slug,
    limit: 4
  })

  return (
    <>
     <PoemPageClient 
      poem={{
        title,
        author,
        category,
        content,
        isGhazal,
        shers
      }}
      similar={similar}
    />
      <Script id="ld-json" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Poem",
          "name": title,
          "author": {
            "@type": "Person",
            "name": author
          },
          "genre": category,
          "inLanguage": "hi",
          "datePublished": poem.createdAt || "",
          "url": `${process.env.NEXT_PUBLIC_BASE_URL}/poem/${slug}`,
          "publisher": {
            "@type": "Organization",
            "name": "MicTale",
            "url": process.env.NEXT_PUBLIC_BASE_URL
          },
          "text": content
        })}
      </Script>
    </>
  )
}