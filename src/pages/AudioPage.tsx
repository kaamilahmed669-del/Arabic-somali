import { useSentence } from '../context/SentenceContext';
import { useSettings } from '../context/SettingsContext';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Play, Pause, Volume2, VolumeX, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AudioPage() {
  const { currentSentence, goToNextSentence, goToPreviousSentence, offlineMode } = useSentence();
  const { settings } = useSettings();

  const { isPlaying, currentTime, duration, isMuted, play, pause, toggleMute, seek, repeat } = useAudioPlayer(
    currentSentence?.audioUrl || null,
    settings.audioSpeed
  );

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentSentence) {
    return <div className="p-4 text-center text-dark-secondary-text">Loading sentences...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-dark-card-bg p-6 rounded-2xl shadow-lg border border-gray-700 text-center">
        <p
          className="font-arabic text-right mb-4 leading-relaxed"
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
        >
          {currentSentence.arabicText}
        </p>
        {settings.showSomaliTranslation && (
          <p
            className="text-dark-secondary-text text-right italic"
            style={{ fontSize: `${settings.fontSize * 0.8}px` }}
          >
            {currentSentence.somaliTranslation}
          </p>
        )}

        {offlineMode ? (
          <p className="text-red-500 mt-4">Audio requires internet connection.</p>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex items-center space-x-4 mb-4">
              <button onClick={repeat} className="text-gold hover:opacity-80 transition-opacity">
                <RotateCcw size={24} />
              </button>
              <button
                onClick={isPlaying ? pause : play}
                className="bg-gold text-dark-bg p-3 rounded-full shadow-md hover:opacity-90 transition-opacity"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button onClick={toggleMute} className="text-gold hover:opacity-80 transition-opacity">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>

            <div className="w-full flex items-center space-x-2 mt-2">
              <span className="text-sm text-dark-secondary-text">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gold"
              />
              <span className="text-sm text-dark-secondary-text">{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between w-full max-w-xl mt-6">
        <button
          onClick={goToPreviousSentence}
          className="bg-gold text-dark-bg px-4 py-2 rounded-full shadow-md flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <ChevronLeft size={20} />
          <span>Previous</span>
        </button>
        <button
          onClick={goToNextSentence}
          className="bg-gold text-dark-bg px-4 py-2 rounded-full shadow-md flex items-center space-x-2 hover:opacity-90 transition-opacity"
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
