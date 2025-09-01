// app/about/page.jsx
import AboutClient from './AboutClient'

export const metadata = {
  title: 'About Us – MicTale',
  description: "Learn about the vision, journey, and mission of MicTale – India’s leading open mic platform for poets, performers, and storytellers.",
  keywords: [
    'MicTale', 'Open Mic India', 'Poetry Platform', 'Spoken Word', 'Storytelling',
    'Artist Growth', 'Mentorship', 'Creative Events', 'Performance Stage'
  ],
  authors: [{ name: 'MicTale' }],
  alternates: { canonical: 'https://mictale.in/about' },
  openGraph: {
    title: 'About MicTale – Open Mic Platform for Performers & Creatives',
    description: "Learn how MicTale is redefining India's open mic scene by providing artists with growth, exposure, and a powerful stage to perform.",
    url: 'https://mictale.in/about',
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
    title: "About MicTale – India's Best Platform for Open Mic Artists",
    description: 'MicTale supports poets, storytellers, and performers with curated stages, mentorship, and a vibrant artist community.',
    images: ['https://i.imgur.com/WcNbK7B.png']
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-32x32.png'
  }
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MicTale",
    "url": "https://mictale.in",
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
        // server side JSON-LD injection
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutClient />
    </>
  )
}
