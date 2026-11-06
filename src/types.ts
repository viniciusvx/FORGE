export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms'
  | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'abs' | 'traps' | 'other';

export type Equipment =
  | 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'ez-bar' | 'kettlebell' | 'other';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  notes: string;
  createdAt: number;
  mapKey?: string;
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  technique: 'normal' | 'drop-set' | 'rest-pause' | 'bi-set';
  biSetWithId?: string;
  notes: string;
}

export interface PlanDay {
  id: string;
  label: string;
  weekday?: number;
  exercises: PlannedExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  goal: string;
  days: PlanDay[];
  createdAt: number;
  updatedAt: number;
}

export interface SetRecord {
  reps: number;
  weight: number;
  unit: 'kg' | 'lb';
  rir?: number;
  rpe?: number;
  done: boolean;
}

export interface ExerciseLog {
  plannedExerciseId: string;
  exerciseId: string;
  sets: SetRecord[];
}

export interface WorkoutSession {
  id: string;
  planId: string;
  planName: string;
  dayId: string;
  dayLabel: string;
  startedAt: number;
  finishedAt?: number;
  durationSeconds?: number;
  exercises: ExerciseLog[];
  notes: string;
  prs?: string[];
}

export interface BodyMeasurement {
  id: string;
  date: number;
  weight?: number;
  weightUnit: 'kg' | 'lb';
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  notes: string;
}

export interface UserPrefs {
  weightUnit: 'kg' | 'lb';
  restTimerDefault: number;
  showRIR: boolean;
  showRPE: boolean;
}

export type View =
  | { screen: 'home' }
  | { screen: 'workout'; planId?: string; dayId?: string }
  | { screen: 'plans' }
  | { screen: 'plan-detail'; planId: string }
  | { screen: 'plan-new' }
  | { screen: 'exercises' }
  | { screen: 'exercise-detail'; exerciseId: string }
  | { screen: 'exercise-new' }
  | { screen: 'history' }
  | { screen: 'session-detail'; sessionId: string }
  | { screen: 'progress' }
  | { screen: 'body' }
  | { screen: 'settings' }
  | { screen: 'install' }
  | { screen: 'anatomy'; exerciseKey?: string };

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  chest: 'Peito',
  back: 'Costas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  forearms: 'Antebraços',
  quads: 'Quadríceps',
  hamstrings: 'Posterior',
  glutes: 'Glúteos',
  calves: 'Panturrilha',
  abs: 'Abdômen',
  traps: 'Trapézio',
  other: 'Outro',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Barra',
  dumbbell: 'Haltere',
  cable: 'Cabo/Polia',
  machine: 'Máquina',
  bodyweight: 'Peso Corporal',
  'ez-bar': 'Barra EZ',
  kettlebell: 'Kettlebell',
  other: 'Outro',
};
