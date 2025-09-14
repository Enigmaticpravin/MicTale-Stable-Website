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
import { db } from '@/app/lib/firebase'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Slider from 'react-slick'
import Loader from './Loader'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { HugeiconsIcon } from '@hugeicons/react'
import { BookOpen01FreeIcons, Share01FreeIcons } from '@hugeicons/core-free-icons/index'

const MatlaDisplay = ({ initialGhazals = [] }) => {
  const router = useRouter()
  const [ghazals, setGhazals] = useState(initialGhazals || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(!initialGhazals?.length)
  const [error, setError] = useState(null)

  const sliderSettings = {
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (index) => setCurrentIndex(index)
  }

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

  const nextPoem = () => {
    if (!ghazals.length) return
    setCurrentIndex((prev) => (prev + 1) % ghazals.length)
  }

  const prevPoem = () => {
    if (!ghazals.length) return
    setCurrentIndex((prev) => (prev - 1 + ghazals.length) % ghazals.length)
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
            className="text-[20px] sm:text-2xl md:text-4xl text-center inline-block text-black rozha-class"
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
    <div className="md:rounded-2xl rounded-b-2xl py-4 px-3 md:px-4 md:py-8 relative bg-cover bg-center bg-no-repeat md:mx-6"
            style={{ backgroundImage: "url('/images/bg.webp')" }}>
      <div className="justify-center items-center flex flex-col mb-2 mt-2">
        <h2
          className="uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900"
          style={poppinsStyle}
        >
          Today&apos;s Top
        </h2>
        <h1 className="text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-900 via-gray-600 to-slate-900 veronica-class">
          Best Ghazals
        </h1>
      </div>
      <div className="mx-auto w-[160px] md:w-[360px] h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-5 mt-5 md:mt-10 md:mb-10" />

      <div className="hidden md:block mb-8 mt-5 text-center">
        {ghazals[currentIndex]?.matla.map((line, i) => (
          <div key={i} className="md:mb-4">
            {renderLine(line)}
          </div>
        ))}
      </div>

      <div className="text-center mb-12 hidden md:block">
        <p className="uppercase tracking-widest text-sm font-bold text-black">
          {ghazals[currentIndex]?.poet}
        </p>
      </div>

      <div className="block md:hidden mb-10">
        <Slider {...sliderSettings}>
          {ghazals.map((g, idx) => (
            <div key={g.id ?? idx} className="text-center">
              {g.matla.map((line, i) => (
                <div key={i} className="md:mb-12">
                  {renderLine(line)}
                </div>
              ))}
              <p className="uppercase tracking-widest text-sm font-bold text-black mt-4 mb-5">
                {g.poet}
              </p>
            </div>
          ))}
        </Slider>
      </div>

      <div className="flex justify-center md:mt-10 items-center gap-5 md:gap-8 text-black">
        <button
          onClick={handleShare}
          className="flex cursor-pointer items-center gap-2 rounded-lg"
        >
          <HugeiconsIcon
            icon={Share01FreeIcons}
            className="md:w-5 md:h-5 w-3 h-3"
          />
          <span className="text-xs md:text-sm">Share this</span>
        </button>
        <button
          onClick={handleSeeGhazal}
          className="flex cursor-pointer items-center gap-2 rounded-lg"
        >
          <HugeiconsIcon
            icon={BookOpen01FreeIcons}
            className="md:w-5 md:h-5 w-3 h-3"
          />
          <span className="text-xs md:text-sm">See Ghazal</span>
        </button>
      </div>

      <button
        onClick={prevPoem}
        className="absolute ml-10 cursor-pointer hidden md:block left-0 top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 rounded-full hover:bg-gray-600"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextPoem}
        className="absolute mr-10 cursor-pointer right-0 hidden md:block top-1/2 transform -translate-y-1/2 p-3 bg-gray-800 rounded-full hover:bg-gray-600"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  )
}

export default MatlaDisplay
