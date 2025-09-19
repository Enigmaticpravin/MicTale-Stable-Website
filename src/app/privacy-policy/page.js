import React from "react";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | MicTale",
  description:
    "Read MicTale's Privacy Policy to understand how we collect, use, and protect your personal information when participating in open mic events.",
  keywords: [
    "MicTale privacy policy",
    "data protection",
    "open mic privacy",
    "MicTale terms",
    "personal information policy",
    "data security"
  ],
  authors: [{ name: "MicTale" }],
  openGraph: {
    title: "Privacy Policy | MicTale",
    description:
      "Understand how MicTale collects, uses, and safeguards your personal information while participating in our events.",
    url: "https://www.mictale.in/privacy-policy",
    siteName: "MicTale",
    type: "article",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | MicTale",
    description:
      "Understand how MicTale collects, uses, and safeguards your personal information while participating in our events."
  }
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-red-200 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="backdrop-blur-lg bg-gray-900/50 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-2 text-gray-400">Last updated: February 13, 2025</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="backdrop-blur-lg bg-gray-900/50 rounded-2xl border border-gray-700 shadow-2xl">
            {/* Introduction */}
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Welcome to MicTale, your platform for discovering and
                participating in open mic events. This Privacy Policy explains
                how we collect, use, and protect your personal information when
                you use our platform to register for performances.
              </p>
            </section>

            {/* Information Collection */}
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Information We Collect
              </h2>
              <div className="grid gap-6">
                <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Performance Registration
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Full name
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Phone number
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Email address
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Performance details
                    </li>
                  </ul>
                </div>

                <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Payment Information
                  </h3>
                  <p className="text-gray-300 mb-4">
                    For processing performance registration payments, we
                    collect:
                  </p>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Payment transaction details
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Billing address (if required)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="p-8 border-b border-gray-700">
              <h2 className="text-2xl font-semibold text-white mb-6">
                How We Use Your Information
              </h2>
              <div className="grid gap-6">
                <div className="backdrop-blur-md bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-xl font-medium text-white mb-4">
                    Communication
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Performance slot confirmations
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Important updates
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Venue information
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="p-8">
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-xl p-6 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Contact Us
                </h2>
                <div className="text-gray-300 space-y-2">
                  <p>MicTale Support Team</p>
                  <p>Email: contact@mictale.com</p>
                  <p>Phone: 9667645676</p>
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
