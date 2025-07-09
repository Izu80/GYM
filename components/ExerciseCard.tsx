import React from 'react';
import { ExerciseLog, SetLog, Feeling } from '../types';
import { FEELING_OPTIONS, TrashIcon } from '../constants';

interface ExerciseCardProps {
  exercise: ExerciseLog;
  onUpdate: (updatedExercise: ExerciseLog) => void;
  onRemove: (exerciseId: string) => void;
  isReadOnly?: boolean; // New optional prop
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onUpdate, onRemove, isReadOnly = false }) => {

  const handleSetChange = (setIndex: number, updatedSet: Partial<SetLog>) => {
    const newSets = [...exercise.sets];
    newSets[setIndex] = { ...newSets[setIndex], ...updatedSet, completed: true };
    onUpdate({ ...exercise, sets: newSets });
  };
  
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-cyan-400">{exercise.name}</h3>
        {!isReadOnly && (
          <button onClick={() => onRemove(exercise.id)} className="text-gray-500 hover:text-red-500 transition-colors">
            <TrashIcon className="w-5 h-5"/>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {exercise.sets.map((set, index) => (
          <div key={set.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-700/50 p-3 rounded-lg">
            <span className="col-span-1 md:col-span-1 font-semibold text-gray-300">S{index + 1}</span>
            <div className="col-span-1 md:col-span-3">
              <input
                type="number"
                placeholder="Reps"
                value={set.reps ?? ''}
                onChange={(e) => handleSetChange(index, { reps: parseInt(e.target.value, 10) })}
                className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-1.5 text-white focus:ring-1 focus:ring-cyan-500 focus:outline-none transition"
              />
            </div>
            <div className="col-span-1 md:col-span-8 flex items-center justify-around space-x-1">
              {FEELING_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleSetChange(index, { feeling: option.value })}
                  title={option.label}
                  className={`text-2xl p-1 rounded-full transition-all duration-200 ${set.feeling === option.value ? 'bg-cyan-500/30 scale-125' : 'grayscale hover:grayscale-0 hover:scale-110'}`}
                >
                  {option.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExerciseCard;
