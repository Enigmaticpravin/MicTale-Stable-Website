import { notFound } from 'next/navigation'
import { db, collection, query, where, getDocs } from '@/app/lib/firebase'
import PoemListClient from './PoemListClient'

import Footer from '@/app/components/Footer'

export const revalidate = 60

export async function generateMetadata ({ params }) {
  const { slug } = params
  const author = await fetchAuthorBySlug(slug)
  if (!author) return { title: 'Poet not found' }

  const title = `${author.name} — Poems, biography and collection`
  const description = author.bio
    ? `${author.bio.slice(0, 140)}... Read poems and biography of ${
        author.name
      } on MicTale.`
    : `Read poems by ${author.name} on MicTale.`
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/poet/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: author.name }],
    keywords: [
      author.name,
      'poems',
      'shayari',
      'ghazal',
      `${author.name} poems`
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: 'MicTale',
      type: 'profile',
      images: author.image
        ? [author.image]
        : [{ url: 'https://i.imgur.com/YFpScQU.png' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: author.image || 'https://i.imgur.com/YFpScQU.png'
    },
    robots: { index: true, follow: true }
  }
}

async function fetchAuthorBySlug (slug) {
  try {
    const poetsRef = collection(db, 'poets')
    const q = query(poetsRef, where('slug', '==', slug))
    const snap = await getDocs(q)
    if (snap.empty) return null
    const doc = snap.docs[0].data()
    return {
      name: doc.name || slug.replace('-', ' '),
      slug: doc.slug || slug,
      bio: doc.bio || '',
      image: doc.image || null,
      createdAt: doc.createdAt ? doc.createdAt.toDate().toISOString() : null
    }
  } catch (e) {
    console.error('fetchAuthorBySlug error:', e)
    return null
  }
}

async function fetchPoemsByAuthor (authorName, limit = 50) {
  try {
    const poemsRef = collection(db, 'poems')
    const q = query(poemsRef, where('author', '==', authorName))
    const snap = await getDocs(q)

    let poems = snap.docs.map(d => {
      const data = d.data()
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt
      }
    })

    poems = poems.sort((a, b) => {
      const aTs = a.createdAt ? Date.parse(a.createdAt) : 0
      const bTs = b.createdAt ? Date.parse(b.createdAt) : 0
      return bTs - aTs
    })

    return poems.slice(0, limit)
  } catch (e) {
    console.error('fetchPoemsByAuthor error:', e)
    return []
  }
}

function buildJsonLd (author, poems, baseUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: author.name,
      url: `${baseUrl}/poet/${author.slug}`,
      description: author.bio || undefined,
      image: author.image || undefined
    },
    hasPart: {
      '@type': 'CreativeWorkSeason',
      name: `Poems by ${author.name}`,
      url: `${baseUrl}/poet/${author.slug}`,
      workExample: poems.map(p => ({
        '@type': 'CreativeWork',
        name: p.title || p.slug || p.id,
        url: `${baseUrl}/poem/${p.slug || p.id}`,
        datePublished: p.createdAt || undefined
      }))
    }
  }
}

export default async function PoetProfilePage ({ params }) {
  const { slug } = params
  const author = await fetchAuthorBySlug(slug)
  if (!author) notFound()

  const poems = await fetchPoemsByAuthor(author.name)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  const jsonLd = buildJsonLd(author, poems, baseUrl)

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
        <PoemListClient poems={poems} author={author} />
      
        <Footer />
    </>
  )
}
