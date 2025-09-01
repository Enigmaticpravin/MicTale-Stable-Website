// app/treasury/TreasuryClient.js
'use client'
import { useState } from 'react'

export default function TreasuryClient({ initialPoems = [] }) {
  const [poems, setPoems] = useState(initialPoems)

  return (
    <div>
      {poems.map(p => (
        <article key={p.slug || p.id}>
          <h3>{p.title}</h3>
          <p>{p.author}</p>
          <time dateTime={p.createdAt}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</time>
          <pre style={{whiteSpace: 'pre-wrap'}}>{(p.lines||[]).join('\n')}</pre>
        </article>
      ))}
    </div>
  )
}
