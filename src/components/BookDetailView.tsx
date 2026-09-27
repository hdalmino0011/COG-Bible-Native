import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Compass, Calendar, User, Sparkles, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';
import { BIBLE_BOOKS, getBookInfo } from '../data/books';
import { BOOK_DESCRIPTIONS } from '../data/bookDescriptions';
import { getRandomNaturePhoto, NATURE_PHOTOS } from '../data/naturePhotos';
import { getVerseCountForChapter } from '../data/chapterVerseCounts';

interface BookDetailViewProps {
  bookName: string;
  onBack: () => void;
  onOpenChapterVerse: (book: string, chapter: number, verse: number) => void;
}

export const BookDetailView: React.FC<BookDetailViewProps> = ({
  bookName,
  onBack,
  onOpenChapterVerse
}) => {
  const bookInfo = useMemo(() => getBookInfo(bookName) || BIBLE_BOOKS[0], [bookName]);
  const bookDetail = useMemo(() => {
    return BOOK_DESCRIPTIONS[bookInfo.name] || {
      name: bookInfo.name,
      cebName: bookInfo.cebName,
      author: 'Inspired Author of God',
      authorCeb: 'Dinasig nga Magsusulat sa Dios',
      date: 'Biblical Period',
      theme: 'God\'s Holy Word and Covenant',
      themeCeb: 'Pulong sa Dios ug Pakigsaad',
      description: `${bookInfo.name} (${bookInfo.cebName}) is part of the sacred canon of Scripture, declaring the Truth, Justice, and Righteousness of God.`,
      descriptionCeb: `Ang ${bookInfo.cebName} maoy usa sa mga balaang basahon sa Balaang Kasulatan, nga nagpadayag sa Kamatuoran, Hustisya, ug Katarong sa Dios.`,
      keyVerse: `${bookInfo.name} 1:1`,
      keyVerseEn: 'In the beginning was the Word, and the Word was with God.',
      keyVerseCeb: 'Sa sinugdan mao na ang Pulong, ug ang Pulong uban sa Dios.'
    };
  }, [bookInfo]);

  // Random photo state initialized with a random seed
  const [photoIndex, setPhotoIndex] = useState(() => Math.floor(Math.random() * NATURE_PHOTOS.length));
  const currentPhoto = NATURE_PHOTOS[photoIndex % NATURE_PHOTOS.length];

  const handleShufflePhoto = () => {
    setPhotoIndex(prev => (prev + 1 + Math.floor(Math.random() * (NATURE_PHOTOS.length - 1))) % NATURE_PHOTOS.length);
  };

  // Dropdown states for Chapter and Verse
  const totalChapters = bookInfo.chapters || 1;
  const [selectedChapter, setSelectedChapter] = useState(1);
  const totalVerses = useMemo(() => {
    return getVerseCountForChapter(bookInfo.name, selectedChapter);
  }, [bookInfo.name, selectedChapter]);

  const [selectedVerse, setSelectedVerse] = useState(1);

  const handleChapterChange = (newCh: number) => {
    setSelectedChapter(newCh);
    const maxV = getVerseCountForChapter(bookInfo.name, newCh);
    if (selectedVerse > maxV) {
      setSelectedVerse(1);
    }
  };

  const handleReadNow = () => {
    onOpenChapterVerse(bookInfo.name, selectedChapter, selectedVerse);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--ivory)] text-[var(--slate)] overflow-y-auto">
      {/* Top Bar with Back Button */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[var(--paper)]/95 backdrop-blur-md border-b border-[var(--line)] shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-[#1B3A6B] dark:text-[#E4C765] hover:bg-[#C9A227]/10 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Books</span>
        </button>

        <div className="flex items-center gap-2 text-right">
          <span className="text-xs font-bold text-[#C9A227] tracking-wider uppercase">
            {bookInfo.testament === 'Old' ? 'Old Testament' : 'New Testament'}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#1B3A6B]/10 dark:bg-white/10 font-medium text-[var(--slate-soft)]">
            {bookInfo.category}
          </span>
        </div>
      </div>

      <div className="p-3.5 sm:p-6 max-w-3xl mx-auto w-full space-y-5 pb-24">
        {/* Book Header Titles */}
        <div className="flex items-baseline justify-between gap-2 border-b border-[var(--line)] pb-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--ink)] tracking-tight">
              {bookInfo.name}
            </h1>
            <p className="text-sm sm:text-base font-medium text-[#C9A227] mt-0.5">
              {bookInfo.cebName} • <span className="text-[var(--slate-soft)] text-xs sm:text-sm">{bookInfo.chapters} Chapters</span>
            </p>
          </div>
          <button
            onClick={handleShufflePhoto}
            className="flex items-center gap-1 text-[11px] font-medium text-[var(--slate-soft)] hover:text-[#1B3A6B] dark:hover:text-[#E4C765] bg-[var(--paper)] border border-[var(--line)] px-2.5 py-1.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
            title="Show another nature photograph"
          >
            <RefreshCw className="w-3 h-3 text-[#C9A227]" />
            <span>New Photo</span>
          </button>
        </div>

        {/* 1. Nature Photo Card */}
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative rounded-2xl overflow-hidden shadow-lg border border-[var(--line)] bg-[#10203D] group aspect-video sm:aspect-[21/9]"
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {/* Subtle dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3 sm:p-4 text-white">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#E4C765] font-semibold uppercase tracking-wider mb-1">
              <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{currentPhoto.location}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 italic font-serif">
              "{currentPhoto.caption}"
            </p>
          </div>
        </motion.div>

        {/* 2. Metadata Cards Grid (Author, Date, Category) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-[var(--paper)] rounded-xl border border-[var(--line)] shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#C9A227] font-bold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Author</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
              {bookDetail.author}
            </div>
            <div className="text-[10px] text-[var(--slate-soft)]">
              {bookDetail.authorCeb}
            </div>
          </div>

          <div className="p-3 bg-[var(--paper)] rounded-xl border border-[var(--line)] shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#C9A227] font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Date Written</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
              {bookDetail.date}
            </div>
            <div className="text-[10px] text-[var(--slate-soft)]">
              Approximate period
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3 bg-[var(--paper)] rounded-xl border border-[var(--line)] shadow-2xs">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#C9A227] font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Total Chapters</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
              {bookInfo.chapters} Chapters
            </div>
            <div className="text-[10px] text-[var(--slate-soft)]">
              {bookInfo.testament} Testament
            </div>
          </div>
        </div>

        {/* 3. Key Theme & Verse Callout */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#1B3A6B]/10 to-[#C9A227]/10 border border-[#C9A227]/30 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#1B3A6B] dark:text-[#E4C765] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Central Theme / Sentral nga Tema</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
            {bookDetail.theme}
          </p>
          <p className="text-xs text-[var(--slate-soft)] mt-0.5 italic">
            {bookDetail.themeCeb}
          </p>

          {bookDetail.keyVerse && (
            <div className="mt-3 pt-2.5 border-t border-[var(--line)]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#C9A227] mb-1">
                <span>Key Scripture: {bookDetail.keyVerse}</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-[var(--ink)]">
                "{bookDetail.keyVerseEn}"
              </p>
              <p className="text-[11px] sm:text-xs text-[var(--slate-soft)] mt-1 italic">
                "{bookDetail.keyVerseCeb}"
              </p>
            </div>
          )}
        </div>

        {/* 4. Book Description */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs space-y-3">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)] flex items-center gap-2">
            <span>About the Book of {bookInfo.name}</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-[var(--slate)] text-justify">
            {bookDetail.description}
          </p>
          <div className="pt-2 border-t border-[var(--line)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-1">
              Sa Pinulongang Cebuano
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-[var(--slate)] text-justify">
              {bookDetail.descriptionCeb}
            </p>
          </div>
        </div>

        {/* 5. Dropdown Menu to Choose Chapter & Verse */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[var(--paper)] border-2 border-[#C9A227]/40 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C9A227]" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--ink)]">
              Choose Chapter &amp; Verse to Read
            </h3>
          </div>
          <p className="text-xs text-[var(--slate-soft)]">
            Select the chapter and specific verse below to start reading immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Chapter Dropdown */}
            <div className="space-y-1">
              <label htmlFor="detail-chapter-select" className="block text-xs font-semibold text-[var(--slate-soft)] uppercase tracking-wider">
                Select Chapter (1 to {totalChapters})
              </label>
              <div className="relative">
                <select
                  id="detail-chapter-select"
                  value={selectedChapter}
                  onChange={(e) => handleChapterChange(Number(e.target.value))}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-sm font-bold text-[var(--ink)] focus:outline-none focus:border-[#C9A227] shadow-xs cursor-pointer"
                >
                  {Array.from({ length: totalChapters }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      Chapter {num}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#C9A227] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Verse Dropdown */}
            <div className="space-y-1">
              <label htmlFor="detail-verse-select" className="block text-xs font-semibold text-[var(--slate-soft)] uppercase tracking-wider">
                Select Verse (1 to {totalVerses})
              </label>
              <div className="relative">
                <select
                  id="detail-verse-select"
                  value={selectedVerse}
                  onChange={(e) => setSelectedVerse(Number(e.target.value))}
                  className="w-full appearance-none pl-3.5 pr-9 py-2.5 bg-[var(--paper)] border border-[var(--line)] rounded-xl text-sm font-bold text-[var(--ink)] focus:outline-none focus:border-[#C9A227] shadow-xs cursor-pointer"
                >
                  {Array.from({ length: totalVerses }, (_, i) => i + 1).map(vNum => (
                    <option key={vNum} value={vNum}>
                      Verse {vNum}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#C9A227] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Button: Read Now */}
          <button
            onClick={handleReadNow}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#1B3A6B] via-[#244A85] to-[#1B3A6B] hover:from-[#142B50] hover:to-[#142B50] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer border border-[#E4C765]/50"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#E4C765]" />
            <span>
              Read {bookInfo.name} {selectedChapter}:{selectedVerse} ({bookInfo.cebName} {selectedChapter}:{selectedVerse})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
