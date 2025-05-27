import React, { useEffect } from 'react';
import type { Achievement } from '../types';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000); // Auto-close after 5 seconds
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-500 ease-out animate-slide-in">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-4xl">{achievement.icon}</div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            Achievement Unlocked!
          </p>
          <p className="mt-1 text-sm text-gray-500">{achievement.title}</p>
          <p className="mt-1 text-xs text-gray-400">{achievement.description}</p>
        </div>
        <button
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}; 