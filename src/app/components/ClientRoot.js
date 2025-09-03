'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

import Navbar, { UserProvider, ShowsProvider } from '@/app/components/Navbar'
import { auth } from '@/app/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function ClientRoot({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)

  const noNavbarRoutes = ['/login']
  const showNavbar = !noNavbarRoutes.includes(pathname)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        if (pathname === '/login') {
          router.push('/')
        }
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()

  }, [pathname])

  return (
    <UserProvider>
      <ShowsProvider>
        {showNavbar && <Navbar />}

            {children}

      </ShowsProvider>
    </UserProvider>
  )
}
