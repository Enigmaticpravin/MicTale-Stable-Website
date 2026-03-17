import { createServerSupabase } from '@/app/lib/supabase/server-route'

export async function listBlogSlugs() {
  const supabase = createServerSupabase()

  const { data } = await supabase
    .from('blogs')
    .select('slug, updated_at')

  if (!data) return []

  return data.map(d => ({
    slug: d.slug,
    updatedAt: d.updated_at || null
  }))
}
