// app/book/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || ''
  const q = title.toLowerCase()

  // map some legacy titles to static paths
  const map = {
    'kaalikh (author-signed, paperback)': '/book/kaalikh-author-signed-paperback-by-pravin-gupta',
    'kaalikh (author-signed, revised edition)': '/book/kaalikh-author-signed-paperback-by-pravin-gupta',
    'he is a hero. he raped!': '/book/he-is-a-hero-he-raped-by-anubhav-singh'
  }

  const target = map[q.trim().toLowerCase()] || '/book'
  return NextResponse.redirect(new URL(target, url).toString(), 301)
}
