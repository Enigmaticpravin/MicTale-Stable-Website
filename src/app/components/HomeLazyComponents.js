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
      <StoryboardGallery />
      <YouTubeChannelComponent />
    </>
  )
}