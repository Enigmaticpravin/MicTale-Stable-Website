'use client'

import React from 'react'
import { Sliders, Shield, Clock, Users, Calendar, Play } from 'lucide-react'
import { useState } from 'react'

export default function HeroSection () {
  const [selectedDate, setSelectedDate] = useState('')
  const [fromTime, setFromTime] = useState('')
  const [toTime, setToTime] = useState('')
  const [availabilityMessage, setAvailabilityMessage] = useState('')

  const checkAvailability = () => {
    if (!selectedDate || !fromTime || !toTime) {
      setAvailabilityMessage('Please select date and time first')
      return
    }

    setAvailabilityMessage('✅ Available')
  }

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section')

    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section className='relative w-full border-b border-zinc-900 bg-[#0b0c10]'>
      <div className='absolute inset-0 pointer-events-none z-0 overflow-hidden'>
        <div
          className='absolute hidden md:flex right-0 top-0 w-full h-full bg-cover bg-center'
          style={{
            backgroundImage: `url('/images/studiocover.png')`
          }}
        />
        <div
          className='absolute flex md:hidden right-0 top-0 w-full h-full bg-cover bg-center'
          style={{
            backgroundImage: `url('/images/mobilecover.jpg')`
          }}
        />
      </div>

      <div className='relative z-10 max-w-[1400px] mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
        <div className='lg:col-span-7 hidden md:flex flex-col items-start justify-between h-full min-h-[350px]'>
          <div className='grid-cols-5 hidden gap-2 sm:gap-4 max-w-2xl w-full'>
            {[
              { icon: Sliders, label: 'Premium Equipment' },
              { icon: Shield, label: 'Acoustically Treated' },
              { icon: Clock, label: 'Flexible Timings' },
              { icon: Users, label: 'On-Site Support' },
              { icon: Calendar, label: 'Easy Booking' }
            ].map((item, idx) => (
              <div
                key={idx}
                className='flex flex-col items-center text-center group'
              >
                <div className='w-12 h-12 rounded-xl bg-[#111218] border border-zinc-800 flex items-center justify-center text-[#e2a03f] mb-3 group-hover:border-[#e2a03f]/30 transition-all'>
                  <item.icon className='w-4 h-4 stroke-[1.5]' />
                </div>
                <span className='text-[10px] sm:text-xs text-zinc-400 font-medium leading-tight max-w-[80px] tracking-tight'>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div>
            <div
              className='relative p-[1.5px] text-center md:text-left rounded-full w-fit mx-auto md:mx-0 bg-[length:300%_auto] bg-gradient-to-r from-[#8a6f27] via-[#e2a03f] via-[#f9e498] via-[#e2a03f] to-[#8a6f27]'
              style={{
                animation: 'luxury-gold-shimmer 7s ease-in-out infinite'
              }}
            >
              <div className='bg-[#020617] rounded-full px-6 md:px-5 py-1 flex items-center justify-center'>
                <p
                  className='md:text-3xl uppercase bg-[length:300%_auto] bg-gradient-to-r from-[#8a6f27] via-[#e2a03f] via-[#f9e498] via-[#e2a03f] to-[#8a6f27] bg-clip-text text-transparent select-none'
                  style={{
                    animation: 'luxury-gold-shimmer 7s ease-in-out infinite'
                  }}
                >
                  Rent our space
                </p>
              </div>

              <style>{`
    @keyframes luxury-gold-shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}</style>
            </div>

            <h1 className='text-2xl sm:text-5xl lg:text-6xl elsie-black font-extrabold text-white tracking-tight px-10 md:px-0 mt-2 md:mt-8 text-center md:text-left'>
              NCR's Most Aesthetic & Poetic Venue
            </h1>

            <p className='px-4 py-0.5 mt-10 montserrat-regular font-bold bg-blue-500 w-fit rounded-4xl mx-auto md:mx-0'>
              perfect for
            </p>

            <h5 className='text-lg sm:text-xl text-white montserrat-regular mt-3 text-center md:text-left'>
              Poetry & Ghazal Shows | Solo & Comedy Shows |<br></br> Book
              Launches | Book Meetups & More
            </h5>
          </div>

          <div className='flex items-center gap-4 w-fit cursor-pointer group mt-8'>
            <div className='w-14 h-14 rounded-full border border-zinc-800 bg-[#111218]/80 flex items-center justify-center shadow-lg group-hover:border-white transition-all'>
              <Play className='w-4 h-4 text-[#ffffff] fill-[#ffffff] translate-x-0.5' />
            </div>
            <div>
              <p className='text-xs font-bold tracking-wider text-white uppercase group-hover:text-[#ffffff] transition-colors'>
                Watch Studio Tour
              </p>
              <p className='text-[11px] text-zinc-500 mt-0.5 font-mono'>
                1:45 min
              </p>
            </div>
          </div>
        </div>

        <div className='lg:col-span-5 flex justify-end font-sans antialiased'>
          <div className='w-full max-w-[440px] bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group/card'>
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
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
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
                      className='w-full bg-[#0f172a] px-4 py-4 text-xs text-white focus:outline-none rounded-xl'
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
                      className='w-full bg-[#0f172a] px-4 py-4 text-xs text-white focus:outline-none rounded-xl'
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
              {availabilityMessage && (
                <div className='text-center'>
                  <p className='text-green-400 text-xs tracking-wide'>
                    {availabilityMessage}
                  </p>
                </div>
              )}

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
      </div>
    </section>
  )
}
