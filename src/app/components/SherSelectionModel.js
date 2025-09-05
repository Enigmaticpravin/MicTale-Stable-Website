import { useState, useEffect } from 'react'

function SherSelectionModal({ shers, onSelect, onClose, title, author }) {
  const [selectedShers, setSelectedShers] = useState([])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const toggleSher = (index) => {
    setSelectedShers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index)
      } else if (prev.length < 5) {
        return [...prev, index].sort((a, b) => a - b)
      }
      return prev
    })
  }

  const handleDownload = () => {
    const selectedSherData = selectedShers.map(index => shers[index])
    onSelect(selectedSherData)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={handleBackdropClick}
    >
      {/* Mobile: slide up from bottom, Desktop: centered modal */}
      <div className="bg-slate-900 w-full sm:w-auto sm:max-w-2xl sm:rounded-lg rounded-t-2xl sm:rounded-t-lg max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col animate-slide-up sm:animate-fade-in">
        
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-slate-700 bg-slate-900">
          {/* Mobile header with close button */}
          <div className="flex items-start justify-between mb-3 sm:hidden">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-white rozha-class line-clamp-2 leading-tight">
                {title}
              </h2>
              <p className="text-yellow-500 text-sm mt-1">
                by {author}
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-2 text-slate-400 hover:text-slate-300 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Desktop header */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-medium text-white rozha-class mb-2">
              {title}
            </h2>
            <p className="text-yellow-500 text-sm mb-4">
              by {author}
            </p>
          </div>

          {/* Selection counter */}
          <div className="flex items-center justify-between">
            <p className="text-slate-300 text-sm">
              Select up to 5 shers
            </p>
            <div className="bg-slate-800 px-3 py-1 rounded-full">
              <span className="text-yellow-500 text-sm font-medium">
                {selectedShers.length}/5
              </span>
            </div>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
          {shers.map((sher, index) => (
            <div
              key={index}
              className={`relative p-4 sm:p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                selectedShers.includes(index)
                  ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/10'
                  : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/50'
              } active:scale-[0.98] sm:active:scale-[0.99]`}
              onClick={() => toggleSher(index)}
            >
              {/* Selection indicator */}
              {selectedShers.includes(index) && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {selectedShers.indexOf(index) + 1}
                </div>
              )}
              
              <div className="text-white space-y-2">
                <div className="rozha-class text-sm sm:text-base leading-relaxed">
                  {sher.first}
                </div>
                {sher.second && (
                  <div className="rozha-class text-sm sm:text-base leading-relaxed">
                    {sher.second}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer buttons - Fixed */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-t border-slate-700 bg-slate-900">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="px-4 py-3 text-slate-400 hover:text-slate-300 transition-colors w-full sm:w-auto border border-slate-700 rounded-lg hover:border-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={selectedShers.length === 0}
              className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto font-medium shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download {selectedShers.length > 0 ? `(${selectedShers.length})` : ''}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default SherSelectionModal