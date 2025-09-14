'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp01FreeIcons } from '@hugeicons/core-free-icons/index'
import { HugeiconsIcon } from '@hugeicons/react'

const WhatsNew = ({ items = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section
      className="relative bg-gradient-to-r md:mx-4 md:rounded-b-2xl from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* shimmer background (pure CSS now) */}
      <div className="absolute inset-0 bg-gradient-to-r from-silver-200/5 via-gray-300/10 to-slate-400/5"></div>
      <div className="absolute inset-0 shimmer-bg" />

      <div className="relative z-10 py-3 px-8 md:px-16 flex items-center justify-between">
        {/* text left */}
        <p className="hidden md:block text-gray-400 font-light text-xs">
          New update now{' '}
          <span className="border rounded-2xl px-1 uppercase bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white ml-1">
            live
          </span>
        </p>
        <p className="md:hidden text-gray-400 text-[8px] font-light flex flex-col items-center">
          new update now
          <span className="border rounded-2xl px-1 uppercase bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white">
            live
          </span>
        </p>

        {/* center title */}
        <div className="flex items-center">
          <div className="flex flex-col justify-center items-center">
            <p className="text-[8px] md:text-xs text-slate-400">check and explore</p>
            <h2 className="text-sm md:text-lg font-light tracking-wide uppercase">
              <span className="inline-block gradient-text">What&apos;s</span>
              <span className="inline-block gradient-text delay ml-1">New</span>
            </h2>
          </div>
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-silver-300/40 to-transparent animate-pulse-vert" />
        </div>

        {/* right toggle */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 font-light hidden md:block animate-fade-text">
            {isExpanded ? 'Click to collapse' : 'Click to explore'}
          </span>
          <motion.div
            className="w-6 h-6 rounded-full border border-silver-300/30 flex items-center justify-center"
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <HugeiconsIcon icon={ArrowUp01FreeIcons} height={12} width={12} />
          </motion.div>
        </div>
      </div>

      {/* expandable section */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="bg-white/10 mx-2 rounded-2xl mb-2 py-4 px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left items-center w-full">
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center">
                        <p className="text-xl veronica-class md:text-2xl mr-4 w-8 h-8 md:w-14 md:h-14 flex items-center justify-center bg-slate-800 rounded-lg md:rounded-2xl shrink-0">
                          {item.index}
                        </p>
                        <div className="relative z-10">
                          <h3 className="text-sm md:text-lg font-medium text-gray-100 group-hover:text-white">
                            {item.title}
                          </h3>
                          <p className="line-clamp-2 text-xs md:text-sm text-gray-400 group-hover:text-gray-300">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-lg font-light text-gray-500">
                      No new updates yet
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Check back soon for fresh content
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* keyframes */}
      <style jsx global>{`
        .shimmer-bg {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(192, 192, 192, 0.1),
            transparent
          );
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .gradient-text {
          background: linear-gradient(
            90deg,
            #e2e8f0,
            #f8fafc,
            #e2e8f0
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% 100%;
          animation: gradientMove 4s ease-in-out infinite;
        }
        .gradient-text.delay {
          animation-delay: 0.5s;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-pulse-vert {
          animation: pulse-vert 2s ease-in-out infinite;
        }
        @keyframes pulse-vert {
          0%,
          100% {
            height: 20px;
          }
          50% {
            height: 40px;
          }
        }
        .animate-fade-text {
          animation: fade-text 2s ease-in-out infinite;
        }
        @keyframes fade-text {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  )
}

export default function Demo () {
  const sampleItems = [
  {
    index: 1,
    title: 'Treasury has now its treasures',
    description:
      'Explore most underrated poets and their poems, blogs from our side that are very insightful and shers so great.',
    date: '2 days ago'
  },
  {
    index: 2,
    title: 'Get Featured',
    description:
      'You can also be listed on our website and have your best work listed on MicTale.',
    date: '1 week ago'
  },
  {
    index: 3,
    title: 'Download the Best',
    description:
      'You can now also download the ghazals and poems and share with your friend.',
    date: '2 weeks ago'
  },
  {
    index: 4,
    title: 'Be Searchable on Google',
    description:
      'If you contribute to our platform with your content, you get indexed by Google.',
    date: '3 weeks ago'
  },
  {
    index: 5,
    title: 'Better and Faster',
    description:
      'Now our website is very faster, optimized and better.',
    date: '1 month ago'
  }
]

  return <WhatsNew items={sampleItems} />
}
