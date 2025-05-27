import React from 'react';
import type { UserProgress, Achievement } from '../types';
import { ACHIEVEMENTS } from '../types';

interface ProgressTrackerProps {
  progress: UserProgress;
}

const MILESTONES = [
  { days: 7, name: '1 Week Streak', icon: '🌱' },
  { days: 30, name: '1 Month Dedication', icon: '🌿' },
  { days: 100, name: '100 Days Strong', icon: '🌳' },
  { days: 365, name: 'Year-Long Journey', icon: '🎯' },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const { currentStreak, longestStreak, totalCompleted, achievements = [] } = progress;
  const unlockedAchievementIds = new Set(achievements.map(a => a.id));

  const completionRate = Math.round(
    (totalCompleted / getDaysSinceStart(progress.startDate)) * 100
  );

  const nextMilestone = MILESTONES.find(
    m => totalCompleted < m.days
  ) || MILESTONES[MILESTONES.length - 1];

  const daysUntilNextMilestone = nextMilestone
    ? nextMilestone.days - totalCompleted
    : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm">Current Streak</p>
          <p className="text-2xl font-bold text-blue-600">{currentStreak}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm">Longest Streak</p>
          <p className="text-2xl font-bold text-blue-600">{longestStreak}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-gray-500 text-sm">Total Photos</p>
          <p className="text-2xl font-bold text-blue-600">{totalCompleted}</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
          <h2 className="text-white text-lg font-semibold">Achievements</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {ACHIEVEMENTS.map(achievement => {
            const unlockedAchievement = achievements.find(a => a.id === achievement.id);
            const isUnlocked = unlockedAchievementIds.has(achievement.id);

            return (
              <div
                key={achievement.id}
                className={`p-4 flex items-center ${
                  isUnlocked ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0 text-3xl mr-4">
                  {isUnlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    isUnlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  {unlockedAchievement?.unlockedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Unlocked on {new Date(unlockedAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone */}
      {daysUntilNextMilestone > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">
            <span className="font-medium">Next milestone:</span>{' '}
            {daysUntilNextMilestone} days until {nextMilestone.name}!
          </p>
        </div>
      )}
    </div>
  );
};

const getDaysSinceStart = (startDate: string) => {
  const start = new Date(startDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}; 