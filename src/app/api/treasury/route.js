import { adminDb } from '@/app/lib/firebaseAdmin'

const PAGE_SIZE = 10

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const cursor = searchParams.get('cursor')

  let q = adminDb.collection('poems').orderBy('createdAt', 'desc').limit(PAGE_SIZE)

  if (cursor) {
    const snapshot = await adminDb.collection('poems').doc(cursor).get()
    if (snapshot.exists) {
      q = adminDb.collection('poems')
        .orderBy('createdAt', 'desc')
        .startAfter(snapshot)
        .limit(PAGE_SIZE)
    }
  }

  const snap = await q.get()
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  const lastDoc = snap.docs[snap.docs.length - 1]
  const nextCursor = lastDoc ? lastDoc.id : null

  return Response.json({ docs, nextCursor })
}
