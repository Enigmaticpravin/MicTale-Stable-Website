'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Eye, Calendar, Award, ExternalLink, X } from 'lucide-react'
import Image from 'next/image'

const videos = [
  {
    id: 'tfx0bk-d77o',
    title: 'Fareb - A Nazm by Pravin Gupta',
    thumbnail: 'https://img.youtube.com/vi/tfx0bk-d77o/maxresdefault.jpg',
    date: 'March 2025',
    views: '153',
    duration: '2:26',
    desc: 'Under MicTale Originals, a soul-stirring Nazm exploring the depth of deception.'
  },
  {
    id: 'eH5Nuak6hFU',
    title: 'Maa - A Nazm by Pravin Gupta',
    thumbnail: 'https://img.youtube.com/vi/eH5Nuak6hFU/maxresdefault.jpg',
    date: 'June 2025',
    views: '69',
    duration: '2:06',
    desc: 'An exclusive performance from "Poetry Abhi Baaki Hai Mere Dost".'
  }
]

const GoldGradient = "bg-gradient-to-tr from-[#bf953f] via-[#fcf6ba] to-[#b38728]"
const GoldText = "bg-clip-text text-transparent bg-gradient-to-b from-[#fcf6ba] to-[#bf953f]"

const YouTubeChannelComponent = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)

  return (
    <div className="bg-[#000b1a] text-slate-300 font-sans selection:bg-[#bf953f]/30">
      <div className={`h-1 w-full ${GoldGradient} rounded-4xl opacity-80`} />

      <main className="max-w-6xl mx-auto px-6 py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-6">
          <div className='flex w-full flex-col justify-center items-center'>
            <div className="flex items-center justify-center gap-2">
              <Award className="text-[#bf953f]" size={20} />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#bf953f] font-bold">Exclusively from</span>
            </div>
            <Image
              src="/images/originallogo.png"
              alt="MicTale YouTube Channel"
              width={200}
              height={50}
              className="object-contain items-center justify-center w-40 h-16 md:w-60 md:h-20 mt-4"
            />
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-10">
          {videos.map((video) => (
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
                  src={video.thumbnail} 
                  className="w-full h-full object-center grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                  alt={video.title}
                />
                <div className="absolute inset-0 bg-blue-950/20 group-hover:bg-transparent transition-colors" />
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className={`p-[1px] rounded-full ${GoldGradient}`}>
                      <div className="bg-[#000b1a] rounded-full p-4">
                        <Play className="text-[#fcf6ba] ml-1" fill="currentColor" size={24} />
                      </div>
                   </div>
                </div>

                <div className={`absolute bottom-0 right-0 m-5 rounded-2xl px-3 py-1 text-[10px] font-bold text-black ${GoldGradient}`}>
                  {video.duration}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-serif text-white group-hover:text-[#fcf6ba] transition-colors line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-blue-100/50 text-xs leading-relaxed line-clamp-2 font-light">
                  {video.desc}
                </p>
                
                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="flex gap-4 text-[10px] tracking-widest uppercase font-bold text-blue-300/60">
                    <span className="flex items-center gap-1.5"><Eye size={12}/> {video.views}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12}/> {video.date}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#000b1a]/98 backdrop-blur-xl"
          >
            <div className="w-full max-w-5xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-xl font-serif ${GoldText}`}>{selectedVideo.title}</h2>
                <button 
                  onClick={() => setSelectedVideo(null)} 
                  className="p-2 border cursor-pointer border-[#bf953f]/30 rounded-full text-[#bf953f] hover:bg-[#bf953f] hover:text-black transition-all duration-500 ease-in-out" >
                  <X size={20} />
                </button>
              </div>
              <div className={`p-[2px] rounded-sm shadow-[0_0_50px_-12px_rgba(191,149,63,0.3)] ${GoldGradient}`}>
                <div className="aspect-video bg-black rounded-sm overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-center">
                <button 
                  className={`px-8 cursor-pointer py-3 text-xs font-bold uppercase tracking-[0.3em] text-black ${GoldGradient} hover:brightness-110 transition-all rounded-sm`}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${selectedVideo.id}`, '_blank')}
                >
                  Watch on YouTube <ExternalLink className="inline-block ml-2" size={14} />
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