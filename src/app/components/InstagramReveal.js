'use client'
import React, { useState, useEffect, useRef } from 'react'

export default function InstagramReveal ({ posts }) {
  const BATCH = 12
  const STAGGER = 60

  const [count, setCount] = useState(Math.min(BATCH, posts.length))
  const [revealed, setRevealed] = useState(new Array(posts.length).fill(false))
  const timers = useRef([])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => {
        setRevealed(r => {
          const c = [...r]
          c[i] = true
          return c
        })
      }, i * STAGGER)
      timers.current.push(t)
    }
    return () => timers.current.forEach(t => clearTimeout(t))
  }, [])

  function seeMore () {
    const next = Math.min(posts.length, count + BATCH)
    for (let i = count; i < next; i++) {
      const t = setTimeout(() => {
        setRevealed(r => {
          const c = [...r]
          c[i] = true
          return c
        })
      }, (i - count) * STAGGER)
      timers.current.push(t)
    }
    setCount(next)
  }

  return (
    <section className="px-4 py-8 bg-slate-900">
      <div className="grid max-w-6xl mx-auto grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.slice(0, count).map((p, idx) => (
          <a
            key={p.id}
            href={p.permalink}
            target="_blank"
            className={`block rounded-lg overflow-hidden transition-all duration-500 
            ${revealed[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
          >
            <div className="relative" style={{ paddingTop: '100%' }}>
              <img
                src={p.media_url}
                alt="instagram"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </a>
        ))}
      </div>

      {count < posts.length && (
        <div className="flex justify-center mt-6">
          <button onClick={seeMore} className="px-4 py-2 border border-white/20 rounded-full">
            See more
          </button>
        </div>
      )}
    </section>
  )
}
