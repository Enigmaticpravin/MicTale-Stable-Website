'use client'

import { useState } from 'react';

export default function InfiniteMarquee() {
  const images = [
    "/images/five.png",
    "/images/eight.png",
    "/images/eleven.png",
    "/images/ten.png",
    "/images/nine.png",
    "/images/seven.png",
    "/images/three.png",
    "/images/two.png",
    "/images/six.png",
    "/images/four.png",
  ];

  const duplicatedImages = [...images, ...images];

  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="w-full overflow-hidden">
      <div className="mx-auto">
 <div className='w-full h-[2px] bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-3 mt-3'></div>
        <div className="relative overflow-hidden">

          <div className="relative overflow-hidden w-full">

            <div 
              className="flex whitespace-nowrap"
              style={{
                width: "fit-content",
                animation: "marquee 47s linear infinite"
              }}
             >
              {/* First copy of images */}
              {duplicatedImages.map((image, index) => (
                <div key={`img-${index}`} className="inline-block px-2 pb-2 md:pb-0">
                  <div className="w-60 md:w-80 h-fit rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl">
                    <img 
                      src={image} 
                      alt={`Gallery image ${(index % images.length) + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-lg font-semibold">Photo {(index % images.length) + 1}</h3>
                        <p className="text-sm text-gray-300">Beautiful scenery</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}