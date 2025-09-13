'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Book01FreeIcons,
  Location01FreeIcons,
  Share01Icon,
  HeartAddIcon,
  EyeFreeIcons
} from '@hugeicons/core-free-icons/index'
import { HugeiconsIcon } from '@hugeicons/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PoemListClient ({ poems, author }) {
  const [query, setQuery] = useState('')

  const filtered = poems.filter(p => {
    const title = (p.title || '').toLowerCase()
    const excerpt = (p.excerpt || '').toLowerCase()
    return (
      title.includes(query.toLowerCase()) ||
      excerpt.includes(query.toLowerCase())
    )
  })

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  const sharePoet = async (author) => {
  if (typeof window !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: author.name || 'Poet',
        text: `Read poems by ${author.name || 'Unknown'}`,
        url: window.location.href
      });
      return;
    } catch (error) {
      console.error('Web Share API error, falling back:', error);
    }
  }

  console.log('Web Share API not available. Showing fallback options.');
};

  return (
    <div> <main className='mb-1 md:mr-5 md:ml-5 md:mb-5 rounded-b-2xl bg-slate-950 text-gray-200'>
        <section className='relative border-b border-gray-800'>
                <div className='md:hidden max-w-md mx-auto py-12 flex flex-col items-center gap-4'>
        <div className='flex w-full items-center justify-center gap-4'>
          <div className='flex flex-col items-center gap-2'>
            <div className='relative w-22 h-22 rounded-3xl overflow-hidden shadow-lg ring-2 ring-gray-800'>
            <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  className='object-cover'
                  priority
                />
            </div>
          </div>
          <div className='block space-y-2'>
  <h1 className='text-xl uppercase tracking-wider text-gray-400'>{author.name}</h1>
          <div className='flex gap-2 flex-row'>
            <button
              className='px-2 py-1 cursor-pointer rounded-lg text-xs font-medium flex items-center gap-2 relative overflow-hidden transition-all duration-300
    bg-gradient-to-r from-orange-500 to-amber-600
    hover:from-orange-600 hover:to-amber-700
    before:absolute before:inset-0 before:bg-white/20 before:blur-sm before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100
    shadow-xl shadow-orange-500/30 hover:shadow-amber-500/40'
            >
              <HugeiconsIcon
                icon={HeartAddIcon}
                className='w-4 h-4 relative z-10'
              />
              <span className='relative z-10'>Follow</span>
            </button>
            <button
            onClick={ () => sharePoet(author)}
              className='px-2 py-1 cursor-pointer rounded-lg text-xs font-medium flex items-center gap-2 relative overflow-hidden transition-all duration-300
    text-white border border-amber-600
    before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-orange-500 before:to-amber-600 before:-z-10
    after:absolute after:inset-[2px] after:rounded-lg after:bg-slate-950 after:-z-0
    hover:shadow-lg hover:shadow-orange-500/30'
            >
              <HugeiconsIcon
                icon={Share01Icon}
                className='w-4 h-4 relative z-10'
              />
              <span className='relative z-10'>Share</span>
            </button>
          </div>
          </div>
        </div>

        <div>
          {author.bio && (
            <p className='mt-2 text-sm px-4 md:text-base text-justify text-gray-400 line-clamp-4'>
              {author.bio}
            </p>
          )}
        </div>
        <div className='flex gap-4 text-xs'>
          <div className='px-3 py-1 bg-gray-800/70 rounded-full'>
            <span className='text-white font-semibold'>
              {poems.length}
            </span>{' '}
            Poems
          </div>
          <div className='px-3 py-1 bg-gray-800/70 rounded-full'>
            <span className='text-white font-semibold'>2.4K</span>{' '}
            Readers
          </div>
        </div>
      </div>
    
          <div className='max-w-5xl mx-auto px-4 py-12 hidden md:grid gap-8 md:grid-cols-[auto_1fr] items-center'>
            <div className='relative w-28 h-28 md:w-40 md:h-40 rounded-4xl overflow-hidden shadow-lg ring-2 ring-gray-800'>
              {author.image ? (
                <Image
                  src={author.image}
                  alt={author.name}
                  fill
                  className='object-cover'
                  priority
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-2xl font-bold bg-gray-800 text-gray-500'>
                  {author.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className='flex flex-col gap-4'>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold tracking-tight'>
                  {author.name}
                </h1>
                {author.bio && (
                  <p className='mt-2 text-sm md:text-base text-gray-400 line-clamp-4'>
                    {author.bio}
                  </p>
                )}
              </div>

              <div className='flex flex-wrap items-center gap-3'>
                <button
                  className='px-4 py-2 cursor-pointer rounded-lg text-sm font-medium flex items-center gap-2 relative overflow-hidden transition-all duration-300
  bg-gradient-to-r from-orange-500 to-amber-600
  hover:from-orange-600 hover:to-amber-700
  before:absolute before:inset-0 before:bg-white/20 before:blur-sm before:transition-all before:duration-500 before:opacity-0 hover:before:opacity-100
  shadow-xl shadow-orange-500/30 hover:shadow-amber-500/40'
                >
                  <HugeiconsIcon
                    icon={HeartAddIcon}
                    className='w-4 h-4 relative z-10'
                  />
                  <span className='relative z-10'>Follow</span>
                </button>
                <button
                onClick={() => sharePoet(author)}
                  className='px-4 py-2 cursor-pointer rounded-lg text-sm font-medium flex items-center gap-2 relative overflow-hidden transition-all duration-300
  text-white border border-amber-600
  before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-orange-500 before:to-amber-600 before:-z-10
  after:absolute after:inset-[2px] after:rounded-lg after:bg-slate-950 after:-z-0
  hover:shadow-lg hover:shadow-orange-500/30'
                >
                  <HugeiconsIcon
                    icon={Share01Icon}
                    className='w-4 h-4 relative z-10'
                  />
                  <span className='relative z-10'>Share</span>
                </button>

                <div className='flex gap-4 ml-auto text-xs md:text-sm'>
                  <div className='px-3 py-1 bg-gray-800/70 rounded-full'>
                    <span className='text-white font-semibold'>
                      {poems.length}
                    </span>{' '}
                    Poems
                  </div>
                  <div className='px-3 py-1 bg-gray-800/70 rounded-full'>
                    <span className='text-white font-semibold'>2.4K</span>{' '}
                    Readers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <main/>
    <div className='max-w-5xl justify-center items-center mx-auto'>
      <style jsx global>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slideInUp 0.5s ease-out;
        }

        .animate-fade-scale {
          animation: fadeInScale 0.4s ease-out;
        }

        .animate-delay-100 {
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }

        .animate-delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }

        .animate-delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
      `}</style>

      <div className='animate-slide-up mt-10 mb-4'>
        <div className='flex items-center justify-center'>
          <div className='justify-center items-center flex flex-col'>
            <p
              className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
              style={poppinsStyle}
            >
              Explore his
            </p>
            <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
              Poetry Collection{' '}
            </p>
          </div>
          <div className='items-center justify-between w-full hidden'>
            <h2 className='text-xl md:text-2xl font-semibold'>
              Poetry Collection
            </h2>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </div>
              <input
                type='text'
                placeholder='Search poems...'
                className='w-full sm:w-80 pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200'
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='pb-5'>
        {filtered.length === 0 ? (
          <div className='animate-fade-scale text-center py-12'>
            <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8'>
              <div className='w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-gray-300 mb-2'>
                No poems found
              </h3>
              <p className='text-gray-500 text-sm'>
                Try adjusting your search terms
              </p>
            </div>
          </div>
        ) : (
          filtered.map((poem, index) => (
            <article
              key={poem.id}
              className={`fade-in-scale group mx-1 ${
                index < 3 ? `stagger-delay-${index + 1}` : ''
              }`}
            >
              <div className='bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 rounded-2xl p-3 transition-all duration-300 hover:bg-gray-800/50 hover:shadow-xl hover:shadow-black/20'>
                <div className='flex items-start justify-between'>
                  <h3 className='text-sm md:text-xl md:font-semibold text-white group-hover:text-blue-300 transition-colors duration-200'>
                    <Link
                      href={`/poem/${poem.slug || poem.id}`}
                      className='hover:underline'
                    >
                      {poem.title || 'Untitled'}
                    </Link>
                  </h3>

                  <div className='flex-shrink-0'>
                    <Link
                      href={`/poem/${poem.slug || poem.id}`}
                      className='inline-flex items-center px-4 py-2 bg-gray-700/50 hover:bg-blue-600 border border-gray-600/50 hover:border-blue-500 rounded-lg text-sm text-gray-200 hover:text-white transition-all duration-200 group'
                    >
                      <span>{poem.category || 'Poem'}</span>
                      <svg
                        className='ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
    </main>
    </div>
         
  )
}
