
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Calendar,
  ExternalLink,
  X,
  RefreshCw,
} from 'lucide-react'

import Image from 'next/image'

const GoldGradient =
  'bg-gradient-to-tr from-[#bf953f] via-[#fcf6ba] to-[#b38728]'

const GoldText =
  'bg-clip-text text-transparent bg-gradient-to-b from-[#fcf6ba] to-[#bf953f]'

const YouTubeChannelComponent = () => {
  const [videos, setVideos] = useState([])
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/youtube', {
        method: 'GET',
        cache: 'no-store',
      })

      const data = await res.json()

      // Handle failed API responses
      if (!res.ok) {
        throw new Error(
          data?.error || `Request failed: ${res.status}`
        )
      }

      // Your API is expected to return an array
      // Never allow an error object into videos state
      const videoList = Array.isArray(data)
        ? data
        : Array.isArray(data?.videos)
          ? data.videos
          : null

      if (!videoList) {
        throw new Error('Invalid YouTube API response')
      }

      // Validate individual video objects
      const validVideos = videoList.filter(
        (video) =>
          video &&
          typeof video.id === 'string' &&
          typeof video.title === 'string'
      )

      setVideos(validVideos)

    } catch (err) {
      console.error('YouTube videos loading failed:', err)

      setVideos([])
      setError(err.message || 'Unable to load videos.')

    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return (
    <div className="bg-slate-950 text-slate-300 font-sans selection:bg-[#bf953f]/30">
      <main className="max-w-6xl mx-auto px-6 py-6">

        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
          <div className="flex w-full flex-col justify-center items-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[8px] md:text-[10px] tracking-[0.4em] uppercase text-white montserrat-regular">
                Exclusively from
              </span>
            </div>

            <Image
              src="/images/originallogo.png"
              alt="MicTale YouTube Channel"
              width={200}
              height={50}
              className="object-contain items-center justify-center w-40 h-16 md:w-60 md:h-20 md:mt-2"
            />
          </div>
        </header>

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20 text-zinc-400">
            Loading videos...
          </div>

        ) : error ? (

          /* Error state */
          <div className="text-center py-16 px-4">
            <p className="text-zinc-400 mb-5">
              Our videos are temporarily unavailable.
            </p>

            <button
              onClick={fetchVideos}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-black font-semibold text-sm ${GoldGradient}`}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>

        ) : videos.length === 0 ? (

          /* Empty state */
          <div className="text-center py-16 text-zinc-400">
            No videos available at the moment.
          </div>

        ) : (

          /* Videos */
          <div className="grid grid-cols-2 gap-2 space-y-2 md:gap-10">
            {videos.slice(0, 4).map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative flex flex-col"
              >
                <div
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer ring-1 ring-[#bf953f]/20 group-hover:ring-[#bf953f]/60 transition-all duration-500 shadow-2xl"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img
                    src={video.thumbnail || '/images/originallogo.png'}
                    className="w-full h-full object-cover transition-all duration-700"
                    alt={video.title}
                    loading="lazy"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`p-[1px] rounded-full ${GoldGradient}`}>
                      <div className="bg-[#000b1a] rounded-full p-1 md:p-4">
                        <Play
                          className="text-[#fcf6ba] ml-1"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <h3 className="text-sm md:text-xl montserrat-regular text-white transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-gray-300 text-[10px] md:text-xs leading-relaxed line-clamp-2 font-light">
                    {video.desc || ''}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex gap-4 text-[10px] tracking-widest uppercase font-bold text-white">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {video.date || ''}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* YouTube Channel Button */}
        <div className="mt-4 md:mt-20 flex justify-center">
          <motion.a
            href="https://www.youtube.com/@mictaleoriginals"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden"
          >
            <div className="relative flex items-center px-4 py-2 md:gap-5 md:px-8 md:py-5 rounded-2xl border border-white bg-[#07111f]/90 backdrop-blur-xl transition-all duration-500 group-hover:border-white/60">

              <div className={`md:w-14 w-8 h-8 md:h-14 rounded-full flex mr-3 items-center justify-center ${GoldGradient}`}>
                <Play
                  fill="currentColor"
                  className="text-black"
                  size={24}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] tracking-[0.35em] uppercase text-[#bf953f] font-bold">
                  Explore More Stories
                </span>

                <span className="text-white text-xs md:text-lg montserrat-regular md:mt-1">
                  Watch more on our YouTube Channel
                </span>
              </div>

              <ExternalLink
                className="text-[#fcf6ba] hidden md:flex group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </div>
          </motion.a>
        </div>

      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000b1a]/98 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-serif ${GoldText}`}>
                  {selectedVideo.title}
                </h2>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 border cursor-pointer border-[#bf953f]/30 rounded-full text-[#bf953f] hover:bg-[#bf953f] hover:text-black transition-all duration-500 ease-in-out"
                >
                  <X size={20} />
                </button>
              </div>

              <div className={`p-[2px] rounded-sm shadow-[0_0_50px_-12px_rgba(191,149,63,0.3)] ${GoldGradient}`}>
                <div className="aspect-video bg-black rounded-sm overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${encodeURIComponent(selectedVideo.id)}?autoplay=1`}
                    title={selectedVideo.title}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  className={`px-8 cursor-pointer py-3 text-xs font-bold uppercase tracking-[0.3em] text-black ${GoldGradient} hover:brightness-110 transition-all rounded-sm`}
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${encodeURIComponent(selectedVideo.id)}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                >
                  Watch on YouTube
                  <ExternalLink className="inline-block ml-2" size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default YouTubeChannelComponent
