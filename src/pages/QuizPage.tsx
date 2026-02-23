import { useState, useEffect, useRef, useCallback } from 'react';
import { useSentence } from '../context/SentenceContext';
import { useSettings } from '../context/SettingsContext';
import { Sentence } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const playSound = (src: string) => {
  const audio = new Audio(src);
  audio.play().catch(e => console.error("Error playing sound:", e));
};

const vibrate = (pattern: number | number[]) => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export default function QuizPage() {
  const { sentences, offlineMode } = useSentence();
  const { settings } = useSettings();

  const [currentQuizSentence, setCurrentQuizSentence] = useState<Sentence | null>(null);
  const [typedText, setTypedText] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectRandomSentence = useCallback(() => {
    if (sentences.length === 0) return;
    const filteredSentences = sentences.filter(s => {
      // Implement difficulty filtering here if needed, for now all difficulties
      return true;
    });
    const randomIndex = Math.floor(Math.random() * filteredSentences.length);
    setCurrentQuizSentence(filteredSentences[randomIndex]);
    setTypedText('');
    setAttempts(0);
    setIsCorrect(null);
    setShowFeedback(false);
    setFeedback(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [sentences]);

  useEffect(() => {
    selectRandomSentence();
  }, [selectRandomSentence]);

  const targetText = currentQuizSentence?.arabicText || '';

  const [feedback, setFeedback] = useState<JSX.Element[]>([]);

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

    setFeedback(parts);
    return allCorrect && currentTyped.length === targetText.length;
  }, [targetText]);

  const handleSubmit = () => {
    if (!currentQuizSentence) return;

    const correct = typedText === targetText;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      if (settings.enableQuizSounds) {
        // playSound('/sounds/success.mp3'); // Placeholder for success sound
      }
      setTimeout(() => {
        selectRandomSentence();
      }, 1500);
    } else {
      setStreak(0);
      if (settings.enableQuizSounds) {
        // playSound('/sounds/failure.mp3'); // Placeholder for failure sound
        vibrate(200);
      }
    }
  };

  useEffect(() => {
    highlightMistakes(typedText);
  }, [typedText, highlightMistakes]);

  if (!currentQuizSentence) {
    return <div className="p-4 text-center text-dark-secondary-text">Loading quiz...</div>;
  }

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <div className="w-full max-w-xl bg-dark-card-bg p-6 rounded-2xl shadow-lg border border-gray-700 mb-6">
        <div className="flex justify-between mb-4 text-dark-secondary-text text-sm">
          <span>Score: {score}</span>
          <span>Streak: {streak}</span>
          <span>Attempts: {attempts}</span>
        </div>

        <p
          className="font-arabic text-right mb-4 leading-relaxed"
          style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
        >
          {feedback.length > 0 ? feedback : targetText}
        </p>
        {settings.showSomaliTranslation && (
          <p
            className="text-dark-secondary-text text-right italic mt-2"
            style={{ fontSize: `${settings.fontSize * 0.8}px` }}
          >
            {currentQuizSentence.somaliTranslation}
          </p>
        )}
      </div>

      <textarea
        ref={inputRef}
        value={typedText}
        onChange={(e) => setTypedText(e.target.value)}
        className="w-full max-w-xl p-4 text-right font-arabic bg-gray-800 text-dark-text rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
        rows={3}
        placeholder="Type the Arabic sentence here..."
        style={{ fontSize: `${settings.fontSize}px`, lineHeight: settings.lineSpacing }}
      ></textarea>

      <button
        onClick={handleSubmit}
        className="bg-gold text-dark-bg px-6 py-3 rounded-full shadow-md mt-6 hover:opacity-90 transition-opacity text-lg font-bold"
      >
        Check Answer
      </button>

      <AnimatePresence>
        {showFeedback && isCorrect === true && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-green-800/70 text-white text-4xl font-bold font-arabic"
          >
            Hanbaleyn! (Correct!)
          </motion.div>
        )}
        {showFeedback && isCorrect === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center bg-red-800/70 text-white text-4xl font-bold font-arabic"
          >
            Try Again!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
