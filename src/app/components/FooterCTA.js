import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FooterCTA() {
  return (
    <footer className="border-t border-zinc-900 bg-gradient-to-b from-[#0b0c10] to-[#06070a] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Your stage is ready.<br />All it needs is you.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="text-left md:text-right">
            <p className="text-xs text-zinc-400">Have questions or need a custom setup?</p>
            <p className="text-xs text-zinc-500 mt-1">Our team is here to help you plan the perfect event.</p>
          </div>
          
          <button className="flex items-center gap-2 bg-[#e2a03f] hover:bg-[#cb8e34] active:scale-[0.98] text-black font-bold py-3.5 px-6 rounded-xl text-xs tracking-wider transition-all shadow-xl shadow-[#e2a03f]/5 shrink-0">
            Talk to Our Team <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-zinc-900/60 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-zinc-600">&copy; {new Date().getFullYear()} Mictale. All rights reserved.</p>
        <div className="flex gap-6 text-[11px] text-zinc-600">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}