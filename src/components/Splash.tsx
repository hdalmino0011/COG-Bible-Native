import React, { useEffect, useRef, useState } from 'react';
import { EMBEDDED_LOGO_DATA_URI } from '../data/logoAsset';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  // Stages:
  // 'black'   -> Initial pure black screen for exactly 1.5 seconds (1500ms)
  // 'visible' -> Smooth fade-in and stays for at least 3.5 seconds (3500ms) for comfortable user readability
  // 'fading'  -> Smooth 700ms GPU fade-out transition into the app
  const [stage, setStage] = useState<'black' | 'visible' | 'fading'>('black');

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const blackScreenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeOutTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerFadeOut = () => {
    if (stage === 'fading') return;
    setStage('fading');
    // Allow 700ms for silky smooth GPU opacity fade out before removing component
    fadeOutTimerRef.current = setTimeout(() => {
      onCompleteRef.current();
    }, 700);
  };

  useEffect(() => {
    // 1. First: Pure black screen for exactly 1.5 seconds (1500ms)
    blackScreenTimerRef.current = setTimeout(() => {
      setStage('visible');

      // 2. Second: Splash screen stays for at least 3.5 seconds (3500ms) while loading circles move
      stayTimerRef.current = setTimeout(() => {
        triggerFadeOut();
      }, 3500);
    }, 1500);

    return () => {
      if (blackScreenTimerRef.current) clearTimeout(blackScreenTimerRef.current);
      if (stayTimerRef.current) clearTimeout(stayTimerRef.current);
      if (fadeOutTimerRef.current) clearTimeout(fadeOutTimerRef.current);
    };
  }, []);

  const isVisible = stage === 'visible';
  const isFading = stage === 'fading';

  return (
    <div
      id="splash-screen"
      onClick={() => {
        // Allow tap-to-skip only after content has smoothly appeared
        if (isVisible) triggerFadeOut();
      }}
      style={{
        opacity: isFading ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isFading ? 'none' : 'auto',
        willChange: 'opacity',
        backgroundColor: '#000000'
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black px-6 text-center select-none cursor-pointer overflow-hidden transform-gpu"
    >
      {/* Background that smoothly transitions from black to deep church navy when content fades in */}
      <div
        style={{
          opacity: isVisible || isFading ? 1 : 0,
          transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity'
        }}
        className="absolute inset-0 bg-gradient-to-b from-[#061020] via-[#0A1832] to-[#122442] pointer-events-none"
      />

      {/* Main Content with buttery-smooth hardware-accelerated fade & subtle float intro */}
      <div
        style={{
          opacity: isVisible || isFading ? 1 : 0,
          transform: isVisible || isFading ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 14px, 0) scale(0.97)',
          transition: 'opacity 1.0s cubic-bezier(0.16, 1, 0.3, 1), transform 1.0s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: 'opacity, transform'
        }}
        className="relative z-10 flex flex-col items-center max-w-sm transform-gpu pointer-events-none"
      >
        {/* Emblem logo with crisp gold border badge */}
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

        {/* Silky smooth loading circles wave */}
        <div className="flex items-center gap-2.5 mt-8" aria-label="Loading application">
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '-0.32s',
              willChange: 'transform, opacity'
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '-0.16s',
              willChange: 'transform, opacity'
            }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full bg-[#E4C765] shadow-[0_0_8px_rgba(228,199,101,0.6)]"
            style={{
              animation: 'smoothPulse 1.4s ease-in-out infinite both',
              animationDelay: '0s',
              willChange: 'transform, opacity'
            }}
          />
        </div>
      </div>
    </div>
  );
};
