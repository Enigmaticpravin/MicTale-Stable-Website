import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/app/lib/supabase/admin"
import { slugify } from "@/app/lib/slugify"

function extractTextFromTiptap(node) {
  if (!node) return ""

  if (node.text) return node.text

  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromTiptap).join(" ")
  }

  return ""
}

export async function POST(req) {
  try {
    const body = await req.json()

    const {
      id,
      title,
      excerpt,
      content,
      meta_title,
      meta_description,
      status,
      author_id
    } = body

    if (!title?.trim())
      return NextResponse.json({ error: "Title required" }, { status: 400 })

    if (status === "published" && !content)
      return NextResponse.json({ error: "Content required" }, { status: 400 })

    const slug = slugify(title)

    const plainText = extractTextFromTiptap(content)

    const wordCount = plainText.trim()
      ? plainText.trim().split(/\s+/).length
      : 0

    const reading_time = Math.max(1, Math.ceil(wordCount / 200))

    const { error } = await supabaseAdmin
      .from("blogs")
      .upsert({
        id,
        title,
        slug,
        excerpt,
        content,
        meta_title,
        meta_description,
        status,
        author_id,
        reading_time,
        published_at: status === "published" ? new Date().toISOString() : null
      })

    if (error) throw error

    return NextResponse.json({ ok: true, slug })

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}