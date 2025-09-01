import React, { useState } from 'react';

const OpenMicRules = () => {
  const [expandedSection, setExpandedSection] = useState('general');

  const rules = {
    general: {
      title: "General Guidelines",
      rules: [
        "Sign up at least 30 minutes before the event starts",
        "Each performer gets a 5-minute slot",
        "Be respectful of other performers and the audience",
        "No hate speech or explicit content"
      ]
    },
    technical: {
      title: "Technical Requirements",
      rules: [
        "Bring your own instrument if needed",
        "Basic sound equipment will be provided",
        "Sound check available 15 minutes before start",
        "Maximum 2 microphones per performance"
      ]
    },
    etiquette: {
      title: "Performance Etiquette",
      rules: [
        "Arrive at least 10 minutes before your slot",
        "Keep track of your allotted time",
        "Clear the stage promptly after your performance",
        "Support other performers with applause"
      ]
    }
  };

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif'
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 rounded-lg shadow-xl md:mt-5">
      <div className='justify-center items-center flex flex-col mb-2'>
        <p className='uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[18px] from-yellow-700 via-yellow-500 to-yellow-900' style={poppinsStyle}>till that time</p>
        <p className='text-transparent bg-clip-text bg-gradient-to-t font-semibold text-4xl text-center from-slate-200 via-gray-400 to-white' style={poppinsStyle}>Familiarize yourself <br></br>with the instructions</p>
       </div>
      
      <div className="space-y-4 mt-5 text-left">
        {Object.entries(rules).map(([key, section]) => (
          <div 
            key={key}
            className="border border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedSection(key)}
              className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800 transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              <svg
                className={`w-6 h-6 transform transition-transform duration-200 invert ${
                  expandedSection === key ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            
            <div
              className={`px-6 py-4 bg-gray-800 transition-all duration-200 ${
                expandedSection === key ? 'block' : 'hidden'
              }`}
            >
              <ul className="space-y-3">
                {section.rules.map((rule, index) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className=" w-6 h-6 bg-gray-700 rounded-full text-white text-sm flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-400 text-sm">
          Note: These rules are designed to ensure a smooth and enjoyable experience for all participants. 
          Failure to comply may result in forfeiting your performance slot.
        </p>
      </div>
    </div>
  );
};

export default OpenMicRules;