'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar, { UserProvider, ShowsProvider } from '@/app/components/Navbar'
import Snowfall from './Snowfall'

export default function ClientRoot({ children }) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState(undefined)

  const noNavbarRoutes = ['/login']
  const showNavbar = !noNavbarRoutes.includes(pathname)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)

          if (pathname === '/login') {
            router.replace('/')
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setUser(null)
      }
    }

    checkAuth()
  }, [pathname, router])

  return (
    <UserProvider value={user}>
      <ShowsProvider>
        <Snowfall />
        {showNavbar && <Navbar user={user} />}
        {children}
      </ShowsProvider>
    </UserProvider>
  )
}
