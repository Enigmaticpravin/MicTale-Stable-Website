'use client'

import BookPoster from '@/app/images/bookcover.webp'
import dynamic from 'next/dynamic'
const SoloShow = dynamic(() => import('./components/SoloShow'), { ssr: false })
const StoryboardGallery = dynamic(() => import('./components/StoryboardGallery'), { ssr: false })
import originallogo from '@/../public/images/MicTale Originals.png'
const TopPerformers = dynamic(() => import('./components/TopPerformers'), {ssr: false})
import Image from 'next/image'
const LogoMarquee = dynamic(() => import('./components/LogoMarquee'), {ssr: false})
import { Youtube } from 'lucide-react'
const YouTubeChannelComponent = dynamic(() => import('./components/YouTubeChannelComponent'), {ssr: false})
const ContactForm = dynamic(() => import('./components/Contact'), {ssr: false})
const Footer = dynamic(() => import('./components/Footer'), {ssr: false})
export default function Home () {

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }
  return (
    <div className='relative min-h-screen bg-slate-950 text-white overflow-hidden'>
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
          <button
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
          </button>
        </a>
      </div>
      <TopPerformers />
      <div className='bg-gradient-to-b to-slate-900 from-transparent h-10'></div>
      <StoryboardGallery />

      <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>


      <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      <ContactForm />
      <Footer />
    </div>
  )
}
