'use client'

import React from 'react'
import { motion } from 'framer-motion'

const steps = [
  {
    id: "01",
    title: "Open Mic Show",
    subtitle: "Take the first stage",
    desc: "The raw entry point. We provide the stage; you provide the courage.",
  },
  {
    id: "02",
    title: "Learning Classes",
    subtitle: "Learn the science behind the art",
    desc: "Mastering the mechanics of storytelling and vocal texture.",
  },
  {
    id: "03",
    title: "Collaborative Competition",
    subtitle: "Take on your host like his dost",
    desc: "Where the elite are forged in high-stakes performance.",
  },
  {
    id: "04",
    title: "Your Solo Show",
    subtitle: "That's your name on the poster",
    desc: "Full production. Your name on the poster. Your voice, solo.",
  }
]

const poppinsStyle = {
  fontFamily: 'Poppins, sans-serif'
}

const EvolutionTree = () => {
  return (
    <section className="w-full bg-slate-950 pt-16 pb-10 px-6 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
         <div
            className='justify-center items-center flex flex-col mb-10'
          >
            <p
              className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900'
              style={poppinsStyle}
            >
              our intentions are
            </p>
            <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold  text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular'>
              Very Infectious
            </p>
          </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[40px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-400 to-transparent" />

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start">
            {steps.map((step, index) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center w-full md:w-1/4 group"
              >
                <div className="hidden md:block mb-8 relative">
                  <div className="w-5 h-5 rounded-full bg-white border-4 border-slate-950 z-20 transition-transform duration-300 group-hover:scale-150 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </div>

                <div className="w-full group cursor-default">
                  <div className="relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(212,212,216,0.15)] group-hover:-translate-y-2">
                    
                    <div className="relative p-6 rounded-[15px] bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] h-full min-h-[180px] flex flex-col justify-center gap-4">
                      <div>
                        <span className="text-slate-600 font-mono text-xs mb-2 block font-bold">
                          {step.id}: {step.subtitle}
                        </span>
                        <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight leading-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-zinc-800 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default EvolutionTree