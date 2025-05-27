export interface Challenge {
  id: string;
  prompt: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CompletedChallenge {
  id: string;
  date: string;
  prompt: string;
  photoUrl: string;
  dayNumber: number;
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  startDate: string;
  completedChallenges: CompletedChallenge[];
  achievements: Achievement[];
}

export interface PhotoCapture {
  dataUrl: string;
  file?: File;
}

export interface PhotoMetadata {
  width: number;
  height: number;
  type: string;
  size: number;
}

export interface CameraOptions {
  facingMode: 'user' | 'environment';
  flash: boolean;
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