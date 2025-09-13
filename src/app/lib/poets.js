import { db } from './firebase'
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
