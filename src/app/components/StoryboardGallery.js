'use client'
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
<div className="bg-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg">
  
  <div className="relative w-full h-48 md:h-52">
    <Image 
      src={image.src} 
      alt={image.title} 
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover object-center opacity-100 hover:opacity-80 transition-opacity"
    />
  </div>

  <div className="p-4 text-white justify-center items-center flex flex-col">
    <h3 className="text-sm">{image.title}</h3>
  </div>

</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryboardGallery;
