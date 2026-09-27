import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  BookOpen,
  ArrowRight,
  Sparkles,
  BookMarked,
  Loader2,
  ChevronRight,
  Filter,
  CheckCircle,
  Compass
} from 'lucide-react';
import { BIBLE_BOOKS, BibleBookInfo } from '../data/books';
import { BOOK_DESCRIPTIONS } from '../data/bookDescriptions';
import { parseDirectReference, searchBibleAcrossBooks, SearchVerseResult, DirectVerseRef } from '../utils/bibleSearch';
import { BookChapters } from '../types';

interface BooksLandingScreenProps {
  onSelectBook: (bookName: string) => void;
  onOpenDirectVerse: (bookName: string, chapter: number, verse?: number) => void;
  getBookData: (bookName: string) => Promise<BookChapters | null>;
}

export const BooksLandingScreen: React.FC<BooksLandingScreenProps> = ({
  onSelectBook,
  onOpenDirectVerse,
  getBookData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'Old' | 'New'>('all');

  // Search results state
  const [isSearching, setIsSearching] = useState(false);
  const [scannedBooksCount, setScannedBooksCount] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchVerseResult[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Parse direct verse reference (e.g. "Genesis 1:1", "Juan 1:1", "Bugna 21:4", "Salmo 23:1")
  const directRef: DirectVerseRef | null = useMemo(() => {
    return parseDirectReference(searchQuery);
  }, [searchQuery]);

  // Execute full-text search across all 66 books when query changes
  useEffect(() => {
    const trimmed = searchQuery.trim();

    // If query is empty or too short, reset search state
    if (!trimmed || trimmed.length < 2) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsSearching(false);
      setSearchResults([]);
      setScannedBooksCount(0);
      return;
    }

    // Cancel any ongoing search
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Debounce search slightly to keep typing snappy
    const timer = setTimeout(async () => {
      setIsSearching(true);
      setScannedBooksCount(0);

      try {
        const results = await searchBibleAcrossBooks(
          trimmed,
          getBookData,
          controller.signal,
          (partialResults, count) => {
            if (!controller.signal.aborted) {
              setSearchResults(partialResults);
              setScannedBooksCount(count);
            }
          }
        );

        if (!controller.signal.aborted) {
          setSearchResults(results);
          setIsSearching(false);
        }
      } catch {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, getBookData]);

  // Handle direct Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (directRef) {
        onOpenDirectVerse(directRef.book, directRef.chapter, directRef.verse);
      } else if (searchResults.length > 0) {
        const first = searchResults[0];
        onOpenDirectVerse(first.book, first.chapter, first.verse);
      }
    }
  };

  // Filtered books list for browse mode
  const filteredBooks = useMemo(() => {
    let list = BIBLE_BOOKS;
    if (testamentFilter !== 'all') {
      list = list.filter(b => b.testament === testamentFilter);
    }
    return list;
  }, [testamentFilter]);

  // Helper to highlight matched query words in search result text
  const renderHighlightedText = (text: string, queryStr: string) => {
    if (!queryStr || !text) return text;
    const cleanQ = queryStr.trim().toLowerCase();
    const parts = text.split(new RegExp(`(${cleanQ.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === cleanQ ? (
            <mark key={i} className="bg-[#C9A227]/30 text-[var(--ink)] font-bold px-0.5 rounded-xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const isSearchActive = searchQuery.trim().length >= 2;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--ivory)] text-[var(--slate)] overflow-y-auto">
      {/* 1. Header Hero / Search Banner */}
      <div className="bg-gradient-to-b from-[#142B50] via-[#1B3A6B] to-[#142B50] text-white px-4 py-4 sm:py-5 border-b border-[#C9A227]/30 shadow-md">
        <div className="max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h1 className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Books of the Bible</span>
              </h1>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Cebuano (Bugna) &amp; English (KJV) • The Church of God (T.J.R)
              </p>
            </div>
          </div>

          {/* Search Bar with live reference & whole bible search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#E4C765] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search word (e.g. sinugdan) or reference (e.g. Juan 1:1, Genesis 1:1)..."
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-[#10203D] placeholder-blue-200/70 focus:placeholder-gray-400 border border-white/20 focus:border-[#E4C765] text-xs sm:text-sm font-medium transition-all shadow-inner focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-full text-blue-200 hover:text-white focus:text-gray-600 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Direct Verse Match Card Banner */}
          {directRef && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-[#E4C765]/20 border border-[#E4C765] rounded-xl flex items-center justify-between gap-3 text-white backdrop-blur-xs shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-5 h-5 text-[#E4C765] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-white truncate">
                    Open {directRef.displayText}
                  </div>
                  <div className="text-[11px] text-[#E4C765]">
                    Direct Scripture Reference matched in English &amp; Cebuano
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenDirectVerse(directRef.book, directRef.chapter, directRef.verse)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A227] hover:bg-[#E4C765] text-[#10203D] rounded-lg text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all flex-shrink-0 cursor-pointer"
              >
                <span>Read Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content Area: Search Results OR List of Books */}
      <div className="max-w-3xl mx-auto w-full p-3 sm:p-5 space-y-4 pb-24">
        {/* VIEW A: Search Results View */}
        {isSearchActive ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] pb-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#C9A227]" />
                <h2 className="text-xs sm:text-sm font-bold text-[var(--ink)]">
                  Whole Bible Search Results for "{searchQuery}"
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--slate-soft)]">
                {isSearching ? (
                  <span className="flex items-center gap-1 text-[#C9A227]">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Searching ({scannedBooksCount}/66 books)...</span>
                  </span>
                ) : (
                  <span>{searchResults.length} verses found</span>
                )}
              </div>
            </div>

            {/* Direct reference prompt inside results list if applicable */}
            {directRef && (
              <div
                onClick={() => onOpenDirectVerse(directRef.book, directRef.chapter, directRef.verse)}
                className="p-3.5 bg-gradient-to-r from-[#1B3A6B] to-[#2C548F] text-white rounded-xl shadow-md border border-[#E4C765]/50 flex items-center justify-between cursor-pointer hover:opacity-95 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#E4C765]" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold">
                      Direct Match: {directRef.displayText}
                    </div>
                    <div className="text-[11px] text-blue-200">
                      Tap to open this chapter/verse directly in the reader
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E4C765]" />
              </div>
            )}

            {/* Results List */}
            {searchResults.length === 0 && !isSearching ? (
              <div className="p-8 text-center bg-[var(--paper)] rounded-2xl border border-[var(--line)] space-y-2">
                <Search className="w-8 h-8 text-[var(--slate-soft)] mx-auto opacity-50" />
                <div className="text-sm font-bold text-[var(--ink)]">
                  No matching verses found for "{searchQuery}"
                </div>
                <p className="text-xs text-[var(--slate-soft)] max-w-sm mx-auto">
                  Try checking the spelling or search another Cebuano (e.g. "sinugdan", "gugma", "katarong") or English word (e.g. "beginning", "love", "truth").
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {searchResults.map((res, idx) => (
                  <div
                    key={`${res.book}-${res.chapter}-${res.verse}-${idx}`}
                    onClick={() => onOpenDirectVerse(res.book, res.chapter, res.verse)}
                    className="p-3 sm:p-4 bg-[var(--paper)] hover:bg-[#C9A227]/[0.08] active:bg-[#C9A227]/[0.15] border border-[var(--line)] rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-xs sm:text-sm font-bold text-[#1B3A6B] dark:text-[#E4C765] group-hover:underline">
                          {res.book} {res.chapter}:{res.verse}
                        </span>
                        <span className="text-[11px] font-medium text-[var(--slate-soft)]">
                          ({res.cebName} {res.chapter}:{res.verse})
                        </span>
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B3A6B]/10 dark:bg-white/10 text-[var(--slate-soft)]">
                        Verse {res.verse}
                      </span>
                    </div>

                    {/* Dual language preview */}
                    <div className="space-y-1.5 text-xs sm:text-sm">
                      <div className="text-[var(--slate)] leading-relaxed">
                        <span className="text-[10px] font-bold text-[#C9A227] uppercase mr-1.5 select-none">
                          CEB
                        </span>
                        {renderHighlightedText(res.cebText, searchQuery)}
                      </div>
                      <div className="text-[var(--slate-soft)] leading-relaxed border-t border-[var(--line)]/50 pt-1">
                        <span className="text-[10px] font-bold text-[#C9A227] uppercase mr-1.5 select-none">
                          KJV
                        </span>
                        {renderHighlightedText(res.enText, searchQuery)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* VIEW B: Genesis to Revelation Books List View */
          <div className="space-y-3.5">
            {/* Filter Tabs (All, Old Testament, New Testament) */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-[var(--paper)] p-1 rounded-xl border border-[var(--line)] shadow-2xs">
                <button
                  onClick={() => setTestamentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    testamentFilter === 'all'
                      ? 'bg-[#1B3A6B] text-white shadow-xs'
                      : 'text-[var(--slate-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  All Books (66)
                </button>
                <button
                  onClick={() => setTestamentFilter('Old')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    testamentFilter === 'Old'
                      ? 'bg-[#1B3A6B] text-white shadow-xs'
                      : 'text-[var(--slate-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  Old Testament (39)
                </button>
                <button
                  onClick={() => setTestamentFilter('New')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    testamentFilter === 'New'
                      ? 'bg-[#1B3A6B] text-white shadow-xs'
                      : 'text-[var(--slate-soft)] hover:text-[var(--ink)]'
                  }`}
                >
                  New Testament (27)
                </button>
              </div>

              <span className="text-[11px] text-[var(--slate-soft)] hidden sm:inline">
                Tap any book for nature photo, author &amp; chapters
              </span>
            </div>

            {/* List of 66 Books */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredBooks.map((book, idx) => {
                const globalIndex = BIBLE_BOOKS.findIndex(b => b.name === book.name) + 1;
                const bookDetail = BOOK_DESCRIPTIONS[book.name];

                return (
                  <div
                    key={book.name}
                    onClick={() => onSelectBook(book.name)}
                    className="p-3 sm:p-3.5 bg-[var(--paper)] hover:bg-[#C9A227]/[0.08] active:bg-[#C9A227]/[0.15] border border-[var(--line)] hover:border-[#C9A227]/60 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Order number circle */}
                      <span className="w-8 h-8 rounded-full bg-[#1B3A6B]/10 dark:bg-white/10 text-[#1B3A6B] dark:text-[#E4C765] font-bold text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#C9A227] group-hover:text-white transition-colors">
                        {globalIndex}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-baseline gap-1.5 truncate">
                          <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--ink)] group-hover:text-[#1B3A6B] dark:group-hover:text-[#E4C765] transition-colors truncate">
                            {book.name}
                          </h3>
                          <span className="text-xs text-[#C9A227] font-medium truncate">
                            ({book.cebName})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-[var(--slate-soft)] mt-0.5 truncate">
                          <span>{book.chapters} Chapters</span>
                          <span>•</span>
                          <span className="truncate">Writer: {bookDetail?.author || book.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#1B3A6B]/5 dark:bg-white/5 text-[var(--slate-soft)] hidden xs:inline-block">
                        {book.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[#C9A227] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
