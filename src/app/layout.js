import "./globals.css"
import ClientRoot from "./components/ClientRoot"
import { ToastProvider } from "./components/ui/Toast"

import {
  Satisfy,
  Dancing_Script,
  Playfair_Display,
  EB_Garamond,
  Inter,
  Libre_Baskerville,
} from "next/font/google"

const amsterdamFont = Satisfy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-amsterdam",
  display: "swap",
})

const veronicaFont = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-veronica",
  display: "swap",
})

const rozhaFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rozha",
  display: "swap",
})

const garamondFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-garamond",
  display: "swap",
})

const helveticaFont = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-helvetica",
  display: "swap",
})

const tiroFont = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-tiro",
  display: "swap",
})

export const metadata = {
  metadataBase: new URL("https://mictale.in"),

  title: {
    default: "MicTale - India's Best Creative Platform",
    template: "%s | MicTale",
  },

  description:
    "MicTale is an open mic studio and creative community space for poets, storytellers, musicians, comedians, and artists. Join our stage, share your voice, and connect with audiences in Noida.",

  keywords: [
    "MicTale",
    "open mic Noida",
    "poetry events",
    "storytelling stage",
    "music open mic",
    "stand-up comedy",
    "creative studio",
    "bookstore café",
    "perform live",
    "Noida open mic",
  ],

  authors: [{ name: "MicTale" }],
  creator: "MicTale",
  publisher: "MicTale",

  openGraph: {
    type: "website",
    url: "https://mictale.in",
    title: "MicTale | India’s Best Creative Platform",
    description:
      "Step into MicTale, Delhi's open mic studio where poetry, music, comedy, and storytelling come alive. Perform, connect, and grow with a vibrant creative community.",
    siteName: "MicTale",
    images: [
      {
        url: "https://i.imgur.com/YFpScQU.png",
        width: 1200,
        height: 630,
        alt: "MicTale Open Mic Stage",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "MicTale | India’s Best Creative Platform",
    description:
      "A stage for poets, storytellers, comedians, and musicians. MicTale is Delhi's creative hub for open mic events.",
    creator: "@mictale",
    images: ["https://i.imgur.com/YFpScQU.png"],
  },

  alternates: {
    canonical: "https://mictale.in",
  },

  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export const viewport = {
  themeColor: "#ffffff",
}

const ADD_GPTW = true

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`
        ${amsterdamFont.variable}
        ${veronicaFont.variable}
        ${rozhaFont.variable}
        ${garamondFont.variable}
        ${helveticaFont.variable}
        ${tiroFont.variable}
      `}
    >
      <body {...(ADD_GPTW ? { "data-gptw": "" } : {})}>
        <ClientRoot>
          <ToastProvider>{children}</ToastProvider>
        </ClientRoot>
      </body>
    </html>
  )
}
