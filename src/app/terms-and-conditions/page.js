
import React from "react";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms & Conditions — MicTale",
  description:
    "Read MicTale's Terms and Conditions including performance registration, cancellation policy, liability, and contact details. Last updated February 13, 2025.",
  keywords: [
    "MicTale",
    "terms and conditions",
    "open mic",
    "performance registration",
    "cancellation policy",
    "liability"
  ],
  alternates: {
    canonical: "https://www.mictale.in/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions — MicTale",
    description:
      "Read MicTale's Terms and Conditions including performance registration, cancellation policy, liability, and contact details. Last updated February 13, 2025.",
    url: "https://www.mictale.in/terms-and-conditions",
    siteName: "MicTale",
    type: "website",
    images: [
      {
        url: "https://www.mictale.in/og/terms-og.png",
        width: 1200,
        height: 630,
        alt: "MicTale Terms and Conditions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions — MicTale",
    description:
      "Read MicTale's Terms and Conditions including performance registration, cancellation policy, liability, and contact details. Last updated February 13, 2025.",
    images: ["https://www.mictale.in/og/terms-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  const lastUpdated = "February 13, 2025";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MicTale Terms and Conditions",
    url: "https://www.mictale.in/terms-and-conditions",
    description:
      "MicTale's Terms and Conditions covering performance registration, cancellation policy, guidelines, liability, and contact details.",
    dateModified: "2025-02-13",
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Decorative blurred shapes */}
      <div className="fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative">
        <header
          className="backdrop-blur-lg bg-gray-900/50 border-b border-gray-700"
          role="banner"
        >
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Terms and Conditions</h1>
            <p className="mt-2 text-gray-400">Last updated: {lastUpdated}</p>
          </div>
        </header>

        <main
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
          id="main"
          role="main"
        >
          <div className="backdrop-blur-lg bg-gray-900/50 rounded-2xl border border-gray-700 shadow-2xl">
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4">Welcome to MicTale</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using MicTale&apos;s platform, you agree to be bound by these Terms and
                Conditions. Please read these terms carefully before participating in any open mic
                events or using our services.
              </p>
            </section>
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Performance Registration</h2>
              <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Performers must be at least 18 years old or accompanied by a legal guardian.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Registration is only confirmed upon successful payment of the performance fee.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Performance slots are allocated on a first-come, first-served basis.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Performers must arrive 30 minutes before their scheduled time slot.</p>
                  </li>
                </ul>
              </div>
            </section>
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Cancellation Policy</h2>
              <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <p>Cancellations made 48 hours before the event are eligible for a full refund.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <p>Cancellations within 24-48 hours receive a 50% refund.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <p>No refunds for cancellations less than 24 hours before the event.</p>
                  </li>
                </ul>
              </div>
            </section>
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Performance Guidelines</h2>
              <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
                    <p>Performance duration must not exceed the allocated time slot.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
                    <p>Content must be appropriate for a general audience.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
                    <p>Technical requirements must be communicated during registration.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></div>
                    <p>MicTale reserves the right to stop any performance that violates these guidelines.</p>
                  </li>
                </ul>
              </div>
            </section>
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Liability</h2>
              <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <p className="text-gray-300 mb-4">MicTale is not responsible for:</p>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Personal belongings or equipment brought to the venue</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Technical issues not related to venue equipment</p>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <p>Any injuries or accidents during the performance</p>
                  </li>
                </ul>
              </div>
            </section>
            <section className="p-8">
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">Questions or Concerns?</h2>
                <div className="text-gray-300 space-y-2">
                  <p>Contact MicTale Support:</p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:contact@mictale.com"
                      className="text-indigo-300 hover:underline"
                    >
                      contact@mictale.com
                    </a>
                  </p>
                  <p>
                    Phone:{" "}
                    <a href="tel:+919667645676" className="text-indigo-300 hover:underline">
                      +91 96676 45676
                    </a>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>

       <Footer />
      </div>
    </div>
  );
}
