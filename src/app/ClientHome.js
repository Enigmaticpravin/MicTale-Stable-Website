'use client'

import BookPoster from '@/app/images/bookcover.webp'
import StoryboardGallery from './components/StoryboardGallery'
import SoloShow from './components/SoloShow'
import originallogo from '@/../public/images/MicTale Originals.png'
import TopPerformers from './components/TopPerformers'
import Image from 'next/image'
import LogoMarquee from './components/LogoMarquee'
import { motion } from 'framer-motion'
import { Youtube } from 'lucide-react'
import YouTubeChannelComponent from './components/YouTubeChannelComponent'
import ContactForm from './components/Contact'
import Footer from './components/Footer'
import { useRouter } from 'next/navigation'

export default function Home () {

  const router = useRouter()

  const handleClick = event => {
    const { clientX, clientY, target } = event
    const imageWidth = target.clientWidth || 0
    const imageHeight = target.clientHeight || 0
    const isMobile = window.innerWidth < 768

    let choice

    if (isMobile) {
      choice =
        clientY < imageHeight / 2
          ? {
              slug: 'kaalikh-author-signed-paperback-by-pravin-gupta',
              title: 'Kaalikh (Author-signed, Paperback)'
            }
          : {
              slug: 'he-is-a-hero-he-raped-by-anubhav-singh',
              title: 'He is a Hero. He Raped!'
            }
    } else {
      choice =
        clientX < imageWidth / 2
          ? {
              slug: 'he-is-a-hero-he-raped-by-anubhav-singh',
              title: 'He is a Hero. He Raped!'
            }
          : {
              slug: 'kaalikh-author-signed-paperback-by-pravin-gupta',
              title: 'Kaalikh (Author-signed, Paperback)'
            }
    }

    router.push(`/book/${encodeURIComponent(choice.slug)}`)
  }

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }
  return (
    <div className='relative min-h-screen bg-slate-950 text-white overflow-hidden'>

      <div className={`relative mx-auto md:px-6 transition-all duration-1000`}>
        <div className='w-full flex-shrink-0 ' onClick={handleClick}>
          <Image
            src={BookPoster}
            alt='Book Cover'
            className='w-full h-auto cursor-pointer rounded-2xl md:flex hidden'
            priority={true}
          />
          <Image
            src='/images/mobilebanner.webp'
            alt='Book Cover'
            className='w-full h-auto cursor-pointer rounded-b-2xl md:hidden flex'
            height={600}
            width={300}
            priority={true}
          />
        </div>
      </div>
      <div className='bg-gradient-to-b from-transparent to-slate-900 h-10'></div>
      <section id='solo-show' className='md:pb-0 bg-slate-900'>
        <div className='justify-center items-center flex flex-col mb-3 md:mb-10'>
          <p
            className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
            style={poppinsStyle}
          >
            we did our first
          </p>
          <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
            Solo Poetry Show{' '}
          </p>
        </div>
        <SoloShow />
      </section>
      <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      <div
        className='flex flex-col mx-2 rounded-2xl md:flex-row items-center justify-between py-5 px-5 bg-cover bg-center bg-no-repeat gap-4'
        style={{ backgroundImage: "url('/images/bg.webp')" }}
      >
        <div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left'>
          <Image
            src={originallogo}
            alt='MicTale Logo'
            className='w-24 h-auto sm:w-28 invert-0'
          />
          <p
            className='text-black text-[10px] md:text-[16px]'
            style={poppinsStyle}
          >
            is now running live on YouTube.
          </p>
        </div>
        <a
          href='https://www.youtube.com/@mictaleoriginals'
          target='_blank'
          rel='noopener noreferrer'
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className='relative cursor-pointer md:px-6 md:py-3 px-3 py-[2px] flex items-center gap-2 text-white text-base font-medium rounded-full bg-neutral-900 border border-white/20 backdrop-blur-sm overflow-hidden group transition-all duration-300'
          >
            <Youtube
              size={24}
              color='white'
              className='md:w-7 md:h-7 w-3 h-3'
            />
            <span className='relative z-10 text-[10px] md:text-[16px]'>
              Subscribe Now
            </span>

            <motion.div
              className='absolute inset-0 rounded-full opacity-20 group-hover:opacity-30 transition duration-500'
              animate={{
                scale: [1, 1.03, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)'
              }}
            />
          </motion.button>
        </a>
      </div>
      <TopPerformers />
      <div className='bg-gradient-to-b to-slate-900 from-transparent h-10'></div>
      <StoryboardGallery />

      <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      <div className='justify-center items-center flex flex-col mb-2 mt-5'>
        <p
          className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
          style={poppinsStyle}
        >
          our upcoming
        </p>
        <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
          Ventures
        </p>
      </div>
      <LogoMarquee />
      <div className='bg-gradient-to-b to-slate-900 from-transparent h-10'></div>
      <YouTubeChannelComponent />

      <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      <ContactForm />
      <Footer />
    </div>
  )
}
