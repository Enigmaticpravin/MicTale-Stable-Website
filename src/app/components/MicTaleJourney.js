'use client';

import React from 'react';
import { Mic, BookOpen, Users, Crown } from 'lucide-react';

const steps = [
  {
    id: '01',
    category: 'Open Mics',
    title: 'Break the Ice',
    description: 'Get comfortable with the stage. Step up, grab the mic, and share your voice in a supportive, pressure-free environment.',
    icon: Mic,
  },
  {
    id: '02',
    category: 'Learning Classes',
    title: 'Enhance Potential',
    description: 'Master the core art. Learn the nuances of performance, writing, and delivery from seasoned professionals to refine your craft.',
    icon: BookOpen,
  },
  {
    id: '03',
    category: 'Compete & Collab',
    title: 'Push Boundaries',
    description: 'Iron sharpens iron. Battle it out in friendly competitions or team up with fellow artists to discover new creative dimensions.',
    icon: Users,
  },
  {
    id: '04',
    category: 'The Pinnacle',
    title: 'Your Solo Show',
    description: 'Once you are fully ready, the stage is yours. A fully sponsored, dedicated solo show backed by MicTale. You bring the magic, we handle the rest.',
    icon: Crown,
    isFinal: true,
  }
];

export default function MicTaleJourney() {
  const premiumGoldText = "bg-gradient-to-tr from-[#C5A059] via-[#EEDAA2] to-[#B38F43] bg-clip-text text-transparent";
  
  return (
    <section className="relative mx-4 sm:mx-6 md:mx-10 lg:mx-12 max-w-[1440px] xl:mx-auto bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] backdrop-blur-2xl py-16 md:py-24 px-6 sm:px-10 lg:px-16 overflow-hidden flex flex-col justify-center rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] selection:bg-amber-500/20 selection:text-amber-200">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-r from-blue-500/[0.03] via-amber-500/[0.04] to-purple-500/[0.03] blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        
        <div className="text-center mb-4 md:mb-24 space-y-2 px-4">
          <p className="text-[8px] md:text-[10px] font-bold text-black uppercase tracking-[0.4em]">
            The Masterclass Blueprint
          </p>
          <h2 className="text-2xl md:text-5xl lg:text-6xl tracking-tight font-light md:pb-1 font-serif text-[#030055]">
            The <span className="bg-gradient-to-r from-[#006eff] via-[#0072ff] to-[#004f99] bg-clip-text text-transparent font-medium tracking-wide">MicTale</span> Journey
          </h2>
          <p className="text-slate-900 text-[10px] sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            From your first nervous breath on stage to your fully sponsored solo headline. We craft the platform, you bring the art.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6 items-stretch pl-4 sm:pl-0">
          
          <div className="absolute left-[18px] top-4 bottom-12 w-[1.5px] bg-gradient-to-b from-slate-400 via-slate-500 to-amber-400 opacity-40 sm:hidden" />

          <div className="hidden lg:block absolute top-[38px] left-[10%] right-[10%] h-[30px] pointer-events-none z-0 opacity-40">
            <svg width="100%" height="100%" viewBox="0 0 1000 30" fill="none" preserveAspectRatio="none">
              <path 
                d="M0,15 Q125,-5 250,15 T500,15 T750,15 T1000,15" 
                stroke="url(#wave-gradient)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
                fill="none"
              />
              <defs>
                <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#C5A059" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step) => {
            const Icon = step.icon;
            
            return (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-start group h-full"
              >
                
                <div className="flex items-center justify-between w-full mb-4 px-1 sm:static absolute -left-[4px] top-1 sm:w-full z-20 pointer-events-none">
                  <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center border backdrop-blur-md transition-all duration-500 pointer-events-auto
                    ${step.isFinal 
                      ? 'bg-black border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-110 sm:scale-100' 
                      : 'bg-slate-900/90 border-slate-700/50 group-hover:border-slate-500 shadow-md sm:shadow-none'
                    }
                  `}>
                    <Icon className={`w-3.5 h-3.5 transition-colors duration-300 ${step.isFinal ? 'text-amber-200' : 'text-slate-200 group-hover:text-white'}`} />
                  </div>
                  
                  <span className="text-xs tracking-widest text-slate-900 font-mono font-medium opacity-60 hidden sm:inline">
                    {step.id}
                  </span>
                </div>

                <div className="w-full pl-10 sm:pl-0 flex-1 flex flex-col">
                  <div className="w-full flex-1 flex flex-col p-5 sm:p-7 rounded-2xl border bg-gradient-to-b border-white/20 from-[#0f172a]/90 to-[#020617] shadow-[0_0_25px_rgba(212,175,55,0.06)] backdrop-blur-md transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-2xl relative overflow-hidden">
                    
                    <span className="absolute top-4 right-4 text-[10px] tracking-widest text-slate-500 font-mono font-medium sm:hidden">
                      {step.id}
                    </span>

                    <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[30px] pointer-events-none
                      ${step.isFinal ? 'bg-amber-500/10' : 'bg-slate-500/[0.04]'}
                    `} />

                    <div className="relative z-10 flex flex-col h-full">
                      
                      <div className="mb-3 sm:mb-4">
                        <span className={`text-[9px] sm:text-[10px] tracking-wider uppercase font-medium px-2.5 py-0.5 rounded-md border
                          ${step.isFinal 
                            ? 'text-amber-300 bg-amber-500/10 border-amber-500/20' 
                            : 'text-slate-100 bg-slate-900/60 border-blue-400'
                          }
                        `}>
                          {step.category}
                        </span>
                      </div>

                      <h3 className={`text-base sm:text-lg tracking-tight mb-1.5 sm:mb-2 font-medium transition-colors duration-300
                        ${step.isFinal ? premiumGoldText : 'text-slate-200 group-hover:text-white'}
                      `}>
                        {step.title}
                      </h3>

                      <p className="text-slate-400 text-[12.5px] sm:text-[13px] leading-relaxed mt-1 flex-grow">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
}