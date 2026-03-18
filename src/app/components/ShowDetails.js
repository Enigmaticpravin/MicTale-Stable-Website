'use client'

import React, { useEffect, useState } from 'react'
import {
  Tag,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
  Info,
  X
} from 'lucide-react'
import poster from '@/../public/images/mobile.webp'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase/client'
import BookingPopup from './BookingPopup'

const ShowDetails = ({ show }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [expanded, setExpanded] = useState(false)

  const maxLength = 150
  const toggleTerms = () => setIsTermsOpen(!isTermsOpen)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleRegistrationClick = () => {
    if (show.recurring && show.available_dates?.length > 0) {
      setIsDateModalOpen(true)
    } else {
      setSelectedDate(show.available_dates?.[0] || null)
      setIsPopupOpen(true)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setIsDateModalOpen(false)
    setIsPopupOpen(true)
  }

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100'>
      
      {isDateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Select a Date</h3>
              <button onClick={() => setIsDateModalOpen(false)} className="p-2 hover:bg-gray-800 cursor-pointer rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
  {show.available_dates?.map((dateStr, idx) => {
    const d = new Date(dateStr)
    return (
      <button
        key={idx}
        onClick={() => handleDateSelect(dateStr)}
        className="w-full cursor-pointer flex items-center justify-between p-4 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-blue-500 hover:bg-gray-800 transition-all group"
      >
        <div className="text-left">
          <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">
            {/* Formats to: 22 March, Sunday */}
            {`${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}, ${d.toLocaleDateString('en-GB', { weekday: 'long' })}`}
          </p>
          <p className="text-sm text-gray-400">
            {d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
          <ChevronDown className="w-4 h-4 -rotate-90 text-white" />
        </div>
      </button>
    )
  })}
</div>
          </div>
        </div>
      )}

      <div className='mx-auto'>
        <div className='flex flex-col md:flex-row md:gap-4 md:rounded-xl overflow-hidden justify-center md:px-10 md:py-10 min-h-[470px]'>
          <Image
            src={show.cover_url || poster}
            alt={show.name}
            width={800}
            height={470}
            className='md:rounded-xl hidden md:flex object-cover'
          />

          <Image
            src={show.cover_url || poster}
            alt={show.name}
            width={400}
            height={250}
            className='md:hidden h-fit w-full object-cover'
          />
          <div className='md:w-2/5 flex flex-col flex-1'>
            <div className='h-full p-6 md:rounded-xl bg-gray-800 text-white flex flex-col justify-between'>
              <h2 className='text-2xl font-bold mb-6' style={poppinsStyle}>
                {show.name}
              </h2>

              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Tag className='w-6 h-6 text-blue-400' />
                  <span>{show?.category}</span>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='w-6 h-6 text-blue-400' />
                  <div className='flex flex-col' style={poppinsStyle}>
                    <span className='font-bold text-lg'>
                      {show.recurring ? (
                        "Multiple Dates Available"
                      ) : (
                        new Date(show.available_dates?.[0] || show.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })
                      )}
                    </span>
                    <span className='text-gray-400 text-sm'>
                      {show.recurring ? `${show.available_dates?.length} upcoming slots` : (show.date?.split(' | ')[1] || '02 PM onwards')}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='w-6 h-6 text-blue-400' />
                  <span>{show.location}</span>
                </div>
              </div>

              <div className='mt-8'>
                <p className='text-gray-200 mb-2'>Registration Fees</p>
                <div className='w-[50%] bg-gradient-to-r from-white via-gray-700 to-gray-800 h-[2px] mb-2'></div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-[10px] uppercase tracking-widest font-semibold text-slate-300' style={poppinsStyle}>
                        Studio Inaugural Offer
                      </span>
                      <span className='text-sm text-slate-400 line-through decoration-1' style={poppinsStyle}>
                        ₹500
                      </span>
                    </div>

                    <div className='flex items-baseline gap-1'>
                      <span className='text-2xl font-bold text-white' style={poppinsStyle}>
                        ₹{show.registration_fee}
                      </span>
                      <span className='text-xs font-medium text-emerald-500' style={poppinsStyle}>
                        (Limited Time)
                      </span>
                    </div>
                  </div>

                  {show.status === 'upcoming' ? (
                    <div className="relative w-full md:w-fit p-[1.5px] rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(184,134,11,0.3)]">
                      <div className="absolute inset-[-400%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg,#d4af37_0%,#f9f1c2_15%,#b8860b_30%,#fbf5b7_45%,#aa8239_60%,#f9f1c2_75%,#d4af37_100%)]" />
                      <div className="relative w-full h-full px-7 py-2 rounded-full bg-black/60 backdrop-blur-2xl border border-yellow-500/30 flex items-center justify-center gap-3">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]"></span>
                        </span>
                        <span className="font-extrabold tracking-[0.25em] uppercase text-[10px] bg-gradient-to-b from-[#f9f1c2] via-[#d4af37] to-[#aa8239] bg-clip-text text-transparent">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  ) : show.status === 'live' ? (
                    <button
                      onClick={handleRegistrationClick}
                      className="cursor-pointer w-full md:w-fit text-white px-8 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 hover:scale-105 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold tracking-wide"
                    >
                      Register to Perform
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
            <div className='hidden md:grid grid-cols-3 gap-2 text-black mt-8 flex-1'>
              {[
                { icon: Globe, label: 'Language', val: 'Hindi, English, Urdu' },
                { icon: Clock, label: 'Duration', val: '3 Hours' },
                { icon: Info, label: 'Age Limit', val: '15 yrs & above' }
              ].map((item, i) => (
                <div key={i} className='flex items-center p-4 bg-gray-50 rounded-lg'>
                  <div className='bg-gray-100 p-2 rounded-full mr-4 text-gray-500'>
                    <item.icon className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-gray-400 text-xs'>{item.label}</p>
                    <p className='font-bold text-sm'>{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='md:px-10 md:pb-20'>
          <div className='md:flex items-stretch gap-6'>
            <div className='max-w-4xl flex-1 text-black bg-white rounded-2xl shadow-sm p-8'>
              <h2 className='text-xl font-bold mb-4'>About the event</h2>
              <p className='montserrat-regular text-gray-700 leading-relaxed text-justify'>
                {expanded || show.description.length <= maxLength
                  ? show.description
                  : `${show.description.substring(0, maxLength)}...`}
              </p>
              {show.description.length > maxLength && (
                <button onClick={() => setExpanded(!expanded)} className='text-blue-600 flex items-center text-sm mt-2 font-semibold'>
                  {expanded ? 'See less' : 'Read more'} {expanded ? <ChevronUp className='ml-1 w-4 h-4' /> : <ChevronDown className='ml-1 w-4 h-4' />}
                </button>
              )}

              <h2 className='text-xl font-bold mt-10 mb-4'>Venue</h2>
              <div className='border border-gray-100 rounded-2xl p-4 bg-gray-50'>
                <h3 className='text-lg font-bold text-gray-800'>{show.location}</h3>
                <p className='text-gray-500 mb-4 text-sm'>{show.address}</p>
                <div className='w-full h-52 bg-gray-200 rounded-xl overflow-hidden mb-4'>
                   <iframe src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.583943352849!2d77.37509327569087!3d28.61225588500079!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce53df7d6d171%3A0x2e1a09972f9ad2ec!2sMicTale%20Studio!5e0!3m2!1sen!2sus!4v1773813061769!5m2!1sen!2sus' width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading='lazy'></iframe>
                </div>
                <a href="#" className='w-full py-3 bg-white border border-gray-200 text-gray-800 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors'>
                  <MapPin className='w-4 h-4 text-blue-500' /> Get Directions
                </a>
              </div>
            </div>

            <div className='md:block mt-2 md:mt-0 md:w-1/3 bg-gray-800 rounded-2xl p-8 border border-gray-700'>
              <h2 className='text-xl font-bold text-white mb-6'>Terms & Conditions</h2>
              <ul className='list-disc pl-5 space-y-4 text-sm text-gray-300'>
                      

                    <li>

                      Performers must arrive at least 20 minutes before the show

                      begins.

                    </li>

                    <li>

                      Each performer will get 5–6 minutes on stage. Exceeding

                      the time limit may result in interruption.

                    </li>

                    <li>

                      Lineup and performance order are decided by the organizers

                      and may change if required.

                    </li>

                    <li>

                      All content presented on stage is the sole responsibility

                      of the performer.

                    </li>

                    <li>

                      Hate speech, harassment, or intentional disturbance will

                      lead to immediate removal from the venue.

                    </li>


                    <li>

                      The event may be photographed or recorded. By attending,

                      you consent to being featured in MicTale’s promotional

                      content.

                    </li>

                    <li>

                      MicTale is not responsible for loss or damage of personal

                      belongings.

                    </li>

                    <li>

                      Any damage to studio property will be charged to the

                      responsible individual.

                    </li>

                    <li>

                      All payments for tickets or performer slots are

                      non-refundable unless the event is cancelled by MicTale.

                    </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BookingPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        showId={show.id}
        user={currentUser}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default ShowDetails