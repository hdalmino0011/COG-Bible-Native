import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Droplets,
  Type,
  TextQuote,
  BellRing,
  Sparkles,
  Smartphone,
  Clock
} from 'lucide-react';
import { AppTheme, BibleData, FontFamily, FontSize, UserPreferences } from '../types';
import { getNotificationPermissionStatus, requestNotificationPermission, sendDailyVerseNotification, isNotificationSupported } from '../utils/notifications';
import { getRandomDailyVerse } from '../data/dailyVerses';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface SettingsScreenProps {
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  bibleData?: BibleData;
  onShowToast?: (msg: string) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  preferences,
  onUpdatePreferences,
  bibleData,
  onShowToast
}) => {
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus());

  const themes: Array<{ id: AppTheme; label: string; icon: React.ReactNode }> = [
    {
      id: 'light',
      label: 'Light',
      icon: <Sun className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'dark',
      label: 'Dark',
      icon: <Moon className="w-4 h-4 text-indigo-300" />
    },
    {
      id: 'blue',
      label: 'Navy Blue',
      icon: <Droplets className="w-4 h-4 text-blue-400" />
    }
  ];

  const fonts: Array<{ id: FontFamily; label: string }> = [
    { id: 'Roboto', label: 'Roboto (Modern Sans)' },
    { id: 'Playfair', label: 'Playfair (Classic Serif)' },
    { id: 'Georgia', label: 'Georgia (Editorial)' },
    { id: 'Times', label: 'Times New Roman' },
    { id: 'Arial', label: 'Arial' }
  ];

  const fontSizes: Array<{ id: FontSize; label: string; preview: string }> = [
    { id: 'small', label: 'Small', preview: '14px' },
    { id: 'medium', label: 'Medium', preview: '16px' },
    { id: 'large', label: 'Large', preview: '18px' },
    { id: 'xlarge', label: 'X-Large', preview: '20px' },
    { id: 'xxlarge', label: 'XX-Large', preview: '22px' }
  ];

  const handleToggleNotifications = async () => {
    const nextState = !preferences.dailyVerseNotification;
    if (nextState && isNotificationSupported() && Notification.permission !== 'granted') {
      const granted = await requestNotificationPermission();
      setPermStatus(granted);
      if (granted !== 'granted') {
        onShowToast?.('Please enable notifications in your phone browser settings');
        return;
      }
    }
    onUpdatePreferences({ dailyVerseNotification: nextState });
    onShowToast?.(nextState ? 'Daily Verse Notifications enabled' : 'Daily Verse Notifications turned off');
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    const randomVerse = getRandomDailyVerse(bibleData);
    const success = await sendDailyVerseNotification(
      randomVerse,
      `📖 Daily Verse: ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
    );
    setPermStatus(getNotificationPermissionStatus());
    setIsTestingNotification(false);
    if (success) {
      onShowToast?.(`Sent notification for ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}!`);
    } else {
      onShowToast?.('Could not send notification. Please allow notifications for this app.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 max-w-2xl mx-auto w-full pb-28 space-y-6">
      {/* Visual Theme */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <Sun className="w-4 h-4 text-[#C9A227]" />
          Visual Theme
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          High-contrast reading modes tailored for daylight and night scripture study.
        </p>
        <div className="grid grid-cols-3 gap-2.5">
          {themes.map((t) => {
            const isSelected = preferences.theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onUpdatePreferences({ theme: t.id })}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A227] bg-[#C9A227]/15 text-[#C9A227] dark:text-[#F3DE8A] shadow-xs ring-1 ring-[#C9A227]'
                    : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227] bg-transparent'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Verse Notification & Phone Integration */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#C9A227]/15 text-[#C9A227] shrink-0 mt-0.5">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base" style={{ color: 'var(--ink)' }}>
                Daily Scripture Notifications
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                Receive an inspiring verse directly on your phone every day
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
            <input
              type="checkbox"
              checked={!!preferences.dailyVerseNotification}
              onChange={handleToggleNotifications}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#1B3A6B] dark:peer-checked:bg-[#C9A227]"></div>
          </label>
        </div>

        {preferences.dailyVerseNotification && (
          <div className="pt-3 border-t border-gray-100 dark:border-[#22314E] space-y-3.5">
            {/* Scheduled Time Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#0E172A]/70 border border-gray-200/80 dark:border-[#22314E]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A227]" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  Scheduled Daily Time
                </span>
              </div>
              <input
                type="time"
                value={preferences.notificationTime || '07:00'}
                onChange={(e) => onUpdatePreferences({ notificationTime: e.target.value })}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 dark:border-[#33476E] bg-white dark:bg-[#142036] text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227] cursor-pointer"
              />
            </div>

            {/* Permission Status and Test Button Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0E172A]/70 border border-gray-200/80 dark:border-[#22314E]">
                <Smartphone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Status:
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  permStatus === 'granted'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                }`}>
                  {permStatus === 'granted' ? 'Active & Ready' : 'Permission Required'}
                </span>
              </div>

              <button
                onClick={handleTestNotification}
                disabled={isTestingNotification}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-[#1B3A6B] to-[#2C548F] dark:from-[#C9A227] dark:to-[#E4C765] text-white dark:text-[#0E1B33] hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTestingNotification ? 'Sending...' : 'Test Notification'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Font Family */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
          <Type className="w-4 h-4 text-[#C9A227]" />
          Scripture Font Style
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdatePreferences({ font: f.id })}
              className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer ${
                preferences.font === f.id
                  ? 'border-[#C9A227] bg-[#C9A227]/15 text-gray-900 dark:text-amber-200 font-bold shadow-xs ring-1 ring-[#C9A227]'
                  : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227] bg-transparent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size (Vertically Aligned) */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-3">
        <div>
          <h3 className="font-serif font-bold text-base flex items-center gap-2" style={{ color: 'var(--ink)' }}>
            <TextQuote className="w-4 h-4 text-[#C9A227]" />
            Text Size
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Select your preferred reading text size for Bible chapters and verses.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          {fontSizes.map((s) => {
            const isSelected = preferences.fontSize === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onUpdatePreferences({ fontSize: s.id })}
                className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#C9A227] bg-[#C9A227]/15 text-gray-900 dark:text-[#F3DE8A] font-bold shadow-xs ring-1 ring-[#C9A227]'
                    : 'border-gray-200 dark:border-[#22314E] text-gray-700 dark:text-gray-300 hover:border-[#C9A227]/60 bg-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-[#C9A227] bg-[#C9A227]'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-[#0E1B33]" />}
                  </div>
                  <span className="text-sm">{s.label}</span>
                </div>
                <span className="text-xs opacity-70 font-mono">{s.preview}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* About The Church of God */}
      <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-[#22314E]">
          <img
            src={EMBEDDED_LOGO_DATA_URI}
            alt="The Church of God Seal"
            className="w-14 h-14 rounded-full border-2 border-[#C9A227] shadow-md object-contain bg-[#142748] p-1 flex-shrink-0"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.dataset.triedJpg) {
                target.dataset.triedJpg = 'true';
                target.src = './logo.jpg';
              } else if (!target.dataset.triedPng) {
                target.dataset.triedPng = 'true';
                target.src = './logo.png';
              }
            }}
          />
          <div>
            <h3 className="font-serif font-bold text-base" style={{ color: 'var(--ink)' }}>
              The Church of God
            </h3>
            <p className="text-xs text-[#C9A227] font-semibold">
              (Truth, Justice, and Righteousness)
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Jerusalem, Israel • Anno Domini
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 dark:border-[#22314E]">
            <span className="text-gray-500 dark:text-gray-400">Application:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">COG (T.J.R) Bible</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500 dark:text-gray-400">Bible Versions:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-right">
              Cebuano (Bugna) &amp; English (KJV)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

