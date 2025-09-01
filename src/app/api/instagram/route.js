// app/api/instagram/route.js
import { NextResponse } from 'next/server'

const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN

const MEDIA_FIELDS = [
  'id',
  'caption',
  'media_type',
  'media_url',
  'thumbnail_url',
  'permalink',
  'timestamp'
].join(',')

async function fetchInstagramPage(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Instagram API error ${res.status}: ${text}`)
  }
  return res.json()
}

export async function GET(req) {
  try {
    if (!INSTAGRAM_USER_ID || !INSTAGRAM_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN env vars' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit') || 50
    const maxItems = parseInt(searchParams.get('max') || '1000', 10)

    let url = `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=${MEDIA_FIELDS}&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=${limit}`

    const allData = []
    let loopSafety = 0
    const MAX_LOOPS = 25

    while (url && loopSafety < MAX_LOOPS && allData.length < maxItems) {
      const json = await fetchInstagramPage(url)

      if (!Array.isArray(json.data)) break

      allData.push(...json.data)

      if (allData.length >= maxItems) break

      url = json.paging && json.paging.next ? json.paging.next : null
      loopSafety++
    }

    const normalized = allData.map((item) => ({
      id: item.id,
      caption: item.caption ?? '',
      media_type: item.media_type,
      media_url: item.media_url ?? item.thumbnail_url ?? null,
      permalink: item.permalink,
      timestamp: item.timestamp
    }))

    return NextResponse.json({ data: normalized })
  } catch (err) {
    console.error('Instagram fetch error', err)
    return NextResponse.json({ error: err.message || 'unknown' }, { status: 500 })
  }
}
