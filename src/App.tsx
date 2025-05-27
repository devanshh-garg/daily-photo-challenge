import React, { useState, useEffect } from 'react';
import { ChallengeCard } from './components/ChallengeCard';
import { CameraCapture } from './components/CameraCapture';
import { PhotoGallery } from './components/PhotoGallery';
import { ProgressTracker } from './components/ProgressTracker';
import { Navigation } from './components/Navigation';
import { AchievementNotification } from './components/AchievementNotification';
import { useDailyChallenge } from './hooks/useDailyChallenge';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAchievements } from './hooks/useAchievements';
import type { CompletedChallenge, PhotoCapture, UserProgress } from './types';

const INITIAL_PROGRESS: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  totalCompleted: 0,
  startDate: new Date().toISOString().split('T')[0],
  completedChallenges: [],
  achievements: [],
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery' | 'progress'>('home');
  const [showCamera, setShowCamera] = useState(false);
  const { challenge, dayNumber, isLoading } = useDailyChallenge();
  const [progress, setProgress] = useLocalStorage<UserProgress>('user-progress', INITIAL_PROGRESS);
  const { newAchievement, clearNewAchievement } = useAchievements(progress);

  useEffect(() => {
    // Request notification permission for achievements
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handlePhotoCapture = (photo: PhotoCapture) => {
    if (!challenge) return;

    const today = new Date().toISOString().split('T')[0];
    const completedChallenge: CompletedChallenge = {
      id: `${today}-${challenge.id}-${Date.now()}`,
      date: today,
      prompt: challenge.prompt,
      photoUrl: photo.dataUrl,
      dayNumber,
    };

    // Update progress
    const lastCompletedDate = progress.completedChallenges[0]?.date;
    const isConsecutiveDay = lastCompletedDate
      ? new Date(today).getTime() - new Date(lastCompletedDate).getTime() ===
        24 * 60 * 60 * 1000
      : true;

    const newStreak = isConsecutiveDay ? progress.currentStreak + 1 : 1;

    setProgress({
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, progress.longestStreak),
      totalCompleted: progress.totalCompleted + 1,
      completedChallenges: [completedChallenge, ...progress.completedChallenges],
    });

    setShowCamera(false);
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'gallery':
        return (
          <PhotoGallery
            challenges={progress.completedChallenges}
          />
        );
      case 'progress':
        return <ProgressTracker progress={progress} />;
      default:
        return (
          <div className="p-4">
            <ChallengeCard
              challenge={challenge}
              dayNumber={dayNumber}
              onTakePhoto={handleTakePhoto}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showCamera ? (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onCancel={handleCameraCancel}
        />
      ) : (
        <>
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Daily Photo Challenge
              </h1>
            </div>
          </header>

          <main className="max-w-7xl mx-auto pb-20">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : (
              renderCurrentPage()
            )}
          </main>

          <Navigation
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />

          {newAchievement && (
            <AchievementNotification
              achievement={newAchievement}
              onClose={clearNewAchievement}
            />
          )}
        </>
      )}
    </div>
  );
};
