import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  speakSlow: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (!window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Load voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Voices may not be immediately available
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Get preferred English voice (US English preferred)
  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | undefined => {
    if (voices.length === 0) return undefined;

    // Priority order for voice selection
    const preferredVoices = [
      // US English voices
      voices.find(v => v.lang === 'en-US' && v.name.includes('Samantha')),
      voices.find(v => v.lang === 'en-US' && v.name.includes('Alex')),
      voices.find(v => v.lang === 'en-US' && v.localService),
      voices.find(v => v.lang === 'en-US'),
      // UK English fallback
      voices.find(v => v.lang === 'en-GB'),
      // Any English voice
      voices.find(v => v.lang.startsWith('en')),
      // Default to first available
      voices[0]
    ];

    return preferredVoices.find(v => v !== undefined);
  }, [voices]);

  const speakWithRate = useCallback((text: string, rate: number) => {
    if (!isSupported || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Configure voice settings
    const voice = getPreferredVoice();
    if (voice) {
      utterance.voice = voice;
    }
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  }, [isSupported, getPreferredVoice]);

  const speak = useCallback((text: string) => {
    speakWithRate(text, 1);
  }, [speakWithRate]);

  const speakSlow = useCallback((text: string) => {
    speakWithRate(text, 0.7);
  }, [speakWithRate]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    speakSlow,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
};
