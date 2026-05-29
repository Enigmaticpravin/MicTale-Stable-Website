'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const MicTaleLuxuryAnnouncement = () => {


  return (
    <Link href="/rent_mictale_studio">
    <section className='relative mx-auto md:mx-6 group'>
<div
  className="relative z-10 bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] rounded-b-3xl cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
>
        <div className='absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.4),transparent)] pointer-events-none' />

        <div className='relative z-20 md:py-8 py-8 md:px-10 flex flex-col md:flex-row items-center justify-center md:gap-18'>
          <div className='flex flex-col items-center'>
           

            <Image
              src='/images/studio_logo.png'
              width={400}
              height={250}
              alt='MicTale Luxury Announcement'
              className='w-auto h-8 md:h-16 mb-2 md:mb-0 object-contain'
            />
<p className='text-black libre-baskerville-regular-italic -mt-3 text-xs md:text-lg'>
  is now available for 
  <span className="relative inline-flex items-center ml-1 px-2 md:px-5 md:py-1 font-bold text-white text-sm rounded-full overflow-hidden group">
    <span className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-700 to-slate-950" />

    <span className="absolute inset-0 border-t border-white/40 rounded-full" />

    <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4)_0%,transparent_75%)]" />

    <span className="absolute inset-0 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.4)] rounded-full" />

    <span className="text-xs md:text-lg relative z-10 tracking-tight">
      space bookings
    </span>

    <span className="absolute -inset-1 bg-blue-600/20 blur-lg -z-10 group-hover:bg-blue-600/40 transition-colors duration-500" />
  </span>
</p></div>
       

          
        </div>
      </div>

      <style jsx>{`
        .silver-accent-text {
          background: linear-gradient(to bottom, #1e293b 0%, #475569 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
    </Link>
  )
}

export default MicTaleLuxuryAnnouncement
