import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState } from '../types';
import PixelButton from './PixelButton';
import Character, { PatientCharacter } from './Character';
import Heartbeat from './Heartbeat';

// --- Sound Helpers ---
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
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
  
  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playSuccessSound = () => playSound(660, 0.1, 'sine');
const playMissSound = () => playSound(220, 0.2, 'square');
const playCountdownBeep = () => playSound(523, 0.15, 'sine');
const playGoSound = () => playSound(784, 0.2, 'sine');
// --- End Sound Helpers ---

interface GameComponentProps {
  onBack: () => void;
}

const BPM = 110; // Beats per minute
const BEAT_INTERVAL = 60000 / BPM; // ~545ms
const GAME_DURATION = 15; // in seconds
const HIT_TOLERANCE = 150; // ms

const GameComponent: React.FC<GameComponentProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [showBeat, setShowBeat] = useState(false);

  const nextBeatTime = useRef(0);
  const gameTimer = useRef<number | undefined>(undefined);
  const beatTimer = useRef<number | undefined>(undefined);

  const startCountdown = () => {
    setGameState(GameState.Countdown);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setCountdown(3);
  };

  const startGame = useCallback(() => {
    setGameState(GameState.Playing);
    nextBeatTime.current = performance.now() + BEAT_INTERVAL;

    gameTimer.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimer.current);
          clearInterval(beatTimer.current);
          setGameState(GameState.Finished);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    beatTimer.current = window.setInterval(() => {
      nextBeatTime.current = performance.now() + BEAT_INTERVAL;
      setShowBeat(true);
      setTimeout(() => setShowBeat(false), 100);
    }, BEAT_INTERVAL);
  }, []);
  
  const handleInput = useCallback(() => {
    if (gameState !== GameState.Playing) return;

    const now = performance.now();
    const timeSinceNextBeat = Math.abs(now - nextBeatTime.current);

    if (timeSinceNextBeat <= HIT_TOLERANCE) {
      setScore(prev => prev + 1);
      setFeedback({ text: "Perfect!", color: "text-green-400" });
      playSuccessSound();
    } else {
      setFeedback({ text: "Miss!", color: "text-red-400" });
      playMissSound();
    }

    setIsCompressing(true);
    setTimeout(() => setIsCompressing(false), 200);
    setTimeout(() => setFeedback(null), 500);
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.Countdown) {
      if (countdown > 0) {
        playCountdownBeep();
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        playGoSound();
        startGame();
      }
    }
  }, [gameState, countdown, startGame]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            handleInput();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleInput);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleInput);
      clearInterval(gameTimer.current);
      clearInterval(beatTimer.current);
    };
  }, [handleInput]);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Idle:
        return (
          <div className="text-center">
            <h2 className="text-4xl mb-4 text-shadow">Ready to Play?</h2>
            <p className="mb-8">Tap or press Spacebar in rhythm with the heart!</p>
            <PixelButton onClick={startCountdown} className="bg-green-500">Start Game</PixelButton>
          </div>
        );
      case GameState.Countdown:
        return <div className="text-9xl font-bold text-shadow">{countdown > 0 ? countdown : "Go!"}</div>;
      case GameState.Playing:
        const cprMeterWidth = Math.min((score / (GAME_DURATION * (BPM/60))) * 100, 100);
        return (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 text-2xl">
              <div>Time: {timeLeft}</div>
              <div>Score: {score}</div>
            </div>
            <div className="w-full h-8 bg-black/30 border-2 border-black rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-200" style={{width: `${cprMeterWidth}%`}}></div>
            </div>
            <div className="relative text-center h-64 flex flex-col items-center justify-end">
                <div className="absolute top-0">
                    {feedback && <div className={`text-4xl font-bold transition-opacity duration-200 ${feedback.color}`}>{feedback.text}</div>}
                </div>
                 <div className={`transition-transform duration-100 ${showBeat ? 'scale-125' : 'scale-100'}`}>
                    <Heartbeat isBeating={true} />
                 </div>
                <div className="absolute -bottom-24">
                  <Character isCompressing={isCompressing} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2"><PatientCharacter/></div>
                </div>
            </div>
          </div>
        );
      case GameState.Finished:
        const accuracy = Math.round((score / (GAME_DURATION * (BPM/60))) * 100);
        const message = accuracy > 70 
          ? "Great Job! You kept the heart beating! 💖" 
          : "Try Again! Keep up the rhythm! 🫀";
        return (
          <div className="text-center">
            <h2 className="text-4xl mb-4 text-shadow">Round Over!</h2>
            <p className="text-2xl mb-2">Final Score: {score}</p>
            <p className="text-xl mb-6">{message}</p>
            <div className="flex flex-col md:flex-row gap-4">
              <PixelButton onClick={startCountdown} className="bg-green-500">Play Again</PixelButton>
              <PixelButton onClick={onBack} className="bg-blue-500">Back to Menu</PixelButton>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[500px]">
        {renderContent()}
        <style>{`.text-shadow { text-shadow: 4px 4px 0px #000; }`}</style>
    </div>
  );
};

export default GameComponent;