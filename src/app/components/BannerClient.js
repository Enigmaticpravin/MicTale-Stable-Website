'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

export default function BannerClient({ bookPoster }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const banners = [
    {
      id: 'promotional',
      desktop: "/images/desktophome.png", 
      mobile: "/images/mobilehome.png",
      path: "/show/open-mic-show-mictale-noida", 
      dWidth: 1200, dHeight: 630,
      mWidth: 475, mHeight: 704
    },
    {
      id: 'books',
      desktop: bookPoster,
      mobile: "/images/mobilebanner.webp",
      path: null,
      dWidth: 1200, dHeight: 630,
      mWidth: 475, mHeight: 704
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(timer)
  }, [banners.length])

  function handleClick(e) {
    const activeBanner = banners[currentIndex]
    
    if (activeBanner.id === 'books') {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const w = rect.width
      const h = rect.height
      const mobile = window.innerWidth < 768

      let slug
      if (mobile) {
        slug = y < h / 2 
          ? 'kaalikh-author-signed-paperback-by-pravin-gupta' 
          : 'he-is-a-hero-he-raped-by-anubhav-singh'
      } else {
        slug = x < w / 2 
          ? 'he-is-a-hero-he-raped-by-anubhav-singh' 
          : 'kaalikh-author-signed-paperback-by-pravin-gupta'
      }
      router.push(`/book/${slug}`)
    } else if (activeBanner.path) {
      router.push(activeBanner.path)
    }
  }

  return (
    <div className="relative mx-auto md:px-6 w-full">
      <div className="grid grid-cols-1 grid-rows-1 cursor-pointer" onClick={handleClick}>
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`col-start-1 row-start-1 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <div className="hidden md:block">
              <Image
                src={banner.desktop}
                alt="Banner Desktop"
                width={banner.dWidth}
                height={banner.dHeight}
                className="w-full h-auto rounded-2xl"
                priority={index === 0}
              />
            </div>
            
            <div className="block md:hidden">
              <Image
                src={banner.mobile}
                alt="Banner Mobile"
                width={banner.mWidth}
                height={banner.mHeight}
                className="w-full h-auto rounded-2xl"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}