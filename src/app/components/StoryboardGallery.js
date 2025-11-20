import Image from 'next/image'

const StoryboardGallery = () => {
  const images = [
    {
      id: 1,
      src: '/images/poetry.webp',
      title: 'Poetry',
      description: 'A tranquil moment of reflection'
    },
    {
      id: 2,
      src: '/images/storytelling.webp',
      title: 'Storytelling',
      description: 'Capturing the essence of movement'
    },
    {
      id: 3,
      src: '/images/standup.webp',
      title: 'Stand-up Comedy',
      description: 'The interplay of light and shadow'
    },
    {
      id: 4,
      src: '/images/experience.webp',
      title: 'Experience',
      description: 'The interplay of light and shadow'
    },
    {
      id: 5,
      src: '/images/music.webp',
      title: 'Music',
      description: 'The interplay of light and shadow'
    },
    {
      id: 6,
      src: '/images/ventri.webp',
      title: 'Ventriloquist',
      description: 'The interplay of light and shadow'
    },
    {
      id: 7,
      src: '/images/video.webp',
      title: 'Video Recording',
      description: 'Exploring subtle emotions'
    },
    {
      id: 8,
      src: '/images/two.webp',
      title: 'Family',
      description: 'The interplay of light and shadow'
    }
  ]

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <div className='bg-slate-900 p-8 flex flex-col items-center justify-center'>
      <div className='w-full max-w-6xl'>
        <div className='justify-center items-center flex flex-col mb-10'>
          <p
            className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
            style={poppinsStyle}
          >
            get a glimpse from
          </p>
          <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'>
            Our Latest Open Mic Show
          </p>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          {images.map(image => (
            <div
              key={image.id}
              className='cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl'
            >
              <div className='bg-gray-800/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg'>
               <div className="relative w-full">
  <Image
    src={image.src}
    alt={image.title}
    width={300}     // exact display size
    height={200}    // same aspect ratio as original
    className="object-cover object-center rounded-b-2xl opacity-100 hover:opacity-80 transition-opacity"
    sizes="(max-width:768px) 50vw, (max-width:1200px) 25vw, 200px"
  />
</div>


                <div className='p-4 text-white justify-center items-center flex flex-col'>
                  <h3 className='text-sm'>{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StoryboardGallery
