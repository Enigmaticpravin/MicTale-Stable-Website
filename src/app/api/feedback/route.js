import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/app/lib/supabase/server-route'

export async function POST(req) {
  try {
    const { feedback } = await req.json()
    const supabase = createRouteSupabase()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    await supabase.from('feedbacks').insert({
      feedback,
      user_id: user?.id || null,
      user_name: user?.user_metadata?.full_name || user?.email || 'Anonymous'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
