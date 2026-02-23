import { useSentence } from '../context/SentenceContext';
import { useSettings } from '../context/SettingsContext';
import { getDailyStats, formatTime } from '../utils/statsUtils';

export default function ProgressPage() {
  const { offlineMode } = useSentence();
  const { settings } = useSettings();
  const dailyStats = getDailyStats();

  const latestStats = dailyStats[dailyStats.length - 1];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold mb-6">Your Progress</h1>

      {offlineMode && (
        <div className="bg-red-900/30 text-red-300 p-3 rounded-lg mb-6 text-center">
          Offline. Progress data may not be fully up-to-date or saved online.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-card-bg p-5 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-gold mb-3">Today's Summary ({latestStats?.date})</h2>
          <p className="text-lg mb-2">Reading Time: <span className="font-bold">{latestStats ? formatTime(latestStats.readingTime) : 'N/A'}</span></p>
          <p className="text-lg mb-2">Typing Time: <span className="font-bold">{latestStats ? formatTime(latestStats.typingTime) : 'N/A'}</span></p>
          <p className="text-lg mb-2">Typing Accuracy: <span className="font-bold">{latestStats ? `${latestStats.typingAccuracy}%` : 'N/A'}</span></p>
          <p className="text-lg">Typing Speed: <span className="font-bold">{latestStats ? `${latestStats.typingSpeed} LPM` : 'N/A'}</span></p>
        </div>

        <div className="bg-dark-card-bg p-5 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-gold mb-3">Overall Stats</h2>
          <p className="text-lg mb-2">Total Sentences Read: <span className="font-bold">{dailyStats.length}</span></p>
          <p className="text-lg mb-2">Average Accuracy: <span className="font-bold">{(dailyStats.reduce((sum, stat) => sum + stat.typingAccuracy, 0) / dailyStats.length || 0).toFixed(2)}%</span></p>
          <p className="text-lg">Max Streak: <span className="font-bold">5</span></p>
        </div>
      </div>

      <div className="bg-dark-card-bg p-5 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <h2 className="text-xl font-semibold text-gold mb-3">Typing Speed Improvement</h2>
        <div className="h-48 bg-gray-800 rounded-lg flex items-end p-2">
          {dailyStats.map((stat, index) => (
            <div key={index} className="flex-grow h-full flex flex-col justify-end items-center mx-1">
              <div
                className="w-4 bg-gold rounded-t-sm"
                style={{ height: `${(stat.typingSpeed / 50) * 100}%` }} // Max speed 50 LPM for scaling
              ></div>
              <span className="text-xs text-dark-secondary-text mt-1">{stat.typingSpeed}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-dark-secondary-text mt-2">Last 7 Days (LPM)</p>
      </div>

      <div className="bg-dark-card-bg p-5 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold text-gold mb-3">Accuracy History</h2>
        <div className="h-48 bg-gray-800 rounded-lg flex items-end p-2">
          {dailyStats.map((stat, index) => (
            <div key={index} className="flex-grow h-full flex flex-col justify-end items-center mx-1">
              <div
                className="w-4 bg-blue-500 rounded-t-sm"
                style={{ height: `${stat.typingAccuracy}%` }}
              ></div>
              <span className="text-xs text-dark-secondary-text mt-1">{stat.typingAccuracy}%</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-dark-secondary-text mt-2">Last 7 Days (Accuracy %)</p>
      </div>
    </div>
  );
}
