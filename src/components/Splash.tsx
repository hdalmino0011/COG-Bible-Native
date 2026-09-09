import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface SplashProps {
  onComplete: () => void;
}

const smoothEase = [0.16, 1, 0.3, 1] as const;

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleFinish = () => {
    setVisible(false);
    setTimeout(() => {
      onCompleteRef.current();
    }, 500);
  };

  useEffect(() => {
    // Entrance animations finish at ~1.35s; stay for 3.1s after animation finishes (~4450ms total)
    const timer = setTimeout(handleFinish, 4450);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash-screen"
          onClick={handleFinish}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: smoothEase }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0A1832] via-[#142B50] to-[#1B3A6B] px-6 text-center select-none cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: smoothEase }}
            className="flex flex-col items-center max-w-sm"
          >
            {/* Emblem logo with golden halo */}
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#C9A227]/25 blur-2xl animate-pulse" />
              <img
                src={EMBEDDED_LOGO_DATA_URI}
                alt="COG (T.J.R) Bible Seal"
                className="relative w-full h-full object-contain rounded-full border-2 border-[#E4C765] shadow-2xl p-2 bg-[#142748]/80 transition-transform duration-300"
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
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: smoothEase }}
              className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-md"
            >
              The Church of God
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: smoothEase }}
              className="text-[#E4C765] text-sm sm:text-base font-medium tracking-wider mt-1.5"
            >
              (Truth, Justice, and Righteousness)
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: smoothEase }}
              className="mt-2 text-xs text-white/80 tracking-widest uppercase font-light"
            >
              Cebuano (Bugna) &amp; English (KJV)
            </motion.div>

            {/* Bouncing gold dots indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.5, ease: smoothEase }}
              className="flex items-center gap-2 mt-8"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E4C765] animate-bounce" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
