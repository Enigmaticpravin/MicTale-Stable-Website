import Image from "next/image"
import { Fraunces, Caveat, Inter } from "next/font/google"
import { 
  Mountain, 
  Coffee, 
  Mic, 
  Clapperboard, 
  Camera, 
  Users, 
  Compass, 
  Sun, 
  ClipboardList 
} from "lucide-react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

const BOOKING_URL = "#book"
const INSTAGRAM_URL = "https://instagram.com"

const borderPattern =
  "repeating-linear-gradient(135deg,#ffffff 0 18px,#173d78 18px 36px,#ffffff 36px 54px,#e51c2b 54px 72px)"

const sideBorderPattern =
  "repeating-linear-gradient(45deg,#ffffff 0 18px,#173d78 18px 36px,#ffffff 36px 54px,#e51c2b 54px 72px)"

export const metadata = {
  title: "Mic on the Mountains",
  description:
    "MicTale presents Mic on the Mountains — a poetic mountain retreat for artists and creators, 9 to 11 October in Mussoorie. Open mic, a bonfire baithak and a trek to Cloud's End. Only 12 spots.",
  openGraph: {
    title: "Mic on the Mountains | MicTale",
    description:
      "A poetic mountain retreat for artists and creators — 9 to 11 October in Mussoorie.",
    type: "website",
    images: ["/images/title.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mic on the Mountains | MicTale",
    description:
      "A poetic mountain retreat for artists and creators — 9 to 11 October in Mussoorie.",
    images: ["/images/title.png"],
  },
}

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Mic & Mountains: A Poetic Mountain Retreat by MicTale",
  startDate: "2026-10-09",
  endDate: "2026-10-11",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "goSTOPS Mussoorie",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mussoorie",
      addressRegion: "Uttarakhand",
      addressCountry: "IN",
    },
  },
  organizer: { "@type": "Organization", name: "MicTale" },
  offers: [
    { "@type": "Offer", name: "Dormitory", price: "2499", priceCurrency: "INR" },
    { "@type": "Offer", name: "Private room, shared bed", price: "3999", priceCurrency: "INR" },
    { "@type": "Offer", name: "Private room, exclusive", price: "6499", priceCurrency: "INR" },
  ],
}

const itinerary = [
  {
    day: "Day 1",
    date: "9 Oct",
    title: "Arrival, and the first circle",
    text: "Make your way up to goSTOPS Mussoorie. Unpack, breathe the thinner air, and meet the strangers you'll be sharing a mountain with. We close the day with a slow welcome circle as the valley goes dark.",
    accent: "#173d78",
  },
  {
    day: "Day 2",
    date: "10 Oct",
    title: "Open Mic, then Baithak",
    text: "Daylight is for the mic — bring your poem, your song, the story you've been carrying around too long. After dark the bonfire takes over: warm conversations, music, and a night that doesn't really ask to end.",
    accent: "#e51c2b",
  },
  {
    day: "Day 3",
    date: "11 Oct",
    title: "The walk to Cloud's End",
    text: "We leave the noise behind for good and trek out to Cloud's End. The walk becomes part of the retreat itself — a quiet, shared way to close a weekend that started with strangers and ends with a story.",
    accent: "#2f4f3e",
  },
]

const inclusions = [
  { icon: Mountain, text: "2 nights' stay at goSTOPS Mussoorie" },
  { icon: Coffee, text: "Daily breakfast" },
  { icon: Mic, text: "Your spot at the Open Mic" },
  { icon: Clapperboard, text: "Full video of the retreat's key sessions" },
  { icon: Camera, text: "Professional photography throughout" },
  { icon: Users, text: "Creator networking & community sessions" },
  { icon: Compass, text: "Curated retreat experiences & group sessions" },
  { icon: Sun, text: "Morning and evening group sessions" },
  { icon: ClipboardList, text: "Full retreat coordination by MicTale" },
]

const exclusions = [
  "Travel to and from Mussoorie",
  "Lunch and dinner",
  "Personal expenses",
  "Anything not specifically listed under inclusions",
]

const tiers = [
  {
    name: "Dormitory",
    price: "2,499",
    desc: "A shared dorm bed at goSTOPS — same retreat, easiest way in.",
    best: true,
  },
  {
    name: "Private room, shared",
    price: "3,999",
    desc: "A bed of your own inside a private room, split with one other guest.",
    best: false,
  },
  {
    name: "Private room, exclusive",
    price: "6,499",
    desc: "The whole room, kept just for you, for the full retreat.",
    best: false,
  },
]

export default function RetreatPage() {
  return (
    <main
      style={{ fontFamily: "var(--font-body)" }}
      className={`${fraunces.variable} ${caveat.variable} ${inter.variable} relative min-h-screen w-full max-w-full overflow-x-clip text-[#173d78]`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <Hero />
      <Experience />
      <Itinerary />
        <StayExperience />
      <Package />
      <Closing />
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-50
          overflow-hidden
          rounded-t-[22px]
          md:rounded-t-[32px]
        "
      >
        <div
          className="
            absolute
            left-0
            right-0
            top-0
            h-[10px]
            md:h-[14px]
          "
          style={{
            backgroundImage: borderPattern,
          }}
        />


        <div
          className="
            absolute
            bottom-0
            left-0
            top-0
            w-[10px]
            md:w-[14px]
          "
          style={{
            backgroundImage: sideBorderPattern,
          }}
        />


        <div
          className="
            absolute
            bottom-0
            right-0
            top-0
            w-[10px]
            md:w-[14px]
          "
          style={{
            backgroundImage: sideBorderPattern,
          }}
        />

        <div
          className="
            absolute
            left-0
            top-0
            h-[32px]
            w-[32px]
            rounded-tl-[22px]
            border-l-[10px]
            border-t-[10px]
            border-transparent
            md:h-[46px]
            md:w-[46px]
            md:rounded-tl-[32px]
            md:border-l-[14px]
            md:border-t-[14px]
          "
        />

        <div
          className="
            absolute
            right-0
            top-0
            h-[32px]
            w-[32px]
            rounded-tr-[22px]
            border-r-[10px]
            border-t-[10px]
            border-transparent
            md:h-[46px]
            md:w-[46px]
            md:rounded-tr-[32px]
            md:border-r-[14px]
            md:border-t-[14px]
          "
        />
      </div>
    </main>
  )
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden text-center">
      <SkyBackdrop />

      <div className="flex w-full flex-col items-center gap-4 md:gap-7 -mt-20">
        <Image
          src="/images/partners.png"
          alt="MicTale and retreat partners"
          width={1080}
          height={200}
          priority
          quality={100}
          sizes="(max-width: 768px) 580px, 640px"
          className="h-auto w-[580px] md:w-[640px]"
        />
<h1 className="w-full">
          <Image
            src="/images/titl.png"
            alt="Mic on the Mountains — a poetic mountain retreat by MicTale"
            width={2080}
            height={700}
            priority
            sizes="(max-width: 800px) 100vw, 700px"
            className="mx-auto h-auto w-full max-w-[700px]"
          />
        </h1>

        <p className="mx-auto max-w-2xl text-lg tracking-widest text-black -mt-5 -mb-8">A 3-DAY MOUNTAIN RETREAT PROGRAMME</p>

        <Image
          src="/images/dates.png"
          alt="9 to 11 October, Mussoorie"
          width={1080}
          height={200}
          priority
          sizes="(max-width: 768px) 80vw, 520px"
          className="mx-auto h-auto w-[80%] max-w-[520px]"
        />

      <div className="flex flex-col items-center gap-4">
  <a
    href={BOOKING_URL}
    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-[#173d78] via-[#0f2750] to-[#071329] px-10 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_14px_30px_-10px_rgba(23,61,120,0.6)] transition-all duration-500 hover:scale-[1.04] hover:border-white hover:shadow-[0_20px_40px_-12px_rgba(23,61,120,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173d78]"
  >
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
    
    {/* Text and Icon Container */}
    <span className="relative uppercase tracking-widest flex items-center gap-2">
      Reserve your seat
      
      <svg 
        className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1.5" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </span>
  </a>
</div>
      </div>
    </section>
  )
}

function SkyBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 rounded-t-[22px] md:rounded-t-[32px] overflow-hidden">
      <div className="absolute inset-0 bg-[#a9c2ce]" />
      <div className="absolute -left-[15%] top-[6%] h-[16%] w-[70%] rotate-[-4deg] rounded-full bg-[#dce8ed]/75 blur-[16px]" />
      <div className="absolute -right-[18%] top-[20%] h-[15%] w-[68%] rotate-[3deg] rounded-full bg-[#d4e3e9]/70 blur-[18px]" />
      <div className="absolute -left-[20%] top-[38%] h-[14%] w-[72%] rotate-[-3deg] rounded-full bg-[#dce9ee]/65 blur-[18px]" />
      <div className="absolute -right-[15%] top-[56%] h-[15%] w-[70%] rotate-[4deg] rounded-full bg-[#d7e7ed]/65 blur-[20px]" />
      <div className="absolute -left-[15%] top-[74%] h-[14%] w-[68%] rotate-[2deg] rounded-full bg-[#c8dfe8]/60 blur-[18px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f4efe4]" />
    </div>
  )
}

function Experience() {
  return (
    <section className="relative px-6 py-24 md:py-32 bg-[#f4efe4]">
      <PaperGrain />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2
          className="text-4xl leading-tight md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Come for the mountains.
          <br />
          Stay for the stories.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[#173d78]/75">
          A slow weekend away from the noise. A place to meet strangers, hear
          stories, perform, listen, and simply exist for a while — somewhere the
          air is thinner and the conversations run longer.
        </p>
      </div>
    </section>
  )
}
function Itinerary() {
  return (
    <section className="relative px-6 py-24 md:py-32 bg-[#f4efe4]">
      <PaperGrain />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three days, one story
          </h2>
          <p className="mt-4 text-base text-[#173d78]/70">
            A rough shape for the weekend — postcards from a trip you haven't
            taken yet.
          </p>
        </div>

        <div className="flex flex-col gap-14 md:gap-10">
          {itinerary.map((item, i) => (
            <Postcard key={item.day} item={item} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StayExperience() {
  const stayImages = [
    {
      src: "https://gostops.com/_next/image?url=https%3A%2F%2Fdon5wql5ofws9.cloudfront.net%2Fmedia%2Fimages%2F1_NFTUOJv.webp&w=2048&q=75",
      alt: "goSTOPS Mussoorie stay",
      className: "md:col-span-2 md:row-span-2 h-[340px] md:h-full",
    },
    {
      src: "https://media.easemytrip.com/media/Hotel/SHL-2509041283031464/Hotel/HotellUCc4z.png",
      alt: "Shared hostel common area",
      className: "h-[220px]",
    },
    {
      src: "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202508191756424123-e5904199-2748-4f38-83aa-6898017e8032.jpg",
      alt: "Comfortable room",
      className: "h-[220px]",
    },
    {
      src: "https://don5wql5ofws9.cloudfront.net/media/events+and+experiences/gocinema+movie+night.webp",
      alt: "Cozy accommodation",
      className: "h-[220px]",
    },
    {
      src: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/749582593.jpg?k=1a1d3c254ff9a36747164f5361a3dc676bf1e23ef23326b4b9cabf93971254bc&o=",
      alt: "Friends spending time together",
      className: "h-[220px]",
    },
  ]

  return (
    <section className="relative overflow-hidden bg-[#f4efe4] px-6 py-24 md:py-32">
      <PaperGrain />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p
            className="mb-3 text-sm uppercase tracking-[0.22em] text-[#e51c2b]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your home in the hills
          </p>

          <h2
            className="text-4xl leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Know your staying
            <br />
            <span className="italic">experience.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#173d78]/70 md:text-lg">
            For three days, goSTOPS Mussoorie becomes more than just a place
            to sleep. It is where we meet, eat, talk, make things, stay up
            late and let the mountain slow us down.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          {stayImages.map((image, index) => (
            <div
              key={image.src}
              className={`group relative overflow-hidden rounded-[6px] border border-[#173d78]/15 bg-[#fbf7ee] shadow-[0_18px_40px_-28px_rgba(23,61,120,0.65)] ${image.className}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* subtle paper overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#173d78]/30 via-transparent to-white/5 opacity-70" />

            </div>
          ))}
        </div>

        {/* Property experience */}
        <div className="mt-16 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div className="relative">
            <div className="absolute -left-2 top-2 h-full w-full rotate-[-1deg] border border-dashed border-[#e51c2b]/25" />

            <div className="relative border border-[#173d78]/15 bg-[#fbf7ee] px-7 py-8 shadow-[0_18px_40px_-30px_rgba(23,61,120,0.55)] md:px-9 md:py-10">
              <p
                className="text-3xl leading-tight md:text-4xl"
                style={{ fontFamily: "var(--font-hand)" }}
              >
                Not just a bed.
                <br />
                A place to belong
                <br />
                for a little while.
              </p>

              <div className="mt-7 h-px w-16 border-t border-dashed border-[#173d78]/30" />

              <p className="mt-5 text-sm leading-relaxed text-[#173d78]/60">
                Your stay is designed around the people and stories that make
                the retreat what it is.
              </p>
            </div>
          </div>

          <div>
            <p
              className="mb-3 text-xs uppercase tracking-[0.2em] text-[#173d78]/45"
              style={{ fontFamily: "var(--font-display)" }}
            >
              While we're at goSTOPS
            </p>

            <h3
              className="text-3xl leading-tight md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The property becomes
              <br />
              part of the retreat.
            </h3>

            <p className="mt-5 text-base leading-relaxed text-[#173d78]/70">
              We are not coming to Mussoorie just to check into a room and
              leave. During the retreat, the goSTOPS property will be our
              little basecamp — the place where the weekend actually unfolds.
            </p>

            <div className="mt-8 grid gap-0 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Open Mic",
                  text: "A dedicated evening where poems, music, stories and voices take over the property.",
                },
                {
                  number: "02",
                  title: "Bonfire Baithak",
                  text: "A slower night around the fire — conversations, music and the kind of stories that happen naturally.",
                },
                {
                  number: "03",
                  title: "Creator Circle",
                  text: "Meet fellow artists, creators and curious people and actually spend time with them.",
                },
                {
                  number: "04",
                  title: "Slow Mornings",
                  text: "Breakfast, conversations and enough breathing room before we head into the day's plans.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="border-b border-dashed border-[#173d78]/20 py-5 first:pt-0 sm:even:pl-7 sm:odd:pr-7"
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="mt-0.5 text-xs text-[#e51c2b]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {item.number}
                    </span>

                    <div>
                      <h4
                        className="text-xl"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </h4>

                      <p className="mt-2 text-sm leading-relaxed text-[#173d78]/60">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-14 text-center">
          <p
            className="text-xl text-[#173d78]/75 md:text-2xl"
            style={{ fontFamily: "var(--font-hand)" }}
          >
            Come with a backpack. Leave with a few more people in your story.
          </p>
        </div>
      </div>
    </section>
  )
}

function Postcard({ item, reversed }) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[6px] border border-[#173d78]/15 bg-[#fbf7ee] shadow-[0_20px_45px_-28px_rgba(23,61,120,0.5)] md:flex-row ${
        reversed ? "md:flex-row-reverse md:rotate-[0.6deg]" : "md:rotate-[-0.6deg]"
      }`}
    >
      <div
        className="flex shrink-0 flex-col items-center justify-center gap-3 px-8 py-10 text-white md:w-56"
        style={{ backgroundColor: item.accent }}
      >
        <span
          className="text-xs uppercase tracking-[0.2em] opacity-85"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.day}
        </span>
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-white/70 text-sm"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.date}
        </span>
      </div>

      <div className="flex-1 border-t border-dashed border-[#173d78]/20 px-8 py-10 md:border-l md:border-t-0 md:px-12">
        <h3
          className="text-2xl md:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {item.title}
        </h3>
        <p
          className="mt-4 max-w-xl text-xl leading-relaxed text-[#173d78]/80"
          style={{ fontFamily: "var(--font-hand)" }}
        >
          {item.text}
        </p>
      </div>
    </article>
  )
}
function Package() {
  return (
    <section className="relative px-6 py-24 md:py-32 bg-[#f4efe4]">
      <PaperGrain />
      <div className="relative mx-auto max-w-5xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2
            className="text-4xl md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            What's inside your stay
          </h2>
          <p className="mt-4 text-base text-[#173d78]/70">
            Everything you need for the weekend, coordinated end to end by
            MicTale.
          </p>
        </div>

       <ul className="mx-auto grid max-w-3xl grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
  {inclusions.map((item) => {
    const Icon = item.icon;
    return (
      <li
        key={item.text}
        className="flex items-start gap-3 border-b border-dotted border-[#173d78]/20 pb-4 text-left"
      >
       
        <span className="mt-0.5 flex-shrink-0 text-[#173d78]">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        <span className="text-[15px] leading-snug text-[#173d78]/85">
          {item.text}
        </span>
      </li>
    );
  })}
</ul>

        <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
          {tiers.map((tier) => (
            <TicketCard key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl border-t border-dashed border-[#173d78]/20 pt-8 text-center">
          <p
            className="mb-3 text-sm uppercase tracking-[0.18em] text-[#173d78]/50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Not included
          </p>
          <ul className="flex flex-col gap-1.5 text-sm text-[#173d78]/60">
            {exclusions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function TicketCard({ tier }) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[6px] border border-dashed p-7 ${
        tier.best
          ? "border-[#e51c2b]/50 bg-[#fbf7ee] shadow-[0_18px_38px_-20px_rgba(229,28,43,0.4)]"
          : "border-[#173d78]/20 bg-[#fbf7ee]/70"
      }`}
    >
      {tier.best && (
        <span
          className="absolute -right-3 -top-3 rotate-12 rounded-sm border-2 border-[#e51c2b] bg-[#fbf7ee] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#e51c2b]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Best value
        </span>
      )}

      <div>
        <p className="text-lg" style={{ fontFamily: "var(--font-display)" }}>
          {tier.name}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#173d78]/65">
          {tier.desc}
        </p>
      </div>

      <div className="mt-8 flex items-end justify-between border-t border-dotted border-[#173d78]/20 pt-5">
        <p className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>
          ₹{tier.price}
        </p>
        <p className="pb-1 text-xs text-[#173d78]/55">per person</p>
      </div>
    </div>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f4efe4] via-[#cfdee6] to-[#a9c2ce]" />

      <div className="mx-auto max-w-2xl px-6 pt-28 text-center md:pt-36">
        <h2
          className="text-4xl md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          See you in Mussoorie.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base text-[#173d78]/75">
          Twelve spots, one weekend, and a set of stories you won't get back in
          the city.
        </p>

        <a
          href={BOOKING_URL}
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[#e51c2b] px-9 py-4 text-sm font-medium text-white shadow-[0_16px_34px_-14px_rgba(229,28,43,0.6)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173d78]"
        >
          Book your spot
        </a>

        <p className="mt-6 text-xs text-[#173d78]/55">
          Questions first? Reach us on{" "}
          <a
            href={INSTAGRAM_URL}
            className="underline underline-offset-2 hover:text-[#173d78]"
          >
            Instagram
          </a>
          .
        </p>

        <div className="mt-8 relative z-10">
          <Image
            src="/images/logo.png"
            alt="MicTale logo"
            width={120}
            height={120}
            className="mx-auto h-auto w-[120px] invert"
          />
          <p className="mt-4 text-[11px] text-[#173d78]/40">
            © {new Date().getFullYear()} MicTale. All rights reserved.
          </p>
        </div>
      </div>

      <Image
        src="/images/retreat/hill.png"
        alt=""
        aria-hidden="true"
        width={1920}
        height={240}
        sizes="100vw"
        className="pointer-events-none block z-80 h-auto w-full max-w-full select-none -mt-12 md:-mt-60 relative"
      />
    </section>
  );}

function PaperGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background-image:radial-gradient(circle_at_1px_1px,rgba(23,61,120,0.05)_1px,transparent_0)] [background-size:14px_14px]"
    />
  )
}