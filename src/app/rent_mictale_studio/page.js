"use client";

import React from 'react';
import HeroSection from '@/app/components/HeroSection';
import CategoriesSection from '@/app/components/CategoriesSection';
import ExperienceSection from '@/app/components/ExperienceSection';
import StatsSection from '@/app/components/StatsSection';
import BookingSteps from '@/app/components/BookingSteps';
import Footer from '@/app/components/Footer';
import PricingSection from '@/app/components/PricingSection';
import AmenitiesSection from '@/app/components/AmenitiesSection';

export default function StudioPage() {
  return (
    <div className="bg-slate-950 text-[#f5f5f7] font-sans antialiased selection:bg-[#e2a03f] selection:text-black min-h-screen flex flex-col">
    
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#e2a03f]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#e2a03f]/5 rounded-full blur-[180px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <main className="flex-1">
          <HeroSection />
          <CategoriesSection />
          <ExperienceSection />
          <StatsSection />
          <BookingSteps />
          <PricingSection />
          <AmenitiesSection />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}