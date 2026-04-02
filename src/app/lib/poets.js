import { supabaseAdmin } from "./supabase/admin"

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

  const supabase = supabaseAdmin

  const slug = slugify(name)

  const { data, error } = await supabase
    .from('poets')
    .insert({
      name,
      slug,
      bio,
      image,
      created_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error("Supabase error:", error)
    throw new Error(error.message)
  }

  return { id: data.id, slug }
}

export async function listPoetSlugs() {
  const supabase = supabaseAdmin

  const { data, error } = await supabase
    .from('poets')
    .select('slug, created_at')

  if (error) {
    console.error("Supabase error:", error)
    throw new Error(error.message)
  }

  if (!data) return []

  return data.map(row => ({
    slug: row.slug,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.created_at || new Date().toISOString()
  }))
}