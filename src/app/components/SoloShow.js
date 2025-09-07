'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import show from '@/../public/images/first.png'
import InfiniteMarquee from '@/app/components/InfiniteMarquee'

const SoloShow = () => {
  const images = [
    '/images/five.png',
    '/images/eight.png',
    '/images/eleven.png',
    '/images/ten.png',
    '/images/nine.png',
    '/images/seven.png',
    '/images/three.png',
    '/images/two.png',
    '/images/six.png',
    '/images/four.png',
  ]

  const imageWrapperRef = useRef(null)
  const [imageHeight, setImageHeight] = useState(0)

  useEffect(() => {
    const updateHeight = () => {
      if (imageWrapperRef.current) {
        setImageHeight(imageWrapperRef.current.offsetHeight)
      }
    }
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const duplicatedImages = [...images, ...images]

  return (
    <div
      className="block items-center justify-center overflow-hidden"
    >
      <div className="md:flex md:flex-row md:justify-center md:items-start">
        <div
          className="w-full md:w-[60%] px-2 py-2 md:px-0 bg-slate-900 md:mx-auto md:m-5 md:mb-5"
        >
          <Image
            src={show}
            alt="show"
            className="rounded-2xl w-full h-auto relative z-10 shadow-[0_0_12px_2px_rgba(255,255,255,0.2)]"
            layout="responsive"
            width={800}
            height={600}
            priority
          />
        </div>

        {imageHeight > 0 && (
          <div
            className="md:relative w-full md:w-[30%] overflow-hidden mx-auto hidden md:block"
            style={{ height: `${imageHeight}px` }}
          >
            <div className="pointer-events-none absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-900 to-transparent z-20" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900 to-transparent z-20" />

            <div
              key={imageHeight}
              className="flex flex-col"
              style={{
                animation: 'verticalScroll 20s linear infinite',
              }}
            >
              {duplicatedImages.map((image, index) => (
                <div
                  key={`img-${index}`}
                  className="p-2 flex-shrink-0"
                >
                  <div className="w-full rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl relative h-full">
                    <Image
                      src={image}
                      alt={`Gallery image ${(index % images.length) + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden">
        <InfiniteMarquee />
      </div>

      <style jsx global>{`
        @keyframes verticalScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
      `}</style>
    </div>
  )
}

export default SoloShow
