import { SettingsProvider } from './context/SettingsContext';
import { SentenceProvider } from './context/SentenceContext';
import Layout from './components/Layout';
import { useSentence } from './context/SentenceContext';
import ReadPage from './pages/ReadPage';
import TypingPage from './pages/TypingPage';
import QuizPage from './pages/QuizPage';
import AudioPage from './pages/AudioPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';

function AppContent() {
  const { appMode } = useSentence();

  const renderPage = () => {
    switch (appMode) {
      case 'read':
        return <ReadPage />;
      case 'type':
        return <TypingPage />;
      case 'quiz':
        return <QuizPage />;
      case 'audio':
        return <AudioPage />;
      case 'progress':
        return <ProgressPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ReadPage />;
    }
  };

  return <Layout>{renderPage()}</Layout>;
}

export default function App() {
  return (
    <SettingsProvider>
      <SentenceProvider>
        <AppContent />
      </SentenceProvider>
    </SettingsProvider>
  );
}

