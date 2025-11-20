// lib/getInstagramPosts.js
export default async function getInstagramPosts() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN // add in .env

    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${token}`,
      { next: { revalidate: 300 } } // cache for 5 min
    )

    const json = await res.json()

    if (!json.data) return []

    return json.data
  } catch (err) {
    console.error("Instagram fetch error:", err)
    return []
  }
}
