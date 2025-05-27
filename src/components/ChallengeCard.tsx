import React from 'react';
import type { Challenge } from '../types';

interface ChallengeCardProps {
  challenge: Challenge | null;
  dayNumber: number;
  onTakePhoto: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  dayNumber,
  onTakePhoto,
}) => {
  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-100 rounded-lg p-6">
        <p className="text-gray-500">Loading today's challenge...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
        <h2 className="text-white text-xl font-bold">Day {dayNumber}</h2>
        <p className="text-white/80 text-sm">Today's Challenge</p>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{challenge.prompt}</h3>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            {challenge.category}
          </span>
          {challenge.difficulty && (
            <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={onTakePhoto}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Take Photo
          </button>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-blue-800 font-medium mb-2">Tips:</h4>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Take your time to find the perfect subject</li>
              <li>• Experiment with different angles</li>
              <li>• Consider the lighting conditions</li>
              <li>• Focus on capturing the essence of the prompt</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-700';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-700';
    case 'advanced':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}; 