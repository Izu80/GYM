import React from 'react';
import { DailyLog, ExerciseLog } from '../types';
import ExerciseCard from './ExerciseCard';
import Stopwatch from './Stopwatch';
import Button from './ui/Button';

interface WorkoutViewProps {
  dailyLog: DailyLog;
  onUpdateLog: (updatedLog: DailyLog) => void;
  onBack: () => void;
}

const WorkoutView: React.FC<WorkoutViewProps> = ({ dailyLog, onUpdateLog, onBack }) => {

  const handleUpdateExercise = (updatedExercise: ExerciseLog) => {
    const newExercises = dailyLog.exercises.map(ex =>
      ex.id === updatedExercise.id ? updatedExercise : ex
    );
    onUpdateLog({ ...dailyLog, exercises: newExercises });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    // This is disabled in the workout view. It is handled in the RoutineSetupView.
    // However, to prevent crashes if something unexpected happens, we can add a confirmation.
    if (window.confirm("No deberías poder eliminar ejercicios desde aquí. ¿Estás seguro de que quieres hacerlo? Esto podría ser un error.")) {
        const newExercises = dailyLog.exercises.filter(ex => ex.id !== exerciseId);
        onUpdateLog({ ...dailyLog, exercises: newExercises });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 pb-24 md:p-8">
      <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Semana {dailyLog.week}
          </h1>
          <p className="text-gray-400 font-semibold">{dailyLog.day}</p>
        </div>
        <div className="flex items-center gap-4">
          <Stopwatch />
          <Button onClick={onBack} variant="secondary">Volver</Button>
        </div>
      </header>

      <main className="space-y-6">
        {dailyLog.exercises.length === 0 ? (
          <div className="text-center py-16 px-6 bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-700">
            <h2 className="text-xl font-semibold text-gray-300">Rutina no definida</h2>
            <p className="text-gray-500 mt-2 mb-6">Ve a "Gestionar Rutinas" en el menú principal para añadir ejercicios para este día.</p>
            <Button onClick={onBack}>Volver al Menú</Button>
          </div>
        ) : (
          dailyLog.exercises.map(ex => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              onUpdate={handleUpdateExercise}
              onRemove={handleRemoveExercise}
              isReadOnly={true}
            />
          ))
        )}
      </main>
      
    </div>
  );
};

export default WorkoutView;
