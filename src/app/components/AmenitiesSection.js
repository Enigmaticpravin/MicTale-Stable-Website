import React from 'react';
import { Wifi, Wind, Coffee, Zap, Car, DoorOpen, Printer, ShieldAlert } from 'lucide-react';

export default function AmenitiesSection() {
  const amenities = [
    { icon: Wifi, label: "High-Speed Wi-Fi" },
    { icon: Wind, label: "Air Conditioned" },
    { icon: Zap, label: "Power Backup" },
    { icon: Car, label: "Parking Available" },
    { icon: DoorOpen, label: "Green Room Access" },
    { icon: ShieldAlert, label: "First Aid Kit" },
  ];

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";
  const silverCard = "border border-white/10 bg-gradient-to-b from-[#0f172a]/60 to-[#020617]/90 backdrop-blur-md shadow-2xl";

  return (
    <section 
      className="w-full relative overflow-hidden px-6 py-20 font-sans antialiased border-t border-white/5  bg-cover bg-center bg-no-repeat"
      style={{ 
      
        backgroundImage: `url('/images/studio.jpg')` 
      }}
    >
      

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[130px] pointer-events-none" />
<div className='bg-gradient-to-r from-transparent to-black absolute inset-0 z-0'></div>
      <div className="max-w-7xl mx-auto relative z-10">
        
          <div className="xl:col-span-4 flex flex-col justify-center text-end">
          <span className="text-[10px] font-black tracking-[0.35em] text-[#e2a03f] uppercase block md:mb-3">
            Everything you need,
          </span>
          <h2 className="text-2xl sm:text-[42px] elsie-regular font-extrabold leading-none text-white">
            Already            <span className="text-[#e2a03f]">Available</span> Here.
          </h2>
        </div>

      <div className="lg:col-span-6 w-full max-w-2xl ml-auto mt-10">
          <div className="grid grid-rows-3 md:grid-cols-3 gap-y-2 gap-x-0 relative">
            {amenities.map((item, idx) => {
              const isLastInRow = (idx + 1) % 3 === 0;

              return (
                <div key={idx} className="relative flex items-center justify-end group cursor-pointer pr-4 sm:pr-6">
                  
                  <div className="flex items-center justify-end gap-2.5 transition-all duration-300 hover:translate-x-[-3px]">
                    <span className="text-[11px] sm:text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors duration-300 tracking-wide text-right">
                      {item.label}
                    </span>

                    <div className="text-[#e2a03f] group-hover:text-[#f3b964] transition-colors duration-300 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 stroke-[1.75] drop-shadow-[0_0_6px_rgba(226,160,63,0.2)]" />
                    </div>
                  </div>

                  {!isLastInRow && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-[1px] bg-gradient-to-b from-transparent via-zinc-800/60 to-transparent" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}