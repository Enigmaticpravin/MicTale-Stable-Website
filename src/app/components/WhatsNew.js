'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowDown01FreeIcons,
  ArrowUp01FreeIcons
} from '@hugeicons/core-free-icons/index'
import { HugeiconsIcon } from '@hugeicons/react'

const WhatsNew = ({ items = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.section
      className='relative bg-gradient-to-r md:mx-4 md:rounded-b-2xl from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden cursor-pointer'
      onClick={() => setIsExpanded(!isExpanded)}
      layout
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className='absolute inset-0 bg-gradient-to-r from-silver-200/5 via-gray-300/10 to-slate-400/5'></div>

      <motion.div
        className='absolute inset-0 bg-gradient-to-r from-transparent via-silver-300/5 to-transparent'
        animate={{ x: isExpanded ? 0 : ['-100%', '100%'] }}
        transition={{
          duration: isExpanded ? 0 : 3,
          repeat: isExpanded ? 0 : Infinity,
          ease: 'linear'
        }}
      />

      <motion.div
        className='relative z-10 py-3 px-8 md:px-16 flex items-center justify-between'
        layout
      >
        <motion.p
          className='hidden md:block text-gray-400 font-light text-xs'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          New update now{' '}
          <span className='border rounded-2xl px-1 uppercase bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white ml-1'>
            live
          </span>
        </motion.p>
        <motion.p
          className='md:hidden text-gray-400 text-[8px] font-light flex flex-col items-center'
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
        >
          new update now
          <span className='border rounded-2xl px-1 uppercase bg-gradient-to-r from-red-800 via-red-600 to-red-800 text-white'>
            live
          </span>
        </motion.p>
        <div className='flex items-center'>
          <div className='flex flex-col justify-center items-center'>
            <p className='text-[8px] md:text-xs text-slate-400'>
              check and explore
            </p>

            <div>
              <motion.h2
                className='text-sm md:text-lg font-light tracking-wide uppercase'
                layout
              >
                <motion.span
                  className='inline-block bg-gradient-to-r from-slate-200 via-gray-100 to-slate-300 bg-clip-text text-transparent'
                  animate={{
                    backgroundPosition: ['0%', '100%', '0%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  What&apos;s
                </motion.span>
                <motion.span
                  className='inline-block bg-gradient-to-r from-silver-300 via-gray-200 to-silver-400 bg-clip-text text-transparent font-extralight ml-1'
                  animate={{
                    backgroundPosition: ['100%', '0%', '100%']
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5
                  }}
                  style={{ backgroundSize: '200% 100%' }}
                >
                  New
                </motion.span>
              </motion.h2>
            </div>
          </div>
          <motion.div
            className='hidden md:block w-px bg-gradient-to-b from-transparent via-silver-300/40 to-transparent'
            animate={{ height: [20, 40, 20] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <motion.div
          className='flex items-center space-x-3'
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.span
            className='text-xs text-gray-500 font-light hidden md:block'
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isExpanded ? 'Click to collapse' : 'Click to explore'}
          </motion.span>

          <motion.div
            className='w-6 h-6 rounded-full border border-silver-300/30 flex items-center justify-center'
            animate={{
              rotate: isExpanded ? 180 : 0,
              borderColor: isExpanded
                ? 'rgb(203 213 225 / 0.5)'
                : 'rgb(203 213 225 / 0.3)'
            }}
            transition={{ duration: 0.3 }}
          >
            <HugeiconsIcon icon={ArrowUp01FreeIcons} height={12} width={12} />
          </motion.div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='bg-white/10 mx-2 rounded-2xl mb-2 py-4 px-5'>
              <div className='grid grid-cols-1 md:grid-cols-2 justify-center gap-2 text-left items-center w-full'>
                {items.length > 0 ? (
                  items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                      whileHover={{
                        y: -8,
                        transition: { duration: 0.3, ease: 'easeOut' }
                      }}
                      className='group relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-300'
                      onClick={e => e.stopPropagation()}
                    >
                      <div className='flex items-center'>
                        <p className='text-xl md:text-2xl mr-4 w-8 h-8 veronica-class md:w-14 md:h-14 flex items-center justify-center bg-slate-800 rounded-lg md:rounded-2xl shrink-0'>
                          {item.index}
                        </p>
                        <div className='relative z-10'>
                          <h3 className='text-sm md:text-lg font-medium text-gray-100 transition-colors duration-300 group-hover:text-white'>
                            {item.title}
                          </h3>
                          <p className='line-clamp-2 text-xs md:text-sm text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-300'>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className='flex flex-col items-center justify-center py-12 text-center'
                  >
                    <p className='text-lg font-light text-gray-500'>
                      No new updates yet
                    </p>
                    <p className='mt-1 text-sm text-gray-600'>
                      Check back soon for fresh content
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
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
