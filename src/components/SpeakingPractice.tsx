import React, { useState, useCallback, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { api } from '../services/api';
import { FeedbackReaction } from './FeedbackReaction';
import type { SpeakingEvaluation } from '../types';

interface SpeakingPracticeProps {
  prompt: string;
  dayNumber: number;
  vocabularyToUse: string[];
  phrasesToUse: string[];
  onComplete?: (evaluation: SpeakingEvaluation, userTranscription: string) => void;
  savedTranscription?: string;
  savedEvaluation?: SpeakingEvaluation | null;
  isAuthenticated?: boolean;
}

export const SpeakingPractice: React.FC<SpeakingPracticeProps> = ({
  prompt,
  dayNumber,
  vocabularyToUse,
  phrasesToUse,
  onComplete,
  savedTranscription,
  savedEvaluation,
  isAuthenticated = true,
}) => {
  const [transcription, setTranscription] = useState(savedTranscription || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(savedEvaluation || null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!savedEvaluation);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Sync state when saved props change (e.g., after loading from database or changing days)
  useEffect(() => {
    setTranscription(savedTranscription || '');
  }, [savedTranscription]);

  useEffect(() => {
    setEvaluation(savedEvaluation || null);
    setIsExpanded(!savedEvaluation);
  }, [savedEvaluation]);

  const handleTranscript = useCallback((transcript: string, _isFinal: boolean) => {
    setTranscription(transcript);
  }, []);

  const handleSpeechEnd = useCallback((fullTranscript: string) => {
    setTranscription(fullTranscript);
  }, []);

  const handleError = useCallback((errorMsg: string) => {
    setError(`Speech recognition error: ${errorMsg}`);
  }, []);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscript: handleTranscript,
    onSpeechEnd: handleSpeechEnd,
    onError: handleError,
  });

  const handleStartRecording = () => {
    setError(null);
    setTranscription('');
    setEvaluation(null);
    startListening();

    // Start timer
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handleStopRecording = () => {
    stopListening();

    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const handleSubmit = async () => {
    if (!transcription.trim()) {
      setError('No speech detected. Please try recording again.');
      return;
    }

    if (transcription.trim().split(/\s+/).length < 10) {
      setError('Please speak at least 10 words for a meaningful evaluation.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateSpeaking({
        transcription: transcription.trim(),
        prompt,
        dayNumber,
        vocabularyToUse,
        phrasesToUse,
      });

      setEvaluation(response.evaluation);
      onComplete?.(response.evaluation, transcription.trim());
    } catch (err) {
      setError('Failed to evaluate your speaking. Please try again.');
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setTranscription('');
    setEvaluation(null);
    setError(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--primary-color)';
    if (score >= 4) return 'var(--warning)';
    return 'var(--error)';
  };

  const wordCount = transcription.trim() ? transcription.trim().split(/\s+/).length : 0;

  if (!isSupported) {
    return (
      <div className="speaking-practice">
        <div className="practice-header">
          <h3>Speaking Practice</h3>
        </div>
        <div className="practice-content">
          <div className="error-message">
            Speech recognition is not supported in your browser. Please use Chrome or Edge.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="speaking-practice">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Speaking Practice</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="practice-content">
          <div className="prompt-section">
            <h4>Prompt</h4>
            <p className="prompt-text">{prompt}</p>
          </div>

          <div className="vocabulary-hint">
            <h4>Try to use these words/phrases:</h4>
            <div className="hint-tags">
              {vocabularyToUse.map((word, i) => (
                <span key={`vocab-${i}`} className="hint-tag vocab">{word}</span>
              ))}
              {phrasesToUse.slice(0, 3).map((phrase, i) => (
                <span key={`phrase-${i}`} className="hint-tag phrase">"{phrase}"</span>
              ))}
            </div>
          </div>

          {!evaluation ? (
            <>
              <div className="recording-section">
                <div className="recording-controls">
                  {!isListening ? (
                    <button
                      onClick={handleStartRecording}
                      className="record-btn start"
                      disabled={isEvaluating}
                    >
                      <span className="record-icon">🎤</span>
                      <span>Start Recording</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="record-btn stop"
                    >
                      <span className="pulse-ring"></span>
                      <span className="record-icon">⏹</span>
                      <span>Stop Recording</span>
                    </button>
                  )}
                </div>

                {isListening && (
                  <div className="recording-status">
                    <span className="recording-indicator">Recording...</span>
                    <span className="recording-time">{formatTime(recordingTime)}</span>
                  </div>
                )}

                {transcription && (
                  <div className="transcription-preview">
                    <h4>What we heard:</h4>
                    <p className="transcription-text">{transcription}</p>
                    <div className="word-count">
                      {wordCount} words {wordCount < 10 && <span className="hint">(minimum 10)</span>}
                    </div>
                  </div>
                )}
              </div>

              {error && <div className="error-message">{error}</div>}

              {transcription && !isListening && (
                <div className="submit-section">
                  {isAuthenticated ? (
                    <button
                      onClick={handleSubmit}
                      disabled={isEvaluating || wordCount < 10}
                      className="btn-primary submit-btn"
                    >
                      {isEvaluating ? 'Evaluating...' : 'Get AI Feedback'}
                    </button>
                  ) : (
                    <a href="/auth" className="btn-primary submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                      Sign in to unlock AI Feedback
                    </a>
                  )}
                  <button
                    onClick={handleReset}
                    disabled={isEvaluating}
                    className="btn-secondary"
                  >
                    Re-record
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="evaluation-results">
              <div className="overall-score">
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(evaluation.overallScore.score) }}
                >
                  <span className="score-number">{evaluation.overallScore.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-label">{evaluation.overallScore.label}</div>
              </div>

              <div className="transcription-box">
                <h4>Your Speech (Transcribed)</h4>
                <p>{evaluation.transcription}</p>
              </div>

              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-category">Pronunciation</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${evaluation.pronunciation.score.score * 10}%`,
                        backgroundColor: getScoreColor(evaluation.pronunciation.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{evaluation.pronunciation.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Grammar</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${evaluation.grammar.score.score * 10}%`,
                        backgroundColor: getScoreColor(evaluation.grammar.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{evaluation.grammar.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Vocabulary</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${evaluation.vocabulary.score.score * 10}%`,
                        backgroundColor: getScoreColor(evaluation.vocabulary.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{evaluation.vocabulary.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Fluency</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${evaluation.fluency.score.score * 10}%`,
                        backgroundColor: getScoreColor(evaluation.fluency.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{evaluation.fluency.score.score}/10</span>
                </div>
              </div>

              <div className="feedback-section">
                <h4>Pronunciation Feedback</h4>
                <p>{evaluation.pronunciation.feedback}</p>
                {evaluation.pronunciation.difficultWords.length > 0 && (
                  <div className="difficult-words">
                    <strong>Words to practice:</strong>
                    <div className="word-tags">
                      {evaluation.pronunciation.difficultWords.map((word, i) => (
                        <span key={i} className="word-tag">{word}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {evaluation.grammar.corrections.length > 0 && (
                <div className="feedback-section">
                  <h4>Grammar Corrections</h4>
                  {evaluation.grammar.corrections.map((correction, i) => (
                    <div key={i} className="correction-item">
                      <div className="original">
                        <span className="label">You said:</span>
                        <span className="text strikethrough">{correction.spoken}</span>
                      </div>
                      <div className="corrected">
                        <span className="label">Better:</span>
                        <span className="text highlight">{correction.corrected}</span>
                      </div>
                      <div className="explanation">{correction.explanation}</div>
                    </div>
                  ))}
                </div>
              )}

              {evaluation.vocabulary.wordsUsedFromLesson.length > 0 && (
                <div className="feedback-section">
                  <h4>Vocabulary Used from Lesson</h4>
                  <div className="used-words">
                    {evaluation.vocabulary.wordsUsedFromLesson.map((word, i) => (
                      <span key={i} className="used-word">{word}</span>
                    ))}
                  </div>
                  <p>{evaluation.vocabulary.feedback}</p>
                </div>
              )}

              <div className="feedback-section">
                <h4>Fluency Feedback</h4>
                <p>{evaluation.fluency.feedback}</p>
                {evaluation.fluency.fillerWordsUsed.length > 0 && (
                  <div className="filler-words">
                    <strong>Filler words detected:</strong>
                    <span className="filler-list">
                      {evaluation.fluency.fillerWordsUsed.join(', ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="feedback-section encouragement">
                <h4>Encouragement</h4>
                <p>{evaluation.encouragement}</p>
              </div>

              {evaluation.practiceRecommendations.length > 0 && (
                <div className="feedback-section">
                  <h4>Practice Recommendations</h4>
                  <ul>
                    {evaluation.practiceRecommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <FeedbackReaction dayNumber={dayNumber} section="Speaking AI Feedback" />

              <button onClick={handleReset} className="btn-secondary try-again-btn">
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
