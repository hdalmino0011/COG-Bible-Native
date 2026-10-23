import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Download,
  Eye,
  WifiOff,
  RefreshCw,
  Search,
  FileCheck,
  Image as ImageIcon,
  File,
  ExternalLink,
  X,
  Calendar,
  User
} from 'lucide-react';
import {
  LessonItem,
  fetchLessonsFromSupabase,
  getCachedLessons,
  formatFileSize,
  detectFileType
} from '../utils/supabase';

interface LessonsScreenProps {
  onShowToast: (msg: string) => void;
}

export const LessonsScreen: React.FC<LessonsScreenProps> = ({ onShowToast }) => {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Viewer Modal State
  const [viewingLesson, setViewingLesson] = useState<LessonItem | null>(null);

  const loadLessons = useCallback(async (showLoadingSpinner: boolean = true) => {
    if (showLoadingSpinner) setLoading(true);

    const res = await fetchLessonsFromSupabase();
    if (res.data && res.data.length > 0) {
      setLessons(res.data);
    }
    setIsOffline(Boolean(res.isOffline));
    setLoading(false);
  }, []);

  useEffect(() => {
    // 1. Instantly populate cached lessons so user sees content with 0ms delay
    const cached = getCachedLessons();
    if (cached.length > 0) {
      setLessons(cached);
    }
    // 2. Fetch fresh lessons from cloud
    loadLessons(cached.length === 0);

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
  }, [loadLessons]);

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
      window.open(lesson.file_url, '_blank');
      onShowToast(`Opening ${lesson.file_name} for download...`);
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
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#C9A227]/15 text-[#C9A227] flex-shrink-0">
                <FileText className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold font-serif text-[#1B3A6B] dark:text-[#E4C765] truncate">
                Church Lessons & Study Guides
              </h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              Sermons, study notes, and teachings shared by Ministers & Pastors.
            </p>
          </div>

          <button
            onClick={() => {
              loadLessons(true);
              onShowToast('Checking for new lessons...');
            }}
            disabled={loading}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer disabled:opacity-50 flex-shrink-0"
            title="Refresh lessons list"
            aria-label="Refresh lessons list"
          >
            <RefreshCw className={`w-4 h-4 text-[#C9A227] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Network State Alert */}
      {isOffline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Offline Mode:</strong> Internet is required to fetch or download new church lessons. Showing cached records.
            </span>
          </div>
          <button
            onClick={() => loadLessons(true)}
            className="px-2.5 py-1 rounded bg-amber-600 text-white text-[11px] font-semibold hover:bg-amber-700 transition cursor-pointer flex-shrink-0 ml-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* 3. Controls & Filters */}
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

      {/* 4. Lessons Feed */}
      <div className="max-w-4xl w-full mx-auto px-4 py-3 flex-1">
        {loading && lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <RefreshCw className="w-8 h-8 text-[#C9A227] animate-spin mb-3" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Loading church lessons...
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
                : 'No lessons available right now. Materials uploaded by ministers in the Minister Portal will appear here.'}
            </p>
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
                        {lesson.file_size_bytes ? (
                          <span className="text-[11px] text-gray-400">
                            • {formatFileSize(lesson.file_size_bytes)}
                          </span>
                        ) : null}
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

                  {/* Actions: View & Download (No delete or upload) */}
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

      {/* 5. In-App Lesson Viewer Modal */}
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
                  title="Open in new window / full viewer"
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
                    This document ({viewingLesson.file_name.split('.').pop()}) is best opened or read in an external reader app.
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
    </div>
  );
};
