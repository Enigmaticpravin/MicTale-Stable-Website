import React from 'react';
import { motion } from 'framer-motion';

const achievements = [
  {
    id: 1,
    title: "Eternal Performance",
    description: "We made Gunveen Kaur's soul-stirring performance free for the world, forever.",
    meta: "Legacy Act",
  },
  {
    id: 2,
    title: "Visual Symphony",
    description: "Offered a complete professional video production for Nayak's song, at zero cost.",
    meta: "Artist Support",
  },
  {
    id: 3,
    title: "Curated Excellence",
    description: "Hand-picked our finest performers to headline exclusive, curated MicTale showcases.",
    meta: "Community Growth",
  },
];

const AchievementCard = ({ title, description, meta, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative group cursor-default"
    >
      {/* Decorative Gold Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-yellow-300 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative bg-[#000C1D] border border-amber-900/30 p-8 rounded-2xl flex flex-col h-full shadow-2xl">
        <span className="text-amber-500/70 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          {meta}
        </span>
        
        <h3 className="text-2xl font-serif text-amber-100 mb-4 group-hover:text-amber-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-400 leading-relaxed font-light italic">
          "{description}"
        </p>
        
        <div className="mt-auto pt-6">
          <div className="h-[1px] w-12 bg-gradient-to-r from-amber-500 to-transparent"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default function AchievementSection() {
  return (
    <section className="bg-[#000814] py-24 px-6 relative overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-900/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, tracking: "0.1em" }}
            whileInView={{ opacity: 1, tracking: "0.25em" }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 uppercase"
          >
            MicTale Milestones
          </motion.h2>
          <div className="mt-4 flex justify-center items-center gap-4">
            <div className="h-[1px] w-12 bg-amber-700"></div>
            <p className="text-amber-600 font-medium tracking-widest uppercase text-sm">Where Art Meets Legacy</p>
            <div className="h-[1px] w-12 bg-amber-700"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {achievements.map((item, index) => (
            <AchievementCard key={item.id} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}