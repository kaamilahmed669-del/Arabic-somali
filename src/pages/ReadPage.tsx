import { useEffect } from 'react';
import { useSentence } from '../context/SentenceContext';
import { useSettings } from '../context/SettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReadPage() {
  const { currentSentence, goToNextSentence, goToPreviousSentence, currentSentenceIndex, goToSentenceByIndex, sentences } = useSentence();
  const { settings } = useSettings();

  // Save and load last read sentence index
  useEffect(() => {
    const lastReadIndex = localStorage.getItem('lastReadSentenceIndex');
    if (lastReadIndex) {
      goToSentenceByIndex(parseInt(lastReadIndex, 10));
    }
  }, [goToSentenceByIndex]);

  useEffect(() => {
    if (currentSentenceIndex !== undefined) {
      localStorage.setItem('lastReadSentenceIndex', currentSentenceIndex.toString());
    }
  }, [currentSentenceIndex]);

  if (!currentSentence) {
    return <div className="p-4 text-center text-dark-secondary-text">Loading sentences...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-dark-card-bg p-6 rounded-2xl shadow-lg border border-gray-700">
        <p
          className="font-arabic text-right mb-4 leading-relaxed"
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineSpacing,
          }}
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
