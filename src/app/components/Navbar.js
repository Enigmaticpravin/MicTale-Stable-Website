'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
  db,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  auth,
  signOut
} from '@/app/lib/firebase'
import Image from 'next/image'
import {
  LogOut,
  HelpCircle,
  PenBox,
  Phone,
  MailIcon,
  Youtube,
  Instagram,
  Mail,
  MapPin,
  X
} from 'lucide-react'
import logo from '@/app/images/logo.png'
import mobilelogo from '@/app/images/mic transparent.png'
import Link from 'next/link'
import { doc, getDoc } from 'firebase/firestore'
import { createContext, useContext } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01FreeIcons, CancelCircleFreeIcons, Edit01FreeIcons, HelpCircleFreeIcons, Home01FreeIcons, InformationCircleFreeIcons, Menu01FreeIcons, Ticket01FreeIcons, UserAdd01FreeIcons } from '@hugeicons/core-free-icons/index'
import { usePathname } from 'next/navigation'

export const UserContext = createContext(null)
export const ShowsContext = createContext([])

export function UserProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async currentUser => {
      if (currentUser) {
        const basicUserInfo = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL
        }

        try {
          const cachedUserData = localStorage.getItem(
            `userData_${currentUser.uid}`
          )
          const cachedTimestamp = localStorage.getItem(
            `userDataTimestamp_${currentUser.uid}`
          )

          if (cachedUserData && cachedTimestamp) {
            const isRecent = Date.now() - parseInt(cachedTimestamp) < 21600000
            if (isRecent) {
              const cachedData = JSON.parse(cachedUserData)
              setUser(cachedData)
              setLoading(false)
              setAuthChecked(true)
              return
            }
          }

          setUser({
            ...basicUserInfo,
            profilePicture: currentUser.photoURL || '/default-avatar.png'
          })
          setLoading(false)
          setAuthChecked(true)

          const userRef = doc(db, 'users', currentUser.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const userData = { ...basicUserInfo, ...userSnap.data() }
            setUser(userData)

            localStorage.setItem(
              `userData_${currentUser.uid}`,
              JSON.stringify(userData)
            )
            localStorage.setItem(
              `userDataTimestamp_${currentUser.uid}`,
              Date.now().toString()
            )
          }
        } catch (error) {
          console.error('Failed to load user data:', error)

          setUser({
            ...basicUserInfo,
            profilePicture: currentUser.photoURL || '/default-avatar.png'
          })
        } finally {
          setLoading(false)
          setAuthChecked(true)
        }
      } else {
        setUser(null)
        setLoading(false)
        setAuthChecked(true)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading, authChecked }}>
      {children}
    </UserContext.Provider>
  )
}

const isScrolled = () => {
  return window.scrollY > 50
}

export function ShowsProvider ({ children }) {
  const [upcomingShows, setUpcomingShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingShows = async () => {
      try {
        const showsRef = collection(db, 'shows')
        const today = new Date().toISOString()
        const showsQuery = query(
          showsRef,
          where('date', '>', today),
          orderBy('date', 'asc')
        )
        const querySnapshot = await getDocs(showsQuery)

        const shows = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setUpcomingShows(shows)
      } catch (error) {
        console.error('Error fetching upcoming shows:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingShows()
  }, [])

  return (
    <ShowsContext.Provider value={{ upcomingShows, loading }}>
      {children}
    </ShowsContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
export const useShows = () => useContext(ShowsContext)

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)

  const { user } = useUser()
  const { upcomingShows } = useShows()
const pathname = usePathname()
const isActive = (path) => pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileMenuOpen(false)
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    setShowLogoutConfirmation(true)
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const confirmLogout = async () => {
    try {
      await signOut(auth)
      setShowLogoutConfirmation(false)

      Object.keys(localStorage).forEach(key => {
        if (
          key.startsWith('userData_') ||
          key.startsWith('userDataTimestamp_')
        ) {
          localStorage.removeItem(key)
        }
      })

      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <>
 <nav className={`text-white sticky top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 m-1 md:m-5 top-2 rounded-2xl' : 'bg-transparent'}`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center'>
          
          <div
            className='relative cursor-pointer'
            onClick={() => (window.location.href = '/')}
          >
            <Image
              src={logo}
              className='hidden md:relative md:flex h-7 w-fit text-[#6c5ce7]'
              priority={true}
              alt='Logo'
            />
            <Image
              src={mobilelogo}
              className='md:hidden h-14 w-fit'
              priority={true}
              alt='Mobile Logo'
            />
          </div>

          <div className='hidden md:flex bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 items-center space-x-4 border border-gray-800 rounded-full px-3 py-2'>
            <Link
              href='/'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 
      ${isActive('/') ? 'text-white' : 'text-[#9e9ea7] hover:text-white'}
    `}
            >
              {isActive('/') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                >
                  <style jsx>{`
                    @keyframes goldFlow {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 100% 50%;
                      }
                    }
                  `}</style>
                </span>
              )}
              <span className='relative z-10  rounded-full'>
                Home
              </span>
            </Link>
            <Link
              href='/treasury'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 
      ${
        isActive('/treasury') ? 'text-white' : 'text-[#9e9ea7] hover:text-white'
      }
    `}
            >
              {isActive('/treasury') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                >
                  <style jsx>{`
                    @keyframes goldFlow {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 100% 50%;
                      }
                    }
                  `}</style>
                </span>
              )}
              <span className='relative z-10  rounded-full'>
                Treasury
              </span>
            </Link>
            <Link
              href='/about'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 
      ${isActive('/about') ? 'text-white' : 'text-[#9e9ea7] hover:text-white'}
    `}
            >
              {isActive('/about') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite',
                    WebkitMask:
                      'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude'
                  }}
                >
                  <style jsx>{`
                    @keyframes goldFlow {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 100% 50%;
                      }
                    }
                  `}</style>
                </span>
              )}
              <span className='relative z-10 rounded-full'>
                About Us
              </span>
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            <div className='relative' ref={menuRef}>
              {user ? (
                <div className='flex items-center space-x-4'>
                  <div
                    onClick={toggleProfileMenu}
                    onMouseEnter={() =>
                      window.innerWidth >= 768 ? setProfileMenuOpen(true) : null
                    }
                    className='h-10 w-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-white transition-colors duration-200 cursor-pointer'
                  >
                    <Image
                      src={user.profilePicture}
                      alt='Profile'
                      width={40}
                      height={40}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  {upcomingShows.length > 0 && (
                    <Link
                      href={`/show/${encodeURIComponent(
                        upcomingShows[0]?.slug
                      )}`}
                      passHref
                    >
                      <button
                        className='hidden cursor-pointer md:block px-4 py-2 md:px-6 md:py-2 text-[#e5e5e5] border border-[#5e5e5e] rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-sm md:text-base shadow-md 
          hover:bg-[#ffffff1a] hover:shadow-[0_4px_15px_#ffffff26] transition-all duration-300 transform 
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffffff40]'
                      >
                        Book Ticket
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <>
                  <div className='hidden md:flex items-center md:space-x-2 border w-fit md:px-4 md:py-1 border-orange-500 rounded-full transition-all duration-300 transform hover:bg-orange-500 hover:text-white shadow-[0_0_15px_3px_rgba(255,115,0,0.3)]'>
                    <Link href='/login' passHref>
                      <button className='flex items-center px-4 py-2 md:py-0 md:px-0 text-[#e5e5e5] rounded-full text-sm md:text-base transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-[#ffffff40]'>
                        Sign Up
                      </button>
                    </Link>

                    {upcomingShows.length > 0 && (
                      <Link
                        href={`/show/${encodeURIComponent(
                          upcomingShows[0]?.slug
                        )}`}
                        passHref
                      >
                        <button
                          className='px-2 cursor-pointer mr-1 md:mr-0 py-1 md:px-3 md:py-1 text-[#e5e5e5] border border-[#5e5e5e] rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-sm md:text-base shadow-md 
          hover:bg-[#ffffff1a] hover:shadow-[0_4px_15px_#ffffff26] transition-all duration-300 transform 
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ffffff40]'
                        >
                          Book Ticket
                        </button>
                      </Link>
                    )}
                  </div>
                </>
              )}

              <AnimatePresence>
                {user && profileMenuOpen && (
                  <motion.div
                    className='absolute right-0 mt-2 w-64 bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 transition-all duration-300'
                    style={{ transformOrigin: 'top right' }}
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.98,
                      filter: 'blur(6px)'
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                      transition: {
                        type: 'spring',
                        stiffness: 260,
                        damping: 22,
                        when: 'beforeChildren',
                        staggerChildren: 0.05,
                        delayChildren: 0.03
                      }
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      scale: 0.98,
                      filter: 'blur(4px)',
                      transition: { duration: 0.15 }
                    }}
                  >
                    <motion.div
                      className='p-4 border-b border-gray-700'
                      variants={{ hidden: {}, visible: {} }}
                      initial='hidden'
                      animate='visible'
                    >
                      <motion.div
                        className='flex items-center space-x-3'
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 24
                        }}
                      >
                        <div className='flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-gray-600'>
                          <Image
                            src={user.profilePicture}
                            alt='Profile'
                            width={48}
                            height={48}
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-white font-medium'>{user.name}</p>
                          <p className='text-gray-400 text-sm truncate'>
                            {user.email}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>

                    <div className='py-2'>
                      {[
                        {
                          href: '/profile',
                          label: 'My Profile',
                          icon: (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-3'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                            </svg>
                          ),
                          external: false
                        },
                        {
                          href: 'profile/my-orders',
                          label: 'Order History',
                          icon: (
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-3'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
                              />
                            </svg>
                          ),
                          external: false
                        },
                        {
                          href: 'https://www.instagram.com/mictale.in',
                          label: 'Need Help?',
                          icon: <HelpCircle className='h-5 w-5 mr-3' />,
                          external: true
                        }
                      ].map((item, i) => (
                        <motion.a
                          key={item.href}
                          href={item.href}
                          target={item.external ? '_blank' : undefined}
                          className='block px-4 py-2 text-gray-200 hover:bg-gray-800 transition-colors duration-200'
                          initial={{ opacity: 0, y: 8 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 320,
                              damping: 26,
                              delay: 0.05 + i * 0.03
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 4,
                            transition: { duration: 0.12 }
                          }}
                        >
                          <span className='flex items-center'>
                            {item.icon}
                            {item.label}
                          </span>
                        </motion.a>
                      ))}

                      <div className='border-t border-gray-700 mt-2 pt-2'>
                        <motion.button
                          onClick={handleLogout}
                          className='w-full cursor-pointer text-left px-4 py-2 text-red-400 hover:bg-gray-800 transition-colors duration-200'
                          initial={{ opacity: 0, y: 8 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 320,
                              damping: 26,
                              delay: 0.15
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 4,
                            transition: { duration: 0.12 }
                          }}
                        >
                          <span className='flex items-center'>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-3'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                              />
                            </svg>
                            Logout
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          <div className="md:hidden">
      <button
        onClick={toggleMobileMenu}
        className="w-8 h-8 flex justify-center items-center text-white"
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? (
          <HugeiconsIcon icon={Cancel01FreeIcons} size={24} />
        ) : (
          <HugeiconsIcon icon={Menu01FreeIcons} size={24} />
        )}
      </button>
    </div>
          </div>
        </div>
        {!isScrolled && <div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-950 via-gray-600 to-gray-950'></div>}
      </nav>
       <div
      ref={mobileMenuRef}
      className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeMobileMenu}
      />

  <div className="fixed top-0 left-0 right-0 m-2 max-h-screen overflow-y-auto bg-gray-950 border border-gray-800 shadow-xl rounded-lg">
  <div className="mx-auto max-w-md px-5">
    {/* Header */}
    <div className="flex items-center justify-between py-4 border-b border-gray-800">
      <Image src={logo} alt="Logo" className="h-6 w-auto" priority />
      <button
        onClick={closeMobileMenu}
        className="p-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    {/* Nav links */}
   <nav className="flex flex-row w-full py-4">
  <Link
    href="/"
    onClick={closeMobileMenu}
    className={`flex-1 text-center rounded-md px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
      isActive('/')
        ? 'text-white bg-gray-800'
        : 'text-gray-400 hover:text-white hover:bg-gray-900'
    }`}
  >
    Home
  </Link>

  <Link
    href="/treasury"
    onClick={closeMobileMenu}
    className={`flex-1 text-center rounded-md px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
      isActive('/treasury')
        ? 'text-white bg-gray-800'
        : 'text-gray-400 hover:text-white hover:bg-gray-900'
    }`}
  >
    Treasury
  </Link>

  <Link
    href="/about"
    onClick={closeMobileMenu}
    className={`flex-1 text-center rounded-md px-4 py-3 text-sm font-medium tracking-wide transition-colors ${
      isActive('/about')
        ? 'text-white bg-gray-800'
        : 'text-gray-400 hover:text-white hover:bg-gray-900'
    }`}
  >
    About Us
  </Link>
</nav>

    {user && (
      <div className="py-6 border-t border-gray-800">
        <div className="flex items-center space-x-3">
          <Image
            src={user?.image || '/default-avatar.png'}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="text-white text-sm font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <button className="w-full rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition">
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    )}

    <div className="flex flex-col py-6 border-t mx-auto justify-center items-center border-gray-800">
      <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-3">
        Connect
      </h4>
      <div className="flex items-center space-x-4 mb-4">
        <a href="#" className="text-gray-400 hover:text-white transition">
          <Instagram size={18} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition">
          <Mail size={18} />
        </a>
        <a href="#" className="text-gray-400 hover:text-white transition">
          <Phone size={18} />
        </a>
      </div>
      <div className="flex items-center space-x-2 text-gray-400 text-xs">
        <MapPin size={14} />
        <span>Noida, India</span>
      </div>
    </div>
  </div>
</div>

    </div>
      <AnimatePresence>
        {showLogoutConfirmation && (
          <>
            <motion.button
              type='button'
              aria-label='Close dialog backdrop'
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-md'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirmation(false)}
            />

            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
  
              <motion.div
                role='dialog'
                aria-modal='true'
                className='inline-block w-full max-w-lg overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl'
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 260, damping: 22 }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  y: 8,
                  transition: { duration: 0.15 }
                }}
              >
                <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-red-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                        />
                      </svg>
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <h3 className='text-lg font-medium leading-6 text-white'>
                        Sign out
                      </h3>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-300'>
                          Are you sure you want to sign out? You will need to sign
                          in again to access your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                  <button
                    type='button'
                    className='inline-flex cursor-pointer w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-base font-medium text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={confirmLogout}
                  >
                    Sign out
                  </button>
                  <button
                    type='button'
                    className='mt-3 cursor-pointer inline-flex w-full justify-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-base font-medium text-gray-300 shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={() => setShowLogoutConfirmation(false)}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
