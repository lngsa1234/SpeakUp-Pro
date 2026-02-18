import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import type { WritingFluencyEvaluation } from '../types';
import './WritingFluencyDrill.css';

// Timer duration options in seconds
const DURATION_OPTIONS = [
  { label: '3 min', value: 180, description: 'Quick warm-up' },
  { label: '5 min', value: 300, description: 'Standard practice' },
  { label: '10 min', value: 600, description: 'Deep practice' },
];

// Default prompts for free writing
const DEFAULT_PROMPTS = [
  "Describe your ideal day from morning to evening.",
  "Write about a challenge you've overcome and what you learned.",
  "Explain a topic you're passionate about as if teaching someone new.",
  "Describe a place that makes you feel calm and why.",
  "Write about a goal you're working toward and your plan to achieve it.",
  "Describe a memorable conversation you've had recently.",
  "Write about what success means to you.",
  "Describe your favorite way to spend a weekend.",
  "Write about a skill you'd like to learn and why.",
  "Describe a person who has influenced you and how.",
];

interface WritingFluencyDrillProps {
  prompt?: string;
  dayNumber: number;
  onComplete?: (result: WritingFluencyResult) => void;
  savedResult?: WritingFluencyResult | null;
  isAuthenticated?: boolean;
}

export interface WritingFluencyResult {
  text: string;
  wordCount: number;
  duration: number;
  wpm: number;
  evaluation: WritingFluencyEvaluation;
}

export const WritingFluencyDrill: React.FC<WritingFluencyDrillProps> = ({
  prompt: customPrompt,
  dayNumber,
  onComplete,
  savedResult,
  isAuthenticated = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(!savedResult);
  const [selectedDuration, setSelectedDuration] = useState(300); // Default 5 min
  const [text, setText] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(selectedDuration);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<WritingFluencyResult | null>(savedResult || null);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textRef = useRef<string>(''); // Track latest text for timer callback
  const hasManuallyResetRef = useRef<boolean>(false); // Track if user clicked "Practice Again"

  // Get prompt for the day (rotate through defaults if no custom prompt)
  const currentPrompt = customPrompt || DEFAULT_PROMPTS[(dayNumber - 1) % DEFAULT_PROMPTS.length];

  // Keep textRef in sync with text state
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // Calculate word count and WPM
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const elapsedSeconds = selectedDuration - timeRemaining;
  const wpm = elapsedSeconds > 0 ? (wordCount / elapsedSeconds) * 60 : 0;

  // Reset when duration changes before starting
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(selectedDuration);
    }
  }, [selectedDuration, isRunning]);

  // Reset manual flag when day changes (navigation between days)
  useEffect(() => {
    hasManuallyResetRef.current = false;
  }, [dayNumber]);

  // Sync with saved result - only on initial load, not after user interaction
  useEffect(() => {
    // Only update if:
    // 1. We don't have a local result yet (initial load scenario)
    // 2. User hasn't manually reset to practice again
    // This prevents collapsing after completing a new drill or restoring after "Practice Again"
    if (!result && savedResult && !hasManuallyResetRef.current) {
      setResult(savedResult);
      // Keep collapsed if loading a previous result
      setIsExpanded(false);
    }
  }, [savedResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Define evaluateWriting first (used by handleTimeUp)
  const evaluateWriting = useCallback(async (textOverride?: string) => {
    // Use textOverride if provided (from timer callback), otherwise use ref
    const currentText = textOverride ?? textRef.current;
    const currentWordCount = currentText.trim() ? currentText.trim().split(/\s+/).length : 0;

    if (!currentText.trim()) {
      setError('Please write something before finishing.');
      return;
    }

    if (currentWordCount < 10) {
      setError('Please write at least 10 words for evaluation.');
      return;
    }

    if (!isAuthenticated) {
      setError('Sign in to unlock AI feedback on your writing fluency.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    const actualDuration = selectedDuration - timeRemaining;
    const actualWpm = actualDuration > 0 ? (currentWordCount / actualDuration) * 60 : 0;

    try {
      const response = await api.evaluateWritingFluency({
        text: currentText.trim(),
        prompt: currentPrompt,
        durationSeconds: actualDuration,
        wordCount: currentWordCount,
        wpm: actualWpm,
      });

      const newResult: WritingFluencyResult = {
        text: currentText.trim(),
        wordCount: currentWordCount,
        duration: actualDuration,
        wpm: actualWpm,
        evaluation: response.evaluation,
      };

      hasManuallyResetRef.current = false; // Reset flag after successful completion
      setResult(newResult);
      onComplete?.(newResult);
    } catch (err) {
      setError('Failed to evaluate your writing. Please try again.');
      console.error('Fluency evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  }, [selectedDuration, timeRemaining, currentPrompt, onComplete]);

  // Define handleTimeUp (uses evaluateWriting)
  const handleTimeUp = useCallback(async () => {
    setIsRunning(false);
    setIsPaused(false);
    // Use textRef to get the latest text value (avoids stale closure)
    await evaluateWriting(textRef.current);
  }, [evaluateWriting]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time's up!
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, handleTimeUp]);

  const startWriting = () => {
    setText('');
    setTimeRemaining(selectedDuration);
    setIsRunning(true);
    setIsPaused(false);
    setResult(null);
    setError(null);
    startTimeRef.current = Date.now();
    elapsedBeforePauseRef.current = 0;

    // Focus textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const pauseWriting = () => {
    setIsPaused(true);
    if (startTimeRef.current) {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
    }
  };

  const resumeWriting = () => {
    setIsPaused(false);
    startTimeRef.current = Date.now();
    textareaRef.current?.focus();
  };

  const finishEarly = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    // Use textRef to ensure we have the latest text
    await evaluateWriting(textRef.current);
  };

  const handleReset = () => {
    hasManuallyResetRef.current = true; // Prevent useEffect from restoring savedResult
    setText('');
    setTimeRemaining(selectedDuration);
    setIsRunning(false);
    setIsPaused(false);
    setResult(null);
    setError(null);
    startTimeRef.current = null;
    elapsedBeforePauseRef.current = 0;
    setIsExpanded(true); // Keep expanded to show the intro screen
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

  const getWpmLevel = (wpm: number): string => {
    if (wpm >= 40) return 'Fluent';
    if (wpm >= 25) return 'Advanced';
    if (wpm >= 15) return 'Intermediate';
    return 'Building';
  };

  return (
    <div className="writing-fluency-drill">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Writing Fluency Drill</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="practice-content">
          {!isRunning && !result && !isEvaluating && (
            <div className="drill-intro">
              <p className="drill-description">
                Build your writing fluency through timed free writing. The goal is to write
                continuously without stopping - focus on flow, not perfection!
              </p>

              <div className="prompt-display">
                <h4>Your Prompt</h4>
                <p className="prompt-text">{currentPrompt}</p>
              </div>

              <div className="duration-selector">
                <h4>Select Duration</h4>
                <div className="duration-options">
                  {DURATION_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`duration-option ${selectedDuration === option.value ? 'selected' : ''}`}
                      onClick={() => setSelectedDuration(option.value)}
                    >
                      <span className="duration-label">{option.label}</span>
                      <span className="duration-desc">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="wpm-benchmarks">
                <h4>WPM Benchmarks</h4>
                <div className="benchmark-list">
                  <div className="benchmark-item">
                    <span className="benchmark-level">Beginner</span>
                    <span className="benchmark-range">10-15 WPM</span>
                  </div>
                  <div className="benchmark-item">
                    <span className="benchmark-level">Intermediate</span>
                    <span className="benchmark-range">15-25 WPM</span>
                  </div>
                  <div className="benchmark-item">
                    <span className="benchmark-level">Advanced</span>
                    <span className="benchmark-range">25-40 WPM</span>
                  </div>
                  <div className="benchmark-item">
                    <span className="benchmark-level">Fluent</span>
                    <span className="benchmark-range">40+ WPM</span>
                  </div>
                </div>
              </div>

              <button onClick={startWriting} className="btn-primary start-btn">
                Start Writing
              </button>
            </div>
          )}

          {isRunning && (
            <div className="drill-active">
              <div className="timer-display">
                <div className={`timer-circle ${isPaused ? 'paused' : ''}`}>
                  <span className="timer-time">{formatTime(timeRemaining)}</span>
                  <span className="timer-label">{isPaused ? 'Paused' : 'Remaining'}</span>
                </div>
              </div>

              <div className="live-stats">
                <div className="stat-box">
                  <span className="stat-value">{wordCount}</span>
                  <span className="stat-label">Words</span>
                </div>
                <div className="stat-box highlight">
                  <span className="stat-value">{wpm.toFixed(1)}</span>
                  <span className="stat-label">WPM</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">{getWpmLevel(wpm)}</span>
                  <span className="stat-label">Level</span>
                </div>
              </div>

              <div className="prompt-reminder">
                <span className="prompt-label">Prompt:</span>
                <span className="prompt-text-mini">{currentPrompt}</span>
              </div>

              <div className="writing-area">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing... Don't stop, don't edit - just let your thoughts flow!"
                  disabled={isPaused}
                  className={isPaused ? 'paused' : ''}
                />
              </div>

              <div className="control-buttons">
                {isPaused ? (
                  <button onClick={resumeWriting} className="btn-primary">
                    Resume Writing
                  </button>
                ) : (
                  <button onClick={pauseWriting} className="btn-secondary">
                    Pause
                  </button>
                )}
                <button onClick={finishEarly} className="btn-secondary finish-btn">
                  Finish Early
                </button>
              </div>
            </div>
          )}

          {isEvaluating && (
            <div className="evaluating">
              <div className="spinner"></div>
              <span>Evaluating your writing fluency...</span>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {result && (
            <div className="evaluation-results">
              <div className="overall-score">
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(result.evaluation.overallFluencyScore.score) }}
                >
                  <span className="score-number">{result.evaluation.overallFluencyScore.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-label">{result.evaluation.overallFluencyScore.label}</div>
              </div>

              <div className="session-stats">
                <div className="session-stat">
                  <span className="stat-value">{result.wordCount}</span>
                  <span className="stat-label">Words Written</span>
                </div>
                <div className="session-stat">
                  <span className="stat-value">{result.wpm.toFixed(1)}</span>
                  <span className="stat-label">Words/Minute</span>
                </div>
                <div className="session-stat">
                  <span className="stat-value">{formatTime(result.duration)}</span>
                  <span className="stat-label">Time</span>
                </div>
              </div>

              <div className="your-writing-box">
                <h4>Your Writing</h4>
                <p className="your-writing-text">{result.text}</p>
              </div>

              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-category">Speed (WPM)</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.metrics.wpmRating.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.metrics.wpmRating.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.metrics.wpmRating.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Sentence Variety</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.sentenceAnalysis.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.sentenceAnalysis.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.sentenceAnalysis.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Flow & Coherence</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.flowAndCoherence.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.flowAndCoherence.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.flowAndCoherence.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Writing Momentum</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.writingMomentum.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.writingMomentum.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.writingMomentum.score.score}/10</span>
                </div>
              </div>

              <div className="feedback-section">
                <h4>Sentence Analysis</h4>
                <p className="feedback-stats">
                  {result.evaluation.sentenceAnalysis.totalSentences} sentences,
                  avg {result.evaluation.sentenceAnalysis.avgWordsPerSentence.toFixed(1)} words/sentence
                </p>
                <p>{result.evaluation.sentenceAnalysis.varietyFeedback}</p>
              </div>

              <div className="feedback-section">
                <h4>Flow & Coherence</h4>
                <p>{result.evaluation.flowAndCoherence.feedback}</p>
                {result.evaluation.flowAndCoherence.transitionsUsed.length > 0 && (
                  <div className="transitions-used">
                    <span className="transitions-label">Transitions used:</span>
                    <div className="transition-tags">
                      {result.evaluation.flowAndCoherence.transitionsUsed.map((t, i) => (
                        <span key={i} className="transition-tag used">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.evaluation.flowAndCoherence.suggestedTransitions.length > 0 && (
                  <div className="transitions-suggested">
                    <span className="transitions-label">Try these next time:</span>
                    <div className="transition-tags">
                      {result.evaluation.flowAndCoherence.suggestedTransitions.map((t, i) => (
                        <span key={i} className="transition-tag suggested">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="feedback-section">
                <h4>Writing Momentum</h4>
                <p>{result.evaluation.writingMomentum.feedback}</p>
              </div>

              <div className="feedback-section encouragement">
                <h4>Encouragement</h4>
                <p>{result.evaluation.encouragement}</p>
              </div>

              <div className="feedback-section">
                <h4>Next Steps</h4>
                <ul>
                  {result.evaluation.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="target-section">
                <p className="target-wpm">
                  Target for next session: <strong>{result.evaluation.metrics.targetWpm} WPM</strong>
                </p>
              </div>

              <button onClick={handleReset} className="btn-secondary try-again-btn">
                Practice Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
