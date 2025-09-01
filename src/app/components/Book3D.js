import React from 'react';

const Book3D = ({ frontCover, backCover, spineCover }) => {
  return (
    <div className="w-full md:w-1/2 relative" style={{ perspective: '2000px' }}>
      <div 
        className="book relative w-80 h-[500px] mx-auto"
        style={{ 
          transformStyle: 'preserve-3d',
          animation: 'rotate-book 15s ease-in-out infinite'
        }}
      >
        <div 
          className="absolute w-full h-full"
          style={{ 
            transform: 'translateZ(25px)',
            backfaceVisibility: 'hidden'
          }}
        >
          <img
            src={frontCover}
            alt="Front Cover"
            className="w-full h-full object-cover rounded shadow-lg"
          />
        </div>

        {/* Back Cover */}
        <div 
          className="absolute w-full h-full"
          style={{ 
            transform: 'translateZ(-25px) rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <img
            src={backCover}
            alt="Back Cover"
            className="w-full h-full object-cover rounded shadow-lg"
          />
        </div>

        <div 
          className="absolute h-full"
          style={{ 
            width: '50px',
            right: '-25px',
            transform: 'rotateY(90deg)',
            background: 'linear-gradient(to right, #e5e5e5, #f5f5f5, #e5e5e5)',
          }}
        />

        <div 
          className="absolute h-full bg-white"
          style={{ 
            width: '50px',
            left: '-25px',
            transform: 'rotateY(-90deg)',
          }}>
<img
            src={spineCover}
            alt="Spine"
            className="w-full h-full object-cover"
            style={{
              boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
            }}
          />
          </div>
        {/* Top Side */}
        <div 
          className="absolute w-full bg-white"
          style={{ 
            height: '50px',
            top: '-25px',
            transform: 'rotateX(90deg)',
            background: '#fff',
          }}
        />

        <div 
          className="absolute w-full bg-white"
          style={{ 
            height: '50px',
            bottom: '-25px',
            transform: 'rotateX(-90deg)',
            background: '#fff',
          }}
        />
      </div>

      <div 
        className="absolute -bottom-16 left-1/2 w-56 h-12"
        style={{
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 80%)',
          animation: 'shadow-move 15s ease-in-out infinite'
        }}
      />

      <style jsx>{`
        @keyframes rotate-book {
          0%, 100% { 
            transform: rotateY(-30deg) rotateX(5deg) translateY(0); 
          }
          25% { 
            transform: rotateY(-150deg) rotateX(10deg) translateY(-20px); 
          }
          50% { 
            transform: rotateY(-210deg) rotateX(5deg) translateY(0); 
          }
          75% { 
            transform: rotateY(-300deg) rotateX(10deg) translateY(-20px); 
          }
        }

        @keyframes shadow-move {
          0%, 100% { 
            transform: translateX(-50%) scale(1); 
            opacity: 0.2; 
          }
          25%, 75% { 
            transform: translateX(-50%) scale(0.85); 
            opacity: 0.15; 
          }
          50% { 
            transform: translateX(-50%) scale(0.95); 
            opacity: 0.18; 
          }
        }

        .book:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Book3D;