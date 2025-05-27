import { useState, useEffect } from 'react';
import type { Challenge } from '../types';
import { useLocalStorage } from './useLocalStorage';

interface DailyChallengeState {
  currentChallenge: Challenge | null;
  dayNumber: number;
  date: string;
}

export const useDailyChallenge = () => {
  const [prompts, setPrompts] = useState<Challenge[]>([]);
  const [dailyState, setDailyState] = useLocalStorage<DailyChallengeState>(
    'daily-challenge',
    {
      currentChallenge: null,
      dayNumber: 0,
      date: '',
    }
  );

  useEffect(() => {
    // Load prompts from JSON file
    const loadPrompts = async () => {
      try {
        const response = await fetch('/src/data/prompts.json');
        const data = await response.json();
        setPrompts(data.prompts);
      } catch (error) {
        console.error('Error loading prompts:', error);
      }
    };

    loadPrompts();
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // If we have no challenge or it's from a different day, generate a new one
    if (!dailyState.currentChallenge || dailyState.date !== today) {
      generateNewChallenge(today);
    }
  }, [prompts]);

  const generateNewChallenge = (date: string) => {
    if (prompts.length === 0) return;

    // Use the date string to generate a consistent random number for the day
    const dateNum = date.split('-').join('');
    const randomIndex = parseInt(dateNum, 10) % prompts.length;
    
    // Get challenge for today
    const challenge = prompts[randomIndex];

    // Calculate day number
    const startDate = new Date(dailyState.date || date);
    const currentDate = new Date(date);
    const dayNumber = Math.floor(
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

    setDailyState({
      currentChallenge: challenge,
      dayNumber,
      date,
    });
  };

  return {
    challenge: dailyState.currentChallenge,
    dayNumber: dailyState.dayNumber,
    isLoading: prompts.length === 0,
  };
}; 