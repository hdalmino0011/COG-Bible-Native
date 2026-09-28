import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface SplashProps {
  onComplete: () => void;
}

// Silky smooth easing curve for fluid native mobile feel
const smoothEase = [0.16, 1, 0.3, 1] as const;

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFadeOut = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    // Smooth 650ms GPU fade-out before calling onComplete
    setTimeout(() => {
      onCompleteRef.current();
    }, 650);
  };

  useEffect(() => {
    // Show splash for 2.8 seconds, then trigger the graceful fade out
    timeoutRef.current = setTimeout(triggerFadeOut, 2800);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      id="splash-screen"
      onClick={triggerFadeOut}
      style={{
        opacity: isFadingOut ? 0 : 1,
        transform: isFadingOut ? 'scale(1.02)' : 'scale(1)',
        transition: 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFadingOut ? 'none' : 'auto',
        willChange: 'opacity, transform',
        backgroundColor: '#0A1832'
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0A1832] bg-gradient-to-b from-[#071326] via-[#0A1832] to-[#122442] px-6 text-center select-none cursor-pointer overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{
          opacity: isFadingOut ? 0 : 1,
          scale: isFadingOut ? 1.02 : 1
        }}
        transition={{
          duration: 0.85,
          ease: smoothEase
        }}
        className="flex flex-col items-center max-w-sm transform-gpu"
      >
        {/* Emblem logo with serene luminous golden halo glow */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 flex items-center justify-center">
          {/* Soft ambient golden light wave */}
          <div
            className="absolute inset-0 rounded-full bg-[#C9A227]/20 blur-2xl transform-gpu scale-110 pointer-events-none"
            style={{
              animation: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          />

          {/* Golden border badge */}
          <div className="relative w-full h-full rounded-full p-2 bg-[#0E2040]/90 border border-[#E4C765]/80 shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex items-center justify-center">
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

        {/* Title & Organization with smooth coordinated fade */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: smoothEase }}
          className="flex flex-col items-center"
        >
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-md">
            The Church of God
          </h1>

          <p className="text-[#E4C765] text-sm sm:text-base font-medium tracking-wider mt-1 drop-shadow-xs">
            (Truth, Justice, and Righteousness)
          </p>

          <p className="mt-2 text-xs text-white/75 tracking-widest uppercase font-light">
            Cebuano (Bugna) &amp; English (KJV)
          </p>

          {/* Elegant luminous golden horizon beam */}
          <div className="relative mt-7 w-32 h-[2px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.3, ease: smoothEase }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E4C765] to-transparent origin-center"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
