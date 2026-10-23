export interface LessonItem {
  id: string;
  title: string;
  description: string;
  minister_name: string;
  file_url: string;
  file_name: string;
  file_type: 'pdf' | 'image' | 'doc' | 'other';
  file_size_bytes?: number;
  category?: string;
  created_at: string;
}

const STORAGE_KEY_URL = 'cog_cloud_url';
const STORAGE_KEY_KEY = 'cog_cloud_key';
const STORAGE_KEY_CACHED_LESSONS = 'cog_cached_lessons_data';

export const DEFAULT_CLOUD_URL = 'https://dzxddspgajznsxnekhrn.supabase.co';
export const DEFAULT_CLOUD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGRkc3BnYWp6bnN4bmVraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODc1OTgsImV4cCI6MjEwODI2MzU5OH0.Bu8R46ByeJMaNFbx2hsIu6secaoobkjj5SlYarwVu8o';

export function getCloudCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  let storedUrl = '';
  let storedKey = '';

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      storedUrl = (localStorage.getItem(STORAGE_KEY_URL) || '').trim();
      storedKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();
    } catch {}
  }

  return {
    url: envUrl || storedUrl || DEFAULT_CLOUD_URL,
    anonKey: envKey || storedKey || DEFAULT_CLOUD_KEY
  };
}

export function getCachedLessons(): LessonItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHED_LESSONS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export function setCachedLessons(lessons: LessonItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CACHED_LESSONS, JSON.stringify(lessons));
  } catch {}
}

// Actively clean any cached responses from legacy service worker caches
export async function cleanLegacySupabaseCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  try {
    const keys = await caches.keys();
    for (const key of keys) {
      const cache = await caches.open(key);
      const requests = await cache.keys();
      for (const req of requests) {
        if (req.url.includes('supabase.co') || req.url.includes('/rest/v1/') || req.url.includes('/storage/v1/')) {
          await cache.delete(req);
        }
      }
    }
  } catch (err) {
    console.debug('Cache cleanup error:', err);
  }
}

export async function fetchLessonsFromSupabase(): Promise<{
  data: LessonItem[];
  error?: string;
  isOffline?: boolean;
}> {
  // Clear any accidental stale keys in localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_KEY);
      if (stored && stored !== DEFAULT_CLOUD_KEY) {
        localStorage.removeItem(STORAGE_KEY_KEY);
      }
    } catch {}
  }

  // Purge legacy SW cache entry
  cleanLegacySupabaseCaches().catch(() => {});

  const creds = getCloudCredentials();
  const endpoint = `${creds.url.replace(/\/$/, '')}/rest/v1/lessons?select=*&order=created_at.desc`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(endpoint, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        apikey: creds.anonKey,
        Authorization: `Bearer ${creds.anonKey}`,
        Accept: 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn('Lessons fetch response not OK:', res.status, errText);
      return {
        data: getCachedLessons(),
        error: `Could not retrieve lessons (${res.status})`
      };
    }

    const json = await res.json();
    if (Array.isArray(json)) {
      setCachedLessons(json);
      return { data: json };
    }

    return { data: getCachedLessons() };
  } catch (err: any) {
    console.warn('Network error fetching church lessons, falling back to cache:', err);
    const cached = getCachedLessons();
    return {
      data: cached,
      isOffline: true,
      error: 'Unable to connect to the church server. Showing saved lessons.'
    };
  }
}

export function detectFileType(fileName: string, mimeType?: string): 'pdf' | 'image' | 'doc' | 'other' {
  const ext = fileName?.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf' || mimeType?.includes('pdf')) return 'pdf';
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext) || mimeType?.startsWith('image/')) {
    return 'image';
  }
  if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'rtf'].includes(ext)) {
    return 'doc';
  }
  return 'other';
}

export function formatFileSize(bytes?: number): string {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
