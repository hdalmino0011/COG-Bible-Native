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

// Cache browser voices once loaded
let cachedWebVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const updateVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedWebVoices = v;
      }
    } catch {}
  };

  updateVoices();
  if ('onvoiceschanged' in window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }
}

// Female voice keywords to strictly avoid
const FEMALE_EXCLUSIONS = [
  'female', 'woman', 'girl', '#female', 'female_1', 'female_2', 'female_3',
  'zira', 'susan', 'samantha', 'karen', 'victoria', 'eva', 'hazel',
  'aria', 'jenny', 'heather', 'alice', 'catherine', 'fiona', 'moira',
  'tessa', 'veena', 'linda', 'amy', 'emma', 'joanna', 'kendra',
  'kimberly', 'salli', 'ivy', 'ava', 'stephanie', 'zoe', 'chloe',
  'serena', 'helena', 'laura', 'siri_female', 'female_standard'
];

// Wise man, elder, and male narrator identifiers
const WISE_MALE_KEYWORDS = [
  // High-fidelity wise narrator voices (Edge, Google, Apple)
  'christopher', 'guy', 'david', 'mark', 'daniel', 'alex', 'george',
  'james', 'john', 'matthew', 'thomas', 'richard', 'oliver', 'aaron',
  'paul', 'peter', 'steven', 'tom', 'fred', 'bruce', 'junior',
  'ralph', 'arthur', 'edward', 'charles', 'william', 'narrator',
  'elder', 'wise', 'deep', 'storyteller',
  // Android Google TTS male identifiers
  '#male', 'male_1', 'male_2', 'male_3', '-male', 'male',
  'iom', 'iob', 'tpd', 'iol', 'gpf',
  'wavenet-b', 'wavenet-d', 'wavenet-i', 'wavenet-j',
  // Samsung TTS male identifiers
  'smt-en-us-m', 'smt-en-m', 'male'
];

function isFemaleVoiceName(name: string): boolean {
  const lower = name.toLowerCase();
  return FEMALE_EXCLUSIONS.some(f => lower.includes(f));
}

function isWiseMaleVoiceName(name: string): boolean {
  const lower = name.toLowerCase();
  if (isFemaleVoiceName(lower)) return false;
  return WISE_MALE_KEYWORDS.some(m => lower.includes(m));
}

// Select a wise masculine/male voice from available voices
function getMaleVoice(voices: SpeechSynthesisVoice[], langTag: string): SpeechSynthesisVoice | null {
  const availableVoices = (voices && voices.length > 0) ? voices : cachedWebVoices;
  if (!availableVoices || availableVoices.length === 0) return null;

  const langPrefix = langTag.slice(0, 2).toLowerCase();
  const langVoices = availableVoices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  const candidatePool = langVoices.length > 0 ? langVoices : availableVoices;

  // 1. First priority: Voices explicitly marked as wise male or recognized male narrators matching language
  for (const kw of WISE_MALE_KEYWORDS) {
    const match = langVoices.find(v => {
      const n = v.name.toLowerCase();
      return n.includes(kw) && !isFemaleVoiceName(n);
    });
    if (match) return match;
  }

  // 2. Second priority: Any candidate from the broader pool matching wise male keywords
  for (const kw of WISE_MALE_KEYWORDS) {
    const match = candidatePool.find(v => {
      const n = v.name.toLowerCase();
      return n.includes(kw) && !isFemaleVoiceName(n);
    });
    if (match) return match;
  }

  // 3. Fallback: Filter out all female-sounding voices in language
  const nonFemaleLang = langVoices.filter(v => !isFemaleVoiceName(v.name));
  if (nonFemaleLang.length > 0) return nonFemaleLang[0];

  // 4. Broader non-female fallback
  const nonFemaleAny = candidatePool.filter(v => !isFemaleVoiceName(v.name));
  if (nonFemaleAny.length > 0) return nonFemaleAny[0];

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

  // Wise Man Reader Voice Calibration:
  // - Pitch: 0.76 (deep, warm, dignified baritone resonance of a wise elder)
  // - Rate: 0.88 (smooth, deliberate, reverent scripture narration)
  const WISE_MAN_PITCH = 0.76;
  const WISE_MAN_RATE = 0.88;

  // 1. Try Native Capacitor TTS first
  try {
    if (Capacitor.isNativePlatform()) {
      let maleVoiceIndex: number | undefined;
      try {
        const supported = await TextToSpeech.getSupportedVoices();
        if (supported?.voices?.length) {
          const langPrefix = langTag.slice(0, 2).toLowerCase();
          const voices = supported.voices;

          // Find best wise male voice index on Android
          // Step A: Wise male keyword in language
          let foundIdx = voices.findIndex(v => {
            const n = (v.name || '').toLowerCase();
            const l = (v.lang || '').toLowerCase();
            return l.startsWith(langPrefix) && isWiseMaleVoiceName(n);
          });

          // Step B: Wise male keyword in any voice
          if (foundIdx === -1) {
            foundIdx = voices.findIndex(v => isWiseMaleVoiceName(v.name || ''));
          }

          // Step C: Any non-female voice in language
          if (foundIdx === -1) {
            foundIdx = voices.findIndex(v => {
              const n = (v.name || '').toLowerCase();
              const l = (v.lang || '').toLowerCase();
              return l.startsWith(langPrefix) && !isFemaleVoiceName(n);
            });
          }

          if (foundIdx !== -1) {
            maleVoiceIndex = foundIdx;
          }
        }
      } catch (err) {
        console.warn('Could not query native voices list:', err);
      }

      await TextToSpeech.speak({
        text,
        lang: langTag,
        rate: WISE_MAN_RATE,
        pitch: WISE_MAN_PITCH, // Resonant baritone of a wise elder
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
        utterance.rate = WISE_MAN_RATE;
        utterance.pitch = WISE_MAN_PITCH; // Warm wise baritone
        utterance.lang = langTag;

        let voices = window.speechSynthesis.getVoices?.() || [];
        if ((!voices || voices.length === 0) && cachedWebVoices.length > 0) {
          voices = cachedWebVoices;
        }

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
