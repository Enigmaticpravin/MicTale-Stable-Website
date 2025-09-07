'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react'
import Footer from './Footer'
import Image from 'next/image'
import logo from '@/app/images/mic transparent.png'

export default function BlogDisplayPageDark ({ blog, similarBlogs = [] }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    const wordCount = (blog?.content || '').split(/\s+/).filter(Boolean).length
    const time = Math.max(1, Math.ceil(wordCount / 200))
    setReadingTime(time)
  }, [blog?.content])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      const el = document.createElement('div')
      el.textContent = 'URL copied to clipboard'
      el.className =
        'fixed right-6 bottom-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-slate-100 px-6 py-3 rounded-xl shadow-2xl z-50 font-medium'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 3000)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  const formatDate = dateString => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  const calculateReadingTime = content => {
    const wordCount = (content || '').split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (!blog) return null

  const displaySimilarBlogs = similarBlogs?.slice(0, 4) || []

  return (
    <>
      <div className='ml-1 mr-1 mb-1 md:mr-5 md:ml-5 md:mb-5 rounded-2xl min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none'></div>

        <main className='relative mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16'>
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className='md:mb-12 mb-5 max-w-4xl w-full mx-auto'
          >
            <h1 className='text-2xl md:text-6xl font-bold tracking-tight leading-tight mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent garamond-class text-center uppercase'>
              {blog.title}
            </h1>

            <div className='flex items-center w-full mx-auto justify-center flex-wrap gap-6 text-sm text-slate-400 mb-6'>
              <div className='flex items-center gap-2'>
                <Calendar className='w-3 h-3 md:w-4 md:h-4 text-slate-500' />
                <time
                  dateTime={blog.createdAt}
                  className='font-medium text-xs md:text-sm'
                >
                  {formatDate(blog.createdAt)}
                </time>
              </div>
              <div className='flex items-center gap-2'>
                <Clock className='md:w-4 md:h-4 h-3 w-3 text-slate-500' />
                <span className='font-medium text-xs md:text-sm'>
                  {readingTime} min read
                </span>
              </div>
            </div>
          </motion.header>

          {blog.coverImage && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='md:mb-16 mb-5 mx-auto w-full max-w-4xl'
            >
              <Image
                src={blog.coverImage}
                alt={blog.title}
                className='w-[900px] rounded-xl h-[430px] object-cover transition-transform duration-700 group-hover:scale-105'
                loading='eager'
                width={900}
                height={430}
              />
            </motion.div>
          )}

          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className='max-w-5xl mx-auto mb-5 md:mb-20'
          >
            <div
              className='text-slate-200 text-lg md:text-2xl leading-relaxed garamond-class text-justify
             first-letter:float-left first-letter:mr-2 whitespace-pre-line first-letter:mt-1
             first-letter:text-6xl md:first-letter:text-7xl
             first-letter:leading-none first-letter:font-bold'
              dangerouslySetInnerHTML={{
                __html: blog.content || ''
              }}
            />
          </motion.article>

           <div className='flex flex-col items-center justify-center mt-10 md:mt-0 mb-10'>
            <p className='helvetica-class text-xs md:text-sm italic uppercase font-light mb-2'>Published by</p>
              <div className='flex items-center gap-2 md:gap-4 border border-slate-500/50 rounded-full px-2 md:px-5'>
             <Image
                    src={logo}
                    alt='MicTale Logo'
                    width={64}
                    height={64}
                    className='bg-slate-950 rounded-full h-7 w-7 md:h-10 md:w-10'
                  />
                <div>
                  <h3 className='text-slate-100 helvetica-class font-semibold text-sm  md:text-lg'>
                    {blog.author}
                  </h3>
                </div>
              </div>
            </div>

          {displaySimilarBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className='mb-5 md:mb-20'
            >
              <div className='border-t border-slate-800/50 pt-5 md:pt-16'>
                <div className='justify-center items-center flex flex-col mb-3 md:mb-10'>
                  <p
                    className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
                    style={poppinsStyle}
                  >
                    Explore these
                  </p>
                  <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
                    Related Articles{' '}
                  </p>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 md:gap-8 gap-4 max-w-4xl mx-auto'>
                  {displaySimilarBlogs.map((similarBlog, index) => (
                    <motion.article
                      key={similarBlog.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      className='group'
                    >
                      <Link
                        href={`/blog/${similarBlog.slug || similarBlog.id}`}
                        className='block'
                      >
                         <div className="p-2 relative rounded-2xl bg-gray-900/40 border border-gray-700/30 overflow-hidden backdrop-blur-sm shadow-xl transition-all duration-300 group-hover/card:shadow-2xl group-hover/card:border-gray-600/50">
                    <div className="relative overflow-hidden">
                      {similarBlog.coverImage ? (
                        <img 
                          src={similarBlog.coverImage} 
                          alt={similarBlog.title}
                          loading="lazy"
                          className="md:h-40 h-20 w-full rounded-lg object-cover transition-transform duration-500 group-hover/card:scale-110"
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

                    <div className="md:p-5 space-y-3 mt-2">
                      <h3 className="md:font-semibold text-white text-sm md:text-lg leading-tight line-clamp-2 group-hover/card:underline ">
                        {similarBlog.title}
                      </h3>
                    
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <time
                          dateTime={similarBlog.createdAt}
                          className="text-gray-400 font-light"
                        >
                          {formatDate(similarBlog.createdAt)}
                        </time>
                        <div className="flex items-center text-gray-500 group-hover/card:text-gray-400 transition-colors">
                          <span className="text-xs">Read more</span>
                          <svg className="w-3 h-3 transition-transform group-hover/card:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
