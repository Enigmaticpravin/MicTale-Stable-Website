"use client"

import React, { useState, useRef, useEffect } from "react"
import { PenTool, FileText, Upload, X, Check, AlertCircle, Eye, Edit3, Bold, Italic, List, Quote } from "lucide-react"

export default function DualPublishingPage() {
  const [activeMode, setActiveMode] = useState('poem') // 'poem' or 'blog'
  
  // Poem state
  const [poemTitle, setPoemTitle] = useState("")
  const [poemAuthor, setPoemAuthor] = useState("")
  const [poemCategory, setPoemCategory] = useState("Poem")
  const [poemLines, setPoemLines] = useState("")
  const [poemExcerpt, setPoemExcerpt] = useState("")
  const [poemLoading, setPoemLoading] = useState(false)
  const [poemResult, setPoemResult] = useState(null)
  const [isPoemDropdownOpen, setIsPoemDropdownOpen] = useState(false)

  // Blog state
  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")
  const [blogContent, setBlogContent] = useState("")
  const [blogExcerpt, setBlogExcerpt] = useState("")
  const [blogTags, setBlogTags] = useState("")
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState("")
  const [blogLoading, setBlogLoading] = useState(false)
  const [blogResult, setBlogResult] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)

  const contentTypes = ['English Prose', 'Poem', 'Muktak', 'Ghazal', 'Nazm']
  const dropdownRef = useRef(null)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(e) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target)) {
        setIsPoemDropdownOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  // Markdown parsing function
  const parseMarkdown = (text) => {
    if (!text) return ""
    
    let html = text
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-white mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-white mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-white mt-8 mb-6">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em class="text-blue-300">$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-blue-300 italic">$1</em>')
      
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-800 border border-slate-600 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm text-green-300 font-mono">$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-green-300 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 text-gray-300 italic bg-slate-800/30 rounded-r-lg">$1</blockquote>')
      
      // Lists
      .replace(/^\* (.*$)/gm, '<li class="text-gray-300 mb-2">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="text-gray-300 mb-2">$1</li>')
      .replace(/^\+ (.*$)/gm, '<li class="text-gray-300 mb-2">$1</li>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors duration-200" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Line breaks
      .replace(/\n\n/g, '</p><p class="text-gray-300 leading-relaxed mb-4">')
      .replace(/\n/g, '<br>')

    // Wrap lists in ul tags
    html = html.replace(/(<li class="text-gray-300 mb-2">.*<\/li>)/gs, (match) => {
      return `<ul class="list-disc list-inside space-y-2 my-4 ml-4">${match}</ul>`
    })

    // Wrap content in paragraph if it doesn't start with a block element
    if (!html.match(/^<[h1-6|ul|ol|blockquote|pre]/)) {
      html = `<p class="text-gray-300 leading-relaxed mb-4">${html}</p>`
    }

    return html
  }

  // Formatting functions
  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = blogContent.substring(start, end)
    const newText = blogContent.substring(0, start) + before + selectedText + after + blogContent.substring(end)
    
    setBlogContent(newText)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const formatBold = () => insertFormatting('**', '**')
  const formatItalic = () => insertFormatting('*', '*')
  const formatQuote = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const lineStart = blogContent.lastIndexOf('\n', start - 1) + 1
    const newText = blogContent.substring(0, lineStart) + '> ' + blogContent.substring(lineStart)
    setBlogContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 2)
    }, 0)
  }

  const formatList = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const start = textarea.selectionStart
    const lineStart = blogContent.lastIndexOf('\n', start - 1) + 1
    const newText = blogContent.substring(0, lineStart) + '• ' + blogContent.substring(lineStart)
    setBlogContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + 2, start + 2)
    }, 0)
  }

  // Poem functions
  async function handlePoemSubmit(e) {
    e.preventDefault()
    setPoemLoading(true)
    setPoemResult(null)

    try {
      const res = await fetch("/api/poems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: poemTitle,
          author: poemAuthor,
          category: poemCategory,
          lines: poemLines.split("\n"),
          excerpt: poemExcerpt
        })
      })

      const data = await res.json()
      setPoemResult(data)
    } catch (err) {
      setPoemResult({ error: err.message })
    } finally {
      setPoemLoading(false)
    }
  }

  const handlePoemCategorySelect = (selectedCategory) => {
    setPoemCategory(selectedCategory)
    setIsPoemDropdownOpen(false)
  }

  const getPoemPlaceholderText = () => {
    switch (poemCategory) {
      case 'Ghazal':
        return "Enter ghazal couplets (sher)\nEach couplet should be on separate lines\nMaintain the radif and qafiya pattern"
      case 'Nazm':
        return "Enter nazm verses\nFree verse or structured form\nOne line per verse"
      case 'Muktak':
        return "Enter muktak (four-line verse)\nTraditional quatrain format\nOne line per verse"
      case 'English Prose':
        return "Enter prose content\nParagraphs separated by line breaks"
      default:
        return "Enter poem lines\nOne line per verse"
    }
  }

  // Blog functions
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setCoverImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null)
    setCoverImagePreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function uploadImageToCloudinary(file) {
  if (!file) throw new Error('No file provided')

  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  if (!res.ok) {
    console.error('Server upload failed', data)
    throw new Error(data.error || 'Upload failed')
  }
  return data.url
}

  async function handleBlogSubmit(e) {
    e.preventDefault()
    setBlogLoading(true)
    setBlogResult(null)

    try {
      let coverImageUrl = ""
      
      if (coverImage) {
        coverImageUrl = await uploadImageToCloudinary(coverImage)
      }

      const slug = generateSlug(blogTitle)
      const tagsArray = blogTags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const blogData = {
        title: blogTitle,
        author: blogAuthor,
        content: blogContent, // Store raw markdown
        excerpt: blogExcerpt,
        tags: tagsArray,
        coverImage: coverImageUrl,
        slug: slug,
        createdAt: new Date(),
        published: true
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData)
      })

      const data = await res.json()
      setBlogResult({ ok: true, slug: slug })
      
      // Clear form on success
      setBlogTitle("")
      setBlogAuthor("")
      setBlogContent("")
      setBlogExcerpt("")
      setBlogTags("")
      removeCoverImage()

    } catch (err) {
      setBlogResult({ error: err.message })
    } finally {
      setBlogLoading(false)
    }
  }

  const showPoemGuidelines = ['Ghazal', 'Nazm', 'Muktak'].includes(poemCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section with Mode Switch */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-3 tracking-wide">
                Content Studio
              </h1>
              <div className="w-20 h-px bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <p className="text-gray-400 text-sm sm:text-base mt-4 max-w-2xl">
                Create and publish your literary works and blog posts with our unified publishing platform.
              </p>
            </div>
            
            {/* Mode Switch */}
            <div className="flex items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full p-1">
              <button
                onClick={() => setActiveMode('poem')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeMode === 'poem' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span className="font-medium">Poetry</span>
              </button>
              <button
                onClick={() => setActiveMode('blog')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  activeMode === 'blog' 
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span className="font-medium">Blog</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 lg:p-12 shadow-2xl">
          {activeMode === 'poem' ? (
            /* POEM FORM */
            <form onSubmit={handlePoemSubmit} className="space-y-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <PenTool className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-light text-white tracking-wide">
                  Publish {poemCategory}
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title *
                  </label>
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                    value={poemTitle}
                    onChange={(e) => setPoemTitle(e.target.value)}
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Author *
                  </label>
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                    value={poemAuthor}
                    onChange={(e) => setPoemAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category *
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsPoemDropdownOpen(!isPoemDropdownOpen)}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-left text-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-slate-600 flex items-center justify-between"
                  >
                    <span>{poemCategory}</span>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isPoemDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isPoemDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl z-50 overflow-hidden">
                      {contentTypes.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handlePoemCategorySelect(type)}
                          className="w-full px-4 py-3 text-left text-gray-100 hover:bg-slate-700 transition-colors duration-150 border-b border-slate-700 last:border-b-0"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Excerpt
                </label>
                <input
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                  value={poemExcerpt}
                  onChange={(e) => setPoemExcerpt(e.target.value)}
                  placeholder="Enter a brief excerpt or preview"
                />
              </div>

              <div className="space-y-3 group">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {poemCategory} Content *
                </label>
                <div className="relative">
                  <textarea
                    rows={poemCategory === 'Ghazal' ? 10 : poemCategory === 'English Prose' ? 12 : 8}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all duration-300 hover:border-slate-600 resize-none font-mono text-sm leading-relaxed"
                    value={poemLines}
                    onChange={(e) => setPoemLines(e.target.value)}
                    placeholder={getPoemPlaceholderText()}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={poemLoading}
              >
                {poemLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing {poemCategory}...</span>
                  </div>
                ) : (
                  `Publish ${poemCategory}`
                )}
              </button>

              {/* Poem Result */}
              {poemResult && (
                <div className="mt-6">
                  {poemResult.error ? (
                    <div className="border border-red-400/20 bg-red-500/10 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-red-400 font-medium text-sm uppercase tracking-wide">
                            Publication Failed
                          </h3>
                          <p className="text-red-300 text-sm mt-1">{poemResult.error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-400/20 bg-green-500/10 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-green-400 font-medium text-sm uppercase tracking-wide">
                            Published Successfully
                          </h3>
                          <p className="text-green-300 text-sm mt-1">
                            Your {poemCategory.toLowerCase()} has been published successfully.{" "}
                            {poemResult.slug && (
                              <a
                                className="text-blue-400 underline hover:text-blue-300 transition-colors duration-200 font-medium"
                                href={`/poem/${poemResult.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View {poemCategory.toLowerCase()} →
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          ) : (
            /* BLOG FORM */
            <form onSubmit={handleBlogSubmit} className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-light text-white tracking-wide">
                    Publish Blog Post
                  </h2>
                </div>
                
                {/* Preview Toggle */}
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    previewMode 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {previewMode ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {previewMode ? 'Edit' : 'Preview'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title *
                  </label>
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter blog post title"
                    required
                  />
                  {blogTitle && (
                    <p className="text-xs text-gray-500 mt-1">
                      URL: mictale.in/blog/{generateSlug(blogTitle)}
                    </p>
                  )}
                </div>

                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Author *
                  </label>
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cover Image
                </label>
                <div className="flex flex-col space-y-4">
                  {!coverImagePreview ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-xl p-8 hover:border-slate-500 transition-colors duration-300 cursor-pointer"
                    >
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">Click to upload cover image</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Excerpt
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 hover:border-slate-600 resize-none"
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    placeholder="Brief description of your blog post"
                  />
                </div>

                <div className="space-y-3 group">
                  <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Tags
                  </label>
                  <input
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 hover:border-slate-600"
                    value={blogTags}
                    onChange={(e) => setBlogTags(e.target.value)}
                    placeholder="technology, programming, web development"
                  />
                  <p className="text-xs text-gray-500">Separate tags with commas</p>
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Content *
                </label>
                
                {!previewMode ? (
                  <>
                    {/* Formatting Toolbar */}
                    <div className="flex items-center space-x-2 p-3 bg-slate-800/50 border border-slate-700 rounded-t-xl border-b-0">
                      <button
                        type="button"
                        onClick={formatBold}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-gray-300 hover:text-white"
                        title="Bold (**text**)"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={formatItalic}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-gray-300 hover:text-white"
                        title="Italic (*text*)"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={formatQuote}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-gray-300 hover:text-white"
                        title="Quote (> text)"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={formatList}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors duration-200 text-gray-300 hover:text-white"
                        title="Bullet List (• text)"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <div className="h-6 w-px bg-slate-600 mx-2"></div>
                      <div className="text-xs text-gray-500">
                        <span className="font-mono">**bold**</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono">*italic*</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono"># heading</span>
                        <span className="mx-2">•</span>
                        <span className="font-mono">`code`</span>
                      </div>
                    </div>

                    <textarea
                      ref={textareaRef}
                      rows={12}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-b-xl px-4 py-4 text-gray-100 placeholder-gray-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all duration-300 hover:border-slate-600 resize-none leading-relaxed font-mono text-sm"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder={`Write your blog post content here using Markdown formatting...

Examples:
# Main Heading
## Sub Heading
**Bold text**
*Italic text*
• Bullet point
> Quote block
\`inline code\`

\`\`\`
code block
\`\`\`

[Link text](https://example.com)`}
                      required
                    />
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="min-h-[300px] bg-slate-800/30 border border-slate-700 rounded-xl p-6">
                    <div className="prose prose-invert max-w-none">
                      <div
                        className="blog-preview"
                        dangerouslySetInnerHTML={{
                          __html: parseMarkdown(blogContent)
                        }}
                      />
                      {!blogContent && (
                        <p className="text-gray-500 italic">
                          Write some content to see the preview...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={blogLoading}
              >
                {blogLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing Blog Post...</span>
                  </div>
                ) : (
                  'Publish Blog Post'
                )}
              </button>

              {/* Blog Result */}
              {blogResult && (
                <div className="mt-6">
                  {blogResult.error ? (
                    <div className="border border-red-400/20 bg-red-500/10 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-red-400 font-medium text-sm uppercase tracking-wide">
                            Publication Failed
                          </h3>
                          <p className="text-red-300 text-sm mt-1">{blogResult.error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-green-400/20 bg-green-500/10 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="text-green-400 font-medium text-sm uppercase tracking-wide">
                            Published Successfully
                          </h3>
                          <p className="text-green-300 text-sm mt-1">
                            Your blog post has been published successfully.{" "}
                            {blogResult.slug && (
                              <a
                                className="text-teal-400 underline hover:text-teal-300 transition-colors duration-200 font-medium"
                                href={`https://mictale.in/blog/${blogResult.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View blog post →
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Markdown Formatting Guide */}
        {activeMode === 'blog' && !previewMode && (
          <div className="mt-8 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-light text-white mb-6 tracking-wide">
              Markdown Formatting Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Headers</h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-gray-300">
                    <div># Main Heading</div>
                    <div>## Sub Heading</div>
                    <div>### Small Heading</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Text Formatting</h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-gray-300">
                    <div>**Bold text**</div>
                    <div>*Italic text*</div>
                    <div>***Bold and italic***</div>
                    <div>`inline code`</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Lists & Quotes</h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-gray-300">
                    <div>• Bullet point</div>
                    <div>- Another bullet</div>
                    <div>+ Plus bullet</div>
                    <div className="mt-2">&gt; Quote block</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white font-medium mb-2">Code & Links</h3>
                  <div className="bg-slate-800/50 rounded-lg p-3 font-mono text-gray-300">
                    <div>```</div>
                    <div>code block</div>
                    <div>```</div>
                    <div className="mt-2">[Link](https://example.com)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMode === 'poem' && showPoemGuidelines && (
          <div className="mt-12 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-light text-white mb-6 tracking-wide">
              {poemCategory} Guidelines
            </h2>
            <div className="space-y-4 text-sm text-gray-300 leading-relaxed">
              {poemCategory === 'Ghazal' && (
                <>
                  <p>• <strong className="text-gray-200">Structure:</strong> 5-15 couplets (sher), each expressing a complete thought</p>
                  <p>• <strong className="text-gray-200">Radif:</strong> Repeated word or phrase at the end of second line in each couplet</p>
                  <p>• <strong className="text-gray-200">Qafiya:</strong> Rhyming word that comes before the radif</p>
                  <p>• <strong className="text-gray-200">Maqta:</strong> Final couplet often includes poet's pen name (takhallus)</p>
                  <p>• <strong className="text-gray-200">Theme:</strong> Traditionally about love, loss, longing, or philosophical reflection</p>
                </>
              )}
              {poemCategory === 'Nazm' && (
                <>
                  <p>• <strong className="text-gray-200">Structure:</strong> Free verse or structured form, unified theme throughout</p>
                  <p>• <strong className="text-gray-200">Flexibility:</strong> No strict rhyme scheme required, focus on expression</p>
                  <p>• <strong className="text-gray-200">Unity:</strong> Single theme or narrative arc from beginning to end</p>
                  <p>• <strong className="text-gray-200">Modern Form:</strong> More contemporary than traditional ghazal structure</p>
                </>
              )}
              {poemCategory === 'Muktak' && (
                <>
                  <p>• <strong className="text-gray-200">Structure:</strong> Four-line verse (quatrain) with complete thought</p>
                  <p>• <strong className="text-gray-200">Rhyme:</strong> Traditional ABAB or AABA rhyme scheme</p>
                  <p>• <strong className="text-gray-200">Completeness:</strong> Each muktak should be self-contained</p>
                  <p>• <strong className="text-gray-200">Brevity:</strong> Concise expression of a single idea or emotion</p>
                </>
              )}
            </div>
          </div>
        )}

        {((activeMode === 'poem' && poemLines) || (activeMode === 'blog' && blogContent)) && (
          <div className="mt-6 text-right">
            <span className="text-xs text-gray-500">
              {activeMode === 'poem' 
                ? `${poemLines.length} characters, ${poemLines.split('\n').filter(line => line.trim()).length} lines`
                : `${blogContent.length} characters, ${blogContent.split(' ').filter(word => word.trim()).length} words`
              }
            </span>
          </div>
        )}
      </main>

      <style jsx>{`
        /* Custom scrollbar for textarea */
        textarea::-webkit-scrollbar {
          width: 8px;
        }

        textarea::-webkit-scrollbar-track {
          background: rgb(30 41 59);
        }

        textarea::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
          border-radius: 4px;
        }

        textarea::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }

        /* Blog preview specific styles */
        .blog-preview h1,
        .blog-preview h2,
        .blog-preview h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .blog-preview p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }

        .blog-preview ul {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }

        .blog-preview li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .blog-preview blockquote {
          margin: 1.5rem 0;
          padding: 1rem;
          border-left: 4px solid #3b82f6;
          background-color: rgba(30, 41, 59, 0.3);
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .blog-preview pre {
          margin: 1.5rem 0;
          overflow-x: auto;
          background-color: rgb(30, 41, 59);
          border: 1px solid rgb(71, 85, 105);
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .blog-preview code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }

        /* Smooth transitions */
        * {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  )
}