'use client'

import { useState } from 'react'
import { db, auth } from '@/app/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

export default function PoemSubmissionModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('ghazal')
  const [content, setContent] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!auth.currentUser) {
      alert('You must be logged in to submit.')
      return
    }

    try {
      setLoading(true)
      await addDoc(collection(db, 'submission'), {
        title,
        category,
        content,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || 'Anonymous',
        createdAt: serverTimestamp(),
        status: 'pending',
      })
      alert('Your poem has been submitted!')
      setTitle('')
      setCategory('ghazal')
      setContent('')
      onClose()
    } catch (err) {
      console.error('Error submitting poem:', err)
      alert('Something went wrong, please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative w-full max-w-md bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium text-white">Submit Poem</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none"
              placeholder="Enter title"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:border-gray-600 focus:outline-none"
            >
              <option value="ghazal">Ghazal</option>
              <option value="nazm">Nazm</option>
              <option value="muktak">Muktak</option>
              <option value="english">English Poem</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Content</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full rounded bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:border-gray-600 focus:outline-none resize-none"
              placeholder="Write your poem..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-white text-gray-900 font-medium hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}