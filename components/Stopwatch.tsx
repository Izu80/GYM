
import React, { useState, useEffect, useRef } from 'react';
import Button from './ui/Button';

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex items-center space-x-4 bg-gray-800 p-3 rounded-xl">
      <p className="text-2xl font-mono text-cyan-400 w-24 text-center">{formatTime(time)}</p>
      <div className="flex space-x-2">
        <Button onClick={handleStartStop} variant="primary" className="px-3 py-1 text-sm">
          {isRunning ? 'Pausar' : 'Iniciar'}
        </Button>
        <Button onClick={handleReset} variant="secondary" className="px-3 py-1 text-sm">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
