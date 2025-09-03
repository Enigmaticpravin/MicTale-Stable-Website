
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/app/components/Footer'
import { getPoemBySlug } from '@/app/lib/poems'
import {
  db,
  collection,
  query,
  where,
  orderBy,
  limit as fbLimit,
  getDocs
} from '@/app/lib/firebase'
import { HugeiconsIcon } from '@hugeicons/react'
import { HeartAddFreeIcons, Share01FreeIcons } from '@hugeicons/core-free-icons/index'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = params
  const poem = await getPoemBySlug(slug)
  if (!poem) return { title: 'Poem not found' }

  const title = `${poem.title} — ${poem.author} (${poem.category})`
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/poem/${slug}`
  const description = poem.excerpt || poem.lines?.slice(0, 2).join(' ')

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { card: 'summary_large_image', title, description }
  }
}

function buildShersFromContent(content = '') {
  if (!content) return []
  const raw = content.split(/।\s*|\r?\n/).map(s => s.trim()).filter(Boolean)
  const shers = []
  for (let i = 0; i < raw.length; i += 2) {
    const first = raw[i] || ''
    const second = raw[i + 1] || ''
    shers.push({ first, second })
  }
  return shers
}

function renderLineAsWords(line) {
  const words = String(line || '').split(/\s+/).filter(Boolean)
  return (
    <div
      style={{
        maxWidth: '712px',
        width: '95%',
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap'
      }}
      className="mx-auto"
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="text-[20px] sm:text-2xl md:text-3xl text-center inline-block text-white rozha-class"
        >
          {word}
        </span>
      ))}
    </div>
  )
}

function toPlain(d) {
  if (!d) return d
  const out = {}
  for (const [k, v] of Object.entries(d)) {
    if (v && typeof v.toDate === 'function') {
      try {
        out[k] = v.toDate().toISOString()
      } catch {
        out[k] = String(v)
      }
    } else if (Array.isArray(v)) {
      out[k] = v.map(x => (x && typeof x.toDate === 'function' ? x.toDate().toISOString() : x))
    } else {
      out[k] = v
    }
  }
  return out
}

async function fetchSimilarPoems({ author, category, excludeSlug, limit = 4 }) {
  const poemsRef = collection(db, 'poems')
  const collected = new Map()

  // helper to run a query and add eligible poems
  async function runAndCollect(q) {
    try {
      const snap = await getDocs(q)
      for (const doc of snap.docs) {
        const data = doc.data()
        const slug = data.slug || doc.id
        if (!slug || slug === excludeSlug) continue
        if (collected.has(slug)) continue

        // We only need a few fields for the sidebar
        const plain = toPlain({ id: doc.id, slug, title: data.title, author: data.author || data.poet, excerpt: data.excerpt, createdAt: data.createdAt })
        collected.set(slug, plain)
        if (collected.size >= limit) break
      }
    } catch (e) {
    }
  }

  // 1) same author (most important)
  if (author) {
    const qAuthor = query(poemsRef, where('author', '==', author), orderBy('createdAt', 'desc'), fbLimit(limit))
    await runAndCollect(qAuthor)
  }

  // 2) same category (if still short)
  if (collected.size < limit && category) {
    const qCat = query(poemsRef, where('category', '==', category), orderBy('createdAt', 'desc'), fbLimit(limit))
    await runAndCollect(qCat)
  }

  // 3) fallback recent poems
  if (collected.size < limit) {
    const qRecent = query(poemsRef, orderBy('createdAt', 'desc'), fbLimit(limit * 2))
    await runAndCollect(qRecent)
  }

  // convert map to array sorted by createdAt desc (if available)
  const arr = Array.from(collected.values()).sort((a, b) => {
    const aTs = a.createdAt ? Date.parse(a.createdAt) : 0
    const bTs = b.createdAt ? Date.parse(b.createdAt) : 0
    return bTs - aTs
  }).slice(0, limit)

  return arr
}

export default async function PoemPage({ params }) {
  const { slug } = params
  const poem = await getPoemBySlug(slug)
  if (!poem) notFound()

  const title = poem.title || ''
  const author = poem.author || poem.poet || ''
  const category = (poem.category || '').toString()
  const content = typeof poem.content === 'string' && poem.content
    ? poem.content
    : Array.isArray(poem.lines) ? poem.lines.join('\n') : ''
  const isGhazal = category.toLowerCase().includes('ghazal')
  const shers = isGhazal ? buildShersFromContent(content) : []

  const similar = await fetchSimilarPoems({ author, category, excludeSlug: slug, limit: 4 })

  return (
    <>
      <main className="ml-1 mr-1 mb-1 md:mr-5 md:ml-5 md:mb-5 rounded-2xl min-h-screen bg-slate-950">

        <div className="max-w-5xl mx-auto px-6 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="md:col-span-2">
              <header className="mb-6 md:mb-16">
                <h1 className="text-3xl md:text-4xl rozha-class text-white font-medium mb-4">
                  {title}
                </h1>
                <p className="text-yellow-500 text-base font-medium italic mb-6 md:mb-8">
                  {author}
                </p>
                <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />
              </header>

              {isGhazal ? (
                <section className="space-y-8 md:space-y-12">
                  {shers.map((sher, sherIndex) => (
                    <div key={sherIndex} className="space-y-4 md:space-y-6">
                      <div>{renderLineAsWords(sher.first)}</div>
                      {sher.second && (
                        <div>{renderLineAsWords(sher.second)}</div>
                      )}
                    </div>
                  ))}
                </section>
              ) : (
                <article className="prose prose-invert prose-lg max-w-none">
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">
                    {content}
                  </div>
                </article>
              )}

              <div className="flex items-center gap-6 mt-6 md:mt-20 pt-8 border-t border-slate-800/30">
                <button className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                  <HugeiconsIcon icon={HeartAddFreeIcons} className="w-4 h-4" />
                  <span className="text-sm">Like</span>
                </button>
                <button className="flex cursor-pointer items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors">
                  <HugeiconsIcon icon={Share01FreeIcons} className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Minimal Sidebar */}
            <aside className="md:col-span-1">
              <div className="sticky top-24">
                <div className="border-l border-slate-800 pl-8">
                  <h3 className="text-slate-300 font-medium mb-6 text-sm uppercase tracking-wider">
                    Related
                  </h3>
                  
                  {similar.length === 0 ? (
                    <p className="text-slate-500 text-sm">No related poems found.</p>
                  ) : (
                    <div className="space-y-6">
                      {similar.map((s) => (
                        <Link 
                          key={s.slug} 
                          href={`/poem/${s.slug}`} 
                          className="block group"
                        >
                          <div className="pb-4 border-b border-slate-800/40 last:border-b-0">
                           <h4
  className="relative text-white text-sm font-medium mb-2 leading-snug
             after:content-[''] after:absolute after:left-0 after:bottom-0
             after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300
             hover:after:w-full"
>
  {s.title || 'Untitled'}
</h4>

                            <div className="flex items-center justify-between">
                              <p className="text-slate-400 text-xs">
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

      <Footer />
    </>
  )
}