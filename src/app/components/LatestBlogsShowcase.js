import React from 'react'
import LatestBlogsClient from './LatestBlogsClient'
import { getLatestBlogs } from '../lib/database';

export default async function LatestBlogsShowcase({ limit = 7 }) {
  try {
     const blogs = await getLatestBlogs(limit);
 return <LatestBlogsClient blogs={blogs} />;
  } catch (err) {
    console.error('[LatestBlogsShowcase] fetch error:', err)

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-white/70">
        <div className="text-sm">Could not load latest blogs.</div>
        <div className="mt-2 text-xs text-white/40">
          Error: {err.message || 'unknown'}
        </div>
      </div>
    )
  }
}
