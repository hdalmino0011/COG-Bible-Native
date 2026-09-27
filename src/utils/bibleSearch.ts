import { BIBLE_BOOKS, normalizeBookName, getBookInfo } from '../data/books';
import { BookChapters } from '../types';
import { getVerseCountForChapter } from '../data/chapterVerseCounts';

export interface DirectVerseRef {
  isReference: boolean;
  book: string;
  cebName: string;
  chapter: number;
  verse?: number;
  maxChapters: number;
  maxVerses: number;
  displayText: string;
}

export interface SearchVerseResult {
  book: string;
  cebName: string;
  chapter: number;
  verse: number;
  cebText: string;
  enText: string;
  matchType: 'ceb' | 'en' | 'both';
}

/**
 * Parses user input to see if it represents a direct Bible reference (English or Cebuano).
 * Examples:
 *   "Genesis 1:1", "Genesis 1", "Gen 1:1", "Gen 1.1", "Gen 1"
 *   "Juan 1:1", "Juan 3:16", "San Juan 1:1", "Jn 1:1"
 *   "Bugna 21:4", "Bugna 1", "Rev 21:4"
 *   "Salmo 23:1", "Mga Salmo 23:1", "Salmo 23"
 *   "1 Timoteo 3:15", "1 Tim 3:15", "1Cor 13:4", "1 Corinto 13:4"
 *   "Roma 8:28", "Rom 8:28", "Roma 8"
 */
export function parseDirectReference(rawInput: string): DirectVerseRef | null {
  if (!rawInput) return null;
  const input = rawInput.trim();
  if (input.length < 2) return null;

  // Pattern 1: Book Name followed by Chapter and optional Verse delimiter (: or . or space)
  // e.g. "Genesis 1:1", "Juan 3:16", "1 Corinto 13:4", "Bugna 21:4", "Salmo 23 1", "Genesis 1"
  const refPattern = /^(\d?\s*[a-zA-ZÀ-ÿ\s-]+?)(?:\s+|(?<=[a-zA-ZÀ-ÿ])(?=\d))(\d+)(?:[:.\s](\d+))?$/i;
  const match = input.match(refPattern);

  if (match) {
    const rawBookStr = match[1].trim();
    const rawChapter = parseInt(match[2], 10);
    const rawVerse = match[3] ? parseInt(match[3], 10) : undefined;

    const normalized = normalizeBookName(rawBookStr);
    if (normalized) {
      const bookInfo = getBookInfo(normalized);
      if (bookInfo && !isNaN(rawChapter) && rawChapter > 0) {
        const validChapter = Math.min(rawChapter, bookInfo.chapters);
        const maxVerses = getVerseCountForChapter(normalized, validChapter);
        const validVerse = rawVerse !== undefined ? Math.min(Math.max(1, rawVerse), maxVerses) : undefined;

        const displayText = validVerse
          ? `${bookInfo.name} ${validChapter}:${validVerse} (${bookInfo.cebName} ${validChapter}:${validVerse})`
          : `${bookInfo.name} ${validChapter} (${bookInfo.cebName} ${validChapter})`;

        return {
          isReference: true,
          book: bookInfo.name,
          cebName: bookInfo.cebName,
          chapter: validChapter,
          verse: validVerse,
          maxChapters: bookInfo.chapters,
          maxVerses,
          displayText
        };
      }
    }
  }

  // Pattern 2: User typed just the book name, e.g. "Genesis", "Juan", "Bugna", "Roma"
  const directBookNorm = normalizeBookName(input);
  if (directBookNorm) {
    const bookInfo = getBookInfo(directBookNorm);
    if (bookInfo) {
      const maxVerses = getVerseCountForChapter(bookInfo.name, 1);
      return {
        isReference: true,
        book: bookInfo.name,
        cebName: bookInfo.cebName,
        chapter: 1,
        verse: 1,
        maxChapters: bookInfo.chapters,
        maxVerses,
        displayText: `${bookInfo.name} 1:1 (${bookInfo.cebName} 1:1)`
      };
    }
  }

  return null;
}

/**
 * Searches the entire Bible (all 66 books) for matching words or phrases.
 * Supports both Cebuano and English text matching.
 */
export async function searchBibleAcrossBooks(
  query: string,
  getBookData: (bookName: string) => Promise<BookChapters | null>,
  signal?: AbortSignal,
  onProgress?: (results: SearchVerseResult[], scannedBooks: number) => void
): Promise<SearchVerseResult[]> {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];

  const results: SearchVerseResult[] = [];
  const maxResults = 120;

  for (let i = 0; i < BIBLE_BOOKS.length; i++) {
    if (signal?.aborted) break;

    const book = BIBLE_BOOKS[i];
    const data = await getBookData(book.name);

    if (data) {
      for (const [chStr, verses] of Object.entries(data)) {
        if (signal?.aborted) break;
        const ch = parseInt(chStr, 10);
        if (!Array.isArray(verses)) continue;

        for (const v of verses) {
          const matchCeb = v.ceb ? v.ceb.toLowerCase().includes(q) : false;
          const matchEn = v.en ? v.en.toLowerCase().includes(q) : false;

          if (matchCeb || matchEn) {
            results.push({
              book: book.name,
              cebName: book.cebName,
              chapter: ch,
              verse: v.v,
              cebText: v.ceb,
              enText: v.en,
              matchType: matchCeb && matchEn ? 'both' : matchCeb ? 'ceb' : 'en'
            });

            if (results.length >= maxResults) {
              if (onProgress) onProgress(results, i + 1);
              return results;
            }
          }
        }
      }
    }

    if (onProgress && (i % 3 === 0 || i === BIBLE_BOOKS.length - 1)) {
      onProgress([...results], i + 1);
    }
  }

  return results;
}
