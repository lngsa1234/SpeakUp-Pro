import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionProps {
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onSpeechEnd?: (fullTranscript: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
}

// Global: track the single active recognition instance so we can tear it down
// before any other hook tries to start a new one.
let activeRecognition: SpeechRecognition | null = null;

function getSpeechRecognitionClass(): (new () => SpeechRecognition) | null {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export const useSpeechRecognition = ({
  onTranscript,
  onSpeechEnd,
  onError,
}: UseSpeechRecognitionProps): UseSpeechRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported] = useState(() => getSpeechRecognitionClass() !== null);
  const accumulatedTranscriptRef = useRef<string>('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  const onTranscriptRef = useRef(onTranscript);
  const onSpeechEndRef = useRef(onSpeechEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
    onSpeechEndRef.current = onSpeechEnd;
    onErrorRef.current = onError;
  }, [onTranscript, onSpeechEnd, onError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch { /* ignore */ }
        if (activeRecognition === recognitionRef.current) {
          activeRecognition = null;
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (isListeningRef.current) return;

    const SRClass = getSpeechRecognitionClass();
    if (!SRClass) {
      onErrorRef.current?.('Speech recognition is not supported in this browser.');
      return;
    }

    // Tear down any globally active recognition (from another hook)
    if (activeRecognition) {
      try { activeRecognition.abort(); } catch { /* ignore */ }
      activeRecognition = null;
    }

    // Tear down our own previous instance if any
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch { /* ignore */ }
    }

    // Create a fresh instance every time
    const recognition = new SRClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' ';
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      if (finalTranscript) {
        accumulatedTranscriptRef.current += finalTranscript;
        setTranscript(accumulatedTranscriptRef.current);
        onTranscriptRef.current(
          accumulatedTranscriptRef.current.trim() + ' ' + interimTranscript,
          false
        );
      } else if (interimTranscript) {
        const fullTranscript = accumulatedTranscriptRef.current + interimTranscript;
        onTranscriptRef.current(fullTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);

      // Don't surface aborted errors — they happen during intentional teardown
      if (event.error === 'aborted') return;

      let errorMessage = event.error;
      switch (event.error) {
        case 'service-not-allowed':
          errorMessage = 'Speech recognition service is not available. Please ensure you are using HTTPS or localhost, and try refreshing the page.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access was denied. Please allow microphone permissions and try again.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking closer to the microphone.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please connect a microphone and try again.';
          break;
        case 'network':
          errorMessage = 'Network error occurred. Please check your internet connection.';
          break;
      }

      onErrorRef.current?.(errorMessage);
      isListeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    activeRecognition = recognition;

    setTranscript('');
    accumulatedTranscriptRef.current = '';

    try {
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed:', e);
      onErrorRef.current?.('Failed to start recording. Please try again.');
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !isListeningRef.current) return;

    // Send the accumulated transcript before stopping
    const finalText = accumulatedTranscriptRef.current.trim();
    if (finalText && onSpeechEndRef.current) {
      onSpeechEndRef.current(finalText);
    }

    // Update state immediately
    isListeningRef.current = false;
    setIsListening(false);

    try {
      recognition.stop();
    } catch {
      try { recognition.abort(); } catch { /* ignore */ }
    }
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
  };
};
