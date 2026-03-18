'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase/client'

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
    paymentStatus: 'already paid',
    confirmationStatus: 'Confirmed',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const PERFORMANCE_TYPES = ['Poetry', 'Music', 'Storytelling', 'Others'];
  const FIRSTTIME = ['Yes', 'No'];

  const generateBookingId = () => {
    return 'MTL-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!showId) {
      setError('Invalid show.')
      return
    }

    setLoading(true)
    setError('')

    const bookingId = generateBookingId()
    const totalAmount = 299 + (formData.videoEditingService ? 200 : 0)

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
        })

      if (insertError) throw insertError

      const response = await fetch('/api/payments/payu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount.toString(),
          productInfo: formData.videoEditingService ? 'Performance + Video' : 'Performance Slot',
          firstname: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber,
          bookingId
        })
      })

      const data = await response.json()
      if (data.action) {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.action
        Object.keys(data).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = data[key]
          form.appendChild(input)
        })
        document.body.appendChild(form)
        form.submit()
      } else {
        throw new Error('Payment gateway error.')
      }
    } catch (err) {
      setError('Booking failed. Please try again.')
      setLoading(false)
    }
  }

  const openSampleVideo = (e) => {
    e.preventDefault();
    window.open('https://youtu.be/PVOqvM7EEuE?si=2c1KyMKNVvj0sBJE', '_blank');
  };

  if (!isOpen) return null;

  const formattedDate = selectedDate 
    ? `${new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}, ${new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long' })}`
    : 'Select Date';

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-xl p-0 md:p-4">
      
      <div className="relative w-full h-full md:h-auto md:max-w-2xl bg-gray-900 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border-t md:border border-gray-800">
        
        {/* HEADER - Fixed */}
        <div className="p-6 md:p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-md z-20">
          <div>
            <h2 className="text-white font-bold text-xl md:text-2xl" style={poppinsStyle}>Book Slot</h2>
            <p className="text-blue-400 text-xs md:text-sm font-medium mt-1">{formattedDate}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* SCROLLABLE FORM CONTENT */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Enter name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="your@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Phone</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="98765..." />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Instagram</label>
                <input name="instagramHandle" value={formData.instagramHandle} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="@username" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Performance</label>
                <select name="performanceType" value={formData.performanceType} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none">
                  <option value="" disabled>Category</option>
                  {PERFORMANCE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase ml-1">First Timer?</label>
                <select name="firstTime" value={formData.firstTime} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none">
                  <option value="" disabled>Select</option>
                  {FIRSTTIME.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase ml-1">Requirements</label>
              <textarea name="specialRequirements" value={formData.specialRequirements} onChange={handleChange} rows={2} className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all resize-none" placeholder="Any special requests..." />
            </div>

            <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/20 flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Professional Editing</p>
                  <button type="button" onClick={openSampleVideo} className="text-blue-400 text-[10px] uppercase font-bold tracking-wider hover:underline">View Sample</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-yellow-500 font-bold text-sm">+₹200</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="videoEditingService" checked={formData.videoEditingService} onChange={handleChange} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {error && <p className="text-red-400 text-xs bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
          </div>

          {/* FOOTER - Fixed Bottom */}
          <div className="p-6 md:p-8 bg-gray-900 border-t border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Grand Total</span>
                <span className="text-2xl font-black text-white" style={poppinsStyle}>₹{formData.videoEditingService ? '499' : '299'}</span>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 md:flex-none md:min-w-[200px] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-xl shadow-blue-600/20"
              >
                {loading ? "Please wait..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPopup;