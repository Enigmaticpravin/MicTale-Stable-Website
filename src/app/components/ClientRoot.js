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
    return  <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative w-16 h-16 animate-spin">
          <div className="absolute border-t-4 border-blue-500 border-solid rounded-full inset-0"></div>
          <div className="absolute border-t-4 border-solid rounded-full inset-0 border-l-4 border-blue-500"></div>
        </div>
      </div>
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
