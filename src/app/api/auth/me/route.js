// app/api/auth/me/route.js
import { NextResponse } from 'next/server'
import { adminAuth } from '@/app/lib/firebaseAdmin'

export async function GET(req) {
  try {
    const sessionCookie = req.cookies.get('session')?.value

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session' }, { status: 401 })
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name || '',
        profilePicture: decoded.profilePicture || '',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }
}
