import { AbacusProgress, AbacusAttempt, AbacusLesson } from '../components/features/abacus/abacus.types';
import { INITIAL_LESSONS, ALL_BADGES } from '../components/features/abacus/abacus.data';

const STORAGE_KEY = 'kharandi_abacus_progress_v1';

const DEFAULT_PROGRESS: AbacusProgress = {
  points: 0,
  level: 1,
  totalExercises: 0,
  correctAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  bestScore: 0,
  totalTimeSeconds: 0,
  completedLessons: [],
  badges: ALL_BADGES,
  dailyGoalTarget: 5,
  dailyGoalCompleted: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function getAbacusProgress(): AbacusProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    
    // Check if daily goal needs reset for a new day
    const today = new Date().toISOString().split('T')[0];
    if (parsed.lastActiveDate !== today) {
      parsed.dailyGoalCompleted = 0;
      parsed.lastActiveDate = today;
    }

    // Merge badges in case new badges were added
    const mergedBadges = ALL_BADGES.map(b => {
      const existing = parsed.badges?.find((eb: any) => eb.id === b.id);
      return existing ? { ...b, ...existing } : b;
    });

    return { ...DEFAULT_PROGRESS, ...parsed, badges: mergedBadges };
  } catch (e) {
    console.error('Failed to parse abacus progress:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: AbacusProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save abacus progress:', e);
  }
}

export function getAbacusLessons(): AbacusLesson[] {
  return INITIAL_LESSONS;
}

export function completeAbacusLesson(lessonId: string): AbacusProgress {
  const current = getAbacusProgress();
  if (!current.completedLessons.includes(lessonId)) {
    current.completedLessons.push(lessonId);
    current.points += 20; // Bonus for completing a lesson

    // Check level progression
    const level1Lessons = INITIAL_LESSONS.filter(l => l.level === 1).map(l => l.id);
    const level2Lessons = INITIAL_LESSONS.filter(l => l.level === 2).map(l => l.id);

    const level1Done = level1Lessons.every(id => current.completedLessons.includes(id));
    const level2Done = level2Lessons.every(id => current.completedLessons.includes(id));

    if (level1Done) {
      const b = current.badges.find(bg => bg.id === 'master_units');
      if (b && !b.unlocked) {
        b.unlocked = true;
        b.unlockedAt = new Date().toISOString();
      }
    }

    if (level2Done) {
      const b = current.badges.find(bg => bg.id === 'champion_tens');
      if (b && !b.unlocked) {
        b.unlocked = true;
        b.unlockedAt = new Date().toISOString();
      }
    }

    // Increase user level if appropriate
    if (current.completedLessons.length >= 8) {
      current.level = Math.max(current.level, 3);
    } else if (current.completedLessons.length >= 4) {
      current.level = Math.max(current.level, 2);
    }

    saveProgress(current);
  }
  return current;
}

export function saveAbacusAttempt(attempt: AbacusAttempt): AbacusProgress {
  const current = getAbacusProgress();
  current.totalExercises += 1;
  current.totalTimeSeconds += attempt.timeSeconds;
  current.dailyGoalCompleted = Math.min(current.dailyGoalTarget, current.dailyGoalCompleted + 1);

  if (attempt.correct) {
    current.correctAnswers += 1;
    current.currentStreak += 1;
    if (current.currentStreak > current.bestStreak) {
      current.bestStreak = current.currentStreak;
    }

    current.points += attempt.pointsEarned;
    if (current.points > current.bestScore) {
      current.bestScore = current.points;
    }

    // Badge triggers
    if (current.totalExercises >= 1) {
      unlockBadge(current, 'first_bead');
    }
    if (current.correctAnswers >= 10) {
      unlockBadge(current, 'ten_correct');
    }
    if (current.currentStreak >= 5) {
      unlockBadge(current, 'streak_5');
    }
    if (attempt.timeSeconds < 5 && attempt.timeSeconds > 0) {
      unlockBadge(current, 'lightning_calc');
    }
    if (attempt.type === 'mental') {
      unlockBadge(current, 'mental_abacus');
    }
  } else {
    current.currentStreak = 0;
  }

  saveProgress(current);
  return current;
}

function unlockBadge(progress: AbacusProgress, badgeId: string) {
  const b = progress.badges.find(bg => bg.id === badgeId);
  if (b && !b.unlocked) {
    b.unlocked = true;
    b.unlockedAt = new Date().toISOString();
  }
}

export function syncAbacusProgress(): Promise<{ success: boolean; data: AbacusProgress }> {
  // Offline / local storage service fallback ready for Django REST API integration
  return Promise.resolve({
    success: true,
    data: getAbacusProgress(),
  });
}
