import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';
import { VerseItem } from '../types';

let currentlySpeaking = false;
let cancelContinuousFlag = false;

export function isCurrentlySpeaking(): boolean {
  return currentlySpeaking;
}

export async function stopSpeakingVerse(): Promise<void> {
  cancelContinuousFlag = true;
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

// Select a masculine/male voice from available voices
function getMaleVoice(voices: SpeechSynthesisVoice[], langTag: string): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const langPrefix = langTag.slice(0, 2).toLowerCase();
  const langVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  const candidatePool = langVoices.length > 0 ? langVoices : voices;

  // 1. Explicit male keyword or standard male persona voice names
  const maleKeywords = [
    'male', 'david', 'mark', 'daniel', 'alex', 'george', 'guy', 'james',
    'john', 'matthew', 'thomas', 'richard', 'oliver', 'aaron', 'paul',
    'peter', 'steven', 'tom', 'fred', 'bruce', 'junior', 'ralph',
    'en-us-x-sfg#male_1', 'natural - english'
  ];

  for (const kw of maleKeywords) {
    const match = candidatePool.find(v => v.name.toLowerCase().includes(kw));
    if (match) return match;
  }

  // 2. Filter out female-sounding voices
  const femaleKeywords = [
    'female', 'woman', 'girl', 'zira', 'susan', 'samantha', 'karen',
    'victoria', 'eva', 'hazel', 'aria', 'jenny', 'heather', 'alice',
    'catherine', 'fiona', 'moira', 'tessa', 'veena'
  ];

  const nonFemale = candidatePool.filter(
    v => !femaleKeywords.some(fkw => v.name.toLowerCase().includes(fkw))
  );

  if (nonFemale.length > 0) return nonFemale[0];

  return candidatePool[0] || null;
}

export async function speakVerseText(
  text: string,
  language: 'cebuano' | 'english' = 'english',
  onComplete?: () => void
): Promise<{ success: boolean; message?: string }> {
  if (!text || text.trim().length === 0) {
    onComplete?.();
    return { success: false, message: 'No verse text to read' };
  }

  const langTag = language === 'cebuano' ? 'fil-PH' : 'en-US';
  currentlySpeaking = true;

  // 1. Try Native Capacitor TTS first
  try {
    if (Capacitor.isNativePlatform()) {
      let maleVoiceIndex: number | undefined;
      try {
        const supported = await TextToSpeech.getSupportedVoices();
        if (supported?.voices?.length) {
          const idx = supported.voices.findIndex(v => {
            const n = (v.name || '').toLowerCase();
            return (
              (n.includes('male') || n.includes('david') || n.includes('guy') || n.includes('george')) &&
              !n.includes('female')
            );
          });
          if (idx !== -1) {
            maleVoiceIndex = idx;
          }
        }
      } catch {}

      await TextToSpeech.speak({
        text,
        lang: langTag,
        rate: 0.95,
        pitch: 0.85, // Resonant male pitch
        volume: 1.0,
        voice: maleVoiceIndex
      });
      currentlySpeaking = false;
      onComplete?.();
      return { success: true };
    }
  } catch (nativeErr) {
    console.warn('Native TextToSpeech plugin failed, attempting browser fallback:', nativeErr);
  }

  // 2. Web Speech API fallback
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      return new Promise((resolve) => {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        utterance.pitch = 0.85; // Masculine resonance
        utterance.lang = langTag;

        const voices = window.speechSynthesis.getVoices?.() || [];
        const maleVoice = getMaleVoice(voices, langTag);
        if (maleVoice) {
          utterance.voice = maleVoice;
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

/**
 * Continuously read chapter verses one after another with male voice
 * until the whole chapter is completed or until stopSpeakingVerse() is called.
 */
export async function readChapterContinuously(
  verses: VerseItem[],
  startVerseNum: number,
  language: 'cebuano' | 'english',
  onVerseChange: (verseNum: number) => void,
  onFinished: () => void,
  onError?: (err: string) => void
): Promise<void> {
  await stopSpeakingVerse();
  cancelContinuousFlag = false;
  currentlySpeaking = true;

  if (!verses || verses.length === 0) {
    currentlySpeaking = false;
    onError?.('No verses found in chapter to read');
    return;
  }

  let startIndex = verses.findIndex(v => v.v === startVerseNum);
  if (startIndex === -1) startIndex = 0;

  let currentIndex = startIndex;

  const readNext = async () => {
    if (cancelContinuousFlag) {
      currentlySpeaking = false;
      return;
    }

    if (currentIndex >= verses.length) {
      currentlySpeaking = false;
      onFinished();
      return;
    }

    const currentVerse = verses[currentIndex];
    const text = language === 'cebuano' ? currentVerse.ceb : currentVerse.en;
    onVerseChange(currentVerse.v);

    const res = await speakVerseText(text, language, () => {
      if (!cancelContinuousFlag) {
        currentIndex++;
        // Natural breath pause between verses (300ms)
        setTimeout(() => {
          if (!cancelContinuousFlag) {
            readNext();
          }
        }, 300);
      }
    });

    if (!res.success) {
      currentlySpeaking = false;
      onError?.(res.message || 'Speech error');
    }
  };

  readNext();
}
