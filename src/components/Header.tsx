import React, { useState, useRef, useEffect } from 'react';
import { Search, Bookmark as BookmarkIcon, Columns, ChevronDown, Check } from 'lucide-react';
import { ReadingLayout, ScreenType } from '../types';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface HeaderProps {
  currentScreen: ScreenType;
  readingLayout: ReadingLayout;
  onLayoutChange: (layout: ReadingLayout) => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarkCount: number;
  notesCount: number;
  currentBook?: string;
  currentChapter?: number;
  onGoToBible?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  readingLayout,
  onLayoutChange,
  onOpenSearch,
  onOpenBookmarks,
  bookmarkCount,
  notesCount,
  currentBook,
  currentChapter,
  onGoToBible
}) => {
  const totalSaved = bookmarkCount + notesCount;
  const [showLayoutMenu, setShowLayoutMenu] = useState(false);
  const layoutDropdownRef = useRef<HTMLDivElement>(null);

  // Close layout menu on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (layoutDropdownRef.current && !layoutDropdownRef.current.contains(e.target as Node)) {
        setShowLayoutMenu(false);
      }
    };
    if (showLayoutMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showLayoutMenu]);

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'books':
        return 'Books of the Bible';
      case 'bible':
        return currentBook ? `${currentBook} ${currentChapter}` : 'COG (T.J.R) Bible';
      case 'lessons':
        return 'Church Lessons';
      case 'quiz':
        return 'Bible Quiz';
      case 'dictionary':
        return 'Bible Dictionary';
      case 'bookmarks':
        return 'Saved & Highlights';
      case 'settings':
        return 'App Settings';
      default:
        return 'COG (T.J.R) Bible';
    }
  };

  const getLayoutBadge = () => {
    switch (readingLayout) {
      case 'parallel':
        return 'CEB • KJV';
      case 'parallel-eng-tag':
        return 'ENG • TAG';
      case 'parallel-ceb-tag':
        return 'CEB • TAG';
      case 'tagalog':
        return 'TAG (ADB 1905)';
      case 'cebuano':
        return 'CEB (Bugna)';
      case 'english':
        return 'ENG (KJV)';
    }
  };

  const getLayoutShortLabel = () => {
    switch (readingLayout) {
      case 'parallel':
        return 'CEB • ENG';
      case 'parallel-eng-tag':
        return 'ENG • TAG';
      case 'parallel-ceb-tag':
        return 'CEB • TAG';
      case 'tagalog':
        return 'TAG Only';
      case 'cebuano':
        return 'CEB Only';
      case 'english':
        return 'ENG Only';
    }
  };

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-30 flex flex-col bg-gradient-to-r from-[#10203D] via-[#1B3A6B] to-[#2C548F] text-white shadow-md select-none w-full"
      style={{
        paddingTop: 'calc(max(var(--safe-area-inset-top, env(safe-area-inset-top, 0px)), var(--sat-fallback, 0px)) + 0.625rem)',
        paddingBottom: '0.625rem'
      }}
    >
      <div className="flex items-center justify-between px-3 sm:px-4 w-full">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onGoToBible}
            className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E4C765]/80 shadow-sm flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
            title="The Church of God (Truth, Justice, and Righteousness)"
            aria-label="COG Logo"
          >
            <img
              src={EMBEDDED_LOGO_DATA_URI}
              alt="COG Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedJpg) {
                  target.dataset.triedJpg = 'true';
                  target.src = './logo.jpg';
                } else if (!target.dataset.triedPng) {
                  target.dataset.triedPng = 'true';
                  target.src = './logo.png';
                }
              }}
            />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 truncate">
              <h1 className="font-serif text-base sm:text-lg font-bold tracking-tight text-white truncate">
                {getScreenTitle()}
              </h1>
              {currentScreen === 'bible' && (
                <span className="hidden md:inline-block text-[11px] font-sans font-normal text-[#E4C765] bg-[#E4C765]/15 px-2 py-0.5 rounded-full">
                  {getLayoutBadge()}
                </span>
              )}
            </div>
            {currentScreen === 'bible' && (
              <p className="text-[10px] text-blue-200/80 tracking-wide font-light hidden sm:block truncate">
                The Church of God (Truth, Justice, and Righteousness)
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {currentScreen === 'bible' && (
            <>
              {/* Layout Dropdown Selector */}
              <div className="relative" ref={layoutDropdownRef}>
                <button
                  id="layout-picker-btn"
                  onClick={() => setShowLayoutMenu(prev => !prev)}
                  className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 transition-all shadow-xs cursor-pointer"
                  title="Choose Bible reading layout & versions"
                  aria-label="Bible Layout and Version Selector"
                >
                  <Columns className="w-3.5 h-3.5 text-[#E4C765]" />
                  <span>{getLayoutShortLabel()}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#E4C765] transition-transform ${showLayoutMenu ? 'rotate-180' : ''}`} />
                </button>

                {showLayoutMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 sm:w-64 bg-[var(--paper)] text-[var(--slate)] border border-[var(--line)] rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-fadeIn text-xs">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--slate-soft)] border-b border-[var(--line)]">
                      Parallel Reading
                    </div>
                    <button
                      onClick={() => { onLayoutChange('parallel-eng-tag'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'parallel-eng-tag' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>English + Filipino (Tagalog)</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">KJV & Ang Dating Biblia</span>
                      </div>
                      {readingLayout === 'parallel-eng-tag' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                    <button
                      onClick={() => { onLayoutChange('parallel-ceb-tag'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'parallel-ceb-tag' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Cebuano + Filipino (Tagalog)</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">Bugna & Ang Dating Biblia</span>
                      </div>
                      {readingLayout === 'parallel-ceb-tag' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                    <button
                      onClick={() => { onLayoutChange('parallel'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'parallel' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Cebuano + English</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">Bugna & King James Version</span>
                      </div>
                      {readingLayout === 'parallel' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>

                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--slate-soft)] border-t border-b border-[var(--line)] mt-1">
                      Standalone Versions
                    </div>
                    <button
                      onClick={() => { onLayoutChange('tagalog'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'tagalog' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Filipino Only (Tagalog)</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">Ang Dating Biblia (1905)</span>
                      </div>
                      {readingLayout === 'tagalog' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                    <button
                      onClick={() => { onLayoutChange('cebuano'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'cebuano' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>Cebuano Only</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">Bugna Edition</span>
                      </div>
                      {readingLayout === 'cebuano' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                    <button
                      onClick={() => { onLayoutChange('english'); setShowLayoutMenu(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[var(--line)]/40 transition-colors cursor-pointer ${
                        readingLayout === 'english' ? 'bg-[#C9A227]/15 font-bold text-[var(--ink)]' : 'text-[var(--slate)]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>English Only</span>
                        <span className="text-[10px] text-[var(--slate-soft)]">King James Version (KJV)</span>
                      </div>
                      {readingLayout === 'english' && <Check className="w-4 h-4 text-[#C9A227]" />}
                    </button>
                  </div>
                )}
              </div>

              <button
                id="search-toggle-btn"
                onClick={onOpenSearch}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer"
                title="Search Verses & Chapters (Ctrl+K / ⌘K)"
                aria-label="Search Bible"
              >
                <Search className="w-4 h-4" />
              </button>

            <button
              id="bookmarks-drawer-toggle-btn"
              onClick={onOpenBookmarks}
              className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer"
              title="Bookmarks, Highlights & Notes"
              aria-label="View Saved Items"
            >
              <BookmarkIcon className="w-4 h-4" />
              {totalSaved > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#C9A227] text-[9px] font-bold text-white flex items-center justify-center shadow">
                  {totalSaved}
                </span>
              )}
            </button>
          </>
        )}
      </div>
      </div>
    </header>
  );
};

