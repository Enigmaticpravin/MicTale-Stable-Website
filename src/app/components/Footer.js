'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ChevronUp
} from 'lucide-react'
import { useToast } from './ui/Toast'

export default function Footer() {
    const { success, error, warning, info, toast } = useToast();

  const handleSuccess = () => {
    success('Operation completed successfully!');
  };

  const handleError = () => {
    error('Something went wrong. Please try again.');
  };

  const handleWarning = () => {
    warning('This action cannot be undone.');
  };

  const handleInfo = () => {
    info('New update available.');
  };
  return (
    <footer className=" overflow-hidden m-1 md:m-5 rounded-2xl border-t border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-80 w-[64rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-500/10 via-cyan-400/10 to-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
       
        <div className="grid grid-cols-1 gap-10 border-t border-white/10 py-12 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <h4 className="mb-4 text-sm font-semibold tracking-wide text-white/80">Stay in touch</h4>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-white/70">
              Get show announcements, early-bird passes, and behind-the-scenes notes. No spam, just the real stuff.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="group relative flex w-full max-w-md items-center rounded-2xl border border-white/10 bg-white/5 p-1.5 ring-0 backdrop-blur transition focus-within:bg-white/10"
              aria-label="Subscribe to newsletter"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                className="peer w-full bg-transparent px-3 py-2 text-sm text-white/90 placeholder-white/40 outline-none"
              />
              <button
                type="submit"
                onClick={handleError}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/20 active:translate-y-px"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-sky-500/0 via-cyan-400/0 to-fuchsia-500/0 opacity-0 blur-2xl transition-all duration-300 group-focus-within:opacity-20" />
            </form>

            <ul className="mt-6 space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-white/60" />
                <a href="mailto:hello@mictale.in" className="link-underline">contact@mictale.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-white/60" />
                <a href="tel:+919999999999" className="link-underline">+91 99999 99999</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/60" />
                <span>Noida, India</span>
              </li>
            </ul>
          </div>

          <NavCol
            title="Discover"
            links={[
              { label: 'Open Mic', href: '/open-mic' },
              { label: 'Solo Shows', href: '/solo' },
              { label: 'Workshops', href: '/workshops' },
              { label: 'Studio Rentals', href: '/rentals' },
            ]}
          />

          <NavCol
            title="Company"
            links={[
              { label: 'About', href: '/about' },
              { label: 'Careers', href: '/careers' },
              { label: 'Press', href: '/press' },
              { label: 'Contact', href: '/contact' },
            ]}
          />

          <NavCol
            title="Resources"
            links={[
              { label: 'Blog', href: '/blog' },
              { label: 'Community', href: '/community' },
              { label: 'Partner with us', href: '/partners' },
              { label: 'Help Center', href: '/help' },
            ]}
          />

          <NavCol
            title="Legal"
            links={[
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Refunds', href: '/refunds' },
              { label: 'Cookies', href: '/cookies' },
            ]}
          />
        </div>

        {/* bottom bar */}
        <div className="flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Social href="https://instagram.com" label="Instagram">
              <Instagram className="h-5 w-5" />
            </Social>
            <Social href="https://twitter.com" label="Twitter">
              <Twitter className="h-5 w-5" />
            </Social>
            <Social href="https://youtube.com" label="YouTube">
              <Youtube className="h-5 w-5" />
            </Social>
            <Social href="https://facebook.com" label="Facebook">
              <Facebook className="h-5 w-5" />
            </Social>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
            <p>© {new Date().getFullYear()} MicTale. All rights reserved.</p>
            <div className="hidden h-4 w-px bg-white/10 md:block" />
            <div className="flex items-center gap-4">
              <LangBadge code="EN" />
              <a className="link-underline" href="/sitemap">Sitemap</a>
              <a className="link-underline" href="/accessibility">Accessibility</a>
            </div>
          </div>

          <BackToTop />
        </div>
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
      className="inline-flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 md:self-auto"
      aria-label="Back to top"
    >
      <ChevronUp className="h-4 w-4" />
      Back to top
    </motion.button>
  )
}
