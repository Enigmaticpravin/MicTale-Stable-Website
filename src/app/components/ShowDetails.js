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
import { getDoc, doc, db } from '@/app/lib/firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import poster from '@/app/images/mobile.png'
import Image from 'next/image'
import BookingPopup from '@/app/components/BookingPopup'
import { useRouter } from 'next/navigation'
const ShowDetails = ({ showid }) => {
  const [showDetails, setShowDetails] = useState(null)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [user, setUser] = useState(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const router = useRouter()
  const auth = getAuth()

  const maxLength = 150
  const toggleTerms = () => {
    setIsTermsOpen(!isTermsOpen)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user)
      if (user) {
         const fetchUserData = async () => {
          try {
            const userRef = doc(db, 'users', user?.uid)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              const userData = userSnap.data()
              setUser(userData)
            }
          } catch (error) {
            setError('Failed to load user data')
            setUser(null)
          }
        }

        fetchUserData()
      }
    })

    return () => unsubscribe()
  }, [auth])

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
        localStorage.setItem('authRedirect', window.location.pathname)
        router.push('/login')
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
    location: 'Comedy County by Hitchin',
    address: showDetails?.location || 'Noida, India',
    availableSpots: showDetails?.seats || 30,
    remainingSpots: 30,
    registrationFee: 350,
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
  <Gift key="gift" className="text-yellow-400 w-8 h-8" />,
  <Star key="star" className="text-yellow-400 w-8 h-8" />,
  <Video key="video" className="text-yellow-400 w-8 h-8" />,
  <Megaphone key="megaphone" className="text-yellow-400 w-8 h-8" />
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
                  <span>Mixed Mic Event</span>
                </div>

                <div className='flex items-center gap-3'>
                  <Calendar className='w-6 h-6' />
                  <span>{show.date} | 03 PM</span>
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
                    <span className='text-2xl font-bold'>
                      ₹{show.registrationFee}
                    </span>
                    <span className='inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap'>
                      Early Bird Offer
                    </span>
                  </div>
                  <button
                    onClick={handleRegistrationClick}
                    className='relative cursor-pointer overflow-hidden m-auto w-full md:w-fit md:m-0 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:from-red-600 hover:to-orange-500 before:absolute before:inset-0 before:bg-white/20 before:scale-0 before:transition-transform before:duration-500 hover:before:scale-150 animate-glow'
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
                <p className='font-medium'>3 Hours</p>
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
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3641.90717426823!2d77.36440917549741!3d28.539918975715455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce7b0bd62a163%3A0x7820cfa6b803e44d!2sComedy%20County%20by%20HITCHIN!5e1!3m2!1sen!2sin!4v1753120750365!5m2!1sen!2sin'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen=''
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
              ></iframe>
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
                  <li>A valid Entry Pass is required for entry.</li>
                  <li>
                    Tickets are non-refundable, even in case of rescheduling.
                  </li>
                  <li>
                    Security checks, including frisking, are at the discretion
                    of management.
                  </li>
                  <li>
                    Prohibited items include weapons, fireworks, laser devices,
                    bottles, and helmets. Such items may be confiscated or lead
                    to ejection.
                  </li>
                  <li>
                    Outside food, beverages, and alcohol are strictly
                    prohibited.
                  </li>
                  <li>
                    Smoking, vaping, and drug use inside the venue are not
                    allowed.
                  </li>
                  <li>
                    Management is not responsible for lost, stolen, or damaged
                    belongings.
                  </li>
                  <li>
                    Any form of misconduct, harassment, or disruptive behavior
                    will result in immediate removal from the venue.
                  </li>
                  <li>
                    By attending, you consent to being photographed or recorded
                    for promotional purposes.
                  </li>
                  <li>
                    Event timings are subject to change without prior notice.
                  </li>
                  <li>Re-entry may not be allowed once you exit the venue.</li>
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
      <BookingPopup
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
