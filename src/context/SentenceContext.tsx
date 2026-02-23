import { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { Sentence, AppMode } from '../types';
import sentencesData from '../data/sentences.json';

interface SentenceContextType {
  sentences: Sentence[];
  currentSentence: Sentence | null;
  currentSentenceIndex: number;
  goToNextSentence: () => void;
  goToPreviousSentence: () => void;
  goToSentenceById: (id: string) => void;
  goToSentenceByIndex: (index: number) => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  offlineMode: boolean;
  setOfflineMode: (isOffline: boolean) => void;
}

const SentenceContext = createContext<SentenceContextType | undefined>(undefined);

export const SentenceProvider = ({ children }: { children: ReactNode }) => {
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [appMode, setAppMode] = useState<AppMode>('read');
  const [offlineMode, setOfflineMode] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    setSentences(sentencesData as Sentence[]);
  }, []);

  useEffect(() => {
    const handleOnline = () => setOfflineMode(false);
    const handleOffline = () => setOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const currentSentence = sentences[currentSentenceIndex] || null;

  const goToNextSentence = useCallback(() => {
    setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
  }, [sentences.length]);

  const goToPreviousSentence = useCallback(() => {
    setCurrentSentenceIndex((prevIndex) => (prevIndex - 1 + sentences.length) % sentences.length);
  }, [sentences.length]);

  const goToSentenceById = useCallback((id: string) => {
    const index = sentences.findIndex(s => s.id === id);
    if (index !== -1) {
      setCurrentSentenceIndex(index);
    }
  }, [sentences]);

  const goToSentenceByIndex = useCallback((index: number) => {
    if (index >= 0 && index < sentences.length) {
      setCurrentSentenceIndex(index);
    }
  }, [sentences.length]);

  return (
    <SentenceContext.Provider
      value={{
        sentences,
        currentSentence,
        currentSentenceIndex,
        goToNextSentence,
        goToPreviousSentence,
        goToSentenceById,
        goToSentenceByIndex,
        appMode,
        setAppMode,
        offlineMode,
        setOfflineMode,
      }}
    >
      {children}
    </SentenceContext.Provider>
  );
};

export const useSentence = () => {
  const context = useContext(SentenceContext);
  if (context === undefined) {
    throw new Error('useSentence must be used within a SentenceProvider');
  }
  return context;
};
