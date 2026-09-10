import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

let currentlySpeaking = false;

export async function stopSpeakingVerse(): Promise<void> {
  currentlySpeaking = false;
  try {
    if (Capacitor.isNativePlatform()) {
      await TextToSpeech.stop();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch (err) {
    console.warn('Error stopping speech synthesis:', err);
  }
}

export async function speakVerseText(
  text: string,
  language: 'cebuano' | 'english' = 'english',
  onComplete?: () => void
): Promise<{ success: boolean; message?: string }> {
  // Cancel any ongoing speech first
  await stopSpeakingVerse();

  if (!text || text.trim().length === 0) {
    return { success: false, message: 'No verse text to read' };
  }

  // Choose appropriate BCP-47 language tag
  // Tagalog/Filipino 'fil-PH' or 'tl-PH' is phonetic and works excellently for Cebuano on Android TTS
  const langTag = language === 'cebuano' ? 'fil-PH' : 'en-US';

  currentlySpeaking = true;

  // 1. Try Native Capacitor TTS first (works on Android native devices)
  try {
    if (Capacitor.isNativePlatform()) {
      await TextToSpeech.speak({
        text,
        lang: langTag,
        rate: 0.95,
        pitch: 1.0,
        volume: 1.0,
      });
      currentlySpeaking = false;
      onComplete?.();
      return { success: true };
    }
  } catch (nativeErr) {
    console.warn('Native TextToSpeech plugin failed, attempting browser fallback:', nativeErr);
  }

  // 2. Web Speech API fallback (for desktop/browser environments)
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.lang = langTag;

        // Try matching a voice if available
        const voices = window.speechSynthesis.getVoices?.() || [];
        if (voices.length > 0) {
          const match = voices.find(v => v.lang.startsWith(langTag.slice(0, 2)));
          if (match) utterance.voice = match;
        }

        utterance.onend = () => {
          currentlySpeaking = false;
          onComplete?.();
        };

        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          currentlySpeaking = false;
          onComplete?.();
        };

        window.speechSynthesis.speak(utterance);
        resolve({ success: true });
      });
    } catch (webErr: any) {
      console.error('Web SpeechSynthesis failed:', webErr);
      currentlySpeaking = false;
      return { success: false, message: webErr?.message || 'Speech synthesis failed to start' };
    }
  }

  currentlySpeaking = false;
  return {
    success: false,
    message: 'Speech synthesis is not available on this device'
  };
}

export function isCurrentlySpeaking(): boolean {
  return currentlySpeaking;
}
