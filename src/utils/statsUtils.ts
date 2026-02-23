export interface DailyStats {
  date: string; // YYYY-MM-DD
  readingTime: number; // seconds
  typingTime: number; // seconds
  typingAccuracy: number; // percentage
  typingSpeed: number; // LPM
}

export const getDailyStats = (): DailyStats[] => {
  // Placeholder for fetching actual daily stats from localStorage or API
  // For now, return some mock data
  return [
    { date: '2026-02-18', readingTime: 120, typingTime: 60, typingAccuracy: 85, typingSpeed: 30 },
    { date: '2026-02-19', readingTime: 180, typingTime: 90, typingAccuracy: 88, typingSpeed: 35 },
    { date: '2026-02-20', readingTime: 150, typingTime: 75, typingAccuracy: 90, typingSpeed: 38 },
    { date: '2026-02-21', readingTime: 200, typingTime: 100, typingAccuracy: 92, typingSpeed: 40 },
    { date: '2026-02-22', readingTime: 240, typingTime: 120, typingAccuracy: 91, typingSpeed: 42 },
    { date: '2026-02-23', readingTime: 100, typingTime: 50, typingAccuracy: 89, typingSpeed: 39 },
  ];
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
