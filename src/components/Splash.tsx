import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface SplashProps {
  onComplete: () => void;
}

// Silky smooth easing curve for fluid mobile feel
const smoothEase = [0.16, 1, 0.3, 1] as const;

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  // 1. Initial 1.5-second pure black screen state
  const [showContent, setShowContent] = useState(false);
  // 2. Smooth fade-out state after at least 3 seconds of reading
  const [isFadingOut, setIsFadingOut] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const blackScreenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFadeOut = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    // Smooth 650ms GPU fade-out before calling onComplete
    setTimeout(() => {
      onCompleteRef.current();
    }, 650);
  };

  useEffect(() => {
    // Stage 1: All black screen for exactly 1.5 seconds (1500ms)
    blackScreenTimerRef.current = setTimeout(() => {
      setShowContent(true);

      // Stage 2: Splash screen stays for at least 3.0 seconds (3200ms) for comfortable user readability
      stayTimerRef.current = setTimeout(() => {
        triggerFadeOut();
      }, 3200);
    }, 1500);

    return () => {
      if (blackScreenTimerRef.current) clearTimeout(blackScreenTimerRef.current);
      if (stayTimerRef.current) clearTimeout(stayTimerRef.current);
    };
  }, []);

  return (
    <div
      id="splash-screen"
      onClick={() => {
        // Allow tap-to-skip only after content has appeared
        if (showContent) triggerFadeOut();
      }}
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        willChange: 'opacity',
        backgroundColor: '#000000'
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center select-none cursor-pointer overflow-hidden"
    >
      {/* Background that smoothly transitions from black to deep church navy when content fades in */}
      <div
        style={{
          opacity: showContent && !isFadingOut ? 1 : 0,
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity'
        }}
        className="absolute inset-0 bg-gradient-to-b from-[#061020] via-[#0A1832] to-[#122442]"
      />

      {/* Main Content with smooth coordinated fade-in intro */}
      <motion.div
        initial={false}
        animate={{
          opacity: showContent && !isFadingOut ? 1 : 0,
          y: showContent && !isFadingOut ? 0 : 16,
          scale: showContent && !isFadingOut ? 1 : 0.96
        }}
        transition={{
          duration: 0.85,
          ease: smoothEase
        }}
        className="relative z-10 flex flex-col items-center max-w-sm transform-gpu"
      >
        {/* Emblem logo with crisp gold border badge (halo removed as requested) */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
          <div className="relative w-full h-full rounded-full p-2 bg-[#0E2040]/90 border-2 border-[#E4C765] shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <img
              src={EMBEDDED_LOGO_DATA_URI}
              alt="COG (T.J.R) Bible Seal"
              className="w-full h-full object-contain rounded-full select-none pointer-events-none"
              draggable={false}
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
        </div>

        {/* Title & Organization */}
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-md">
          The Church of God
        </h1>

        <p className="text-[#E4C765] text-sm sm:text-base font-medium tracking-wider mt-1 drop-shadow-xs">
          (Truth, Justice, and Righteousness)
        </p>

        <p className="mt-2 text-xs text-white/75 tracking-widest uppercase font-light">
          Cebuano (Bugna) &amp; English (KJV)
        </p>

        {/* Restored Smooth Loading Circles (Horizontal line and halo removed) */}
        <div className="flex items-center gap-2.5 mt-8" aria-label="Loading application">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '-0.32s'
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '-0.16s'
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '0s'
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};
