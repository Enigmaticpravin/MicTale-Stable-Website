// app/components/LatestBlogsClient.js
'use client'

import React, { useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  } catch {
    return ''
  }
}

export default function LatestBlogsClient({ blogs = [] }) {
    const stripRef = useRef(null) 
  if (!Array.isArray(blogs) || blogs.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[200px] text-gray-400 font-light">
          No blogs available
        </div>
      </section>
    )
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif',
  }

  const [main, ...rest] = blogs

  function scrollStrip(delta = 1) {
    const node = stripRef.current
    if (!node) return
    const cardWidth = 280
    node.scrollBy({ left: delta * cardWidth, behavior: 'smooth' })
  }

  const container = { 
    hidden: {}, 
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } 
  }
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } 
    }
  }

  const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -8,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div 
    className='justify-center items-center flex flex-col mb-3 md:mb-10'
  >
    <p
      className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
      style={poppinsStyle}
    >
      A new way to
    </p>
    <p
      className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'
    >
      Change Your View{' '}
    </p>
  </div>
      <motion.div 
        className="space-y-8 lg:space-y-12" 
        initial="hidden" 
        animate="show" 
        variants={container}
      >
        <motion.article
          className="group relative rounded-3xl bg-gradient-to-br from-gray-900/60 via-gray-900/40 to-black/60 backdrop-blur-md border border-gray-700/30 overflow-hidden shadow-2xl"
          variants={item}
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 rounded-3xl" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-0">
            <div className="relative aspect-[16/10] lg:aspect-square overflow-hidden">
              <Image
                src={main.coverImage}
                alt={main.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <motion.div 
                  className=" hidden md:inline-flex items-center gap-2 text-xs font-medium text-blue-400/80 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20"
                  variants={item}
                >
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  Latest Article
                </motion.div>
                
                <motion.h1 
                  className="text-lg sm:text-3xl lg:text-4xl font-semibold text-white leading-tight tracking-tight"
                  variants={item}
                >
                  <a 
                    href={`/blog/${main.slug}`} 
                    className='hover:underline transition-all duration-200'

                  >
                    {main.title}
                  </a>
                </motion.h1>

              <motion.p 
  className="text-gray-300 leading-relaxed text-xs md:text-base font-light line-clamp-3"
  variants={item}
>
  {main.content}
</motion.p>

              </div>

              <motion.div 
                className="flex items-center justify-between pt-4 border-t border-gray-700/50"
                variants={item}
              >
                <div className="flex items-center gap-3 text-xs md:text-sm text-gray-400">
                  <time dateTime={main.createdAt}>
                    {formatDate(main.createdAt)}
                  </time>
                  <div className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="md:flex hidden text-xs">5 min read</span>
                </div>
                
                <a 
                  href={`/blog/${main.slug}`} 
                  className="group/btn inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-gray-600/30 hover:border-gray-500/50 rounded-xl text-xs md:text-sm font-medium text-white transition-all duration-300"
                >
                  Read Article
                  <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>

          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
        </motion.article>

        <motion.div className="space-y-6" variants={item}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm md:text-2xl font-semibold text-white">
                More Articles
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light">
                Discover our latest insights and stories
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => scrollStrip(-1)} 
                aria-label="Scroll left"
                className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => scrollStrip(1)} 
                aria-label="Scroll right"
                className="p-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div 
            ref={stripRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
          >
            <AnimatePresence initial={false}>
              {rest.map((blog, index) => (
                <motion.a
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="group/card relative flex-shrink-0 w-72 snap-start"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  variants={cardHover}
                >
                  <div className="relative rounded-2xl bg-gray-900/40 border border-gray-700/30 overflow-hidden backdrop-blur-sm shadow-xl transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:border-gray-600/50">
                    <div className="relative aspect-[16/8] overflow-hidden">
                      {blog.coverImage ? (
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="font-semibold text-white text-sm md:text-lg leading-tight line-clamp-2 group-hover/card:underline ">
                        {blog.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <time 
                          dateTime={blog.createdAt}
                          className="text-gray-400 font-light"
                        >
                          {formatDate(blog.createdAt)}
                        </time>
                        <div className="flex items-center gap-1 text-gray-500 group-hover/card:text-gray-400 transition-colors">
                          <span className="text-xs">Read more</span>
                          <svg className="w-3 h-3 transition-transform group-hover/card:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}