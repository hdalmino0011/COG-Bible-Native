import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Droplets,
  Type,
  TextQuote,
  BellRing,
  ShieldCheck,
  Smartphone,
  Clock,
  Palette,
  Info,
  ChevronRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { AppTheme, BibleData, FontFamily, FontSize, UserPreferences } from '../types';
import {
  getNotificationPermissionStatus,
  getAsyncNotificationPermissionStatus,
  checkHasNotificationPermission,
  requestNotificationPermission,
  sendDailyVerseNotification,
  isNotificationSupported,
  scheduleNativeDailyRecurringNotification
} from '../utils/notifications';
import { getRandomDailyVerse } from '../data/dailyVerses';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

type SettingsSection = 'menu' | 'display' | 'notifications' | 'privacy' | 'about';

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
  const [activeSection, setActiveSection] = useState<SettingsSection>('menu');
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [permStatus, setPermStatus] = useState(getNotificationPermissionStatus());

  useEffect(() => {
    getAsyncNotificationPermissionStatus().then((status) => setPermStatus(status));
  }, []);

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
    { id: 'Times', label: 'Times New Roman' },
    { id: 'ComicSans', label: 'Comic Sans' },
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
    if (nextState && isNotificationSupported()) {
      const hasPerm = await checkHasNotificationPermission();
      if (!hasPerm) {
        const granted = await requestNotificationPermission();
        setPermStatus(granted);
        if (granted !== 'granted') {
          onShowToast?.('Please allow notification permission in your device settings');
          return;
        }
      }
    }
    onUpdatePreferences({ dailyVerseNotification: nextState });
    if (nextState) {
      scheduleNativeDailyRecurringNotification(preferences.notificationTime || '07:00');
      const randomVerse = getRandomDailyVerse(bibleData);
      sendDailyVerseNotification(
        randomVerse,
        `📖 Daily Verse: ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
      );
    }
    const currentStatus = await getAsyncNotificationPermissionStatus();
    setPermStatus(currentStatus);
    onShowToast?.(nextState ? '🔔 Daily Verse Notifications enabled' : 'Daily Verse Notifications turned off');
  };

  const handleTestNotification = async () => {
    setIsTestingNotification(true);
    const randomVerse = getRandomDailyVerse(bibleData);
    const success = await sendDailyVerseNotification(
      randomVerse,
      `📖 Daily Verse: ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}`
    );
    const currentStatus = await getAsyncNotificationPermissionStatus();
    setPermStatus(currentStatus);
    setIsTestingNotification(false);
    if (success) {
      onShowToast?.(`Sent notification for ${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse}!`);
    } else {
      onShowToast?.('Could not send notification. Please allow notifications for this app.');
    }
  };

  // Helper summary labels for the main menu cards
  const getThemeLabel = () => {
    const found = themes.find((t) => t.id === preferences.theme);
    return found ? found.label : 'Navy Blue';
  };

  const getFontSizeLabel = () => {
    const found = fontSizes.find((s) => s.id === preferences.fontSize);
    return found ? found.label : 'Medium';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--ivory)] text-[var(--slate)] overflow-y-auto">
      {/* Sub-header when viewing a specific section */}
      {activeSection !== 'menu' && (
        <div className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--line)] shadow-xs">
          <button
            onClick={() => setActiveSection('menu')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1B3A6B] dark:text-[#E4C765] hover:bg-[#C9A227]/10 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Settings Menu</span>
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C9A227]">
            {activeSection === 'display' && 'Display Settings'}
            {activeSection === 'notifications' && 'Notification Settings'}
            {activeSection === 'privacy' && 'Privacy & Policy'}
            {activeSection === 'about' && 'About COG Bible'}
          </span>
        </div>
      )}

      <div className="px-4 py-5 max-w-2xl mx-auto w-full pb-28 space-y-5">
        {/* ================= 1. SETTINGS MAIN MENU ================= */}
        {activeSection === 'menu' && (
          <div className="space-y-4">
            <div className="px-1">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight">
                Settings
              </h2>
              <p className="text-xs text-[var(--slate-soft)] mt-0.5">
                Manage reading display, daily notifications, privacy, and app information.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Option 1: Display Settings */}
              <button
                onClick={() => setActiveSection('display')}
                className="w-full p-4 bg-[var(--paper)] hover:bg-[#C9A227]/5 border border-[var(--line)] rounded-2xl shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#1B3A6B]/10 dark:bg-white/10 text-[#1B3A6B] dark:text-[#E4C765] flex items-center justify-center shrink-0 group-hover:bg-[#C9A227]/20 transition-colors">
                    <Palette className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--ink)]">
                      Display Settings
                    </h3>
                    <p className="text-xs text-[var(--slate-soft)] mt-0.5">
                      Visual theme, font style, and text sizing
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#C9A227]/10 text-[#C9A227] hidden sm:inline-block">
                    {getThemeLabel()} • {getFontSizeLabel()}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--slate-soft)] group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Option 2: Notification Settings */}
              <button
                onClick={() => setActiveSection('notifications')}
                className="w-full p-4 bg-[var(--paper)] hover:bg-[#C9A227]/5 border border-[var(--line)] rounded-2xl shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#C9A227]/15 text-[#C9A227] flex items-center justify-center shrink-0 group-hover:bg-[#C9A227]/25 transition-colors">
                    <BellRing className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--ink)]">
                      Notification Settings
                    </h3>
                    <p className="text-xs text-[var(--slate-soft)] mt-0.5">
                      Daily scripture notifications &amp; scheduled time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    preferences.dailyVerseNotification
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                  }`}>
                    {preferences.dailyVerseNotification
                      ? (preferences.notificationTime || '07:00')
                      : 'Off'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--slate-soft)] group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Option 3: Privacy & Policy */}
              <button
                onClick={() => setActiveSection('privacy')}
                className="w-full p-4 bg-[var(--paper)] hover:bg-[#C9A227]/5 border border-[var(--line)] rounded-2xl shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--ink)]">
                      Privacy &amp; Policy
                    </h3>
                    <p className="text-xs text-[var(--slate-soft)] mt-0.5">
                      100% on-device storage &amp; zero tracking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hidden sm:inline-block">
                    Private
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--slate-soft)] group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>

              {/* Option 4: About COG Bible */}
              <button
                onClick={() => setActiveSection('about')}
                className="w-full p-4 bg-[var(--paper)] hover:bg-[#C9A227]/5 border border-[var(--line)] rounded-2xl shadow-xs flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#142748] p-1 flex items-center justify-center shrink-0 border border-[#C9A227]/40">
                    <img
                      src={EMBEDDED_LOGO_DATA_URI || './logo.png'}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[var(--ink)]">
                      About COG Bible
                    </h3>
                    <p className="text-xs text-[var(--slate-soft)] mt-0.5">
                      The Church of God (Truth, Justice, and Righteousness)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1B3A6B]/10 dark:bg-white/10 text-[var(--slate-soft)]">
                    v1.2
                  </span>
                  <ChevronRight className="w-4 h-4 text-[var(--slate-soft)] group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. DISPLAY SETTINGS ================= */}
        {activeSection === 'display' && (
          <div className="space-y-5">
            {/* Visual Theme Card */}
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-[var(--ink)]">
                <Sun className="w-4 h-4 text-[#C9A227]" />
                Visual Theme
              </h3>
              <p className="text-xs text-[var(--slate-soft)]">
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
                          : 'border-[var(--line)] text-[var(--slate)] hover:border-[#C9A227] bg-transparent'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scripture Font Style */}
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-[var(--ink)]">
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
                        ? 'border-[#C9A227] bg-[#C9A227]/15 text-[var(--ink)] font-bold shadow-xs ring-1 ring-[#C9A227]'
                        : 'border-[var(--line)] text-[var(--slate)] hover:border-[#C9A227] bg-transparent'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Size */}
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
              <div>
                <h3 className="font-serif font-bold text-base flex items-center gap-2 text-[var(--ink)]">
                  <TextQuote className="w-4 h-4 text-[#C9A227]" />
                  Text Size
                </h3>
                <p className="text-xs text-[var(--slate-soft)] mt-0.5">
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
                          ? 'border-[#C9A227] bg-[#C9A227]/15 text-[var(--ink)] font-bold shadow-xs ring-1 ring-[#C9A227]'
                          : 'border-[var(--line)] text-[var(--slate)] hover:border-[#C9A227]/60 bg-transparent'
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
          </div>
        )}

        {/* ================= 3. NOTIFICATION SETTINGS ================= */}
        {activeSection === 'notifications' && (
          <div className="space-y-4">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#C9A227]/15 text-[#C9A227] shrink-0 mt-0.5">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                      Daily Scripture Notifications
                    </h3>
                    <p className="text-xs text-[var(--slate-soft)] mt-0.5 leading-relaxed">
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
                <div className="pt-3 border-t border-[var(--line)] space-y-3.5">
                  {/* Scheduled Time Row */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--ivory)] border border-[var(--line)]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#C9A227]" />
                      <span className="text-xs font-semibold text-[var(--slate)]">
                        Scheduled Daily Time
                      </span>
                    </div>
                    <input
                      type="time"
                      value={preferences.notificationTime || '07:00'}
                      onChange={(e) => {
                        const newTime = e.target.value;
                        onUpdatePreferences({ notificationTime: newTime });
                        if (preferences.dailyVerseNotification) {
                          scheduleNativeDailyRecurringNotification(newTime);
                        }
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] font-mono focus:outline-none focus:ring-1 focus:ring-[#C9A227] cursor-pointer"
                    />
                  </div>

                  {/* Permission Status */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--ivory)] border border-[var(--line)]">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#C9A227] shrink-0" />
                      <span className="text-xs text-[var(--slate-soft)] font-medium">
                        Device Permission:
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      permStatus === 'granted'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800'
                    }`}>
                      {permStatus === 'granted' ? 'Active & Ready' : 'Permission Required'}
                    </span>
                  </div>

                  {/* Small Centered Test Notification Button */}
                  <div className="flex justify-center pt-1 pb-0.5">
                    <button
                      onClick={handleTestNotification}
                      disabled={isTestingNotification}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#C9A227] hover:bg-[#D4AF37] text-[#0E1B33] active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isTestingNotification ? 'Sending...' : 'Test Notification'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 4. PRIVACY & POLICY ================= */}
        {activeSection === 'privacy' && (
          <div className="space-y-4">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[var(--line)]">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                    Privacy &amp; Policy
                  </h3>
                  <p className="text-[11px] text-[var(--slate-soft)]">
                    Your personal data and spiritual study remain completely private.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-[var(--slate)] leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-[var(--ink)]">Zero Data Collection:</strong> This application does not collect, record, track, or monitor any personal user information or usage statistics.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-[var(--ink)]">No Third-Party Sharing:</strong> We do not distribute, sell, or share any user details, preferences, or reading activity to any third parties, advertisers, or analytics services.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-[var(--ink)]">100% Local On-Device Storage:</strong> All your personal bookmarks, verse highlights, study notes, quiz scores, and app preferences remain stored exclusively on your device's local storage.
                  </p>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <p>
                    <strong className="text-[var(--ink)]">Offline Protection:</strong> The entire Bible, search engine, and quiz operate offline without requiring an account, sign-in, or external internet connection.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. ABOUT COG BIBLE ================= */}
        {activeSection === 'about' && (
          <div className="space-y-4">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-[var(--line)]">
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
                  <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                    The Church of God
                  </h3>
                  <p className="text-xs text-[#C9A227] font-semibold">
                    (Truth, Justice, and Righteousness)
                  </p>
                  <p className="text-[10px] text-[var(--slate-soft)]">
                    Jerusalem, Israel • Anno Domini
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--slate-soft)]">Application:</span>
                  <span className="font-semibold text-[var(--ink)]">COG (T.J.R) Bible</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--slate-soft)]">Version:</span>
                  <span className="font-semibold text-[var(--ink)]">1.2 (Build 3)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[var(--line)]">
                  <span className="text-[var(--slate-soft)]">Bible Versions:</span>
                  <span className="font-semibold text-[var(--ink)] text-right">
                    Cebuano (Bugna) &amp; English (KJV)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--slate-soft)]">Operation:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    100% Offline Capable
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
