// app/api/blogs/route.js
import { setDoc, doc } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export async function POST(request) {
  try {
    const blogData = await request.json()

    if (!blogData?.slug) {
      return new Response(JSON.stringify({ error: 'slug required' }), { status: 400 })
    }

    await setDoc(doc(db, 'blogs', blogData.slug), blogData)

    return new Response(JSON.stringify({ ok: true, slug: blogData.slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
