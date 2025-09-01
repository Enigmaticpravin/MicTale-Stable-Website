"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, User, Tag, Share2, ArrowLeft, Bookmark, BookmarkCheck, ArrowRight } from "lucide-react"
import Footer from "./Footer"
import Image from "next/image"
import logo from '@/app/images/mic transparent.png'

export default function BlogDisplayPageDark({ blog, similarBlogs = [] }) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingTime, setReadingTime] = useState(0)

  useEffect(() => {
    const wordCount = (blog?.content || "").split(/\s+/).filter(Boolean).length
    const time = Math.max(1, Math.ceil(wordCount / 200))
    setReadingTime(time)
  }, [blog?.content])

  const parseMarkdown = (text) => {
    if (!text) return ""
    
    let html = text
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-slate-100 mt-8 mb-4 tracking-wide">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-slate-100 mt-10 mb-5 tracking-wide">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-slate-100 mt-12 mb-6 tracking-wide">$1</h1>')
      
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em class="text-slate-100 font-bold">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-100 italic">$1</em>')
      
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900/50 border border-slate-800/50 rounded-xl p-6 my-8 overflow-x-auto backdrop-blur-sm"><code class="text-sm text-emerald-400 font-mono leading-relaxed">$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800/60 text-emerald-400 px-3 py-1.5 rounded-md text-sm font-mono border border-slate-700/50">$1</code>')
      
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-2 border-slate-600 pl-6 py-4 my-8 text-slate-200 italic bg-slate-900/20 rounded-r-lg">$1</blockquote>')
      
      .replace(/^\* (.*$)/gm, '<li class="text-slate-300 mb-3 leading-relaxed">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="text-slate-300 mb-3 leading-relaxed">$1</li>')
      .replace(/^• (.*$)/gm, '<li class="text-slate-300 mb-3 leading-relaxed">$1</li>')
      .replace(/^\+ (.*$)/gm, '<li class="text-slate-300 mb-3 leading-relaxed">$1</li>')
      
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300/50 transition-all duration-300 font-medium underline-offset-4" target="_blank" rel="noopener noreferrer">$1</a>')
      
      .replace(/\n\n/g, '</p><p class="text-slate-200 leading-loose mb-6 text-base sm:text-lg">')
      .replace(/\n/g, '<br>')

    html = html.replace(/(<li class="text-slate-300 mb-3 leading-relaxed">.*?<\/li>\s*)+/g, (match) => {
      return `<ul class="list-disc list-outside space-y-2 my-8 ml-6 text-slate-300">${match}</ul>`
    })

    if (!html.match(/^<[h1-6|ul|ol|blockquote|pre]/)) {
      html = `<p class="text-slate-200 leading-loose mb-6 text-base sm:text-lg">${html}</p>`
    }

    return html
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      const el = document.createElement('div')
      el.textContent = 'URL copied to clipboard'
      el.className = 'fixed right-6 bottom-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 text-slate-100 px-6 py-3 rounded-xl shadow-2xl z-50 font-medium'
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 3000)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
    } catch (e) { return dateString }
  }

  const calculateReadingTime = (content) => {
    const wordCount = (content || "").split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(wordCount / 200))
  }

  if (!blog) return null

  const displaySimilarBlogs = similarBlogs?.slice(0, 4) || []

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.05),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none"></div>
        
        <main className="relative max-w-4xl mx-auto px-6 sm:px-8 lg:px-10 py-12 sm:py-16">
          <motion.header 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, ease: "easeOut" }} 
            className="md:mb-12 mb-5"
          >
            <div className="flex items-center flex-wrap gap-6 text-sm text-slate-400 mb-6">
              <div className="flex items-center gap-2">
                <div className="md:w-8 md:h-8 w-4 h-4 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
                  <User className="md:w-4 md:h-4 h-2 w-2 text-slate-300" />
                </div>
                <span className="text-slate-300 font-medium text-xs md:text-sm">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-500" />
                <time dateTime={blog.createdAt} className="font-medium text-xs md:text-sm">{formatDate(blog.createdAt)}</time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="md:w-4 md:h-4 h-3 w-3 text-slate-500" />
                <span className="font-medium text-xs md:text-sm">{readingTime} min read</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-slate-50 leading-tight mb-6 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="text-sm md:text-xl text-slate-300 max-w-3xl font-light leading-relaxed mb-5 md:mb-8">
                {blog.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between flex-wrap gap-3 md:gap-6">
              <div className="flex flex-wrap gap-3">
                {(blog.tags || []).map((tag, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-2 md:px-4 py-1 px-2 md:py-2 text-xs font-medium bg-slate-800/60 text-slate-200 rounded-full border border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleBookmark}
                  className="p-2 md:p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-sm border border-slate-700/50"
                >
                  {isBookmarked ? 
                    <BookmarkCheck className="w-3 h-3 md:w-5 md:h-5 text-blue-400" /> : 
                    <Bookmark className="w-3 h-3 md:w-5 md:h-5 text-slate-400" />
                  }
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 md:p-3 rounded-full bg-slate-800/60 hover:bg-slate-700/60 transition-all duration-300 backdrop-blur-sm border border-slate-700/50"
                >
                  <Share2 className="md:w-5 md:h-5 w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>
          </motion.header>

          {blog.coverImage && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="md:mb-16 mb-5 rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50"
            >
              <Image
                src={blog.coverImage}
                alt={blog.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                width={1200}
                height={800}
              />
            </motion.div>
          )}

          <motion.article 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4, duration: 0.8 }} 
            className="prose prose-invert prose-sm md:prose-xl max-w-none mb-5 md:mb-20"
          >
            <div 
              className="blog-content text-slate-200 leading-loose"
              dangerouslySetInnerHTML={{
                __html: parseMarkdown(blog.content || '')
              }}
            />
          </motion.article>

          {displaySimilarBlogs.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-5 md:mb-20"
            >
              <div className="border-t border-slate-800/50 pt-5 md:pt-16">
                <h2 className="text-lg md:text-3xl font-bold text-slate-100 mb-5 md:mb-12 tracking-tight">
                  Related Articles
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
                  {displaySimilarBlogs.map((similarBlog, index) => (
                    <motion.article
                      key={similarBlog.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                      className="group"
                    >
                      <Link href={`/blog/${similarBlog.slug || similarBlog.id}`} className="block">
                        <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-slate-700/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-xl">
                          {similarBlog.coverImage && (
                            <div className="aspect-video overflow-hidden">
                              <Image
                                src={similarBlog.coverImage}
                                alt={similarBlog.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                width={1200}
                                height={800}
                              />
                            </div>
                          )}
                          
                          <div className="p-6">
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(similarBlog.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {calculateReadingTime(similarBlog.content)} min
                              </span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-slate-100 mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">
                              {similarBlog.title}
                            </h3>
                            
                            {similarBlog.excerpt && (
                              <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                                {similarBlog.excerpt}
                              </p>
                            )}
                            
                         
                            
                            <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors duration-300">
                              <span>Read Article</span>
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          <motion.footer 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8, duration: 0.6 }} 
            className="border-t border-slate-800/50 pt-12"
          >
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg backdrop-blur-sm">
               <Image
  src={logo}
  alt="MicTale Logo"
  width={64}
  height={64}
  className="invert"
/>
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold text-sm  md:text-lg">{blog.author}</h3>
                  <p className="text-xs md:text-sm text-slate-400">Writer & Creator</p>
                </div>
              </div>

              <div className="text-xs md:text-sm text-slate-400">
                Published on {formatDate(blog.createdAt)}
              </div>
            </div>
          </motion.footer>
        </main>

        {/* Enhanced Styles */}
        <style jsx>{`
          .blog-content {
            color: rgb(226 232 240);
            line-height: 1.8;
          }

          .blog-content * {
            color: inherit;
          }

          .blog-content h1,
          .blog-content h2,
          .blog-content h3 {
            scroll-margin-top: 2rem;
            font-weight: bold;
            color: rgb(248 250 252);
          }

          .blog-content p {
            text-align: justify;
            hyphens: auto;
            margin-bottom: 1.5rem;
          }

          .blog-content ul {
            margin: 2rem 0;
          }

          .blog-content li {
            position: relative;
            line-height: 1.7;
            margin-bottom: 0.75rem;
          }

          .blog-content li::marker {
            color: rgb(148 163 184);
          }

          .blog-content blockquote {
            position: relative;
            font-style: italic;
            quotes: '"' '"';
            background: rgba(15 23 42 / 0.3);
          }

          .blog-content blockquote::before {
            content: open-quote;
            font-size: 3rem;
            color: rgb(96 165 250);
            position: absolute;
            left: -1.5rem;
            top: -1rem;
            line-height: 1;
            opacity: 0.7;
          }

          .blog-content pre {
            position: relative;
            font-size: 0.875rem;
          }

          .blog-content code {
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .blog-content a {
            position: relative;
            text-decoration: none;
          }

          .blog-content a:hover {
            text-shadow: 0 0 8px rgba(96, 165, 250, 0.3);
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          html {
            scroll-behavior: smooth;
          }

          @media print {
            .blog-content { color: black !important; background: white !important; }
            .blog-content h1,
            .blog-content h2,
            .blog-content h3 { color: black !important; page-break-after: avoid; }
            .blog-content blockquote {
              border-left: 4px solid #333 !important;
              background: #f5f5f5 !important;
              color: #333 !important;
            }
            .blog-content pre,
            .blog-content code {
              background: #f5f5f5 !important;
              color: #333 !important;
              border: 1px solid #ccc !important;
            }
          }
        `}</style>
      </div>
      <Footer />
    </>
  )
}