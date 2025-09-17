import React from 'react'
import LatestBlogsClient from './LatestBlogsClient'
import { adminDb } from '@/app/lib/firebaseAdmin'

export default async function LatestBlogsShowcase({ limit = 7 }) {
  try {
    const colRef = adminDb.collection('blogs')
    const snap = await colRef.orderBy('createdAt', 'desc').limit(25).get()

    const items = []

    snap.forEach(doc => {
      const d = doc.data()
      if (!d?.published) return

      items.push({
        id: doc.id,
        title: d?.title || 'Untitled',
        content: d?.content || '',
        excerpt: d?.excerpt || (d?.content ? d.content.substring(0, 180) + '...' : ''),
        coverImage: d?.coverImage || null,
        slug: d?.slug || doc.id,
        author: d?.author || 'MicTale',
        createdAt: d?.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : String(d.createdAt)) : new Date().toISOString(),
        tags: d?.tags || []
      })
    })

    const sliced = items.slice(0, limit)

    return <LatestBlogsClient blogs={sliced} />
  } catch (err) {
    console.error('[LatestBlogsShowcase] fetch error:', err)

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-white/70">
        <div className="text-sm">Could not load latest blogs.</div>
        <div className="mt-2 text-xs text-white/40">
          Error: {err.message || 'unknown'}
        </div>
      </div>
    )
  }
}
