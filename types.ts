export enum Feeling {
  Awful = '😩',
  Bad = '😟',
  Okay = '😐',
  Good = '🙂',
  Great = '🤩',
}

export interface SetLog {
  id: string;
  reps: number | null;
  feeling: Feeling | null;
  completed: boolean;
}

export interface ExerciseLog {
  id: string; // Corresponds to RoutineExercise.id
  name: string;
  targetSets: number;
  sets: SetLog[];
}

export interface DailyLog {
  week: number;
  day: string;
  exercises: ExerciseLog[];
  date: string; // ISO date string
}

// Data structure for storing weekly logs.
// Key is the week number.
export type AppLogs = {
  [week: number]: {
    // Key is the day of the week (e.g., 'Lunes')
    [day: string]: DailyLog;
  };
};

// Data structure for the routine template.
export interface RoutineExercise {
    id: string;
    name: string;
    targetSets: number;
}

// Key is the day of the week (e.g., 'Lunes')
export type WeeklyRoutine = {
    [day: string]: RoutineExercise[];
};
