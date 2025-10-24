import React from 'react';

interface HeartbeatProps {
  isBeating?: boolean;
  className?: string;
}

const Heartbeat: React.FC<HeartbeatProps> = ({ isBeating = true, className = '' }) => {
  const animationClass = isBeating ? 'animate-pulse-heart' : '';

  return (
    <div className={`relative ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-16 h-16 text-red-500 transition-transform duration-200 ${animationClass}`}
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <style>{`
        @keyframes pulse-heart {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
        .animate-pulse-heart {
          animation: pulse-heart 1s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Heartbeat;
