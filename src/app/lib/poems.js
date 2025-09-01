// lib/poems.js
import { db, collection, doc, getDoc, getDocs, setDoc, query, orderBy, limit, where } from '@/app/lib/firebase'
import { toPlain } from '@/app/lib/firestorePlain'

const poemsCol = collection(db, 'poems')

export async function getPoemBySlug(slug) {
  const one = await getDoc(doc(poemsCol, slug))
  if (one.exists()) return toPlain({ id: one.id, ...one.data() })

  const q = query(poemsCol, where('slug', '==', slug), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return toPlain({ id: snap.docs[0].id, ...snap.docs[0].data() })
}

export async function listPoemSlugs(max = 5000) {
  const q = query(poemsCol, orderBy('updatedAt', 'desc'), limit(max))
  const snap = await getDocs(q)
  return snap.docs.map(d => {
    const data = d.data()
    return {
      slug: String(data.slug || d.id),
      updatedAt: toPlain(data.updatedAt) || new Date().toISOString(),
    }
  })
}

export async function upsertPoem(poem) {
  const ref = doc(poemsCol, poem.slug)
  await setDoc(ref, { ...poem }, { merge: true })
  const fresh = await getDoc(ref)
  return toPlain({ id: fresh.id, ...fresh.data() })
}
