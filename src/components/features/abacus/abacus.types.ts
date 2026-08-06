export type AbacusTab = 'home' | 'learn' | 'practice' | 'mental' | 'progress';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export type MentalSpeed = 'slow' | 'normal' | 'fast';

export interface AbacusColumn {
  upperActive: boolean; // Upper bead value 5
  lowerCount: number;  // 0 to 4 beads active (value 1 each)
}

export interface AbacusBoardProps {
  value: number;
  onChange?: (value: number) => void;
  columns?: number; // Default 6 columns
  readOnly?: boolean;
  showValue?: boolean;
  compact?: boolean;
  highlightColumn?: number; // Optional column highlight for teaching
}

export interface AbacusLesson {
  id: string;
  level: number;
  title: string;
  subtitle: string;
  goal: string;
  explanation: string;
  demoValue: number;
  targetValue: number;
  operationText?: string;
  hint?: string;
}

export interface AbacusBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AbacusProgress {
  points: number;
  level: number;
  totalExercises: number;
  correctAnswers: number;
  currentStreak: number;
  bestStreak: number;
  bestScore: number;
  totalTimeSeconds: number;
  completedLessons: string[]; // Lesson IDs
  badges: AbacusBadge[];
  dailyGoalTarget: number;
  dailyGoalCompleted: number;
  lastActiveDate: string;
}

export interface AbacusAttempt {
  type: 'practice' | 'mental' | 'lesson';
  correct: boolean;
  timeSeconds: number;
  pointsEarned: number;
  lessonId?: string;
}
