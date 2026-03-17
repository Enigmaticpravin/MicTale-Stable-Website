'use client'

import poster from '@/../public/images/cover.png'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Footer from '@/app/components/Footer'
import ReactHead from 'next/head'
import mobile from '../../../public/images/mobilecover.png'

export default function MicTalePremium () {
  const [scrollY, setScrollY] = useState(0)
  const [hasAnimated, setHasAnimated] = useState({})
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRefs = useRef({})

  useEffect(() => {
    const handleMouseMove = e => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const { target, isIntersecting, intersectionRatio } = entry
          const id = target.id
          if (isIntersecting && intersectionRatio > 0.2 && !hasAnimated[id]) {
            setHasAnimated(prev => ({
              ...prev,
              [id]: true
            }))
          }
        })
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
        rootMargin: '-10% 0px -20% 0px'
      }
    )

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasAnimated])

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  const setRef = id => el => {
    sectionRefs.current[id] = el
  }

  const getAnimationStyle = (elementId, offset = 0, delay = '0s') => {
    const isAnimated = hasAnimated[elementId]

    if (isAnimated) {
      return {
        opacity: 1,
        transform: 'translateY(0px) scale(1)',
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}`
      }
    } else {
      return {
        opacity: 0,
        transform: `translateY(${50 + offset}px) scale(0.95)`,
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}`
      }
    }
  }

  return (
    <>
      <ReactHead>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='robots' content='index, follow' />

        <title>About Us – MicTale</title>
        <meta
          name='description'
          content='Learn about the vision, journey, and mission of MicTale – India’s leading open mic platform for poets, performers, and storytellers.'
        />
        <meta
          name='keywords'
          content='MicTale, Open Mic India, Poetry Platform, Spoken Word, Storytelling, Artist Growth, Mentorship, Creative Events, Performance Stage'
        />
        <meta name='author' content='MicTale' />

        <meta
          property='og:title'
          content='About MicTale – Open Mic Platform for Performers & Creatives'
        />
        <meta
          property='og:description'
          content="Learn how MicTale is redefining India's open mic scene by providing artists with growth, exposure, and a powerful stage to perform."
        />
        <meta property='og:image' content='https://i.imgur.com/WcNbK7B.png' />
        <meta property='og:image:alt' content='MicTale logo and stage' />
        <meta property='og:url' content='https://mictale.in/about' />
        <meta property='og:type' content='website' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content="About MicTale – India's Best Platform for Open Mic Artists"
        />
        <meta
          name='twitter:description'
          content='MicTale supports poets, storytellers, and performers with curated stages, mentorship, and a vibrant artist community.'
        />
        <meta name='twitter:image' content='https://i.imgur.com/WcNbK7B.png' />
        <meta name='twitter:image:alt' content='MicTale stage and mic icon' />

        <link rel='canonical' href='https://mictale.in/about' />

        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />
      </ReactHead>

      <div className='relative min-h-screen bg-slate-950 text-gray-300 overflow-hidden'>
        <div
          className='fixed pointer-events-none z-50 w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-300 ease-out'
          style={{
            background:
              'radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)',
            left: mousePos.x - 192,
            top: mousePos.y - 192
          }}
        />

        <section
          ref={setRef('hero')}
          id='hero'
          style={getAnimationStyle('hero')}
        >
          <a className='z-10 block md:px-6'>
            <Image
              src={poster}
              alt='MicTale Official Banner'
              className='cursor-pointer w-full rounded-2xl md:flex hidden'
            />
            <Image
              src={mobile}
              alt='MicTale Official Banner'
              className='cursor-pointer w-full rounded-2xl md:hidden flex'
            />
          </a>

          <div className='mx-auto w-full h-[1px] bg-gradient-to-r from-gray-950 via-gray-600 to-gray-950'></div>

          <div
            className='justify-center items-center flex flex-col mt-10 md:mt-24'
            style={getAnimationStyle('hero', -20, '0.2s')}
          >
            <p
              className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
              style={poppinsStyle}
            >
              we have a
            </p>
            <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold  text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'>
              Reason to Exist
            </p>
          </div>

          <h3
            className='md:px-24 mt-5 md:text-2xl px-4 text-justify montserrat-regular hover:text-gray-100 transition-colors duration-500'
            style={{
              ...getAnimationStyle('hero', -10, '0.4s')
            }}
          >
            <b>
              <i>
                <span>
                  MicTale
                </span>
              </i>
            </b>{' '}
            is a modern creative platform that goes beyond just providing a
            stage for artists. It offers opportunities for growth, learning, and
            refinement, helping performers enhance their craft and establish
            themselves in the real marketplace. With dedicated support and
            services, MicTale nurtures both the personal and professional
            journey of artists, ensuring they receive the guidance and exposure
            they deserve.
          </h3>
        </section>

       <section
          ref={setRef('features')}
          id='features'
          className='px-2 py-4 md:mt-10 grid grid-cols-3 md:grid-cols-3 gap-1 md:gap-8 max-w-6xl mx-auto'
          style={{
            ...getAnimationStyle('features'),
            perspective: '1000px'
          }}
        >
          {[
            {
              img: 'https://i.imgur.com/fKqcMyW.jpeg',
              title: 'Stage Presence',
              desc: 'Build confidence through regular performances',
              delay: '0s'
            },
            {
              img: 'https://i.imgur.com/OFfDOku.png',
              title: 'Artistic Growth',
              desc: 'Expert-led workshops and mentorship',
              delay: '0.2s'
            },
            {
              img: 'https://i.imgur.com/g3aPyeT.jpeg',
              title: 'Professional Path',
              desc: 'From open mic to solo shows',
              delay: '0.4s'
            }
          ].map((item, index) => (
            <div
              key={index}
              className='text-center group border border-gray-700 rounded-xl cursor-pointer bg-slate-900 hover:bg-slate-800 transition-colors duration-300'
              style={{
                ...getAnimationStyle('features', index * -5, item.delay),
                transform: index === 0 ? 'rotateY(15deg) scale(0.85) md:rotateY(0deg) md:scale(1)' : 
                           index === 2 ? 'rotateY(-15deg) scale(0.85) md:rotateY(0deg) md:scale(1)' : 
                           'rotateY(0deg) scale(1)',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.5s ease'
              }}
            >
              <div className='h-24 md:h-64 bg-gray-900 rounded-xl overflow-hidden relative'>
                <img
                  src={item.img}
                  alt={item.title}
                  className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
              </div>
              <h3 className='text-sm md:mt-4 md:text-lg libre-baskerville-regular-italic font-light mt-2 '>
                {item.title}
              </h3>
              <p className='text-[10px] mb-2 md:mb-4 md:text-sm text-gray-500 group-hover:text-gray-300 transition-colors duration-300'>
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        <div
          ref={setRef('visionary-header')}
          id='visionary-header'
          className='justify-center items-center flex flex-col my-5 md:my-10'
          style={getAnimationStyle('visionary-header')}
        >
          <p
            className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
            style={poppinsStyle}
          >
            the visionary
          </p>
          <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold  text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'>
            Behind MicTale
          </p>
        </div>

   <section className='pb-10 px-4 md:px-80'>
  <div className='max-w-7xl mx-auto'>
    <div 
      ref={setRef('founder-story')}
      id='founder-story'
      className='montserrat-regular md:text-lg text-white leading-relaxed text-justify'
      style={{
        ...getAnimationStyle('founder-story', -0),
        transform: `${
          getAnimationStyle('founder-story', -10).transform
        } rotateY(${hasAnimated['founder-story'] ? '0deg' : '15deg'})`
      }}
    >
      <div
        ref={setRef('founder-image')}
        id='founder-image'
        className='relative group float-left mr-2 md:mr-8 mb-4 w-fit'
        style={{
          ...getAnimationStyle('founder-image', 20),
          transform: `${
            getAnimationStyle('founder-image', 20).transform
          } rotateY(${
            hasAnimated['founder-image'] ? '0deg' : '-15deg'
          })`
        }}
      >
        <div className='relative'>
          <Image
            src='https://res.cloudinary.com/drwvlsjzn/image/upload/v1765480864/Pravin_Portrait_xxzysm.jpg'
            alt='Pravin Gupta'
            width={800}
            height={800}
            priority={true}
            className='w-40 md:w-80 h-auto rounded-xl object-cover'
          />
        </div>
      </div>

         {[

        'Pravin Gupta is an Indian author, Founder and CTO at MicTale. He has written bestselling titles like Kaalikh and Her Love Drowned The Poet, and newspapers like Hindustan Times and Dainik Jagran have also praised his work. He is a self-taught artist who believes in the power of creativity to change lives.',

        'Professionally, he works a graphic design job. Personally, he juggles writing, wildlife photography, music, and mild overthinking. He is also half-coder, half-therapist-for-his-own-ideas.',

        'MicTale was not a startup idea. It was a reaction. Tired of overpriced, underwhelming open mics and gatekept creative spaces, Pravin started an Instagram page in late 2024 with zero budget and one goal; to create a platform where talent did not need permission.',

        'He began by posting one sher a day. That page slowly became a vibe. And in January 2025, MicTale hosted its first open mic with no sponsor, but with just a mic, a rented hall, and people who actually gave a damn.',

        'That day flipped the switch.',

        'Since then, Pravin has been building MicTale like Dashrath Manjhi breaking the mountain, funding it from his salary, designing every visual, scripting every post, and creating something most people only talk about in "let\'s do something bro" conversations.',

        'He is not doing this for fame or followers. He is doing it because no one else would. And if you have ever felt like your voice did not fit the mold, welcome home!'

      ].map((paragraph, index) => (

        <p
          key={index}
          className='mb-3 text-sm md:text-lg'
          style={getAnimationStyle(
            'founder-story',
            -5 * index,
            `${index * 0.1}s`
          )}
        >
          {paragraph}
        </p>
      ))}
      
      <div className="clear-both"></div>
    </div>
  </div>
</section>

        <Footer />
      </div>
    </>
  )
}
