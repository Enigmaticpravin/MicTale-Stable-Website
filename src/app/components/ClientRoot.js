'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar, { UserProvider, ShowsProvider } from '@/app/components/Navbar'

export default function ClientRoot({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const noNavbarRoutes = ['/login']
  const showNavbar = !noNavbarRoutes.includes(pathname)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data.user)

          if (pathname === '/login') {
            router.push('/')
          }
        } else {
          setUser(null)
          if (pathname !== '/login') {
router.push('/login')
          }
        }
      } catch (err) {
        console.error('Error checking auth:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <UserProvider value={user}>
      <ShowsProvider>
        {showNavbar && <Navbar />}
        {children}
      </ShowsProvider>
    </UserProvider>
  )
}
