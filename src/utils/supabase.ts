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
export const DEFAULT_CLOUD_KEY = typeof atob !== 'undefined'
  ? atob('ZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW1SNmVHUmtjM0JuWVdwNmJuTjRibVZyYUhKdUlpd2ljbTlzWlNJNkltRnViMjRpTENKcFlYUWlPakUzT1RJMk9EYzFPVGdzSW1WNGNDSTZNakV3T0RJMk16VTVPSDAuQnU4UjQ2QnllSk1hTkZieDJoc0l1NnNlY2Fvb2Jramo1U2xZYXJ3VnU4bw==')
  : '';

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

export async function fetchLessonsFromSupabase(): Promise<{
  data: LessonItem[];
  error?: string;
  isOffline?: boolean;
}> {
  const creds = getCloudCredentials();
  const endpoint = `${creds.url.replace(/\/$/, '')}/rest/v1/lessons?select=*&order=created_at.desc`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(endpoint, {
      method: 'GET',
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
