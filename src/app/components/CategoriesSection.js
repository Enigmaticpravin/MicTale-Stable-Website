import React from 'react';
import { Mic, BookOpen, Radio, Award, Video, Music, Users, Plus } from 'lucide-react';

export default function CategoriesSection() {
  const options = [
    { icon: Mic, title: "Stand-up &" , subtitle: "Comedy Shows" },
    { icon: BookOpen, title: "Book Launches" , subtitle: "& Readings" },
    { icon: Radio, title: "Podcasts &" , subtitle: "Interviews" },
    { icon: Award, title: "Workshops" , subtitle: "& Talks" },
    { icon: Video, title: "Live Streams &" , subtitle: "Recordings" },
    { icon: Music, title: "Music" , subtitle: "Sessions" },
    { icon: Users, title: "Panel" , subtitle: "Discussions" },
    { icon: Plus, title: "And Much" , subtitle: "More..." },
  ];

  return (
    <section className="w-full bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] backdrop-blur-2xl text-[#000000] px-4 py-10 md:px-8 md:py-20 border-b border-zinc-900/40 relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-center">
        
        <div className="xl:col-span-4 flex flex-col justify-center items-center text-center xl:items-start xl:text-left">
  <span className="text-[10px] md:font-black tracking-[0.35em] text-[#000000] uppercase block mb-3">
    PERFECT FOR EVERY IDEA
  </span>
  <h2 className="text-[28px] md:text-[42px] elsie-regular font-extrabold leading-none text-[#030055]">
    One Space.<br />
    <span className="text-[#996d00]">Endless</span> Possibilities.
  </h2>
</div>

     <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
  {options.map((item, idx) => (
    <div 
      key={idx} 
      className="flex items-center gap-4 p-4 rounded-2xl border bg-gradient-to-b  border-white/20 from-[#0f172a]/90 to-[#020617] shadow-[0_0_25px_rgba(212,175,55,0.08)] transition-all duration-300 cursor-pointer group h-[80px] relative overflow-hidden backdrop-blur-md"
    >
      <div className="absolute top-0 left-0 h-[1.5px] bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] w-full transition-all duration-500 ease-out" />
      <div className="absolute inset-0 bg-blue-600/5 opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />

      <div className="p-2.5 rounded-xl  text-[#F9E498] border-[#F9E498]/30 bg-gradient-to-b from-white/10 to-transparent shadow-inner transition-all duration-300 shrink-0">
        <item.icon className="w-4 h-4 stroke-[1.5]" />
      </div>
      
      <div className="flex flex-col justify-center leading-normal overflow-hidden">
        <span className="text-[12px] font-bold text-white transition-colors duration-300 tracking-wide truncate">
          {item.title}
        </span>
        <span className="text-[11px] font-medium text-[#F9E498]/80 transition-colors duration-300 tracking-wider font-mono uppercase mt-0.5 truncate">
          {item.subtitle}
        </span>
      </div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}