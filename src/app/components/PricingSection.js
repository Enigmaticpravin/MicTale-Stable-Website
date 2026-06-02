'use client'

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export default function PricingSection() {
  const cards = [
    {
      title: "Hourly Plan",
      caption: "Perfect for short sessions",
      price: "₹1000",
      unit: "/hour",
      features: ["Minimum 2 Hours", "Basic Equipment Setup", "On-Site Studio Assistance"],
      isPopular: false,
      btnText: "Book Now"
    },
    {
      title: "Half Day",
      caption: "Up to 4 Hours production",
      price: "₹3500",
      unit: "/ session",
      features: ["4 Hours Studio Access", "Premium Sound Gear", "On-Site Studio Assistance"],
      isPopular: false,
      btnText: "Book Now"
    },
    {
      title: "Full Day",
      caption: "Up to 8 Hours production",
      price: "₹6000",
      unit: "/ session",
      features: ["8 Hours Studio Access", "Premium Sound Gear", "On-Site Studio Assistance", "Priority Engineering Booking"],
      isPopular: true,
      btnText: "Book Now"
    },
    {
      title: "Custom Plan",
      caption: "Tailored for large events",
      price: "Let's Talk",
      unit: "",
      features: ["Extended Booking Allocation", "Custom Technical Specs", "Dedicated Lounge Support"],
      isPopular: false,
      btnText: "Contact Us"
    }
  ];

  const handleWhatsapp = (card) => {
  const phone = "919667645676";

  const message = `Hello MicTale,

I am interested in the ${card.title}.

Package: ${card.title}
Price: ${card.price}${card.unit}

Included:
${card.features.map(feature => `• ${feature}`).join('\n')}

Please share availability and booking details.`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";
  const goldBtn = "bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)] transition-all duration-300";
  const silverBorder = "border border-white/10 hover:border-white/20 bg-gradient-to-b from-[#0f172a]/40 to-[#020617]/90 backdrop-blur-md";

  return (
    <section className="w-full bg-[#020617] relative overflow-hidden md:px-6 py-10 px-2 md:py-24 font-sans antialiased border-t border-white/5">
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-600/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:mb-16 mb-2 md:pb-8 border-b border-white/5">
          <div className="md:space-y-3 text-center md:text-left">
            <span className="text-[10px] font-bold tracking-[0.4em] text-[#F9E498] uppercase block font-mono">
              FLEXIBLE PLANS
            </span>
            <h2 className="text-2xl md:text-5xl elsie-regular tracking-tight text-white leading-tight">
              Pick What Works for You
            </h2>
            <p className="text-xs md:mt-0 mt-2 px-10 md:px-0 text-gray-400 leading-relaxed max-w-md">
              Transparent tier architecture. Absolute creative clarity with no hidden premiums.
            </p>
          </div>
        
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-2 md:gap-6 items-stretch pt-4">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className={`rounded-[2rem] p-6 flex flex-col justify-between relative transition-all duration-500 shadow-2xl overflow-hidden group/card ${
                card.isPopular 
                  ? 'bg-gradient-to-b from-[#0f172a] to-[#020617] border-2 border-[#F9E498]/40 shadow-[0_0_40px_rgba(212,175,55,0.08)] transform xl:-translate-y-4' 
                  : `${silverBorder}`
              }`}
            >
              <div className="absolute top-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] group-hover/card:w-full transition-all duration-500 ease-out" />

              {card.isPopular && (
                <span className="absolute -top-[1.5px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-black text-[8px] md:text-[9px] md:font-black tracking-[0.2em] uppercase py-1 px-1 md:px-4 rounded-b-xl shadow-md">
                  Most Popular
                </span>
              )}

              <div className="relative z-10">
                <h4 className="text-[16px] font-bold text-white tracking-wide mt-2 group-hover/card:text-[#F9E498] transition-colors duration-300">
                  {card.title}
                </h4>
                <p className="text-[11px] text-gray-500 md:mt-1 leading-normal">
                  {card.caption}
                </p>
                
                <div className="my-2 md:my-6 flex items-baseline">
                  <span className="text-xl md:text-3xl font-bold font-mono tracking-tight text-white">
                    {card.price}
                  </span>
                  {card.unit && (
                    <span className="text-[10px] md:text-[11px] text-gray-500 font-medium tracking-wider uppercase ml-1.5 font-mono">
                      {card.unit}
                    </span>
                  )}
                </div>

                <ul className="space-y-1 md:space-y-3.5 md:pt-5 border-t border-white/5">
                  {card.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-[11px] text-gray-400 leading-normal">
                      <Check className="w-3.5 h-3.5 text-[#F9E498] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

         <button
  onClick={() => handleWhatsapp(card)}
  className={`w-full mt-3 md:mt-8 py-1 md:py-3.5 rounded-full text-xs md:font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
    card.isPopular
      ? `${goldBtn}`
      : 'bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white backdrop-blur-md'
  }`}
>
  {card.btnText}
</button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}