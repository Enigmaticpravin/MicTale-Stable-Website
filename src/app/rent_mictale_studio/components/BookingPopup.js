'use client'

import { useState } from 'react'

export default function BookingPopup({
  isOpen,
  onClose
}) {
  const [date, setDate] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [message, setMessage] = useState('')

  const checkAvailability = () => {
    if (!date || !fromTime || !toTime) {
      setMessage('Please select date and time')
      return
    }

    setMessage('✅ Available')
  }

  const scrollToPricing = () => {
    onClose()

    document
      .getElementById('pricing-section')
      ?.scrollIntoView({
        behavior: 'smooth'
      })
  }

  return (
  <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen
          ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-black/60'
          : 'opacity-0 pointer-events-none backdrop-blur-none bg-black/0'
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[440px] bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-300 ${
          isOpen
            ? 'scale-100 translate-y-0'
            : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
          <button
            onClick={() => setIsPopupOpen(false)}
            className='absolute top-5 right-5 text-white/40 hover:text-white/80 transition-colors z-20 cursor-pointer p-1'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <div className='absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 blur-[100px] pointer-events-none' />
          <div className='absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-600/10 blur-[100px] pointer-events-none' />

          <div className='absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F9E498]/30 to-transparent' />

          <div className='text-center mb-8 z-10 relative'>
            <h3 className='text-2xl md:text-3xl elsie-regular tracking-tight bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent'>
              Check Availability
            </h3>
            <p className='text-xs text-gray-400 font-light mt-2 tracking-wide max-w-[280px] mx-auto leading-relaxed'>
              Experience tailored scheduling at your convenience.
            </p>
          </div>

          <form
            className='space-y-6 z-10 relative'
            onSubmit={e => e.preventDefault()}
          >
            <div className='space-y-1.5'>
              <label className='text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase ml-1 block'>
                Select Date
              </label>
              <div className='relative rounded-xl flex items-center border border-white/10 hover:border-white/30 bg-white/5 backdrop-blur-md focus-within:border-[#F9E498]/40 transition-all duration-300'>
                <input
                  type='date'
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className='w-full bg-transparent px-5 py-4 text-xs text-white focus:outline-none tracking-wide'
                />
                <svg
                  className='w-4 h-4 text-white/40 absolute right-5 pointer-events-none'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5'
                  />
                </svg>
              </div>
            </div>

            <div className='space-y-3'>
              <label className='text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase ml-1 block'>
                Select Time Range
              </label>

              <div className='grid grid-cols-2 gap-3'>
                <div className='relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md'>
                  <select
                    value={fromTime}
                    onChange={e => setFromTime(e.target.value)}
                    className='w-full bg-transparent px-4 py-4 text-xs text-white focus:outline-none'
                  >
                    <option value=''>From</option>
                    <option value='09:00'>09:00 AM</option>
                    <option value='10:00'>10:00 AM</option>
                    <option value='11:00'>11:00 AM</option>
                    <option value='12:00'>12:00 PM</option>
                    <option value='13:00'>01:00 PM</option>
                    <option value='14:00'>02:00 PM</option>
                    <option value='15:00'>03:00 PM</option>
                    <option value='16:00'>04:00 PM</option>
                    <option value='17:00'>05:00 PM</option>
                    <option value='18:00'>06:00 PM</option>
                    <option value='19:00'>07:00 PM</option>
                    <option value='20:00'>08:00 PM</option>
                  </select>
                </div>

                <div className='relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md'>
                  <select
                    value={toTime}
                    onChange={e => setToTime(e.target.value)}
                    className='w-full bg-transparent px-4 py-4 text-xs text-white focus:outline-none'
                  >
                    <option value=''>To</option>
                    <option value='10:00'>10:00 AM</option>
                    <option value='11:00'>11:00 AM</option>
                    <option value='12:00'>12:00 PM</option>
                    <option value='13:00'>01:00 PM</option>
                    <option value='14:00'>02:00 PM</option>
                    <option value='15:00'>03:00 PM</option>
                    <option value='16:00'>04:00 PM</option>
                    <option value='17:00'>05:00 PM</option>
                    <option value='18:00'>06:00 PM</option>
                    <option value='19:00'>07:00 PM</option>
                    <option value='20:00'>08:00 PM</option>
                    <option value='21:00'>09:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type='button'
              onClick={checkAvailability}
              className='w-full py-4 px-4 rounded-full text-xs font-bold uppercase tracking-[0.15em] cursor-pointer active:scale-[0.98] bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300'
            >
              Check Availability
            </button>
           

            <div className='relative flex py-2 items-center justify-center'>
              <div className='flex-grow border-t border-white/5'></div>
              <span className='flex-shrink mx-4 text-[9px] text-gray-500 font-bold uppercase tracking-[0.25em]'>
                or
              </span>
              <div className='flex-grow border-t border-white/5'></div>
            </div>

            <button
              type='button'
              onClick={scrollToPricing}
              className='w-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-4 rounded-full text-xs tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer backdrop-blur-md'
            >
              Explore Pricing & Packages
            </button>
          </form>

          <div className='mt-8 pt-6 border-t border-white/10 flex flex-col items-center justify-center text-center z-10 relative'>
            <span className='text-[9px] font-black tracking-[0.2em] text-gray-500 uppercase'>
              Need Help? Call Us:
            </span>
            <a
              href='tel:+919667645676'
              className='text-sm font-light text-gray-300 mt-2 hover:text-[#F9E498] transition-colors duration-300 tracking-widest font-mono'
            >
              +91 96676 45676
            </a>
          </div>
        </div>
      </div>
  )
}