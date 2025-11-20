import { db, getDocs } from './firebase-db'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')     
    .replace(/--+/g, '-') 
}

export async function addPoet({ name, bio, image }) {
  if (!name || !bio || !image) {
    throw new Error('Missing fields')
  }

  const slug = slugify(name)

  const poetsRef = collection(db, 'poets')
  const docRef = await addDoc(poetsRef, {
    name,
    slug,
    bio,
    image,
    createdAt: serverTimestamp(),
  })

  return { id: docRef.id, slug }
}

export async function listPoetSlugs() {
  const poetsCol = collection(db, "poets")
  const snapshot = await getDocs(poetsCol)

  return snapshot.docs.map(doc => {
    const data = doc.data()
    const createdAt = data.createdAt?.toDate?.() || null
    const updatedAt = data.createdAt?.toDate?.() || null
    return {
      slug: data.slug || doc.id,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date()
    }
  })
}