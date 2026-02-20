import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { FeedbackReaction } from './FeedbackReaction';
import { getDailyPhonemeExercise, type MinimalPair, type PhonemeExercise as PhonemeExerciseData } from '../data/phonemeExercises';
import type { PhonemeResult, PhonemeSessionResult } from '../types';
import './PhonemeExercise.css';

interface PhonemeExerciseProps {
  dayNumber: number;
  onComplete: (result: PhonemeSessionResult) => void;
}

type RecordingTarget = 'word1' | 'word2' | null;

export const PhonemeExercise: React.FC<PhonemeExerciseProps> = ({
  dayNumber,
  onComplete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [recordingTarget, setRecordingTarget] = useState<RecordingTarget>(null);
  const [word1Transcription, setWord1Transcription] = useState('');
  const [word2Transcription, setWord2Transcription] = useState('');
  const [word1Recorded, setWord1Recorded] = useState(false);
  const [word2Recorded, setWord2Recorded] = useState(false);
  const [results, setResults] = useState<PhonemeResult[]>([]);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  // Track the latest interim transcript for fallback when final is empty
  const latestInterimRef = useRef('');

  const exercise: PhonemeExerciseData = getDailyPhonemeExercise(dayNumber);
  const currentPair: MinimalPair = exercise.pairs[currentPairIndex];
  const totalPairs = exercise.pairs.length;

  const { speak, speakSlow, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const handleTranscript = useCallback((transcript: string, _isFinal: boolean) => {
    setSpeechError(null);
    // Track interim results for real-time display and fallback
    setInterimTranscript(transcript);
    latestInterimRef.current = transcript;
  }, []);

  const handleSpeechError = useCallback((error: string) => {
    setSpeechError(error);
  }, []);

  const handleSpeechEnd = useCallback((finalTranscript: string) => {
    // Use final transcript if available, otherwise fall back to the latest interim
    const transcriptToUse = finalTranscript.trim() || latestInterimRef.current.trim();

    if (!transcriptToUse) {
      // No speech detected at all
      setSpeechError('No speech detected. Please try speaking closer to the microphone.');
      setRecordingTarget(null);
      setInterimTranscript('');
      return;
    }

    if (recordingTarget === 'word1') {
      setWord1Transcription(transcriptToUse);
      setWord1Recorded(true);
    } else if (recordingTarget === 'word2') {
      setWord2Transcription(transcriptToUse);
      setWord2Recorded(true);
    }
    setRecordingTarget(null);
    setInterimTranscript('');
    latestInterimRef.current = '';
  }, [recordingTarget]);

  const {
    isListening,
    isSupported: speechSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onSpeechEnd: handleSpeechEnd,
    onError: handleSpeechError,
  });

  // Track the previous recording target to handle fallback when hook doesn't call onSpeechEnd
  const prevRecordingTargetRef = useRef<RecordingTarget>(null);
  const wasListeningRef = useRef(false);

  // Effect to handle when recording stops without a finalized transcript
  useEffect(() => {
    // Detect transition from listening to not listening
    if (wasListeningRef.current && !isListening) {
      const target = prevRecordingTargetRef.current;
      const hasInterim = latestInterimRef.current.trim();

      // Check if we have an interim transcript but the word wasn't recorded
      if (target && hasInterim) {
        const wasRecorded = target === 'word1' ? word1Recorded : word2Recorded;

        if (!wasRecorded) {
          // The hook didn't call onSpeechEnd (no finalized result), use interim as fallback
          const transcriptToUse = hasInterim;

          if (target === 'word1') {
            setWord1Transcription(transcriptToUse);
            setWord1Recorded(true);
          } else {
            setWord2Transcription(transcriptToUse);
            setWord2Recorded(true);
          }

          setRecordingTarget(null);
          setInterimTranscript('');
          latestInterimRef.current = '';
          prevRecordingTargetRef.current = null;
        }
      }
    }

    wasListeningRef.current = isListening;
  }, [isListening, word1Recorded, word2Recorded]);

  // Update prevRecordingTargetRef when recordingTarget changes
  useEffect(() => {
    if (recordingTarget) {
      prevRecordingTargetRef.current = recordingTarget;
    }
  }, [recordingTarget]);

  const startExercise = () => {
    setExerciseStarted(true);
    setCurrentPairIndex(0);
    setResults([]);
    setExerciseCompleted(false);
    resetCurrentPair();
  };

  const resetCurrentPair = () => {
    setWord1Transcription('');
    setWord2Transcription('');
    setWord1Recorded(false);
    setWord2Recorded(false);
    setRecordingTarget(null);
    setSpeechError(null);
    setInterimTranscript('');
    latestInterimRef.current = '';
  };

  const handlePlayWord = (word: string) => {
    stop();
    speak(word);
  };

  const handlePlaySlow = (word: string) => {
    stop();
    speakSlow(word);
  };

  const handleRecord = (target: 'word1' | 'word2') => {
    if (isListening) {
      stopListening();
      return;
    }

    setRecordingTarget(target);
    if (target === 'word1') {
      setWord1Recorded(false);
    } else {
      setWord2Recorded(false);
    }
    startListening();
  };

  const handleTryAgain = (target: 'word1' | 'word2') => {
    if (target === 'word1') {
      setWord1Transcription('');
      setWord1Recorded(false);
    } else {
      setWord2Transcription('');
      setWord2Recorded(false);
    }
  };

  // Evaluate pronunciation using text similarity (same algorithm as PronunciationDrill)
  const evaluatePronunciation = (targetWord: string, spokenText: string): { score: number; isCorrect: boolean } => {
    const target = targetWord.toLowerCase().trim();
    const spoken = spokenText.toLowerCase().trim();

    // Exact match
    if (spoken === target) {
      return { score: 10, isCorrect: true };
    }

    // Check if target word is contained in spoken text
    if (spoken.includes(target)) {
      return { score: 9, isCorrect: true };
    }

    // Check if spoken text is contained in target (partial match)
    if (target.includes(spoken) && spoken.length > 2) {
      return { score: 7, isCorrect: true };
    }

    // Calculate similarity
    const maxLen = Math.max(target.length, spoken.length);
    let matches = 0;
    for (let i = 0; i < Math.min(target.length, spoken.length); i++) {
      if (target[i] === spoken[i]) matches++;
    }
    const similarity = matches / maxLen;

    if (similarity >= 0.8) {
      return { score: 8, isCorrect: true };
    } else if (similarity >= 0.6) {
      return { score: 6, isCorrect: false };
    } else if (similarity >= 0.4) {
      return { score: 4, isCorrect: false };
    }

    return { score: 3, isCorrect: false };
  };

  // Check if user confused the two words (said the wrong one)
  const checkConfusion = (
    word1: string,
    word2: string,
    transcription1: string,
    transcription2: string
  ): boolean => {
    const t1 = transcription1.toLowerCase().trim();
    const t2 = transcription2.toLowerCase().trim();
    const w1 = word1.toLowerCase();
    const w2 = word2.toLowerCase();

    // Check if word1 transcription contains word2 or vice versa
    const confused1 = t1.includes(w2) && !t1.includes(w1);
    const confused2 = t2.includes(w1) && !t2.includes(w2);

    return confused1 || confused2;
  };

  const handleNextPair = () => {
    // Evaluate current pair
    const eval1 = evaluatePronunciation(currentPair.word1, word1Transcription);
    const eval2 = evaluatePronunciation(currentPair.word2, word2Transcription);
    const confused = checkConfusion(currentPair.word1, currentPair.word2, word1Transcription, word2Transcription);

    const pairResult: PhonemeResult = {
      word1: currentPair.word1,
      word2: currentPair.word2,
      word1Score: eval1.score,
      word2Score: eval2.score,
      word1Transcription,
      word2Transcription,
      distinguishedCorrectly: eval1.isCorrect && eval2.isCorrect && !confused,
    };

    const newResults = [...results, pairResult];
    setResults(newResults);

    if (currentPairIndex < totalPairs - 1) {
      setCurrentPairIndex(prev => prev + 1);
      resetCurrentPair();
    } else {
      // Exercise complete
      const correctPairs = newResults.filter(r => r.distinguishedCorrectly).length;
      const avgScore = newResults.reduce((sum, r) => sum + (r.word1Score + r.word2Score) / 2, 0) / newResults.length;

      const sessionResult: PhonemeSessionResult = {
        soundPair: exercise.soundPair,
        totalPairs: totalPairs,
        correctPairs: correctPairs,
        averageScore: avgScore,
        results: newResults,
      };

      setExerciseCompleted(true);
      onComplete(sessionResult);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--warning)';
    return 'var(--error)';
  };

  // Feedback messages are currently not displayed but could be used in future enhancement
  // const getFeedbackMessage = (score: number): string => {
  //   if (score >= 9) return 'Excellent pronunciation!';
  //   if (score >= 8) return 'Very good! Clear pronunciation.';
  //   if (score >= 7) return 'Good attempt. Keep practicing.';
  //   if (score >= 6) return 'Fair. Try listening again.';
  //   if (score >= 4) return 'Keep practicing. Listen to the slow version.';
  //   return 'Try again. Focus on the mouth position.';
  // };

  if (!ttsSupported || !speechSupported) {
    return (
      <div className="phoneme-exercise">
        <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>Phoneme Exercise - {exercise.displayName}</h3>
          <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
        </div>
        {isExpanded && (
          <div className="practice-content">
            <div className="not-supported">
              <p>Your browser doesn't support speech features required for phoneme exercises.</p>
              <p>Please use Chrome or Edge for the best experience.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="phoneme-exercise">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Phoneme Exercise - {exercise.displayName}</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="practice-content">
          {!exerciseStarted ? (
            <div className="exercise-intro">
              <p className="exercise-description">{exercise.description}</p>
              <div className="exercise-tip">
                <strong>Tip:</strong> {exercise.tip}
              </div>
              <div className="exercise-stats">
                <span className="stat-item">{totalPairs} word pairs to practice</span>
              </div>
              <button className="btn-primary start-exercise-btn" onClick={startExercise}>
                Start Exercise
              </button>
            </div>
          ) : exerciseCompleted ? (
            <div className="exercise-complete">
              <div className="complete-icon">✓</div>
              <h4>Exercise Complete!</h4>
              <div className="final-stats">
                <div className="stat-box">
                  <span className="stat-value">{results.filter(r => r.distinguishedCorrectly).length}/{totalPairs}</span>
                  <span className="stat-label">Pairs Correct</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value" style={{ color: getScoreColor(results.reduce((sum, r) => sum + (r.word1Score + r.word2Score) / 2, 0) / results.length) }}>
                    {(results.reduce((sum, r) => sum + (r.word1Score + r.word2Score) / 2, 0) / results.length).toFixed(1)}/10
                  </span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>
              <div className="results-summary">
                {results.map((result, index) => (
                  <div key={index} className={`result-pair ${result.distinguishedCorrectly ? 'correct' : 'incorrect'}`}>
                    <div className="result-pair-header">
                      <span className="pair-words">{result.word1} / {result.word2}</span>
                      <span className={`pair-status ${result.distinguishedCorrectly ? 'success' : 'error'}`}>
                        {result.distinguishedCorrectly ? '✓ Distinguished' : '✗ Needs Practice'}
                      </span>
                    </div>
                    <div className="result-pair-scores">
                      <div className="word-result">
                        <span className="word-label">{result.word1}:</span>
                        <span className="word-score" style={{ color: getScoreColor(result.word1Score) }}>{result.word1Score}/10</span>
                        <span className="word-said">"{result.word1Transcription}"</span>
                      </div>
                      <div className="word-result">
                        <span className="word-label">{result.word2}:</span>
                        <span className="word-score" style={{ color: getScoreColor(result.word2Score) }}>{result.word2Score}/10</span>
                        <span className="word-said">"{result.word2Transcription}"</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <FeedbackReaction dayNumber={dayNumber} section="Phoneme Exercise" />

              <button className="btn-secondary" onClick={startExercise}>
                Practice Again
              </button>
            </div>
          ) : (
            <div className="exercise-active">
              <div className="progress-indicator">
                <span>Pair {currentPairIndex + 1} / {totalPairs}</span>
                <div className="progress-bar-mini">
                  <div
                    className="progress-fill-mini"
                    style={{ width: `${((currentPairIndex + 1) / totalPairs) * 100}%` }}
                  />
                </div>
              </div>

              <div className="word-pair-display">
                {/* Word 1 */}
                <div className={`word-card ${word1Recorded ? 'recorded' : ''}`}>
                  <div className="word-main">{currentPair.word1}</div>
                  <div className="word-phonetic">{currentPair.phonetic1}</div>
                  <div className="word-sentence">"{currentPair.sentence1}"</div>

                  <div className="word-listen-controls">
                    <button
                      className="listen-btn small"
                      onClick={() => handlePlayWord(currentPair.word1)}
                      disabled={isSpeaking || isListening}
                    >
                      <span className="btn-icon">▶</span> Listen
                    </button>
                    <button
                      className="listen-btn small slow"
                      onClick={() => handlePlaySlow(currentPair.word1)}
                      disabled={isSpeaking || isListening}
                    >
                      <span className="btn-icon">▶</span> Slow
                    </button>
                  </div>

                  <div className="word-record-section">
                    <button
                      className={`record-btn small ${recordingTarget === 'word1' && isListening ? 'recording' : ''}`}
                      onClick={() => handleRecord('word1')}
                      disabled={isSpeaking || (isListening && recordingTarget !== 'word1')}
                    >
                      {recordingTarget === 'word1' && isListening ? (
                        <>
                          <span className="pulse-ring" />
                          <span className="record-icon">■</span> Stop
                        </>
                      ) : (
                        <>
                          <span className="record-icon">🎤</span> Say "{currentPair.word1}"
                        </>
                      )}
                    </button>
                  </div>

                  {/* Show interim transcript while recording */}
                  {recordingTarget === 'word1' && isListening && interimTranscript && (
                    <div className="word-transcription interim">
                      <span className="transcription-label">Hearing:</span>
                      <span className="transcription-text">"{interimTranscript}"</span>
                    </div>
                  )}

                  {word1Recorded && (
                    <div className="word-transcription">
                      <span className="transcription-label">You said:</span>
                      <span className="transcription-text">"{word1Transcription}"</span>
                      <button className="try-again-btn" onClick={() => handleTryAgain('word1')}>
                        Try Again
                      </button>
                    </div>
                  )}
                </div>

                <div className="pair-divider">vs</div>

                {/* Word 2 */}
                <div className={`word-card ${word2Recorded ? 'recorded' : ''}`}>
                  <div className="word-main">{currentPair.word2}</div>
                  <div className="word-phonetic">{currentPair.phonetic2}</div>
                  <div className="word-sentence">"{currentPair.sentence2}"</div>

                  <div className="word-listen-controls">
                    <button
                      className="listen-btn small"
                      onClick={() => handlePlayWord(currentPair.word2)}
                      disabled={isSpeaking || isListening}
                    >
                      <span className="btn-icon">▶</span> Listen
                    </button>
                    <button
                      className="listen-btn small slow"
                      onClick={() => handlePlaySlow(currentPair.word2)}
                      disabled={isSpeaking || isListening}
                    >
                      <span className="btn-icon">▶</span> Slow
                    </button>
                  </div>

                  <div className="word-record-section">
                    <button
                      className={`record-btn small ${recordingTarget === 'word2' && isListening ? 'recording' : ''}`}
                      onClick={() => handleRecord('word2')}
                      disabled={isSpeaking || (isListening && recordingTarget !== 'word2')}
                    >
                      {recordingTarget === 'word2' && isListening ? (
                        <>
                          <span className="pulse-ring" />
                          <span className="record-icon">■</span> Stop
                        </>
                      ) : (
                        <>
                          <span className="record-icon">🎤</span> Say "{currentPair.word2}"
                        </>
                      )}
                    </button>
                  </div>

                  {/* Show interim transcript while recording */}
                  {recordingTarget === 'word2' && isListening && interimTranscript && (
                    <div className="word-transcription interim">
                      <span className="transcription-label">Hearing:</span>
                      <span className="transcription-text">"{interimTranscript}"</span>
                    </div>
                  )}

                  {word2Recorded && (
                    <div className="word-transcription">
                      <span className="transcription-label">You said:</span>
                      <span className="transcription-text">"{word2Transcription}"</span>
                      <button className="try-again-btn" onClick={() => handleTryAgain('word2')}>
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {speechError && (
                <div className="speech-error">
                  <p>{speechError}</p>
                  <button className="btn-secondary" onClick={() => setSpeechError(null)}>
                    Dismiss
                  </button>
                </div>
              )}

              {word1Recorded && word2Recorded && (
                <div className="pair-complete-actions">
                  <button className="btn-primary" onClick={handleNextPair}>
                    {currentPairIndex < totalPairs - 1 ? 'Next Pair' : 'Finish & See Results'} &rarr;
                  </button>
                </div>
              )}

              {/* Progress indicator for recorded pairs */}
              {results.length > 0 && (
                <div className="recorded-pairs">
                  <h4>Completed:</h4>
                  <div className="recorded-pairs-list">
                    {results.map((r, idx) => (
                      <span key={idx} className={`recorded-pair ${r.distinguishedCorrectly ? 'correct' : 'incorrect'}`}>
                        {r.word1}/{r.word2} {r.distinguishedCorrectly ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
