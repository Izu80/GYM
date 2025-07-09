import React, { useState } from 'react';
import { WeeklyRoutine, RoutineExercise } from '../types';
import { DAYS_OF_WEEK, PlusIcon, TrashIcon } from '../constants';
import Button from './ui/Button';
import AddExerciseModal from './AddExerciseModal';

interface RoutineSetupViewProps {
  weeklyRoutine: WeeklyRoutine;
  onUpdateRoutine: (newRoutine: WeeklyRoutine) => void;
  onBack: () => void;
}

const RoutineSetupView: React.FC<RoutineSetupViewProps> = ({ weeklyRoutine, onUpdateRoutine, onBack }) => {
  const [selectedDay, setSelectedDay] = useState<string>(DAYS_OF_WEEK[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dayRoutine = weeklyRoutine[selectedDay] || [];

  const handleAddExercise = (name: string, targetSets: number) => {
    const newExercise: RoutineExercise = {
      id: `routine-ex-${Date.now()}`,
      name,
      targetSets,
    };
    const updatedDayRoutine = [...dayRoutine, newExercise];
    onUpdateRoutine({ ...weeklyRoutine, [selectedDay]: updatedDayRoutine });
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este ejercicio de tu rutina?")) {
      const updatedDayRoutine = dayRoutine.filter(ex => ex.id !== exerciseId);
      onUpdateRoutine({ ...weeklyRoutine, [selectedDay]: updatedDayRoutine });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Gestionar Rutinas
        </h1>
        <Button onClick={onBack} variant="secondary">Volver al Menú</Button>
      </header>

      <div className="mb-6">
        <label htmlFor="day-select" className="block text-sm font-medium text-gray-300 mb-2">Selecciona un día para editar:</label>
        <select
          id="day-select"
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none transition appearance-none"
          style={{ background: 'url(\'data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\') no-repeat right 1rem center/10px 10px, linear-gradient(to left, #374151, #374151)'}}
        >
          {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="space-y-4 bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-cyan-400 border-b border-gray-700 pb-3 mb-4">Ejercicios para {selectedDay}</h2>
        {dayRoutine.length === 0 ? (
          <p className="text-gray-400">No hay ejercicios definidos para este día.</p>
        ) : (
          dayRoutine.map(ex => (
            <div key={ex.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
              <div>
                <p className="font-semibold text-white">{ex.name}</p>
                <p className="text-sm text-gray-400">{ex.targetSets} series</p>
              </div>
              <button onClick={() => handleRemoveExercise(ex.id)} className="text-gray-500 hover:text-red-500 p-2 rounded-full transition-colors">
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
        <div className="pt-4">
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-2 inline" />
            Añadir Ejercicio a la Rutina
          </Button>
        </div>
      </div>
      
      <AddExerciseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddExercise={handleAddExercise}
      />
    </div>
  );
};

export default RoutineSetupView;
