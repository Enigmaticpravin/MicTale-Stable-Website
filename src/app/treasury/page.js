import TreasuryClient from './TreasuryClient'
import { db } from '@/app/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { toPlain } from '../lib/firestorePlain'
import LatestBlogsShowcase from '../components/LatestBlogsShowcase'
import InstagramGrid from '../components/InstagramGrid'
import MetallicFeatureCard from '../components/SubmitPoetry'
import Footer from '../components/Footer'

export const dynamic = 'force-static'

export const metadata = {
  title: 'Treasury: The Home of Finest Poetry | MicTale',
  description: 'Explore Treasury, the finest poetry collection, featuring authentic Ghazals, beautiful Matlas, and contemporary Nazms. Submit your poetry, discover new poets, and join our thriving literary community at MicTale.',
  keywords: [
    'poetry gallery', 'ghazal collection', 'matla poetry', 'nazm literature',
    'urdu poetry', 'hindi poetry', 'poetry submission', 'literary community',
    'poets platform', 'treasury poetry'
  ],
  alternates: { canonical: 'https://www.mictale.in/treasury' },
  openGraph: {
    siteName: 'MicTale',
    title: 'Treasury: The Home of Finest Poetry | Ghazals, Matlas & Nazms Collection',
    description: 'Discover the finest poetry collection at Treasury. Explore authentic Ghazals, beautiful Matlas, and contemporary Nazms. Join our community of poets and literature enthusiasts.',
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
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png'
  }
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Treasury: The Home of Finest Poetry",
  "description": "Discover and explore the finest collection of poetry including Ghazals, Matlas, and Nazms. Submit your own poetry and connect with fellow poets.",
  "url": "https://www.mictale.in/treasury",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.mictale.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "mainEntity": {
    "@type": "CreativeWork",
    "@id": "https://www.mictale.in/treasury",
    "name": "Treasury: The Home of Finest Poetry",
    "description": "A curated collection of the finest poetry works including traditional Ghazals, beautiful Matlas, and contemporary Nazms",
    "genre": ["Poetry", "Literature", "Ghazal", "Nazm", "Matla"],
    "inLanguage": ["en", "ur", "hi"],
    "author": { "@type": "Organization", "name": "MicTale" },
    "publisher": { "@type": "Organization", "name": "MicTale", "url": "https://www.mictale.in" }
  }
}

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.mictale.in" },
    { "@type": "ListItem", "position": 2, "name": "Treasury", "item": "https://www.mictale.in/treasury" }
  ]
}

export default async function TreasuryPage() {

 const poemsRef = collection(db, 'poems')
  const q = query(poemsRef, orderBy('createdAt', 'desc'), limit(10))
  const snap = await getDocs(q)


  const initialPoems = snap.docs.map(d => toPlain({ id: d.id, ...d.data() }))

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

       
        <TreasuryClient initialPoems={initialPoems} />
        <LatestBlogsShowcase limit={7} />
        <div className='bg-gradient-to-b from-transparent to-slate-900 h-20'></div>
        <div className='z-50 relative bg-slate-900'>
        <InstagramGrid />
        </div>
        <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
        <MetallicFeatureCard />
        <Footer />
    </>
  )
}
