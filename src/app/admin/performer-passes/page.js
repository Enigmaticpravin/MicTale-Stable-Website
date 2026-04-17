'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import { QRCodeSVG } from 'qrcode.react'
import {
  Download, Loader2, Search, UserCircle2, Mic2, Ticket,
  CalendarDays, MapPin, Plus, X, ChevronDown, ChevronRight,
  Instagram, Video, Star, Users, Sparkles, ArrowUpDown
} from 'lucide-react'

// ─── helpers ────────────────────────────────────────────────────────────────
function parseDateMs (str) {
  if (!str) return 0
  const d = new Date(str)
  return isNaN(d) ? 0 : d.getTime()
}

function fmtShortDate (str) {
  if (!str) return 'TBD'
  const d = new Date(str)
  if (isNaN(d)) return str
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtWeekday (str) {
  if (!str) return ''
  const d = new Date(str)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase()
}

function statusColor (status) {
  switch ((status || '').toLowerCase()) {
    case 'confirmed':  return { bg: 'rgba(16,185,129,0.12)', text: '#34d399', border: 'rgba(52,211,153,0.25)' }
    case 'pending':    return { bg: 'rgba(245,158,11,0.12)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' }
    case 'checked_in': return { bg: 'rgba(99,102,241,0.12)', text: '#a5b4fc', border: 'rgba(165,180,252,0.25)' }
    case 'cancelled':  return { bg: 'rgba(239,68,68,0.12)',  text: '#f87171', border: 'rgba(248,113,113,0.25)' }
    default:           return { bg: 'rgba(212,175,55,0.10)', text: '#D4AF37', border: 'rgba(212,175,55,0.2)' }
  }
}

function artIcon (type) {
  const t = (type || '').toLowerCase()
  if (t === 'music') return '🎵'
  if (t === 'comedy') return '🎭'
  if (t === 'storytelling') return '📖'
  return '🎤'
}

// ─── main component ──────────────────────────────────────────────────────────
export default function PerformerPassesPage () {
  const [loading, setLoading]               = useState(true)
  const [bookings, setBookings]             = useState([])
  const [shows, setShows]                   = useState([])
  const [selectedShowId, setSelectedShowId] = useState(null)
  const [selectedDate, setSelectedDate]     = useState(null)
  const [expandedShows, setExpandedShows]   = useState({})
  const [search, setSearch]                 = useState('')
  const [downloadingId, setDownloadingId]   = useState(null)
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [isSubmitting, setIsSubmitting]     = useState(false)
  const [sortCol, setSortCol]               = useState('name')
  const [sortDir, setSortDir]               = useState('asc')
  const passRefs = useRef({})

  const [formData, setFormData] = useState({
    fullName: '', phone_number: '', email: '', instagramHandle: '',
    performanceType: 'Poetry', amount: '', showId: '', slotDate: '',
    slotTime: '02:00 PM', isFirstTimer: 'No',
    video_editing_service: false, paymentStatus: 'pending'
  })

  // body scroll lock for modal
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isModalOpen])

  // ─── load ──────────────────────────────────────────────────────────────
  useEffect(() => { loadData() }, [])

  async function loadData () {
    try {
      setLoading(true)
      const res  = await fetch('/api/admin/performer-passes', { credentials: 'include' })
      const data = await res.json()
      if (res.ok) {
        setBookings(data.bookings || [])
        setShows(data.shows || [])
        autoSelect(data.bookings || [], data.shows || [])
      }
    } catch { /* silent */ }
    finally { setLoading(false) }
  }

  // ─── build sidebar tree ────────────────────────────────────────────────
  const sidebarTree = useMemo(() => {
    const tree = {}
    bookings.forEach(b => {
      const sid = b.show_id
      if (!tree[sid]) tree[sid] = { show: b.show, dates: new Set() }
      tree[sid].dates.add(b.entryPass?.slotDate || 'TBD')
    })
    shows.forEach(s => {
      if (!tree[s.id]) tree[s.id] = { show: s, dates: new Set() }
    })
    return Object.entries(tree)
      .map(([sid, { show, dates }]) => ({
        sid, show,
        name: show?.name || 'Untitled Show',
        dates: [...dates].sort((a, b) => parseDateMs(b) - parseDateMs(a))
      }))
      .sort((a, b) => parseDateMs(b.show?.date) - parseDateMs(a.show?.date))
  }, [bookings, shows])

  // ─── auto-select latest show + date ───────────────────────────────────
  function autoSelect (bkgs, shws) {
    const tree = {}
    bkgs.forEach(b => {
      const sid = b.show_id
      if (!tree[sid]) tree[sid] = { show: b.show, dates: new Set() }
      tree[sid].dates.add(b.entryPass?.slotDate || 'TBD')
    })
    shws.forEach(s => { if (!tree[s.id]) tree[s.id] = { show: s, dates: new Set() } })

    const sorted = Object.entries(tree)
      .sort(([, a], [, b]) => parseDateMs(b.show?.date) - parseDateMs(a.show?.date))
    if (!sorted.length) return
    const [latestSid, { dates }] = sorted[0]
    const latestDate = [...dates].sort((a, b) => parseDateMs(b) - parseDateMs(a))[0] || null
    setSelectedShowId(latestSid)
    setSelectedDate(latestDate)
    setExpandedShows({ [latestSid]: true })
  }

  const toggleExpand = useCallback(sid => {
    setExpandedShows(prev => ({ ...prev, [sid]: !prev[sid] }))
  }, [])

  const selectShowDate = useCallback((sid, date) => {
    setSelectedShowId(sid)
    setSelectedDate(date)
    setSearch('')
  }, [])

  // ─── filtered + sorted rows ────────────────────────────────────────────
  const rows = useMemo(() => {
    let list = bookings.filter(b => {
      if (b.show_id !== selectedShowId) return false
      if ((b.entryPass?.slotDate || 'TBD') !== selectedDate) return false
      if (search) return b.full_name.toLowerCase().includes(search.toLowerCase())
      return true
    })
    list = [...list].sort((a, b) => {
      let va, vb
      if (sortCol === 'name')   { va = a.full_name;              vb = b.full_name }
      else if (sortCol === 'type')   { va = a.performance_type;  vb = b.performance_type }
      else if (sortCol === 'status') { va = a.confirmation_status; vb = b.confirmation_status }
      else { va = a.entryPass?.slotTime || ''; vb = b.entryPass?.slotTime || '' }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ?  1 : -1
      return 0
    })
    return list
  }, [bookings, selectedShowId, selectedDate, search, sortCol, sortDir])

  const cycleSort = useCallback(col => {
    setSortCol(prev => {
      if (prev === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
      else setSortDir('asc')
      return col
    })
  }, [])

  // ─── download pass ─────────────────────────────────────────────────────
  const downloadPass = useCallback(async booking => {
    const node = passRefs.current[booking.id]
    if (!node) return
    try {
      setDownloadingId(booking.id)
      await new Promise(r => setTimeout(r, 150))
      const canvas = await html2canvas(node, { scale: 3, backgroundColor: '#020617', useCORS: true })
      const link   = document.createElement('a')
      link.href     = canvas.toDataURL('image/png', 1.0)
      link.download = `PASS_${booking.booking_id}.png`
      link.click()
    } finally { setDownloadingId(null) }
  }, [])

  // ─── form ──────────────────────────────────────────────────────────────
  const handleManualSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/admin/manual-booking', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) { await loadData(); setIsModalOpen(false); resetForm() }
    } catch { alert('Manual add failed') }
    finally { setIsSubmitting(false) }
  }

  const resetForm = () => setFormData({
    fullName: '', phone_number: '', email: '', instagramHandle: '',
    performanceType: 'Poetry', showId: '', slotDate: '', slotTime: '06:00 PM',
    isFirstTimer: false, video_editing_service: false, paymentStatus: 'pending'
  })

  const currentShow = sidebarTree.find(s => s.sid === selectedShowId)

  // ─── style tokens ──────────────────────────────────────────────────────
  const goldText   = 'bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent'
  const goldBtn    = 'bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black font-bold shadow-[0_0_16px_rgba(212,175,55,0.3)] hover:shadow-[0_0_28px_rgba(212,175,55,0.5)] transition-all duration-300'
  const glassInput = 'bg-white/5 border border-white/10 focus:border-[#D4AF37]/50 focus:bg-white/[0.08] transition-all duration-300 outline-none rounded-xl px-4 py-3 text-sm w-full'

  // ─── render ────────────────────────────────────────────────────────────
  return (
    <div className='flex h-screen bg-[#020617] text-white font-sans overflow-hidden'>
      {/* ambient orbs — fixed, never cause scroll */}
      <div className='fixed -top-32 -left-32 w-96 h-96 bg-blue-600/8 blur-[160px] pointer-events-none z-0' />
      <div className='fixed bottom-0 right-0 w-80 h-80 bg-yellow-600/4 blur-[140px] pointer-events-none z-0' />

      {/* ══════════════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════════════ */}
      <aside className='relative z-10 w-[255px] flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#030b1a]'>
        {/* brand */}
        <div className='px-5 pt-5 pb-4 border-b border-white/[0.06]'>
          <div className='flex items-center gap-2 mb-1.5'>
            <span className='bg-[#D4AF37] text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tight'>
              Admin
            </span>
            <span className='text-white/25 text-[9px] uppercase tracking-widest'>Console</span>
          </div>
          <h1 className={`text-base font-normal leading-tight elsie-regular ${goldText}`}>
            MicTale Registry
          </h1>
        </div>

        {/* register button */}
        <div className='px-4 py-3 border-b border-white/[0.06]'>
          <button
            onClick={() => setIsModalOpen(true)}
            className='w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/20 bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10 transition-all'
          >
            <Plus size={13} /> Register Performer
          </button>
        </div>

        {/* show + date tree */}
        <nav
          className='flex-1 overflow-y-auto py-2 px-2'
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {loading ? (
            <div className='flex justify-center py-10'>
              <Loader2 size={18} className='animate-spin text-[#D4AF37]/30' />
            </div>
          ) : sidebarTree.length === 0 ? (
            <p className='text-center text-white/20 text-xs py-8'>No shows</p>
          ) : (
            sidebarTree.map(({ sid, name, dates }) => {
              const isShowActive = selectedShowId === sid
              return (
                <div key={sid} className='mb-0.5'>
                  {/* show row */}
                  <button
                    onClick={() => {
                      toggleExpand(sid)
                      // also expand and select first date if not already active
                      if (!isShowActive && dates.length > 0) selectShowDate(sid, dates[0])
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                      isShowActive
                        ? 'text-white bg-white/5'
                        : 'text-white/45 hover:text-white/75 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className='text-white/25 flex-shrink-0'>
                      {expandedShows[sid]
                        ? <ChevronDown size={12} />
                        : <ChevronRight size={12} />}
                    </span>
                    <span className='text-xs font-semibold flex-1 truncate leading-snug'>{name}</span>
                    <span className='text-[9px] text-white/20 font-mono flex-shrink-0'>
                      {dates.length}d
                    </span>
                  </button>

                  {/* date sub-list */}
                  {expandedShows[sid] && dates.length > 0 && (
                    <div className='ml-3.5 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-3'>
                      {dates.map(date => {
                        const isActive = isShowActive && selectedDate === date
                        const count = bookings.filter(
                          b => b.show_id === sid && (b.entryPass?.slotDate || 'TBD') === date
                        ).length
                        return (
                          <button
                            key={date}
                            onClick={() => selectShowDate(sid, date)}
                            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-left transition-all ${
                              isActive
                                ? 'bg-[#D4AF37]/12 border border-[#D4AF37]/18'
                                : 'hover:bg-white/[0.04] border border-transparent'
                            }`}
                          >
                            <CalendarDays
                              size={10}
                              className={isActive ? 'text-[#D4AF37] flex-shrink-0' : 'text-white/20 flex-shrink-0'}
                            />
                            <div className='flex-1 min-w-0'>
                              <p className={`text-[11px] font-medium truncate leading-tight ${isActive ? 'text-[#D4AF37]' : 'text-white/45'}`}>
                                {fmtShortDate(date)}
                              </p>
                              <p className='text-[9px] text-white/20'>{fmtWeekday(date)}</p>
                            </div>
                            <span className={`text-[9px] font-mono flex-shrink-0 ${isActive ? 'text-[#D4AF37]/60' : 'text-white/18'}`}>
                              {count}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </nav>

        {/* sidebar footer */}
        <div className='px-4 py-3 border-t border-white/[0.06]'>
          <p className='text-[9px] text-white/15 uppercase tracking-widest text-center'>
            {bookings.length} registrations total
          </p>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════
          MAIN PANEL
      ══════════════════════════════════════════════════════════════════ */}
      <main className='relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden'>
        {/* top bar */}
        <header className='flex-shrink-0 flex items-center justify-between gap-6 px-6 py-3.5 border-b border-white/[0.06] bg-[#020617]/80 backdrop-blur-sm'>
          <div className='min-w-0'>
            {selectedShowId && currentShow ? (
              <>
                <h2 className={`text-sm font-normal ${goldText} elsie-regular leading-tight truncate`}>
                  {currentShow.name}
                </h2>
                <p className='text-[10px] text-white/30 mt-0.5'>
                  {selectedDate ? fmtShortDate(selectedDate) : 'Select a date'}
                  {' · '}
                  <span className='font-mono'>{rows.length}</span> performer{rows.length !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <p className='text-xs text-white/30 italic'>← select a show and date</p>
            )}
          </div>

          <div className='relative flex-shrink-0'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-white/20' size={13} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='Search performer...'
              className='bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-[#D4AF37]/40 w-48 transition-all placeholder:text-white/20'
            />
          </div>
        </header>

        {/* table */}
        <div className='flex-1 overflow-auto' style={{ WebkitOverflowScrolling: 'touch' }}>
          {loading ? (
            <div className='flex flex-col items-center justify-center h-full gap-3'>
              <Loader2 className='animate-spin text-[#D4AF37]' size={26} />
              <p className='text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/50'>Accessing Registry</p>
            </div>
          ) : !selectedShowId || !selectedDate ? (
            <EmptyState
              icon={<Sparkles size={34} className='text-[#D4AF37]/25' />}
              title='Select a show & date'
              sub='Use the sidebar to navigate'
            />
          ) : rows.length === 0 ? (
            <EmptyState
              icon={<Users size={34} className='text-white/10' />}
              title='No performers'
              sub={search ? 'No results for your search' : 'No registrations for this date'}
            />
          ) : (
            <table className='w-full border-collapse text-sm'>
              {/* sticky header */}
              <thead className='sticky top-0 z-10 bg-[#030b1a]'>
                <tr>
                  <Th w='44px'>#</Th>
                  <Th sortable col='name' active={sortCol} dir={sortDir} onSort={cycleSort}>
                    Performer
                  </Th>
                  <Th sortable col='type' active={sortCol} dir={sortDir} onSort={cycleSort} w='130px'>
                    Art Form
                  </Th>
                  <Th w='100px'>Time</Th>
                  <Th w='160px'>Venue</Th>
                  <Th w='200px'>Contact</Th>
                  <Th sortable col='status' active={sortCol} dir={sortDir} onSort={cycleSort} w='115px'>
                    Status
                  </Th>
                  <Th w='140px' center>Action</Th>
                </tr>
                {/* header bottom border */}
                <tr><td colSpan={8} className='p-0'><div className='h-px bg-white/[0.07]' /></td></tr>
              </thead>

              <tbody>
                {rows.map((booking, idx) => {
                  const sc = statusColor(booking.confirmation_status)
                  return (
                    <tr
                      key={booking.id}
                      className='border-b border-white/[0.035] hover:bg-white/[0.022] transition-colors group'
                    >
                      {/* index */}
                      <td className='px-4 py-3'>
                        <span className='text-white/20 font-mono text-[11px]'>{idx + 1}</span>
                      </td>

                      {/* name */}
                      <td className='px-4 py-3'>
                        <p className='text-[13px] font-semibold text-white leading-tight group-hover:text-[#F9E498] transition-colors'>
                          {booking.full_name}
                        </p>
                        <p className='text-[10px] text-white/22 font-mono mt-0.5'>{booking.booking_id}</p>
                      </td>

                      {/* art form */}
                      <td className='px-4 py-3'>
                        <span className='flex items-center gap-1.5 text-xs text-white/55'>
                          <span className='text-sm'>{artIcon(booking.performance_type)}</span>
                          {booking.performance_type || '—'}
                        </span>
                      </td>

                      {/* time */}
                      <td className='px-4 py-3'>
                        <span className='text-xs text-white/45 font-mono tabular-nums'>
                          {booking.entryPass?.slotTime || '—'}
                        </span>
                      </td>

                      {/* venue */}
                      <td className='px-4 py-3'>
                        <span
                          className='text-xs text-white/45 block truncate max-w-[145px]'
                          title={booking.entryPass?.venue}
                        >
                          {booking.entryPass?.venue?.split(',')[0] || '—'}
                        </span>
                      </td>

                      {/* contact */}
                      <td className='px-4 py-3'>
                        <p className='text-xs text-white/45 truncate max-w-[185px]'>{booking.email || '—'}</p>
                        {booking.phone_number && (
                          <p className='text-[10px] text-white/22 mt-0.5 font-mono'>{booking.phone_number}</p>
                        )}
                      </td>

                      {/* status */}
                      <td className='px-4 py-3'>
                        <span
                          className='inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap'
                          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                        >
                          {booking.confirmation_status || 'Approved'}
                        </span>
                      </td>

                      {/* download */}
                      <td className='px-4 py-3 text-center'>
                        <button
                          onClick={() => downloadPass(booking)}
                          disabled={downloadingId === booking.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            downloadingId === booking.id
                              ? 'opacity-50 cursor-not-allowed bg-white/5 text-white/35 border border-white/10'
                              : 'bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black hover:shadow-[0_0_12px_rgba(212,175,55,0.35)]'
                          }`}
                        >
                          {downloadingId === booking.id
                            ? <><Loader2 size={10} className='animate-spin' /> Wait</>
                            : <><Download size={10} /> Pass</>}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* status bar */}
        {rows.length > 0 && (
          <div className='flex-shrink-0 flex items-center justify-between px-6 py-2 border-t border-white/[0.05] bg-[#020617]/60'>
            <p className='text-[10px] text-white/22'>
              <span className='font-mono text-white/40'>{rows.length}</span> performer{rows.length !== 1 ? 's' : ''} · {fmtShortDate(selectedDate)}
            </p>
            <p className='text-[9px] text-white/15 uppercase tracking-widest'>MicTale Admin</p>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════
          HIDDEN PASS NODES (off-screen for html2canvas)
      ══════════════════════════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', top: 0, left: '-9999px', pointerEvents: 'none', zIndex: -1 }}>
        {bookings.map(booking => (
          <div
            key={booking.id}
            ref={el => (passRefs.current[booking.id] = el)}
            style={{
              width: '320px', marginBottom: '20px',
              background: 'linear-gradient(180deg, #0f172a 0%, #020617 100%)',
              borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden'
            }}
          >
            <div style={{ background: 'linear-gradient(90deg, #B8860B, #F9E498, #D4AF37)', padding: '16px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: '950', color: '#000', letterSpacing: '3px', textTransform: 'uppercase' }}>
                Official Performer Pass
              </p>
            </div>
            <div style={{ padding: '30px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <img src='/images/footerlogo.webp' alt='Logo' style={{ height: '45px', margin: '0 auto', display: 'block' }} />
                <div style={{ width: '30px', height: '1px', background: 'rgba(212,175,55,0.4)', margin: '12px auto 0' }} />
              </div>
              <div style={{ background: '#fff', padding: '16px', borderRadius: '20px', display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <QRCodeSVG value={booking.booking_id} size={150} level='H' bgColor='#fff' fgColor='#020617' />
              </div>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ margin: 0, fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' }}>Performer Name</p>
                <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#fff' }}>{booking.full_name}</h3>
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '16px 0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <PassField label='Date'  value={booking.entryPass?.slotDate} />
                  <PassField label='Act'   value={booking.performance_type} align='right' />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <PassField label='Venue' value={(booking.entryPass?.venue || '').split(',')[0]} />
                  <PassField label='Time'  value={booking.entryPass?.slotTime} align='right' />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.3 }}>
                <Ticket size={14} color='#D4AF37' />
                <span style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                  #{(booking.entryPass?.passId || '').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className='fixed inset-0 z-[200] flex items-start justify-center p-4 bg-[#020617]/95 backdrop-blur-md'
          style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}
          onClick={e => { if (e.target === e.currentTarget) { setIsModalOpen(false); resetForm() } }}
        >
          <div className='w-full max-w-2xl my-8'>
            <div className='bg-[#0f172a] rounded-[2.5rem] border border-white/10 shadow-3xl'>
              <div className='p-8 border-b border-white/5 flex justify-between items-center'>
                <div>
                  <h2 className={`text-2xl elsie-regular ${goldText}`}>Artist Onboarding</h2>
                  <p className='text-xs text-white/30 uppercase tracking-widest mt-1'>Manual Entry System</p>
                </div>
                <button
                  onClick={() => { setIsModalOpen(false); resetForm() }}
                  className='p-2 cursor-pointer hover:bg-white/5 rounded-full transition-colors'
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleManualSubmit} className='p-8 space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <FormGroup label='Full Name'>
                    <input required placeholder='E.g. John Doe' className={glassInput}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                  </FormGroup>
                  <FormGroup label='Phone Number'>
                    <input required type='tel' placeholder='+91 ...' className={glassInput}
                      onChange={e => setFormData({ ...formData, phone_number: e.target.value })} />
                  </FormGroup>
                  <FormGroup label='Email Address'>
                    <input type='email' placeholder='artist@mictale.com' className={glassInput}
                      onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </FormGroup>
                  <FormGroup label='Amount Paid (INR)'>
                    <input type='number' placeholder='299' className={glassInput}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                  </FormGroup>
                  <FormGroup label='Instagram Handle'>
                    <div className='relative'>
                      <Instagram className='absolute left-3 top-1/2 -translate-y-1/2 text-white/20' size={14} />
                      <input placeholder='@username' className={`${glassInput} pl-9`}
                        onChange={e => setFormData({ ...formData, instagramHandle: e.target.value })} />
                    </div>
                  </FormGroup>
                  <FormGroup label='Select Show'>
                    <select required className={glassInput}
                      onChange={e => setFormData({ ...formData, showId: e.target.value })}>
                      <option value=''>Choose a Show</option>
                      {shows.map(s => (
                        <option key={s.id} value={s.id} className='bg-[#0f172a]'>{s.name}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup label='Art Form'>
                    <select className={glassInput}
                      onChange={e => setFormData({ ...formData, performanceType: e.target.value })}>
                      {['Poetry', 'Music', 'Storytelling', 'Comedy'].map(opt => (
                        <option key={opt} className='bg-[#0f172a]'>{opt}</option>
                      ))}
                    </select>
                  </FormGroup>
                  <FormGroup label='Performance Date'>
                    <input required type='date' className={`${glassInput} [color-scheme:dark]`}
                      onChange={e => setFormData({ ...formData, slotDate: e.target.value })} />
                  </FormGroup>
                  <FormGroup label='Payment Status'>
                    <select className={glassInput}
                      onChange={e => setFormData({ ...formData, paymentStatus: e.target.value })}>
                      <option className='bg-[#0f172a]'>pending</option>
                      <option className='bg-[#0f172a]'>paid</option>
                    </select>
                  </FormGroup>
                </div>

                <div className='flex flex-wrap gap-4 pt-4 border-t border-white/5'>
                  <label className='flex items-center gap-3 cursor-pointer group'>
                    <input type='checkbox' className='hidden peer'
                      onChange={() => setFormData({ ...formData, isFirstTimer: 'Yes' })} />
                    <div className='w-5 h-5 rounded border border-white/20 peer-checked:bg-[#D4AF37] peer-checked:border-transparent flex items-center justify-center transition-all'>
                      <Star size={12} className='text-black opacity-0 peer-checked:opacity-100' />
                    </div>
                    <span className='text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase'>
                      First Time Performer
                    </span>
                  </label>
                  <label className='flex items-center gap-3 cursor-pointer group ml-auto'>
                    <input type='checkbox' className='hidden peer'
                      onChange={e => setFormData({ ...formData, needsVideo: e.target.checked })} />
                    <div className='w-5 h-5 rounded border border-white/20 peer-checked:bg-blue-500 peer-checked:border-transparent flex items-center justify-center transition-all'>
                      <Video size={12} className='text-white opacity-0 peer-checked:opacity-100' />
                    </div>
                    <span className='text-xs font-bold text-white/40 group-hover:text-white transition-colors uppercase'>
                      Video Recording Required
                    </span>
                  </label>
                </div>

                <button type='submit' disabled={isSubmitting}
                  className={`w-full py-5 rounded-2xl ${goldBtn} mt-4 uppercase tracking-[0.2em] text-sm`}>
                  {isSubmitting ? 'Processing...' : 'Generate & Register Artist'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Table header cell ────────────────────────────────────────────────────────
function Th ({ children, w, center, sortable, col, active, dir, onSort }) {
  const isActive = sortable && col === active
  return (
    <th
      style={{ width: w, minWidth: w }}
      onClick={sortable ? () => onSort(col) : undefined}
      className={`px-4 py-2.5 text-[9px] uppercase tracking-[0.18em] font-bold text-white/28 whitespace-nowrap select-none ${center ? 'text-center' : 'text-left'} ${sortable ? 'cursor-pointer hover:text-white/55' : ''} ${isActive ? 'text-[#D4AF37]/70' : ''}`}
    >
      <span className='inline-flex items-center gap-1'>
        {children}
        {isActive && <ArrowUpDown size={9} className='text-[#D4AF37]' />}
      </span>
    </th>
  )
}

// ─── misc ─────────────────────────────────────────────────────────────────────
function EmptyState ({ icon, title, sub }) {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-3 text-center px-8 py-20'>
      {icon}
      <p className='text-sm font-medium text-white/25'>{title}</p>
      <p className='text-xs text-white/15'>{sub}</p>
    </div>
  )
}

function FormGroup ({ label, children }) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-[10px] font-black uppercase tracking-[0.15em] text-white/30 ml-1'>{label}</label>
      {children}
    </div>
  )
}

function PassField ({ label, value, align = 'left' }) {
  return (
    <div style={{ textAlign: align }}>
      <p style={{ margin: 0, fontSize: '7px', color: '#475569', textTransform: 'uppercase', fontWeight: '950', letterSpacing: '0.5px' }}>{label}</p>
      <p style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 'bold', color: '#fff' }}>{value}</p>
    </div>
  )
}