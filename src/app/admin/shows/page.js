'use client'

import { useState } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {slugify} from '@/app/lib/slugify'

export default function CreateShow() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    seats: 30,
    registration_fee: 0,
    poster_url: ''
  })

  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm({ ...form, [key]: value })
  }

  async function saveShow() {
    setSaving(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Login required')
      return
    }

 const slug = slugify(form.name)

const { error } = await supabase.from('shows').insert({
  ...form,
  slug,
  created_by: user.id
})

    setSaving(false)

    if (error) {
      alert(error.message)
    } else {
      alert('Show created')
      router.push('/treasury')
    }
  }

  return (
    <div className="max-w-xl mx-auto py-20 space-y-4">

      <input placeholder="Show Name" onChange={e => update('name', e.target.value)} className="border p-3 w-full" />

      <textarea placeholder="Description" onChange={e => update('description', e.target.value)} className="border p-3 w-full" />

      <input type="datetime-local" onChange={e => update('date', e.target.value)} className="border p-3 w-full" />

      <input placeholder="Location" onChange={e => update('location', e.target.value)} className="border p-3 w-full" />

      <input type="number" placeholder="Seats" onChange={e => update('seats', e.target.value)} className="border p-3 w-full" />

      <input type="number" placeholder="Fee" onChange={e => update('registration_fee', e.target.value)} className="border p-3 w-full" />

      <input placeholder="Poster URL" onChange={e => update('poster_url', e.target.value)} className="border p-3 w-full" />

      <button
        onClick={saveShow}
        disabled={saving}
        className="bg-black text-white px-6 py-3 rounded w-full"
      >
        {saving ? 'Saving...' : 'Create Show'}
      </button>

    </div>
  )
}