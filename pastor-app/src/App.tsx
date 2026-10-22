import React, { useState, useEffect } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Database,
  ExternalLink,
  Search,
  BookOpen,
  Calendar,
  Lock,
  X
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

export default function App() {
  // Supabase Credentials
  const DEFAULT_URL = 'https://dzxddspgajznsxnekhrn.supabase.co';
  const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6eGRkc3BnYWp6bnN4bmVraHJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2ODc1OTgsImV4cCI6MjEwODI2MzU5OH0.Bu8R46ByeJMaNFbx2hsIu6secaoobkjj5SlYarwVu8o';

  const [supabaseUrl, setSupabaseUrl] = useState<string>(
    localStorage.getItem('cog_pastor_supabase_url') || import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL
  );
  const [supabaseKey, setSupabaseKey] = useState<string>(
    localStorage.getItem('cog_pastor_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_KEY
  );
  const [client, setClient] = useState<SupabaseClient | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'guide'>('upload');

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
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [lessonsList, setLessonsList] = useState<LessonRecord[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize Supabase Client
  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      try {
        const c = createClient(supabaseUrl.trim(), supabaseKey.trim());
        setClient(c);
      } catch (err) {
        console.error('Invalid Supabase configuration:', err);
        setClient(null);
      }
    } else {
      setClient(null);
    }
  }, [supabaseUrl, supabaseKey]);

  // Load Lessons when Manage tab is active
  useEffect(() => {
    if (activeTab === 'manage' && client) {
      fetchLessons();
    }
  }, [activeTab, client]);

  const fetchLessons = async () => {
    if (!client) return;
    setLoadingLessons(true);
    try {
      const { data, error } = await client
        .from('lessons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setStatusMessage(`Error fetching: ${error.message}`);
      } else {
        setLessonsList(data || []);
      }
    } catch (err: any) {
      setStatusMessage(`Network error: ${err.message}`);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('cog_pastor_supabase_url', supabaseUrl.trim());
    localStorage.setItem('cog_pastor_supabase_key', supabaseKey.trim());
    setShowConfigModal(false);
    setStatusMessage('Supabase credentials saved successfully!');
    setTimeout(() => setStatusMessage(null), 3000);
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
      setShowConfigModal(true);
      return;
    }
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    if (!title.trim() || !ministerName.trim()) {
      alert('Please enter both Lesson Title and Minister Name.');
      return;
    }

    setUploading(true);
    setStatusMessage('Uploading file to Supabase Storage...');
    setUploadSuccess(false);

    try {
      // 1. Sanitize file name
      const sanitizedName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${Date.now()}_${sanitizedName}`;

      // 2. Upload to Supabase Storage bucket 'lessons'
      const { error: storageError } = await client.storage
        .from('lessons')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
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
        throw new Error(`Database record failed: ${dbError.message}`);
      }

      // Save Minister Name for next time
      localStorage.setItem('cog_minister_name', ministerName.trim());

      setUploadSuccess(true);
      setStatusMessage('Lesson uploaded successfully to congregation app!');
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setTimeout(() => setUploadSuccess(false), 5000);
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
      // Remove DB record
      const { error: dbError } = await client
        .from('lessons')
        .delete()
        .eq('id', lesson.id);

      if (dbError) throw dbError;

      // Also attempt storage cleanup if path extracts cleanly
      try {
        const parts = lesson.file_url.split('/lessons/');
        if (parts.length > 1) {
          await client.storage.from('lessons').remove([parts[1]]);
        }
      } catch {}

      setLessonsList(prev => prev.filter(l => l.id !== lesson.id));
      setStatusMessage(`Deleted "${lesson.title}"`);
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

  return (
    <div className="min-h-screen bg-[#071326] text-[#E2ECFA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0E2240] border-b border-[#1D3D6F] px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#C9A227] text-white font-bold">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                COG Minister Portal
              </h1>
              <p className="text-[11px] text-blue-200">
                Church of God (Truth, Justice, and Righteousness)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                client
                  ? 'border-green-500/40 text-green-400 bg-green-500/10'
                  : 'border-[#C9A227] text-[#C9A227] bg-[#C9A227]/10'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{client ? 'Supabase Connected' : 'Connect Supabase'}</span>
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-4xl mx-auto flex gap-2 mt-3 pt-2 border-t border-[#1D3D6F]/60">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Lesson</span>
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manage Uploads</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-[#C9A227] text-white shadow-xs'
                : 'text-blue-200 hover:bg-white/5'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Setup Guide</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4">
        {/* Status Toast */}
        {statusMessage && (
          <div className="mb-4 p-3 rounded-xl bg-[#1B3A6B] border border-[#C9A227]/40 text-white text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0" />
              <span>{statusMessage}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-gray-300 hover:text-white"
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
              Uploaded files will immediately appear in the congregation's COG Bible Lessons section.
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
                    <option value="Sunday Service">Sunday Service</option>
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
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C9A227]" />
                    <span className="font-semibold text-white">{selectedFile.name}</span>
                    <span className="text-gray-400">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] uppercase font-bold">
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
                      <span>Uploading File to Supabase...</span>
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
                className="p-2 rounded-xl bg-[#0E2240] border border-[#1D3D6F] text-blue-200 hover:text-white"
                title="Refresh"
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
                    className="p-4 bg-[#0E2240] rounded-2xl border border-[#1D3D6F] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
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

        {/* TAB 3: SETUP GUIDE */}
        {activeTab === 'guide' && (
          <div className="bg-[#0E2240] rounded-2xl border border-[#1D3D6F] p-5 space-y-4 text-xs">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#C9A227]" />
              Supabase Quick Setup Instructions
            </h2>

            <div>
              <p className="font-semibold text-[#C9A227] mb-1">
                1. Create 'lessons' Storage Bucket
              </p>
              <p className="text-gray-300">
                Go to Supabase Dashboard → <strong>Storage</strong> → Click <strong>New Bucket</strong> → Name it <strong>lessons</strong> and check <strong>Public Bucket</strong>.
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#C9A227] mb-1">
                2. Run SQL Schema in Supabase
              </p>
              <p className="text-gray-300 mb-2">
                In Supabase Dashboard → <strong>SQL Editor</strong>, paste this snippet:
              </p>
              <div className="bg-[#071326] p-3 rounded-xl font-mono text-[11px] text-green-400 select-all overflow-x-auto">
                <pre>{`create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text default '',
  minister_name text not null,
  file_url text not null,
  file_name text not null,
  file_type text default 'pdf',
  file_size_bytes bigint default 0,
  category text default 'general',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.lessons enable row level security;

create policy "Public can view lessons" on public.lessons for select using (true);
create policy "Allow insert lessons" on public.lessons for insert with check (true);
create policy "Allow delete lessons" on public.lessons for delete using (true);

create policy "Public storage view" on storage.objects for select using (bucket_id = 'lessons');
create policy "Allow storage upload" on storage.objects for insert with check (bucket_id = 'lessons');
create policy "Allow storage delete" on storage.objects for delete using (bucket_id = 'lessons');`}</pre>
              </div>
            </div>

            <div>
              <p className="font-semibold text-[#C9A227] mb-1">
                3. Connect URL & Anon Key
              </p>
              <p className="text-gray-300">
                Copy your <strong>Project URL</strong> and <strong>Anon Key</strong> from <strong>Project Settings → API</strong> into the Connect Supabase dialog.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Supabase Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E2240] w-full max-w-md rounded-2xl border border-[#1D3D6F] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C9A227]" />
                Supabase Credentials
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCredentials} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-blue-200 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyz.supabase.co"
                  className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-blue-200 mb-1">
                  Supabase Anon or Service Key
                </label>
                <input
                  type="password"
                  required
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUz..."
                  className="w-full px-3 py-2 bg-[#071326] border border-[#1D3D6F] rounded-xl text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#C9A227] text-white font-bold"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
