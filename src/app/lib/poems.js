import { createRouteSupabase } from '@/app/lib/supabase/server-route'

function toPlain(row) {
  return row ? JSON.parse(JSON.stringify(row)) : null
}

export async function getPoemBySlug(slug) {
  const supabase = await createRouteSupabase()

  let { data } = await supabase
    .from('poems')
    .select('*')
    .eq('slug', slug)
    .single()
  return toPlain(data)
}

export async function listPoemSlugs(max = 5000) {
  const supabase = await createRouteSupabase()

  const { data } = await supabase
    .from('poems')
    .select('slug, created_at')
    .order('created_at', { ascending: false })
    .limit(max)

  if (!data) return []

  return data.map(d => ({
    slug: String(d.slug),
    updatedAt: d.created_at || new Date().toISOString()
  }))
}

export async function upsertPoem(poem) {
  const supabase = await createRouteSupabase()

  const { data, error } = await supabase
    .from('poems')
    .upsert({
      slug: poem.slug,
      title: poem.title,
      author: poem.author,
      category: poem.category,
      language: poem.language,
      lines: poem.lines,
      excerpt: poem.excerpt,
      created_at: poem.createdAt,
      published_at: poem.publishedAt
    })
    .select()
    .single()

  if (error) {
    console.error("Supabase error:", error)
    throw new Error(error.message)
  }

  return toPlain(data)
}
