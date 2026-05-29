import React, { useState } from 'react';
import { Layers, Sparkles, Sun, ShieldAlert, ArrowRight, Play } from 'lucide-react';

export default function ExperienceSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const mediaItems = [
    { id: 1, url: '/images/main1.webp', isVideo: true },
    { id: 2, url: '/images/main2.webp', isVideo: false },
    { id: 3, url: '/images/main3.webp', isVideo: false },
    { id: 4, url: '/images/main4.webp', isVideo: false },
    { id: 5, url: '/images/main5.webp', isVideo: false },
  ];

  const features = [
    { 
      icon: Layers, 
      title: "Acoustically Perfect", 
      desc: "Noise-treated walls and ceiling for clean audio capture." 
    },
    { 
      icon: Sparkles, 
      title: "Industry-Grade Gear", 
      desc: "Professional mics, mixers, monitors & high-end recording." 
    },
    { 
      icon: Sun, 
      title: "Ambience That Inspires", 
      desc: "Warm modular lights, cozy seating, and a premium creative vibe." 
    },
    { 
      icon: ShieldAlert, 
      title: "Comfort & Convenience", 
      desc: "Lounge spaces, complimentary refreshments & on-site assistance." 
    }
  ];

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";

  return (
    <section className="w-full bg-[#020617] text-gray-200 px-6 md:px-12 py-10 md:py-24 border-b border-white/5 relative overflow-hidden z-20 font-sans antialiased">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-6 md:mb-14 text-center">
          <span className="text-[10px] md:font-bold tracking-[0.4em] text-[#F9E498] uppercase block mb-3 font-mono">
            THE MICTALE EXPERIENCE
          </span>
          <h2 className="text-2xl md:text-5xl leading-none elsie-regular tracking-tight text-white">
            Designed for Performance.<br />
            Built for <span className={`${goldText}`}>Comfort.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 bg-gradient-to-b from-[#0f172a]/60 to-[#020617]/90 border border-white/10 rounded-[2rem] md:p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md relative overflow-hidden">
            
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center group/viewport shadow-inner">
              
              <img 
                src={mediaItems[activeIndex].url} 
                alt="Studio View" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover/viewport:scale-105"
              />

           
            </div>

            <div className="grid grid-cols-5 gap-3 mt-2 mx-2 mb-2 md:mt-5">
              {mediaItems.map((item, idx) => (
                <div 
                  key={item.id} 
                  onClick={() => setActiveIndex(idx)}
                  className={`aspect-[16/9] rounded-xl overflow-hidden bg-black/40 border relative cursor-pointer group/thumb transition-all duration-300 ${
                    idx === activeIndex ? 'border-[#F9E498] shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <img 
                    src={item.url} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover transform group-hover/thumb:scale-110 transition-transform duration-500"
                  />

                  {idx === activeIndex ? (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B8860B]/20 to-transparent flex items-center justify-center z-10">
                      {item.isVideo && (
                        <div className="p-0.5 md:p-1.5 rounded-full bg-[#F9E498] text-black shadow-md">
                          <Play className="w-1.5 h-1.5 md:w-3 md:h-3 fill-current" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10" />
                  )}
                </div>
              ))}
            </div>

          </div>

        <div className="lg:col-span-4 flex h-fit flex-col gap-4">
  <div className="grid grid-cols-2 md:gap-4 lg:contents">
    {features.map((feat, idx) => (
      <div 
        key={idx} 
        className="md:p-5 mb-2 rounded-2xl flex items-start gap-4 flex-1 shadow-lg transition-all duration-300 group relative overflow-hidden backdrop-blur-md"
      >
        
        <div className="md:p-3 p-2 rounded-xl border text-[#F9E498] border-[#F9E498]/20 bg-gradient-to-b from-white/10 to-transparent shadow-inner transition-all duration-300 mt-0.5 shrink-0">
          <feat.icon className="md:w-4 md:h-4 h-3 w-3 stroke-[1.5]" />
        </div>
        
        <div className="flex flex-col">
          <h4 className="md:text-[13px] text-xs md:font-bold text-white tracking-wide group-hover:text-[#F9E498] transition-colors duration-300">
            {feat.title}
          </h4>
          <p className="text-[11px] hidden md:block text-gray-400 mt-1.5 leading-relaxed max-w-[240px]">
            {feat.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
  
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 md:mt-4 pt-4 border-t border-white/5">
    <p className="text-gray-400 text-[10px] md:text-xs leading-relaxed max-w-md tracking-wide">
      From crystal-clear isolated acoustics to responsive mood lighting and high-tier equipment, every square inch is engineered to amplify your creative voice.
    </p>
    
    <button className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest text-white uppercase border border-white/10 hover:border-white/20 md:px-6 py-2 px-4 md:py-3.5 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 shrink-0 backdrop-blur-md cursor-pointer">
      Explore Gallery 
      <ArrowRight className="w-3.5 h-3.5 text-[#F9E498]" />
    </button>
  </div>
</div>

        </div>

      </div>
    </section>
  );
}