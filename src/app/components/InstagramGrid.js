'use client'

import React, { useEffect, useState, useRef } from 'react'

export default function InstagramGrid({ limit = 50, max = 500 }) {
  const BATCH = 12
  const STAGGER_MS = 60

  const [posts, setPosts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [visibleCount, setVisibleCount] = useState(0)
  const [revealed, setRevealed] = useState([])
  const revealTimers = useRef([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/instagram?limit=${limit}&max=${max}`)
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json?.error || `Fetch error ${res.status}`)
        }
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        const all = json.data || []
        const ghazals = all.filter((item) => {
          const cap = (item.caption || '').trim()
          return isHindiGhazal(cap)
        })
        setPosts(ghazals)
        setRevealed(new Array(ghazals.length).fill(false))
        const initial = Math.min(BATCH, ghazals.length)
        setVisibleCount(initial)
        for (let i = 0; i < initial; i++) {
          const t = setTimeout(() => {
            setRevealed((r) => {
              const copy = r.slice()
              copy[i] = true
              return copy
            })
          }, i * STAGGER_MS)
          revealTimers.current.push(t)
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.error(err)
        setError(err.message || 'Failed to load Instagram posts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
      // clear timers
      revealTimers.current.forEach((t) => clearTimeout(t))
      revealTimers.current = []
    }
  }, [limit, max])

  useEffect(() => {
    return () => {
      revealTimers.current.forEach((t) => clearTimeout(t))
      revealTimers.current = []
    }
  }, [])

  function isHindiGhazal(text) {
    if (!text) return false

    const devRegex = /[\u0900-\u097F]/
    if (!devRegex.test(text)) return false

    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.length < 2) return false

    const suffixes = lines
      .map((line) => {
        const cleaned = line.replace(/[।!?.,;:—\-–"']/g, '').trim()
        if (!cleaned) return ''
        const parts = cleaned.split(/\s+/)
        const lastWord = parts[parts.length - 1] || ''
        return lastWord.slice(-4).toLowerCase()
      })
      .filter(Boolean)

    if (suffixes.length < 2) return false

    const counts = {}
    for (const s of suffixes) {
      counts[s] = (counts[s] || 0) + 1
    }

    const hasRepeatingSuffix = Object.values(counts).some((v) => v >= 2)
    return hasRepeatingSuffix
  }

  function handleSeeMore() {
    if (!posts) return
    const next = Math.min(posts.length, visibleCount + BATCH)
    for (let i = visibleCount; i < next; i++) {
      const t = setTimeout(() => {
        setRevealed((r) => {
          const copy = r.slice()
          copy[i] = true
          return copy
        })
      }, (i - visibleCount) * STAGGER_MS)
      revealTimers.current.push(t)
    }
    setVisibleCount(next)
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif',
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div 
    className='justify-center items-center flex flex-col mb-3 md:mb-10'
  >
    <p
      className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
      style={poppinsStyle}
    >
      our curated
    </p>
    <p
      className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'
    >
      Instagram Posts{' '}
    </p>
  </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl bg-white/6 animate-pulse"
              style={{ paddingTop: '100%' }} 
            />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-900/40 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {!loading && !error && posts && posts.length === 0 && (
        <div className="text-sm text-white/40">No ghazal-like posts found.</div>
      )}

      {!loading && !error && posts && posts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {posts.slice(0, visibleCount).map((p, idx) => {
              const url = p.media_url
              const alt = (p.caption && p.caption.slice(0, 80)) || 'instagram post'
              const globalIndex = idx
              return (
                <a
                  key={p.id}
                  href={p.permalink ?? '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`group block overflow-hidden rounded-lg bg-white/2 transform transition-all duration-500 ease-out
                    ${revealed[globalIndex] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
                  `}
                  title={alt}
                >
                  {url ? (
                    <div
                      className="relative w-full overflow-hidden"
                      style={{
                        aspectRatio: '4/4',
                        paddingTop: '100%'
                      }}
                    >
                      <img
                        src={url}
                        alt={alt}
                        loading="lazy"
                        className="absolute left-0 top-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-white/4 text-xs text-white/40">
                      no preview
                    </div>
                  )}

                  <div className="p-2 hidden">
                    <div className="text-xs text-white/60 line-clamp-2 whitespace-pre-line">
                      {p.caption ? p.caption : '—'}
                    </div>
                    <div className="mt-1 text-[10px] text-white/40">
                      {p.timestamp ? new Date(p.timestamp).toLocaleDateString() : ''}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>

          {visibleCount < posts.length && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSeeMore}
                className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-white/10 bg-white/3 hover:bg-white/5 transition"
                aria-label="See more posts"
              >
                See more
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
