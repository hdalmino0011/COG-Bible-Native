export type ScreenType = 'books' | 'bible' | 'lessons' | 'quiz' | 'dictionary' | 'bookmarks' | 'settings';

export type ReadingLayout =
  | 'parallel' // Cebuano + English
  | 'parallel-ceb-tag' // Cebuano + Filipino (Tagalog)
  | 'parallel-eng-tag' // English + Filipino (Tagalog)
  | 'cebuano' // Cebuano only
  | 'english' // English only
  | 'tagalog'; // Tagalog only

export type AppTheme = 'light' | 'dark' | 'blue';

export type FontFamily = 'Times' | 'ComicSans' | 'Arial' | 'PlusJakartaSans';

export type FontSize = 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';

export type HighlightColor = 'yellow' | 'pink' | 'green' | 'blue' | 'purple';

export interface VerseItem {
  v: number;
  en: string;
  ceb: string;
  tag?: string;
}

export type ChapterVerses = VerseItem[];

export interface BookChapters {
  [chapter: string]: ChapterVerses;
}

export interface BibleData {
  [book: string]: BookChapters;
}

export interface SavedHighlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: HighlightColor;
  timestamp: number;
  cebText: string;
  enText: string;
  tagText?: string;
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse?: number;
  title: string;
  timestamp: number;
}

export interface NoteItem {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
  updatedAt?: number;
}

export interface DictionaryArticleSection {
  heading: string;
  content: string;
}

export interface DictionaryExternalLink {
  label: string;
  url: string;
}

export interface DictionaryEntry {
  id: string;
  term: string;
  category: 'Divine Name' | 'False God' | 'Title' | 'Place' | 'Object' | 'Concept' | 'Doctrine' | 'Person' | 'Feast' | 'False Belief';
  shortDefinition: string;
  origin: string;
  references: string;
  article: {
    sections: DictionaryArticleSection[];
    bibleReferences: string[];
    externalLinks?: DictionaryExternalLink[];
  };
}

export type QuizQuestionType = 'multiple_choice' | 'identification' | 'guess_the_book';
export type QuizDifficulty = 'easy' | 'medium' | 'hard' | 'difficult';

export interface QuizQuestion {
  id: string;
  category: 'old' | 'new' | 'all';
  categoryLabel?: string;
  type: QuizQuestionType;
  difficulty: QuizDifficulty;
  q: string;
  options?: string[];
  answer: number | string;
  acceptableAnswers?: string[];
  explanation: string;
  reference: string;
}

export interface QuizStats {
  total: number;
  correct: number;
  streak: number;
  bestStreak: number;
  categoryScores?: Record<string, { total: number; correct: number }>;
}

export interface UserPreferences {
  theme: AppTheme;
  font: FontFamily;
  fontSize: FontSize;
  readingLayout: ReadingLayout;
  showVerseNumbers: boolean;
  useOriginalDivineName?: boolean;
  enableSpeechAutoplay?: boolean;
  dailyVerseNotification?: boolean;
  notificationTime?: string;
  lastNotificationDate?: string;
}
