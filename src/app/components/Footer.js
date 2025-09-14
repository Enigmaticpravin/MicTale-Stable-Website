'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  ChevronUp
} from 'lucide-react'
import { Call02FreeIcons, InstagramFreeIcons, Linkedin01FreeIcons, LocationIconFreeIcons, Mail01FreeIcons, YoutubeFreeIcons } from '@hugeicons/core-free-icons/index'
import { HugeiconsIcon } from '@hugeicons/react'


export default function Footer() {

  return (
    <footer className="relative z-10 overflow-hidden m-1 md:m-5 rounded-2xl border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-80 w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <div>
          <Image
            src="/images/footerlogo.webp"
            alt="MicTale Logo"
            className='w-40 h-10 my-10 mx-auto'
            height={400}
            width={800}/>
        </div>
       
        <div className="flex flex-row justify-between border-t border-white/10 py-12">
          <div className="col-span-2 lg:col-span-2">
          <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">Contact Us</h5>
            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Mail01FreeIcons} className="h-4 w-4 text-white/60" />
                <a href="mailto:contact@mictale.in" className="link-underline">contact@mictale.in</a>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={Call02FreeIcons} className="h-4 w-4 text-white/60" />
                <a href="tel:+919667645676" className="link-underline">+919667645676</a>
              </li>
              <li className="flex items-center gap-2">
                <HugeiconsIcon icon={LocationIconFreeIcons} className="h-4 w-4 text-white/60" />
                <span>Delhi, India</span>
              </li>
            </ul>
          </div>

          <NavCol
            title="Menu"
            links={[
              { label: 'Home', href: '/' },
              { label: 'Treasury', href: '/treasury' },
              { label: 'About us', href: '/about' }
            ]}
          />

           <NavCol
            title="Legal"
            links={[
              { label: 'Terms', href: '/terms-and-conditions' },
              { label: 'Privacy', href: '/privacy-policy' },
            ]}
          />

        </div>
        <div className="flex flex-col mx-auto justify-center items-center gap-4 border-t border-white/10 pt-8 mb-4">
          <h5 className="text-xs font-semibold uppercase tracking-widest text-white/60">Follow us</h5>
          
          <div className="flex items-center gap-4">
            <Social href="https://instagram.com/mictale.in" label="Instagram">
              <HugeiconsIcon icon={InstagramFreeIcons} className="h-5 w-5" />
            </Social>
            <Social href="https://www.linkedin.com/company/mictale" label="Twitter">
              <HugeiconsIcon icon={Linkedin01FreeIcons} className="h-5 w-5" />
            </Social>
            <Social href="https://www.youtube.com/@mictaleoriginals" label="YouTube">
              <HugeiconsIcon icon={YoutubeFreeIcons} className="h-5 w-5" />
            </Social>
          </div>

          <BackToTop />
        </div>
         <p className='text-xs md:text-sm items-center text-center mb-4 justify-center mx-auto'>© {new Date().getFullYear()} MicTale. All rights reserved.</p>
      </div>
    </footer>
  )
}

function NavCol({ title, links }) {
  return (
    <div className="lg:col-span-1">
      <h5 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">{title}</h5>
      <ul className="space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="link-underline text-white/80 transition hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Social({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="group relative inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
    >
      {children}
      <span className="pointer-events-none absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-sky-500/0 via-cyan-400/0 to-fuchsia-500/0 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-20" />
    </Link>
  )
}

function LangBadge({ code = 'EN' }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      {code}
    </span>
  )
}

function BackToTop() {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      onClick={() => {
        try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {}
      }}
      className="hidden items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 md:self-auto"
      aria-label="Back to top"
    >
      <ChevronUp className="h-4 w-4" />
      Back to top
    </motion.button>
  )
}
