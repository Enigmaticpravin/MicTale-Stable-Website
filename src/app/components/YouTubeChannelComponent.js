'use client'

import React, { useState } from 'react'
import { Play, Eye, Calendar, Sparkles, Video, Star } from 'lucide-react'
import Image from 'next/image'

const YouTubeChannelComponent = () => {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const videos = [
    {
      id: 'tfx0bk-d77o',
      title: 'Fareb - a nazm by Pravin Gupta | MicTale Originals',
      thumbnail: 'https://img.youtube.com/vi/tfx0bk-d77o/maxresdefault.jpg',
      publishedAt: '2025-03-20T10:00:00Z',
      description: `Under MicTale Originals, we bring you a soul-stirring Nazm – "Fareb", written and recited by bestselling author Pravin Gupta. This heartfelt piece explores the depth of deception, emotions, and the unspoken truths of life.

"Fareb" is also featured in the upcoming revised edition of Kaalikh, a poetry collection that has touched many hearts.

Experience the magic of words, emotions, and rhythm. Let the verses speak to your soul. Don't forget to like, comment, share, and subscribe for more original content!

📖 Pre-Order the new edition of Kaalikh now: https://www.mictale.in/book?title=Kaa...

🔔 Turn on notifications to stay updated with our latest releases.

📌 Follow for more poetry & updates:
🌍 Website: https://www.mictale.in/
📷 Instagram:   / mictale.in  

🎧 Listen, Feel, and Share.`,
      viewCount: '130',
      duration: '2:26'
    },
    {
      id: 'eH5Nuak6hFU',
      title: 'Maa - A Nazm by Pravin Gupta | MicTale Originals',
      thumbnail: 'https://img.youtube.com/vi/eH5Nuak6hFU/maxresdefault.jpg',
      publishedAt: '2025-06-05T10:00:00Z',
      description: `Presenting an exclusive nazm written and performed by Pravin Gupta in his solo poetry show, Poetry Abhi Baaki Hai Mere Dost, sponsored by MicTale.

📖 Pre-Order the new edition of Kaalikh now: https://www.mictale.in/book?title=Kaa...

🔔 Turn on notifications to stay updated with our latest releases.

📌 Follow for more poetry & updates:
🌍 Website: https://www.mictale.in/
📷 Instagram:   / mictale.in    

🎧 Listen, Feel, and Share`,
      viewCount: '50',
      duration: '2:06'
    }
  ]

  const formatViewCount = count => {
    const num = parseInt(count)
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = dateString => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
    return `${Math.ceil(diffDays / 365)} years ago`
  }

  const handleVideoClick = video => {
    setSelectedVideo(video)
  }

  const closeModal = () => {
    setSelectedVideo(null)
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  const watchOnYouTube = videoId => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  return (
    <div className='bg-gray-900 overflow-hidden'>
      <div className='relative z-10 max-w-7xl mx-auto px-4'>
        <div className='lg:grid lg:grid-cols-12 lg:gap-12 items-center py-20'>
          <div className='lg:col-span-5 md:mb-12 lg:mb-0'>
            <div className='space-y-6 flex flex-col items-center lg:items-start'>
              <div className='space-y-4 justify-center text-center lg:text-left items-center'>
                <Image
                  src='/images/originallogo.png'
                  alt='MicTale Originals'
                  width={600}
                  height={200}
                  className='w-fit h-14'
                />
                <div className='h-[2px] w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto md:mx-0'></div>
              </div>

              <div className='space-y-0 md:space-y-4 text-center md:text-left'>
                <p className='md:text-xl uppercase text-sm text-gray-300 leading-relaxed garamond-class'>
                  A special segment where we shoot and produce
                  <span className='text-yellow-400 font-semibold'>
                    {' '}
                    original and best content
                  </span>
                </p>

                <div className='md:hidden relative h-80 perspective-1000 overflow-hidden'>
                  {videos.map((video, index) => (
                    <div
                      key={video.id}
                      className={`absolute cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                        index === 0
                          ? 'z-20 -rotate-12 hover:rotate-0 hover:scale-105'
                          : 'z-10 rotate-12 translate-x-6 translate-y-4 hover:rotate-0 hover:scale-105 hover:translate-x-0 hover:translate-y-0'
                      } ${hoveredCard === index ? 'z-30' : ''}`}
                      style={{
                        transformStyle: 'preserve-3d',
                        width: '130px',
                        height: '170px',
                        left: index === 0 ? '5%' : '40%',
                        top: index === 0 ? '15%' : '25%'
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => handleVideoClick(video)}
                    >
                      <div className='absolute inset-0 bg-black/40 rounded-lg blur-lg transform translate-y-4 scale-95'></div>

                      <div className='relative w-full h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-lg border border-gray-700/50 overflow-hidden shadow-2xl'>
                        <div className='relative h-20 overflow-hidden'>
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                            onError={e => {
                              e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
                            }}
                          />

                          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                          <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300'>
                            <div className='bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors'>
                              <Play
                                className='w-4 h-4 text-white'
                                fill='currentColor'
                              />
                            </div>
                          </div>

                          <div className='absolute bottom-1 right-1 bg-black/80 rounded px-1.5 py-0.5 text-xs text-white font-medium'>
                            {video.duration}
                          </div>
                          <div className='absolute top-1 left-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full px-1.5 py-0.5 text-xs text-black font-bold'>
                            ORIGINAL
                          </div>
                        </div>

                        <div className='p-3 space-y-2 h-fit'>
                          <h3
                            className='text-white font-semibold text-xs leading-tight line-clamp-2'
                            style={poppinsStyle}
                          >
                            {video.title}
                          </h3>

                          <div className='flex items-center justify-between text-gray-400 text-xs'>
                            <div className='flex items-center gap-1'>
                              <Eye className='w-3 h-3' />
                              <span>{formatViewCount(video.viewCount)}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <Calendar className='w-3 h-3' />
                              <span>{formatDate(video.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p
                  className='text-gray-400 text-sm md:text-lg leading-relaxed md:text-left text-center'
                  style={poppinsStyle}
                >
                  Experience the magic of words, emotions, and rhythm through
                  our carefully crafted poetry and storytelling. Each piece is a
                  journey into the depths of human experience.
                </p>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
                <div className='flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 backdrop-blur-sm'>
                  <div className='w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center'>
                    <Video className='w-4 h-4 text-yellow-400' />
                  </div>
                  <div>
                    <div className='text-white font-medium text-xs md:text-sm'>
                      Original Content
                    </div>
                    <div className='text-gray-400 text-[10px] md:text-xs'>
                      Exclusive productions
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-3 md:p-3 px-1 bg-gray-800/30 rounded-lg border border-gray-700/50 backdrop-blur-sm'>
                  <div className='w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center'>
                    <Star className='w-4 h-4 text-yellow-400' />
                  </div>
                  <div>
                    <div className='text-white font-medium text-xs md:text-sm'>
                      Premium Quality
                    </div>
                    <div className='text-gray-400 text-[10px] md:text-xs'>
                      Curated experiences
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-7 '>
            <div className='relative h-96 lg:h-[500px] perspective-1000 hidden md:block'>
              <div className=''>
                {videos.map((video, index) => (
                  <div
                    key={video.id}
                    className={`absolute cursor-pointer transition-all duration-700 ease-out transform-gpu ${
                      index === 0
                        ? 'z-20 -rotate-12 hover:rotate-0 hover:scale-105'
                        : 'z-10 rotate-12 translate-x-12 translate-y-8 hover:rotate-0 hover:scale-105 hover:translate-x-0 hover:translate-y-0'
                    } ${hoveredCard === index ? 'z-30' : ''}`}
                    style={{
                      transformStyle: 'preserve-3d',
                      width: '280px',
                      height: '320px',
                      left: index === 0 ? '10%' : '40%',
                      top: index === 0 ? '10%' : '20%'
                    }}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className='absolute inset-0 bg-black/40 rounded-xl blur-xl transform translate-y-8 scale-95'></div>

                    <div className='relative w-full h-full bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl'>
                      <div className='relative h-48 overflow-hidden'>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                          onError={e => {
                            e.target.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`
                          }}
                        />

                        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent'></div>

                        <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300'>
                          <div className='bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors'>
                            <Play
                              className='w-6 h-6 text-white'
                              fill='currentColor'
                            />
                          </div>
                        </div>

                        <div className='absolute bottom-2 right-2 bg-black/80 rounded px-2 py-1 text-xs text-white font-medium'>
                          {video.duration}
                        </div>
                        <div className='absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full px-2 py-1 text-xs text-black font-bold'>
                          ORIGINAL
                        </div>
                      </div>

                      <div className='p-4 space-y-3 h-fit'>
                        <h3
                          className='text-white font-semibold text-sm leading-tight line-clamp-2'
                          style={poppinsStyle}
                        >
                          {video.title}
                        </h3>

                        <div className='flex items-center justify-between text-gray-400 text-xs'>
                          <div className='flex items-center gap-1'>
                            <Eye className='w-3 h-3' />
                            <span>{formatViewCount(video.viewCount)}</span>
                          </div>
                          <div className='flex items-center gap-1'>
                            <Calendar className='w-3 h-3' />
                            <span>{formatDate(video.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedVideo && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          <div className='bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 max-w-lg w-full'>
            <div className='flex justify-between items-start mb-4'>
              <h2
                className='text-xl font-bold text-white pr-4'
                style={poppinsStyle}
              >
                {selectedVideo.title}
              </h2>
              <button
                onClick={closeModal}
                className='text-gray-400 hover:text-white transition-colors text-2xl'
              >
                ×
              </button>
            </div>

            <div className='relative rounded-lg overflow-hidden mb-4'>
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className='w-full aspect-video object-cover'
              />
              <div className='absolute inset-0 bg-black/20 flex items-center justify-center'>
                <button
                  onClick={() => watchOnYouTube(selectedVideo.id)}
                  className='bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors'
                >
                  <Play className='w-8 h-8 text-white' fill='currentColor' />
                </button>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center gap-4 text-gray-400 text-sm'>
                <div className='flex items-center gap-1'>
                  <Eye className='w-4 h-4' />
                  <span>{formatViewCount(selectedVideo.viewCount)} views</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  <span>{formatDate(selectedVideo.publishedAt)}</span>
                </div>
              </div>

              <p
                className='text-gray-300 text-sm leading-relaxed line-clamp-3'
                style={poppinsStyle}
              >
                {selectedVideo.description}
              </p>

              <button
                onClick={() => watchOnYouTube(selectedVideo.id)}
                className='w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2'
                style={poppinsStyle}
              >
                <Play className='w-4 h-4' fill='currentColor' />
                Watch on YouTube
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default YouTubeChannelComponent
