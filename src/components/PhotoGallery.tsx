import React, { useState } from 'react';
import type { CompletedChallenge } from '../types';
import { PhotoViewer } from './PhotoViewer';

interface PhotoGalleryProps {
  challenges: CompletedChallenge[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ challenges }) => {
  const [filter, setFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPhoto, setSelectedPhoto] = useState<CompletedChallenge | null>(null);

  const filteredChallenges = challenges.filter(challenge => {
    const matchesFilter = filter
      ? challenge.prompt.toLowerCase().includes(filter.toLowerCase())
      : true;
    const matchesDate = selectedDate
      ? challenge.date.startsWith(selectedDate)
      : true;
    return matchesFilter && matchesDate;
  });

  const months = Array.from(
    new Set(challenges.map(c => c.date.substring(0, 7)))
  ).sort((a, b) => b.localeCompare(a));

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Search prompts..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Dates</option>
              {months.map(month => (
                <option key={month} value={month}>
                  {new Date(month).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </div>
          <p className="text-gray-600">
            Showing {filteredChallenges.length} of {challenges.length} photos
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChallenges.map(challenge => (
            <div
              key={challenge.id}
              className="relative group cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedPhoto(challenge)}
            >
              <img
                src={challenge.photoUrl}
                alt={challenge.prompt}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-200">
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="text-white font-semibold mb-1">
                    Day {challenge.dayNumber}
                  </p>
                  <p className="text-white text-sm">{challenge.prompt}</p>
                  <p className="text-white/80 text-xs">
                    {new Date(challenge.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No photos match your search criteria
            </p>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}; 