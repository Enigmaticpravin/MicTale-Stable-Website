import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, db } from '@/app/lib/firebase-db'

const MeetupPopup = ({ isOpen, onClose, showId }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    instagramHandle: '',
    skillSet: '',
    firstTime: '',
    expectations: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const SKILL_SETS = [
    'Poetry',
    'Comedy',
    'Music',
    'Storytelling',
    'Dance',
    'Visual Arts',
    'Photography',
    'Writing',
    'Others'
  ]

  const FIRSTTIME = ['Yes', 'No'];

  const generateRegistrationId = () => {
    return 'REG-' + Math.random().toString(36).substr(2, 9).toUpperCase()
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!showId) {
        setError('Show ID is not available. Please try again later.')
        return
      }
  
      setLoading(true)
      setError('')
  
      const newParticipant = {
        ...formData,
        registrationId: generateRegistrationId(),
        registeredAt: new Date().toISOString()
      }
  
      try {
        const meetupDocRef = doc(db, 'shows', showId)
        await updateDoc(meetupDocRef, {
          participants: arrayUnion(newParticipant)
        })
  
        setSuccess(true)
        setLoading(false)
        
        // Close popup after 2 seconds
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            instagramHandle: '',
            skillSet: '',
            firstTime: '',
            expectations: '',
          })
        }, 2000)
      } catch (error) {
        console.error('Error processing registration:', error)
        setError('Failed to process registration. Please try again later.')
        setLoading(false)
      }
  };

  const poppinsStyle = { fontFamily: 'Poppins, sans-serif' };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-all duration-300 ease-out backdrop-blur-sm"
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes successPulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 cursor-pointer text-white hover:text-gray-300 z-10 md:hidden transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div 
        className="w-full h-full md:h-auto md:max-w-3xl bg-gray-900 rounded-none md:rounded-lg shadow-xl p-6 md:mb-5 md:p-8 overflow-y-auto max-h-screen md:max-h-[90vh]"
        style={{
          animation: 'slideUp 0.4s ease-out'
        }}
      >
        {/* Close button - for desktop */}
        <button 
          onClick={onClose} 
          className="absolute cursor-pointer hidden md:block top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200"
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
              Join the community
            </p>
            <p
              className="text-transparent bg-clip-text bg-gradient-to-t font-semibold text-4xl text-center from-slate-200 via-gray-400 to-white"
              style={poppinsStyle}
            >
              Register for Artist Meetup
            </p>
          </div>
        </div>

        {success ? (
          <div 
            className="flex flex-col items-center justify-center py-12"
            style={{
              animation: 'successPulse 0.6s ease-out'
            }}
          >
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2" style={poppinsStyle}>
              Registration Successful!
            </h3>
            <p className="text-gray-300 text-center">
              We'll see you at the meetup. Check your email for details.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
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
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Your contact number"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="instagramHandle"
                className="block text-sm font-medium text-gray-200"
              >
                Instagram Handle (Optional)
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
                  className="w-full px-4 py-2 rounded-r-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="skillSet"
                className="block text-sm font-medium text-gray-200"
              >
                What are you good at?
              </label>
              <select
                id="skillSet"
                name="skillSet"
                value={formData.skillSet}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
              >
                <option value="" disabled>
                  Select your skill
                </option>
                {SKILL_SETS.map(skill => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="firstTime"
                className="block text-sm font-medium text-gray-200"
              >
                Is this your first time attending an artist meetup?
              </label>
              <select
                id="firstTime"
                name="firstTime"
                value={formData.firstTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
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
                htmlFor="expectations"
                className="block text-sm font-medium text-gray-200"
              >
                What are you hoping to get from this meetup?
              </label>
              <textarea
                id="expectations"
                name="expectations"
                value={formData.expectations}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Share your expectations, what you'd like to learn, or how you'd like to contribute..."
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-900/50 border border-red-800 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Registering..." : "Register Now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetupPopup;