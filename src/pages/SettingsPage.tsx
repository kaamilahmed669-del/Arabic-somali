import { useSettings } from '../context/SettingsContext';

export default function SettingsPage() {
  const { settings, updateSetting } = useSettings();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gold mb-4">Settings</h1>

      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-gold"
            checked={settings.darkMode}
            onChange={(e) => updateSetting('darkMode', e.target.checked)}
          />
          <span className="text-lg">Dark Mode</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Font Size: {settings.fontSize}px</label>
        <input
          type="range"
          min="14"
          max="24"
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
          className="w-full accent-gold"
        />
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Line Spacing: {settings.lineSpacing.toFixed(1)}</label>
        <input
          type="range"
          min="1.0"
          max="2.5"
          step="0.1"
          value={settings.lineSpacing}
          onChange={(e) => updateSetting('lineSpacing', parseFloat(e.target.value))}
          className="w-full accent-gold"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-gold"
            checked={settings.showSomaliTranslation}
            onChange={(e) => updateSetting('showSomaliTranslation', e.target.checked)}
          />
          <span className="text-lg">Show Somali Translation</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-gold"
            checked={settings.enableAiHints}
            onChange={(e) => updateSetting('enableAiHints', e.target.checked)}
          />
          <span className="text-lg">Enable AI Hints (Typing)</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            className="toggle toggle-gold"
            checked={settings.enableQuizSounds}
            onChange={(e) => updateSetting('enableQuizSounds', e.target.checked)}
          />
          <span className="text-lg">Enable Quiz Sounds/Vibrations</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-lg mb-2">Audio Speed: {settings.audioSpeed.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={settings.audioSpeed}
          onChange={(e) => updateSetting('audioSpeed', parseFloat(e.target.value))}
          className="w-full accent-gold"
        />
      </div>
    </div>
  );
}
