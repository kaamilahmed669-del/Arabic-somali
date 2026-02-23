import { useState, useEffect, useRef, useCallback } from 'react';
import { useSentence } from '../context/SentenceContext';
import { useSettings } from '../context/SettingsContext';
import { getDetailedTypingCorrection } from '../services/aiCorrectionService';

export default function TypingPage() {
  const { currentSentence, goToNextSentence, offlineMode } = useSentence();
  const { settings } = useSettings();

  const [typedText, setTypedText] = useState('');
  const [highlightedText, setHighlightedText] = useState<JSX.Element[]>([]);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const targetText = currentSentence?.arabicText || '';

  const calculateStats = useCallback((currentTyped: string) => {
    const correctChars = currentTyped.split('').filter((char, i) => char === targetText[i]).length;
    const currentAccuracy = targetText.length > 0 ? (correctChars / targetText.length) * 100 : 100;
    setAccuracy(parseFloat(currentAccuracy.toFixed(2)));

    if (startTime) {
      const timeElapsed = (Date.now() - startTime) / 60000; // in minutes
      if (timeElapsed > 0) {
        setTypingSpeed(Math.round(currentTyped.length / timeElapsed));
      }
    }
  }, [targetText, startTime]);

  const highlightMistakes = useCallback((currentTyped: string) => {
    const parts: JSX.Element[] = [];
    let allCorrect = true;

    for (let i = 0; i < targetText.length; i++) {
      if (i < currentTyped.length) {
        if (currentTyped[i] === targetText[i]) {
          parts.push(<span key={i} className="text-dark-text">{targetText[i]}</span>);
        } else {
          parts.push(<span key={i} className="text-red-500 bg-red-900/30 rounded-sm">{targetText[i]}</span>);
          allCorrect = false;
        }
      } else {
        parts.push(<span key={i} className="text-dark-secondary-text opacity-50">{targetText[i]}</span>);
        allCorrect = false;
      }
    }

    // Handle extra characters typed by the user
    if (currentTyped.length > targetText.length) {
      for (let i = targetText.length; i < currentTyped.length; i++) {
        parts.push(<span key={i} className="text-red-500 bg-red-900/30 rounded-sm">{currentTyped[i]}</span>);
        allCorrect = false;
      }
    }

    setHighlightedText(parts);
    return allCorrect && currentTyped.length === targetText.length;
  }, [targetText]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTypedText(value);

    if (!startTime) {
      setStartTime(Date.now());
    }

    const isCompleteAndCorrect = highlightMistakes(value);
    calculateStats(value);

    if (isCompleteAndCorrect) {
      setFeedback('Perfect! Moving to the next sentence...');
      setTimeout(() => {
        setTypedText('');
        setHighlightedText([]);
        setStartTime(null);
        setFeedback(null);
        goToNextSentence();
      }, 1500);
    } else if (settings.enableAiHints && !offlineMode && value.length > 0) {
      // Only fetch AI correction if there's a mistake and hints are enabled and online
      if (value.length > 0 && value !== targetText.substring(0, value.length)) {
        const aiResponse = await getDetailedTypingCorrection(value, targetText);
        if (aiResponse) {
          setFeedback(aiResponse.feedback);
        } else {
          setFeedback(null);
        }
      } else {
        setFeedback(null);
      }
    }
  };

  useEffect(() => {
    setTypedText('');
    setHighlightedText([]);
    setStartTime(null);
    setFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentSentence]);

  useEffect(() => {
    highlightMistakes(typedText);
  }, [settings.darkMode, settings.fontSize, settings.lineSpacing, highlightMistakes, typedText]);

  if (!currentSentence) {
    return <div className="p-4 text-center text-dark-secondary-text">Loading sentences...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-dark-card-bg p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <p
          className="font-arabic text-right mb-4 leading-relaxed text-dark-secondary-text"
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
        >
          {highlightedText.length > 0 ? highlightedText : targetText}
        </p>
        {settings.showSomaliTranslation && (
          <p
            className="text-dark-secondary-text text-right italic mt-2"
            style={{ fontSize: `${settings.fontSize * 0.8}px` }}
          >
            {currentSentence.somaliTranslation}
          </p>
        )}
      </div>

      <textarea
        ref={inputRef}
        value={typedText}
        onChange={handleInputChange}
        className="w-full max-w-xl p-4 text-right font-arabic bg-gray-800 text-dark-text rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
        rows={3}
        placeholder="Start typing here..."
        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
      ></textarea>

      {feedback && settings.enableAiHints && !offlineMode && ( // Only show AI feedback if online and hints enabled
        <div className="w-full max-w-xl mt-4 p-3 bg-blue-900/30 text-blue-300 rounded-lg text-right">
          <p className="font-arabic" dangerouslySetInnerHTML={{ __html: feedback }}></p>
        </div>
      )}

      <div className="w-full max-w-xl mt-4 flex justify-between text-dark-secondary-text text-sm">
        <span>Speed: {typingSpeed} LPM</span>
        <span>Accuracy: {accuracy}%</span>
      </div>
    </div>
  );
}
