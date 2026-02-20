import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FeedbackReaction } from './FeedbackReaction';
import type { WritingEvaluation } from '../types';

interface WritingPracticeProps {
  prompt: string;
  dayNumber: number;
  vocabularyToUse: string[];
  phrasesToUse: string[];
  onComplete?: (evaluation: WritingEvaluation, userText: string) => void;
  savedText?: string;
  savedEvaluation?: WritingEvaluation | null;
  isAuthenticated?: boolean;
}

export const WritingPractice: React.FC<WritingPracticeProps> = ({
  prompt,
  dayNumber,
  vocabularyToUse,
  phrasesToUse,
  onComplete,
  savedText,
  savedEvaluation,
  isAuthenticated = true,
}) => {
  const [text, setText] = useState(savedText || '');
  const [submittedText, setSubmittedText] = useState(savedText || '');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<WritingEvaluation | null>(savedEvaluation || null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!savedEvaluation);
  const [isRetrying, setIsRetrying] = useState(false);

  // Sync state when saved props change (e.g., after loading from database or changing days)
  // but NOT when the user is actively retrying
  useEffect(() => {
    if (!isRetrying) {
      setText(savedText || '');
      setSubmittedText(savedText || '');
    }
  }, [savedText]);

  useEffect(() => {
    if (!isRetrying) {
      setEvaluation(savedEvaluation || null);
      setIsExpanded(!savedEvaluation);
    }
  }, [savedEvaluation]);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please write something before submitting.');
      return;
    }

    if (text.trim().split(/\s+/).length < 20) {
      setError('Please write at least 20 words for a meaningful evaluation.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateWriting({
        text: text.trim(),
        prompt,
        dayNumber,
        vocabularyToUse,
        phrasesToUse,
      });

      setSubmittedText(text.trim());
      setEvaluation(response.evaluation);
      setIsRetrying(false);
      onComplete?.(response.evaluation, text.trim());
    } catch (err) {
      const message = err instanceof DOMException && err.name === 'AbortError'
        ? 'Request timed out. The server may be waking up — please try again.'
        : 'Failed to evaluate your writing. Please try again.';
      setError(message);
      console.error('Evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setText('');
    setSubmittedText('');
    setEvaluation(null);
    setError(null);
    setIsRetrying(true);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return 'var(--success)';
    if (score >= 6) return 'var(--primary-color)';
    if (score >= 4) return 'var(--warning)';
    return 'var(--error)';
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="writing-practice">
      <div className="practice-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Writing Practice</h3>
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
              <div className="writing-area">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Start writing here... Try to incorporate the vocabulary and phrases from today's lesson."
                  disabled={isEvaluating}
                />
                <div className="word-count">
                  {wordCount} words {wordCount < 20 && <span className="hint">(minimum 20)</span>}
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              {isAuthenticated ? (
                <button
                  onClick={handleSubmit}
                  disabled={isEvaluating || wordCount < 20}
                  className="btn-primary submit-btn"
                >
                  {isEvaluating ? 'Evaluating...' : 'Get AI Feedback'}
                </button>
              ) : (
                <a href="/auth" className="btn-primary submit-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                  Sign in to unlock AI Feedback
                </a>
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

              {submittedText && (
                <div className="your-answer-box">
                  <h4>Your Writing</h4>
                  <p className="your-answer-text">{submittedText}</p>
                </div>
              )}

              <div className="score-breakdown">
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
                  <span className="score-category">Content</span>
                  <div className="score-bar">
                    <div
                      className="score-fill"
                      style={{
                        width: `${evaluation.content.score.score * 10}%`,
                        backgroundColor: getScoreColor(evaluation.content.score.score)
                      }}
                    />
                  </div>
                  <span className="score-value">{evaluation.content.score.score}/10</span>
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

              {evaluation.grammar.corrections.length > 0 && (
                <div className="feedback-section">
                  <h4>Grammar Corrections</h4>
                  {evaluation.grammar.corrections.map((correction, i) => (
                    <div key={i} className="correction-item">
                      <div className="original">
                        <span className="label">Original:</span>
                        <span className="text strikethrough">{correction.original}</span>
                      </div>
                      <div className="corrected">
                        <span className="label">Corrected:</span>
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
                </div>
              )}

              {evaluation.vocabulary.suggestedUpgrades.length > 0 && (
                <div className="feedback-section">
                  <h4>Vocabulary Upgrades</h4>
                  {evaluation.vocabulary.suggestedUpgrades.map((upgrade, i) => (
                    <div key={i} className="upgrade-item">
                      <span className="original-word">"{upgrade.original}"</span>
                      <span className="arrow">→</span>
                      <span className="suggestions">{upgrade.suggestions.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="feedback-section">
                <h4>Content Feedback</h4>
                <p>{evaluation.content.feedback}</p>
              </div>

              <div className="feedback-section encouragement">
                <h4>Encouragement</h4>
                <p>{evaluation.encouragement}</p>
              </div>

              {evaluation.nextSteps.length > 0 && (
                <div className="feedback-section">
                  <h4>Next Steps</h4>
                  <ul>
                    {evaluation.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              <FeedbackReaction dayNumber={dayNumber} section="Writing AI Feedback" />

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
