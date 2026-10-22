import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

const STORAGE_KEY_URL = 'cog_supabase_url';
const STORAGE_KEY_KEY = 'cog_supabase_anon_key';
const STORAGE_KEY_CACHED_LESSONS = 'cog_cached_lessons_data';

const DEFAULT_SUPABASE_URL = 'https://dzxddspgajznsxnekhrn.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGRkc3BnYWp6bnN4bmVraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODc1OTgsImV4cCI6MjEwODI2MzU5OH0.Bu8R46ByeJMaNFbx2hsIu6secaoobkjj5SlYarwVu8o';

let cachedClient: SupabaseClient | null = null;
let currentClientKey = '';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
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
    url: envUrl || storedUrl || DEFAULT_SUPABASE_URL,
    anonKey: envKey || storedKey || DEFAULT_SUPABASE_ANON_KEY
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(STORAGE_KEY_URL, url.trim());
      localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
    } catch {}
  }
  cachedClient = null;
  currentClientKey = '';
}

export function isSupabaseConfigured(): boolean {
  const creds = getSupabaseCredentials();
  return Boolean(creds.url && creds.anonKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  const creds = getSupabaseCredentials();
  if (!creds.url || !creds.anonKey) {
    return null;
  }

  const keyComb = `${creds.url}_${creds.anonKey}`;
  if (cachedClient && currentClientKey === keyComb) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    currentClientKey = keyComb;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
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
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      data: getCachedLessons(),
      isOffline: true,
      error: 'No internet connection detected.'
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      data: getCachedLessons(),
      error: 'Supabase credentials not configured. Please provide Supabase URL & Anon Key.'
    };
  }

  try {
    const { data, error } = await client
      .from('lessons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch lessons error:', error);
      return {
        data: getCachedLessons(),
        error: error.message
      };
    }

    const lessons = (data || []) as LessonItem[];
    setCachedLessons(lessons);
    return { data: lessons };
  } catch (err: any) {
    console.error('Network error fetching lessons:', err);
    return {
      data: getCachedLessons(),
      isOffline: true,
      error: err?.message || 'Failed to fetch lessons. Check your connection.'
    };
  }
}

export function detectFileType(fileName: string, mimeType?: string): 'pdf' | 'image' | 'doc' | 'other' {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
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
