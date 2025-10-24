import React from 'react';

// --- Sound Helpers ---
// Using a shared AudioContext to avoid creating multiple instances.
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  // Initialize AudioContext on user interaction (button click)
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser");
      return null;
    }
  }
  return audioContext;
};

const playSound = (freq: number, duration: number, type: OscillatorType) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  
  // Set volume to be quiet
  gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playClickSound = () => playSound(440, 0.1, 'triangle');
// --- End Sound Helpers ---

interface PixelButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const PixelButton: React.FC<PixelButtonProps> = ({ onClick, children, className = '' }) => {
  const handleClick = () => {
    playClickSound();
    onClick();
  };
  
  return (
    <button
      onClick={handleClick}
      className={`relative inline-block px-8 py-4 text-lg text-white bg-[#FF6B6B] border-4 border-black
                 shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] 
                 active:shadow-[0px_0px_0px_#000] active:top-2 active:left-2
                 transition-all duration-100 ease-in-out
                 transform hover:-translate-y-1 hover:-translate-x-1 ${className}`}
    >
      {children}
    </button>
  );
};

export default PixelButton;