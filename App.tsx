import React, { useState, useCallback, useMemo } from 'react';
import { View } from './types';
import HomeComponent from './components/HomeComponent';
import LearnCPRComponent from './components/LearnCPRComponent';
import GameComponent from './components/GameComponent';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.Home);
  const [show, setShow] = useState(true);

  const navigateTo = useCallback((newView: View) => {
    setShow(false);
    setTimeout(() => {
      setView(newView);
      setShow(true);
    }, 300); // Wait for fade-out transition
  }, []);

  const viewComponent = useMemo(() => {
    switch (view) {
      case View.Learn:
        return <LearnCPRComponent onBack={() => navigateTo(View.Home)} />;
      case View.Game:
        return <GameComponent onBack={() => navigateTo(View.Home)} />;
      case View.Home:
      default:
        return <HomeComponent onNavigate={navigateTo} />;
    }
  }, [view, navigateTo]);

  return (
    <div className="bg-gradient-to-b from-[#4A7A82] to-[#3B5A6A] min-h-screen text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      <div 
        className={`w-full max-w-4xl mx-auto transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      >
        {viewComponent}
      </div>
    </div>
  );
};

export default App;
