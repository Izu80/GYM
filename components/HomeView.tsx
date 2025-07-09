import React from 'react';
import { AppLogs } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { exportWeekToExcel } from '../services/exportService';
import Button from './ui/Button';
import { StopwatchIcon, DownloadIcon } from '../constants';

interface HomeViewProps {
  currentWeek: number;
  onWeekChange: (week: number) => void;
  onSelectDay: (day: string) => void;
  onGoToRoutineSetup: () => void;
  logs: AppLogs;
}

const HomeView: React.FC<HomeViewProps> = ({ currentWeek, onWeekChange, onSelectDay, onGoToRoutineSetup, logs }) => {
  const handleExport = () => {
    const weekLogs = logs[currentWeek];
    if (!weekLogs || Object.keys(weekLogs).length === 0) {
      alert(`No hay datos registrados para la Semana ${currentWeek} para exportar.`);
      return;
    }
    exportWeekToExcel(currentWeek, weekLogs);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex justify-center mb-6">
          <StopwatchIcon className="w-16 h-16 text-cyan-400" />
        </div>
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Gym Tracker Pro
        </h1>
        <p className="text-center text-gray-400 mb-8">Selecciona tu rutina del día.</p>
        
        <div className="mb-6">
          <label htmlFor="week" className="block text-sm font-medium text-gray-300 mb-2">Semana de Entrenamiento Actual</label>
          <input
            type="number"
            id="week"
            value={currentWeek}
            onChange={(e) => onWeekChange(Math.max(1, parseInt(e.target.value, 10)))}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            min="1"
          />
        </div>
        
        <div className="space-y-3 mb-8">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              onClick={() => onSelectDay(day)}
              className="w-full text-left p-4 bg-gray-700 hover:bg-cyan-500/20 rounded-lg transition-all duration-200 ease-in-out flex justify-between items-center group"
            >
              <span className="font-semibold text-lg">{day}</span>
              <span className="text-sm font-mono text-cyan-400 transform transition-transform group-hover:translate-x-1">&gt;</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
           <Button onClick={onGoToRoutineSetup} variant="secondary">
            Gestionar Rutinas
          </Button>
          <Button onClick={handleExport} variant="primary" className="flex items-center justify-center">
            <DownloadIcon className="w-5 h-5 mr-2"/>
            Exportar Semana {currentWeek}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
