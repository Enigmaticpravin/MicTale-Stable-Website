import { notFound } from 'next/navigation'
import BlogDisplayPage from '@/app/components/BlogDisplayPage'
import { getBlogBySlug, getSimilarBlogs, getAllPublishedBlogSlugs } from '@/app/lib/database';


function makeAbsoluteUrl(path) {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  if (/^[a-z]+:\/\//i.test(path)) return null
  const base = (process.env.SITE_URL || 'https://mictale.in').replace(/\/$/, '')
  return `${base}/${path.replace(/^\//, '')}`
}

function safeDate(dateField) {
  return dateField?.toDate?.().toISOString?.() || new Date().toISOString();
}

export async function generateMetadata({ params }) {
 const resolvedParams = await params;
  const { slug } = resolvedParams;
  try {
  const blog = await getBlogBySlug(params.slug);
    const siteUrl = (process.env.SITE_URL || 'https://mictale.in').replace(/\/$/, '')
    const pageUrl = `${siteUrl}/blog/${slug}`
    const publishedTime = safeDate(blog.createdAt)
    const modifiedTime = safeDate(blog.updatedAt || blog.createdAt)
    const description = blog.content ? blog.content.substring(0, 160).trim() + '...' : ''
    const cover = makeAbsoluteUrl(blog.coverImage)

    return {
      title: `${blog.title} | Mictale`,
      description,
      keywords: blog.tags ? blog.tags.join(', ') : '',
      authors: [{ name: blog.author ?? 'Mictale' }],
      creator: blog.author ?? 'Mictale',
      publisher: 'Mictale',
      openGraph: {
        type: 'article',
        title: blog.title,
        description,
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
        description,
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
    const blog = await getBlogBySlug(params.slug);

  const similarBlogs = await getSimilarBlogs(blog, blog.id);

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
                logo: { "@type": "ImageObject", url: "https://i.imgur.com/YFpScQU.png" }
              },
              mainEntityOfPage: { "@type": "WebPage", "@id": `https://mictale.in/blog/${slug}` },
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
 return getAllPublishedBlogSlugs();
}
