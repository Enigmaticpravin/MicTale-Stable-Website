'use client'

import { useEffect, useState } from 'react'

export default function AnimatedWrapper({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="opacity-0">{children}</div>
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-up-100 {
          animation: fadeInUp 0.6s ease-out;
          animation-delay: 0.1s;
          animation-fill-mode: both;
        }
        
        .animate-fade-up-200 {
          animation: fadeInUp 0.6s ease-out;
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        
        .animate-fade-in-300 {
          animation: fadeIn 0.8s ease-out;
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
      `}</style>
      {children}
    </>
  )
}