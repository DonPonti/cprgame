import React from 'react';

interface CharacterProps {
  isCompressing?: boolean;
}

const Character: React.FC<CharacterProps> = ({ isCompressing = false }) => {
  const animationClass = isCompressing ? 'animate-compress' : '';

  return (
    <div className="relative w-24 h-48">
      {/* Head */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#F9E4B7] border-2 border-black">
        {/* Eyes */}
        <div className="absolute top-6 left-4 w-2 h-4 bg-black rounded-full"></div>
        <div className="absolute top-6 right-4 w-2 h-4 bg-black rounded-full"></div>
      </div>
      {/* Body */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-16 h-20 bg-[#4A90E2] border-2 border-black"></div>
      {/* Arms */}
      <div className={`absolute top-16 left-0 w-6 h-16 bg-[#F9E4B7] border-2 border-black origin-top-right ${animationClass}`} style={{ transform: 'rotate(20deg)' }}></div>
      <div className={`absolute top-16 right-0 w-6 h-16 bg-[#F9E4B7] border-2 border-black origin-top-left ${animationClass}`} style={{ transform: 'rotate(-20deg)' }}></div>
      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 -translate-x-full w-8 h-12 bg-[#34495E] border-2 border-black"></div>
      <div className="absolute bottom-0 left-1/2 w-8 h-12 bg-[#34495E] border-2 border-black"></div>
      
      <style>{`
        @keyframes compress {
          0%, 100% { transform: translateY(0) rotate(-20deg); }
          50% { transform: translateY(5px) rotate(-25deg); }
        }
        .animate-compress {
          animation: compress 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export const PatientCharacter: React.FC = () => {
    return (
        <div className="relative w-48 h-24 mt-20">
            {/* Head */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-16 h-16 bg-[#F9E4B7] border-2 border-black">
                {/* Eyes (closed) */}
                <div className="absolute top-8 left-4 w-4 h-1 bg-black"></div>
                <div className="absolute top-8 right-4 w-4 h-1 bg-black"></div>
            </div>
            {/* Body */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-20 bg-[#8D6E63] border-2 border-black"></div>
        </div>
    );
}

export default Character;