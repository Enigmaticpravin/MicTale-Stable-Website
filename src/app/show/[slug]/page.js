import { notFound } from "next/navigation"
import ClientForm from "@/app/show/[slug]/ClientForm"
import { supabasePublic } from "@/app/lib/supabase/public"

export const revalidate = 3600

export async function generateStaticParams() {
  const { data } = await supabasePublic
    .from("shows")
    .select("slug")
    .eq("status", "published")

  return (data || []).map(d => ({
    slug: d.slug
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params 

  const { data: show } = await supabasePublic
    .from("shows")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!show) {
    return {
      title: "Show not found — MicTale",
      description: "Show not found"
    }
  }

  const showUrl = `https://mictale.in/show/${encodeURIComponent(show.slug)}`

  return {
    title: show.name,
    description:
      show.description ||
      "Join us for an unforgettable evening of poetry, music and stories.",

    openGraph: {
      title: show.name,
      description: show.description,
      url: showUrl,
      images: [
        {
          url: show.image || "https://mictale.in/images/mobile.webp",
          width: 1200,
          height: 630
        }
      ]
    },

    alternates: { canonical: showUrl },

    twitter: {
      card: "summary_large_image",
      title: show.name,
      description: show.description,
      images: [show.image || "https://mictale.in/images/mobile.webp"]
    }
  }
}

export default async function ShowPage({ params }) {
  const { slug } = await params 

  const { data: showDetails } = await supabasePublic
    .from("shows")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!showDetails) notFound()

  const showUrl = `https://mictale.in/show/${encodeURIComponent(showDetails.slug)}`

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${showDetails.name} by MicTale`,
    startDate: showDetails.start_time,
    endDate: showDetails.end_time,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: showDetails.venue_name,
      address: showDetails.location
    },
    image: showDetails.image,
    description: showDetails.description,
    organizer: {
      "@type": "Organization",
      name: "MicTale",
      url: "https://mictale.in"
    },
    offers: {
      "@type": "Offer",
      url: showUrl,
      price: String(showDetails.price || 0),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />

      <ClientForm showDetails={showDetails} />
    </>
  )
}