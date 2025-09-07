'use client'

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const StoryboardGallery = () => {
  const images = [
    { id: 1, src: 'https://i.imgur.com/gWxuWPp.jpeg', title: 'Poetry', description: 'A tranquil moment of reflection' },
    { id: 2, src: 'https://i.imgur.com/CJabWk8.jpeg', title: 'Storytelling', description: 'Capturing the essence of movement' },
    { id: 3, src: 'https://i.imgur.com/mb2gVrL.jpeg', title: 'Stand-up Comedy', description: 'The interplay of light and shadow' },
    { id: 4, src: 'https://i.imgur.com/rqi9lj9.jpeg', title: 'Experience', description: 'The interplay of light and shadow' },
    { id: 5, src: 'https://i.imgur.com/uKVPErc.jpeg', title: 'Music', description: 'The interplay of light and shadow' },
    { id: 6, src: 'https://i.imgur.com/YzXwnMO.jpeg', title: 'Ventriloquist', description: 'The interplay of light and shadow' },
    { id: 7, src: 'https://i.imgur.com/St4gae6.jpeg', title: 'Video Recording', description: 'Exploring subtle emotions' },
    { id: 8, src: 'https://i.imgur.com/5pR4f2Z.jpeg', title: 'Highlight', description: 'The interplay of light and shadow' }
  ];

  const [currentImage, setCurrentImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImage(images[index]);
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setCurrentImage(null);
  };

  const navigateImage = (direction) => {
    const newIndex = (selectedImageIndex + direction + images.length) % images.length;
    setCurrentImage(images[newIndex]);
    setSelectedImageIndex(newIndex);
  };

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  };

  return (
    <div className="bg-slate-900 p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className='justify-center items-center flex flex-col mb-10'>
          <p className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900' style={poppinsStyle}>get a glimpse from</p>
          <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>Our Latest Open Mic Show</p>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              onClick={() => openModal(index)}
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="bg-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg">
                <Image 
                  src={image.src} 
                  priority={false}
                  width={600}
                  height={600} 
                  alt={image.title} 
                  className="w-full h-48 md:h-52 object-cover object-center opacity-100 hover:opacity-80 transition-opacity"
                />
                <div className="p-4 text-white justify-center items-center flex flex-col">
                  <h3 className="text-sm">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {currentImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 h-full md:h-auto rounded-2xl max-w-5xl w-full flex flex-col md:flex-row shadow-2xl overflow-hidden">
              
              <button 
                onClick={closeModal} 
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              >
                <X size={32} />
              </button>
              
              <div className="w-full md:w-3/4 relative flex items-center justify-center">
                <Image 
                  src={currentImage.src} 
                  alt={currentImage.title} 
                  width={1200}
                  height={800}
                  className="w-full max-h-[80vh] object-contain md:rounded-l-2xl"
                />
                <button 
                  onClick={() => navigateImage(-1)} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2"
                >
                  <ChevronLeft className="text-white" />
                </button>
                <button 
                  onClick={() => navigateImage(1)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2"
                >
                  <ChevronRight className="text-white" />
                </button>
              </div>
              
              <div className="w-full md:w-1/4 p-6 text-white flex flex-col justify-center overflow-y-auto max-h-[80vh]">
                <h3 className="text-2xl font-light mb-4">{currentImage.title}</h3>
                <p className="text-gray-300 font-thin">{currentImage.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryboardGallery;
