import React, { useEffect, useState, useRef } from 'react'
import {
  Tag,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
  Info
} from 'lucide-react'
import poster from '@/../public/images/mobile.webp'
import Image from 'next/image'
import { supabase } from '@/app/lib/supabase/client'
import BookingPopup from './BookingPopup'
const ShowDetails = ({ show }) => {
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const maxLength = 150
  const toggleTerms = () => {
    setIsTermsOpen(!isTermsOpen)
  }

useEffect(() => {
  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  getUser()

  const { data: listener } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setCurrentUser(session?.user ?? null)
    }
  )

  return () => {
    listener.subscription.unsubscribe()
  }
}, [])

  const handleRegistrationClick = async () => {
    setIsPopupOpen(true)
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100'>
      <div className='mx-auto'>
        <div className='flex flex-col md:flex-row md:gap-4 md:rounded-xl overflow-hidden justify-center md:px-10 md:py-10 min-h-[470px]'>
          <Image
            src={show.cover_url || poster}
            alt={show.name}
            width={800}
            height={470}
            className='md:rounded-xl hidden md:flex'
          />

          <Image
            src={show.cover_url || poster}
            alt={show.name}
            width={400}
            height={250}
            className='md:hidden h-fit w-full'
          />
          <div className='md:w-2/5 flex flex-col flex-1'>
            <div className='h-full p-6 md:rounded-xl bg-gray-800 text-white flex flex-col justify-between'>
              <h2 className='text-2xl font-bold mb-6' style={poppinsStyle}>
                {show.name}
              </h2>

              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Tag className='w-6 h-6' />
                  <span>{show?.category}</span>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='w-6 h-6' />
                  <div
                    className='flex items-center gap-1 text-white'
                    style={poppinsStyle}
                  >
                    <span className='font-bold text-lg'>
                      {new Date(show.date.split(' | ')[0]).toLocaleDateString(
                        'en-GB',
                        {
                          day: '2-digit',
                          month: 'long'
                        }
                      )}
                      :
                    </span>
                    <span className='text-white font-medium ml-1'>
                      {show.date.split(' | ')[1] || '02 PM onwards'}
                    </span>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='w-6 h-6' />
                  <span>{show.location}</span>
                </div>
              </div>

              <div className='mt-8'>
                <p className='text-gray-200 mb-2'>Registration Fees</p>
                <div className='w-[50%] bg-gradient-to-r from-white via-gray-700 to-gray-800 rounded-full bg-black h-[2px] mb-2'></div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div className='flex flex-col gap-1 mb-2 md:mb-0'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='text-[10px] uppercase tracking-widest font-semibold text-slate-300'
                        style={poppinsStyle}
                      >
                        Studio Inaugural Offer
                      </span>
                      <span
                        className='text-sm text-slate-400 line-through decoration-1'
                        style={poppinsStyle}
                      >
                        ₹500
                      </span>
                    </div>

                    <div className='flex items-baseline gap-1'>
                      <span
                        className='text-2xl font-bold text-white'
                        style={poppinsStyle}
                      >
                        ₹{show.registration_fee}
                      </span>
                      <span
                        className='text-xs font-medium text-emerald-600'
                        style={poppinsStyle}
                      >
                        (Limited Time)
                      </span>
                    </div>
                  </div>
                 {show.status === 'upcoming' ? (
<div className="relative m-auto w-full md:w-fit p-[1.5px] rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(184,134,11,0.3)]">
    
    <div className="absolute inset-[-400%] animate-[spin_6s_linear_infinite] 
      bg-[conic-gradient(from_0deg,#d4af37_0%,#f9f1c2_15%,#b8860b_30%,#fbf5b7_45%,#aa8239_60%,#f9f1c2_75%,#d4af37_100%)] opacity-100" />
    
    <div className="relative w-full h-full px-7 py-2 rounded-full 
                    bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-2xl border border-yellow-500/30
                    flex items-center justify-center gap-3 
                    shadow-[inset_0_1px_6px_rgba(255,215,0,0.2)]">
      
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-60"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37] shadow-[0_0_12px_#ffd700]"></span>
      </span>

      <span className="font-extrabold tracking-[0.25em] uppercase text-[10px] 
                       bg-gradient-to-b from-[#f9f1c2] via-[#d4af37] to-[#aa8239] bg-clip-text text-transparent
                       drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
        Coming Soon
      </span>
    </div>
  </div>
) : show.status === 'live' ? (
  <button
    onClick={handleRegistrationClick}
    className="cursor-pointer m-auto w-full md:w-fit md:m-0 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
  >
    Register to Perform
  </button>
) : null}
                </div>
              </div>
            </div>
            <div className='hidden md:grid grid-cols-1 md:grid-cols-3 gap-2 text-black mt-8 flex-1'>
              <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                <div className='bg-gray-100 p-2 rounded-full mr-4'>
                  <Globe className='text-gray-500 w-5 h-5' />
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Language</p>
                  <p className='font-medium'>Hindi, English, Urdu</p>
                </div>
              </div>

              <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                <div className='bg-gray-100 p-2 rounded-full mr-4'>
                  <Clock className='text-gray-500 w-5 h-5' />
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Duration</p>
                  <p className='font-medium'>3 Hours</p>
                </div>
              </div>

              <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                <div className='bg-gray-100 p-2 rounded-full mr-4'>
                  <Info className='text-gray-500 w-5 h-5' />
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Age Limit</p>
                  <p className='font-medium'>15 yrs & above</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='md:flex block md:items-stretch gap-6 md:mx-10'>
            <div className='max-w-4xl mx-auto text-black block bg-white rounded-lg shadow-sm p-6'>
              <div className='md:flex md:gap-8 md:items-start'>
                <div className='flex-1 block justify-between items-center mb-6'>
                  <h2 className='text-xl font-medium'>About the event</h2>
                  <p className='block md:hidden montserrat-regular mt-2 text-justify'>
                    {expanded || show.description.length <= maxLength
                      ? show.description
                      : `${show.description.substring(0, maxLength)}...`}
                  </p>
                  {show.description.length > maxLength && (
                    <button
                      onClick={() => setExpanded(!expanded)}
                      className='text-blue-600 md:hidden flex items-center text-sm mt-1'
                    >
                      {expanded ? 'See less' : 'See all'}{' '}
                      {expanded ? (
                        <ChevronUp className='ml-1 w-4 h-4' />
                      ) : (
                        <ChevronDown className='ml-1 w-4 h-4' />
                      )}
                    </button>
                  )}
                  <p className='hidden md:block montserrat-regular font-medium mt-2 text-justify'>
                    {show.description}
                  </p>
                </div>
              </div>

              <div className='justify-between items-center mb-6 flex md:hidden'>
                <h2 className='text-xl font-bold'>Event Guide</h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 md:hidden'>
                <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                  <div className='bg-gray-100 p-2 rounded-full mr-4'>
                    <Globe className='text-gray-500 w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Language</p>
                    <p className='font-medium'>English, Hindi, Urdu</p>
                  </div>
                </div>

                <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                  <div className='bg-gray-100 p-2 rounded-full mr-4'>
                    <Clock className='text-gray-500 w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>Duration</p>
                    <p className='font-medium'>3 Hours</p>
                  </div>
                </div>

                <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                  <div className='bg-gray-100 p-2 rounded-full mr-4'>
                    <Info className='text-gray-500 w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-gray-500 text-sm'>
                      Best Suited For Ages
                    </p>
                    <p className='font-medium'>15 yrs & above</p>
                  </div>
                </div>
              </div>

              <h2 className='text-xl font-bold mb-4'>Venue</h2>
              <div className='border border-gray-200 flex flex-col rounded-lg p-4 mb-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-700'>
                      {show.location}
                    </h3>
                    <p className='text-gray-600 mt-1'>{show.address}</p>
                  </div>
                </div>

                <div className='w-full h-48 bg-gray-200 rounded-lg overflow-hidden'>
                  <iframe
                    src='https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3502.5778911643106!2d77.37497007550003!3d28.612437375675732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDM2JzQ0LjgiTiA3N8KwMjInMzkuMiJF!5e0!3m2!1sen!2sin!4v1772081472616!5m2!1sen!2sin'
                    width={600}
                    height={450}
                    style={{ border: 0 }}
                    allowFullScreen
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                  />
                </div>

                <a
                  href='https://maps.app.goo.gl/x9ufXEyvWVHHvgiT6'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='mt-4 w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md transition-transform duration-300 flex items-center justify-center gap-2'
                >
                  <MapPin className='w-5 h-5' />
                  Get Directions
                </a>
              </div>

              <div className='border border-gray-200 rounded-lg md:hidden'>
                <button
                  onClick={toggleTerms}
                  className='w-full flex justify-between items-center p-4 text-left cursor-pointer'
                >
                  <h2 className='text-lg font-bold'>Terms & Conditions</h2>
                  {isTermsOpen ? (
                    <ChevronUp className='w-5 h-5' />
                  ) : (
                    <ChevronDown className='w-5 h-5' />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isTermsOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className='p-4 pt-2'>
                    <ul className='list-disc pl-6 space-y-3 text-gray-700'>
                      <li>
                        Entry is allowed only for registered participants and
                        confirmed ticket holders.
                      </li>
                      <li>
                        Performers must arrive at least 20 minutes before the
                        show begins.
                      </li>
                      <li>
                        Each performer will get 4–6 minutes on stage. Exceeding
                        the time limit may result in interruption.
                      </li>
                      <li>
                        Lineup and performance order are decided by the
                        organizers and may change if required.
                      </li>
                      <li>
                        All content presented on stage is the sole
                        responsibility of the performer.
                      </li>
                      <li>
                        Hate speech, harassment, or intentional disturbance will
                        lead to immediate removal from the venue.
                      </li>
                      <li>
                        Audience members are expected to maintain silence during
                        performances.
                      </li>
                      <li>
                        The event may be photographed or recorded. By attending,
                        you consent to being featured in MicTale’s promotional
                        content.
                      </li>
                      <li>
                        MicTale is not responsible for loss or damage of
                        personal belongings.
                      </li>
                      <li>
                        Any damage to studio property will be charged to the
                        responsible individual.
                      </li>
                      <li>
                        Slot confirmation is valid only after full payment is
                        received.
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
            <div className='hidden md:block flex-1 bg-gray-800 border border-gray-200 rounded-lg overflow-hidden'>
              <h2 className='text-lg font-bold mt-5 ml-5'>
                Terms & Conditions
              </h2>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out`}
              >
                <div className='p-4 pt-2 text-sm'>
                  <ul className='list-disc pl-6 space-y-3 text-gray-100'>
                    <li>
                      Entry is allowed only for registered participants and
                      confirmed ticket holders.
                    </li>
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
                      Audience members are expected to maintain silence during
                      performances.
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
                      Slot confirmation is valid only after full payment is
                      received.
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
        </div>
      </div>
      <BookingPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        showId={show.id}
        user={currentUser}
      />
    </div>
  )
}

export default ShowDetails
