import React, { useState, useCallback } from 'react';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { FeedbackReaction } from './FeedbackReaction';
import type { DrillItem, DrillResult } from '../types';
import './PronunciationDrill.css';

interface PronunciationDrillProps {
  items: DrillItem[];
  dayNumber: number;
  onComplete: (results: DrillResult[], averageScore: number) => void;
  onScoreUpdate?: (word: string, score: number) => void;
}

interface Attempt {
  word: string;
  transcription: string;
}

export const PronunciationDrill: React.FC<PronunciationDrillProps> = ({
  items,
  dayNumber,
  onComplete,
  onScoreUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [drillStarted, setDrillStarted] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);

  const { speak, speakSlow, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech();

  const handleTranscript = useCallback((transcript: string) => {
    setCurrentTranscription(transcript);
    setSpeechError(null);
  }, []);

  const handleSpeechError = useCallback((error: string) => {
    setSpeechError(error);
  }, []);

  const handleSpeechEnd = useCallback((finalTranscript: string) => {
    if (!finalTranscript.trim()) return;
    setCurrentTranscription(finalTranscript);
    setHasRecorded(true);
  }, []);

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

  const currentItem = items[currentIndex];
  const totalItems = items.length;

  const startDrill = () => {
    setDrillStarted(true);
    setCurrentIndex(0);
    setAttempts([]);
    setResults([]);
    setCurrentTranscription('');
    setDrillCompleted(false);
    setHasRecorded(false);
  };

  const handleRecord = () => {
    if (isListening) {
      stopListening();
    } else {
      setCurrentTranscription('');
      setHasRecorded(false);
      startListening();
    }
  };

  const handleTryAgain = () => {
    setCurrentTranscription('');
    setHasRecorded(false);
  };

  // Simple text comparison for pronunciation matching
  const evaluatePronunciation = (targetWord: string, spokenText: string): { score: number; isCorrect: boolean; feedback: string } => {
    const target = targetWord.toLowerCase().trim();
    const spoken = spokenText.toLowerCase().trim();

    // Exact match
    if (spoken === target) {
      return { score: 10, isCorrect: true, feedback: 'Perfect! Exact match.' };
    }

    // Check if target word is contained in spoken text
    if (spoken.includes(target)) {
      return { score: 9, isCorrect: true, feedback: 'Great job! Word recognized correctly.' };
    }

    // Check if spoken text is contained in target (partial match)
    if (target.includes(spoken) && spoken.length > 2) {
      return { score: 7, isCorrect: true, feedback: 'Good attempt. Try to pronounce the full word.' };
    }

    // Calculate similarity (simple Levenshtein-like approach)
    const maxLen = Math.max(target.length, spoken.length);
    let matches = 0;
    for (let i = 0; i < Math.min(target.length, spoken.length); i++) {
      if (target[i] === spoken[i]) matches++;
    }
    const similarity = matches / maxLen;

    if (similarity >= 0.8) {
      return { score: 8, isCorrect: true, feedback: 'Very close! Minor differences detected.' };
    } else if (similarity >= 0.6) {
      return { score: 6, isCorrect: false, feedback: 'Good effort. Listen again and try to match the pronunciation.' };
    } else if (similarity >= 0.4) {
      return { score: 4, isCorrect: false, feedback: 'Keep practicing. Try listening to the slow version.' };
    }

    return { score: 3, isCorrect: false, feedback: 'The word wasn\'t recognized. Listen carefully and try again.' };
  };

  const handleNextWord = () => {
    // Save current attempt
    const newAttempt: Attempt = {
      word: currentItem.word,
      transcription: currentTranscription,
    };
    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);

    // Move to next word or finish
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentTranscription('');
      setHasRecorded(false);
    } else {
      // All words recorded - evaluate locally without AI
      const drillResults: DrillResult[] = updatedAttempts.map(attempt => {
        const evaluation = evaluatePronunciation(attempt.word, attempt.transcription);
        return {
          word: attempt.word,
          transcription: attempt.transcription,
          score: evaluation.score,
          feedback: evaluation.feedback,
          isCorrect: evaluation.isCorrect,
        };
      });

      setResults(drillResults);

      // Update scores for each word
      if (onScoreUpdate) {
        drillResults.forEach(r => onScoreUpdate(r.word, r.score));
      }

      const avgScore = drillResults.reduce((sum, r) => sum + r.score, 0) / drillResults.length;
      setDrillCompleted(true);
      onComplete(drillResults, avgScore);
    }
  };

  const handlePlayWord = () => {
    stop();
    speak(currentItem.word);
  };

  const handlePlaySlow = () => {
    stop();
    speakSlow(currentItem.word);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--warning)';
    return 'var(--error)';
  };

  if (!ttsSupported || !speechSupported) {
    return (
      <div className="pronunciation-drill">
        <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>Pronunciation Drill</h3>
          <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
        </div>
        {isExpanded && (
          <div className="practice-content">
            <div className="not-supported">
              <p>Your browser doesn't support speech features required for pronunciation drills.</p>
              <p>Please use Chrome or Edge for the best experience.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="pronunciation-drill">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Pronunciation Drill</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="practice-content">
          {!drillStarted ? (
            <div className="drill-intro">
              <p className="drill-description">
                Practice pronouncing today's vocabulary words. Listen to the correct pronunciation,
                then record yourself saying each word. You'll get instant feedback based on speech recognition.
              </p>
              <div className="drill-stats">
                <span className="stat-item">{totalItems} words to practice</span>
              </div>
              <button className="btn-primary start-drill-btn" onClick={startDrill}>
                Start Pronunciation Drill
              </button>
            </div>
          ) : drillCompleted ? (
            <div className="drill-complete">
              <div className="complete-icon">✓</div>
              <h4>Drill Complete!</h4>
              <p className="final-score">
                Average Score: <span style={{ color: getScoreColor(results.reduce((sum, r) => sum + r.score, 0) / results.length) }}>
                  {(results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)}/10
                </span>
              </p>
              <div className="results-summary">
                {results.map((result, index) => (
                  <div key={index} className="result-item-detailed">
                    <div className="result-header">
                      <span className="result-word">{result.word}</span>
                      <span className="result-score" style={{ color: getScoreColor(result.score) }}>
                        {result.score}/10
                      </span>
                    </div>
                    <div className="result-transcription">You said: "{result.transcription}"</div>
                    <div className="result-feedback">{result.feedback}</div>
                  </div>
                ))}
              </div>
              <FeedbackReaction dayNumber={dayNumber} section="Pronunciation Drill" />

              <button className="btn-secondary" onClick={startDrill}>
                Practice Again
              </button>
            </div>
          ) : (
            <div className="drill-active">
              <div className="progress-indicator">
                <span>{currentIndex + 1} / {totalItems} words</span>
                <div className="progress-bar-mini">
                  <div
                    className="progress-fill-mini"
                    style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
                  />
                </div>
              </div>

              <div className="word-display">
                <div className="target-word">{currentItem.word}</div>
                {currentItem.phonetic && (
                  <div className="phonetic">{currentItem.phonetic}</div>
                )}
                <div className="word-definition">{currentItem.definition}</div>
                <div className="word-example">"{currentItem.example}"</div>
              </div>

              <div className="listen-controls">
                <button
                  className="listen-btn"
                  onClick={handlePlayWord}
                  disabled={isSpeaking}
                >
                  <span className="btn-icon">▶</span> Listen
                </button>
                <button
                  className="listen-btn slow"
                  onClick={handlePlaySlow}
                  disabled={isSpeaking}
                >
                  <span className="btn-icon">▶</span> Slow
                </button>
              </div>

              <div className="record-section">
                <button
                  className={`record-btn ${isListening ? 'recording' : ''}`}
                  onClick={handleRecord}
                >
                  {isListening ? (
                    <>
                      <span className="pulse-ring" />
                      <span className="record-icon">■</span> Stop Recording
                    </>
                  ) : (
                    <>
                      <span className="record-icon">🎤</span> Record Your Pronunciation
                    </>
                  )}
                </button>
              </div>

              {speechError && (
                <div className="speech-error">
                  <p>{speechError}</p>
                  <button className="btn-secondary" onClick={() => setSpeechError(null)}>
                    Dismiss
                  </button>
                </div>
              )}

              {currentTranscription && (
                <div className="transcription-preview">
                  <h4>You said:</h4>
                  <p className="transcription-text">"{currentTranscription}"</p>
                </div>
              )}

              {hasRecorded && currentTranscription && (
                <div className="action-buttons">
                  <button className="btn-secondary" onClick={handleTryAgain}>
                    Try Again
                  </button>
                  <button className="btn-primary" onClick={handleNextWord}>
                    {currentIndex < totalItems - 1 ? 'Next Word' : 'Finish & Get Results'} &rarr;
                  </button>
                </div>
              )}

              {/* Show recorded words progress */}
              {attempts.length > 0 && (
                <div className="recorded-words">
                  <h4>Recorded:</h4>
                  <div className="recorded-list">
                    {attempts.map((a, idx) => (
                      <span key={idx} className="recorded-word">
                        {a.word} ✓
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
