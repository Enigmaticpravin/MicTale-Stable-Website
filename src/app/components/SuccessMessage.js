import React from 'react';
import { useRouter } from 'next/router';
import OpenMicRules from '@/app/components/OpenMicRules';

const SuccessMessage = () => {

  const router = useRouter();

  return (
    <div className=" bg-gray-950 flex flex-col items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="w-full bg-gray-900 md:shadow-xl text-center relative z-10">
        <div className='p-8'>
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg 
            className="w-8 h-8 text-green-500" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Submission Received!</h2>
        
        <div className="h-1 w-16 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-6" />
        
        <p className="text-gray-300 ">
          Thank you for your interest in performing at our Open Mic! One of our team members will contact you soon with further details about your performance slot.
        </p>
        </div>
        

        <OpenMicRules/>
        
        <button
          onClick={() => router.push('/')}
          className="w-[70%] mb-8 md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center mx-auto group"
        >
          <span>Return Home</span>
          <svg 
            className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M13 5l7 7-7 7M5 12h15" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;