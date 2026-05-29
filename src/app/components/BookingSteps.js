import React from 'react';
import { CalendarRange, Layers3, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

export default function BookingSteps() {
  const steps = [
    { num: "01", icon: CalendarRange, title: "Choose Date & Time", desc: "Pick your preferred slot that works for you." },
    { num: "02", icon: Layers3, title: "Select Plan", desc: "Choose a plan or customize as per your needs." },
    { num: "03", icon: FileText, title: "Add Details", desc: "Tell us about your event and any special requests." },
    { num: "04", icon: CheckCircle2, title: "Confirm & Pay", desc: "Secure your booking and you're all set!" }
  ];

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";
  const silverBorder = "border border-white/10 hover:border-white/30 bg-gradient-to-b from-[#0f172a]/40 to-[#020617]/90 backdrop-blur-md";

  return (
    <section className="w-full bg-[#020617] relative overflow-hidden md:px-6 py-10 px-2 md:py-24 text-center font-sans antialiased">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <span className="text-[10px] md:font-bold tracking-[0.4em] text-[#F9E498] uppercase block md:mb-3 font-mono">
          BOOKING MADE SIMPLE
        </span>
        <h2 className="text-2xl md:text-5xl elsie-regular tracking-tight text-white md:mt-2">
          Your Next Event in <span className={`${goldText}`}>4 Easy Steps</span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 mt-6 md:mt-20 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group flex flex-col items-center">
              
              <div className={`w-full rounded-[2rem] p-2 md:p-8 text-center transition-all duration-500 flex flex-col items-center h-full shadow-2xl relative overflow-hidden hover:shadow-[0_0_40px_rgba(212,175,55,0.06)] ${silverBorder}`}>
                
                <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] group-hover:w-full transition-all duration-500 ease-out" />
                
                <span className="text-xs hidden md:block font-black text-gray-500 group-hover:text-[#F9E498] font-mono tracking-[0.25em] mb-5 transition-colors duration-300">
                  {step.num}
                </span>
                
                <div className="md:p-4 p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 mb-2 md:mb-5 group-hover:text-[#F9E498] group-hover:border-[#F9E498]/20 group-hover:bg-gradient-to-b group-hover:from-white/10 group-hover:to-transparent shadow-inner transition-all duration-300">
                  <step.icon className="md:w-5 w-4 h-4 md:h-5 stroke-[1.5]" />
                </div>
                
                <h4 className="md:text-[14px] text-xs font-bold text-white tracking-wide md:mb-2 group-hover:text-[#F9E498] transition-colors duration-300">
                  {step.title}
                </h4>
                <p className="text-[10px] md:text-[12px] text-gray-400 leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </div>

              {idx < 3 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-white/10 group-hover:text-[#F9E498]/30 transition-colors duration-300 transform translate-x-1">
                  <ChevronRight className="w-5 h-5 stroke-[1.5]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}