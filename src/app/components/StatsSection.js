import React from 'react';
import { Smile, CalendarDays, Percent, Headphones } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: Smile, value: "1200+", label: "Happy Creators" },
    { icon: CalendarDays, value: "50+", label: "Events Hosted" },
    { icon: Percent, value: "99%", label: "Satisfaction Rate" },
    { icon: Headphones, value: "24/7", label: "Support Available" }
  ];

  return (
    <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] backdrop-blur-2xl">
      
    <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center gap-3 border-r border-zinc-800/40 last:border-0">
            <div className="text-[#030055] border border-[#030055]/20 bg-gradient-to-b from-[#030055]/10 to-transparent p-2 rounded-lg flex items-center justify-center">
              <stat.icon className="md:w-5 md:h-5 h-3 w-3 opacity-80" />
            </div>
            <div>
              <p className="text-sm md:text-xl font-extrabold text-[#996d00] tracking-tight">{stat.value}</p>
              <p className="md:text-[11px] text-[10px] text-black font-medium mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-zinc-800/80 pt-2 lg:pt-0 lg:pl-6">
        <p className="text-xs text-center italic text-zinc-900 leading-relaxed">
          "The best space I have found for my podcast. Well-equipped and the vibe is unmatched!"
        </p>
        <span className="text-[11px] font-semibold tracking-wider text-center text-black block mt-2">— A Creator</span>
      </div>
    </section>

    </div>
  );
}