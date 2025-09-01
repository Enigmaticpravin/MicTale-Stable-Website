// app/poem/[slug]/opengraph-image.js
import { ImageResponse } from 'next/og'
import { getPoemBySlug } from '@/app/lib/poems'   // <-- fixed

export const runtime = 'edge'
export const alt = 'Poem'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { slug } = params
  const poem = await getPoemBySlug(slug)   // <-- fixed
  const title = poem ? `${poem.title} — ${poem.author}` : 'Poem'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0b0b0b',
          color: 'white',
          padding: 64,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 64
        }}
      >
        {title}
      </div>
    ),
    { ...size }
  )
}
