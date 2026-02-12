
import Image from 'next/image'
import originallogo from '@/../public/images/MicTale Originals.png'
import BookPoster from '@/app/images/bookcover.webp'
import SoloShow from './components/SoloShow'
import StoryboardGallery from './components/StoryboardGallery'
import TopPerformers from './components/TopPerformers'
import YouTubeChannelComponent from './components/YouTubeChannelComponent'
import ContactForm from './components/Contact'
import Footer from './components/Footer'

import BannerClient from './components/BannerClient'
import { Youtube } from 'lucide-react'
import ScrollReveal from './components/ScrollReveal'

export const metadata = {
  title: "MicTale | India’s Best Creative Platform",
  description:
    "MicTale is India's leading creative platform for poetry, comedy, storytelling, and music performances.",
  keywords:
    "MicTale, poetry, poem, ghazal, nazm, hindi, urdu, comedy, music, open mic, spoken word",
  authors: [{ name: "MicTale" }],
  openGraph: {
    title: "MicTale | India’s Best Creative Platform",
    description:
      "Join MicTale, a platform for artists, poets, and performers.",
    url: "https://www.mictale.in/",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/YFpScQU.png",
        width: 1200,
        height: 630,
        alt: "MicTale Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MicTale | Best Creative Platform",
    images: ["https://i.imgur.com/YFpScQU.png"]
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.mictale.in/" },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192" },
      { url: "/icon-512.png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ]
  },
  manifest: "/site.webmanifest",
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "MicTale",
  url: "https://www.mictale.in",
  logo: "https://i.imgur.com/YFpScQU.png",
  description: "MicTale is a new-age open mic platform.",
  sameAs: [
    "https://www.instagram.com/mictale.in",
    "https://www.youtube.com/@mictaleoriginals"
  ]
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mictale.in/" }
  ]
}

const navigationSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Main Navigation",
  url: "https://www.mictale.in/"
}


export default async function HomePage() {

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }} />

      <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

       <ScrollReveal>
        <BannerClient bookPoster={BookPoster} />
       </ScrollReveal>
       <ScrollReveal>
        <div className="bg-gradient-to-b from-transparent to-slate-900 h-10" />
        <section id="solo-show" className="md:pb-0 bg-slate-900">
          <div className="flex flex-col mb-3 md:mb-10 items-center">
            <p className="uppercase bg-clip-text text-transparent bg-gradient-to-t text-[12px] md:text-[18px] font-bold from-yellow-700 via-yellow-500 to-yellow-900">
              we did our first
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-t text-2xl md:text-4xl font-semibold text-center from-slate-200 via-gray-400 to-white elsie-regular">
              Solo Poetry Show
            </p>
          </div>

          <SoloShow />
        </section>
        </ScrollReveal>

        <div className="bg-gradient-to-b from-slate-900 to-transparent h-10" />
        <ScrollReveal>
        <div className="flex flex-col mx-2 rounded-2xl md:flex-row bg-white items-center justify-between py-5 px-5 bg-cover bg-center bg-no-repeat gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <Image src={originallogo} alt="MicTale Logo" className="w-24 h-auto sm:w-28" />
            <p className="text-black text-[10px] md:text-[16px]">is now running live on YouTube.</p>
          </div>

         <a 
            href="https://www.youtube.com/@mictaleoriginals" 
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <button className="relative cursor-pointer px-4 py-1 md:px-8 md:py-4 text-xs md:text-base font-semibold rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <span className="relative flex items-center gap-2">
                <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                Subscribe Now
              </span>
            </button>
          </a>
        </div>
        </ScrollReveal>
        <ScrollReveal>
        <TopPerformers />
        </ScrollReveal>

        <div className="bg-gradient-to-b to-slate-900 from-transparent h-10" />
<ScrollReveal>
        <StoryboardGallery />
</ScrollReveal>

        <div className="bg-gradient-to-b from-slate-900 to-transparent h-10" />

        <YouTubeChannelComponent />

        <div className="bg-gradient-to-b to-slate-950 from-transparent h-10" />

<ScrollReveal>
        <ContactForm />
</ScrollReveal>
        <Footer />

      </main>
    </>
  )
}
