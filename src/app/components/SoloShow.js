import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import show from '../../../public/images/first.webp'
import InfiniteMarquee from './InfiniteMarquee'

const SoloShow = () => {
  const images = [
    '/images/five.webp',
    '/images/eight.webp',
    '/images/eleven.webp',
    '/images/ten.webp',
    '/images/nine.webp',
    '/images/seven.webp',
    '/images/three.webp',
    '/images/two.webp',
    '/images/six.webp',
    '/images/four.webp'
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
      className="block items-center justify-center overflow-hidden md:bg-slate-900"
    >
      <div className="md:flex md:flex-row md:justify-center md:items-center">
        <div
          ref={imageWrapperRef}
          className="w-full md:w-[60%] px-2 py-2 md:px-0 bg-slate-900 md:mx-auto md:m-5 md:mb-5"
        >
          <Image
            src={show}
            alt="show"
            className="rounded-2xl w-full h-auto relative z-10 shadow-[0_0_12px_2px_rgba(255,255,255,0.2)]"
            width={800}
            height={600}
            priority
          />
        </div>

        {imageHeight > 0 && (
          <div
            className="md:relative w-full md:w-[30%] overflow-hidden mx-auto md:flex md:flex-col mt-0 hidden"
            style={{ height: `${imageHeight}px` }}
          >
            <div className="pointer-events-none absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-900 to-transparent z-20" />
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-900 to-transparent z-20" />

            <div
              key={imageHeight}
              className="flex flex-col min-h-[200%]"
              style={{
                animation: 'verticalScrollGPU 30s linear infinite',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform'
              }}
            >
              {duplicatedImages.map((image, index) => (
                <div key={`img-${index}`} className="p-1 flex-shrink-0">
                  <img
                    src={image}
                    alt={`Gallery image ${(index % images.length) + 1}`}
                    className="w-full h-auto object-cover rounded-lg"
                  />
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
        @keyframes verticalScrollGPU {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(0, -50%, 0);
          }
        }
      `}</style>
    </div>
  )
}

export default SoloShow
