// app/lib/blogs.js
import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"

export async function listBlogSlugs() {
  const blogsCol = collection(db, "blogs")
  const snapshot = await getDocs(blogsCol)

  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      slug: data.slug || doc.id,
      updatedAt: data.updatedAt || null
    }
  })
}
