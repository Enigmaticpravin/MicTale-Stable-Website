'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Footer from '@/app/components/Footer'
import PoetrySubmissionForm from '@/app/components/PoetrySubmissionForm'
import { db } from '@/app/lib/firebase'
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import MatlaDisplay from '../components/MatlaDisplay'
const PAGE_SIZE = 10

export default function TreasuryClient ({ initialPoems = [] }) {
  const [poems, setPoems] = useState(initialPoems)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const cursorRef = useRef(null)
  useEffect(() => {
    if (initialPoems.length > 0) {
      const last = initialPoems[initialPoems.length - 1]
      const iso = last?.createdAt
      if (iso) cursorRef.current = Timestamp.fromMillis(Date.parse(iso))
    }
  }, [initialPoems])

  const mergeUnique = useCallback((prev, next) => {
    const map = new Map()
    for (const p of prev) map.set(p.id ?? p.slug, p)
    for (const p of next) map.set(p.id ?? p.slug, p)
    return Array.from(map.values())
  }, [])

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)

    const base = collection(db, 'poems')
    let q = query(base, orderBy('createdAt', 'desc'), limit(PAGE_SIZE))

    if (cursorRef.current) {
      q = query(
        base,
        orderBy('createdAt', 'desc'),
        startAfter(cursorRef.current),
        limit(PAGE_SIZE)
      )
    }

    const snap = await getDocs(q)
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

    const lastDoc = snap.docs[snap.docs.length - 1]
    if (lastDoc) {
      const ts = lastDoc.get('createdAt')
      cursorRef.current = ts || cursorRef.current
    }

    setPoems(prev => mergeUnique(prev, docs))
    setHasMore(docs.length === PAGE_SIZE)
    setLoading(false)
  }, [loading, hasMore, mergeUnique])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const nearBottom =
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 200
        if (nearBottom) loadMore()
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [loadMore])

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <>
      <main>
        <MatlaDisplay />
        <div className='bg-gradient-to-b from-transparent to-slate-900 h-10'></div>
        <div className='relative z-10 mx-auto px-4 bg-slate-900 py-10'>
          <div className='max-w-5xl mx-auto'>
            <div className='justify-center items-center flex flex-col mb-3 md:mb-10'>
              <p
                className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
                style={poppinsStyle}
              >
                Latest Added
              </p>
              <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
                Poems{' '}
              </p>
            </div>

            <ul className='grid gap-3 sm:gap-4'>
              {poems.map(p => (
                <li key={p.id ?? p.slug}>
                  <Link
                    href={`/poem/${p.slug}`}
                    prefetch
                    className='group block rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur transition
                     hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.04] focus:outline-none
                     focus:ring-2 focus:ring-white/20'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <h2 className='text-lg font-medium leading-snug text-white group-hover:text-white'>
                        {p.title}
                      </h2>
                      <span className='shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/50'>
                        {p.category}
                      </span>
                    </div>

                    <div className='mt-1 text-sm text-white/60'>{p.author}</div>

                    {Array.isArray(p.lines) && p.lines.length > 0 ? (
                      <p className='mt-3  md:flex hidden line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70'>
                        {p.lines.slice(0, 3).join('\n')}
                      </p>
                    ) : null}

                    <div className='mt-4 hidden md:flex items-center gap-2 text-xs text-white/40'>
                      <span className='inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1'>
                        <span className='h-1.5 w-1.5 rounded-full bg-white/50' />
                        preview
                      </span>
                      <span className='opacity-0 transition group-hover:opacity-100'>
                        read the full piece
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      </main>
    </>
  )
}
