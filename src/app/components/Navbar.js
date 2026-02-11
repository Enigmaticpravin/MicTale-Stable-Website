'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import Image from 'next/image'
import {
  HelpCircle,
  Phone,
  Instagram,
  Menu,
  Mail,
  MapPin,
  X as CrossIcon
} from 'lucide-react'
import logo from '@/../public/images/logo.png'
import mobilelogo from '@/app/images/mic transparent.png'
import Link from 'next/link'
import WhatsNew from '@/app/components/WhatsNew'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'

export const UserContext = createContext(null)
export const ShowsContext = createContext([])

export function UserProvider ({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const pathname = usePathname()
  useEffect(() => {
    let mounted = true

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include'
        })

        if (!mounted) return

        if (response.ok) {
          const userData = await response.json()

          if (userData.user) {
            setUser(userData.user)
          } else {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
          setAuthChecked(true)
        }
      }
    }

    fetchUserData()

    return () => {
      mounted = false
    }
  }, [pathname])

  return (
    <UserContext.Provider value={{ user, setUser, loading, authChecked }}>
      {children}
    </UserContext.Provider>
  )
}

export function ShowsProvider ({ children }) {
  const [upcomingShows, setUpcomingShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchUpcomingShows = async () => {
      try {
        const response = await fetch('/api/shows/upcoming')
        if (!mounted) return

        if (response.ok) {
          const data = await response.json()
          setUpcomingShows(data.shows || [])
        }
      } catch (err) {
        console.error('ShowsProvider fetch error', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUpcomingShows()

    return () => {
      mounted = false
    }
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

  const router = useRouter()
  const { user, setUser } = useUser() || { user: null, setUser: () => {} }
  const { upcomingShows } = useShows() || { upcomingShows: [] }
  const pathname = usePathname()
  const isActive = path => pathname === path

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = event => {
      try {
        const target = event?.target
        if (menuRef.current && !menuRef.current.contains(target)) {
          setProfileMenuOpen(false)
        }
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
          if (mobileMenuOpen) setMobileMenuOpen(false)
        }
      } catch (e) {}
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [mobileMenuOpen])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = () => {
    setShowLogoutConfirmation(true)
    setProfileMenuOpen(false)
    setMobileMenuOpen(false)
  }

  const confirmLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        setShowLogoutConfirmation(false)
        router.push('/')
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleProfileMenu = () => setProfileMenuOpen(prev => !prev)
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)
  const pushToProfile = () => router.push('/profile')
  const handleLogin = () => {
  router.push('/login')
  }

  return (
    <>
      <WhatsNew />
      <nav
        className={`text-white bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950'
            : 'm-0'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-4 py-2 flex justify-between items-center'>
          <div
            className='relative cursor-pointer'
            onClick={() => (router.push('/'))}
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

          <Link
            href='/treasury'
            className={`md:hidden flex relative text-[13px] rounded-full px-3 py-1 transition-colors duration-200 ${
              isActive('/treasury') ? 'text-black' : 'hover:text-white'
            }`}
          >
            {!isActive('/treasury') && (
              <span
                className='absolute inset-0 rounded-full'
                style={{
                  background:
                    'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                  backgroundSize: '300% 300%',
                  animation: 'goldFlow 4s linear infinite',
                  padding: '2px'
                }}
              >
                <span className='absolute inset-[2px] rounded-full bg-black'></span>
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
            {isActive('/treasury') && (
              <span
                className='absolute inset-0 rounded-full p-[2px]'
                style={{
                  background:
                    'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                  backgroundSize: '300% 300%',
                  animation: 'goldFlow 4s linear infinite'
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
            <span
              className='relative z-10 rounded-full'
              style={
                !isActive('/treasury')
                  ? {
                      background:
                        'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                      backgroundSize: '300% 300%',
                      animation: 'goldTextFlow 4s linear infinite',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }
                  : {}
              }
            >
              Treasury
              {!isActive('/treasury') && (
                <style jsx>{`
                  @keyframes goldTextFlow {
                    0% {
                      background-position: 0% 50%;
                    }
                    100% {
                      background-position: 100% 50%;
                    }
                  }
                `}</style>
              )}
            </span>
          </Link>

          <div className='hidden md:flex bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 items-center space-x-4 border border-gray-800 rounded-full px-3 py-2'>
            <Link
              href='/'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 ${
                isActive('/') ? 'text-black' : 'text-white hover:text-white'
              }`}
            >
              {isActive('/') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite'
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
              <span className='relative z-10 rounded-full'>Home</span>
            </Link>

            <Link
              href='/treasury'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 ${
                isActive('/treasury') ? 'text-black' : 'hover:text-white'
              }`}
            >
              {!isActive('/treasury') && (
                <span
                  className='absolute inset-0 rounded-full'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite',
                    padding: '2px'
                  }}
                >
                  <span className='absolute inset-[2px] rounded-full bg-black'></span>
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
              {isActive('/treasury') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite'
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
              <span
                className='relative z-10 rounded-full'
                style={
                  !isActive('/treasury')
                    ? {
                        background:
                          'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                        backgroundSize: '300% 300%',
                        animation: 'goldTextFlow 4s linear infinite',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }
                    : {}
                }
              >
                Treasury
                {!isActive('/treasury') && (
                  <style jsx>{`
                    @keyframes goldTextFlow {
                      0% {
                        background-position: 0% 50%;
                      }
                      100% {
                        background-position: 100% 50%;
                      }
                    }
                  `}</style>
                )}
              </span>
            </Link>

            <Link
              href='/about'
              className={`relative inline-block rounded-full px-3 py-1 transition-colors duration-200 ${
                isActive('/about')
                  ? 'text-black'
                  : 'text-white hover:text-white'
              }`}
            >
              {isActive('/about') && (
                <span
                  className='absolute inset-0 rounded-full p-[2px]'
                  style={{
                    background:
                      'linear-gradient(90deg, #D4AF37, #FFD700, #FFC300, #B8860B, #FFD700, #D4AF37)',
                    backgroundSize: '300% 300%',
                    animation: 'goldFlow 4s linear infinite'
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
              <span className='relative z-10 rounded-full'>About Us</span>
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
                      src={user.profilePicture || '/default-avatar.png'}
                      alt='Profile'
                      width={40}
                      height={40}
                      className='object-cover w-full h-full'
                    />
                  </div>

                </div>
              ) : (
                <div className='hidden md:flex items-center md:space-x-2 cursor-pointer w-fit hover:text-white'>
                  <Link href='/login' passHref>
                    <button className='flex cursor-pointer items-center px-4 py-2 md:py-2 md:px-4 text-white rounded-full text-sm md:text-base bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300'>
                      Sign Up
                    </button>
                  </Link>

                  
                </div>
              )}

              <AnimatePresence>
                {user && profileMenuOpen && (
                  <motion.div
                    className='absolute right-0 mt-2 w-64 bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50'
                    style={{ transformOrigin: 'top right' }}
                    initial={{ opacity: 0, y: -6, scale: 0.995 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 180,
                        damping: 20
                      }
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      scale: 0.995,
                      transition: { duration: 0.12 }
                    }}
                  >
                    <div className='p-4 border-b border-gray-700'>
                      <div className='flex items-center space-x-3'>
                        <div className='flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-gray-600'>
                          <Image
                            src={user.profilePicture || '/default-avatar.png'}
                            alt='Profile'
                            width={48}
                            height={48}
                            className='object-cover w-full h-full'
                          />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-white font-medium'>
                            {user.name || user.displayName || 'User'}
                          </p>
                          <p className='text-gray-400 text-sm truncate'>
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>

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
                          initial={{ opacity: 0, y: 6 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 220,
                              damping: 24,
                              delay: 0.03 + i * 0.02
                            }
                          }}
                          exit={{
                            opacity: 0,
                            y: 4,
                            transition: { duration: 0.1 }
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
                          initial={{ opacity: 0, y: 6 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: {
                              type: 'spring',
                              stiffness: 220,
                              damping: 24,
                              delay: 0.12
                            }
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
            <div className='md:hidden'>
              <button
                onClick={toggleMobileMenu}
                className='w-8 h-8 flex justify-center items-center text-white'
                aria-label='Toggle mobile menu'
              >
                {mobileMenuOpen ? <CrossIcon size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {!isScrolled && (
          <div className='absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-gray-950 via-gray-600 to-gray-950' />
        )}
      </nav>

<div
  ref={mobileMenuRef}
  className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ease-in-out ${
    mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
>
  {/* DEEP SAPPHIRE OVERLAY */}
  <div
    className={`fixed inset-0 bg-[#02040a]/90 backdrop-blur-md transition-opacity duration-500 ${
      mobileMenuOpen ? 'opacity-100' : 'opacity-0'
    }`}
    onClick={closeMobileMenu}
  />

  {/* COMPACT REALISTIC SILVER PANEL */}
  <div
    className={`fixed top-4 left-4 right-4 max-h-[85vh] overflow-hidden 
    bg-[linear-gradient(145deg,#f8fafc_0%,#cbd5e1_30%,#e2e8f0_50%,#94a3b8_80%,#f1f5f9_100%)] 
    border border-white/60 shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-2xl
    transition-all duration-500 ease-out ${
      mobileMenuOpen ? 'translate-y-0 scale-100' : '-translate-y-4 scale-98'
    }`}
  >
    {/* METALLIC BRUSHED OVERLAY */}
    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

    {/* TOP SHINE FILAMENT */}
    <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white/40 overflow-hidden">
       <motion.div 
         animate={{ x: ['-100%', '100%'] }}
         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
         className="w-1/2 h-full bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_#fff]"
       />
    </div>

    <div className='relative z-10 px-6'>
      <div className='flex items-center justify-between py-5 border-b border-black/10'>
        <Image src={logo} alt='Logo' className='h-5 w-auto grayscale brightness-10' priority />
        <button
          onClick={closeMobileMenu}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e293b]/10 border border-[#1e293b]/20 text-[#1e293b]'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      </div>

      <nav className='flex flex-row w-full gap-2 py-4'>
        {[
          { name: 'Home', path: '/' },
          { name: 'Treasury', path: '/treasury' },
          { name: 'About', path: '/about' }
        ].map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={closeMobileMenu}
            className={`flex-1 text-center py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
              isActive(link.path)
                ? 'text-white bg-[#0f172a] shadow-[0_10px_20px_rgba(15,23,42,0.3)]'
                : 'text-[#334155] hover:text-[#0f172a] hover:bg-black/5'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className='py-4 border-t border-black/10'>
        {user ? (
          <div className='flex items-center justify-between bg-white/40 p-3 rounded-2xl border border-white/60 backdrop-blur-sm'>
            <div className='flex items-center space-x-3'>
              <div className="p-0.5 rounded-full bg-gradient-to-b from-white to-slate-400">
                <Image src={user?.profilePicture || '/default-avatar.png'} alt='User' width={34} height={34} className='rounded-full' />
              </div>
              <div>
                <p className='text-[#0f172a] text-[11px] font-black tracking-tight'>{user?.name || 'Creator'}</p>
                <p className='text-[#475569] text-[9px] font-medium truncate max-w-[100px]'>{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
               <button onClick={pushToProfile} className="px-4 py-2 rounded-xl bg-[#0f172a] text-white text-[9px] font-bold uppercase tracking-widest shadow-lg active:scale-95 transition-all">Profile</button>
               <button onClick={handleLogout} className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-[9px] font-bold uppercase hover:bg-red-100 transition-all">Logout</button>
            </div>
          </div>
        ) : (
          <button onClick={handleLogin} className="w-full py-4 rounded-2xl bg-[#0f172a] text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_15px_30px_rgba(15,23,42,0.4)] active:scale-95 transition-all">
            Sign In
          </button>
        )}
      </div>
      <div className='flex items-center justify-between py-5 border-t border-black/10'>
        <div className='flex items-center space-x-6'>
           <a href="https://www.instagram.com/mictale.in" className="text-[#64748b] hover:text-[#0f172a] transition-colors"><Instagram size={16} /></a>
           <a href="mailto:contact@mictale.in" className="text-[#64748b] hover:text-[#0f172a] transition-colors"><Mail size={16} /></a>
        </div>
        <div className='flex items-center space-x-2 text-black text-[9px] uppercase tracking-[0.3em] font-black'>
          <MapPin size={12} className="text-black" />
          <span>Sector 64, Noida</span>
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
                  transition: { type: 'spring', stiffness: 200, damping: 20 }
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
                          Are you sure you want to sign out? You will need to
                          sign in again to access your account.
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
