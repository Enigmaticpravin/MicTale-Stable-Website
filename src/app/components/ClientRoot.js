'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/app/components/Navbar'

export default function ClientRoot({ children }) {
  const pathname = usePathname()

  const noNavbarRoutes = ['/login']
  const showNavbar = !noNavbarRoutes.includes(pathname)

  return (
    <>
{showNavbar && <Navbar />}
        {children}
    
    </>
  )
}
