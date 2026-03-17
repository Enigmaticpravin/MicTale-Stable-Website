'use client'

import { useState } from 'react'
import ShowDetails from '@/app/components/ShowDetails'
import SuccessMessage from '@/app/components/SuccessMessage'
import Footer from '@/app/components/Footer'

export default function ClientForm({ showDetails }) {
  const [isSubmitted, setSubmitted] = useState(null)

  return (
    <>
    <div className='bg-gray-950 flex flex-col items-center justify-center'>
      {isSubmitted ? (
        <SuccessMessage />
      ) : (
        <>

          <ShowDetails show={showDetails} />

          <div className='mx-auto max-w-3xl h-[1px] bg-gradient-to-r from-gray-950 via-white to-gray-950'></div>
        </>
      )}
    </div>
       <Footer />
       </>
  )
}
