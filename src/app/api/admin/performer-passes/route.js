import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/app/lib/supabase/server-route'
import { supabaseAdmin } from '@/app/lib/supabase/admin'
import { buildPerformerPass } from '@/app/lib/performerPasses'

const ALLOWED_STATUSES = ['pending', 'approved', 'checked_in', 'cancelled']

async function getAuthenticatedUser() {
  const supabase = createRouteSupabase()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user
}

export async function GET() {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: shows, error: showError } = await supabaseAdmin
    .from('shows')
    .select('id, name, location, cover_url')
    .eq('created_by', user.id)
    .order('date', { ascending: true })

  if (showError) {
    return NextResponse.json({ error: showError.message }, { status: 500 })
  }

  if (!shows?.length) {
    return NextResponse.json({ bookings: [], shows: [] })
  }

  const showMap = new Map(shows.map(show => [show.id, show]))
  const showIds = shows.map(show => show.id)

  const { data: bookings, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select('*')
    .in('show_id', showIds)
    .order('selected_date', { ascending: true })

  if (bookingError) {
    return NextResponse.json({ error: bookingError.message }, { status: 500 })
  }

  const payload = (bookings || []).map(booking => {
    const show = showMap.get(booking.show_id) || null

    return {
      ...booking,
      show,
      entryPass: buildPerformerPass(booking, show)
    }
  })

  return NextResponse.json({ bookings: payload, shows })
}

export async function PATCH(req) {
  const user = await getAuthenticatedUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const bookingId = body?.bookingId
  const confirmationStatus = body?.confirmationStatus

  if (!bookingId || !ALLOWED_STATUSES.includes(confirmationStatus)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { data: booking, error: bookingError } = await supabaseAdmin
    .from('bookings')
    .select('id, show_id')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const { data: show, error: showError } = await supabaseAdmin
    .from('shows')
    .select('id')
    .eq('id', booking.show_id)
    .eq('created_by', user.id)
    .single()

  if (showError || !show) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { data: updatedBooking, error: updateError } = await supabaseAdmin
    .from('bookings')
    .update({ confirmation_status: confirmationStatus })
    .eq('id', bookingId)
    .select('*')
    .single()

  if (updateError || !updatedBooking) {
    return NextResponse.json({ error: updateError?.message || 'Unable to update booking' }, { status: 500 })
  }

  const { data: showDetails } = await supabaseAdmin
    .from('shows')
    .select('id, name, location, cover_url')
    .eq('id', booking.show_id)
    .single()

  return NextResponse.json({
    booking: {
      ...updatedBooking,
      show: showDetails,
      entryPass: buildPerformerPass(updatedBooking, showDetails)
    }
  })
}
