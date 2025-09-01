
export function toPlain(value) {
  if (value == null) return value

  // Firestore Timestamp duck-typing
  if (typeof value?.toDate === 'function' && typeof value?.seconds === 'number') {
    return value.toDate().toISOString()
  }

  // Firestore DocumentReference duck-typing
  if (value?.path && typeof value.path === 'string' && value?.firestore) {
    return value.path
  }

  // Firestore GeoPoint duck-typing
  if (typeof value?.latitude === 'number' && typeof value?.longitude === 'number') {
    return { lat: value.latitude, lng: value.longitude }
  }

  if (Array.isArray(value)) {
    return value.map(toPlain)
  }

  if (typeof value === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = toPlain(v)
    }
    return out
  }

  return value
}
