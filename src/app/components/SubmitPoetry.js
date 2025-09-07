'use client'

import React from 'react';

export default function MetallicFeatureCard() {

const handleSubmit = () => {
  alert('Feature coming soon!');
}

  return (
    <div className="flex items-center justify-center max-w-6xl md:mb-5 mx-auto p-4 relative overflow-hidden">
      <div className="relative z-10 w-full">
        <div className="bg-gradient-to-br from-gray-800/70 via-gray-900/80 to-black/90 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-xl border border-gray-600/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300/3 via-transparent to-gray-500/3 rounded-2xl"></div>
          
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent"></div>
          <div className="absolute top-2 right-2 bottom-2 w-px bg-gradient-to-b from-transparent via-gray-300/25 to-transparent"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-5xl font-light text-center mb-2 md:mb-6 bg-gradient-to-br from-gray-50 via-gray-200 to-gray-400 bg-clip-text text-transparent tracking-tight">
              Get Featured Here
            </h1>
            
            <div className="text-center mb-3 md:mb-8">
              <p className="text-gray-300 md:text-sm text-xs leading-relaxed max-w-lg mx-auto font-extralight">
                We feature exceptional and underrated poetry. Submit your work if you believe it deserves recognition.
              </p>
            </div>
            
            <div className="text-center">
              <button
              onClick={handleSubmit}
              className="cursor-pointer group relative px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 text-gray-900 font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-500"></div>
                
                <span className="relative z-10">
                  Submit Your Poem
                </span>
                
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-b-xl"></div>
              </button>
              
              <p className="text-xs text-gray-500 mt-4 font-light">
                All submissions are reviewed before publication
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-radial from-gray-500/10 via-transparent to-transparent blur-2xl transform scale-125 -z-10"></div>
      </div>
    </div>
  );
}