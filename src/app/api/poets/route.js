import { addPoet } from '@/app/lib/poets'

export async function POST(req) {
  try {
    const body = await req.json()
    const { id, slug } = await addPoet(body)

    return new Response(JSON.stringify({ ok: true, id, slug }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Poet save error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Failed to add poet' }), {
      status: 500,
    })
  }
}
