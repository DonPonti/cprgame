import React from 'react';
import { View } from '../types';
import PixelButton from './PixelButton';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const HomeComponent: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <h1 className="text-5xl md:text-7xl mb-4 text-shadow">CPR Heroes <span role="img" aria-label="heart">🫀</span></h1>
      <p className="mb-12 text-lg text-slate-200">Learn to save a life, the fun way!</p>
      <div className="flex flex-col md:flex-row gap-8">
        <PixelButton onClick={() => onNavigate(View.Learn)}>
          1️⃣ Learn CPR
        </PixelButton>
        <PixelButton onClick={() => onNavigate(View.Game)} className="bg-[#50C878]">
          2️⃣ Play Game
        </PixelButton>
      </div>
      <style>{`
        .text-shadow {
          text-shadow: 4px 4px 0px #000;
        }
      `}</style>
    </div>
  );
};

export default HomeComponent;
