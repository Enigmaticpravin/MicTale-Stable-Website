'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Footer from '@/app/components/Footer'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Download01FreeIcons,
  Share01FreeIcons
} from '@hugeicons/core-free-icons/index'

function SherSelectionModal({ shers, onSelect, onClose, title, author }) {
  const [selectedShers, setSelectedShers] = useState([])

  const toggleSher = (index) => {
    setSelectedShers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else if (prev.length < 5) {
        return [...prev, index].sort((a, b) => a - b)
      }
      return prev
    })
  }

  const handleDownload = () => {
    const selectedSherData = selectedShers.map(index => shers[index])
    onSelect(selectedSherData)
    onClose()
  }

  return (
    <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-medium text-white rozha-class mb-2">{title}</h2>
          <p className="text-yellow-500 text-sm mb-4">by {author}</p>
          <p className="text-slate-300 text-sm">
            Select up to 5 shers for your download ({selectedShers.length}/5 selected)
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {shers.map((sher, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedShers.includes(index)
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => toggleSher(index)}
            >
              <div className="text-white text-sm space-y-1">
                <div className="rozha-class">{sher.first}</div>
                {sher.second && <div className="rozha-class">{sher.second}</div>}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 border-t border-slate-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={selectedShers.length === 0}
            className="px-6 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download Selected ({selectedShers.length})
          </button>
        </div>
      </div>
    </div>
  )
}

// Function to create and download the image
function createGhazalImage(shersToDownload, title, author) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  // Calculate dynamic height based on content
  const baseHeight = 400
  const sherHeight = 80 // space per sher
  const calculatedHeight = baseHeight + (shersToDownload.length * sherHeight)
  
  canvas.width = 800
  canvas.height = Math.max(800, calculatedHeight)
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#0f172a') // slate-950
  gradient.addColorStop(1, '#1e293b') // slate-800
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Set font properties
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  
  let yPosition = 80
  
  // Title
  ctx.font = 'bold 32px serif'
  ctx.fillText(title, canvas.width / 2, yPosition)
  yPosition += 60
  
  // Author
  ctx.fillStyle = '#eab308' // yellow-500
  ctx.font = 'italic 20px serif'
  ctx.fillText(`— ${author}`, canvas.width / 2, yPosition)
  yPosition += 80
  
  // Decorative line
  ctx.strokeStyle = '#64748b' // slate-500
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(canvas.width * 0.2, yPosition)
  ctx.lineTo(canvas.width * 0.8, yPosition)
  ctx.stroke()
  yPosition += 60
  
  // Shers
  ctx.fillStyle = '#ffffff'
  ctx.font = '24px serif'
  ctx.textAlign = 'center'
  
  shersToDownload.forEach((sher, index) => {
    // First line of sher
    ctx.fillText(sher.first, canvas.width / 2, yPosition)
    yPosition += 40
    
    // Second line of sher (if exists)
    if (sher.second) {
      ctx.fillText(sher.second, canvas.width / 2, yPosition)
      yPosition += 40
    }
    
    // Add space between shers (except for the last one)
    if (index < shersToDownload.length - 1) {
      yPosition += 30
    }
  })
  
  // Convert canvas to blob and download
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ghazal.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 'image/png')
}

function renderLineAsWords (line) {
  const words = String(line || '')
    .split(/\s+/)
    .filter(Boolean)
  return (
    <div
      style={{
        maxWidth: '712px',
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap'
      }}
      className='mx-auto'
    >
      {words.map((word, index) => (
        <span
          key={index}
          className='text-[20px] sm:text-2xl md:text-3xl text-center inline-block text-white rozha-class'
        >
          {word}
        </span>
      ))}
    </div>
  )
}

export default function PoemPageClient({ poem, similar }) {
  const [showModal, setShowModal] = useState(false)
  
  const { title, author, category, content, isGhazal, shers } = poem

  const downloadGhazal = () => {
    if (!isGhazal) {
      alert('Download functionality is currently only available for ghazals.')
      return
    }
    
    if (shers.length > 5) {
      setShowModal(true)
    } else {
      createGhazalImage(shers, title, author)
    }
  }
  
  const handleSherSelection = (selectedShers) => {
    createGhazalImage(selectedShers, title, author)
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
                <p className='text-yellow-500 text-base font-medium italic mb-6 md:mb-8'>
                  {author}
                </p>
                <div className='h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent' />
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
                  <HugeiconsIcon icon={Download01FreeIcons} className='w-4 h-4' />
                  <span className='text-sm'>Download</span>
                </button>
                <button className='flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors'>
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

      {showModal && (
        <SherSelectionModal
          shers={shers}
          title={title}
          author={author}
          onSelect={handleSherSelection}
          onClose={() => setShowModal(false)}
        />
      )}

      <Footer />
    </>
  )
}