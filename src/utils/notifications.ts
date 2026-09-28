import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { DailyVerse, getTodayVerse } from '../data/dailyVerses';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

const PROMPT_DECISION_KEY = 'cog_notifications_prompt_decision';

export function isNotificationSupported(): boolean {
  if (Capacitor.isNativePlatform()) return true;
  return typeof window !== 'undefined' && ('Notification' in window || ('serviceWorker' in navigator && 'PushManager' in window));
}

export async function checkHasNotificationPermission(): Promise<boolean> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      return perm.display === 'granted';
    } catch {
      return false;
    }
  }

  if (typeof window !== 'undefined' && 'Notification' in window) {
    return Notification.permission === 'granted';
  }
  return false;
}

export function getNotificationPermissionStatus(): NotificationPermissionState {
  if (Capacitor.isNativePlatform()) {
    // Synchronous probe; on native we assume default if not checked or granted
    try {
      const decision = localStorage.getItem(PROMPT_DECISION_KEY);
      if (decision === 'granted') return 'granted';
      if (decision === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'default';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export async function getAsyncNotificationPermissionStatus(): Promise<NotificationPermissionState> {
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display === 'granted') return 'granted';
      if (perm.display === 'denied') return 'denied';
      return 'default';
    } catch {
      return 'default';
    }
  }
  return getNotificationPermissionStatus();
}

export function shouldPromptForNotifications(): boolean {
  if (!isNotificationSupported()) return false;
  try {
    const decision = localStorage.getItem(PROMPT_DECISION_KEY);
    if (decision !== null) return false;
  } catch {}

  const current = getNotificationPermissionStatus();
  return current === 'default';
}

export function recordNotificationDecision(decision: 'granted' | 'denied' | 'later'): void {
  try {
    localStorage.setItem(PROMPT_DECISION_KEY, decision);
  } catch {}
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await LocalNotifications.requestPermissions();
      const state: NotificationPermissionState = res.display === 'granted' ? 'granted' : 'denied';
      recordNotificationDecision(state);
      return state;
    } catch (e) {
      console.error('Error requesting native local notification permission:', e);
      return 'denied';
    }
  }

  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  try {
    let result: string;
    const requestResult = Notification.requestPermission();
    if (requestResult && typeof (requestResult as any).then === 'function') {
      result = await requestResult;
    } else {
      result = await new Promise<string>((resolve) => {
        (Notification as any).requestPermission((perm: string) => resolve(perm));
      });
    }
    const state = (result || 'denied') as NotificationPermissionState;
    if (state === 'granted') {
      recordNotificationDecision('granted');
    } else if (state === 'denied') {
      recordNotificationDecision('denied');
    }
    return state;
  } catch (e) {
    console.error('Error requesting web notification permission:', e);
    return 'denied';
  }
}

export async function sendDailyVerseNotification(
  verse?: DailyVerse,
  customTitle?: string
): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  const v = verse || getTodayVerse();
  const title = customTitle || `📖 ${v.book} ${v.chapter}:${v.verse}`;

  // Format scripture text clearly from the app's Cebuano (Bugna) & KJV (English) translations
  let bodyText = '';
  if (v.ceb && v.en && v.ceb !== v.en) {
    bodyText = `[Cebuano Bugna]\n${v.ceb}\n\n[KJV]\n${v.en}`;
  } else {
    bodyText = v.ceb || v.en || '';
  }

  const hashTarget = `bible?book=${encodeURIComponent(v.book)}&chapter=${v.chapter}&verse=${v.verse}`;

  // 1. Native Mobile (Capacitor Android / iOS)
  if (Capacitor.isNativePlatform()) {
    try {
      const perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') {
        const req = await LocalNotifications.requestPermissions();
        if (req.display !== 'granted') return false;
      }

      const notifId = Math.floor(Date.now() % 100000) + 1;
      await LocalNotifications.schedule({
        notifications: [
          {
            id: notifId,
            title: title,
            body: bodyText,
            largeBody: bodyText,
            summaryText: `${v.book} ${v.chapter}:${v.verse}`,
            smallIcon: 'ic_launcher',
            iconColor: '#C9A227',
            extra: {
              book: v.book,
              chapter: v.chapter,
              verse: v.verse,
              url: `./#${hashTarget}`
            }
          }
        ]
      });
      return true;
    } catch (err) {
      console.error('Failed to schedule native local notification:', err);
    }
  }

  // 2. Web / PWA / ServiceWorker fallback
  if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') return false;
  }

  let iconUrl = './logo.png';
  let badgeUrl = './app-icon-192.png';
  if (typeof window !== 'undefined') {
    try {
      iconUrl = new URL('logo.png', window.location.href).href;
      badgeUrl = new URL('app-icon-192.png', window.location.href).href;
    } catch {}
  }

  const options: Record<string, unknown> = {
    body: bodyText,
    icon: iconUrl,
    badge: badgeUrl,
    tag: `cog-daily-verse-${Date.now()}`,
    renotify: true,
    data: {
      url: `./#${hashTarget}`,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse
    },
    vibrate: [200, 100, 200]
  };

  // Try via active service worker registration first
  if ('serviceWorker' in navigator) {
    try {
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg && navigator.serviceWorker.ready) {
        reg = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<undefined>((res) => setTimeout(() => res(undefined), 1000))
        ]);
      }
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options as NotificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('SW notification fallback to window.Notification', e);
    }
  }

  // Fallback to standard window Notification constructor if supported
  if (typeof Notification !== 'undefined') {
    try {
      const n = new Notification(title, options as NotificationOptions);
      n.onclick = () => {
        window.focus();
        n.close();
        if (typeof window !== 'undefined') {
          window.location.hash = `bible?book=${encodeURIComponent(v.book)}&chapter=${v.chapter}&verse=${v.verse}`;
          window.dispatchEvent(
            new CustomEvent('cog-navigate-verse', {
              detail: { book: v.book, chapter: v.chapter, verse: v.verse }
            })
          );
        }
      };
      return true;
    } catch (e) {
      console.error('Error creating Notification instance:', e);
      return false;
    }
  }

  return false;
}
