import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { db, doc, getDoc, collection, query, where, orderBy, limit, getDocs } from '@/app/lib/firebase'
import BlogDisplayPage from '@/app/components/BlogDisplayPage'


function makeAbsoluteUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (/^[a-z]+:\/\//i.test(path)) return null
  const base = (process.env.SITE_URL || 'https://mictale.in').replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}

async function getSimilarBlogs(currentBlog, currentBlogId) {
  try {
    console.log('Fetching similar blogs for:', currentBlogId)
    const similarBlogs = []
    
    if (currentBlog.tags && Array.isArray(currentBlog.tags) && currentBlog.tags.length > 0) {
      try {
        console.log('Searching by tags:', currentBlog.tags.slice(0, 2))
        const tagQuery = query(
          collection(db, 'blogs'),
          where('tags', 'array-contains-any', currentBlog.tags.slice(0, 2)),
          orderBy('createdAt', 'desc'),
          limit(8)
        )
        
        const tagQuerySnapshot = await getDocs(tagQuery)
        console.log('Found blogs by tags:', tagQuerySnapshot.size)
        
        tagQuerySnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId) {
            const blogData = docSnap.data()
            if (blogData.published !== false) {
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: blogData.updatedAt?.toDate?.()?.toISOString() || blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
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
        console.log('Fetching recent blogs to fill remaining slots')
        const recentQuery = query(
          collection(db, 'blogs'),
          orderBy('createdAt', 'desc'),
          limit(10)
        )
        
        const recentSnapshot = await getDocs(recentQuery)
        console.log('Found recent blogs:', recentSnapshot.size)
        
        recentSnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId && !similarBlogs.some(blog => blog.id === docSnap.id)) {
            const blogData = docSnap.data()
            if (blogData.published !== false && similarBlogs.length < 4) { // Only include published blogs
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: blogData.updatedAt?.toDate?.()?.toISOString() || blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
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
        console.log('Using fallback: simple collection query')
        const fallbackQuery = query(
          collection(db, 'blogs'),
          limit(6)
        )
        
        const fallbackSnapshot = await getDocs(fallbackQuery)
        console.log('Found fallback blogs:', fallbackSnapshot.size)
        
        fallbackSnapshot.forEach((docSnap) => {
          if (docSnap.id !== currentBlogId && similarBlogs.length < 4) {
            const blogData = docSnap.data()
            if (blogData.published !== false) { // Only include published blogs
              similarBlogs.push({
                id: docSnap.id,
                slug: docSnap.id,
                ...blogData,
                createdAt: blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: blogData.updatedAt?.toDate?.()?.toISOString() || blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              })
            }
          }
        })
      } catch (fallbackError) {
        console.warn('Fallback query failed:', fallbackError.message)
      }
    }
    
    const result = similarBlogs.slice(0, 4)
    console.log('Returning similar blogs count:', result.length)
    return result
    
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
    const publishedTime =
      blog.createdAt?.toDate?.()?.toISOString?.() || new Date().toISOString()
    const modifiedTime =
      blog.updatedAt?.toDate?.()?.toISOString?.() || publishedTime
    const description =
      blog.excerpt ??
      (blog.content ? blog.content.substring(0, 160).trim() + '...' : '')

    let cover = null
    try {
      cover = makeAbsoluteUrl(blog.coverImage)
    } catch (e) {
      console.error('[generateMetadata] cover parse error', e)
      cover = null
    }

    const metadata = {
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
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
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

      other: {
        'article:published_time': publishedTime,
        'article:modified_time': modifiedTime,
        'article:author': blog.author ?? 'Mictale',
        'article:section': 'Blog',
        'article:tag': blog.tags ? blog.tags.join(', ') : ''
      },

      alternates: {
        canonical: pageUrl
      },

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

    return metadata
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
    
    if (!docSnap.exists()) {
      notFound()
    }
    
    const blogData = docSnap.data()
    
    const blog = {
      id: docSnap.id,
      ...blogData,
      createdAt: blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: blogData.updatedAt?.toDate?.()?.toISOString() || blogData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }
    
    if (blog.published === false) {
      notFound()
    }
    
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
              author: {
                "@type": "Person",
                name: blog.author,
                url: `https://mictale.in/author/${blog.author.toLowerCase().replace(/\s+/g, '-')}`
              },
              publisher: {
                "@type": "Organization",
                name: "Mictale",
                url: "https://mictale.in",
                logo: {
                  "@type": "ImageObject",
                  url: "https://mictale.in/logo.png"
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
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://mictale.in"
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: "https://mictale.in/blog"
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: blog.title,
                  item: `https://mictale.in/blog/${slug}`
                }
              ]
            })
          }}
        />
        
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
    return []
  } catch (error) {
    return []
  }
}