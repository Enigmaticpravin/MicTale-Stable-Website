// components/ScrollReveal.js
'use client'

import { useState, useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is visible in the viewport
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Stop observing once it's visible (animate only once)
          observer.disconnect() 
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' // End State: Visible & Original Position
          : 'opacity-0 translate-y-12'  // Start State: Invisible & Moved Down
      } ${className}`}
    >
      {children}
    </div>
  )
}