import { supabasePublic } from "@/app/lib/supabase/public"

function toPlain(v) {
  return v ? JSON.parse(JSON.stringify(v)) : null
}


function toMillis(v) {
  if (!v) return 0
  const ms = Date.parse(v)
  return Number.isFinite(ms) ? ms : 0
}

export async function getPoetBySlug(slug) {
  const supabase = supabasePublic

  const { data, error } = await supabase
    .from('poets')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Supabase error:', error)
    throw new Error(error.message)
  }

  return data
}

export async function getPoemsByAuthor(authorName) {
  const supabase = supabasePublic

  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('author', authorName)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    throw new Error(error.message)
  }

  return (data || []).map(p => ({
    ...p,
    createdAt: p.created_at
  }))
}

function extractMatlaFromDoc(data) {
  let lines = []

  if (Array.isArray(data.lines)) lines = data.lines
  else if (typeof data.lines === 'string') lines = data.lines.split('\n')
  else if (typeof data.content === 'string') lines = data.content.split('। ')

  const first = (lines[0] || '').trim()
  const second = (lines[1] || '').trim()

  if (!first || !second) return null

  return [first, second]
}

export async function getLatestPoems(limit = 10) {
  const supabase = supabasePublic

  const { data } = await supabase
    .from('poems')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)


  return (data || []).map(toPlain)
}

export async function getLatestGhazals(limit = 4) {
  const supabase = supabasePublic

  const { data } = await supabase
    .from('poems')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)

  const ghazals = (data || []).reduce((acc, d) => {
    if (String(d.category || '').toLowerCase() !== 'ghazal') return acc

    const matla = extractMatlaFromDoc(d)
    if (!matla) return acc

    const createdAtMs = toMillis(d.created_at)

    acc.push({
      id: d.id,
      slug: d.slug,
      poet: d.author || 'Unknown',
      createdAt: d.created_at,
      createdAtMs,
      matla
    })

    return acc
  }, [])

  return ghazals
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, limit)
}

function safeDate(d) {
  try {
    return d ? new Date(d) : null
  } catch {
    return null
  }
}

function extractText(node) {
  if (!node) return ""

  if (node.type === "text") return node.text || ""

  if (Array.isArray(node.content)) {
    return node.content.map(extractText).join(" ")
  }

  return ""
}

export async function getLatestBlogs(limit = 7) {
  const supabase = supabasePublic

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit)

  if (error) throw error

  return (data || []).map(d => {
    const plainText = extractText(d.content)

    return {
      id: d.id,
      title: d.title || "Untitled",
      content: plainText,
      excerpt: d.excerpt || plainText.substring(0, 180) + "...",
      featured_image: d.featured_image || null,
      slug: d.slug,
      author: d.author || "MicTale",
      created_at: safeDate(d.published_at || d.created_at),
      tags: d.tags || []
    }
  })
}

export async function getBlogBySlug(slug) {
  const supabase = supabasePublic

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !data) return null

  return {
    ...data,
    createdAt: safeDate(data.published_at || data.created_at),
    updatedAt: safeDate(data.updated_at || data.created_at)
  }
}

export async function getSimilarBlogs(currentBlog, currentBlogId) {
  if (!currentBlog) return []

  const supabase = supabasePublic
  const collected = new Map()

  if (currentBlog.tags?.length) {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .overlaps("tags", currentBlog.tags.slice(0, 2))
      .eq("status", "published")
      .limit(8)

    data?.forEach(d => {
      if (!collected.has(d.id) && d.id !== currentBlogId)
        collected.set(d.id, d)
    })
  }

  if (collected.size < 4) {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(12)

    data?.forEach(d => {
      if (collected.size < 4 && !collected.has(d.id) && d.id !== currentBlogId)
        collected.set(d.id, d)
    })
  }

  return Array.from(collected.values()).slice(0, 4)
}

export async function getAllPublishedBlogSlugs() {
  const supabase = supabasePublic

  const { data } = await supabase
    .from("blogs")
    .select("slug")
    .eq("status", "published")

  return (data || []).map(d => ({ slug: d.slug }))
}

export async function fetchSimilarPoems({ author, category, excludeSlug, limit = 4 }) {
  const supabase = supabasePublic
  const collected = new Map()

  async function run(query) {
    const { data } = await query
    data?.forEach(d => {
      if (d.slug === excludeSlug) return
      if (!collected.has(d.slug)) collected.set(d.slug, d)
    })
  }

  if (author) {
    await run(
      supabase.from('poems')
        .select('*')
        .eq('author', author)
        .order('created_at', { ascending: false })
        .limit(limit)
    )
  }

  if (collected.size < limit && category) {
    await run(
      supabase.from('poems')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(limit)
    )
  }

  if (collected.size < limit) {
    await run(
      supabase.from('poems')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit * 2)
    )
  }

  return Array.from(collected.values())
    .sort((a, b) => toMillis(b.created_at) - toMillis(a.created_at))
    .slice(0, limit)
}
