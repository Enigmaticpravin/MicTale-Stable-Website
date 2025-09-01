'use client'

import React from 'react';
import original from '@/app/images/original.png';
import space from '@/app/images/space.png';
import studio from '@/app/images/studio.png';
import Image from 'next/image';

const LogoMarquee = () => {
  const logos = [
    { image: original, color: 'text-black' },
    { image: space, color: 'text-orange-500' },
    { image: studio, color: 'text-purple-600' }
  ];

  return (
    <div className="relative w-full overflow-hidden">
   
    <div className="inline-flex items-center w-full animate-infinite-scroll p-4 z-10">
      {[...Array(10)].map((_, groupIndex) => (
        logos.map(({ image, color }, index) => (
          <div 
            key={`${groupIndex}-${index}`} 
            className="flex-shrink-0 mx-8 mb-5"
          >
            <Image
              src={image} 
              alt={`Logo ${index}`} 
              priority
              className={`w-32 h-fit ${color}`}
            />
          </div>
        ))
      ))}
    </div>
  </div>
  
  );
};

export default LogoMarquee;
