import React from "react";
import Footer from "../components/Footer";
import { Scale, ShieldCheck, Clock, Ban, AlertCircle} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions",
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
    title: "Terms & Conditions",
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
    title: "Terms & Conditions",
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

  const SectionHeader = ({ number, title, icon: Icon }) => (
    <div className="flex items-center gap-4 mb-10 group">
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
     <div className="min-h-screen flex flex-col bg-white text-zinc-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex-grow max-w-6xl mx-auto px-6 py-20 lg:py-32 w-full">
        
        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-12">
          <div className="max-w-2xl">
       <h1 className="text-6xl md:text-7xl font-black text-zinc-900 elsie-regular tracking-tighter mb-4">

                Terms <span className="text-zinc-400">&</span> Conditions

              </h1>
            <p className="text-lg text-zinc-500 font-medium tracking-tight">
              Please read these terms carefully before participating in the MicTale community.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest mb-1">Last Revised</p>
            <p className="text-sm font-bold text-zinc-900">{lastUpdated}</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-4">
            <div className="sticky top-12 p-8 bg-zinc-50 border border-zinc-100 rounded-2xl">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6">Quick Navigation</h3>
              <nav className="space-y-4">
                {["Introduction", "Performance Registration", "Refund Policy", "Code of Conduct", "Liability"].map((item, i) => (
                  <a key={i} href={`#section-${i+1}`} className="flex items-center gap-3 text-sm font-bold text-zinc-600 hover:text-indigo-600 transition-colors group">
                    <span className="text-zinc-300 group-hover:text-indigo-400">0{i+1}</span>
                    {item}
                  </a>
                ))}
              </nav>
          
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-24">
            <section id="section-1">
              <SectionHeader number="01" title="Agreement to Terms" icon={Scale} />
              <div className="space-y-6 text-zinc-600 leading-relaxed text-lg">
                <p>
                  By accessing the MicTale platform, you agree to be bound by these Terms of Service. This is a 
                  <span className="text-zinc-900 font-bold"> legally binding contract</span> between you and MicTale.
                </p>
              </div>
            </section>

            <section id="section-2">
              <SectionHeader number="02" title="Performance Registration" icon={ShieldCheck} />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { t: "Verification", d: "Performers must be 18+. Minors must be accompanied by a guardian." },
                  { t: "Finality", d: "Registration is only valid after the confirmation email is issued." },
                  { t: "Punctuality", d: "Arrival 30 minutes before the slot is mandatory for technical checks." },
                  { t: "Ownership", d: "Performance slots are unique to the registrant and non-transferable." }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 border border-zinc-100 rounded-xl hover:border-indigo-200 transition-colors">
                    <h4 className="text-zinc-900 font-bold mb-2">{item.t}</h4>
                    <p className="text-sm text-zinc-500 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-3">
              <SectionHeader number="03" title="Refund Policy" icon={Clock} />
              <div className="overflow-hidden border border-zinc-200 rounded-xl shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-zinc-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Notice Period</th>
                      <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400">Refund Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-sm">
                    <tr>
                      <td className="px-6 py-5 font-medium text-zinc-900">&gt; 48 Hours</td>
                      <td className="px-6 py-5 text-blue-500 font-bold italic">Full Refund Approved</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5 font-medium text-zinc-900">24 – 48 Hours</td>
                      <td className="px-6 py-5 text-zinc-600 font-bold">50% Partial Refund</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-5 font-medium text-zinc-900">&lt; 24 Hours</td>
                      <td className="px-6 py-5 text-red-500 font-bold">No Refund Applicable</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="section-4">
              <SectionHeader number="04" title="Code of Conduct" icon={Ban} />
              <div className="bg-red-50 border-l-4 border-red-600 p-8 rounded-r-xl">
                <p className="text-red-700 font-medium leading-relaxed italic">
                  "MicTale maintains a zero-tolerance policy for hate speech, harassment, or any form of 
                  discrimination. We reserve the right to immediately terminate any performance or 
                  membership that violates our community standards."
                </p>
              </div>
            </section>

            <section id="section-5" className="pb-20">
              <SectionHeader number="05" title="Liability" icon={AlertCircle} />
              <p className="text-zinc-500 leading-relaxed">
               MicTale is not responsible for the loss or damage of personal equipment. Participants 
                assume all risks associated with live performance and attendance.</p>
            </section>
          </div>
        </main>

        <footer className="mt-20 pt-16 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Legal Inquiries</h3>
            <p className="text-3xl font-bold text-zinc-900">contact@mictale.com</p>
          </div>
          <div className="text-left md:text-right">
             <p className="text-xs font-bold text-zinc-400 mb-2 uppercase">Official Support Line</p>
             <p className="text-xl font-bold text-indigo-600">+91 96676 45676</p>
          </div>
        </footer>
      </div>

      <Footer />
    </div>
  );
}