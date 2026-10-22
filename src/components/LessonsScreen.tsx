import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Eye,
  WifiOff,
  RefreshCw,
  Search,
  Filter,
  FileCheck,
  Image as ImageIcon,
  File,
  AlertCircle,
  ExternalLink,
  X,
  Database,
  Calendar,
  User,
  CheckCircle2,
  Lock,
  UploadCloud,
  Plus
} from 'lucide-react';
import {
  LessonItem,
  fetchLessonsFromSupabase,
  getCachedLessons,
  formatFileSize,
  detectFileType,
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  getSupabaseClient
} from '../utils/supabase';

interface LessonsScreenProps {
  onShowToast: (msg: string) => void;
}

export const LessonsScreen: React.FC<LessonsScreenProps> = ({ onShowToast }) => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Viewer Modal State
  const [viewingLesson, setViewingLesson] = useState<LessonItem | null>(null);

  // Supabase Config Modal State
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configUrl, setConfigUrl] = useState<string>('');
  const [configKey, setConfigKey] = useState<string>('');

  // SQL & Setup Guide Modal State
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  // Minister Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadMinister, setUploadMinister] = useState<string>(
    typeof window !== 'undefined' ? localStorage.getItem('cog_minister_name') || '' : ''
  );
  const [uploadCategory, setUploadCategory] = useState<string>('Sabbath Study');
  const [uploadDesc, setUploadDesc] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Monitor online / offline network state
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      loadLessons(false);
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadLessons = useCallback(async (showLoadingSpinner: boolean = true) => {
    if (showLoadingSpinner) setLoading(true);
    setErrorMsg(null);

    const res = await fetchLessonsFromSupabase();
    setLessons(res.data || []);
    if (res.isOffline) {
      setIsOffline(true);
    }
    if (res.error) {
      setErrorMsg(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Populate cached data first for immediate rendering
    const cached = getCachedLessons();
    if (cached.length > 0) {
      setLessons(cached);
    }
    loadLessons(true);
  }, [loadLessons]);

  const handleOpenConfig = () => {
    const creds = getSupabaseCredentials();
    setConfigUrl(creds.url);
    setConfigKey(creds.anonKey);
    setShowConfigModal(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configUrl.trim() || !configKey.trim()) {
      onShowToast('Please provide both Supabase URL and Anon Key');
      return;
    }
    saveSupabaseCredentials(configUrl.trim(), configKey.trim());
    setShowConfigModal(false);
    onShowToast('Supabase settings saved!');
    loadLessons(true);
  };

  const handleDownload = async (lesson: LessonItem) => {
    try {
      onShowToast(`Downloading ${lesson.file_name}...`);
      const response = await fetch(lesson.file_url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = lesson.file_name || `${lesson.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      onShowToast(`Downloaded: ${lesson.file_name}`);
    } catch {
      // Direct window open fallback for native device browsers
      window.open(lesson.file_url, '_blank');
      onShowToast(`Opening ${lesson.file_name} for download...`);
    }
  };

  const handleMinisterUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = getSupabaseClient();
    if (!client) {
      setShowConfigModal(true);
      return;
    }
    if (!uploadFile) {
      onShowToast('Please select a file to upload');
      return;
    }
    if (!uploadTitle.trim() || !uploadMinister.trim()) {
      onShowToast('Please enter Lesson Title and Minister Name');
      return;
    }

    setIsUploading(true);
    onShowToast('Uploading file to Supabase...');

    try {
      const sanitizedName = uploadFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${Date.now()}_${sanitizedName}`;

      const { error: storageError } = await client.storage
        .from('lessons')
        .upload(filePath, uploadFile, { cacheControl: '3600', upsert: true });

      if (storageError) throw storageError;

      const { data: urlData } = client.storage.from('lessons').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      const fileType = detectFileType(uploadFile.name, uploadFile.type);

      const { error: dbError } = await client.from('lessons').insert([
        {
          title: uploadTitle.trim(),
          description: uploadDesc.trim(),
          minister_name: uploadMinister.trim(),
          category: uploadCategory,
          file_url: publicUrl,
          file_name: uploadFile.name,
          file_type: fileType,
          file_size_bytes: uploadFile.size
        }
      ]);

      if (dbError) throw dbError;

      if (typeof window !== 'undefined') {
        localStorage.setItem('cog_minister_name', uploadMinister.trim());
      }

      onShowToast('Lesson published successfully!');
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadDesc('');
      setUploadFile(null);
      loadLessons(true);
    } catch (err: any) {
      console.error('Upload failed:', err);
      onShowToast(`Upload failed: ${err.message || 'Error uploading file'}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Filter lessons
  const filteredLessons = lessons.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.minister_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    const type = item.file_type || detectFileType(item.file_name);
    return type === selectedCategory;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-amber-500" />;
      case 'doc':
        return <FileCheck className="w-5 h-5 text-blue-500" />;
      default:
        return <File className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F7F5EF] dark:bg-[#071326] text-[#202D42] dark:text-[#E2ECFA] overflow-y-auto">
      {/* 1. Header Banner & Status Bar */}
      <div className="bg-white dark:bg-[#0E2240] border-b border-[#E3DFD3] dark:border-[#1D3D6F] px-4 py-3 shadow-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C9A227]/15 text-[#C9A227]">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold font-serif text-[#1B3A6B] dark:text-[#E4C765]">
                Church Lessons & Study Guides
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Sermons, study notes, and teachings uploaded by Ministers & Pastors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!isSupabaseConfigured()) {
                  setShowConfigModal(true);
                } else {
                  setShowUploadModal(true);
                }
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#b5901f] text-white transition-colors flex items-center gap-1 font-bold shadow-xs cursor-pointer"
              title="Upload New Lesson (Ministers / Pastors)"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => setShowGuideModal(true)}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-[#1B3A6B]/10 dark:bg-white/10 hover:bg-[#1B3A6B]/20 dark:hover:bg-white/15 text-[#1B3A6B] dark:text-blue-200 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              title="Supabase Setup Instructions"
            >
              <Database className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Guide</span>
            </button>

            <button
              onClick={handleOpenConfig}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227]/10 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              title="Configure Supabase Connection"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured() ? 'Connected' : 'Connect'}</span>
            </button>

            <button
              onClick={() => loadLessons(true)}
              disabled={loading}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh lessons list"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Network State Alert */}
      {isOffline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2.5 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Offline Mode:</strong> Internet is required to fetch or download new church lessons. Showing cached records.
            </span>
          </div>
          <button
            onClick={() => loadLessons(true)}
            className="px-2 py-1 rounded bg-amber-600 text-white text-[11px] font-semibold hover:bg-amber-700 transition cursor-pointer flex-shrink-0 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Missing Config Banner */}
      {!isSupabaseConfigured() && !loading && (
        <div className="bg-[#1B3A6B]/10 border-b border-[#1B3A6B]/20 px-4 py-3 text-xs text-[#1B3A6B] dark:text-blue-200">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-[#C9A227] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Supabase Connection Required</p>
                <p className="text-gray-600 dark:text-blue-300 mt-0.5">
                  To load lessons uploaded by your pastors and ministers, connect your Supabase project.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 sm:mt-0">
              <button
                onClick={handleOpenConfig}
                className="px-3 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#b5901f] text-white font-bold transition shadow-xs cursor-pointer"
              >
                Set Supabase Keys
              </button>
              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-200 font-semibold transition cursor-pointer"
              >
                View SQL Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Controls & Filters */}
      <div className="max-w-4xl w-full mx-auto px-4 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons by title, minister, or topic..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#0E2240] border border-[#E3DFD3] dark:border-[#1D3D6F] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Types */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Files' },
              { id: 'pdf', label: 'PDFs' },
              { id: 'image', label: 'Images' },
              { id: 'doc', label: 'Documents' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedCategory(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === f.id
                    ? 'bg-[#1B3A6B] dark:bg-[#C9A227] text-white shadow-xs'
                    : 'bg-white dark:bg-[#0E2240] border border-[#E3DFD3] dark:border-[#1D3D6F] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Lessons Feed */}
      <div className="max-w-4xl w-full mx-auto px-4 py-3 flex-1">
        {loading && lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#C9A227] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Connecting to lessons database...
            </p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="bg-white dark:bg-[#0E2240] rounded-2xl border border-[#E3DFD3] dark:border-[#1D3D6F] p-8 text-center my-6 shadow-xs">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold font-serif text-[#1B3A6B] dark:text-[#E4C765]">
              No Lessons Found
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-1">
              {searchQuery
                ? `No lessons match "${searchQuery}". Try different keywords or clear filters.`
                : 'No lessons have been uploaded yet. Ministers and pastors will upload files here using the Pastor Upload App.'}
            </p>
            {!isSupabaseConfigured() && (
              <button
                onClick={handleOpenConfig}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C9A227] text-white text-xs font-bold hover:bg-[#b5901f] transition cursor-pointer"
              >
                <Database className="w-4 h-4" />
                Configure Supabase
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
            {filteredLessons.map((lesson) => {
              const fileType = lesson.file_type || detectFileType(lesson.file_name);
              const formattedDate = lesson.created_at
                ? new Date(lesson.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : '';

              return (
                <div
                  key={lesson.id}
                  className="bg-white dark:bg-[#0E2240] rounded-2xl border border-[#E3DFD3] dark:border-[#1D3D6F] p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Type Badge & Date */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded-md bg-gray-100 dark:bg-white/10">
                          {getFileIcon(fileType)}
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          {fileType.toUpperCase()}
                        </span>
                        {lesson.file_size_bytes && (
                          <span className="text-[11px] text-gray-400">
                            • {formatFileSize(lesson.file_size_bytes)}
                          </span>
                        )}
                      </div>

                      {formattedDate && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Lesson Title */}
                    <h3 className="font-serif font-bold text-base text-[#10203D] dark:text-white leading-snug">
                      {lesson.title}
                    </h3>

                    {/* Minister Tag */}
                    {lesson.minister_name && (
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-[#C9A227]">
                        <User className="w-3.5 h-3.5" />
                        <span>Pastor/Minister: {lesson.minister_name}</span>
                      </div>
                    )}

                    {/* Lesson Description */}
                    {lesson.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3 leading-relaxed">
                        {lesson.description}
                      </p>
                    )}
                  </div>

                  {/* Actions: View & Download */}
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-gray-100 dark:border-white/10">
                    <button
                      onClick={() => setViewingLesson(lesson)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1B3A6B] hover:bg-[#2C548F] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>

                    <button
                      onClick={() => handleDownload(lesson)}
                      className="py-2 px-3 rounded-xl bg-[#C9A227] hover:bg-[#b5901f] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title="Download file to device"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. In-App Lesson Viewer Modal */}
      {viewingLesson && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-[#0E2240] w-full max-w-4xl h-[92vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-white/20">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-[#1B3A6B] text-white flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold font-serif truncate">
                  {viewingLesson.title}
                </h3>
                <p className="text-[11px] text-blue-200 truncate">
                  {viewingLesson.minister_name ? `By ${viewingLesson.minister_name} • ` : ''}
                  {viewingLesson.file_name}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleDownload(viewingLesson)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#C9A227] hover:bg-[#b5901f] text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <a
                  href={viewingLesson.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title="Open in new window / full browser viewer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setViewingLesson(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: File Viewer */}
            <div className="flex-1 bg-gray-900 flex items-center justify-center overflow-auto p-2">
              {viewingLesson.file_type === 'image' || detectFileType(viewingLesson.file_name) === 'image' ? (
                <img
                  src={viewingLesson.file_url}
                  alt={viewingLesson.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : viewingLesson.file_type === 'pdf' || detectFileType(viewingLesson.file_name) === 'pdf' ? (
                <iframe
                  src={`${viewingLesson.file_url}#toolbar=1`}
                  title={viewingLesson.title}
                  className="w-full h-full border-none rounded-lg bg-white"
                />
              ) : (
                <div className="text-center p-8 text-white max-w-md">
                  <FileText className="w-16 h-16 text-[#C9A227] mx-auto mb-3" />
                  <h4 className="text-lg font-bold mb-2">Document Preview</h4>
                  <p className="text-xs text-gray-300 mb-4">
                    This file format ({viewingLesson.file_name.split('.').pop()}) is best viewed or read in an external reader application on your device.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleDownload(viewingLesson)}
                      className="px-4 py-2 rounded-xl bg-[#C9A227] text-white text-xs font-bold hover:bg-[#b5901f] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      Download to Device
                    </button>
                    <a
                      href={viewingLesson.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6.5 Minister Upload Lesson Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white dark:bg-[#0E2240] w-full max-w-lg rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-serif font-bold text-base text-[#1B3A6B] dark:text-[#E4C765]">
                  Upload Church Lesson
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-300 mb-4">
              Ministers and Pastors can upload study files (PDF, PNG, JPG, DOCX, etc.) directly to the congregation's Bible app.
            </p>

            <form onSubmit={handleMinisterUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Lesson / Sermon Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking in Truth and Righteousness"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Minister / Pastor Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pastor John Doe"
                    value={uploadMinister}
                    onChange={(e) => setUploadMinister(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
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
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Lesson File (PDF, Image JPG/PNG, Word DOCX) *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-600 dark:text-gray-300 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A227] file:text-white hover:file:bg-[#b5901f] cursor-pointer"
                />
                {uploadFile && (
                  <p className="text-[11px] text-green-600 dark:text-green-400 mt-1">
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-1">
                  Description / Scripture References (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of this lesson, core Bible passages, and study points..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#b5901f] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Publish Lesson</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Supabase Credentials Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0E2240] w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-serif font-bold text-base text-[#1B3A6B] dark:text-[#E4C765]">
                  Supabase Project Settings
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-300 mb-4">
              Enter your Supabase Project URL and Public Anon Key. You can find these in your Supabase Dashboard under <strong>Project Settings → API</strong>.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Supabase Project URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={configUrl}
                  onChange={(e) => setConfigUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Supabase Anon Key (Public)
                </label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfigModal(false);
                    setShowGuideModal(true);
                  }}
                  className="text-xs text-[#1B3A6B] dark:text-[#E4C765] hover:underline cursor-pointer"
                >
                  How to setup Supabase?
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#C9A227] hover:bg-[#b5901f] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Save & Connect
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Supabase SQL & Bucket Setup Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0E2240] w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3 border-b border-gray-100 dark:border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C9A227]" />
                <h3 className="font-serif font-bold text-base text-[#1B3A6B] dark:text-[#E4C765]">
                  Supabase Setup Guide for Lessons
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-gray-700 dark:text-gray-300 pr-1">
              <div>
                <h4 className="font-bold text-[#1B3A6B] dark:text-[#E4C765] flex items-center gap-1.5 mb-1 text-sm">
                  <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white flex items-center justify-center text-[10px]">1</span>
                  Create Storage Bucket in Supabase
                </h4>
                <p className="mb-1 text-gray-600 dark:text-gray-400">
                  In your Supabase project dashboard, go to <strong>Storage</strong> → <strong>New Bucket</strong>:
                </p>
                <ul className="list-disc pl-5 space-y-0.5 text-gray-600 dark:text-gray-400">
                  <li>Bucket name: <code className="bg-gray-100 dark:bg-black/30 px-1 py-0.5 rounded text-[#C9A227] font-mono">lessons</code></li>
                  <li>Enable: <strong>Public Bucket</strong> (so members can view & download lessons)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#1B3A6B] dark:text-[#E4C765] flex items-center gap-1.5 mb-1 text-sm">
                  <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white flex items-center justify-center text-[10px]">2</span>
                  Run SQL in Supabase SQL Editor
                </h4>
                <p className="mb-2 text-gray-600 dark:text-gray-400">
                  Go to <strong>SQL Editor</strong> in Supabase, paste this SQL and click <strong>Run</strong>:
                </p>
                <div className="relative bg-gray-900 text-green-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto select-all">
                  <pre>{`-- 1. Create lessons table
create table if not exists public.lessons (
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

-- 2. Enable Row Level Security (RLS)
alter table public.lessons enable row level security;

-- 3. Allow everyone (public/congregation) to view and read lessons
create policy "Public can view lessons" on public.lessons
  for select using (true);

-- 4. Allow insert and upload
create policy "Allow insert lessons" on public.lessons
  for insert with check (true);

-- 5. Storage policies for lessons bucket
create policy "Public Access to Lessons" on storage.objects
  for select using (bucket_id = 'lessons');

create policy "Allow upload to lessons bucket" on storage.objects
  for insert with check (bucket_id = 'lessons');`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#1B3A6B] dark:text-[#E4C765] flex items-center gap-1.5 mb-1 text-sm">
                  <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white flex items-center justify-center text-[10px]">3</span>
                  Copy Project URL & Anon Key
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Go to <strong>Project Settings → API</strong>. Copy <strong>Project URL</strong> and <strong>Project API key (anon/public)</strong>, then click <strong>Connect</strong> above to save them!
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-end">
              <button
                onClick={() => {
                  setShowGuideModal(false);
                  handleOpenConfig();
                }}
                className="px-4 py-2 rounded-xl bg-[#C9A227] hover:bg-[#b5901f] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Enter My Supabase Keys
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
