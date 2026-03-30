'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Loader2,
  MapPin,
  Mic2,
  Search,
  ShieldCheck,
  Sparkles,
  UserCircle2
} from 'lucide-react'

const STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  approved: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  checked_in: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
  cancelled: 'bg-rose-500/15 text-rose-200 border-rose-400/30'
}

export default function PerformerPassesPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookings, setBookings] = useState([])
  const [shows, setShows] = useState([])
  const [activeShow, setActiveShow] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const passRefs = useRef({})

  useEffect(() => {
    let cancelled = false

    async function loadPasses() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch('/api/admin/performer-passes', {
          credentials: 'include'
        })

        if (response.status === 401) {
          window.location.href = '/login?redirect=/admin/performer-passes'
          return
        }

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Unable to load performer passes')
        }

        if (!cancelled) {
          setBookings(result.bookings || [])
          setShows(result.shows || [])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load performer passes')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPasses()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()

    return bookings.filter(booking => {
      const matchesShow = activeShow === 'all' || booking.show_id === activeShow
      if (!matchesShow) return false
      if (!query) return true

      const haystack = [
        booking.full_name,
        booking.email,
        booking.phone_number,
        booking.performance_type,
        booking.booking_id,
        booking.show?.name
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [activeShow, bookings, search])

  const summary = useMemo(() => {
    return filteredBookings.reduce(
      (acc, booking) => {
        acc.total += 1
        acc[booking.confirmation_status || 'pending'] += 1
        return acc
      },
      { total: 0, pending: 0, approved: 0, checked_in: 0, cancelled: 0 }
    )
  }, [filteredBookings])

  async function updateStatus(bookingId, confirmationStatus) {
    try {
      setUpdatingId(bookingId)
      const response = await fetch('/api/admin/performer-passes', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookingId, confirmationStatus })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Unable to update performer status')
      }

      setBookings(current =>
        current.map(booking =>
          booking.id === bookingId ? result.booking : booking
        )
      )
    } catch (err) {
      setError(err.message || 'Unable to update performer status')
    } finally {
      setUpdatingId(null)
    }
  }

  async function downloadPass(booking) {
    const node = passRefs.current[booking.id]
    if (!node) return

    try {
      setDownloadingId(booking.id)
      const canvas = await html2canvas(node, {
        backgroundColor: '#020617',
        scale: 2,
        useCORS: true
      })

      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `${booking.entryPass.passId}-entry-pass.png`
      link.click()
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b_0%,#020617_55%,#01020a_100%)] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100">
              <Sparkles className="h-3.5 w-3.5" />
              Admin Entry Passes
            </div>
            <h1 className="text-3xl font-black tracking-tight md:text-5xl">
              Auto-generated performer entry passes
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
              Every registration now turns into a ready-to-download entry pass. Filter by show, approve performers, and download each pass as a shareable image for gate access.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:min-w-[320px]">
            <SummaryCard label="Total" value={summary.total} />
            <SummaryCard label="Approved" value={summary.approved} />
            <SummaryCard label="Pending" value={summary.pending} />
            <SummaryCard label="Checked In" value={summary.checked_in} />
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search by performer, email, booking ID, or show"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </label>

          <select
            value={activeShow}
            onChange={event => setActiveShow(event.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none backdrop-blur-xl"
          >
            <option value="all" className="bg-slate-900">All shows</option>
            {shows.map(show => (
              <option key={show.id} value={show.id} className="bg-slate-900">
                {show.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6 text-sm text-rose-100">
            {error}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <h2 className="text-xl font-bold">No performer registrations yet</h2>
            <p className="mt-2 text-sm text-slate-400">
              Once someone books a performance slot for one of your shows, their entry pass will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map(booking => (
              <article
                key={booking.id}
                className="grid gap-5 rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1.15fr_0.85fr]"
              >
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-slate-300">
                        <Mic2 className="h-3.5 w-3.5" />
                        {booking.show?.name || 'MicTale Open Mic'}
                      </div>
                      <h2 className="text-2xl font-bold">{booking.full_name}</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Booking ID: <span className="font-mono text-slate-200">{booking.booking_id}</span>
                      </p>
                    </div>

                    <span className={`inline-flex h-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${STATUS_STYLES[booking.confirmation_status || 'pending']}`}>
                      {(booking.confirmation_status || 'pending').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoTile icon={UserCircle2} label="Contact" value={booking.email || 'Not provided'} secondary={booking.phone_number || 'No phone'} />
                    <InfoTile icon={Mic2} label="Performance" value={booking.performance_type || 'Open mic act'} secondary={booking.first_time === 'Yes' ? 'First time performer' : 'Returning performer'} />
                    <InfoTile icon={CalendarDays} label="Slot" value={booking.entryPass.slotDate} secondary={booking.entryPass.slotTime} />
                    <InfoTile icon={MapPin} label="Venue" value={booking.show?.location || 'Venue to be announced'} secondary={booking.instagram_handle || 'Instagram not provided'} />
                  </div>

                  {booking.special_requirements ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Special requirements</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{booking.special_requirements}</p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => updateStatus(booking.id, 'approved')}
                      disabled={updatingId === booking.id || booking.confirmation_status === 'approved'}
                      className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {updatingId === booking.id ? 'Saving...' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(booking.id, 'checked_in')}
                      disabled={updatingId === booking.id || booking.confirmation_status === 'checked_in'}
                      className="rounded-full border border-sky-300/30 bg-sky-400/10 px-5 py-2 text-sm font-bold text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark Checked In
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadPass(booking)}
                      disabled={downloadingId === booking.id}
                      className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {downloadingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      Download Pass
                    </button>
                  </div>
                </div>

                <div
                  ref={node => {
                    passRefs.current[booking.id] = node
                  }}
                  className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,#020617_0%,#0f172a_45%,#1e293b_100%)] p-6"
                >
                  <div className="absolute inset-x-10 top-0 h-24 rounded-full bg-amber-300/10 blur-3xl" />
                  <div className="absolute -right-8 bottom-10 h-24 w-24 rounded-full bg-sky-400/10 blur-3xl" />

                  <div className="relative">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-100/80">MicTale Entry Pass</p>
                        <h3 className="mt-2 text-2xl font-black tracking-tight">{booking.entryPass.performerName}</h3>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right">
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Pass ID</p>
                        <p className="mt-1 font-mono text-sm text-white">{booking.entryPass.passId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <PassRow label="Show" value={booking.entryPass.showName} />
                      <PassRow label="Act" value={booking.entryPass.performanceType} />
                      <PassRow label="Date" value={booking.entryPass.slotDate} />
                      <PassRow label="Time" value={booking.entryPass.slotTime} />
                      <PassRow label="Venue" value={booking.entryPass.venue} />
                      <PassRow label="Status" value={(booking.entryPass.status || 'pending').replace('_', ' ')} />
                    </div>

                    <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">Issued</p>
                        <p className="mt-1 text-sm text-slate-200">{booking.entryPass.issuedAt}</p>
                      </div>
                      <div className="rounded-2xl border border-dashed border-white/20 px-4 py-3 font-mono text-xs tracking-[0.3em] text-slate-200">
                        {booking.entryPass.passId.slice(-8)}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  )
}

function InfoTile({ icon: Icon, label, value, secondary }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em]">{label}</p>
      </div>
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{secondary}</p>
    </div>
  )
}

function PassRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-5 text-white">{value}</p>
    </div>
  )
}
