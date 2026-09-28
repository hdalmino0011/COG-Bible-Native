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

// Female voice keywords to strictly avoid across all platforms (Android TTS & Web Speech)
const FEMALE_EXCLUSIONS = [
  'female', 'woman', 'girl', '#female', 'female_1', 'female_2', 'female_3',
  'zira', 'susan', 'samantha', 'karen', 'victoria', 'eva', 'hazel',
  'aria', 'jenny', 'heather', 'alice', 'catherine', 'fiona', 'moira',
  'tessa', 'veena', 'linda', 'amy', 'emma', 'joanna', 'kendra',
  'kimberly', 'salli', 'ivy', 'ava', 'stephanie', 'zoe', 'chloe',
  'serena', 'helena', 'laura', 'siri_female', 'female_standard',
  '-fis', '_fis', '-f-', '_f_', '-fem', 'female_1-local'
];

// Wise man, elder, and male narrator identifiers
const WISE_MALE_KEYWORDS = [
  'christopher', 'guy', 'david', 'mark', 'daniel', 'alex', 'george',
  'james', 'john', 'matthew', 'thomas', 'richard', 'oliver', 'aaron',
  'paul', 'peter', 'steven', 'tom', 'fred', 'bruce', 'junior',
  'ralph', 'arthur', 'edward', 'charles', 'william', 'narrator',
  'elder', 'wise', 'deep', 'storyteller',
  '#male', 'male_1', 'male_2', 'male_3', '-male', '_male', 'male',
  '-rjs', '_rjs', 'rjs', // Google UK English distinguished male voice
  '-iom', '_iom', 'iom', // Google US English male
  '-iob', '_iob', 'iob', // Google US English male
  '-tpd', '_tpd', 'tpd', // Google US English male
  '-iol', '_iol', 'iol',
  '-gpf', '_gpf', 'gpf',
  'wavenet-b', 'wavenet-d', 'wavenet-i', 'wavenet-j',
  'smt-en-us-m', 'smt-en-m', 'en_us_male', 'en_gb_male'
];

export function isFemaleVoice(name: string, uri: string = ''): boolean {
  const combined = `${name || ''} ${uri || ''}`.toLowerCase();
  return FEMALE_EXCLUSIONS.some(f => combined.includes(f));
}

export function isWiseMaleVoice(name: string, uri: string = ''): boolean {
  if (isFemaleVoice(name, uri)) return false;
  const combined = `${name || ''} ${uri || ''}`.toLowerCase();
  return WISE_MALE_KEYWORDS.some(m => combined.includes(m));
}

// Select a wise masculine/male voice from available voices
function getMaleVoice(voices: SpeechSynthesisVoice[], langTag: string): SpeechSynthesisVoice | null {
  const availableVoices = (voices && voices.length > 0) ? voices : cachedWebVoices;
  if (!availableVoices || availableVoices.length === 0) return null;

  const langPrefix = langTag.slice(0, 2).toLowerCase();

  // 1. Highest priority: Explicit wise male narrator in target language
  for (const v of availableVoices) {
    const l = (v.lang || '').toLowerCase();
    if (l.startsWith(langPrefix) && isWiseMaleVoice(v.name, v.voiceURI)) {
      return v;
    }
  }

  // 2. Second priority: Any explicit wise male narrator in any English variant (US, UK, AU)
  for (const v of availableVoices) {
    const l = (v.lang || '').toLowerCase();
    if (l.startsWith('en') && isWiseMaleVoice(v.name, v.voiceURI)) {
      return v;
    }
  }

  // 3. Third priority: Any voice that is confirmed male in the system
  for (const v of availableVoices) {
    if (isWiseMaleVoice(v.name, v.voiceURI)) {
      return v;
    }
  }

  // 4. Fourth priority: Filter out any and all female-sounding voices in target language
  for (const v of availableVoices) {
    const l = (v.lang || '').toLowerCase();
    if (l.startsWith(langPrefix) && !isFemaleVoice(v.name, v.voiceURI)) {
      return v;
    }
  }

  // 5. Final fallback: Any non-female voice in English
  for (const v of availableVoices) {
    const l = (v.lang || '').toLowerCase();
    if (l.startsWith('en') && !isFemaleVoice(v.name, v.voiceURI)) {
      return v;
    }
  }

  return null;
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
  // - Pitch: 0.68 (deep, resonant, reverent baritone of a wise elder)
  // - Rate: 0.84 (steady, articulate, measured scripture pace)
  const WISE_MAN_PITCH = 0.68;
  const WISE_MAN_RATE = 0.84;

  // 1. Try Native Capacitor TTS first
  try {
    if (Capacitor.isNativePlatform()) {
      let maleVoiceIndex: number | undefined;
      try {
        const supported = await TextToSpeech.getSupportedVoices();
        if (supported?.voices?.length) {
          const langPrefix = langTag.slice(0, 2).toLowerCase();
          const voices = supported.voices;

          // Step A: Wise male voice in target language (checking BOTH name and voiceURI)
          let foundIdx = voices.findIndex(v => {
            const l = (v.lang || '').toLowerCase();
            return l.startsWith(langPrefix) && isWiseMaleVoice(v.name || '', v.voiceURI || '');
          });

          // Step B: Wise male voice in any English dialect
          if (foundIdx === -1) {
            foundIdx = voices.findIndex(v => {
              const l = (v.lang || '').toLowerCase();
              return l.startsWith('en') && isWiseMaleVoice(v.name || '', v.voiceURI || '');
            });
          }

          // Step C: Any voice anywhere with male identification
          if (foundIdx === -1) {
            foundIdx = voices.findIndex(v => isWiseMaleVoice(v.name || '', v.voiceURI || ''));
          }

          // Step D: Strictly non-female voice in target language
          if (foundIdx === -1) {
            foundIdx = voices.findIndex(v => {
              const l = (v.lang || '').toLowerCase();
              return l.startsWith(langPrefix) && !isFemaleVoice(v.name || '', v.voiceURI || '');
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
        lang: 'en-US', // Enforce US English locale so Android does not default to British female
        rate: WISE_MAN_RATE,
        pitch: WISE_MAN_PITCH, // Deep, dignified baritone of a wise man
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
        utterance.pitch = WISE_MAN_PITCH; // Deep elder baritone
        utterance.lang = 'en-US';

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
