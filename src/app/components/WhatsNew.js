'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight,
  Instagram,
  ArrowUpRight
} from 'lucide-react'
import Image from 'next/image'

const MicTaleLuxuryAnnouncement = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className='relative mx-auto md:mx-6 group'>
<div
  className="relative z-10 bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] rounded-b-3xl cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
  onClick={() => {
    // Only toggle if screen width is greater than 768px
    if (window.innerWidth >= 768) {
      setIsExpanded(!isExpanded);
    }
  }}
>
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4),transparent)] pointer-events-none' />

        <div className='relative z-20 md:py-8 py-8 md:px-10 flex flex-col md:flex-row items-center justify-center md:gap-18'>
          <div className='flex flex-col items-center'>
            <div className='relative w-fit px-2 py-1 md:px-5 md:py-1.5 flex rounded-full border border-[#b45309]/30 bg-[linear-gradient(135deg,#bf953f,#fcf6ba,#b38728,#fbf5b7,#aa771c)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.2)] overflow-hidden group'>
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className='absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12'
              />

              <p className='relative z-10 text-[10px] text-[#451a03] uppercase tracking-widest md:tracking-[0.3em] flex items-center gap-2 font-medium whitespace-nowrap'>
                Officially Announced
              </p>
            </div>

            <Image
              src='/images/studio_logo.png'
              width={400}
              height={250}
              alt='MicTale Luxury Announcement'
              className='w-auto h-10 md:h-16 object-contain'
            />
          </div>

          <div className='w-60 md:w-40 h-[0.7px] bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-2 md:hidden'></div>

          <div className='md:mt-0 flex flex-col items-center'>
            <p className='text-slate-500 text-[10px] md:text-sm'>
              India's Most Creative Studio
            </p>
            <div className='w-30 md:w-40 bg-slate-700 h-[0.7px]'></div>
            <div className='tracking-widest text-sm md:text-lg uppercase text-black'>
          Opening Soon
            </div>
            
          </div>
          <div className='mt-6 md:mt-0 hidden md:flex items-center gap-4'>
            <motion.div
              animate={{ x: isExpanded ? 5 : 0 }}
              className='p-3 rounded-full border border-black/10 bg-black/5 group-hover:border-black/20 transition-all'
            >
              <ChevronRight
                className={`text-slate-800 transition-transform duration-500 ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className='overflow-hidden'
            >
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-4xl mx-auto px-8 py-6 bg-[#030712] border border-white/10 rounded-xl">
  
  <div className="flex flex-col mb-4 md:mb-0">
    <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold mb-1">Stay Tuned</p>
    <h3 className="text-lg font-light text-slate-200">
      For more updates, follow us on <span className="font-semibold text-white">Instagram</span>
    </h3>
  </div>
  <a
    href="https://www.instagram.com/mictale.in"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 px-6 py-2.5 bg-white text-black rounded-lg hover:bg-slate-200 transition-all duration-300"
  >
    <Instagram size={18} />
    <span className="text-xs font-bold uppercase tracking-widest">Follow @MicTale</span>
    <ArrowUpRight size={14} className="opacity-50" />
  </a>
</div>

              <div className='pb-10 flex justify-center'>
                <div className='h-[1px] w-32 bg-gradient-to-r from-transparent via-slate-400 to-transparent' />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .silver-accent-text {
          background: linear-gradient(to bottom, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  )
}

const FeatureBox = ({ icon, title, desc }) => (
  <div className='flex flex-col items-center text-center space-y-4 group/item'>
    <div className='w-12 h-12 flex items-center justify-center rounded-xl bg-black/5 border border-black/10 text-slate-800 group-hover/item:scale-110 group-hover/item:border-slate-500/40 transition-all duration-700'>
      {icon}
    </div>
    <div>
      <h4 className='text-xs font-bold text-slate-900 uppercase tracking-widest mb-1'>
        {title}
      </h4>
      <p className='text-[11px] text-slate-600 font-light leading-relaxed'>
        {desc}
      </p>
    </div>
  </div>
)

export default MicTaleLuxuryAnnouncement
