import HeroSection from '@/app/components/HeroSection'
import CategoriesSection from '@/app/components/CategoriesSection'
import ExperienceSection from '@/app/components/ExperienceSection'
import StatsSection from '@/app/components/StatsSection'
import BookingSteps from '@/app/components/BookingSteps'
import PricingSection from '@/app/components/PricingSection'
import AmenitiesSection from '@/app/components/AmenitiesSection'
import Footer from '@/app/components/Footer'
import MobileBanner from './components/MobileBanner'

export const metadata = {
  title:
    'MicTale Studio | Event Venue in Delhi NCR for Poetry Shows, Book Launches & Creative Events',

  description:
    'Host poetry shows, book launches, workshops, storytelling sessions and creative events at MicTale Studio.',

  keywords: [
    'event venue delhi',
    'event venue noida',
    'poetry venue delhi',
    'book launch venue',
    'creative venue',
    'open mic venue',
    'storytelling venue',
    'mictale',
    'workshop venue',
    'mictale studio'
  ],

  alternates: {
    canonical: 'https://www.mictale.in/rent_mictale_studio'
  },

  openGraph: {
    title: 'MicTale Studio',
    description:
      'Creative event venue in Delhi NCR.',
    images: ['/images/studio.jpg']
  }
}

export default function StudioPage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EventVenue',
            name: 'MicTale Studio',
            url: 'https://www.mictale.in/rent_mictale_studio',
            telephone: '+919667645676'
          })
        }}
      />

      <div className='bg-slate-950 text-[#f5f5f7] min-h-screen'>
        <div className='hidden md:block'>
          <HeroSection />
        </div>

        <div className='block md:hidden'>
          <MobileBanner />
        </div>

        <CategoriesSection />
        <ExperienceSection />
        <StatsSection />
        <BookingSteps />

        <section id='pricing-section'>
          <PricingSection />
        </section>

        <AmenitiesSection />
        <Footer />
      </div>
    </>
  )
}