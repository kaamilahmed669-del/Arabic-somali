export interface Sentence {
  id: string;
  arabicText: string;
  somaliTranslation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioUrl: string;
}

export interface AppSettings {
  darkMode: boolean;
  fontSize: number;
  lineSpacing: number;
  enableAiHints: boolean;
  enableQuizSounds: boolean;
  showSomaliTranslation: boolean;
  audioSpeed: number;
}

export type AppMode = 'read' | 'type' | 'quiz' | 'audio' | 'progress' | 'settings';
