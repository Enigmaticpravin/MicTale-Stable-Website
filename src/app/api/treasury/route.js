import { createRouteSupabase } from '@/app/lib/supabase/server-route'

const PAGE_SIZE = 10

export async function GET(req) {

  const supabase = createRouteSupabase()

  const { searchParams } = new URL(req.url)

  const cursor = parseInt(searchParams.get('cursor') || '0', 10)

  const from = cursor
  const to = cursor + PAGE_SIZE - 1

  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error("Supabase error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  const nextCursor = data.length === PAGE_SIZE ? cursor + PAGE_SIZE : null

  return Response.json({
    docs: data,
    nextCursor
  })
}