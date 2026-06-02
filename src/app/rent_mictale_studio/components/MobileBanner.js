'use client'

import { useState } from 'react'
import Image from 'next/image'
import BookingPopup from './BookingPopup'

export default function MobileBanner() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div onClick={() => setOpen(true)}>
        <Image
          src='/images/rentcover.webp'
          alt='MicTale Studio Delhi NCR Event Venue'
          width={1080}
          height={608}
          priority
          className='w-full h-auto'
        />
      </div>

      <BookingPopup
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}