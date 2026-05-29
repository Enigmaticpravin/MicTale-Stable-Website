
import Image from 'next/image'
import originallogo from '@/../public/images/MicTale Originals.png'
import BookPoster from '@/app/images/bookcover.webp'
import SoloShow from './components/SoloShow'
import ContactForm from './components/Contact'
import Footer from './components/Footer'
import BannerClient from './components/BannerClient'
import HomeShowsClient from './components/ShowsClient'
import Link from 'next/link'
import { Youtube } from 'lucide-react'
import { supabaseAdmin } from '@/app/lib/supabase/admin'
import ScrollReveal from './components/ScrollReveal'
import HomeLazyComponents from './components/HomeLazyComponents'

export const revalidate = 60

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
        url: "https://res.cloudinary.com/drwvlsjzn/image/upload/v1774941071/join_our_family_nivdaf.png",
        width: 1200,
        height: 630,
        alt: "MicTale Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MicTale | India's Best Creative Platform",
    images: ["https://res.cloudinary.com/drwvlsjzn/image/upload/v1774941071/join_our_family_nivdaf.png"]
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
  sameAs: [
    "https://www.instagram.com/mictale.in",
    "https://www.youtube.com/@mictaleoriginals"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contact@mictale.in"
  }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mictale.in/" }
  ]
}

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "PerformingArtsTheater",
  name: "MicTale Studio",
  image: "https://res.cloudinary.com/drwvlsjzn/image/upload/v1774941071/join_our_family_nivdaf.png",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Sector 64",
    addressLocality: "Noida",
    addressRegion: "UP",
    postalCode: "201301",
    addressCountry: "IN"
  },
  url: "https://www.mictale.in",
  sameAs: [
    "https://www.instagram.com/mictale.in"
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MicTale",
  url: "https://www.mictale.in",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.mictale.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const navigationSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "SiteNavigationElement",
      position: 1,
      name: "Home",
      url: "https://www.mictale.in/"
    },
    {
      "@type": "SiteNavigationElement",
      position: 2,
      name: "About",
      url: "https://www.mictale.in/about"
    },
    {
      "@type": "SiteNavigationElement",
      position: 3,
      name: "Treasury",
      url: "https://www.mictale.in/treasury"
    },
    {
      "@type": "SiteNavigationElement",
      position: 4,
      name: "Terms",
      url: "https://www.mictale.in/terms-and-conditions"
    },
    {
      "@type": "SiteNavigationElement",
      position: 5,
      name: "Privacy Policy",
      url: "https://www.mictale.in/privacy-policy"
    }
  ]
}


export default async function HomePage() {
  const supabase = supabaseAdmin

  const { data: poems } = await supabase
  .from("poems")
  .select("slug, title, author")
  .order("createdAt", { ascending: false })
  .limit(20)

  const { data: poets } = await supabase
  .from("poets")
  .select("slug, name")
  .limit(10)

const { data: shows } = await supabase
  .from("shows")
  .select("*")
  .throwOnError()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />

      <main className="relative min-h-screen bg-slate-950 text-white overflow-hidden">

<h1 className="hidden">
  MicTale – India’s Best Creative Platform for Poetry, Ghazals, and Open Mics
</h1>
       <ScrollReveal>
          <div className="hidden md:block">
                      <Image
                        src="/images/desktophome.png"
                        alt="Banner Desktop"
                        width={1920}
                        height={1080}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
                    
                    <div className="block md:hidden">
                      <Image
                        src="/images/mobilehome.png"
                        alt="Banner Mobile"
                        width={1080}
                        height={608}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
       </ScrollReveal>
        <HomeShowsClient shows={shows || []} />
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

        <div className="bg-gradient-to-b from-slate-900 to-transparent h-4" />
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
        <HomeLazyComponents />
<section className="hidden">
  <h2>Latest Poems</h2>

  {poems?.map((p) => (
    <Link key={p.slug} href={`/poem/${p.slug}`}>
      {p.title} by {p.author}
    </Link>
  ))}
</section>
<section className="hidden">
  <h2>Popular Poets</h2>

  {poets?.map((p) => (
    <Link key={p.slug} href={`/poet/${p.slug}`}>
      {p.name}
    </Link>
  ))}
</section>
        <ScrollReveal>
        <ContactForm />
</ScrollReveal>
        <Footer />
<Link href="/about" className='hidden'>About MicTale</Link>
<Link href="/treasury" className='hidden'>Explore Treasury</Link>
<Link href="/terms-and-conditions" className='hidden'>Terms</Link>
<Link href="/privacy-policy" className='hidden'>Privacy</Link>
      </main>
    </>
  )
}
