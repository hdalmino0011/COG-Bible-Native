import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  Search,
  BookOpen,
  Calendar,
  X,
  Lock,
  User,
  LogIn,
  LogOut,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

interface LessonRecord {
  id: string;
  title: string;
  description: string;
  minister_name: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size_bytes?: number;
  category?: string;
  created_at: string;
}

const DEFAULT_CLOUD_URL = 'https://dzxddspgajznsxnekhrn.supabase.co';
const DEFAULT_CLOUD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGRkc3BnYWp6bnN4bmVraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODc1OTgsImV4cCI6MjEwODI2MzU5OH0.Bu8R46ByeJMaNFbx2hsIu6secaoobkjj5SlYarwVu8o';

export default function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('cog_portal_authenticated') === 'true';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Supabase Client
  const [client, setClient] = useState<SupabaseClient | null>(null);

  // Navigation: 'upload' or 'manage'
  const [activeTab, setActiveTab] = useState<'upload' | 'manage'>('upload');

  // Form Fields
  const [title, setTitle] = useState('');
  const [ministerName, setMinisterName] = useState(
    localStorage.getItem('cog_minister_name') || ''
  );
  const [category, setCategory] = useState('Sabbath Study');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // States
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lessonsList, setLessonsList] = useState<LessonRecord[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // iOS-style Confirmation Dialog States
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<LessonRecord | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize Client
  useEffect(() => {
    try {
      const c = createClient(DEFAULT_CLOUD_URL, DEFAULT_CLOUD_KEY, {
        auth: {
          persistSession: false
        }
      });
      setClient(c);
    } catch (err) {
      console.error('Failed to initialize client:', err);
    }
  }, []);

  // Load Lessons when Authenticated
  useEffect(() => {
    if (client && isAuthenticated) {
      fetchLessons();
    }
  }, [client, isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    // Exact credentials verification
    const trimmedUser = loginUsername.trim();
    const trimmedPass = loginPassword.trim();

    if (trimmedUser === 'COGtjr2026' && trimmedPass === 'COGtjr101!') {
      localStorage.setItem('cog_portal_authenticated', 'true');
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid username or password. Please verify your credentials and try again.');
    }
    setIsLoggingIn(false);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('cog_portal_authenticated');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
    setShowSignOutConfirm(false);
  };

  const fetchLessons = async () => {
    setLoadingLessons(true);
    try {
      // 1. Primary: Use the Supabase client SDK if ready
      if (client) {
        const { data, error } = await client
          .from('lessons')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          setLessonsList(data);
          return;
        }
        if (error) {
          console.warn('Supabase client fetch warning:', error.message);
        }
      }

      // 2. Direct clean REST query fallback
      const res = await fetch(
        `${DEFAULT_CLOUD_URL}/rest/v1/lessons?select=*&order=created_at.desc`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            apikey: DEFAULT_CLOUD_KEY,
            Authorization: `Bearer ${DEFAULT_CLOUD_KEY}`,
            Accept: 'application/json'
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        setLessonsList(Array.isArray(data) ? data : []);
      } else {
        const errText = await res.text().catch(() => '');
        console.warn('Fetch error:', res.status, errText);
        setStatusMessage(`Could not retrieve lessons list (${res.status}).`);
      }
    } catch (err: any) {
      console.warn('Network error in fetchLessons:', err);
      setStatusMessage(`Network error: ${err.message}`);
    } finally {
      setLoadingLessons(false);
    }
  };

  const detectType = (name: string, mime?: string): 'pdf' | 'image' | 'doc' | 'other' => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf' || mime?.includes('pdf')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) || mime?.startsWith('image/')) return 'image';
    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(ext)) return 'doc';
    return 'other';
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) {
      setStatusMessage('Cloud database connection not ready. Please try again.');
      return;
    }
    if (!selectedFile) {
      setStatusMessage('Please select a lesson file to upload.');
      return;
    }
    if (!title.trim() || !ministerName.trim()) {
      setStatusMessage('Please enter both Lesson Title and Minister Name.');
      return;
    }

    setUploading(true);
    setStatusMessage('Uploading lesson file to secure cloud...');

    try {
      // 1. Sanitize file name
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${Date.now()}_${sanitizedName}`;

      // 2. Upload to Storage bucket 'lessons'
      const { error: storageError } = await client.storage
        .from('lessons')
        .upload(filePath, selectedFile, {
          cacheControl: '0',
          upsert: true
        });

      if (storageError) {
        throw new Error(`Storage upload failed: ${storageError.message}`);
      }

      // 3. Get Public URL
      const { data: urlData } = client.storage
        .from('lessons')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // 4. Save record into 'lessons' table
      const fileType = detectType(selectedFile.name, selectedFile.type);
      const { error: dbError } = await client.from('lessons').insert([
        {
          title: title.trim(),
          description: description.trim(),
          minister_name: ministerName.trim(),
          category,
          file_url: publicUrl,
          file_name: selectedFile.name,
          file_type: fileType,
          file_size_bytes: selectedFile.size
        }
      ]);

      if (dbError) {
        throw new Error(`Database save failed: ${dbError.message}`);
      }

      // Save Minister Name for next time
      localStorage.setItem('cog_minister_name', ministerName.trim());

      setStatusMessage('Lesson successfully uploaded and published to COG Bible App!');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      await fetchLessons();
      setTimeout(() => setStatusMessage(null), 6000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleExecuteDelete = async () => {
    if (!client || !lessonToDelete) return;
    setIsDeleting(true);

    try {
      // Remove DB record from database
      const { error: dbError } = await client
        .from('lessons')
        .delete()
        .eq('id', lessonToDelete.id);

      if (dbError) throw dbError;

      // Clean up storage file
      try {
        const parts = lessonToDelete.file_url.split('/lessons/');
        if (parts.length > 1) {
          await client.storage.from('lessons').remove([parts[1]]);
        }
      } catch {}

      await fetchLessons();
      setStatusMessage(`Deleted "${lessonToDelete.title}" successfully.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      setStatusMessage(`Delete failed: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setLessonToDelete(null);
    }
  };

  const filteredLessons = lessonsList.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.minister_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategoryFilter === 'All' || l.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    'Sabbath Study',
    'Church Doctrine',
    'Bible Study',
    'Youth Fellowship',
    'Pastoral Letter',
    'Song & Hymn Sheet',
    'General Lesson'
  ];

  return (
    <div className="h-screen h-[100dvh] bg-[#081226] text-white flex flex-col relative overflow-hidden">
      {/* Background Ambient iOS Light Spheres */}
      <div className="ambient-glow-navy -top-24 -left-20" />
      <div className="ambient-glow-gold top-1/4 -right-24" />
      <div className="ambient-glow-navy bottom-20 -left-16" />

      {/* ========================================================= */}
      {/* 1. SIGN OUT CONFIRMATION MODAL (iOS Alert Style) */}
      {/* ========================================================= */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 text-center border border-white/20 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Top gold bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A227] via-[#F3D77B] to-[#C9A227]" />

            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
              <LogOut className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Sign Out?
            </h3>
            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              Are you sure you want to sign out from the COG Minister Portal? You will need your minister credentials to log in again.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="w-full py-3 px-4 rounded-xl glass-panel-subtle hover:bg-white/10 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                No, Stay Signed In
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-red-900/40 border border-white/20 transition cursor-pointer"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. DELETE LESSON CONFIRMATION MODAL (iOS Alert Style) */}
      {/* ========================================================= */}
      {lessonToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md transition-opacity">
          <div className="w-full max-w-sm glass-panel rounded-3xl p-6 text-center border border-white/20 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-extrabold text-white tracking-tight">
              Delete Lesson?
            </h3>
            <p className="text-xs text-slate-300 mt-2 mb-6 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">"{lessonToDelete.title}"</strong>? This will permanently remove the file from cloud storage and the Bible app.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setLessonToDelete(null)}
                className="w-full py-3 px-4 rounded-xl glass-panel-subtle hover:bg-white/10 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                No, Keep File
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs shadow-lg shadow-red-900/40 border border-white/20 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. LOGIN SCREEN (If not authenticated) */}
      {/* ========================================================= */}
      {!isAuthenticated ? (
        <div
          className="flex-1 overflow-y-auto overscroll-y-contain flex flex-col justify-center items-center px-4 py-8 relative z-10"
          style={{
            paddingTop: 'calc(max(var(--sat), 36px) + 1rem)',
            paddingBottom: 'calc(max(var(--sab), 24px) + 1rem)'
          }}
        >
          <div
            className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Top Glowing Gold Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9A227] via-[#F3D77B] to-[#C9A227]" />

            {/* Emblem & Title */}
            <div className="text-center mb-7 pt-2">
              <div className="w-16 h-16 rounded-2xl glass-button-gold flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#C9A227]/30">
                <BookOpen className="w-8 h-8 text-white drop-shadow-sm" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                COG Minister Portal
              </h1>
              <p className="text-[11px] text-[#C9A227] font-bold tracking-wider uppercase mt-1">
                Truth • Justice • Righteousness
              </p>
              <p className="text-xs text-slate-300/80 mt-1.5">
                Authorized Minister & Pastor Login
              </p>
            </div>

            {/* Error Message Toast */}
            {loginError && (
              <div className="mb-5 p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-medium leading-relaxed">{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide">
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    autoFocus
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={loginUsername}
                    onChange={(e) => {
                      setLoginUsername(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-3 glass-input rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-11 py-3 glass-input rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-4 rounded-2xl glass-button-gold text-white font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* 4. MAIN PORTAL (AUTHENTICATED) */
        /* ========================================================= */
        <div className="flex-1 flex flex-col min-h-0 relative z-10 overflow-hidden">
          {/* Top Fixed Header with status bar protection */}
          <header
            className="shrink-0 z-30 bg-[#081226]/95 backdrop-blur-2xl border-b border-white/10 px-4 shadow-lg select-none"
            style={{
              paddingTop: 'calc(max(var(--sat), 36px) + 0.5rem)',
              paddingBottom: '0.75rem'
            }}
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
              {/* Left Brand info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl glass-button-gold flex items-center justify-center shrink-0 shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate">
                    COG Minister Portal
                  </h1>
                  <p className="text-[11px] font-medium text-[#C9A227] truncate">
                    Truth • Justice • Righteousness
                  </p>
                </div>
              </div>

              {/* Right: Status Pill & Sign Out Button with Confirmation */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloud Active</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(true)}
                  className="px-3 py-1.5 rounded-xl glass-panel-subtle hover:bg-red-500/20 hover:border-red-500/30 text-slate-200 hover:text-red-200 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                  title="Sign Out of Minister Portal"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* iOS Segmented Navigation Pill Bar */}
            <div className="max-w-4xl mx-auto mt-3">
              <div className="p-1 rounded-2xl glass-panel-subtle flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'upload'
                      ? 'ios-segment-active text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 text-[#C9A227]" />
                  <span>Upload Lesson</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('manage');
                    fetchLessons();
                  }}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'manage'
                      ? 'ios-segment-active text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#C9A227]" />
                  <span>Manage Uploads ({lessonsList.length})</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Workspace Body */}
          <main
            className="flex-1 overflow-y-auto overscroll-y-contain max-w-4xl w-full mx-auto p-4 space-y-4"
            style={{
              paddingBottom: 'calc(max(var(--sab), 24px) + 2rem)'
            }}
          >
            {/* Status Toast Alert */}
            {statusMessage && (
              <div className="p-3.5 rounded-2xl glass-panel border border-[#C9A227]/40 text-white text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#C9A227] shrink-0" />
                  <span className="font-semibold">{statusMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusMessage(null)}
                  className="text-slate-400 hover:text-white cursor-pointer ml-2 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Minister Profile Card (Inspired by iOS Account Cards in screenshot) */}
            <div className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1B3A6B] to-[#0E2240] border border-white/15 flex items-center justify-center text-[#C9A227] shadow-inner">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Logged in as
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {ministerName || 'Church Minister'}
                  </div>
                  <div className="text-xs text-blue-300/80">
                    Sermon & Curriculum Publisher
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex-1 sm:flex-initial glass-panel-subtle rounded-2xl px-3.5 py-2 text-center">
                  <div className="text-base font-extrabold text-[#C9A227]">{lessonsList.length}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Published</div>
                </div>
                <div className="flex-1 sm:flex-initial glass-panel-subtle rounded-2xl px-3.5 py-2 text-center">
                  <div className="text-base font-extrabold text-emerald-400">Live</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Sync Status</div>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* TAB 1: UPLOAD LESSON */}
            {/* ========================================================= */}
            {activeTab === 'upload' && (
              <div className="glass-panel rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[#C9A227]" />
                    Upload Church Lesson or Sermon File
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Uploaded study materials and sermons will instantly sync to the congregation's COG Bible App under the Lessons tab.
                  </p>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5 tracking-wide">
                        Lesson / Sermon Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Walking in Truth & Righteousness"
                        className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5 tracking-wide">
                        Minister / Pastor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={ministerName}
                        onChange={(e) => setMinisterName(e.target.value)}
                        placeholder="e.g. Pastor John Doe"
                        className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5 tracking-wide">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs sm:text-sm text-white bg-[#081226] focus:outline-hidden cursor-pointer"
                      >
                        {categoryOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#081226] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5 tracking-wide">
                        Select File (PDF, PNG, JPG, DOCX, TXT) *
                      </label>
                      <input
                        type="file"
                        required
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#C9A227] file:text-white hover:file:bg-[#b5901f] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Selected File Details Glass Card */}
                  {selectedFile && (
                    <div className="p-3.5 glass-panel-subtle rounded-2xl text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-5 h-5 text-[#C9A227] shrink-0" />
                        <span className="font-bold text-white truncate">{selectedFile.name}</span>
                        <span className="text-slate-400 shrink-0 font-medium">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] uppercase font-bold shrink-0 ml-2">
                        {detectType(selectedFile.name, selectedFile.type)}
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5 tracking-wide">
                      Description / Scriptural References (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Summary of this lesson, core Bible passages, and study notes..."
                      className="w-full px-3.5 py-2.5 glass-input rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full sm:w-auto px-7 py-3 rounded-2xl glass-button-gold text-white font-extrabold text-sm tracking-wide shadow-xl flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Uploading File to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" />
                          <span>Publish Lesson to COG Bible App</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ========================================================= */}
            {/* TAB 2: MANAGE LESSONS */}
            {/* ========================================================= */}
            {activeTab === 'manage' && (
              <div className="space-y-4">
                {/* Search & Refresh Bar */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter uploaded lessons by title or minister..."
                      className="w-full pl-10 pr-4 py-2.5 glass-panel rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={fetchLessons}
                    disabled={loadingLessons}
                    className="p-2.5 rounded-2xl glass-panel hover:bg-white/10 text-slate-200 hover:text-white cursor-pointer transition shrink-0"
                    title="Refresh lessons list"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingLessons ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Filter Category Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {['All', ...categoryOptions].map((cat) => {
                    const isSelected = selectedCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#C9A227] text-white shadow-md'
                            : 'glass-panel-subtle text-slate-300 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Lessons Content List */}
                {loadingLessons ? (
                  <div className="py-16 text-center text-xs text-slate-300 glass-panel rounded-3xl">
                    <RefreshCw className="w-7 h-7 animate-spin text-[#C9A227] mx-auto mb-3" />
                    <span className="font-semibold">Loading published lessons...</span>
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="p-10 text-center glass-panel rounded-3xl text-xs text-slate-300">
                    <FolderOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                    <p className="font-bold text-sm text-white">No lessons found</p>
                    <p className="mt-1 text-slate-400">
                      {searchQuery
                        ? 'Try adjusting your search query or category filter.'
                        : 'Upload your first lesson in the Upload tab to make it available to the church.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-4 sm:p-5 glass-panel rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md transition-all hover:border-white/25"
                      >
                        <div className="min-w-0 flex-1">
                          {/* Tags & Metadata */}
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30 text-[#E4C765]">
                              {lesson.file_type || 'file'}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {new Date(lesson.created_at).toLocaleDateString()}
                            </span>
                            {lesson.category && (
                              <span className="text-[11px] text-blue-300 font-medium">
                                • {lesson.category}
                              </span>
                            )}
                          </div>

                          {/* Lesson Title */}
                          <h3 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                            {lesson.title}
                          </h3>

                          {/* Minister */}
                          <p className="text-xs font-semibold text-[#C9A227] mt-1">
                            By {lesson.minister_name}
                          </p>

                          {/* Description */}
                          {lesson.description && (
                            <p className="text-xs text-slate-300/90 mt-1.5 line-clamp-2 leading-relaxed">
                              {lesson.description}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <a
                            href={lesson.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3.5 py-2 rounded-xl glass-panel-subtle hover:bg-blue-600/30 border border-blue-400/30 text-blue-200 text-xs font-bold flex items-center gap-1.5 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setLessonToDelete(lesson)}
                            className="px-3.5 py-2 rounded-xl glass-panel-subtle hover:bg-red-600/30 border border-red-400/30 text-red-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
