// utils/cloudinary-upload.js
import cloudinary from '@/app/lib/cloudinary'

export function uploadBufferToCloudinary(buffer, { folder = 'blogs', resource_type = 'image' } = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}
