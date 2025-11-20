'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  collection,
  query,
  orderBy,
  limit as fbLimit,
  getDocs
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase-db'
import { ChevronLeft, ChevronRight, Book, Share } from 'lucide-react'
import Loader from './Loader'

const MatlaDisplay = ({ initialGhazals = [] }) => {
  const router = useRouter()
  const [ghazals, setGhazals] = useState(initialGhazals || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(!initialGhazals?.length)
  const [error, setError] = useState(null)
  const [autoPlayActive, setAutoPlayActive] = useState(true)

  const extractMatla = useCallback((data) => {
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
  }, [])

  const toMillis = (v) => {
    if (!v) return 0
    if (typeof v?.toDate === 'function') return v.toDate().getTime()
    const ms = Date.parse(v)
    return Number.isFinite(ms) ? ms : 0
  }

  useEffect(() => {
    if (initialGhazals?.length) return

    const fetchLatestGhazals = async () => {
      try {
        setLoading(true)

        const poemsRef = collection(db, 'poems')
        const q = query(poemsRef, orderBy('createdAt', 'desc'), fbLimit(8))
        const snap = await getDocs(q)

        const byId = new Map()
        snap.docs.forEach((d) => {
          const data = d.data()
          const category = String(data.category || '').toLowerCase()
          if (category !== 'ghazal') return

          const matla = extractMatla(data)
          if (!matla) return

          byId.set(d.id, {
            id: d.id,
            slug: data.slug || d.id,
            poet: data.author || data.poet || 'Unknown',
            createdAtMs: toMillis(data.createdAt) || toMillis(data.updatedAt),
            matla
          })
        })

        const merged = Array.from(byId.values())
          .sort((a, b) => b.createdAtMs - a.createdAtMs)
          .slice(0, 4)

        setGhazals(merged)
        setCurrentIndex(0)
      } catch (e) {
        console.error(e)
        setError('Failed to fetch latest ghazals.')
      } finally {
        setLoading(false)
      }
    }

    fetchLatestGhazals()
  }, [extractMatla, initialGhazals])

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlayActive || !ghazals.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ghazals.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [autoPlayActive, ghazals.length])

  const nextPoem = () => {
    if (!ghazals.length) return
    setCurrentIndex((prev) => (prev + 1) % ghazals.length)
    setAutoPlayActive(false)
  }

  const prevPoem = () => {
    if (!ghazals.length) return
    setCurrentIndex((prev) => (prev - 1 + ghazals.length) % ghazals.length)
    setAutoPlayActive(false)
  }

  const handleSeeGhazal = () => {
    const curr = ghazals[currentIndex]
    if (curr?.slug) router.push(`/poem/${curr.slug}`)
  }

  const handleShare = () => {
    const curr = ghazals[currentIndex]
    if (!curr?.slug) return
    const url = `${window.location.origin}/poem/${curr.slug}`

    if (navigator.share) {
      navigator.share({
        title: curr.title || 'Read this ghazal',
        url
      })
    } else {
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

 const renderLine = (line) => {
    const words = String(line).split(' ')
    return (
      <div className="mx-auto flex justify-between max-w-[712px] w-[95%] whitespace-nowrap">
        {words.map((word, index) => (
          <span
            key={index}
            className="text-[20px] sm:text-2xl md:text-4xl text-center inline-block text-black rozha-one-regular"
          >
            {word}
          </span>
        ))}
      </div>
    )
  }

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' }

  if (loading)
    return (
      <div className="flex justify-center min-h-screen items-center">
        <Loader label="Fetching data..." />
      </div>
    )
  if (error) return <p className="text-red-500 text-center">{error}</p>
  if (!ghazals.length) return null

  return (
    <div className="md:rounded-2xl rounded-2xl py-8 px-4 md:px-10 md:py-14 relative md:mx-6 overflow-hidden"
      style={{
        background: `
          linear-gradient(180deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(250, 248, 243, 0.98) 50%,
            rgba(248, 246, 240, 0.95) 100%
          )
        `,
        boxShadow: `
          inset 0 2px 8px rgba(255, 255, 255, 0.8),
          inset 0 -2px 8px rgba(0, 0, 0, 0.08),
          inset 1px 0 2px rgba(255, 255, 255, 0.6),
          inset -1px 0 2px rgba(0, 0, 0, 0.05),
          0 30px 80px rgba(0, 0, 0, 0.12),
          0 0 60px rgba(180, 140, 70, 0.15),
          0 0 1px rgba(180, 140, 70, 0.3)
        `,
        border: '8px solid',
        borderColor: '#c9a961',
        borderRadius: '16px',
        position: 'relative'
      }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '16px',
          background: `linear-gradient(90deg,
            rgba(201, 169, 97, 0.4) 0%,
            rgba(201, 169, 97, 0.15) 10%,
            transparent 50%,
            rgba(201, 169, 97, 0.15) 90%,
            rgba(201, 169, 97, 0.4) 100%
          )`,
          border: '1px solid rgba(201, 169, 97, 0.3)',
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.5),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          )`
        }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="justify-center items-center flex flex-col mb-2 md:mb-6 mt-2">
          <h2
            className="uppercase text-xs md:text-sm font-medium tracking-widest text-amber-900"
            style={{
              ...poppinsStyle,
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)',
              letterSpacing: '2px'
            }}
          >
            Today&apos;s Selection
          </h2>
          <h1 className="text-amber-950 font-medium text-3xl md:text-5xl text-center mt-2 elsie-regular"
            style={{
              textShadow: '0 2px 4px rgba(255, 255, 255, 0.6)'
            }}>
            Best Ghazals
          </h1>
        </div>

        {/* Divider */}
        <div className="mx-auto w-24 md:w-56 h-px bg-gradient-to-r from-transparent via-amber-700 to-transparent mb-2 md:mt-10 opacity-50" />

        <div className="hidden md:block mb-10 mt-10 text-center transition-all duration-500">
          {ghazals[currentIndex]?.matla.map((line, i) => (
            <div key={i} className="md:mb-4">
              {renderLine(line)}
            </div>
          ))}
        </div>
        <div className="text-center mb-12 hidden md:block transition-all duration-500">
          <p className="uppercase tracking-widest text-xs md:text-sm font-medium text-amber-900"
            style={{
              textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
            }}>
            {ghazals[currentIndex]?.poet}
          </p>
        </div>

        <div className="block md:hidden">
          <div className="overflow-hidden">
            <div className="transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                display: 'flex'
              }}>
              {ghazals.map((g, idx) => (
                <div key={g.id ?? idx} className="w-full flex-shrink-0 text-center px-2">
                  {g.matla.map((line, i) => (
                    <div key={i}>
                      {renderLine(line)}
                    </div>
                  ))}
                  <p className="uppercase tracking-widest text-xs font-medium text-amber-900 mt-4 mb-5"
                    style={{
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}>
                    {g.poet}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mb-4">
            {ghazals.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full transition-all ${
                  idx === currentIndex 
                    ? 'w-6 h-1.5 bg-amber-700' 
                    : 'w-1.5 h-1.5 bg-black opacity-60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center md:mt-14 items-center gap-8 md:gap-12">
          <button
            onClick={handleShare}
            className="flex cursor-pointer items-center gap-2 text-amber-900 transition-all duration-300 hover:opacity-70"
          >
            <Book className="md:w-5 md:h-5 w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs md:text-sm font-medium">Share</span>
          </button>
          <div className="w-px h-6 bg-black opacity-40" />
          <button
            onClick={handleSeeGhazal}
            className="flex cursor-pointer items-center gap-2 text-amber-900 transition-all duration-300 hover:opacity-70"
          >
            <Share className="md:w-5 md:h-5 w-4 h-4" strokeWidth={1.5} />
            <span className="text-xs md:text-sm font-medium">Read Full</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevPoem}
        className="absolute left-6 cursor-pointer hidden md:flex top-1/2 transform -translate-y-1/2 p-2.5 transition-all duration-300 hover:bg-amber-100"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <ChevronLeft className="w-5 h-5 text-amber-900" strokeWidth={1.5} />
      </button>
      <button
        onClick={nextPoem}
        className="absolute right-6 cursor-pointer hidden md:flex top-1/2 transform -translate-y-1/2 p-2.5 transition-all duration-300 hover:bg-amber-100"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(201, 169, 97, 0.4)',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        <ChevronRight className="w-5 h-5 text-amber-900" strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default MatlaDisplay