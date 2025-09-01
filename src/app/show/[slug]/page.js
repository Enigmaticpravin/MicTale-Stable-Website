// app/show/[slug]/page.js
// Server component (NO "use client" here)

import { getDocs, collection, doc, getDoc } from '@/app/lib/firebase'
import { notFound } from 'next/navigation'
import ClientForm from '@/app/show/[slug]/ClientForm'

export const revalidate = 3600 // ISR: revalidate every hour

// If you want Next to statically generate known paths at build time
export async function generateStaticParams() {
  try {
    const showsSnapshot = await getDocs(collection(getDocs.__db || (await import('@/app/lib/firebase')).db, 'shows'))
    // NOTE: above is a defensive import — if your lib/firebase exports db directly, replace with: await getDocs(collection(db, 'shows'))
    // But for simplicity and compatibility, below we'll try common pattern:
  } catch (e) {
    // ignore — we'll fallback to dynamic rendering if fetching static params fails
  }

  // simpler safe implementation: try to import db and fetch
  try {
    const { db } = await import('@/app/lib/firebase')
    const snaps = await getDocs(collection(db, 'shows'))
    const params = []

    snaps.forEach(snap => {
      const data = snap.data()
      if (data && data.slug) {
        params.push({ slug: data.slug })
      }
    })

    return params
  } catch (err) {
    // If anything fails, return empty so pages will be rendered on demand
    return []
  }
}

export async function generateMetadata({ params }) {
  const slug = params.slug

  // fetch show by slug
  const { db } = await import('@/app/lib/firebase')
  const snaps = await getDocs(collection(db, 'shows'))
  const matched = snaps.docs.find(d => d.data().slug === slug)

  if (!matched) {
    return {
      title: 'Show not found — MicTale',
      description: 'Show not found'
    }
  }

  const showRef = doc(db, 'shows', matched.id)
  const showSnap = await getDoc(showRef)

  if (!showSnap.exists()) {
    return {
      title: 'Show not found — MicTale',
      description: 'Show not found'
    }
  }

  console.log("data",showSnap.data())

  const show = { id: showSnap.id, slug, ...showSnap.data() }
  const metaTitle = `${show.name} by MicTale`
  const metaDescription = show.description || 'Join us for an unforgettable evening of poetry, music and stories.'
  const encodedSlug = encodeURIComponent(show.slug)
  const showUrl = `https://www.mictale.in/show/${encodedSlug}`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: showUrl,
      type: 'website',
      images: [
        {
          url: 'https://mictale.in/images/mobile.png',
          width: 1200,
          height: 630,
          alt: show.name
        }
      ]
    },
    alternates: { canonical: showUrl },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [show.image || 'https://mictale.in/images/mobile.png']
    }
  }
}

export default async function ShowPage({ params }) {
  const slug = params.slug

  const { db } = await import('@/app/lib/firebase')
  // fetch list and find the doc with matching slug (mirrors your pages logic)
  const snaps = await getDocs(collection(db, 'shows'))
  const matched = snaps.docs.find(d => d.data().slug === slug)

  if (!matched) {
    // show not found: return 404 page
    notFound()
  }

  const showRef = doc(db, 'shows', matched.id)
  const showSnap = await getDoc(showRef)

  if (!showSnap.exists()) {
    notFound()
  }

  const showDetails = {
    id: showSnap.id,
    slug,
    ...showSnap.data()
  }


  const encodedSlug = encodeURIComponent(showDetails.slug)
  const showUrl = `https://www.mictale.in/show/${encodedSlug}`
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${showDetails.name} by MicTale`,
    startDate: '2025-03-09T01:00:00+05:30',
    endDate: '2025-03-09T06:00:00+05:30',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: showDetails.location || {
      '@type': 'Place',
      name: 'Nojoto Creator Hub',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Saket, Delhi',
        addressLocality: 'Delhi',
        addressCountry: 'IN'
      }
    },
    image: 'https://i.imgur.com/YFpScQU.png',
    description: showDetails.description || '',
    organizer: {
      '@type': 'Organization',
      name: 'MicTale',
      url: 'https://www.mictale.in'
    },
    performer: {
      '@type': 'PerformingGroup',
      name: 'Local Poets & Artists'
    },
    offers: {
      '@type': 'Offer',
      url: showUrl,
      price: String((showDetails.price ?? 200)),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock'
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
        <ClientForm showDetails={showDetails} />
    </>
  )
}
