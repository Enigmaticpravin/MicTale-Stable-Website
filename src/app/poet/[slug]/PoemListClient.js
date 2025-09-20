'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Share } from 'lucide-react'

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

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' }

  const sharePoet = async author => {
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: author.name || 'Poet',
          text: `Read poems by ${author.name || 'Unknown'}`,
          url: window.location.href
        })
        return
      } catch (error) {
        console.error('Web Share API error:', error)
      }
    }
    console.log('Web Share API not available.')
  }

  return (
    <div>
      <main className='mb-1 md:mx-5 md:mb-5 rounded-2xl bg-slate-950 text-gray-200 shadow-xl shadow-black/20'>
        <section className='relative border-b border-gray-800/70'>
          <div className='mx-auto py-10 flex flex-col items-center gap-6 bg-white rounded-2xl'>
            <div className=' max-w-5xl flex w-full items-center px-6 gap-4'>
              <div className='relative md:w-44 md:h-44 md:rounded-4xl w-24 h-24 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-700'>
                {author.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    fill
                    className='object-cover'
                    priority
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center md:text-4xl text-lg font-semibold bg-gray-800 text-gray-500'>
                    {author.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className='flex flex-col'>
                <h1 className='md:text-4xl text-xl font-semibold text-gray-900'>
                  {author.name}
                </h1>
                <div className='flex gap-2 text-xs font-medium'>
                  <div className='px-3 py-[2px] rounded-full border-1 text-slate-700 border-slate-700'>
                    <span className='text-slate-700'>{poems.length}</span> Poems
                  </div>
                </div>
                <div onClick={() => sharePoet(author)} className='cursor-pointer bg-slate-700 gap-2 md:py-2 py-1 flex flex-row items-center justify-center mt-1 rounded-2xl'>
                  <Share className='w-3 h-3 rounded-full text-white' />{' '}
                  <span className='text-xs text-white'>Share Profile </span>
                </div>
              </div>
            </div>
            {author.bio && (
              <p className='mt-2 max-w-5xl text-sm px-6 text-gray-800 text-left leading-relaxed'>
                {author.bio}
              </p>
            )}
          </div>
        </section>

        <div className='max-w-5xl mx-auto px-6 mt-10'>
          <div className='justify-center items-center flex flex-col mb-3 md:mb-10'>
            <p
              className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
              style={poppinsStyle}
            >
              explore
            </p>
            <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white veronica-class'>
              Poetry Collection{' '}
            </p>
          </div>
        </div>

        <div className='max-w-5xl mx-auto mt-5 px-4 pb-5'>
          <div className='rounded-2xl border border-gray-700/70 bg-gray-900/30 backdrop-blur-sm'>
            {filtered.length === 0 ? (
              <div className='text-center py-12'>
                <div className='bg-gray-800/40 border border-gray-700/60 rounded-2xl p-8'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-gray-700/40 rounded-full flex items-center justify-center'>
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
                  <h3 className='text-lg font-semibold text-gray-200 mb-2'>
                    No poems found
                  </h3>
                  <p className='text-gray-500 text-sm'>
                    Try adjusting your search terms
                  </p>
                </div>
              </div>
            ) : (
              filtered.map(poem => (
                <article
                  key={poem.id}
                  className='px-5 py-4 border-b border-gray-800/40 last:border-none hover:bg-gray-800/40 transition'
                >
                  <div className='flex items-center justify-between'>
                    <h3
                      style={poppinsStyle}
                      className='text-sm md:text-lg font-medium text-gray-100 hover:text-amber-400 transition'
                    >
                      <Link
                        href={`/poem/${poem.slug || poem.id}`}
                        className='hover:underline'
                      >
                        {poem.title || 'Untitled'}
                      </Link>
                    </h3>
                    <Link
                      href={`/poem/${poem.slug || poem.id}`}
                      className='inline-flex items-center px-3 py-1.5 text-xs md:text-sm border border-gray-700/60 rounded-lg hover:border-amber-500 hover:text-amber-400 transition'
                    >
                      {poem.category || 'Poem'}
                      <svg
                        className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5'
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
                </article>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
