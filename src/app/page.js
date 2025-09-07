import ClientHome from './ClientHome'

export const metadata = {
  title: "MicTale | India’s Best Creative Platform",
  description:
    "MicTale is India's leading open mic platform for poetry, comedy, storytelling, and music performances. Discover events, showcase your talent, and be part of a thriving artistic community.",
  keywords:
    "MicTale, poetry, poem, ghazal, nazm, hindi, urdu, comedy, music, open mic platform, poetry platform, Indian art, poetry events, creative performances, open mic events, artists in India",
  authors: [{ name: "MicTale" }],
  openGraph: {
    title: "MicTale | India’s Best Creative Platform",
    description:
      "Join MicTale, a platform for artists, poets, and performers to share their creativity and redefine the dynamics of art and performance in India.",
    url: "https://www.mictale.in/",
    type: "website",
    images: [
      {
        url: "https://i.imgur.com/YFpScQU.png",
        width: 1200,
        height: 630,
        alt: "MicTale Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MicTale | India’s Best Creative Platform",
    description:
      "Discover MicTale, the new-age open mic platform redefining art and performance in India. A space for poetry, creativity, and connection.",
    images: ["https://i.imgur.com/YFpScQU.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.mictale.in/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
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
  description:
    "MicTale is a new-age open mic platform transforming the art and performance landscape in India. Join us to celebrate poetry, creativity, and connection.",
  sameAs: [
    "https://www.instagram.com/mictale.in",
    "https://www.youtube.com/@mictaleoriginals",
  ],
  keywords: "open mic, poetry, spoken word, storytelling, live performance, MicTale",
  foundingDate: "2024",
  founder: [
    {
      "@type": "Person",
      name: "Pravin Gupta",
      jobTitle: "Founder & CTO",
      sameAs: [
        "https://www.linkedin.com/in/enigmaticpravin",
        "https://www.instagram.com/enigmaticpravin",
        "https://twitter.com/enigmaticpravin",
        "https://www.facebook.com/enigmaticpravin",
      ],
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9667645676",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
  openingHours: "Mo-Su 10:00-22:00",
  areaServed: "India",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.mictale.in/" },
    { "@type": "ListItem", position: 2, name: "Treasury", item: "https://www.mictale.in/treasury" },
    { "@type": "ListItem", position: 3, name: "About Us", item: "https://www.mictale.in/about" },
  ],
}

const navigationSchema = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Main Navigation",
  url: "https://www.mictale.in/",
  hasPart: [
    { "@type": "SiteNavigationElement", name: "About Us", url: "https://www.mictale.in/about" },
    { "@type": "SiteNavigationElement", name: "Events", url: "https://www.mictale.in/treasury" },
    { "@type": "SiteNavigationElement", name: "Terms & Conditions", url: "https://www.mictale.in/terms-and-conditions" },
    { "@type": "SiteNavigationElement", name: "Privacy Policy", url: "https://www.mictale.in/privacy-policy" },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
      />

      <ClientHome />
    </>
  )
}
