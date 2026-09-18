"use client"

import Image from "next/image"
import { useRef } from "react"

import {
  useRetreatTransition,
} from "./RetreatTransitionProvider"

export default function RetreatBanner() {
  const bannerRef = useRef(null)

  const {
    openRetreat,
  } = useRetreatTransition()

  const handleClick = () => {
    if (!bannerRef.current) return

    openRetreat(bannerRef.current)
  }

  return (
    <div className="relative w-full">

      <button
        ref={bannerRef}
        onClick={handleClick}
        aria-label="Open Mic on the Mountains retreat"
        className="
          group
          relative
          block
          w-full
          cursor-pointer
          overflow-hidden
          rounded-2xl
          border-0
          p-0
          outline-none
        "
      >

        <div
          className="
            relative
            aspect-[1920/640]
            w-full
            overflow-hidden
            rounded-2xl
            bg-[#a9bfcb]
          "
        >

          {/* BACKGROUND */}

          <div className="absolute inset-0 bg-[#a9bfcb]" />


          {/* TITLE */}

          <Image
            src="/images/retreat/title.png"
            alt="Mic on the Mountains"
            fill
            priority
            sizes="100vw"
            data-retreat-title
            className="
              absolute
              inset-0
              z-10
              object-contain
            "
          />


          {/* DATE */}

          <Image
            src="/images/retreat/date.png"
            alt="9–11 October, Mussoorie"
            fill
            priority
            sizes="100vw"
            data-retreat-date
            className="
              absolute
              inset-0
              z-10
              object-contain
            "
          />


          {/* PARTNER */}

          <Image
            src="/images/retreat/partner.png"
            alt="Venue partner"
            fill
            priority
            sizes="100vw"
            data-retreat-partner
            className="
              absolute
              inset-0
              z-10
              object-contain
            "
          />


          {/* TOP BORDER */}

          <div
            data-retreat-border-top
            className="
              absolute
              left-0
              right-0
              top-0
              z-20
              h-[10px]
              md:h-[14px]
              pointer-events-none
              bg-[repeating-linear-gradient(135deg,#fff_0_18px,#173d78_18px_36px,#fff_36px_54px,#e51c2b_54px_72px)]
            "
          />


          {/* LEFT BORDER */}

          <div
            data-retreat-border-left
            className="
              absolute
              bottom-0
              left-0
              top-0
              z-20
              w-[10px]
              md:w-[14px]
              pointer-events-none
              bg-[repeating-linear-gradient(45deg,#fff_0_18px,#173d78_18px_36px,#fff_36px_54px,#e51c2b_54px_72px)]
            "
          />


          {/* RIGHT BORDER */}

          <div
            data-retreat-border-right
            className="
              absolute
              bottom-0
              right-0
              top-0
              z-20
              w-[10px]
              md:w-[14px]
              pointer-events-none
              bg-[repeating-linear-gradient(45deg,#fff_0_18px,#173d78_18px_36px,#fff_36px_54px,#e51c2b_54px_72px)]
            "
          />


          {/* HILLS */}

          <Image
            src="/images/retreat/hill.png"
            alt=""
            fill
            priority
            sizes="100vw"
            data-retreat-hill
            className="
              absolute
              inset-0
              z-30
              object-contain
            "
          />


          {/* HOVER LABEL */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-5
              left-1/2
              z-40
              -translate-x-1/2
              translate-y-3
              opacity-0
              transition-all
              duration-500
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            <span
              className="
                block
                whitespace-nowrap
                rounded-full
                bg-black/60
                px-5
                py-2
                text-xs
                uppercase
                tracking-[0.18em]
                text-white
                backdrop-blur-md
              "
            >
              Enter the mountains
            </span>
          </div>

        </div>

      </button>

    </div>
  )
}