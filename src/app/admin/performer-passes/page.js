'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'
import {
  Download,
  Loader2,
  Search,
  UserCircle2,
  Mic2,
  Ticket,
  Sparkles,
  CalendarDays,
  MapPin,
  Plus,
  X
} from 'lucide-react'
import { Instagram, Video, Star } from 'lucide-react'

export default function PerformerPassesPage () {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [shows, setShows] = useState([])
  const [activeShow, setActiveShow] = useState('all')
  const [search, setSearch] = useState('')
  const [downloadingId, setDownloadingId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const passRefs = useRef({})

  const [formData, setFormData] = useState({
    fullName: '',

    phone_number: '',

    email: '',

    instagramHandle: '',

    performanceType: 'Poetry',

    amount: '',

    showId: '',

    slotDate: '',

    slotTime: '02:00 PM',

    isFirstTimer: 'No',

    video_editing_service: false,

    paymentStatus: 'pending'
  })

  const goldText =
    'bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent'
  const goldBtn =
    'bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300'
  const silverBorder =
    'border border-white/10 hover:border-white/30 transition-colors bg-white/5 backdrop-blur-md'

  const glassInput = 'bg-white/5 border border-white/10 focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all duration-300 outline-none rounded-xl px-4 py-3 text-sm'

  useEffect(() => {
    loadData()
  }, [])

  async function loadData () {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/performer-passes', {
        credentials: 'include'
      })
      const result = await response.json()
      if (response.ok) {
        setBookings(result.bookings || [])
        setShows(result.shows || [])
      }
    } catch (err) {
      console.error('Data fetch error')
    } finally {
      setLoading(false)
    }
  }

 const handleManualSubmit = async (e) => {

    e.preventDefault()

    setIsSubmitting(true)

    try {

      const response = await fetch('/api/admin/manual-booking', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(formData)

      })

      if (response.ok) {

        await loadData()

        setIsModalOpen(false)

        resetForm()

      }

    } catch (err) {

      alert('Manual add failed')

    } finally {

      setIsSubmitting(false)

    }

  }



  const resetForm = () => {

    setFormData({

      fullName: '', phone_number: '', email: '', instagramHandle: '',

      performanceType: 'Poetry', showId: '', slotDate: '', slotTime: '06:00 PM',

      isFirstTimer: false, video_editing_service: false, paymentStatus: 'Pending'

    })

  }



  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchesShow = activeShow === 'all' || b.show_id === activeShow
      return (
        matchesShow && b.full_name.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [activeShow, bookings, search])

  async function downloadPass (booking) {
    const node = passRefs.current[booking.id]
    if (!node) return
    try {
      setDownloadingId(booking.id)
      await new Promise(r => setTimeout(r, 150))
      const canvas = await html2canvas(node, {
        scale: 3,
        backgroundColor: '#020617',
        useCORS: true
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png', 1.0)
      link.download = `PASS_${booking.booking_id}.png`
      link.click()
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className='min-h-screen bg-[#020617] text-white font-sans selection:bg-[#D4AF37]/30 p-4 md:p-12 relative overflow-x-hidden'>
      {/* Background Decorative Orbs */}
      <div className='fixed -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[150px] pointer-events-none' />
      <div className='fixed -bottom-24 -right-24 w-96 h-96 bg-yellow-600/5 blur-[150px] pointer-events-none' />

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Premium Header */}
        <header className='mb-16 flex flex-col md:flex-row justify-between items-end gap-8'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-4'>
              <span className='bg-[#D4AF37] text-black px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-tighter'>
                Admin
              </span>
              <span className='text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold'>
                MicTale Executive Console
              </span>
            </div>
            <h1
              className={`text-4xl md:text-6xl font-normal tracking-tight leading-none ${goldText} elsie-regular`}
            >
              Issue Performer Passes
            </h1>
            <p className='text-gray-400 text-sm max-w-md'>
              Manage curated artist entries and manual registrations.
            </p>
          </div>

          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[#D4AF37]`}
            >
              <Plus size={18} /> Register Performer
            </button>
            <div className='relative group'>
              <Search
                className='absolute left-4 top-1/2 -translate-y-1/2 text-white/20'
                size={18}
              />
              <input
                placeholder='Search performer...'
                className={`w-full md:w-64 pl-12 pr-6 py-4 rounded-2xl text-sm outline-none ${silverBorder}`}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className={`px-6 py-4 rounded-2xl text-sm outline-none cursor-pointer ${silverBorder}`}
              onChange={e => setActiveShow(e.target.value)}
            >
              <option value='all' className='bg-[#0f172a]'>
                All Shows
              </option>
              {shows.map(s => (
                <option key={s.id} value={s.id} className='bg-[#0f172a]'>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        {loading ? (
          <div className='flex flex-col items-center justify-center py-40'>
            <Loader2 className='animate-spin text-[#D4AF37] mb-4' size={32} />
            <p className='text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]'>
              Accessing Registry
            </p>
          </div>
        ) : (
          <div className='grid gap-12'>
            {filtered.map(booking => (
              <div
                key={booking.id}
                className={`group relative bg-white/[0.02] rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-12 border border-white/5 hover:border-white/20 transition-all duration-500`}
              >
                <div className='flex flex-col justify-between'>
                  <div>
                    <div className='flex items-center gap-4 mb-8'>
                      <span className='text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20'>
                        {booking.confirmation_status || 'Approved'}
                      </span>
                      <span className='text-white/20 font-mono text-[10px]'>
                        ID: {booking.booking_id}
                      </span>
                    </div>
                    <h2 className='text-3xl md:text-5xl font-bold text-white mb-10 group-hover:translate-x-2 transition-transform duration-500'>
                      {booking.full_name}
                    </h2>
                    <div className='grid sm:grid-cols-2 gap-8'>
                      <Detail
                        label='Art Form'
                        value={booking.performance_type}
                        icon={Mic2}
                      />
                      <Detail
                        label='Slot Date'
                        value={booking.entryPass.slotDate}
                        icon={CalendarDays}
                      />
                      <Detail
                        label='Venue Access'
                        value={booking.entryPass.venue}
                        icon={MapPin}
                      />
                      <Detail
                        label='Contact'
                        value={booking.email}
                        icon={UserCircle2}
                      />
                    </div>
                  </div>
                  <div className='mt-12'>
                    <button
                      onClick={() => downloadPass(booking)}
                      disabled={downloadingId === booking.id}
                      className={`w-full md:w-auto px-12 py-4 rounded-full flex items-center justify-center gap-3 ${goldBtn} text-xs uppercase tracking-widest`}
                    >
                      {downloadingId === booking.id ? (
                        <Loader2 className='animate-spin' size={18} />
                      ) : (
                        <Download size={18} />
                      )}
                      {downloadingId === booking.id
                        ? 'Preparing Pass...'
                        : 'Download Digital Credential'}
                    </button>
                  </div>
                </div>

                {/* HIDDEN PASS FOR CAPTURE */}
                <div className='flex justify-center opacity-0 absolute pointer-events-none'>
                  <div
                    ref={el => (passRefs.current[booking.id] = el)}
                    style={{
                      width: '320px',
                      background:
                        'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
                      borderRadius: '32px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        background:
                          'linear-gradient(90deg, #B8860B, #F9E498, #D4AF37)',
                        padding: '16px',
                        textAlign: 'center'
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '9px',
                          fontWeight: '950',
                          color: '#000',
                          letterSpacing: '3px',
                          textTransform: 'uppercase'
                        }}
                      >
                        Official Performer Pass
                      </p>
                    </div>
                    <div style={{ padding: '30px' }}>
                      <div
                        style={{ textAlign: 'center', marginBottom: '24px' }}
                      >
                        <img
                          src='/images/footerlogo.webp'
                          alt='Logo'
                          style={{
                            height: '45px',
                            margin: '0 auto',
                            display: 'block'
                          }}
                        />
                        <div
                          style={{
                            width: '30px',
                            height: '1px',
                            background: 'rgba(212,175,55,0.4)',
                            margin: '12px auto 0'
                          }}
                        />
                      </div>
                      <div
                        style={{
                          background: '#fff',
                          padding: '16px',
                          borderRadius: '20px',
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: '24px'
                        }}
                      >
                        <QRCodeSVG
                          value={booking.booking_id}
                          size={150}
                          level='H'
                          bgColor='#fff'
                          fgColor='#020617'
                        />
                      </div>
                      <div
                        style={{ textAlign: 'center', marginBottom: '24px' }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '9px',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                          }}
                        >
                          Performer Name
                        </p>
                        <h3
                          style={{
                            margin: '0',
                            fontSize: '22px',
                            fontWeight: 'bold',
                            color: '#fff'
                          }}
                        >
                          {booking.full_name}
                        </h3>
                      </div>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255,255,255,0.05)',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                          padding: '16px 0',
                          marginBottom: '24px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                          }}
                        >
                          <PassField
                            label='Date'
                            value={booking.entryPass.slotDate}
                          />
                          <PassField
                            label='Act'
                            value={booking.performance_type}
                            align='right'
                          />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <PassField
                            label='Venue'
                            value={booking.entryPass.venue.split(',')[0]}
                          />
                          <PassField
                            label='Time'
                            value={booking.entryPass.slotTime}
                            align='right'
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          opacity: '0.3'
                        }}
                      >
                        <Ticket size={14} color='#D4AF37' />
                        <span
                          style={{ fontSize: '9px', fontFamily: 'monospace' }}
                        >
                          #{booking.entryPass.passId.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      

  {isModalOpen && (

        <div className='fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md overflow-y-auto'>

          <div className='relative w-full max-w-2xl bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-3xl my-8'>

            <div className='p-8 border-b border-white/5 flex justify-between items-center'>

              <div>

                <h2 className={`text-2xl elsie-regular ${goldText}`}>Artist Onboarding</h2>

                <p className='text-xs text-white/30 uppercase tracking-widest mt-1'>Manual Entry System</p>

              </div>

              <button onClick={() => setIsModalOpen(false)} className='p-2 cursor-pointer hover:bg-white/5 rounded-full transition-colors'>

                <X size={24} />

              </button>

            </div>



            <form onSubmit={handleManualSubmit} className='p-8 space-y-6'>

              <div className='grid md:grid-cols-2 gap-6'>

                <FormGroup label="Full Name">

                  <input required placeholder="E.g. John Doe" className={glassInput} onChange={e => setFormData({...formData, fullName: e.target.value})} />

                </FormGroup>

               

                <FormGroup label="Phone Number">

                  <input required type="tel" placeholder="+91 ..." className={glassInput} onChange={e => setFormData({...formData, phone_number: e.target.value})} />

                </FormGroup>



                <FormGroup label="Email Address">

                  <input type="email" placeholder="artist@mictale.com" className={glassInput} onChange={e => setFormData({...formData, email: e.target.value})} />

                </FormGroup>



                <FormGroup label="Amount Paid (INR)">

                  <input type="number" placeholder="299" className={glassInput} onChange={e => setFormData({...formData, amount: e.target.value})} />

                </FormGroup>



                <FormGroup label="Instagram Handle">

                  <div className='relative'>

                    <Instagram className='absolute left-3 top-1/2 -translate-y-1/2 text-white/20' size={14} />

                    <input placeholder="@username" className={`${glassInput} pl-10 w-full`} onChange={e => setFormData({...formData, instagramHandle: e.target.value})} />

                  </div>

                </FormGroup>



                <FormGroup label="Select Show">

                  <select required className={glassInput} onChange={e => setFormData({...formData, showId: e.target.value})}>

                    <option value="">Choose a Show</option>

                    {shows.map(s => <option key={s.id} value={s.id} className='bg-[#0f172a]'>{s.name}</option>)}

                  </select>

                </FormGroup>



                <FormGroup label="Art Form">

                  <select className={glassInput} onChange={e => setFormData({...formData, performanceType: e.target.value})}>

                    <option className='bg-[#0f172a]'>Poetry</option>

                    <option className='bg-[#0f172a]'>Music</option>

                    <option className='bg-[#0f172a]'>Storytelling</option>

                    <option className='bg-[#0f172a]'>Comedy</option>

                  </select>

                </FormGroup>



                <FormGroup label="Performance Date">

                  <input required type="date" className={`${glassInput} [color-scheme:dark]`} onChange={e => setFormData({...formData, slotDate: e.target.value})} />

                </FormGroup>



                <FormGroup label="Payment Status">

                   <select className={glassInput} onChange={e => setFormData({...formData, paymentStatus: e.target.value})}>

                    <option className='bg-[#0f172a]'>pending</option>

                    <option className='bg-[#0f172a]'>paid</option>

                  </select>

                </FormGroup>

              </div>



              {/* Toggles */}

              <div className='flex flex-wrap gap-4 pt-4 border-t border-white/5'>

                <label className='flex items-center gap-3 cursor-pointer group'>

                   <input type="checkbox" className='hidden peer' onChange={e => setFormData({...formData, isFirstTimer:"Yes"})} />

                   <div className='w-5 h-5 rounded border border-white/20 peer-checked:bg-[#D4AF37] peer-checked:border-transparent flex items-center justify-center transition-all'>

                      <Star size={12} className='text-black opacity-0 peer-checked:opacity-100' />

                   </div>

                   <span className='text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase'>First Time Performer</span>

                </label>



                <label className='flex items-center gap-3 cursor-pointer group ml-auto'>

                   <input type="checkbox" className='hidden peer' onChange={e => setFormData({...formData, needsVideo: e.target.checked})} />

                   <div className='w-5 h-5 rounded border border-white/20 peer-checked:bg-blue-500 peer-checked:border-transparent flex items-center justify-center transition-all'>

                      <Video size={12} className='text-white opacity-0 peer-checked:opacity-100' />

                   </div>

                   <span className='text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase'>Video Recording Required</span>

                </label>

              </div>



              <button type="submit" disabled={isSubmitting} className={`w-full py-5 rounded-2xl ${goldBtn} mt-4 uppercase tracking-[0.2em] text-sm`}>

                {isSubmitting ? 'Processing...' : 'Generate & Register Artist'}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  )

}

function InfoBox({ icon: Icon, label, value }) {

  return (

    <div className='space-y-1'>

      <div className='flex items-center gap-2 text-white/20'>

        <Icon size={12} />

        <p className='text-[9px] uppercase font-black tracking-widest'>{label}</p>

      </div>

      <p className='text-sm text-white/80 font-medium truncate'>{value}</p>

    </div>

  )

}



function FormGroup({ label, children }) {

  return (

    <div className='flex flex-col gap-2'>

      <label className='text-[10px] font-black uppercase tracking-[0.15em] text-white/30 ml-1'>{label}</label>

      {children}

    </div>

  )


}

function MiniPassField({ label, value, align = 'left' }) {

    return (

        <div style={{ textAlign: align }}>

            <p className='m-0 text-[6px] text-slate-500 uppercase font-black tracking-wider'>{label}</p>

            <p className='m-0 mt-0.5 text-[10px] font-bold text-white truncate'>{value}</p>

        </div>

    )

}


function Detail ({ icon: Icon, label, value }) {
  return (
    <div className='flex items-start gap-4'>
      <div className='w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#D4AF37] border border-white/5 shadow-inner'>
        <Icon size={18} />
      </div>
      <div>
        <p className='text-[10px] uppercase tracking-widest text-white/30 font-bold mb-1'>
          {label}
        </p>
        <p className='text-white text-sm font-medium leading-tight'>{value}</p>
      </div>
    </div>
  )
}

function PassField ({ label, value, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <p
        style={{
          margin: 0,
          fontSize: '7px',
          color: '#475569',
          textTransform: 'uppercase',
          fontWeight: '950',
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '2px 0 0 0',
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#fff'
        }}
      >
        {value}
      </p>
    </div>
  )
}
