export interface Challenge {
  id: string;
  prompt: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CompletedChallenge {
  id: string;
  date: string;
  prompt: string;
  photoUrl: string;
  dayNumber: number;
}

export interface PhotoCapture {
  dataUrl: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
  requirement: (progress: UserProgress) => boolean;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  startDate: string;
  completedChallenges: CompletedChallenge[];
  achievements: Achievement[];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-photo',
    title: 'First Shot',
    description: 'Complete your first daily challenge',
    icon: '📸',
    requirement: (progress: UserProgress) => progress.totalCompleted >= 1
  },
  {
    id: 'week-streak',
    title: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: '🔥',
    requirement: (progress: UserProgress) => progress.currentStreak >= 7
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Complete 30 days in a row',
    icon: '👑',
    requirement: (progress: UserProgress) => progress.currentStreak >= 30
  },
  {
    id: 'half-century',
    title: 'Half Century',
    description: 'Complete 50 challenges total',
    icon: '🌟',
    requirement: (progress: UserProgress) => progress.totalCompleted >= 50
  },
  {
    id: 'century',
    title: 'Century Club',
    description: 'Complete 100 challenges total',
    icon: '🏆',
    requirement: (progress: UserProgress) => progress.totalCompleted >= 100
  }
]; 