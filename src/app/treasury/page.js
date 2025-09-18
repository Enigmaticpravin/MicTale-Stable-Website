// app/treasury/page.js
import TreasuryClient from './TreasuryClient'
import { getLatestGhazals, getLatestPoems } from '../lib/database'
import LatestBlogsShowcase from '../components/LatestBlogsShowcase'
import InstagramGrid from '../components/InstagramGrid'
import MetallicFeatureCard from '../components/SubmitPoetry'
import Footer from '../components/Footer'

export const revalidate = 60

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


export default async function TreasuryPage() {
  const initialPoems = await getLatestPoems(10);
  const initialGhazals = await getLatestGhazals(4);
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
