'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { slugify } from '@/app/lib/slugify'

export default function CreateShow() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    seats: 30,
    registration_fee: 0,
    poster_url: ''
  })

  const [isRecurring, setIsRecurring] = useState(false)
  const [recurringDays, setRecurringDays] = useState([])
  const [weeks, setWeeks] = useState(4)
  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleDay(day) {
    setRecurringDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  function generateDates(time, weeks, days) {
    const dates = []
    const now = new Date()

    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date()
      d.setDate(now.getDate() + i)
      const day = d.getDay()
      const match = (days.includes('sat') && day === 6) || (days.includes('sun') && day === 0)

      if (match) {
        const [h, m] = time.split(':')
        d.setHours(h, m, 0)
        if (d > now) dates.push(new Date(d).toISOString())
      }
    }
    return dates
  }

  async function saveShow() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Login required')
      setSaving(false)
      return
    }

    const slug = slugify(form.name)
    let available_dates = []

    if (isRecurring) {
      if (!form.time || recurringDays.length === 0) {
        alert('Select time & days')
        setSaving(false)
        return
      }
      available_dates = generateDates(form.time, weeks, recurringDays)
    } else {
      if (!form.date) {
        alert('Select date')
        setSaving(false)
        return
      }
      const selectedDate = new Date(form.date)
      if (selectedDate <= new Date()) {
        alert('Date must be in future')
        setSaving(false)
        return
      }
      available_dates = [selectedDate.toISOString()]
    }

    available_dates = available_dates.filter(d => new Date(d) > new Date())

    if (available_dates.length === 0) {
      alert('No valid future dates')
      setSaving(false)
      return
    }

    const { error } = await supabase.from('shows').insert({
      ...form,
      seats: Number(form.seats),
      registration_fee: Number(form.registration_fee),
      slug,
      created_by: user.id,
      available_dates,
      recurring: isRecurring
    })

    setSaving(false)
    if (error) {
      alert(error.message)
    } else {
      alert(`Show created with ${available_dates.length} upcoming slots`)
      router.push('/treasury')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-gray-900"
  const labelClass = "block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5 ml-1"

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="px-8 py-10">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create New Show</h1>
            <p className="text-gray-500 mt-2">Fill in the details to host your next event</p>
          </header>

          <div className="space-y-6">
            {/* Basic Info Section */}
            <div>
              <label className={labelClass}>Show Identity</label>
              <input
                placeholder="Ex: Late Night Comedy"
                onChange={e => update('name', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                placeholder="What is this show about?"
                onChange={e => update('description', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{isRecurring ? 'Start Time' : 'Date & Time'}</label>
                {!isRecurring ? (
                  <input
                    type="datetime-local"
                    onChange={e => update('date', e.target.value)}
                    className={inputClass}
                  />
                ) : (
                  <input
                    type="time"
                    onChange={e => update('time', e.target.value)}
                    className={inputClass}
                  />
                )}
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  placeholder="Venue name or address"
                  onChange={e => update('location', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Seating Capacity</label>
                <input
                  type="number"
                  placeholder="30"
                  onChange={e => update('seats', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Registration Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={e => update('registration_fee', e.target.value)}
                    className={`${inputClass} pl-8`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Poster Image URL</label>
              <input
                placeholder="https://..."
                onChange={e => update('poster_url', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* Recurring Logic Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-5">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={() => setIsRecurring(!isRecurring)}
                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all cursor-pointer"
                  />
                </div>
                <span className="ml-3 font-medium text-gray-700 group-hover:text-black transition-colors">
                  Enable Recurring Schedule
                </span>
              </label>

              {isRecurring && (
                <div className="space-y-5 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <span className={labelClass}>Select Days</span>
                    <div className="flex gap-2">
                      {['sat', 'sun'].map(day => (
                        <button
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                            recurringDays.includes(day)
                              ? 'bg-black text-white border-black shadow-md'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {day === 'sat' ? 'Saturday' : 'Sunday'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Duration (Weeks)</label>
                    <input
                      type="number"
                      value={weeks}
                      onChange={e => setWeeks(Number(e.target.value))}
                      className={inputClass}
                    />
                  </div>

                  {form.time && recurringDays.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-center">
                      <p className="text-sm font-medium text-blue-600">
                        ✨ This will automatically create <span className="font-bold underline">{recurringDays.length * weeks}</span> show slots
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={saveShow}
              disabled={saving}
              className="group relative w-full bg-black text-white font-semibold py-4 rounded-2xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 mt-4 shadow-xl shadow-black/10"
            >
              <span className={saving ? 'opacity-0' : 'opacity-100'}>
                Create Show
              </span>
              {saving && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}