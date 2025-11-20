'use client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function BannerClient({ bookPoster }) {
  const router = useRouter()

  function handleClick(e) {
    const { clientX, clientY, target } = e
    const w = target.clientWidth
    const h = target.clientHeight
    const mobile = window.innerWidth < 768

    let choice

    if (mobile) {
      choice =
        clientY < h / 2
          ? { slug: 'kaalikh-author-signed-paperback-by-pravin-gupta' }
          : { slug: 'he-is-a-hero-he-raped-by-anubhav-singh' }
    } else {
      choice =
        clientX < w / 2
          ? { slug: 'he-is-a-hero-he-raped-by-anubhav-singh' }
          : { slug: 'kaalikh-author-signed-paperback-by-pravin-gupta' }
    }

    router.push(`/book/${choice.slug}`)
  }

  return (
    <div className="relative mx-auto md:px-6">
      <div className="w-full" onClick={handleClick}>
        <Image
          src={bookPoster}
          alt="Book Cover"
          className="w-full h-auto rounded-2xl hidden md:flex cursor-pointer"
          width={1200}
          height={630}
          priority
          fetchPriority="high"
          quality={75}
          sizes="(max-width: 768px) 100vw, 1200px"
        />
        <Image
          src="/images/mobilebanner.webp"
          alt="Book Cover"
          className="w-full h-auto rounded-2xl flex md:hidden cursor-pointer"
          width={475}
          height={704}
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
        />

      </div>
    </div>
  )
}
