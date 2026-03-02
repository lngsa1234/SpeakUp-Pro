import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getReasoningQuestion, getQuickFireQuestions } from '../data/reasoningQuestions';
import { FeedbackReaction } from './FeedbackReaction';
import type { ReasoningEvaluation, QuickFireEvaluation } from '../types';
import './ReasoningDrill.css';

type DrillMode = 'prep' | 'quickfire';
type InputMode = 'writing' | 'speaking';

const QUICKFIRE_TIMER_OPTIONS = [
  { label: '30s', value: 30, description: 'Fast' },
  { label: '60s', value: 60, description: 'Standard' },
];

const QUICKFIRE_QUESTION_COUNT = 5;

export interface ReasoningDrillResult {
  mode: DrillMode;
  question: string;
  response: string;
  score: number;
  evaluation: ReasoningEvaluation | QuickFireEvaluation;
}

interface ReasoningDrillProps {
  dayNumber: number;
  onComplete?: (result: ReasoningDrillResult) => void;
  savedResult?: ReasoningDrillResult | null;
  isAuthenticated?: boolean;
  fixedMode?: DrillMode;
}

export const ReasoningDrill: React.FC<ReasoningDrillProps> = ({
  dayNumber,
  onComplete,
  savedResult,
  isAuthenticated = true,
  fixedMode,
}) => {
  const [isExpanded, setIsExpanded] = useState(!savedResult);
  const [drillMode, setDrillMode] = useState<DrillMode>(fixedMode || 'prep');
  const [inputMode, setInputMode] = useState<InputMode>('writing');
  const [responseText, setResponseText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<ReasoningDrillResult | null>(savedResult || null);
  const [error, setError] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const hasManuallyResetRef = useRef(false);

  // Quick-fire state
  const [qfTimerSeconds, setQfTimerSeconds] = useState(60);
  const [qfIsRunning, setQfIsRunning] = useState(false);
  const [qfCurrentIndex, setQfCurrentIndex] = useState(0);
  const [qfTimeRemaining, setQfTimeRemaining] = useState(60);
  const [qfResponses, setQfResponses] = useState<Array<{ question: string; answer: string }>>([]);
  const [qfTranscript, setQfTranscript] = useState('');
  const qfTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const qfTranscriptRef = useRef('');

  // Get current question(s)
  const currentQuestion = getReasoningQuestion(dayNumber, questionIndex);
  const qfQuestions = getQuickFireQuestions(dayNumber, QUICKFIRE_QUESTION_COUNT);
  const qfQuestionsRef = useRef(qfQuestions);
  qfQuestionsRef.current = qfQuestions;

  // Speech recognition for PREP mode
  const {
    isListening: prepIsListening,
    isSupported: speechSupported,
    startListening: prepStartListening,
    stopListening: prepStopListening,
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      setResponseText(transcript);
    },
    onError: (err) => {
      setError(err);
    },
  });

  // Speech recognition for quick-fire mode
  const {
    isListening: qfIsListening,
    startListening: qfStartListening,
    stopListening: qfStopListening,
  } = useSpeechRecognition({
    onTranscript: (transcript) => {
      setQfTranscript(transcript);
      qfTranscriptRef.current = transcript;
    },
    onError: (err) => {
      setError(err);
    },
  });

  // Reset on day change
  useEffect(() => {
    hasManuallyResetRef.current = false;
    setQuestionIndex(0);
  }, [dayNumber]);

  // Sync with saved result on initial load
  useEffect(() => {
    if (!result && savedResult && !hasManuallyResetRef.current) {
      setResult(savedResult);
      setIsExpanded(false);
    }
  }, [savedResult]); // eslint-disable-line react-hooks/exhaustive-deps

  // Quick-fire timer — re-run whenever qfCurrentIndex changes so a fresh interval starts per question
  useEffect(() => {
    if (qfIsRunning) {
      qfTimerRef.current = setInterval(() => {
        setQfTimeRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (qfTimerRef.current) {
        clearInterval(qfTimerRef.current);
      }
    };
  }, [qfIsRunning, qfCurrentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle time-up — separated from the timer to avoid side effects inside state updaters
  useEffect(() => {
    if (qfIsRunning && qfTimeRemaining === 0) {
      if (qfTimerRef.current) {
        clearInterval(qfTimerRef.current);
      }
      handleQfTimeUp();
    }
  }, [qfTimeRemaining]); // eslint-disable-line react-hooks/exhaustive-deps

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--primary-color)';
    if (score >= 4) return 'var(--warning)';
    return 'var(--error)';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  // --- PREP mode handlers ---

  const handlePrepSubmit = async () => {
    if (!responseText.trim()) {
      setError('Please write or speak a response first.');
      return;
    }

    if (responseText.trim().split(/\s+/).length < 15) {
      setError('Please provide a more detailed response (at least 15 words).');
      return;
    }

    if (!isAuthenticated) {
      setError('Sign in to unlock AI feedback on your reasoning.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateReasoning({
        question: currentQuestion.question,
        response: responseText.trim(),
        mode: inputMode,
      });

      const newResult: ReasoningDrillResult = {
        mode: 'prep',
        question: currentQuestion.question,
        response: responseText.trim(),
        score: response.evaluation.overallScore.score,
        evaluation: response.evaluation,
      };

      hasManuallyResetRef.current = false;
      setResult(newResult);
      onComplete?.(newResult);
    } catch (err) {
      setError('Failed to evaluate your response. Please try again.');
      console.error('Reasoning evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleTogglePrepRecording = () => {
    if (prepIsListening) {
      prepStopListening();
    } else {
      setError(null);
      prepStartListening();
    }
  };

  const handleNextQuestion = () => {
    hasManuallyResetRef.current = true;
    setQuestionIndex((prev) => prev + 1);
    setResponseText('');
    setResult(null);
    setError(null);
  };

  // --- Quick-fire handlers ---

  const startQuickFire = () => {
    setQfIsRunning(true);
    setQfCurrentIndex(0);
    setQfTimeRemaining(qfTimerSeconds);
    setQfResponses([]);
    setQfTranscript('');
    qfTranscriptRef.current = '';
    setResult(null);
    setError(null);

    // Start listening
    qfStartListening();
  };

  const handleQfTimeUp = useCallback(() => {
    // Save current response
    const currentTranscript = qfTranscriptRef.current;
    const questions = qfQuestionsRef.current;

    setQfResponses((prev) => {
      const updated = [...prev, {
        question: questions[prev.length]?.question || '',
        answer: currentTranscript.trim() || '(no response)',
      }];

      const nextIndex = prev.length + 1;

      if (nextIndex >= QUICKFIRE_QUESTION_COUNT) {
        // Done - stop listening and evaluate
        qfStopListening();
        setQfIsRunning(false);
        // Evaluate will be triggered by effect
        return updated;
      }

      // Move to next question — timer restarts via effect on qfCurrentIndex
      setQfCurrentIndex(nextIndex);
      setQfTimeRemaining(qfTimerSeconds);
      setQfTranscript('');
      qfTranscriptRef.current = '';

      // Restart recognition for next question
      qfStopListening();
      setTimeout(() => qfStartListening(), 300);

      return updated;
    });
  }, [qfTimerSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleQfNext = () => {
    // Clear current interval — a new one starts via the effect when qfCurrentIndex changes
    if (qfTimerRef.current) {
      clearInterval(qfTimerRef.current);
    }
    handleQfTimeUp();
  };

  // Evaluate quick-fire when all responses collected
  useEffect(() => {
    if (qfResponses.length === QUICKFIRE_QUESTION_COUNT && !qfIsRunning && !result) {
      evaluateQuickFire(qfResponses);
    }
  }, [qfResponses, qfIsRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  const evaluateQuickFire = async (responses: Array<{ question: string; answer: string }>) => {
    if (!isAuthenticated) {
      setError('Sign in to unlock AI feedback.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateQuickFire({ responses });

      const newResult: ReasoningDrillResult = {
        mode: 'quickfire',
        question: responses.map(r => r.question).join(' | '),
        response: responses.map(r => r.answer).join(' | '),
        score: response.evaluation.overallScore.score,
        evaluation: response.evaluation,
      };

      hasManuallyResetRef.current = false;
      setResult(newResult);
      onComplete?.(newResult);
    } catch (err) {
      setError('Failed to evaluate responses. Please try again.');
      console.error('Quick-fire evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    hasManuallyResetRef.current = true;
    setResponseText('');
    setResult(null);
    setError(null);
    setQfIsRunning(false);
    setQfCurrentIndex(0);
    setQfResponses([]);
    setQfTranscript('');
    qfTranscriptRef.current = '';
    setIsExpanded(true);
  };

  // Type guards
  const isPrepEvaluation = (eval_: ReasoningEvaluation | QuickFireEvaluation): eval_ is ReasoningEvaluation => {
    return 'reasoning' in eval_;
  };

  const isQuickFireEvaluation = (eval_: ReasoningEvaluation | QuickFireEvaluation): eval_ is QuickFireEvaluation => {
    return 'responses' in eval_ && 'patterns' in eval_;
  };

  return (
    <div className="reasoning-drill">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{fixedMode === 'prep' ? 'PREP Practice' : fixedMode === 'quickfire' ? 'Quick-fire Practice' : 'Reasoning Practice'}</h3>
        <button className="expand-btn">{isExpanded ? '\u2212' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="practice-content">
          {/* Mode tabs - show when not running or showing results (hidden when fixedMode is set) */}
          {!fixedMode && !qfIsRunning && !result && !isEvaluating && (
            <div className="mode-tabs">
              <button
                className={`mode-tab ${drillMode === 'prep' ? 'active' : ''}`}
                onClick={() => setDrillMode('prep')}
              >
                PREP Practice
              </button>
              <button
                className={`mode-tab ${drillMode === 'quickfire' ? 'active' : ''}`}
                onClick={() => setDrillMode('quickfire')}
              >
                Quick-fire
              </button>
            </div>
          )}

          {/* ===== PREP MODE ===== */}
          {drillMode === 'prep' && !result && !isEvaluating && (
            <div className="drill-intro">
              <p className="drill-description">
                Practice structured reasoning using the PREP framework.
                Answer the question with a clear Point, Reason, Example, and concluding Point.
              </p>

              <div className="prep-framework">
                <h4>PREP Framework</h4>
                <div className="prep-steps">
                  <div className="prep-step">
                    <span className="prep-letter">P</span>
                    <span className="prep-label">Point &mdash; State your main position clearly</span>
                  </div>
                  <div className="prep-step">
                    <span className="prep-letter">R</span>
                    <span className="prep-label">Reason &mdash; Explain why with a logical argument</span>
                  </div>
                  <div className="prep-step">
                    <span className="prep-letter">E</span>
                    <span className="prep-label">Example &mdash; Support with a concrete example</span>
                  </div>
                  <div className="prep-step">
                    <span className="prep-letter">P</span>
                    <span className="prep-label">Point &mdash; Reinforce your position to wrap up</span>
                  </div>
                </div>
              </div>

              <div className="question-display">
                <h4>Your Question</h4>
                <span className="question-category">{currentQuestion.category}</span>
                <p className="question-text">{currentQuestion.question}</p>
              </div>

              <div className="input-mode-toggle">
                <button
                  className={`input-mode-btn ${inputMode === 'writing' ? 'active' : ''}`}
                  onClick={() => setInputMode('writing')}
                >
                  Write
                </button>
                {speechSupported && (
                  <button
                    className={`input-mode-btn ${inputMode === 'speaking' ? 'active' : ''}`}
                    onClick={() => setInputMode('speaking')}
                  >
                    Speak
                  </button>
                )}
              </div>

              {inputMode === 'writing' ? (
                <div className="response-area">
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Start with your point... then explain your reason... give an example... and restate your point."
                  />
                </div>
              ) : (
                <div className="speaking-area">
                  <button
                    className={`record-btn ${prepIsListening ? 'recording' : ''}`}
                    onClick={handleTogglePrepRecording}
                  >
                    {prepIsListening ? '\u25A0' : '\u{1F3A4}'}
                  </button>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {prepIsListening ? 'Listening... tap to stop' : 'Tap to start speaking'}
                  </span>
                  {responseText && (
                    <div className="transcript-preview">{responseText}</div>
                  )}
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <div className="action-buttons">
                <button
                  onClick={handlePrepSubmit}
                  className="btn-primary submit-btn"
                  disabled={!responseText.trim()}
                >
                  Submit Response
                </button>
              </div>
            </div>
          )}

          {/* ===== QUICK-FIRE MODE - Setup ===== */}
          {drillMode === 'quickfire' && !qfIsRunning && !result && !isEvaluating && (
            <div className="drill-intro">
              <p className="drill-description">
                Answer {QUICKFIRE_QUESTION_COUNT} random questions under time pressure.
                Speak your responses naturally &mdash; focus on giving a clear, reasoned answer quickly.
              </p>

              <div className="timer-selector">
                <h4>Time Per Question</h4>
                <div className="timer-options">
                  {QUICKFIRE_TIMER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      className={`timer-option ${qfTimerSeconds === option.value ? 'selected' : ''}`}
                      onClick={() => setQfTimerSeconds(option.value)}
                    >
                      <span className="timer-label">{option.label}</span>
                      <span className="timer-desc">{option.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {!speechSupported && (
                <div className="error-message">
                  Quick-fire mode requires speech recognition, which is not supported in your browser.
                </div>
              )}

              {error && <div className="error-message">{error}</div>}

              <button
                onClick={startQuickFire}
                className="btn-primary start-btn"
                disabled={!speechSupported}
              >
                Start Quick-fire
              </button>
            </div>
          )}

          {/* ===== QUICK-FIRE MODE - Active ===== */}
          {qfIsRunning && (
            <div className="quickfire-active">
              <div className="quickfire-progress">
                {Array.from({ length: QUICKFIRE_QUESTION_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className={`progress-dot ${
                      i < qfCurrentIndex ? 'completed' : i === qfCurrentIndex ? 'current' : ''
                    }`}
                  />
                ))}
              </div>

              <div className="timer-display">
                <div className={`timer-circle ${
                  qfTimeRemaining <= 5 ? 'danger' : qfTimeRemaining <= 10 ? 'warning' : ''
                }`}>
                  <span className="timer-time">{formatTime(qfTimeRemaining)}</span>
                  <span className="timer-sublabel">Q{qfCurrentIndex + 1}/{QUICKFIRE_QUESTION_COUNT}</span>
                </div>
              </div>

              <div className="question-display">
                <span className="question-category">{qfQuestions[qfCurrentIndex]?.category}</span>
                <p className="question-text">{qfQuestions[qfCurrentIndex]?.question}</p>
              </div>

              {qfTranscript && (
                <div className="transcript-preview">{qfTranscript}</div>
              )}

              {qfIsListening && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Listening...
                </p>
              )}

              <div className="action-buttons">
                <button onClick={handleQfNext} className="btn-secondary">
                  {qfCurrentIndex < QUICKFIRE_QUESTION_COUNT - 1 ? 'Next Question' : 'Finish'}
                </button>
              </div>
            </div>
          )}

          {/* ===== EVALUATING ===== */}
          {isEvaluating && (
            <div className="evaluating">
              <div className="spinner"></div>
              <span>Evaluating your {drillMode === 'prep' ? 'reasoning' : 'responses'}...</span>
            </div>
          )}

          {/* ===== PREP RESULTS ===== */}
          {result && result.mode === 'prep' && isPrepEvaluation(result.evaluation) && (
            <div className="evaluation-results">
              <div className="overall-score">
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(result.evaluation.overallScore.score) }}
                >
                  <span className="score-number">{result.evaluation.overallScore.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-label">{result.evaluation.overallScore.label}</div>
              </div>

              {/* PREP checklist */}
              <div className="prep-checklist">
                <h4>PREP Structure Check</h4>
                <div className="prep-check-items">
                  <div className="prep-check-item">
                    <span className={`check-icon ${result.evaluation.reasoning.hasClearPoint ? 'pass' : 'miss'}`}>
                      {result.evaluation.reasoning.hasClearPoint ? '\u2713' : '\u2717'}
                    </span>
                    <span className="check-label">Point &mdash; Clear position stated</span>
                  </div>
                  <div className="prep-check-item">
                    <span className={`check-icon ${result.evaluation.reasoning.hasReason ? 'pass' : 'miss'}`}>
                      {result.evaluation.reasoning.hasReason ? '\u2713' : '\u2717'}
                    </span>
                    <span className="check-label">Reason &mdash; Logical argument provided</span>
                  </div>
                  <div className="prep-check-item">
                    <span className={`check-icon ${result.evaluation.reasoning.hasExample ? 'pass' : 'miss'}`}>
                      {result.evaluation.reasoning.hasExample ? '\u2713' : '\u2717'}
                    </span>
                    <span className="check-label">Example &mdash; Concrete example given</span>
                  </div>
                  <div className="prep-check-item">
                    <span className={`check-icon ${result.evaluation.reasoning.hasConclusion ? 'pass' : 'miss'}`}>
                      {result.evaluation.reasoning.hasConclusion ? '\u2713' : '\u2717'}
                    </span>
                    <span className="check-label">Point &mdash; Position reinforced</span>
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="score-breakdown">
                <div className="score-item">
                  <span className="score-category">Reasoning</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.reasoning.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.reasoning.score.score),
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.reasoning.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Language</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.language.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.language.score.score),
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.language.score.score}/10</span>
                </div>
                <div className="score-item">
                  <span className="score-category">Coherence</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${result.evaluation.coherence.score.score * 10}%`,
                        backgroundColor: getScoreColor(result.evaluation.coherence.score.score),
                      }}
                    />
                  </div>
                  <span className="score-value">{result.evaluation.coherence.score.score}/10</span>
                </div>
              </div>

              {/* Reasoning feedback */}
              <div className="feedback-section">
                <h4>Reasoning Structure</h4>
                <p>{result.evaluation.reasoning.feedback}</p>
              </div>

              {/* Language feedback + corrections */}
              <div className="feedback-section">
                <h4>Language Quality</h4>
                <p>{result.evaluation.language.feedback}</p>
                {result.evaluation.language.corrections.length > 0 && (
                  <div className="corrections-list">
                    {result.evaluation.language.corrections.map((c, i) => (
                      <div key={i} className="correction-item">
                        <span className="correction-original">{c.original}</span>
                        <span className="correction-corrected">{c.corrected}</span>
                        <div className="correction-explanation">{c.explanation}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Coherence feedback + transitions */}
              <div className="feedback-section">
                <h4>Coherence & Flow</h4>
                <p>{result.evaluation.coherence.feedback}</p>
                {result.evaluation.coherence.transitionsUsed.length > 0 && (
                  <div className="transitions-used">
                    <span className="transitions-label">Transitions used:</span>
                    <div className="transition-tags">
                      {result.evaluation.coherence.transitionsUsed.map((t, i) => (
                        <span key={i} className="transition-tag used">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.evaluation.coherence.suggestedTransitions.length > 0 && (
                  <div className="transitions-suggested">
                    <span className="transitions-label">Try these next time:</span>
                    <div className="transition-tags">
                      {result.evaluation.coherence.suggestedTransitions.map((t, i) => (
                        <span key={i} className="transition-tag suggested">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Encouragement */}
              <div className="feedback-section encouragement">
                <h4>Encouragement</h4>
                <p>{result.evaluation.encouragement}</p>
              </div>

              {/* Next steps */}
              <div className="feedback-section">
                <h4>Next Steps</h4>
                <ul>
                  {result.evaluation.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <FeedbackReaction dayNumber={dayNumber} section="Reasoning Drill (PREP)" />

              <button onClick={handleNextQuestion} className="btn-primary try-again-btn next-question-btn">
                Next Question
              </button>
              <button onClick={handleReset} className="btn-secondary try-again-btn">
                Start Over
              </button>
            </div>
          )}

          {/* ===== QUICK-FIRE RESULTS ===== */}
          {result && result.mode === 'quickfire' && isQuickFireEvaluation(result.evaluation) && (
            <div className="evaluation-results">
              <div className="overall-score">
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(result.evaluation.overallScore.score) }}
                >
                  <span className="score-number">{result.evaluation.overallScore.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-label">{result.evaluation.overallScore.label}</div>
              </div>

              {/* Per-response feedback */}
              <div className="feedback-section">
                <h4>Response Breakdown</h4>
                <div className="qf-responses">
                  {result.evaluation.responses.map((r, i) => (
                    <div key={i} className="qf-response-card">
                      <div className="qf-question">Q{i + 1}: {r.question}</div>
                      <div className="qf-answer">{r.answer}</div>
                      <div className="qf-scores">
                        <span className="qf-score">Reasoning: <strong>{r.reasoningScore.score}/10</strong></span>
                        <span className="qf-score">Language: <strong>{r.languageScore.score}/10</strong></span>
                      </div>
                      <div className="qf-feedback">{r.feedback}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patterns */}
              <div className="patterns-section">
                <h4>Patterns Across Responses</h4>
                {result.evaluation.patterns.strengths.length > 0 && (
                  <div className="pattern-group">
                    <div className="pattern-label">Strengths</div>
                    <div className="pattern-items">
                      {result.evaluation.patterns.strengths.map((s, i) => (
                        <span key={i} className="pattern-item strength">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {result.evaluation.patterns.areasToImprove.length > 0 && (
                  <div className="pattern-group">
                    <div className="pattern-label">Areas to Improve</div>
                    <div className="pattern-items">
                      {result.evaluation.patterns.areasToImprove.map((a, i) => (
                        <span key={i} className="pattern-item improve">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Encouragement */}
              <div className="feedback-section encouragement">
                <h4>Encouragement</h4>
                <p>{result.evaluation.encouragement}</p>
              </div>

              {/* Next steps */}
              <div className="feedback-section">
                <h4>Next Steps</h4>
                <ul>
                  {result.evaluation.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <FeedbackReaction dayNumber={dayNumber} section="Reasoning Drill (Quick-fire)" />

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
