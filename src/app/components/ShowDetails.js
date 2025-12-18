import React, { useEffect, useState, useRef } from 'react'
import {
  Users,
  IndianRupee,
  TimerIcon,
  Tag,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Globe,
  Clock,
  Info
} from 'lucide-react'
import { Gift, Star, Video, Megaphone } from 'lucide-react'
import { getDoc, doc, db } from '@/app/lib/firebase-db'
import poster from '@/../public/images/mobile.webp'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import MeetupPopup from './MeetupPopup'
const ShowDetails = ({ showid }) => {
  const [showDetails, setShowDetails] = useState(null)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [user, setUser] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const router = useRouter()
  const pathname = usePathname()

  const maxLength = 150
  const toggleTerms = () => {
    setIsTermsOpen(!isTermsOpen)
  }

  useEffect(() => {
    let unsubscribe = () => {}

    async function loadAuth () {
      const { getAuth, onAuthStateChanged } = await import('firebase/auth')
      const auth = getAuth()

      unsubscribe = onAuthStateChanged(auth, async user => {
        setCurrentUser(user)

        if (user) {
          try {
            const userRef = doc(db, 'users', user.uid)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              setUser(userSnap.data())
            }
          } catch (error) {
            console.error('Failed to load user data')
            setUser(null)
          }
        }
      })
    }

    loadAuth()

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const showRef = doc(db, 'shows', showid)
        const showSnap = await getDoc(showRef)

        if (showSnap.exists()) {
          setShowDetails({ id: showSnap.id, ...showSnap.data() })
        }
      } catch (error) {
        console.error('Error fetching show details:', error)
      }
    }

    fetchShowDetails()
  }, [showid])

  const handleRegistrationClick = async () => {
    try {
      if (currentUser) {
        setIsPopupOpen(true)
      } else {
        const currentPath = window.location.pathname + window.location.search

        if (!localStorage.getItem('authRedirect')) {
          localStorage.setItem('authRedirect', currentPath)
        }
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
      }
    } catch (error) {
      console.error('Authentication error:', error)
    }
  }

  const formattedDate = showDetails?.date
    ? new Date(showDetails.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long'
      })
    : 'Not Known'

  const show = {
    title: showDetails?.name || 'Loading...',
    date: formattedDate,
    location: 'Bansera Park, Delhi',
    address: showDetails?.location || 'Noida, India',
    availableSpots: showDetails?.seats || 30,
    remainingSpots: 30,
    registrationFee: 0,
    description: showDetails?.description || 'Loading...',
    benefits: [
      'Free professional video recording of your exhibition space',
      'Digital promotion across our social media platforms',
      'Networking sessions with industry professionals',
      'Exhibition catalog feature'
    ],
    topPerformerBenefits: [
      'Top three performers get a free slot in our next show',
      'Featured profile on our website',
      'Professional video recording of your performance',
      'Future Opportunities from MicTale'
    ]
  }

  const benefitIcons = [
    <Gift key='gift' className='text-yellow-400 w-8 h-8' />,
    <Star key='star' className='text-yellow-400 w-8 h-8' />,
    <Video key='video' className='text-yellow-400 w-8 h-8' />,
    <Megaphone key='megaphone' className='text-yellow-400 w-8 h-8' />
  ]

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100'>
      <div className='mx-auto'>
        <div className='flex flex-col md:flex-row md:gap-4 md:rounded-xl overflow-hidden justify-center md:px-10 md:py-10 min-h-[470px]'>
          <Image
            src={poster}
            alt={show.title}
            className='w-[800px] h-[470px] md:rounded-xl hidden md:flex'
          />
          <Image src={poster} alt={show.title} className='md:hidden' />

          <div className='md:w-2/5 flex flex-col flex-1'>
            <div className='h-full p-6 md:rounded-xl bg-gray-800 text-white flex flex-col justify-between'>
              <h2 className='text-2xl font-bold mb-6' style={poppinsStyle}>
                {show.title}
              </h2>

              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <Tag className='w-6 h-6' />
                  <span>Open-environment Meetup</span>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='w-6 h-6' />
                  <span>{show.date} | 02 PM</span>
                </div>

                <div className='flex items-center gap-3'>
                  <MapPin className='w-6 h-6' />
                  <span>{show.address}</span>
                </div>
              </div>

              <div className='mt-8'>
                <p className='text-gray-200 mb-2'>Entry Fees</p>
                <div className='w-[50%] bg-gradient-to-r from-white via-gray-700 to-gray-800 rounded-full bg-black h-[2px] mb-2'></div>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                  <div className='flex flex-wrap items-center gap-2 mb-2 md:mb-0'>
                    <span className='md:text-2xl text-sm px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold'>
                      Free
                    </span>
                    <span className='hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap'>
                      Early Bird Offer
                    </span>
                  </div>
                  <button
                    onClick={handleRegistrationClick}
                    className='cursor-pointer  m-auto w-full md:w-fit md:m-0 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'
                  >
                    Register to Attend
                  </button>
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
                  <p className='font-medium'>Hindi, Urdu</p>
                </div>
              </div>

              <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
                <div className='bg-gray-100 p-2 rounded-full mr-4'>
                  <Clock className='text-gray-500 w-5 h-5' />
                </div>
                <div>
                  <p className='text-gray-500 text-sm'>Duration</p>
                  <p className='font-medium'>2 Hours</p>
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
        <div className='max-w-4xl mx-auto text-black block md:mb-10 bg-white rounded-lg shadow-sm p-6'>
          <div className='block justify-between items-center mb-6'>
            <h2 className='text-xl font-bold'>About the event</h2>
            <p className='block md:hidden font-medium mt-2 text-justify'>
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
            <p className='hidden md:block font-medium mt-2 text-justify'>
              {show.description}
            </p>
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
                <p className='font-medium'>2 Hours</p>
              </div>
            </div>

            <div className='flex items-center p-4 bg-gray-50 rounded-lg'>
              <div className='bg-gray-100 p-2 rounded-full mr-4'>
                <Info className='text-gray-500 w-5 h-5' />
              </div>
              <div>
                <p className='text-gray-500 text-sm'>Best Suited For Ages</p>
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
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25122.3685409536!2d77.28206052816522!3d28.59680683470372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce31e6f7d0c67%3A0x44b48b1c09793e76!2sBaansera%20Park!5e0!3m2!1sen!2sin!4v1765982288315!5m2!1sen!2sin'
                width={600}
                height={450}
                style={{ border: 0 }}
                allowFullScreen
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              />
            </div>

            <a
              href='https://maps.app.goo.gl/6LnXQBSVbs9UAHaVA'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-4 w-full text-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2'
            >
              <MapPin className='w-5 h-5' />
              Get Directions
            </a>
          </div>

          <div className='border border-gray-200 rounded-lg overflow-hidden'>
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
                isTermsOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className='p-4 pt-2'>
                <ul className='list-disc pl-6 space-y-3 text-gray-700'>
                  <li>
                    Entry is allowed only for registered participants. Please
                    carry your registration confirmation (digital or print).
                  </li>
                  <li>
                    This is a free community meetup. However, registration once
                    done cannot be transferred.
                  </li>
                  <li>
                    Entry to Bansera Park may require a separate park entry fee,
                    which must be paid directly by attendees at the park
                    entrance, as per park guidelines.
                  </li>
                  <li>
                    The meetup will take place in a public park, so all
                    participants are expected to follow park rules and cooperate
                    with on-ground coordinators.
                  </li>
                  <li>
                    Please avoid carrying sharp objects, alcohol, illegal
                    substances, or any item that may disturb the safety or
                    comfort of others.
                  </li>
                  <li>
                    Light refreshments and water bottles are allowed, but please
                    do not litter. Help us keep the park clean.
                  </li>
                  <li>
                    Smoking, vaping, or substance use during the meetup is
                    discouraged in respect of the public space and fellow
                    participants.
                  </li>
                  <li>
                    MicTale is not responsible for loss or damage of personal
                    belongings. Please take care of your valuables.
                  </li>
                  <li>
                    Any form of harassment, aggressive behavior, or disrespect
                    towards participants or park staff will lead to immediate
                    removal.
                  </li>
                  <li>
                    By attending the meetup, you agree to the possibility of
                    being photographed or recorded for MicTale’s community and
                    promotional content.
                  </li>
                  <li>
                    Event flow and timings may change slightly depending on
                    weather, crowd, or on-ground conditions.
                  </li>
                  <li>
                    Participants are free to leave at any time, but re-entry may
                    be subject to coordination availability.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='sm:px-6 md:px-8 lg:px-12 hidden'>
          <div class='md:hidden hidden mx-auto w-full h-[1px] bg-gradient-to-r from-gray-950 via-gray-600 to-gray-950'></div>
          <div className='flex md:hidden z-10 backdrop-blur-xl bg-black/50 border-b border-purple-900/50'>
            <div className='container mx-auto px-4'>
              <div className='grid grid-cols-3 gap-2 py-4 justify-center text-center'>
                <div className='flex items-center justify-center space-x-2'>
                  <Users className='w-6 h-6 text-yellow-500' />
                  <div>
                    <p className='text-sm font-bold' style={poppinsStyle}>
                      {show.remainingSpots}
                    </p>
                    <p className='text-xs text-gray-400' style={poppinsStyle}>
                      Spots Left
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-center space-x-2'>
                  <IndianRupee className='w-6 h-6 text-yellow-500' />
                  <div>
                    <p className='text-sm font-bold' style={poppinsStyle}>
                      ₹{show.registrationFee}
                    </p>
                    <p className='text-xs text-gray-400' style={poppinsStyle}>
                      Entry Fee
                    </p>
                  </div>
                </div>
                <div className='flex items-center justify-center space-x-2'>
                  <TimerIcon className='w-6 h-6 text-yellow-500' />
                  <div>
                    <p className='text-sm font-bold' style={poppinsStyle}>
                      01 PM
                    </p>
                    <p className='text-xs text-gray-400' style={poppinsStyle}>
                      Timing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='relative hidden'>
            <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-25'></div>
            <div className='relative p-8 bg-gray-900 md:rounded-xl md:border md:border-indigo-500/50'>
              <h2 className='text-2xl uppercase text-center md:text-left font-semibold text-transparent bg-clip-text bg-gradient-to-t from-yellow-700 via-yellow-500 to-yellow-900 mb-6'>
                Perks of joining this show
              </h2>
              <div className='grid grid-cols-2 lg:grid-cols-4'>
                {show.topPerformerBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`relative flex flex-col items-center text-center p-4 
                    ${
                      index === 0
                        ? 'before:absolute before:right-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-gray-900 before:via-white before:to-gray-900'
                        : ''
                    }
                    ${
                      index === 3
                        ? 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-gray-900 before:via-white before:to-gray-900'
                        : ''
                    }
                    ${
                      index === 0 || index === 1
                        ? 'after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-gray-900 after:via-white after:to-gray-900'
                        : ''
                    }
                   `}
                  >
                    {benefitIcons[index]}
                    <span
                      className='text-gray-200 text-sm mt-2'
                      style={poppinsStyle}
                    >
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MeetupPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        showId={showid}
        userId={currentUser?.uid}
        user={user}
      />
    </div>
  )
}

export default ShowDetails
