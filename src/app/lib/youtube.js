export async function getYoutubeVideos() {
  const API_KEY = process.env.YOUTUBE_API_KEY
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=20&type=video`

  const res = await fetch(url, {
    next: {
      revalidate: 300,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch YouTube videos')
  }

  const data = await res.json()

  const videos = data.items.map((item) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium?.url,
    date: new Date(item.snippet.publishedAt).toLocaleDateString('en-IN', {
      month: 'long',
      year: 'numeric',
    }),
    desc: item.snippet.description,
  }))

  return videos
}