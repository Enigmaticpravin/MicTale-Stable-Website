export function formatPassDate(dateValue) {
  if (!dateValue) return 'Date to be announced'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Date to be announced'

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  })
}

export function formatPassTime(dateValue) {
  if (!dateValue) return 'Time to be announced'

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Time to be announced'

  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export function buildPerformerPass(booking, show) {
  const selectedDate = booking?.selected_date || null
  const issuedAt = booking?.created_at || new Date().toISOString()

  return {
    passId: booking?.entry_pass_id || booking?.booking_id || `MT-${booking?.id ?? 'PASS'}`,
    performerName: booking?.full_name || 'Unnamed performer',
    email: booking?.email || 'Not provided',
    phoneNumber: booking?.phone_number || 'Not provided',
    performanceType: booking?.performance_type || 'Open mic act',
    instagramHandle: booking?.instagram_handle || 'Not provided',
    specialRequirements: booking?.special_requirements || 'None',
    slotDate: formatPassDate(selectedDate),
    slotTime: formatPassTime(selectedDate),
    rawSlotDate: selectedDate,
    showName: show?.name || 'MicTale Open Mic',
    venue: show?.location || 'Venue to be announced',
    coverUrl: show?.cover_url || '',
    status: booking?.confirmation_status || 'pending',
    issuedAt: formatPassDate(issuedAt)
  }
}
