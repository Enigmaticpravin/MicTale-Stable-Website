"use client"

import Image from "next/image"
import Link from "next/link"

export default function HomeShowsClient({ shows = [] }) {
  if (!shows.length) return null

  return (
    <>
    <div className="flex flex-col mt-10 mb-3 md:mb-10 items-center">
            <p className="uppercase bg-clip-text text-transparent bg-gradient-to-t text-[12px] md:text-[18px] font-bold from-yellow-700 via-yellow-500 to-yellow-900">
              Events happening at
            </p>
            <Image 
            src="/images/studio_logo_white.png" 
            alt="Mictale Logo" 
            width={200} 
            height={50} 
            className="w-auto -mt-1 h-10 md:h-16" />
          </div>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-6 md:px-20 lg:px-40 w-full pb-10">
        {shows.map((show) => (
  <Link key={show.id} href={`/show/${show.slug}`} className="group relative block">
    {/* Image Container */}
    <div className="relative overflow-hidden rounded-lg">
      <Image
        src={show?.poster_url || "/placeholder-poster.png"}
        alt={show?.name || "Show Poster"}
        width={400}
        height={200}
        className="w-full h-auto aspect-4/5 object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {show.status === 'upcoming' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="relative p-[1px] rounded-full overflow-hidden flex items-center justify-center shadow-[0_0_15px_rgba(184,134,11,0.4)]">
            
            <div className="absolute inset-[-400%] animate-[spin_6s_linear_infinite] 
              bg-[conic-gradient(from_0deg,#d4af37_0%,#f9f1c2_15%,#b8860b_30%,#fbf5b7_45%,#aa8239_60%,#f9f1c2_75%,#d4af37_100%)]" />
            
            <div className="relative px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#d4af37]"></span>
              </span>

              <span className="font-black tracking-[0.2em] uppercase text-[9px] 
                               bg-gradient-to-b from-[#f9f1c2] via-[#d4af37] to-[#aa8239] bg-clip-text text-transparent">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  </Link>
))}
    </div>
    </>
  )
}