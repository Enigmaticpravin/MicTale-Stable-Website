'use client'

import { useState } from 'react'
import ShowDetails from '@/app/components/ShowDetails'
import SuccessMessage from '@/app/components/SuccessMessage'
import Footer from '@/app/components/Footer'

export default function ClientForm({ showDetails }) {
  const [isSubmitted, setSubmitted] = useState(null)

  return (
    <div className='min-h-screen bg-gray-950 flex flex-col items-center justify-center'>
      {isSubmitted ? (
        <SuccessMessage />
      ) : (
        <>
          <div className='fixed inset-0 pointer-events-none'>
            <div className='absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl moving-gradient-1' />
            <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl moving-gradient-2' />
          </div>

          <ShowDetails showid={showDetails?.id} />

          <div className='mx-auto max-w-3xl h-[1px] bg-gradient-to-r from-gray-950 via-white to-gray-950'></div>
        </>
      )}

      <Footer />
    </div>
  )
}
