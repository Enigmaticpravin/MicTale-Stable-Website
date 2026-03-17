import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/app/lib/supabase/server-route'

export async function GET() {
  const supabase = createRouteSupabase()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || '',
      profilePicture: user.user_metadata?.avatar_url || ''
    }
  })
}