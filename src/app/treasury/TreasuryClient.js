'use client'

import React, { useState} from 'react'
import Link from 'next/link'
import MatlaDisplay from '../components/MatlaDisplay'

export default function TreasuryClient ({ initialPoems, initialGhazals }) {
  const [poems, setPoems] = useState(initialPoems)


  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <>
      <main>
        <MatlaDisplay initialGhazals={initialGhazals} />
        <div className='bg-gradient-to-b from-transparent to-slate-900 h-10'></div>
        <div className='relative z-10 mx-auto px-4 bg-slate-900 md:py-10'>
          <div className='max-w-5xl mx-auto'>
            <div className='justify-center items-center flex flex-col mb-3 md:mb-10'>
              <p
                className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-bold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
                style={poppinsStyle}
              >
                Latest Added
              </p>
              <p className='text-transparent bg-clip-text bg-gradient-to-t text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'>
                Poems{' '}
              </p>
            </div>
<ul className="flex flex-col gap-6">
  {poems.map((p) => (
    <li key={p.id ?? p.slug} className="group transition-all duration-150">
      <Link
        href={`/poem/${p.slug}`}
        prefetch
        className="flex flex-col md:flex-row md:items-center gap-6 px-6 md:py-4 md:px-12"
      >
        <div className="hidden md:block w-12 shrink-0">
          <span className="text-xs font-mono font-bold group-hover:flex hidden  group-hover:text-slate-300 transition-colors">
            {String(poems.indexOf(p) + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg md:text-3xl tracking-tight text-slate-200 rozha-one-regular">
                {p.title}
              </h2>
              <span className="rounded bg-slate-100 px-1 py-[1px] text-[8px] md:px-2 md:py-0.5 md:text-[10px] uppercase tracking-widest text-slate-500">
                {p.category}
              </span>
            </div>
            <p className="text-xs md:text-sm md:font-medium text-blue-300 italic">
              by {p.author}
            </p>
          </div>

          {Array.isArray(p.lines) && p.lines.length > 0 && (
            <div className="mt-3 md:mt-6 max-w-3xl">
             <p className="whitespace-pre-line text-sm md:text-lg leading-relaxed text-slate-200 line-clamp-2 font-medium tiro-class">
                {p.lines.slice(0, 2).join('\n')}
              </p>
            </div>
          )}
        </div>

<div className="group hidden items-center justify-end md:flex">
  <div className="flex h-12 w-12 items-center justify-center rounded-full opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:border-slate-900 group-hover:bg-slate-600 group-hover:text-white group-hover:opacity-100">
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  </div>
</div>
      </Link>
    </li>
  ))}
</ul>
          </div>
        </div>
        <div className='bg-gradient-to-b from-slate-900 to-transparent h-10'></div>
      </main>
    </>
  )
}
