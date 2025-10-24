import React, { useState } from 'react';
import PixelButton from './PixelButton';
import Character, { PatientCharacter } from './Character';
import Heartbeat from './Heartbeat';

interface LearnCPRProps {
  onBack: () => void;
}

const steps = [
  {
    title: "Step 1: Check for Response",
    description: "Tap the person's shoulder and shout 'Are you OK?' to make sure they need help.",
    visual: <div className="text-4xl">🤔</div>
  },
  {
    title: "Step 2: Call for Help",
    description: "You or someone else should call emergency services (like 911) immediately.",
    visual: <div className="text-4xl">📞</div>
  },
  {
    title: "Step 3: Hand Position",
    description: "Place the heel of one hand on the center of the chest, then place the other hand on top.",
    visual: (
      <div className="relative flex justify-center items-end h-48">
        <Character isCompressing={false} />
        <div className="absolute -bottom-10"><PatientCharacter /></div>
      </div>
    )
  },
  {
    title: "Step 4: Chest Compressions",
    description: "Push hard and fast, about 2 inches deep. Aim for a rhythm of 100-120 beats per minute.",
    visual: (
      <div className="relative flex justify-center items-end h-48">
        <Character isCompressing={true} />
         <div className="absolute -bottom-10"><PatientCharacter /></div>
      </div>
    )
  },
  {
    title: "Step 5: Keep the Rhythm!",
    description: "A song like 'Stayin' Alive' has the perfect tempo. Keep going until help arrives.",
    visual: <Heartbeat isBeating={true} />
  }
];

const LearnCPRComponent: React.FC<LearnCPRProps> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };
  
  const stepData = steps[currentStep];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-4xl md:text-5xl mb-4 text-shadow">{stepData.title}</h2>
      <div className="bg-black/20 p-8 rounded-lg border-4 border-black mb-8 w-full max-w-2xl min-h-[300px] flex flex-col justify-center items-center">
        <div className="mb-4 h-48 flex items-center justify-center">{stepData.visual}</div>
        <p className="text-lg md:text-xl text-slate-100">{stepData.description}</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16">
            {currentStep > 0 && <PixelButton onClick={goToPrevStep} className="px-4 py-2 text-sm">Prev</PixelButton>}
        </div>
        <div className="flex-1 text-center text-xl">
          Step {currentStep + 1} of {steps.length}
        </div>
        <div className="w-16">
            {currentStep < steps.length - 1 && <PixelButton onClick={goToNextStep} className="px-4 py-2 text-sm">Next</PixelButton>}
        </div>
      </div>
      
      <PixelButton onClick={onBack} className="bg-blue-500">Back to Menu</PixelButton>
      <style>{`.text-shadow { text-shadow: 4px 4px 0px #000; }`}</style>
    </div>
  );
};

export default LearnCPRComponent;
