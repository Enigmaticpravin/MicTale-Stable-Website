import React from "react";
import Footer from "../components/Footer";
import { ShieldCheck, Database, ChevronRight, Eye, Lock, MessageSquare, Download } from "lucide-react";

export const metadata = {
  title: "Privacy Policy",
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
    title: "Privacy Policy",
    description:
      "Understand how MicTale collects, uses, and safeguards your personal information while participating in our events.",
    url: "https://www.mictale.in/privacy-policy",
    siteName: "MicTale",
    type: "article",
    locale: "en_US"
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "Understand how MicTale collects, uses, and safeguards your personal information while participating in our events."
  }
};

export default function PrivacyPolicy() {
  const lastUpdated = "February 13, 2025";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MicTale Privacy Policy",
    url: "https://www.mictale.in/privacy-policy",
    description:
      "MicTale's Privacy Policy detailing data collection, usage, and protection practices for open mic participants.",
    dateModified: "2025-02-13",
  };

  const SectionHeader = ({ number, title, icon: Icon }) => (
  <div className="flex items-center gap-4 mb-10 group">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-900 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
      <Icon size={20} />
    </div>
    <div>
      <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase">Section {number}</span>
      <h2 className="text-2xl font-bold text-zinc-900 tracking-tight lowercase first-letter:uppercase">{title}</h2>
    </div>
  </div>
);
  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-800 antialiased selection:bg-blue-50 selection:text-blue-900">
      

      <div className="flex-grow max-w-6xl mx-auto px-6 py-20 lg:py-32 w-full">
        
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
          <div className="max-w-2xl">
            <h1 className="text-6xl md:text-7xl font-black  elsie-regular  text-zinc-900 tracking-tighter mb-4">
              Privacy <span className="text-zinc-400">Policy</span>
            </h1>
            <p className="text-lg text-zinc-500 font-medium tracking-tight">
              Your data privacy is our priority. Learn how we handle your information at MicTale.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Updated</p>
            <p className="text-sm font-bold text-zinc-900">{lastUpdated}</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <aside className="lg:col-span-4">
            <div className="sticky top-12 p-8 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Policy Sections</h3>
              <nav className="space-y-4">
                {["Introduction", "Data Collection", "Data Usage", "Data Security", "Contact"].map((item, i) => (
                  <a key={i} href={`#policy-${i+1}`} className="flex items-center gap-3 text-sm font-bold text-zinc-600 hover:text-blue-600 transition-colors group">
                    <span className="text-zinc-300 group-hover:text-blue-400">0{i+1}</span>
                    {item}
                  </a>
                ))}
              </nav>
            
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-24">
            
            <section id="policy-1">
              <SectionHeader number="01" title="Introduction" icon={ShieldCheck} />
              <div className="text-zinc-600 leading-relaxed text-lg">
                <p>
                  Welcome to MicTale. We value your trust and are committed to protecting your personal information. 
                  This policy outlines our practices regarding data collection for open mic registrations and 
                  platform interactions.
                </p>
              </div>
            </section>

            <section id="policy-2">
              <SectionHeader number="02" title="Information We Collect" icon={Database} />
              <div className="grid grid-cols-1 gap-6 mt-8">
                <div className="p-8 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors bg-zinc-50/30">
                  <h3 className="text-zinc-900 font-bold mb-4 flex items-center gap-2">
                    <ChevronRight size={18} className="text-blue-600" />
                    Registration Data
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-500 font-medium">
                    <li className="flex items-center gap-2">• Full Legal Name</li>
                    <li className="flex items-center gap-2">• Verified Phone Number</li>
                    <li className="flex items-center gap-2">• Email Address</li>
                    <li className="flex items-center gap-2">• Performance Category</li>
                  </ul>
                </div>

                <div className="p-8 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors bg-zinc-50/30">
                  <h3 className="text-zinc-900 font-bold mb-4 flex items-center gap-2">
                    <ChevronRight size={18} className="text-blue-600" />
                    Transaction Security
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    We process all payments through encrypted gateways. While we track transaction status 
                    for slot confirmation, we do not store full credit card or sensitive financial credentials 
                    on our local servers.
                  </p>
                </div>
              </div>
            </section>

            <section id="policy-3">
              <SectionHeader number="03" title="How We Use Information" icon={Eye} />
              <div className="space-y-6">
                {[
                  { title: "Operational Needs", desc: "To process your registration and manage venue logistics." },
                  { title: "Critical Communication", desc: "For slot confirmations, time changes, or event cancellations." },
                  { title: "Venue Updates", desc: "Providing location details and technical requirements for your performance." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 pb-6 border-b border-zinc-100 last:border-0">
                    <span className="text-2xl font-black text-zinc-100 leading-none">0{i+1}</span>
                    <div>
                      <h4 className="text-zinc-900 font-bold mb-1">{item.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section id="policy-4">
              <SectionHeader number="04" title="Data Security" icon={Lock} />
              <div className="bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-2xl">
                <p className="text-blue-900 font-medium leading-relaxed italic">
                  &quot;At MicTale, we implement industry-standard AES-256 encryption for data at rest and TLS for 
                  data in transit. Your personal data is only accessible to authorized personnel 
                  required to manage event logistics.&quot;
                </p>
              </div>
            </section>

            <section id="policy-5" className="pb-20">
              <SectionHeader number="05" title="Contact Our Team" icon={MessageSquare} />
              <div className="flex flex-col sm:flex-row gap-12 items-start">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Email Inquiries</p>
                  <a href="mailto:contact@mictale.com" className="text-2xl font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                    contact@mictale.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-2">Help Desk</p>
                  <a href="tel:9667645676" className="text-2xl font-bold text-zinc-900 hover:text-blue-600 transition-colors">
                    +91 96676 45676
                  </a>
                </div>
              </div>
            </section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}