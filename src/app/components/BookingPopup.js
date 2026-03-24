'use client';

import React, { useState } from 'react';
import { supabase } from '@/app/lib/supabase/client';

const BookingPopup = ({ isOpen, onClose, showId, user, selectedDate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    instagramHandle: '',
    performanceType: '',
    firstTime: '',
    specialRequirements: '',
    videoEditingService: false,
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const PERFORMANCE_TYPES = ['Poetry', 'Music', 'Storytelling', 'Others'];
  const FIRSTTIME = ['Yes', 'No'];

  const generateBookingId = () => 'MTL-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!showId) { setError('Invalid show.'); return; }
    setLoading(true);
    setError('');

    const bookingId = generateBookingId();

    try {
      const { error: insertError } = await supabase
        .from('bookings')
        .insert({
          show_id: showId,
          user_id: user?.id || null,
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          instagram_handle: formData.instagramHandle,
          performance_type: formData.performanceType,
          first_time: formData.firstTime,
          special_requirements: formData.specialRequirements,
          video_editing_service: formData.videoEditingService,
          payment_status: 'pending',
          confirmation_status: 'pending',
          booking_id: bookingId,
          selected_date: selectedDate
        });

      if (insertError) throw insertError;

      const formattedDate = new Date(selectedDate).toLocaleString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
      });
      const message = `📢 *Booking Request*\nID: ${bookingId}\nName: ${formData.fullName}\nDate: ${formattedDate}`;
      window.open(`https://wa.me/919667645676?text=${encodeURIComponent(message)}`, '_blank');

      setIsSubmitted(true);
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formattedDate = selectedDate 
    ? `${new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}, ${new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long' })}`
    : 'Select Date';

  const goldText = "bg-gradient-to-b from-[#D4AF37] via-[#F9E498] to-[#B8860B] bg-clip-text text-transparent";
  const goldBtn = "bg-gradient-to-r from-[#B8860B] via-[#F9E498] to-[#D4AF37] text-black font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300";
  const silverBorder = "border border-white/10 hover:border-white/30 transition-colors bg-white/5 backdrop-blur-md";

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#020617]/90 md:p-4">
      <div className="relative w-full h-full md:h-auto max-w-2xl bg-gradient-to-b from-[#0f172a] to-[#020617] md:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/10">
        
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-600/10 blur-[100px]" />

        <div className="p-8 flex justify-between items-center z-10 shrink-0">
          <div>
            <h2 className={`text-2xl md:text-3xl elsie-regular tracking-tight ${goldText}`}>
              Reserve Your Spotlight
            </h2>
            <p className="text-gray-400 text-sm mt-1 flex items-center">
              <span className="bg-yellow-400 text-black px-1 py-[1px] mr-1 font-bold rounded">For</span>
              {formattedDate}
            </p>
          </div>
          <button onClick={onClose} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {!isSubmitted ? (
          /* Form: flex-1 ensures it fills the height between header and footer */
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden z-10 justify-between">
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5 custom-scrollbar">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">The Performer</label>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} required className={`w-full px-5 py-3 rounded-xl text-white outline-none ${silverBorder}`} placeholder="Full Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Contact Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-5 py-3 rounded-xl text-white outline-none ${silverBorder}`} placeholder="Email Address" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className={`w-full px-5 py-3 rounded-xl text-white outline-none ${silverBorder}`} placeholder="+91 ..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Instagram</label>
                  <input name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} className={`w-full px-5 py-3 rounded-xl text-white outline-none ${silverBorder}`} placeholder="@username" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Art Form</label>
                  <select name="performanceType" value={formData.performanceType} onChange={handleChange} required className={`w-full px-5 py-3 rounded-xl text-white outline-none appearance-none cursor-pointer ${silverBorder}`}>
                    <option value="" disabled className="bg-slate-900">Select Genre</option>
                    {PERFORMANCE_TYPES.map(type => <option key={type} value={type} className="bg-slate-900">{type}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Mic Experience</label>
                  <select name="firstTime" value={formData.firstTime} onChange={handleChange} required className={`w-full px-5 py-3 rounded-xl text-white outline-none appearance-none cursor-pointer ${silverBorder}`}>
                    <option value="" disabled className="bg-slate-900">Is this your first time?</option>
                    {FIRSTTIME.map(type => <option key={type} value={type} className="bg-slate-900">{type}</option>)}
                  </select>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent flex items-center justify-between`}>
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shrink-0">
                    <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" /></svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Cinematic Video Package</p>
                    <p className="text-yellow-500/70 text-[11px] font-medium tracking-wide">4K MULTI-CAM EDITING</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-lg ${goldText}`}>+₹200</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="videoEditingService" checked={formData.videoEditingService} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-yellow-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>

              {error && <p className="text-red-400 text-xs bg-red-400/5 border border-red-400/20 p-3 rounded-xl text-center">{error}</p>}
            </div>

            <div className="p-5 md:p-8 bg-[linear-gradient(135deg,#f8fafc_0%,#cbd5e1_25%,#f1f5f9_50%,#94a3b8_75%,#e2e8f0_100%)] backdrop-blur-xl flex flex-row items-center justify-between gap-4 md:gap-6 border-t border-white/20 shrink-0">
              <div className="text-left">
                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase font-black tracking-[0.1em] md:tracking-[0.2em] leading-tight">
                  Performance Fee
                </p>
                <p className="text-2xl md:text-4xl font-serif text-black font-bold">
                  ₹{formData.videoEditingService ? '499' : '299'}
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 md:flex-none px-6 md:px-12 py-3 md:py-4 cursor-pointer rounded-full text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] ${goldBtn} disabled:grayscale whitespace-nowrap`}
              >
                {loading ? "Processing..." : "Confirm Slot"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6 z-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div className="space-y-2">
              <h3 className={`text-xl md:text-3xl font-bold uppercase ${goldText}`}>Submission Received</h3>
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-sm">
                Our team will contact you to <span className="text-white font-semibold">lock your slot</span> within a day.
              </p>
            </div>
            <button 
              onClick={onClose}
              className={`py-3 cursor-pointer px-10 rounded-full border border-white/10 text-white hover:bg-white/5 transition-all text-xs md:text-sm tracking-widest uppercase`}
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPopup;