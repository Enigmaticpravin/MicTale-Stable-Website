import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabase/admin'

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      fullName,
      phone_number,
      performanceType,
      showId,
      slotDate,
      email,
      first_time,
        video_editing_service,
        instagramHandle,
        paymentStatus,
        amount,
      slotTime
    } = body

    if (!fullName || !showId || !slotDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const selectedDate = new Date(`${slotDate} ${slotTime}`)

    const bookingId = `MANUAL_${Date.now()}`

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        booking_id: bookingId,
        full_name: fullName,
        phone_number,
        performance_type: performanceType,
        show_id: showId,
        user_id: null,
        email: email,
        instagram_handle: instagramHandle || "",
        special_requirements: "",
        video_editing_service: video_editing_service,
        first_time: first_time ? "Yes" : "No",
        confirmation_status: 'confirmed',
        payment_status: paymentStatus,
        amount: amount || 299,

        selected_date: selectedDate.toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('INSERT ERROR:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, booking: data })

  } catch (err) {
    console.error('MANUAL API ERROR:', err)
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    )
  }
}