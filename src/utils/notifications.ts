import { DailyVerse, getTodayVerse } from '../data/dailyVerses';

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

const PROMPT_DECISION_KEY = 'cog_notifications_prompt_decision';

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && ('Notification' in window || ('serviceWorker' in navigator && 'PushManager' in window));
}

export function getNotificationPermissionStatus(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  return Notification.permission as NotificationPermissionState;
}

export function shouldPromptForNotifications(): boolean {
  if (!isNotificationSupported()) return false;
  const current = getNotificationPermissionStatus();
  if (current !== 'default') return false;
  try {
    const decision = localStorage.getItem(PROMPT_DECISION_KEY);
    return decision === null;
  } catch {
    return false;
  }
}

export function recordNotificationDecision(decision: 'granted' | 'denied' | 'later'): void {
  try {
    localStorage.setItem(PROMPT_DECISION_KEY, decision);
  } catch {}
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
  try {
    let result: string;
    // Handle both Promise-based and legacy callback-based implementations across Safari iOS / Android WebView
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
    console.error('Error requesting notification permission:', e);
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

  if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') return false;
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

  // Use absolute URLs for notification icons so device notification drawers render them cleanly
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

  // 1. Try via active service worker registration first for mobile OS lockscreen / background compatibility
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options as NotificationOptions);
        return true;
      }
    } catch (e) {
      console.warn('SW notification fallback to window.Notification', e);
    }
  }

  // 2. Fallback to standard window Notification constructor
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
