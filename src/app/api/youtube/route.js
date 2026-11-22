
import { getYoutubeVideos } from '@/app/lib/youtube'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const videos = await getYoutubeVideos()

    if (!Array.isArray(videos)) {
      console.error(
        'YouTube API returned unexpected data:',
        videos
      )

      return NextResponse.json(
        { error: 'Invalid YouTube response' },
        { status: 502 }
      )
    }

    return NextResponse.json(videos)

  } catch (error) {
    // Actual error appears in production server logs
    console.error('YOUTUBE API ERROR:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch videos',
      },
      { status: 500 }
    )
  }
}
