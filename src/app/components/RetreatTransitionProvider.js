"use client"

import {
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react"

import { useRouter } from "next/navigation"
import gsap from "gsap"

const RetreatTransitionContext = createContext(null)

export function useRetreatTransition() {
  const context = useContext(RetreatTransitionContext)

  if (!context) {
    throw new Error(
      "useRetreatTransition must be used inside RetreatTransitionProvider"
    )
  }

  return context
}

export default function RetreatTransitionProvider({
  children,
}) {
  const router = useRouter()

  const running = useRef(false)

  const openRetreat = useCallback(
    (originalBanner) => {
      if (!originalBanner || running.current) return

      running.current = true

      /*
       * ==================================================
       * CAPTURE THE ACTUAL BANNER
       * ==================================================
       */

      const rect =
        originalBanner.getBoundingClientRect()

      /*
       * Clone the already-rendered banner.
       *
       * This means the user sees EXACTLY what they
       * clicked. No new artwork appears.
       */

      const clone =
        originalBanner.cloneNode(true)

      /*
       * Put clone directly into body so it survives
       * the Next.js route change.
       */

      document.body.appendChild(clone)

      /*
       * Hide original without changing layout.
       *
       * Visibility keeps its original space.
       */

      originalBanner.style.visibility = "hidden"

      /*
       * ==================================================
       * PREPARE CLONE
       * ==================================================
       */

      Object.assign(clone.style, {
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        zIndex: "9990",
        overflow: "hidden",
        borderRadius: "16px",
        pointerEvents: "none",
        transformOrigin: "top left",
      })

      /*
       * ==================================================
       * FIND ARTWORK INSIDE CLONE
       * ==================================================
       */

      const title =
        clone.querySelector("[data-retreat-title]")

      const date =
        clone.querySelector("[data-retreat-date]")

      const partner =
        clone.querySelector("[data-retreat-partner]")

      const hill =
        clone.querySelector("[data-retreat-hill]")

      const borderTop =
        clone.querySelector("[data-retreat-border-top]")

      const borderLeft =
        clone.querySelector("[data-retreat-border-left]")

      const borderRight =
        clone.querySelector("[data-retreat-border-right]")

      /*
       * ==================================================
       * NAVBAR
       * ==================================================
       */

      const navbar =
        document.querySelector(
          "[data-retreat-navbar]"
        )

      const navbarHeight = navbar
        ? navbar.getBoundingClientRect().height
        : 88

      /*
       * ==================================================
       * INITIAL STATES
       * ==================================================
       */

      gsap.set(title, {
        transformOrigin: "center center",
      })

      gsap.set(hill, {
        transformOrigin: "center bottom",
      })

      /*
       * ==================================================
       * MASTER TIMELINE
       * ==================================================
       */

      const tl = gsap.timeline({
        defaults: {
          overwrite: "auto",
        },
      })

      /*
       * --------------------------------------------------
       * PHASE 1
       *
       * The ACTUAL clicked banner expands.
       *
       * It doesn't jump.
       * It doesn't get recreated.
       * --------------------------------------------------
       */

      tl.to(clone, {
        top: navbarHeight,
        left: 0,
        width: window.innerWidth,
        height:
          window.innerHeight - navbarHeight,
        borderRadius: 0,
        duration: 1.15,
        ease: "power4.inOut",
      })

      /*
       * --------------------------------------------------
       * PHASE 2
       *
       * Title grows gently.
       * --------------------------------------------------
       */

      tl.to(
        title,
        {
          scale: 1.13,
          y: "-1.5vh",
          duration: 1,
          ease: "power3.out",
        },
        "-=0.55"
      )

      /*
       * --------------------------------------------------
       * PHASE 3
       *
       * Date and partner leave smoothly.
       * --------------------------------------------------
       */

      tl.to(
        date,
        {
          opacity: 0,
          y: "-25px",
          duration: 0.65,
          ease: "power2.in",
        },
        "-=0.65"
      )

      tl.to(
        partner,
        {
          opacity: 0,
          y: "-25px",
          duration: 0.65,
          ease: "power2.in",
        },
        "<"
      )

      /*
       * --------------------------------------------------
       * PHASE 4
       *
       * Hill travels downward.
       *
       * IMPORTANT:
       * It is NOT pushed off-screen.
       * --------------------------------------------------
       */

      tl.to(
        hill,
        {
          y: "39vh",
          scale: 1.08,
          duration: 1.3,
          ease: "power3.inOut",
        },
        "-=0.55"
      )

      /*
       * --------------------------------------------------
       * PHASE 5
       *
       * Side borders continue downward.
       *
       * No bottom border exists.
       * --------------------------------------------------
       */

      tl.fromTo(
        borderLeft,
        {
          height: "0%",
          top: "0%",
          bottom: "auto",
        },
        {
          height: "100%",
          duration: 1.1,
          ease: "power3.inOut",
        },
        "-=1.15"
      )

      tl.fromTo(
        borderRight,
        {
          height: "0%",
          top: "0%",
          bottom: "auto",
        },
        {
          height: "100%",
          duration: 1.1,
          ease: "power3.inOut",
        },
        "<"
      )

      /*
       * ==================================================
       * NAVIGATE
       * ==================================================
       *
       * We navigate only after the visual transformation
       * has happened.
       */

      tl.call(() => {
        router.push("/retreat")
      })

      /*
       * ==================================================
       * KEEP CLONE ALIVE DURING ROUTE CHANGE
       * ==================================================
       */

      tl.to(
        {},
        {
          duration: 0.5,
        }
      )

      /*
       * ==================================================
       * FINAL CLEANUP
       * ==================================================
       */

      tl.to(clone, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",

        onComplete: () => {
          clone.remove()

          /*
           * Restore original banner in case the user
           * navigates back.
           */

          originalBanner.style.visibility = ""

          running.current = false
        },
      })
    },
    [router]
  )

  return (
    <RetreatTransitionContext.Provider
      value={{
        openRetreat,
      }}
    >
      {children}
    </RetreatTransitionContext.Provider>
  )
}