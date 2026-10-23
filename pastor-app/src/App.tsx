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
  ShieldCheck
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

  // Navigation
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

  const handleLogout = () => {
    localStorage.removeItem('cog_portal_authenticated');
    setIsAuthenticated(false);
    setLoginUsername('');
    setLoginPassword('');
    setLoginError(null);
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

      // 2. Direct clean REST query without custom query parameters that break PostgREST parsing
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
      alert('Cloud database connection not ready. Please try again.');
      return;
    }
    if (!selectedFile) {
      alert('Please select a lesson file to upload.');
      return;
    }
    if (!title.trim() || !ministerName.trim()) {
      alert('Please enter both Lesson Title and Minister Name.');
      return;
    }

    setUploading(true);
    setStatusMessage('Uploading lesson file to cloud...');

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

      setStatusMessage('Lesson uploaded successfully! It is now live in the COG Bible app.');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      await fetchLessons();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (lesson: LessonRecord) => {
    if (!client) return;
    const confirmDel = window.confirm(`Are you sure you want to delete "${lesson.title}"?`);
    if (!confirmDel) return;

    try {
      // Remove DB record from database
      const { error: dbError } = await client
        .from('lessons')
        .delete()
        .eq('id', lesson.id);

      if (dbError) throw dbError;

      // Clean up storage file
      try {
        const parts = lesson.file_url.split('/lessons/');
        if (parts.length > 1) {
          await client.storage.from('lessons').remove([parts[1]]);
        }
      } catch {}

      // Refresh list immediately from server to guarantee sync
      await fetchLessons();
      setStatusMessage(`Deleted "${lesson.title}" successfully.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const filteredLessons = lessonsList.filter(l =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.minister_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071326] text-[#E2ECFA] flex flex-col justify-center items-center px-4 py-8">
        <div
          className="w-full max-w-md bg-[#0E2240] border border-[#1D3D6F] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
          style={{
            marginTop: 'max(var(--safe-area-inset-top, env(safe-area-inset-top, 0px)), 12px)'
          }}
        >
          {/* Top Decorative Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9A227] via-[#E4C765] to-[#C9A227]" />

          {/* Header & Logo */}
          <div className="text-center mb-6 pt-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#C9A227] to-[#997715] flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-[#C9A227]/20 border border-[#E4C765]/40">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              COG Minister Portal
            </h1>
            <p className="text-xs text-[#C9A227] font-semibold tracking-wide uppercase mt-1">
              Truth • Justice • Righteousness
            </p>
            <p className="text-xs text-blue-200/80 mt-1">
              Authorized Minister & Pastor Login
            </p>
          </div>

          {/* Error Message */}
          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#C9A227] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-11 py-2.5 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-hidden focus:ring-2 focus:ring-[#C9A227] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#b5901f] hover:from-[#d6ad2c] hover:to-[#c49c23] text-white font-bold text-sm shadow-md shadow-[#C9A227]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PORTAL (AUTHENTICATED)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#071326] text-[#E2ECFA] flex flex-col">
      {/* Header with Safe Area Status Bar Clearance */}
      <header
        className="bg-[#0E2240] border-b border-[#1D3D6F] px-4 sticky top-0 z-30 shadow-md select-none"
        style={{
          paddingTop: 'calc(max(var(--safe-area-inset-top, env(safe-area-inset-top, 0px)), 38px) + 0.625rem)',
          paddingBottom: '0.75rem'
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-2 rounded-xl bg-[#C9A227] text-white font-bold flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                COG Minister Portal
              </h1>
              <p className="text-[11px] text-blue-200 truncate">
                The Church of God (Truth, Justice, and Righteousness)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Sign Out of Minister Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-4xl mx-auto flex gap-2 mt-3 pt-2.5 border-t border-[#1D3D6F]/60">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Lesson</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('manage');
              fetchLessons();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manage Uploads ({lessonsList.length})</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 max-w-4xl w-full mx-auto p-4"
        style={{
          paddingBottom: 'calc(max(var(--safe-area-inset-bottom, env(safe-area-inset-bottom, 0px)), 16px) + 1.5rem)'
        }}
      >
        {/* Status Toast */}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#1B3A6B] border border-[#C9A227]/40 text-white text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-300 hover:text-white cursor-pointer ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TAB 1: UPLOAD LESSON */}
        {activeTab === 'upload' && (
          <div className="bg-[#0E2240] rounded-2xl border border-[#1D3D6F] p-5 shadow-lg">
            <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#C9A227]" />
              Upload Church Lesson or Sermon File
            </h2>
            <p className="text-xs text-blue-200 mb-5">
              Uploaded files will automatically appear in the congregation's COG Bible Lessons section.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">
                    Lesson / Sermon Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Walking in Truth & Righteousness"
                    className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">
                    Minister / Pastor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={ministerName}
                    onChange={(e) => setMinisterName(e.target.value)}
                    placeholder="e.g. Pastor John Doe"
                    className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                  >
                    <option value="Sabbath Study">Sabbath Study</option>
                    <option value="Church Doctrine">Church Doctrine</option>
                    <option value="Bible Study">Bible Study</option>
                    <option value="Youth Fellowship">Youth Fellowship</option>
                    <option value="Pastoral Letter">Pastoral Letter</option>
                    <option value="Song & Hymn Sheet">Song & Hymn Sheet</option>
                    <option value="General Lesson">General Lesson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-blue-200 mb-1">
                    File (PDF, PNG, JPG, DOCX, etc.) *
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="w-full text-xs text-blue-200 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227] file:text-white hover:file:bg-[#b5901f] cursor-pointer"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="p-3 bg-[#071326] rounded-xl border border-[#1D3D6F] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
                    <span className="font-semibold text-white truncate">{selectedFile.name}</span>
                    <span className="text-gray-400 flex-shrink-0">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] uppercase font-bold flex-shrink-0 ml-2">
                    {detectType(selectedFile.name, selectedFile.type)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-blue-200 mb-1">
                  Description / Scriptural References (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of this lesson, core Bible passages, and study notes..."
                  className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#b5901f] text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

        {/* TAB 2: MANAGE LESSONS */}
        {activeTab === 'manage' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter uploaded lessons..."
                  className="w-full pl-9 pr-4 py-2 bg-[#0E2240] border border-[#1D3D6F] rounded-xl text-xs text-white"
                />
              </div>
              <button
                onClick={fetchLessons}
                disabled={loadingLessons}
                className="p-2 rounded-xl bg-[#0E2240] border border-[#1D3D6F] text-blue-200 hover:text-white cursor-pointer"
                title="Refresh lessons list"
              >
                <RefreshCw className={`w-4 h-4 ${loadingLessons ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loadingLessons ? (
              <div className="py-12 text-center text-xs text-blue-200">
                <RefreshCw className="w-6 h-6 animate-spin text-[#C9A227] mx-auto mb-2" />
                Loading published lessons...
              </div>
            ) : filteredLessons.length === 0 ? (
              <div className="p-8 text-center bg-[#0E2240] rounded-2xl border border-[#1D3D6F] text-xs text-gray-400">
                No lessons found. Upload your first lesson in the Upload tab.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="p-4 bg-[#0E2240] rounded-2xl border border-[#1D3D6F] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C9A227]/20 text-[#C9A227]">
                          {lesson.file_type || 'file'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </span>
                        {lesson.category && (
                          <span className="text-xs text-blue-300">
                            • {lesson.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white text-sm">{lesson.title}</h3>
                      <p className="text-xs text-[#C9A227] mt-0.5">
                        By {lesson.minister_name}
                      </p>
                      {lesson.description && (
                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={lesson.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </a>
                      <button
                        onClick={() => handleDelete(lesson)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
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
  );
}
