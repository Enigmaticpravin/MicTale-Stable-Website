// app/layout.js
import './globals.css'
import ClientRoot from './components/ClientRoot'
import { ToastProvider } from './components/ui/Toast'

export const metadata = {
  metadataBase: new URL("https://mictale.in"), // replace with your domain
  title: {
    default: "MicTale | Open Mic Studio & Creative Community",
    template: "%s | MicTale"
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
    "Noida open mic"
  ],
  authors: [{ name: "MicTale" }],
  creator: "MicTale",
  publisher: "MicTale",
  openGraph: {
    type: "website",
    url: "https://mictale.in",
    title: "MicTale | Open Mic Studio & Creative Community",
    description:
      "Step into MicTale, Noida’s open mic studio where poetry, music, comedy, and storytelling come alive. Perform, connect, and grow with a vibrant creative community.",
    siteName: "MicTale",
    images: [
      {
        url: "https://mictale.in/og-image.jpg", // replace with actual image
        width: 1200,
        height: 630,
        alt: "MicTale Open Mic Stage"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MicTale | Open Mic Studio & Creative Community",
    description:
      "A stage for poets, storytellers, comedians, and musicians. MicTale is Noida’s creative hub for open mic events.",
    creator: "@mictale", // replace with your Twitter handle
    images: ["https://mictale.in/og-image.jpg"] // same as OpenGraph
  },
  alternates: {
    canonical: "https://mictale.in"
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  themeColor: "#ffffff"
}

const ADD_GPTW = true

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body {...(ADD_GPTW ? { "data-gptw": "" } : {})}>
        <ClientRoot>
          <ToastProvider>{children}</ToastProvider>
        </ClientRoot>
      </body>
    </html>
  )
}
