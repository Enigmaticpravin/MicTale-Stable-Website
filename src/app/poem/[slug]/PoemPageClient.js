'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import Footer from '@/app/components/Footer'
import html2canvas from 'html2canvas'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Download01FreeIcons,
  Share01FreeIcons
} from '@hugeicons/core-free-icons/index'
import Image from 'next/image'

function renderLineAsWords (line) {
  const words = String(line || '')
    .split(/\s+/)
    .filter(Boolean)
  return (
    <div
      style={{
        maxWidth: '712px',
        width: '90%',
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap'
      }}
      className='mx-auto'
    >
      {words.map((word, index) => (
        <span
          key={index}
          className='text-lg sm:text-xl md:text-2xl text-center inline-block text-white tiro-class'
        >
          {word}
        </span>
      ))}
    </div>
  )
}

function renderLineForExport (line) {
  const words = String(line || '')
    .split(/\s+/)
    .filter(Boolean)
  return (
    <div
      style={{
        maxWidth: '800px',
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap',
        margin: '0 auto'
      }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className='tiro-class'
          style={{
            fontSize: 36,
            lineHeight: 1.2,
            textAlign: 'center',
            display: 'inline-block',
            color: '#ffffff'
          }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}

export default function PoemPageClient ({ poem, similar }) {
  const { title, author, content, isGhazal, shers = [] } = poem

  const [showModal, setShowModal] = useState(false)
  const [selectedShers, setSelectedShers] = useState([])
  const [exportIndices, setExportIndices] = useState(null)
  const captureRef = useRef(null)

  const toggleSher = index => {
    setSelectedShers(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index)
      if (prev.length >= 5) return prev
      return [...prev, index]
    })
  }

  const downloadGhazal = () => {
    if (isGhazal && shers.length > 5) {
      setShowModal(true)
    } else {
      const idxs = isGhazal ? shers.map((_, i) => i) : []
      startExport(idxs)
    }
  }

  const startExport = async indices => {
    setExportIndices(indices)
    setShowModal(false)
    await new Promise(r => setTimeout(r, 0))
    await exportAsImage()
    setExportIndices(null)
  }

  const exportAsImage = async () => {
    const node = captureRef.current
    if (!node) return

    const canvas = await html2canvas(node, {
      backgroundColor: '#0f172a',
      useCORS: true,
      scale: Math.max(2, window.devicePixelRatio || 2),
      onclone: doc => {
        const style = doc.createElement('style')
        style.textContent = `
          /* prevent global gradients/variables from bleeding in */
          #export-capture * {
            text-shadow: none !important;
            box-shadow: none !important;
          }
        `
        doc.head.appendChild(style)
      }
    })

    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `${title || 'poem'}.png`
    a.click()
  }

  const sharePoem = async () => {
    try {
      const shareData = {
        title: title || 'Poem',
        text: `${title || 'Untitled'} by ${author || 'Unknown'}`,
        url: window.location.href
      }
      await navigator.share(shareData)
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  function slugify (text) {
    return String(text)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
  }

  return (
    <>
      <main className='mb-1 md:mr-5 md:ml-5 md:mb-5 rounded-b-2xl md:rounded-2xl min-h-screen bg-slate-950'>
        <div className='max-w-5xl mx-auto px-6 py-8 md:py-16'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-16'>
            <div className='md:col-span-2'>
              <header className='mb-6 md:mb-16'>
                <h1 className='text-3xl md:text-4xl rozha-class text-white font-medium mb-4'>
                  {title}
                </h1>
                <Link
                  href={`/poet/${slugify(author)}`}
                  className='text-yellow-500 text-base font-medium italic'
                >
                  {author}
                </Link>

                <div className='h-px bg-gradient-to-r from-slate-700 via-slate-600 mt-10 to-transparent' />
              </header>

              {isGhazal ? (
                <section className='space-y-8 md:space-y-12'>
                  {shers.map((sher, sherIndex) => (
                    <div key={sherIndex} className='space-y-1 md:space-y-5'>
                      <div>{renderLineAsWords(sher.first)}</div>
                      {sher.second && (
                        <div>{renderLineAsWords(sher.second)}</div>
                      )}
                    </div>
                  ))}
                </section>
              ) : (
                <article className='prose prose-invert prose-lg max-w-none'>
                  <div className='text-slate-200 leading-relaxed whitespace-pre-wrap text-lg'>
                    {content}
                  </div>
                </article>
              )}

              <div className='flex items-center gap-6 mt-6 md:mt-20 pt-8 border-t border-slate-800/30'>
                <button
                  onClick={downloadGhazal}
                  className='flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors'
                >
                  <HugeiconsIcon
                    icon={Download01FreeIcons}
                    className='w-4 h-4'
                  />
                  <span className='text-sm'>Download</span>
                </button>
                <button
                  onClick={sharePoem}
                  className='flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors'
                >
                  <HugeiconsIcon icon={Share01FreeIcons} className='w-4 h-4' />
                  <span className='text-sm'>Share</span>
                </button>
              </div>
            </div>

            <aside className='md:col-span-1'>
              <div className='sticky top-24'>
                <div className='border-l border-slate-800 pl-8'>
                  <h3 className='text-slate-300 font-medium mb-6 text-sm uppercase tracking-wider'>
                    Related
                  </h3>
                  {similar.length === 0 ? (
                    <p className='text-slate-500 text-sm'>
                      No related poems found.
                    </p>
                  ) : (
                    <div className='space-y-6'>
                      {similar.map(s => (
                        <Link
                          key={s.slug}
                          href={`/poem/${s.slug}`}
                          className='block group'
                        >
                          <div className='pb-4 border-b border-slate-800/40 last:border-b-0'>
                            <h4
                              className="relative text-white text-sm font-medium mb-2 leading-snug
                              after:content-[''] after:absolute after:left-0 after:bottom-0
                              after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
                              hover:after:w-full"
                            >
                              {s.title || 'Untitled'}
                            </h4>
                            <div className='flex items-center justify-between'>
                              <p className='text-slate-400 text-xs'>
                                {s.author || 'Unknown'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {exportIndices !== null && (
        <div
          id='export-capture'
          ref={captureRef}
          style={{
            position: 'fixed',
            left: '-10000px',
            top: 0,
            width: '1080px',
            height: '1350px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '48px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            fontFamily: 'inherit',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                fontSize: 15,
                color: '#e5e7eb',
                margin: '0 auto 18px 0'
              }}
            >
              PUBLISHED ON
            </div>
            <img
              src='/images/footerlogo.png'
              alt='Logo'
              style={{ height: '60px', margin: '0 auto 20px' }}
            />

            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#e5e7eb',
                opacity: 0.3,
                marginTop: '25px'
              }}
            ></div>
          </div>

          {isGhazal ? (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              {exportIndices.map(i => {
                const sher = shers[i]
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}
                  >
                    {renderLineForExport(sher.first)}
                    {sher.second ? renderLineForExport(sher.second) : null}
                  </div>
                )
              })}
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '36px',
                  fontSize: 28,
                  color: '#eab308'
                }}
              >
                {author}
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  color: '#e5e7eb',
                  whiteSpace: 'pre-wrap',
                  fontSize: 20,
                  lineHeight: 1.7
                }}
              >
                {content}
              </div>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '36px',
                  fontSize: 28,
                  color: '#eab308'
                }}
              >
                — {author}
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
          <div className='bg-slate-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col'>
            <h2 className='text-white text-xl font-semibold mb-4 text-center'>
              Select exactly 5 shers
            </h2>

            <div className='flex-1 overflow-y-auto space-y-3 pr-1'>
              {shers.map((sher, i) => {
                const active = selectedShers.includes(i)
                return (
                  <button
                    key={i}
                    type='button'
                    onClick={() => toggleSher(i)}
                    className={`w-full text-left p-4 rounded-xl border transition text-sm sm:text-base
                ${
                  active
                    ? 'bg-slate-700 border-slate-500'
                    : 'bg-slate-800 border-slate-700'
                }
              `}
                  >
                    <p className='text-white leading-snug'>{sher.first}</p>
                    {sher.second && (
                      <p className='text-slate-300 leading-snug mt-1'>
                        {sher.second}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6'>
              <button
                onClick={() => setShowModal(false)}
                className='w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700'
              >
                Cancel
              </button>

              <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                <button
                  onClick={() =>
                    setSelectedShers(
                      [0, 1, 2, 3, 4].filter(i => i < shers.length)
                    )
                  }
                  className='px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 w-full sm:w-auto'
                >
                  Use first 5
                </button>
                <button
                  disabled={selectedShers.length !== 5}
                  onClick={() => startExport(selectedShers)}
                  className='px-4 py-2 rounded-lg bg-yellow-500 text-black font-semibold disabled:opacity-50 w-full sm:w-auto'
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
