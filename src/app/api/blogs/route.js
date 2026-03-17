import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const runtime = "nodejs"

function createSupabase() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        }
      }
    }
  )
}

export async function POST(request) {
  try {
    const blogData = await request.json()
console.log("🔥 BLOG PAYLOAD:", blogData)


    const supabase = createSupabase()

    const { error } = await supabase
      .from("blogs")
      .upsert(blogData, {
        onConflict: "slug"
      })

    if (error) {
      console.error("SUPABASE BLOG UPSERT ERROR:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, slug: blogData.slug })
  } catch (err) {
    console.error("BLOG API ERROR:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}