
import Image from 'next/image'
import phone from '@/../public/images/phone.png'
import desktop from '@/../public/images/desktop.png'

export const metadata = {
  title: "MicTale | India’s Best Creative Platform",
  description:
    "MicTale is India's leading open mic platform for poetry, comedy, storytelling, and music performances.",
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
 <Image src={desktop} alt="..." className="hidden md:block w-full h-auto" />
<Image src={phone} alt="..." className="block md:hidden w-full h-auto" />

      </main>
    </>
  )
}
