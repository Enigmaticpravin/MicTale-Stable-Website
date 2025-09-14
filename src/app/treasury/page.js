// app/treasury/page.js  (replace your existing Treasury page file)
import TreasuryClient from './TreasuryClient'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { toPlain } from '../lib/firestorePlain'
import LatestBlogsShowcase from '../components/LatestBlogsShowcase'
import InstagramGrid from '../components/InstagramGrid'
import MetallicFeatureCard from '../components/SubmitPoetry'
import Footer from '../components/Footer'

export const revalidate = 60 // ISR: rebuild every 60s

export const metadata = {
  title: 'Treasury: The Home of Finest Poetry | MicTale',
  description:
    'Explore Treasury, the finest poetry collection, featuring authentic Ghazals, beautiful Matlas, and contemporary Nazms. Submit your poetry, discover new poets, and join our thriving literary community at MicTale.',
  keywords: [
    'poetry gallery',
    'ghazal collection',
    'matla poetry',
    'nazm literature',
    'urdu poetry',
    'hindi poetry',
    'poetry submission',
    'literary community',
    'poets platform',
    'treasury poetry'
  ],
  alternates: { canonical: 'https://www.mictale.in/treasury' },
  openGraph: {
    siteName: 'MicTale',
    title:
      'Treasury: The Home of Finest Poetry | Ghazals, Matlas & Nazms Collection',
    description:
      'Discover the finest poetry collection at Treasury. Explore authentic Ghazals, beautiful Matlas, and contemporary Nazms. Join our community of poets and literature enthusiasts.',
    url: 'https://www.mictale.in/treasury',
    images: [
      {
        url: 'https://i.imgur.com/YFpScQU.png',
        alt: 'Treasury - Collection of Ghazals, Matlas and Nazms',
        width: 1200,
        height: 630
      }
    ],
    type: 'website',
    locale: 'en_US'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Treasury: The Home of Finest Poetry',
  description:
    'Discover and explore the finest collection of poetry including Ghazals, Matlas, and Nazms. Submit your own poetry and connect with fellow poets.',
  url: 'https://www.mictale.in/treasury',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.mictale.in/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  },
  mainEntity: {
    '@type': 'CreativeWork',
    '@id': 'https://www.mictale.in/treasury',
    name: 'Treasury: The Home of Finest Poetry',
    description:
      'A curated collection of the finest poetry works including traditional Ghazals, beautiful Matlas, and contemporary Nazms',
    genre: ['Poetry', 'Literature', 'Ghazal', 'Nazm', 'Matla'],
    inLanguage: ['en', 'ur', 'hi'],
    author: { '@type': 'Organization', name: 'MicTale' },
    publisher: {
      '@type': 'Organization',
      name: 'MicTale',
      url: 'https://www.mictale.in'
    }
  }
}

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.mictale.in' },
    { '@type': 'ListItem', position: 2, name: 'Treasury', item: 'https://www.mictale.in/treasury' }
  ]
}

/**
 * Server-side helper: safe millis extractor for createdAt/updatedAt fields
 */
function toMillis(v) {
  if (!v) return 0
  // Firestore Timestamp has toDate()
  if (typeof v?.toDate === 'function') {
    try {
      return v.toDate().getTime()
    } catch (e) {
      return 0
    }
  }
  // string or number
  const ms = Date.parse(v)
  return Number.isFinite(ms) ? ms : 0
}

/**
 * Server-side helper: same extraction logic as your client MatlaDisplay
 * returns null if not valid (less than two lines)
 */
function extractMatlaFromDoc(data) {
  let lines = []
  if (Array.isArray(data.lines)) {
    lines = data.lines
  } else if (typeof data.lines === 'string') {
    lines = data.lines.split('\n')
  } else if (typeof data.content === 'string') {
    lines = data.content.split('। ')
  }
  const first = (lines[0] || '').trim()
  const second = (lines[1] || '').trim()
  if (!first || !second) return null
  return [first, second]
}

export default async function TreasuryPage() {
  // fetch latest poems (used by TreasuryClient)
  const poemsRef = collection(db, 'poems')
  const poemsQ = query(poemsRef, orderBy('createdAt', 'desc'), limit(10))

  // also fetch a window of recent poems (bigger limit) so we can filter ghazals server-side
  const ghazalsWindowLimit = 20 // fetch a few extra and filter to get latest ghazals
  const ghazalsQ = query(poemsRef, orderBy('createdAt', 'desc'), limit(ghazalsWindowLimit))

  // run both queries concurrently
  const [poemsSnap, ghazalsSnap] = await Promise.all([getDocs(poemsQ), getDocs(ghazalsQ)])

  // prepare initial poems (use your toPlain helper so you keep same shape as before)
  const initialPoems = poemsSnap.docs.map(d => toPlain({ id: d.id, ...d.data() }))

  // prepare initial ghazals (apply same rules as MatlaDisplay)
  const ghazalCandidates = ghazalsSnap.docs.map(d => ({ id: d.id, data: d.data() }))

  const ghazalsProcessed = ghazalCandidates.reduce((acc, doc) => {
    const data = doc.data || {}
    const category = String(data.category || '').toLowerCase()
    if (category !== 'ghazal') return acc // skip non-ghazals

    const matla = extractMatlaFromDoc(data)
    if (!matla) return acc // skip if can't extract matla

    const createdAtMs = toMillis(data.createdAt) || toMillis(data.updatedAt)
    acc.push({
      id: doc.id,
      slug: data.slug || doc.id,
      poet: data.author || data.poet || 'Unknown',
      createdAt: data.createdAt ? (typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : String(data.createdAt)) : null,
      createdAtMs,
      matla
    })
    return acc
  }, [])

  // sort by createdAtMs desc and pick top 4
  const initialGhazals = ghazalsProcessed
    .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0))
    .slice(0, 4)
    // strip createdAtMs as it's only internal
    .map(g => ({
      id: g.id,
      slug: g.slug,
      poet: g.poet,
      createdAt: g.createdAt,
      matla: g.matla
    }))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="bg-slate-950">
        {/* pass both poems and ghazals to TreasuryClient */}
        <TreasuryClient initialPoems={initialPoems} initialGhazals={initialGhazals} />

        <LatestBlogsShowcase limit={7} />
        <div className="bg-gradient-to-b from-transparent to-slate-900 h-20"></div>
        <InstagramGrid />
        <div className="bg-gradient-to-b from-slate-900 to-transparent h-10"></div>
        <MetallicFeatureCard />
        <Footer />
      </div>
    </>
  )
}
