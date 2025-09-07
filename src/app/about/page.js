import AboutClient from './AboutClient'

export const metadata = {
  title: 'About Us – MicTale',
  description: "Learn about the vision, journey, and mission of MicTale – India’s leading open mic platform for poets, performers, and storytellers.",
  keywords: [
    'MicTale', 'Open Mic India', 'Poetry Platform', 'Spoken Word', 'Storytelling',
    'Artist Growth', 'Mentorship', 'Creative Events', 'Performance Stage'
  ],
  authors: [{ name: 'MicTale' }],
  alternates: { canonical: 'https://www.mictale.in/about' },
  openGraph: {
    title: "About MicTale – India's Best Creative Platform",
    description: "Learn how MicTale is redefining India's open mic scene by providing artists with growth, exposure, and a powerful stage to perform.",
    url: 'https://www.mictale.in/about',
    siteName: 'MicTale',
    images: [
      {
        url: 'https://i.imgur.com/WcNbK7B.png',
        alt: 'MicTale logo and stage'
      }
    ],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: "About MicTale – India's Best Creative Platform",
    description: 'MicTale supports poets, storytellers, and performers with curated stages, mentorship, and a vibrant artist community.',
    images: ['https://i.imgur.com/WcNbK7B.png']
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
  }
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MicTale",
    "url": "https://www.mictale.in/about",
    "logo": "https://i.imgur.com/PgDBhIz.png",
    "description": "MicTale is an Open Mic platform offering stage opportunities, mentorship, and creative growth for emerging artists.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Pravin Gupta",
        "jobTitle": "Founder",
        "image": "https://i.imgur.com/PgDBhIz.png"
      }
    ],
    "sameAs": [
      "https://www.youtube.com/@mictaleoriginals",
      "https://www.instagram.com/mictale.in"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  )
}
