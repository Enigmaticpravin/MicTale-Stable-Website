'use client'

import { useState } from 'react'

export default function AddPoetPage() {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()

    if (!name || !bio || !imageUrl) {
      setMessage('Please fill all fields')
      return
    }

    try {
      setLoading(true)
      setMessage('')

      const res = await fetch('/api/poets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image: imageUrl }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error saving poet')

      setMessage('Poet added successfully!')
      setName('')
      setBio('')
      setImageUrl('')
    } catch (err) {
      console.error(err)
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Poet</h1>

      {message && <p className="mb-4 text-sm text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <textarea
          placeholder="Bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Saving...' : 'Save Poet'}
        </button>
      </form>
    </div>
  )
}