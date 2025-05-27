import { useEffect, useState } from 'react';
import type { Achievement, UserProgress } from '../types';
import { ACHIEVEMENTS } from '../types';

export function useAchievements(progress: UserProgress) {
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const checkAchievements = () => {
      const currentAchievements = progress.achievements || [];
      const unlockedAchievementIds = new Set(currentAchievements.map(a => a.id));
      
      // Check for new achievements
      for (const achievement of ACHIEVEMENTS) {
        if (!unlockedAchievementIds.has(achievement.id) && achievement.requirement(progress)) {
          const newUnlock: Achievement = {
            ...achievement,
            unlockedAt: new Date().toISOString()
          };
          
          // Update progress with new achievement
          progress.achievements = [...currentAchievements, newUnlock];
          setNewAchievement(newUnlock);
          
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New Achievement Unlocked! 🎉', {
              body: `${achievement.title} - ${achievement.description}`,
              icon: '/icons/icon-192x192.png'
            });
          }
          
          break; // Only show one new achievement at a time
        }
      }
    };

    checkAchievements();
  }, [progress]);

  return {
    achievements: progress.achievements || [],
    newAchievement,
    clearNewAchievement: () => setNewAchievement(null)
  };
} 