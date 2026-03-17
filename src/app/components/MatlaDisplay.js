'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Book, Share } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Loader from './Loader'
import { supabase } from '@/app/lib/supabaseClient'

const MatlaDisplay = ({ initialGhazals = [] }) => {
  const router = useRouter()

  const [ghazals, setGhazals] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [autoPlayActive, setAutoPlayActive] = useState(true)

  const extractMatla = useCallback((data) => {
    let lines = []

    if (Array.isArray(data.lines)) lines = data.lines
    else if (typeof data.lines === 'string') lines = data.lines.split('\n')
    else if (typeof data.content === 'string') lines = data.content.split('। ')

    const first = (lines[0] || '').trim()
    const second = (lines[1] || '').trim()

    if (!first || !second) return null
    return [first, second]
  }, [])

  const toMillis = (v) => {
    if (!v) return 0
    return Date.parse(v) || 0
  }

  useEffect(() => {
    if (initialGhazals?.length) {
      setGhazals(initialGhazals)
      setCurrentIndex(0)
      setLoading(false)
    }
  }, [initialGhazals])

  useEffect(() => {
    if (initialGhazals?.length) return

    const fetchLatestGhazals = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('poems')
          .select('*')
          .eq('category', 'Ghazal')
          .order('created_at', { ascending: false })
          .limit(12)

        if (error) throw error

        const byId = new Map()

        data.forEach(d => {
          const matla = extractMatla(d)
          if (!matla) return

          byId.set(d.id, {
            id: d.id,
            slug: d.slug,
            poet: d.author || 'Unknown',
            createdAtMs: toMillis(d.created_at),
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

  useEffect(() => {
    if (!autoPlayActive || !ghazals.length) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % ghazals.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [autoPlayActive, ghazals.length])

  const nextPoem = () => {
    setCurrentIndex(prev => (prev + 1) % ghazals.length)
    setAutoPlayActive(false)
  }

  const prevPoem = () => {
    setCurrentIndex(prev => (prev - 1 + ghazals.length) % ghazals.length)
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

    if (navigator.share) navigator.share({ title: 'Read this ghazal', url })
    else {
      navigator.clipboard.writeText(url)
      alert('Link copied!')
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

  if (loading) return (
    <div className="flex justify-center min-h-screen items-center">
      <Loader label="Fetching data..." />
    </div>
  )
  if (error) return <p className="text-red-500 text-center">{error}</p>
  if (!ghazals.length) return null

  return (
    <div className="md:rounded-2xl rounded-2xl py-8 px-4 md:px-10 md:py-14 relative md:mx-6 overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 100%),
                     linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)`,
        boxShadow: `0 20px 50px rgba(0, 0, 0, 0.15), inset 0 0 100px rgba(180, 140, 70, 0.1)`,
        border: '1px solid #d4af37',
        position: 'relative'
      }}>
      
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm76-52c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-3-11c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM11 61c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM1 33c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm62 8c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-4 58c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm31-2c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-18-14c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-9-78c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM54 55c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM42 13c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm37 88c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM15 26c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm18-7c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM6 46c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm91-20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM18 69c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm80 26c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-9-5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-27-82c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM44 60c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm36 20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-10-71c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM32 32c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm51 7c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM23 51c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm36 33c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm37-37c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM11 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm66 66c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM33 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm67 67c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM0 86c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm61-20c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zM23 110c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm66-66c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z' fill='%239c7b2c' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

      <div className="absolute inset-4 pointer-events-none border border-[#c9a961]/30 rounded-xl" />

      <div className="relative z-10">
        <div className="justify-center items-center flex flex-col mb-2 md:mb-6 mt-2">
          <h2 className="uppercase text-xs md:text-sm font-medium tracking-widest text-amber-900/80"
            style={{ ...poppinsStyle, textShadow: '0 1px 1px rgba(255, 255, 255, 0.8)', letterSpacing: '3px' }}>
            Today&apos;s Selection
          </h2>
          <h1 className="text-amber-950 font-medium text-3xl md:text-5xl text-center mt-2 elsie-regular">
            Best Ghazals
          </h1>
        </div>

        <div className="mx-auto w-24 md:w-56 h-[2px] bg-gradient-to-r from-transparent via-[#c9a961] to-transparent mb-2 md:mt-10" />

        <div className="relative min-h-[160px] md:min-h-[240px] flex flex-col items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="w-full text-center"
            >
              <div className="mb-4">
                {ghazals[currentIndex]?.matla.map((line, i) => (
                  <div key={i} className="md:mb-4">
                    {renderLine(line)}
                  </div>
                ))}
              </div>
              <p className="uppercase tracking-widest text-xs md:text-sm font-semibold text-amber-900/70"
                style={{ ...poppinsStyle }}>
                {ghazals[currentIndex]?.poet}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center md:mt-10 items-center gap-8 md:gap-12">
          <button onClick={handleShare} className="flex cursor-pointer items-center gap-2 text-amber-900/80 transition-all duration-300 hover:text-amber-600">
            <Book className="md:w-5 md:h-5 w-4 h-4" strokeWidth={1.2} />
            <span className="text-xs md:text-sm font-medium uppercase tracking-tighter">Share</span>
          </button>
          <div className="w-px h-4 bg-amber-900/20" />
          <button onClick={handleSeeGhazal} className="flex cursor-pointer items-center gap-2 text-amber-900/80 transition-all duration-300 hover:text-amber-600">
            <Share className="md:w-5 md:h-5 w-4 h-4" strokeWidth={1.2} />
            <span className="text-xs md:text-sm font-medium uppercase tracking-tighter">Read Full</span>
          </button>
        </div>
      </div>

      <button onClick={prevPoem} className="absolute left-6 cursor-pointer hidden md:flex top-1/2 transform -translate-y-1/2 p-3 transition-all duration-500 hover:scale-110 group"
        style={{ background: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(201, 169, 97, 0.3)', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
        <ChevronLeft className="w-5 h-5 text-amber-900 group-hover:text-amber-600" strokeWidth={1} />
      </button>
      <button onClick={nextPoem} className="absolute right-6 cursor-pointer hidden md:flex top-1/2 transform -translate-y-1/2 p-3 transition-all duration-500 hover:scale-110 group"
        style={{ background: 'rgba(255, 255, 255, 0.4)', border: '1px solid rgba(201, 169, 97, 0.3)', borderRadius: '50%', backdropFilter: 'blur(4px)' }}>
        <ChevronRight className="w-5 h-5 text-amber-900 group-hover:text-amber-600" strokeWidth={1} />
      </button>
    </div>
  )
}

export default MatlaDisplay