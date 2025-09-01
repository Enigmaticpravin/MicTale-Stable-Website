import { NextResponse } from 'next/server'
import { db, collection, addDoc, doc, setDoc, getDocs, query, orderBy, where, limit } from '@/app/lib/firebase'


export async function GET() {
  const baseUrl = 'https://mictale.in'
  
  try {
    const blogsQuery = query(
      collection(db, 'blogs'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    )
    
    const snapshot = await getDocs(blogsQuery)
    const blogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString()
    }))

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Mictale Blog</title>
    <description>Latest articles on literature, writing, and creative expression</description>
    <link>${baseUrl}/blog</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Mictale Content Management System</generator>
    <webMaster>contact@mictale.in (Mictale Team)</webMaster>
    <managingEditor>contact@mictale.in (Mictale Team)</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} Mictale. All rights reserved.</copyright>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Mictale Blog</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${blogs.map(blog => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${blog.excerpt || blog.content.substring(0, 200) + '...'}]]></description>
      <content:encoded><![CDATA[${blog.content.replace(/\n\n/g, '</p><p>').replace(/^/, '<p>').replace(/$/, '</p>')}]]></content:encoded>
      <link>${baseUrl}/blog/${blog.id}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.id}</guid>
      <author>contact@mictale.in (${blog.author})</author>
      <category><![CDATA[${blog.tags ? blog.tags.join(', ') : 'Blog'}]]></category>
      <pubDate>${new Date(blog.createdAt).toUTCString()}</pubDate>
      ${blog.coverImage ? `<enclosure url="${blog.coverImage}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

    return new Response(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}