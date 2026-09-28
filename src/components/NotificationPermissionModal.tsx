import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Sparkles, BookOpen, Clock, X, Check } from 'lucide-react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onAllow: () => Promise<void>;
  onDismiss: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  isOpen,
  onAllow,
  onDismiss
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const handleAllowClick = async () => {
    setIsRequesting(true);
    try {
      await onAllow();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-white dark:bg-[#121E36] rounded-3xl shadow-2xl border border-[#E2DED2] dark:border-[#223354] overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Header Banner Background */}
          <div className="relative bg-gradient-to-br from-[#1B3A6B] via-[#142B50] to-[#0A1832] px-6 pt-7 pb-6 text-center text-white overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:16px_16px]" />

            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Emblem Icon with glowing gold ring */}
            <div className="relative mx-auto mb-3.5 w-18 h-18 rounded-2xl bg-white/10 p-1.5 ring-2 ring-[#C9A227]/60 shadow-lg flex items-center justify-center">
              <img
                src={EMBEDDED_LOGO_DATA_URI || './logo.png'}
                alt="COG Bible"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#C9A227] text-[#0E1B33] flex items-center justify-center shadow-md">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>

            <h2 className="font-serif font-bold text-xl tracking-tight text-white">
              Daily Scripture Notifications
            </h2>
            <p className="text-xs text-white/80 mt-1 max-w-xs mx-auto">
              The Church of God (Truth, Justice, and Righteousness)
            </p>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-4 text-left">
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              Would you like to receive random daily Bible verses in <span className="font-semibold text-[#1B3A6B] dark:text-[#E4C765]">Cebuano (Bugna)</span> & <span className="font-semibold text-[#1B3A6B] dark:text-[#E4C765]">English (KJV)</span> directly on your device?
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#182845] border border-gray-100 dark:border-[#223354]">
                <div className="p-2 rounded-lg bg-[#C9A227]/15 text-[#C9A227] shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                    Daily Random Scripture
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Fresh inspirational verses delivered right to your notification drawer.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#182845] border border-gray-100 dark:border-[#223354]">
                <div className="p-2 rounded-lg bg-[#1B3A6B]/15 text-[#1B3A6B] dark:text-[#8EAAD4] shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                    Instant Reading Jump
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Tap any notification to immediately open that chapter and verse.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#182845] border border-gray-100 dark:border-[#223354]">
                <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 block">
                    Custom Schedule
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    Change scheduled delivery time or turn off anytime in Settings.
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={handleAllowClick}
                disabled={isRequesting}
                className="flex-1 py-3 px-4 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] active:scale-98 text-[#0E1B33] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isRequesting ? (
                  <span>Requesting Permission...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Allow Notifications</span>
                  </>
                )}
              </button>

              <button
                onClick={onDismiss}
                disabled={isRequesting}
                className="py-3 px-4 rounded-xl border border-gray-200 dark:border-[#223354] hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer disabled:opacity-60"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
