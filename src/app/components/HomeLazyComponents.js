'use client'

import dynamic from 'next/dynamic'

const StoryboardGallery = dynamic(() => import('./StoryboardGallery'), {
  ssr: false
})

const YouTubeChannelComponent = dynamic(() => import('./YouTubeChannelComponent'), {
  ssr: false
})

const TopPerformers = dynamic(() => import('./TopPerformers'), {
  ssr: false
})

export default function HomeLazyComponents() {
  return (
    <>
      <TopPerformers />
 
       <div className="bg-gradient-to-b from-transparent to-slate-900 h-10" />
      <StoryboardGallery />
       <div className="bg-gradient-to-b from-slate-900 to-transparent h-10" />
      <YouTubeChannelComponent />
    </>
  )
}