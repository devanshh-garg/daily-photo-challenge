import React from 'react';
import type { CompletedChallenge } from '../types';

interface PhotoViewerProps {
  photo: CompletedChallenge;
  onClose: () => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({ photo, onClose }) => {
  const handleShare = async () => {
    try {
      // Convert data URL to blob
      const response = await fetch(photo.photoUrl);
      const blob = await response.blob();
      
      // Create file from blob
      const file = new File([blob], 'daily-photo-challenge.jpg', { type: 'image/jpeg' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Daily Photo Challenge',
          text: `Day ${photo.dayNumber}: ${photo.prompt}`,
          files: [file],
        });
      } else {
        // Fallback for browsers that don't support file sharing
        await navigator.share({
          title: 'Daily Photo Challenge',
          text: `Day ${photo.dayNumber}: ${photo.prompt}`,
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 p-4 flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Day {photo.dayNumber}</h3>
          <p className="text-white/80 text-sm">{photo.prompt}</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleShare}
            className="p-2 text-white/80 hover:text-white"
            aria-label="Share photo"
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white"
            aria-label="Close viewer"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photo.photoUrl}
          alt={photo.prompt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Footer */}
      <div className="bg-black/50 p-4">
        <p className="text-white/80 text-sm">
          Taken on {new Date(photo.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}; 