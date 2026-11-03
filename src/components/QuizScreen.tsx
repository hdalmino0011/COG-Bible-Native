import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  Trophy,
  Flame,
  X,
  BookOpen,
  Sparkles,
  Layers,
  Sliders,
  Send
} from 'lucide-react';
import { QUIZ_QUESTIONS, isQuizAnswerCorrect } from '../data/quizQuestions';
import { QuizDifficulty, QuizQuestion, QuizQuestionType, QuizStats } from '../types';

interface QuizScreenProps {
  quizStats: QuizStats;
  onUpdateStats: (stats: QuizStats) => void;
  onNavigateToVerse?: (ref: string) => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  quizStats,
  onUpdateStats,
  onNavigateToVerse
}) => {
  // Lobby settings
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'old' | 'new'>('all');
  const [selectedType, setSelectedType] = useState<'all' | QuizQuestionType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | QuizDifficulty>('all');
  const [selectedCount, setSelectedCount] = useState<number | 'all'>(10);

  // Active quiz session states
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({});
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  // Calculate matching questions count for current lobby settings
  const getFilteredPool = () => {
    return QUIZ_QUESTIONS.filter((q) => {
      const matchCat = selectedCategory === 'all' || q.category === selectedCategory;
      const matchType = selectedType === 'all' || q.type === selectedType;
      const matchDiff = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
      return matchCat && matchType && matchDiff;
    });
  };

  const matchingPoolCount = getFilteredPool().length;

  // Filter, shuffle, and slice questions for session
  const handleStartQuiz = () => {
    let pool = getFilteredPool();

    // Graceful fallback if too narrow
    if (pool.length === 0) {
      pool = QUIZ_QUESTIONS;
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    // Limit count based on user selection
    const count = selectedCount === 'all' ? shuffled.length : Math.min(Number(selectedCount), shuffled.length);
    const chosen = shuffled.slice(0, count);

    setCurrentQuestions(chosen);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setUserAnswers({});
    setSessionCorrectCount(0);
    setIsQuizFinished(false);
    setIsQuizActive(true);
  };

  // Sync state when moving between questions
  const currentQ = currentQuestions[currentIndex];

  useEffect(() => {
    if (!currentQ) return;
    const existing = userAnswers[currentIndex];
    if (currentQ.type === 'identification') {
      setTypedAnswer(typeof existing === 'string' ? existing : '');
      setSelectedOption(null);
    } else {
      setSelectedOption(typeof existing === 'number' ? existing : null);
      setTypedAnswer('');
    }
  }, [currentIndex, currentQ]);

  // Proceed to next question or finalize quiz
  const handleNextQuestion = () => {
    if (!currentQ) return;

    let answerValue: string | number;
    if (currentQ.type === 'identification') {
      if (!typedAnswer.trim()) return;
      answerValue = typedAnswer.trim();
    } else {
      if (selectedOption === null) return;
      answerValue = selectedOption;
    }

    const newAnswers = { ...userAnswers, [currentIndex]: answerValue };
    setUserAnswers(newAnswers);

    if (currentIndex + 1 < currentQuestions.length) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
    } else {
      // Finalize Quiz: Calculate score and update stats
      let correct = 0;
      currentQuestions.forEach((q, idx) => {
        const uAns = newAnswers[idx];
        if (isQuizAnswerCorrect(uAns, q)) {
          correct++;
        }
      });

      setSessionCorrectCount(correct);
      setIsQuizFinished(true);

      const isAllOrMajority = correct >= Math.ceil(currentQuestions.length / 2);
      const newStreak = isAllOrMajority ? quizStats.streak + 1 : 0;
      const newBest = Math.max(quizStats.bestStreak, newStreak);

      onUpdateStats({
        total: quizStats.total + currentQuestions.length,
        correct: quizStats.correct + correct,
        streak: newStreak,
        bestStreak: newBest
      });

      try {
        if (correct > 0) {
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 }
          });
        }
      } catch (e) {}
    }
  };

  const handleRestart = () => {
    setIsQuizActive(false);
    setIsQuizFinished(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer('');
    setUserAnswers({});
  };

  const accuracy = quizStats.total > 0
    ? Math.round((quizStats.correct / quizStats.total) * 100)
    : 0;

  const getDifficultyBadge = (difficulty: QuizDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/80';
      case 'medium':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300/80';
      case 'hard':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-400/80';
      case 'difficult':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-300/80';
      default:
        return 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300';
    }
  };

  const getTypeBadge = (type: QuizQuestionType) => {
    switch (type) {
      case 'identification':
        return 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-300';
      case 'guess_the_book':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300';
    }
  };

  const getTypeLabel = (type: QuizQuestionType) => {
    switch (type) {
      case 'identification':
        return 'Identification';
      case 'guess_the_book':
        return 'Guess the Book';
      default:
        return 'Multiple Choice';
    }
  };

  const canProceed = currentQ?.type === 'identification'
    ? typedAnswer.trim().length > 0
    : selectedOption !== null;

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 max-w-2xl mx-auto w-full pb-28">
      {/* ================= 1. LOBBY VIEW (When Quiz is NOT active) ================= */}
      {!isQuizActive && !isQuizFinished && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Header Card */}
          <div className="bg-gradient-to-r from-[#10203D] via-[#1B3A6B] to-[#2C548F] rounded-2xl p-5 sm:p-6 text-white text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#C9A227]/20 border border-[#E4C765] flex items-center justify-center mb-2.5">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[#E4C765]" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">Bible Knowledge Challenge</h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md leading-relaxed">
                Test your knowledge of the Holy Scriptures. 100% Biblical questions with Scripture references.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-3 text-center shadow-xs">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-[#1B3A6B] dark:text-[#E4C765]">
                {quizStats.total}
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Answered
              </span>
            </div>

            <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-3 text-center shadow-xs">
              <span className="block font-serif text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {accuracy}%
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Accuracy
              </span>
            </div>

            <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-xl p-3 text-center shadow-xs">
              <div className="flex items-center justify-center gap-1 font-serif text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />
                {quizStats.streak}
              </div>
              <span className="text-[10px] sm:text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Streak
              </span>
            </div>
          </div>

          {/* Settings Section: Quiz Controls */}
          <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            {/* Setting 1: Question Format / Type */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--slate-soft)] tracking-wider mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#C9A227]" />
                Quiz Format / Type:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Formats' },
                  { id: 'multiple_choice', label: 'Multiple Choice' },
                  { id: 'identification', label: 'Identification' },
                  { id: 'guess_the_book', label: 'Guess the Book' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedType(opt.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedType === opt.id
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-xs'
                        : 'bg-[var(--paper)] text-[var(--slate)] border-[var(--line)] hover:border-[#C9A227]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 2: Difficulty Mode */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--slate-soft)] tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                Difficulty Mode:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { id: 'all', label: 'Any / Mixed' },
                  { id: 'easy', label: 'Easy' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'hard', label: 'Hard' },
                  { id: 'difficult', label: 'Difficult' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedDifficulty(opt.id as any)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedDifficulty === opt.id
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-xs'
                        : 'bg-[var(--paper)] text-[var(--slate)] border-[var(--line)] hover:border-[#C9A227]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 3: Number of Questions */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase text-[var(--slate-soft)] tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-[#C9A227]" />
                Number of Questions:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[5, 10, 15, 20, 25, 'all'].map((count) => (
                  <button
                    key={String(count)}
                    onClick={() => setSelectedCount(count as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedCount === count
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-xs'
                        : 'bg-[var(--paper)] text-[var(--slate)] border-[var(--line)] hover:border-[#C9A227]'
                    }`}
                  >
                    {count === 'all' ? 'All' : `${count} Qs`}
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 4: Bible Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--slate-soft)] tracking-wider mb-2">
                Scripture Testament:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'All 66 Books' },
                  { id: 'old', label: 'Old Testament' },
                  { id: 'new', label: 'New Testament' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] shadow-xs'
                        : 'bg-[var(--paper)] text-[var(--slate)] border-[var(--line)] hover:border-[#C9A227]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Match summary indicator */}
            <div className="pt-2 text-center text-xs text-[var(--slate-soft)] border-t border-[var(--line)]">
              <span>Matching questions available: </span>
              <strong className="text-[#C9A227]">{matchingPoolCount} questions</strong>
            </div>
          </div>

          {/* Primary START Button */}
          <div className="pt-1">
            <button
              id="start-quiz-btn"
              onClick={handleStartQuiz}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#1B3A6B] to-[#3E6FB0] hover:from-[#10203D] hover:to-[#1B3A6B] text-white font-serif font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Bible Quiz</span>
            </button>
            <p className="text-center text-xs text-[var(--slate-soft)] mt-2">
              Identification and Guess the Book answers are case-insensitive.
            </p>
          </div>
        </motion.div>
      )}

      {/* ================= 2. ACTIVE QUIZ PLAY VIEW ================= */}
      {isQuizActive && !isQuizFinished && currentQ && (
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {/* Top Badges & Quit Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(currentQ.type)}`}>
                {getTypeLabel(currentQ.type)}
              </span>
              <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBadge(currentQ.difficulty)}`}>
                {currentQ.difficulty}
              </span>
              <span className="text-xs text-[var(--slate-soft)] font-medium pl-1">
                {currentIndex + 1} / {currentQuestions.length}
              </span>
            </div>

            <button
              onClick={handleRestart}
              className="px-2.5 py-1 rounded-lg border border-red-300/60 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-95 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Quit</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#1B3A6B] to-[#C9A227] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0E1B33] dark:text-white leading-snug">
              {currentQ.q}
            </h3>

            {/* A. If Identification: Render text input field */}
            {currentQ.type === 'identification' && (
              <div className="space-y-3 pt-2">
                <div className="relative">
                  <input
                    type="text"
                    value={typedAnswer}
                    autoFocus
                    onChange={(e) => setTypedAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && canProceed) {
                        e.preventDefault();
                        handleNextQuestion();
                      }
                    }}
                    placeholder="Type your answer here..."
                    className="w-full px-4 py-3 bg-[var(--ivory)] border border-[var(--line)] rounded-xl text-sm sm:text-base font-semibold text-[var(--ink)] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] shadow-xs"
                  />
                </div>
                <p className="text-xs text-[var(--slate-soft)] italic flex items-center gap-1">
                  <span>💡 Note: Not case sensitive (e.g. "moses", "Moses", or "MOSES" are all accepted).</span>
                </p>
              </div>
            )}

            {/* B. If Multiple Choice or Guess the Book with options */}
            {currentQ.type !== 'identification' && currentQ.options && (
              <div className="space-y-2.5 pt-1">
                {currentQ.options.map((option, index) => {
                  const isSelected = selectedOption === index;

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedOption(index)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#1B3A6B] dark:border-[#C9A227] bg-[#1B3A6B]/10 dark:bg-[#C9A227]/15 text-[#1B3A6B] dark:text-amber-200 font-semibold shadow-xs ring-1 ring-[#1B3A6B] dark:ring-[#C9A227]'
                          : 'bg-gray-50 dark:bg-slate-800/80 border-[#E2DED2] dark:border-[#22314E] text-gray-800 dark:text-gray-100 hover:border-[#C9A227]'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ml-2 ${
                          isSelected
                            ? 'border-[#1B3A6B] dark:border-[#C9A227] bg-[#1B3A6B] dark:bg-[#C9A227]'
                            : 'border-gray-300 dark:border-slate-600'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white dark:bg-[#0E1B33]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Next / Submit Button */}
            <div className="mt-5 pt-4 border-t border-[var(--line)] flex justify-end">
              <button
                disabled={!canProceed}
                onClick={handleNextQuestion}
                className="py-2.5 px-6 rounded-xl bg-[#1B3A6B] hover:bg-[#10203D] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>{currentIndex + 1 < currentQuestions.length ? 'Next Question' : 'Finish Quiz & View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= 3. QUIZ RESULTS & EXPLANATIONS SCREEN ================= */}
      {isQuizFinished && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Score Header Card */}
          <div className="bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] rounded-2xl p-6 sm:p-8 text-center shadow-lg space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#C9A227]/20 border-2 border-[#C9A227] flex items-center justify-center">
              <Award className="w-10 h-10 text-[#C9A227]" />
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0E1B33] dark:text-white">
                Quiz Completed!
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Here is your score and detailed scriptural verification
              </p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-[#E2DED2] dark:border-slate-700 max-w-sm mx-auto">
              <div className="font-serif text-4xl font-extrabold text-[#1B3A6B] dark:text-[#E4C765]">
                {sessionCorrectCount} / {currentQuestions.length}
              </div>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                {Math.round((sessionCorrectCount / (currentQuestions.length || 1)) * 100)}% Correct
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStartQuiz}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#1B3A6B] hover:bg-[#10203D] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
              </button>
              <button
                onClick={handleRestart}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Change Quiz Settings
              </button>
            </div>
          </div>

          {/* Section: Scripture Explanations & Reasons */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 px-1">
              <HelpCircle className="w-5 h-5 text-[#C9A227]" />
              <h3 className="font-serif font-bold text-base text-[var(--ink)]">
                Scriptural Answers &amp; Explanations Review
              </h3>
            </div>

            <div className="space-y-3.5">
              {currentQuestions.map((q, idx) => {
                const userChoice = userAnswers[idx];
                const isCorrect = isQuizAnswerCorrect(userChoice, q);

                // Format what user answered
                let userDisplayAnswer = 'No answer';
                if (userChoice !== undefined && userChoice !== null) {
                  if (typeof userChoice === 'number' && q.options && q.options[userChoice]) {
                    userDisplayAnswer = q.options[userChoice];
                  } else {
                    userDisplayAnswer = String(userChoice);
                  }
                }

                // Format canonical correct answer
                let canonicalAnswer = '';
                if (typeof q.answer === 'number' && q.options && q.options[q.answer]) {
                  canonicalAnswer = q.options[q.answer];
                } else {
                  canonicalAnswer = String(q.answer);
                }

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#142036] border border-[#E2DED2] dark:border-[#22314E] shadow-xs space-y-3"
                  >
                    {/* Question Header & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-2 py-0.5 rounded-md border border-[#C9A227]/20">
                          #{idx + 1}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(q.type)}`}>
                          {getTypeLabel(q.type)}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty}
                        </span>
                      </div>

                      {isCorrect ? (
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-bold shrink-0">
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect</span>
                        </div>
                      )}
                    </div>

                    {/* Question Prompt */}
                    <h4 className="font-serif font-bold text-sm sm:text-base text-[var(--ink)]">
                      {q.q}
                    </h4>

                    {/* Answers Comparison */}
                    <div className="p-3 rounded-xl bg-[var(--ivory)] border border-[var(--line)] text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[var(--slate-soft)]">Your Answer:</span>
                        <span className={`font-semibold ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'}`}>
                          {userDisplayAnswer}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="flex items-center justify-between pt-1 border-t border-[var(--line)]/50">
                          <span className="text-[var(--slate-soft)]">Correct Biblical Answer:</span>
                          <span className="font-bold text-[#1B3A6B] dark:text-[#E4C765]">
                            {canonicalAnswer}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    <p className="text-xs text-[var(--slate)] leading-relaxed italic border-l-2 border-[#C9A227] pl-2.5">
                      {q.explanation}
                    </p>

                    {/* Scripture Reference Link */}
                    {q.reference && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-[var(--slate-soft)]">
                          Reference: <strong className="text-[var(--ink)]">{q.reference}</strong>
                        </span>
                        {onNavigateToVerse && (
                          <button
                            onClick={() => onNavigateToVerse(q.reference)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B3A6B] dark:text-[#E4C765] hover:underline cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read in Bible</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
