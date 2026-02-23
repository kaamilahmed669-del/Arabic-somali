import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => void;
}

const defaultSettings: AppSettings = {
  darkMode: true,
  fontSize: 18,
  lineSpacing: 1.5,
  enableAiHints: true,
  enableQuizSounds: true,
  showSomaliTranslation: true,
  audioSpeed: 1.0,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const localSettings = localStorage.getItem('noorArabicSettings');
      return localSettings ? JSON.parse(localSettings) : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage, using default.", error);
      return defaultSettings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('noorArabicSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage.", error);
    }
  }, [settings]);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  // Apply dark mode class to body
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
