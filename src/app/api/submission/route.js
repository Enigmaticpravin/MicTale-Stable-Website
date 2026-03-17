import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/app/lib/supabase/server-route'

export async function POST(req) {
  const supabase = createRouteSupabase()
  const body = await req.json()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await supabase.from('submission').insert({
    title: body.title,
    category: body.category,
    content: body.content,
    author_id: user.id,
    author_name: user.user_metadata?.full_name || user.email,
    status: 'pending'
  })

  return NextResponse.json({ ok: true })
}