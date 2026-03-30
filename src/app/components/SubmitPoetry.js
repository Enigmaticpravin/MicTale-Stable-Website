'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabaseAuth } from '@/app/lib/supabase/auth';
import PoemSubmissionModal from './PoemSubmissionModal';
import { Feather } from 'lucide-react';

export default function EliteFeatureCard() {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(false);
  const [open, setOpen] = useState(false);

  // The "Signature" Gold Gradient
  const goldGradient = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";
  
  const handleSubmit = async () => {
    setChecking(true);
    const { data: { session } } = await supabaseAuth.auth.getSession();
    if (!session) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setOpen(true);
    }
    setChecking(false);
  };

  return (
    <>
      <div className="relative flex items-center justify-center max-w-5xl mx-auto overflow-hidden">
      

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative w-full"
        >
          <div className="relative p-[1.5px] rounded-[3rem] overflow-hidden bg-gradient-to-b from-white/20 via-white/5 to-transparent shadow-2xl">
            
            <div className="relative bg-gradient-to-b from-[#0f172a] to-[#020617] rounded-[2.9rem] px-8 py-10 md:py-16 md:p-20 overflow-hidden flex flex-col items-center">
              
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center space-y-2 md:space-y-6">
                

                <h1 className={`text-3xl md:text-7xl font-serif tracking-tighter leading-none text-center ${goldGradient}`}>
                  Get Featured <br />
                  <span className="italic font-light text-white drop-shadow-2xl">among the best</span>
                </h1>

                <p className="max-w-md mx-auto text-gray-400 text-sm md:text-base font-light leading-relaxed text-center tracking-wide">
                  We curate the most <span className="text-white">exceptional and underrated</span> poetry. Will yours be next?
                </p>
              </div>

              <div className="relative z-10 mt-4 md:mt-12 w-full max-w-sm">
                <button
                  onClick={handleSubmit}
                  disabled={checking}
                  className="group cursor-pointer relative w-full py-3 md:py-5 rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,#B8860B,45%,#F9E498,55%,#B8860B)] bg-[length:200%_100%] transition-all duration-700 group-hover:bg-[100%_0%]" />
                  
                  <span className="relative z-10 flex items-center justify-center gap-3 text-black text-[11px] font-black uppercase tracking-[0.3em]">
                    {checking ? "Verifying..." : "Submit Your Poetry"}
                   </span>
                </button>

               
              </div>

              <div className="absolute -bottom-10 -left-10 opacity-[0.02] rotate-12 pointer-events-none">
                 <Feather size={300} strokeWidth={0.5} className="text-white" />
              </div>
            </div>
          </div>

          <div className="absolute -inset-4 bg-[#D4AF37]/5 blur-3xl rounded-[4rem] -z-10" />
        </motion.div>
      </div>

      <PoemSubmissionModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}