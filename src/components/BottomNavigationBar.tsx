import { Home, Type, BookOpen, Brain, Settings, Volume2, TrendingUp } from 'lucide-react';
import { useSentence } from '../context/SentenceContext';
import { AppMode } from '../types';

export default function BottomNavigationBar() {
  const { appMode, setAppMode } = useSentence();

  const navItems: { mode: AppMode; icon: JSX.Element; label: string }[] = [
    { mode: 'read', icon: <BookOpen size={20} />, label: 'Read' },
    { mode: 'type', icon: <Type size={20} />, label: 'Type' },
    { mode: 'quiz', icon: <Brain size={20} />, label: 'Quiz' },
    { mode: 'audio', icon: <Volume2 size={20} />, label: 'Audio' },
    { mode: 'progress', icon: <TrendingUp size={20} />, label: 'Progress' },
    { mode: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-card-bg border-t border-gray-700 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.mode}
            onClick={() => setAppMode(item.mode)}
            className={`flex flex-col items-center justify-center p-2 text-sm font-medium transition-colors duration-200
              ${appMode === item.mode ? 'text-gold' : 'text-dark-secondary-text hover:text-gold'}`}
          >
            {item.icon}
            <span className="mt-1 text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
