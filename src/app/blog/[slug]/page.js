import { notFound } from 'next/navigation'
import { db, doc, getDoc, collection, query, where, orderBy, limit, getDocs } from '@/app/lib/firebase'
import BlogDisplayPage from '@/app/components/BlogDisplayPage'

// ✅ Helper for Firestore date fields
function safeDate(dateField) {
  return dateField?.toDate?.()?.toISOString?.() || new Date().toISOString()
}

function makeAbsoluteUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (/^[a-z]+:\/\//i.test(path)) return null
  const base = (process.env.SITE_URL || 'https://mictale.in').replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}

// ✅ Fetch similar blogs
async function getSimilarBlogs(currentBlog, currentBlogId) {
  try {
    const similarBlogs = []

    if (currentBlog.tags && Array.isArray(currentBlog.tags) && currentBlog.tags.length > 0) {
      try {
        const tagQuery = query(
          collection(db, 'blogs'),
          where('tags', 'array-contains-any', currentBlog.tags.slice(0, 2)),
          orderBy('createdAt', 'desc'),
          limit(8)
        )
        const tagQuerySnapshot = await getDocs(tagQuery)

        tagQuerySnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId) {
            const blogData = docSnap.data()
            if (blogData.published !== false) {
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: safeDate(blogData.createdAt),
                updatedAt: safeDate(blogData.updatedAt || blogData.createdAt)
              })
            }
          }
        })
      } catch (tagError) {
        console.warn('Tag query failed:', tagError.message)
      }
    }

    if (similarBlogs.length < 4) {
      try {
        const recentQuery = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc'),
          limit(10)
        )
        const recentSnapshot = await getDocs(recentQuery)

        recentSnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId && !similarBlogs.some(blog => blog.id === docSnap.id)) {
            const blogData = docSnap.data()
            if (blogData.published !== false && similarBlogs.length < 4) {
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: safeDate(blogData.createdAt),
                updatedAt: safeDate(blogData.updatedAt || blogData.createdAt)
              })
            }
          }
        })
      } catch (recentError) {
        console.warn('Recent blogs query failed:', recentError.message)
      }
    }

    if (similarBlogs.length === 0) {
      try {
        const fallbackQuery = query(collection(db, 'blogs'), limit(6))
        const fallbackSnapshot = await getDocs(fallbackQuery)

        fallbackSnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId && similarBlogs.length < 4) {
            const blogData = docSnap.data()
            if (blogData.published !== false) {
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: safeDate(blogData.createdAt),
                updatedAt: safeDate(blogData.updatedAt || blogData.createdAt)
              })
            }
          }
        })
      } catch (fallbackError) {
        console.warn('Fallback query failed:', fallbackError.message)
      }
    }

    return similarBlogs.slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar blogs:', error)
    return []
  }
}

export async function generateMetadata({ params }) {
  const { slug } = params

  try {
    const docRef = doc(db, 'blogs', slug)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return {
        title: 'Blog Not Found | Mictale',
        description: 'The requested blog post could not be found.'
      }
    }

    const blog = docSnap.data()
    const siteUrl = (process.env.SITE_URL || 'https://mictale.in').replace(/\/$/, '')
    const pageUrl = `${siteUrl}/blog/${slug}`
    const publishedTime = safeDate(blog.createdAt)
    const modifiedTime = safeDate(blog.updatedAt || blog.createdAt)
    const description = blog.content ? blog.content.substring(0, 160).trim() + '...' : ''

    let cover = null
    try {
      cover = makeAbsoluteUrl(blog.coverImage)
    } catch {
      cover = null
    }

    return {
      title: `${blog.title} | Mictale`,
      description: description,
      keywords: blog.tags ? blog.tags.join(', ') : '',
      authors: [{ name: blog.author ?? 'Mictale' }],
      creator: blog.author ?? 'Mictale',
      publisher: 'Mictale',

      openGraph: {
        type: 'article',
        title: blog.title,
        description: description,
        publishedTime,
        modifiedTime,
        authors: blog.author ? [blog.author] : [],
        url: pageUrl,
        siteName: 'Mictale',
        locale: 'en_US',
        images: cover ? [cover] : []
      },

      twitter: {
        card: cover ? 'summary_large_image' : 'summary',
        title: blog.title,
        description: description,
        creator: '@mictale',
        site: '@mictale',
        images: cover ? [cover] : []
      },

      alternates: { canonical: pageUrl },

      robots: {
        index: blog.published !== false,
        follow: true,
        googleBot: {
          index: blog.published !== false,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1
        }
      }
    }
  } catch (error) {
    console.error('[generateMetadata] error', error)
    return {
      title: 'Blog | Mictale',
      description: 'Read our latest blog posts on literature, writing, and more.'
    }
  }
}

export default async function BlogPage({ params }) {
  const { slug } = params

  try {
    const docRef = doc(db, 'blogs', slug)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) notFound()

    const blogData = docSnap.data()
    const blog = {
      id: docSnap.id,
      ...blogData,
      createdAt: safeDate(blogData.createdAt),
      updatedAt: safeDate(blogData.updatedAt || blogData.createdAt)
    }

    if (blog.published === false) notFound()

    const similarBlogs = await getSimilarBlogs(blog, docSnap.id)

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: blog.title,
              description: blog.excerpt,
              image: blog.coverImage ? [blog.coverImage] : [],
              datePublished: blog.createdAt,
              dateModified: blog.updatedAt,
              author: { "@type": "Person", name: blog.author },
              publisher: {
                "@type": "Organization",
                name: "Mictale",
                url: "https://mictale.in",
                logo: {
                  "@type": "ImageObject",
                  url: "https://i.imgur.com/YFpScQU.png"
                }
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://mictale.in/blog/${slug}`
              },
              keywords: blog.tags ? blog.tags.join(', ') : '',
              articleSection: "Blog",
              wordCount: blog.content ? blog.content.split(' ').length : 0,
              url: `https://mictale.in/blog/${slug}`
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://mictale.in" },
                { "@type": "ListItem", position: 2, name: blog.title, item: `https://mictale.in/blog/${slug}` }
              ]
            })
          }}
        />

        {similarBlogs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ItemList",
                itemListElement: similarBlogs.map((b, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `https://mictale.in/blog/${b.slug}`
                }))
              })
            }}
          />
        )}

        <BlogDisplayPage blog={blog} similarBlogs={similarBlogs} />
      </>
    )
  } catch (error) {
    console.error('Error fetching blog:', error)
    notFound()
  }
}

export async function generateStaticParams() {
  try {
    const snapshot = await getDocs(collection(db, 'blogs'))
    const paths = []
    snapshot.forEach((docSnap) => {
      const blog = docSnap.data()
      if (blog.published !== false) {
        paths.push({ slug: docSnap.id })
      }
    })
    return paths
  } catch {
    return []
  }
}
