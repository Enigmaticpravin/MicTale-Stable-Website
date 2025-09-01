// app/components/LatestBlogsShowcase.js
// SERVER component — don’t add 'use client'
import React from 'react'
import LatestBlogsClient from './LatestBlogsClient'
import { db } from '@/app/lib/firebase'
import {
  collection,
  query,
  orderBy,
  limit as fbLimit,
  getDocs
} from 'firebase/firestore'

export default async function LatestBlogsShowcase({ limit = 7 }) {
  try {
    const colRef = collection(db, 'blogs')

    const q = query(colRef, orderBy('createdAt', 'desc'), fbLimit(25)) // fetch a bit more

    const snap = await getDocs(q)
    const items = []

    snap.forEach((doc) => {
      const d = doc.data()
      if (!d?.published) return 

      items.push({
        id: doc.id,
        title: d?.title || 'Untitled',
        content: d?.content || '',
        excerpt: d?.excerpt || (d?.content ? d.content.substring(0, 180) + '...' : ''),
        coverImage: d?.coverImage || null,
        slug: d?.slug || doc.id,
        author: d?.author || 'Mictale',
        createdAt: d?.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString(),
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
