// app/api/upload/route.js
import { uploadBufferToCloudinary } from '@/app/utils/cloudinary-upload'

export async function POST(req) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await uploadBufferToCloudinary(buffer, {
      folder: 'blogs',
      resource_type: 'image'
    })

    return new Response(JSON.stringify({ ok: true, url: result.secure_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Upload error:', err)
    return new Response(JSON.stringify({ error: err.message || 'Upload failed' }), { status: 500 })
  }
}
