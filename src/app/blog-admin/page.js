"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/app/lib/supabase/client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold, Italic, Underline as UnderlineIcon, List,
  Heading2, Heading3, Quote, Loader2, ChevronLeft,
  Eye, Sparkles, FileText, Clock, MoreHorizontal,
  AlignLeft, Code, Minus, RotateCcw, RotateCw,
  CheckCircle2, AlertCircle, Globe, Lock
} from "lucide-react"
import { toast, Toaster } from "sonner"

function useEditorStats(editor) {
  const [stats, setStats] = useState({ words: 0, readTime: 0 })
  useEffect(() => {
    if (!editor) return
    const update = () => {
      const text = editor.getText()
      const words = text.trim() ? text.trim().split(/\s+/).length : 0
      setStats({ words, readTime: Math.max(1, Math.ceil(words / 200)) })
    }
    editor.on("update", update)
    return () => editor.off("update", update)
  }, [editor])
  return stats
}

function ToolBtn({ onClick, active, icon, label, shortcut }) {
  return (
    <button
      onClick={onClick}
      title={shortcut ? `${label} (${shortcut})` : label}
      className={`
        relative group flex items-center justify-center w-8 h-8 rounded-md text-sm
        transition-all duration-150 select-none
        ${active
          ? "bg-slate-700 text-white shadow-inner"
          : "text-slate-400 hover:text-slate-100 hover:bg-slate-700/60"
        }
      `}
    >
      {icon}
      {label && (
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 border border-slate-700 text-[10px] text-slate-300 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {label}{shortcut && <span className="text-slate-500 ml-1">{shortcut}</span>}
        </span>
      )}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-slate-700/80 mx-0.5 flex-shrink-0" />
}

function StatusBadge({ status }) {
  const cfg = {
    draft:     { icon: <Lock size={11} />,        label: "Draft",     cls: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    published: { icon: <Globe size={11} />,        label: "Published", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    saving:    { icon: <Loader2 size={11} className="animate-spin" />, label: "Saving…", cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  }
  const { icon, label, cls } = cfg[status] || cfg.draft
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border tracking-wide ${cls}`}>
      {icon}{label}
    </span>
  )
}
export default function BlogAdmin() {
  const router = useRouter()
  const [user, setUser]       = useState(null)
  const [title, setTitle]     = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tag, setTag]         = useState("")
  const [tags, setTags]       = useState([])
  const [isSaving, setIsSaving]     = useState(false)
  const [postStatus, setPostStatus] = useState("draft")
  const [lastSaved, setLastSaved]   = useState(null)
  const [charCount, setCharCount]   = useState(0)
  const titleRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Begin your story here…" }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: [
          "prose prose-invert prose-slate max-w-none focus:outline-none",
          "min-h-[55vh] text-slate-200 leading-[1.85] text-[17px]",
          "prose-headings:text-white prose-headings:font-bold",
          "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
          "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
          "prose-p:text-slate-300 prose-p:my-4",
          "prose-blockquote:border-l-2 prose-blockquote:border-blue-500",
          "prose-blockquote:pl-5 prose-blockquote:text-slate-400 prose-blockquote:italic",
          "prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-300 prose-code:text-sm",
          "prose-ul:my-4 prose-li:text-slate-300",
          "selection:bg-blue-500/25"
        ].join(" "),
      },
    },
    onUpdate: ({ editor }) => {
      setCharCount(editor.getText().length)
    }
  })

  const { words, readTime } = useEditorStats(editor)

  const autoSaveRef = useRef(null)
  useEffect(() => {
    if (!user || !title.trim() || !editor || editor.isEmpty) return
    clearTimeout(autoSaveRef.current)
    autoSaveRef.current = setTimeout(() => {
      handleSave("draft", true)
    }, 30_000)
    return () => clearTimeout(autoSaveRef.current)
  }, [title, charCount, user])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: u } } = await supabase.auth.getUser()
      if (!u) router.push("/login")
      else { setUser(u); setTimeout(() => titleRef.current?.focus(), 100) }
    }
    checkUser()
  }, [router])

  const addTag = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tag.trim()) {
      e.preventDefault()
      if (!tags.includes(tag.trim())) setTags([...tags, tag.trim()])
      setTag("")
    }
  }
  const removeTag = (t) => setTags(tags.filter(x => x !== t))

  const handleSave = async (status, silent = false) => {
    if (!title.trim() || !editor || editor.isEmpty) {
      if (!silent) {
        toast.error("Title and content are mandatory, boss.", {
          icon: <AlertCircle size={16} className="text-red-400" />,
        })
      }
      return
    }

    setIsSaving(true)
    setPostStatus("saving")

    const savePromise = fetch("/api/blogs/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        content: editor.getJSON(),
        status,
        author_id: user.id,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || `Server error ${res.status}`)
      }
      return res.json()
    })

    if (silent) {
      savePromise
        .then(() => {
          setPostStatus(status)
          setLastSaved(new Date())
        })
        .catch(() => {
        })
        .finally(() => setIsSaving(false))
    } else {
      toast.promise(savePromise, {
        loading: status === "published" ? "Publishing…" : "Saving draft…",
        success: () => {
          setPostStatus(status)
          setLastSaved(new Date())
          setIsSaving(false)
          return status === "published" ? "Post published successfully." : "Draft saved."
        },
        error: (err) => {
          setPostStatus("draft")
          setIsSaving(false)
          return "Save failed: " + err.message
        },
      })
    }
  }

  if (!user) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <Loader2 size={22} className="text-slate-500 animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
      <style global jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; }

        body { font-family: 'Geist', system-ui, sans-serif; }

        .title-input {
          font-family: 'Instrument Serif', Georgia, serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .title-input::placeholder { color: #2d3748; }

        .excerpt-input {
          font-family: 'Geist', system-ui, sans-serif;
          font-size: 1.05rem;
        }
        .excerpt-input::placeholder { color: #374151; }

        /* Tiptap placeholder */
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #374151;
          pointer-events: none;
          height: 0;
          font-family: 'Geist', system-ui, sans-serif;
          font-size: 17px;
          font-style: italic;
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }

        /* Toolbar active state animation */
        .toolbar-btn-active { transform: scale(0.95); }
      `}</style>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1a2030",
            border: "1px solid #2d3748",
            color: "#e2e8f0",
            fontFamily: "'Geist', system-ui, sans-serif",
            fontSize: "13px",
          },
        }}
      />

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-50 bg-[#0d1117]/95 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-screen-xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[11px] font-mono font-semibold tracking-widest text-slate-600 uppercase">New Post</span>
              <span className="text-slate-700">·</span>
              <StatusBadge status={isSaving ? "saving" : postStatus} />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-600 font-mono mr-1">
                <Clock size={11} />
                Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all" style={{ fontFamily: "'Geist', sans-serif" }}>
              <Eye size={13} /> Preview
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={isSaving}
              className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all disabled:opacity-40"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published", false)}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[12px] font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 active:scale-95"
              style={{ fontFamily: "'Geist', sans-serif" }}
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles size={13} />}
              Publish
            </button>
          </div>
        </div>
      </header>

      {/* ── Layout ── */}
      <div className="max-w-screen-xl mx-auto flex min-h-[calc(100vh-56px)]">

        {/* ── Editor column ── */}
        <main className="flex-1 min-w-0 px-6 md:px-12 lg:px-20 py-14">

          {/* Title */}
          <textarea
            ref={titleRef}
            placeholder="Post title…"
            className="title-input w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-white overflow-hidden mb-6"
            value={title}
            rows={2}
            onChange={(e) => {
              setTitle(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
          />

          {/* Excerpt */}
          <textarea
            placeholder="Write a short excerpt to hook your readers…"
            className="excerpt-input w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-slate-500 hover:text-slate-400 focus:text-slate-300 transition-colors mb-10 leading-relaxed"
            rows={2}
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value)
              e.target.style.height = "auto"
              e.target.style.height = e.target.scrollHeight + "px"
            }}
          />

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <span className="text-[11px] text-slate-700 font-mono tracking-widest uppercase">Content</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
          </div>

          {/* Sticky toolbar */}
          {editor && (
            <div className="sticky top-[70px] z-40 mb-8 -mx-3">
              <div className="flex flex-wrap items-center gap-0.5 bg-[#161b22] border border-slate-700/70 rounded-xl px-2.5 py-2 shadow-xl shadow-black/40 w-fit" style={{ fontFamily: "'Geist', sans-serif" }}>
                <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()}            active={editor.isActive("bold")}            icon={<Bold size={15}/>}        label="Bold"       shortcut="⌘B" />
                <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()}          active={editor.isActive("italic")}          icon={<Italic size={15}/>}      label="Italic"     shortcut="⌘I" />
                <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()}       active={editor.isActive("underline")}       icon={<UnderlineIcon size={15}/>} label="Underline" shortcut="⌘U" />
                <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()}            active={editor.isActive("code")}            icon={<Code size={15}/>}        label="Inline Code" />
                <Divider />
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({level:2}).run()} active={editor.isActive("heading",{level:2})} icon={<Heading2 size={15}/>}  label="Heading 2"  shortcut="##" />
                <ToolBtn onClick={() => editor.chain().focus().toggleHeading({level:3}).run()} active={editor.isActive("heading",{level:3})} icon={<Heading3 size={15}/>}  label="Heading 3"  shortcut="###" />
                <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()}      active={editor.isActive("bulletList")}      icon={<List size={15}/>}        label="Bullet List" shortcut="⌘⇧8" />
                <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}      active={editor.isActive("blockquote")}      icon={<Quote size={15}/>}       label="Blockquote"  shortcut=">" />
                <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()}     active={false}                              icon={<Minus size={15}/>}       label="Divider" />
                <Divider />
                <ToolBtn onClick={() => editor.chain().focus().undo().run()}                  active={false}                              icon={<RotateCcw size={15}/>}   label="Undo"       shortcut="⌘Z" />
                <ToolBtn onClick={() => editor.chain().focus().redo().run()}                  active={false}                              icon={<RotateCw size={15}/>}    label="Redo"       shortcut="⌘⇧Z" />
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="relative" onClick={() => editor?.commands.focus()}>
            <EditorContent editor={editor} />
          </div>

          {/* Bottom stats bar */}
          <div className="mt-16 pt-6 border-t border-slate-800/60 flex items-center justify-between" style={{ fontFamily: "'Geist', sans-serif" }}>
            <div className="flex items-center gap-5 text-[12px] text-slate-600">
              <span className="flex items-center gap-1.5"><FileText size={12} /> {words} words</span>
              <span className="flex items-center gap-1.5"><Clock size={12} /> {readTime} min read</span>
              <span>{charCount} characters</span>
            </div>
            <button className="text-[12px] text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1.5">
              <MoreHorizontal size={14} /> More options
            </button>
          </div>
        </main>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 border-l border-slate-800 px-6 py-10 gap-8" style={{ fontFamily: "'Geist', sans-serif" }}>

          {/* Status section */}
          <section>
            <h3 className="text-[11px] font-semibold tracking-widest text-slate-600 uppercase mb-4">Status</h3>
            <div className="space-y-2">
              {["draft", "published"].map(s => (
                <button
                  key={s}
                  onClick={() => setPostStatus(s)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-[13px] transition-all ${
                    postStatus === s
                      ? "border-slate-600 bg-slate-800 text-slate-100"
                      : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  <span className="capitalize font-medium">{s}</span>
                  {postStatus === s && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                </button>
              ))}
            </div>
          </section>

          {/* Tags */}
          <section>
            <h3 className="text-[11px] font-semibold tracking-widest text-slate-600 uppercase mb-4">Tags</h3>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {tags.map(t => (
                <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-[12px] rounded-md">
                  {t}
                  <button onClick={() => removeTag(t)} className="text-slate-600 hover:text-slate-300 transition-colors ml-0.5">×</button>
                </span>
              ))}
            </div>
            <input
              placeholder="Add tag, press Enter…"
              value={tag}
              onChange={e => setTag(e.target.value)}
              onKeyDown={addTag}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-[13px] text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </section>

          {/* Reading time summary */}
          <section>
            <h3 className="text-[11px] font-semibold tracking-widest text-slate-600 uppercase mb-4">Summary</h3>
            <div className="space-y-3">
              {[
                { label: "Words", value: words },
                { label: "Read time", value: `${readTime} min` },
                { label: "Characters", value: charCount },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-[13px]">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-slate-300 font-semibold tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-auto space-y-2">
            <button
              onClick={() => handleSave("published", false)}
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-bold transition-all shadow-lg shadow-blue-900/30 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              Publish Post
            </button>
            <button
              onClick={() => handleSave("draft", false)}
              disabled={isSaving}
              className="w-full py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 text-[13px] font-medium transition-all disabled:opacity-40"
            >
              Save as Draft
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}