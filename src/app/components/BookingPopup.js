import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, db } from '@/app/lib/firebase-db'

const BookingPopup = ({ isOpen, onClose, showId }) => {
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

  const PERFORMANCE_TYPES = [
    'Poetry',
    'Comedy',
    'Music',
    'Storytelling',
    'Others'
  ]

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
    e.preventDefault();
    if (!showId) {
        setError('Show ID is not available. Please try again later.')
        return
      }
  
      setLoading(true)
      setError('')
  
      const newParticipant = {
        ...formData,
        bookingId: generateBookingId()
      }
  
      try {
        const showDocRef = doc(db, 'shows', showId)
        await updateDoc(showDocRef, {
          participants: arrayUnion(newParticipant)
        })
  
        const baseAmount = 350;
        const videoEditingCost = formData.videoEditingService ? 200 : 0;
        const totalAmount = (baseAmount + videoEditingCost).toString();
  
        const response = await fetch('/api/payments/payu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: totalAmount,
            productInfo: formData.videoEditingService ? 'Performance Booking with Video Editing' : 'Performance Booking',
            firstname: formData.fullName,
            email: formData.email,
            phone: formData.phoneNumber
          })
        })
  
        const data = await response.json()
        console.log(data)
        setLoading(false)
  
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
          setError('Payment initiation failed. Please try again.')
        }
      } catch (error) {
        console.error('Error processing booking:', error)
        setError('Failed to process booking. Please try again later.')
        setLoading(false)
      }
  };

  const openSampleVideo = (e) => {
    e.preventDefault();
    window.open('https://youtu.be/PVOqvM7EEuE?si=2c1KyMKNVvj0sBJE', '_blank');
  };

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-75 transition-opacity backdrop-blur-2xl">

      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 cursor-pointer text-white hover:text-gray-300 z-10 md:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="w-full h-full md:h-auto md:max-w-3xl bg-gray-900 rounded-none md:rounded-lg shadow-xl p-6 md:mb-5 md:p-8 overflow-y-auto max-h-screen md:max-h-[90vh]">
        {/* Close button - for desktop */}
        <button 
          onClick={onClose} 
          className="absolute cursor-pointer hidden md:block top-4 right-4 text-white hover:text-gray-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-8 text-center pt-5">
          <div className="justify-center items-center flex flex-col mb-2">
            <p
              className="uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[18px] from-yellow-700 via-yellow-500 to-yellow-900"
              style={poppinsStyle}
            >
              ready to rock?
            </p>
            <p
              className="text-transparent bg-clip-text bg-gradient-to-t font-semibold text-4xl text-center from-slate-200 via-gray-400 to-white"
              style={poppinsStyle}
            >
              Book your performance slot!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-200"
            >
              Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-200"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Your contact number"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-200"
            >
              Instagram Handle
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">
                @
              </span>
              <input
                id="instagramHandle"
                type="text"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-r-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="performanceType"
              className="block text-sm font-medium text-gray-200"
            >
              Performance Type
            </label>
            <select
              id="performanceType"
              name="performanceType"
              value={formData.performanceType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
            >
              <option value="" disabled>
                Select your performance type
              </option>
              {PERFORMANCE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="firstTime"
              className="block text-sm font-medium text-gray-200"
            >
              Is this your first time performing at an Open Mic?
            </label>
            <select
              id="firstTime"
              name="firstTime"
              value={formData.firstTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none"
            >
              <option value="" disabled>
                Select your choice
              </option>
              {FIRSTTIME.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="specialRequirements"
              className="block text-sm font-medium text-gray-200"
            >
              Special Requirements
            </label>
            <textarea
              id="specialRequirements"
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Any special requirements for your performance (e.g., microphone, instruments, etc.)"
            />
          </div>

          <div className="mt-8 p-5 rounded-lg bg-gray-800 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-t from-blue-300 via-blue-400 to-blue-500" style={poppinsStyle}>
                  Professional Video Editing
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  Get your performance professionally edited with YouTube thumbnail
                </p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-400">
                  {formData.videoEditingService ? 'Enabled' : 'Disabled'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox"
                    name="videoEditingService"
                    checked={formData.videoEditingService}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-start md:items-center text-sm text-gray-300 space-y-2 md:space-y-0 md:space-x-2">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Professional editing
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Custom YouTube thumbnail
                </span>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Color correction
                </span>
              </div>

              <div className="flex justify-between items-center mt-3">
                <button
                  type="button"
                  onClick={openSampleVideo}
                  className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  See sample
                </button>
                <div className="text-right">
                  <span className="block text-sm font-medium text-gray-300">Additional cost</span>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-300">₹200</span>
                </div>
              </div>
              
              <div className="bg-gray-900/50 p-3 rounded mt-2 text-xs text-gray-400">
                Note: Our video editing service includes professional color grading, audio enhancement, intro/outro animations, and a custom YouTube thumbnail designed to boost your online presence.
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-900/50 border border-red-800 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Price summary box */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Base price:</span>
              <span className="text-gray-300">₹350</span>
            </div>
            {formData.videoEditingService && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Video editing service:</span>
                <span className="text-gray-300">₹200</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-gray-700 mt-2">
              <span className="text-gray-200 font-medium">Total:</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-t from-yellow-500 via-yellow-400 to-yellow-300">
                ₹{formData.videoEditingService ? '550' : '350'}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Booking..." : "Book Slot"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPopup;