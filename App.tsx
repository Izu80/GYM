import React, { useState, useEffect, useCallback } from 'react';
import { WeeklyRoutine, AppLogs, DailyLog, RoutineExercise, ExerciseLog } from './types';
import HomeView from './components/HomeView';
import WorkoutView from './components/WorkoutView';
import RoutineSetupView from './components/RoutineSetupView';

// Custom hook for localStorage
function useLocalStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [key, state]);

  return [state, setState];
}


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'workout' | 'routine_setup'>('home');
  const [currentWeek, setCurrentWeek] = useLocalStorageState<number>('gym_tracker_week', 1);
  const [selectedDay, setSelectedDay] = useState<string>('');
  
  const [weeklyRoutine, setWeeklyRoutine] = useLocalStorageState<WeeklyRoutine>('gym_tracker_routine', {});
  const [logs, setLogs] = useLocalStorageState<AppLogs>('gym_tracker_logs', {});

  const handleSelectDay = (day: string) => {
    setSelectedDay(day);
    setCurrentView('workout');
  };
  
  const handleNavigateHome = () => {
    setCurrentView('home');
  };

  const handleGoToRoutineSetup = () => {
    setCurrentView('routine_setup');
  };

  const getOrCreateDailyLog = useCallback((week: number, day: string): DailyLog => {
    const dayRoutine = weeklyRoutine[day] || [];
    
    if (logs[week] && logs[week][day]) {
      const existingLog = logs[week][day];
      // Sync with routine: Add new exercises from routine, keep existing data for old ones.
      const updatedExercises = dayRoutine.map(routineEx => {
          const existingExLog = existingLog.exercises.find(logEx => logEx.id === routineEx.id);
          if (existingExLog) {
              return existingExLog; // Keep existing log data
          }
          // New exercise added to routine, create its log structure
          return {
              ...routineEx,
              sets: Array.from({ length: routineEx.targetSets }, (_, i) => ({
                  id: `set-${routineEx.id}-${i}`,
                  reps: null,
                  feeling: null,
                  completed: false,
              })),
          };
      });

      // Filter out exercises that are no longer in the routine
      const finalExercises = updatedExercises.filter(ex => 
        dayRoutine.some(routineEx => routineEx.id === ex.id)
      );

      return { ...existingLog, exercises: finalExercises };
    }
    
    // If no log exists, create one from the routine
    const newExercises: ExerciseLog[] = dayRoutine.map((routineEx: RoutineExercise) => ({
      ...routineEx,
      sets: Array.from({ length: routineEx.targetSets }, (_, i) => ({
        id: `set-${routineEx.id}-${i}`,
        reps: null,
        feeling: null,
        completed: false,
      })),
    }));

    return {
      week,
      day,
      date: new Date().toISOString(),
      exercises: newExercises,
    };
  }, [logs, weeklyRoutine]);
  
  const handleUpdateLog = (updatedLog: DailyLog) => {
    setLogs(prevLogs => ({
      ...prevLogs,
      [updatedLog.week]: {
        ...(prevLogs[updatedLog.week] || {}),
        [updatedLog.day]: updatedLog,
      }
    }));
  };
  
  const renderView = () => {
    switch(currentView) {
      case 'workout':
        const logForView = getOrCreateDailyLog(currentWeek, selectedDay);
        return <WorkoutView 
                  dailyLog={logForView}
                  onUpdateLog={handleUpdateLog}
                  onBack={handleNavigateHome}
               />;
      case 'routine_setup':
        return <RoutineSetupView 
                  weeklyRoutine={weeklyRoutine}
                  onUpdateRoutine={setWeeklyRoutine}
                  onBack={handleNavigateHome}
               />;
      case 'home':
      default:
        return <HomeView 
                  currentWeek={currentWeek}
                  onWeekChange={setCurrentWeek}
                  onSelectDay={handleSelectDay}
                  onGoToRoutineSetup={handleGoToRoutineSetup}
                  logs={logs}
                />;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {renderView()}
    </div>
  );
};

export default App;
