import { ReactNode } from 'react';
import BottomNavigationBar from './BottomNavigationBar';
import { useSentence } from '../context/SentenceContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { offlineMode } = useSentence();

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-dark-text">
      {offlineMode && (
        <div className="bg-red-600 text-white text-center py-2 text-sm font-medium">
          Offline Mode - Audio and AI correction require internet.
        </div>
      )}
      <main className="flex-grow pb-16">
        {children}
      </main>
      <BottomNavigationBar />
    </div>
  );
}
