import { NextResponse } from 'next/server'
import { createRouteSupabase } from '@/app/lib/supabase/server-route'
import { supabaseAdmin } from '@/app/lib/supabase/admin'
import { buildPerformerPass } from '@/app/lib/performerPasses'

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled', 'checked_in']

async function getAuthenticatedUser() {
  const supabase = await createRouteSupabase()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user
}

export async function GET() {
  try {
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
  } catch (err) {
    console.error('API ERROR:', err)

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
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

export async function POST(req) {
  try {
    const user = await getAuthenticatedUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const {
      fullName,
      phone_number,
      performanceType,
      showId,
      slotDate,
      slotTime
    } = body

    if (!fullName || !phone_number || !showId || !slotDate) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    let selectedDate

    try {
      if (slotTime) {
        const [time, modifier] = slotTime.split(' ')
        let [hours, minutes] = time.split(':').map(Number)

        if (modifier === 'PM' && hours !== 12) hours += 12
        if (modifier === 'AM' && hours === 12) hours = 0

        selectedDate = new Date(slotDate)
        selectedDate.setHours(hours, minutes, 0, 0)
      } else {
        selectedDate = new Date(slotDate)
      }

      if (isNaN(selectedDate)) throw new Error()
    } catch {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
    }

    const bookingId = `MT-${Date.now().toString().slice(-6)}`

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        booking_id: bookingId,
        full_name: fullName,
        phone_number: phone_number,
        show_id: showId,
        user_id: null,
        performance_type: performanceType,
        confirmation_status: 'pending',
        payment_status: 'manual',
        amount: 0,
        email: "san",
        selected_date: selectedDate.toISOString(),
        first_time: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

 if (error) {
  console.error("SUPABASE INSERT ERROR:", error)
  return NextResponse.json(
    { error: error.message, details: error },
    { status: 500 }
  )
}

    const { data: show } = await supabaseAdmin
      .from('shows')
      .select('id, name, location, cover_url')
      .eq('id', showId)
      .single()

    return NextResponse.json({
      booking: {
        ...data,
        show,
        entryPass: buildPerformerPass(data, show)
      }
    })

  } catch (err) {
    console.error('POST ERROR:', err)

    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}