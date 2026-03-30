'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Feather, Send, BookOpen, PenTool } from 'lucide-react';

export default function PoemSubmissionModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ghazal');
  const [content, setContent] = useState('');

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent font-serif";
  const goldBtn = "bg-[linear-gradient(110deg,#B8860B,45%,#F9E498,55%,#B8860B)] bg-[length:200%_100%] text-black font-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-500 hover:bg-[100%_0%]";
  const inputStyle = "w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:bg-white/[0.07] outline-none transition-all duration-300 backdrop-blur-sm";

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, content })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }

      setTitle('');
      setCategory('ghazal');
      setContent('');
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center md:p-4">

           <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-600/10 blur-[100px]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full md:max-w-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] border border-white/10 md:rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:max-h-[95vh]"
          >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-600/10 blur-[120px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="relative px-8 pt-10 pb-6 flex justify-between items-start shrink-0 z-10">
              <div className="space-y-1">
                <h2 className={`text-3xl md:text-4xl elsie-regular tracking-tighter ${goldText}`}>
                  Submit Your Poetry
                </h2>
                <p className=" text-[10px] uppercase tracking-[0.3em] font-bold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] " />
                  Editorial Review Open
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 cursor-pointer bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-6 custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <PenTool size={10}/> Poem Title
                    </label>
                    <input 
                      type="text" 
                      required 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      className={inputStyle} 
                      placeholder="Type your poem's title here..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-white uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                      <BookOpen size={10}/> Category
                    </label>
                    <div className="relative">
                      <select 
                        value={category} 
                        onChange={(e) => setCategory(e.target.value)}
                        className={`${inputStyle} appearance-none cursor-pointer`}
                      >
                        <option value="ghazal" className="bg-[#020617]">Ghazal</option>
                        <option value="nazm" className="bg-[#020617]">Nazm</option>
                        <option value="muktak" className="bg-[#020617]">Muktak</option>
                        <option value="english" className="bg-[#020617]">English Poem</option>
                        <option value="other" className="bg-[#020617]">Other</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-white uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Feather size={10}/> Composition
                  </label>
                  <textarea 
                    required 
                    rows={8} 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                    className={`${inputStyle} resize-none leading-relaxed montserrat-regular`}
                    placeholder="Pour your soul onto the digital parchment..."
                  />
                </div>
              </div>

              <div className="p-8 bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] backdrop-blur-2xl flex items-center justify-between gap-6 shrink-0">
                <div className="hidden md:block">
                  <p className="text-[9px] text-black uppercase font-black tracking-[0.2em]">Submission Policy</p>
                  <p className="text-[10px] text-black mt-1 italic">Manuscripts remain under author copyright.</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full cursor-pointer md:w-auto px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${goldBtn} active:scale-95 disabled:opacity-50`}
                >
                  <Send size={14} className={loading ? 'animate-pulse' : ''} />
                  {loading ? "Transmitting..." : "Send to Editorial"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}