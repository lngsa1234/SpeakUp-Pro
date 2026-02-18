import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import type { ResumeEvaluation } from '../types';
import './ResumeFeedback.css';

interface ResumeFeedbackProps {
  userId?: string;
  onComplete?: (evaluation: ResumeEvaluation) => void;
}

export const ResumeFeedback: React.FC<ResumeFeedbackProps> = ({
  userId,
  onComplete,
}) => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [targetCompany, setTargetCompany] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<ResumeEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');

  // Load saved evaluation on mount
  useEffect(() => {
    const loadSavedEvaluation = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('resume_evaluations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setResumeText(data.resume_text || '');
          setTargetRole(data.target_role || 'Product Manager');
          setTargetCompany(data.target_company || '');
          setEvaluation(data.evaluation as ResumeEvaluation);
          setActiveTab('results');
          setIsExpanded(false);
        }
      } catch (err) {
        console.error('Error loading saved evaluation:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedEvaluation();
  }, [userId]);

  const handleSubmit = async () => {
    if (!resumeText.trim()) {
      setError('Please paste your resume text.');
      return;
    }

    if (resumeText.trim().length < 100) {
      setError('Please paste more resume content for a meaningful evaluation.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateResume({
        resumeText: resumeText.trim(),
        targetRole,
        targetCompany: targetCompany || undefined,
      });

      setEvaluation(response.evaluation);
      setActiveTab('results');

      // Save evaluation to database
      if (userId) {
        try {
          await supabase
            .from('resume_evaluations')
            .upsert({
              user_id: userId,
              resume_text: resumeText.trim(),
              target_role: targetRole,
              target_company: targetCompany || null,
              evaluation: response.evaluation,
              score: response.evaluation.overallScore.score,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'user_id'
            });
        } catch (saveErr) {
          console.error('Error saving evaluation:', saveErr);
        }
      }

      onComplete?.(response.evaluation);
    } catch (err) {
      setError('Failed to evaluate your resume. Please try again.');
      console.error('Resume evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setResumeText('');
    setEvaluation(null);
    setError(null);
    setActiveTab('input');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#6366f1';
    if (score >= 4) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="resume-feedback">
      <div className="resume-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>Resume Audit Tool</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="resume-content">
          {isLoading ? (
            <div className="loading-state">Loading saved evaluation...</div>
          ) : (
          <>
          {evaluation && (
            <div className="tab-selector">
              <button
                className={`tab-btn ${activeTab === 'input' ? 'active' : ''}`}
                onClick={() => setActiveTab('input')}
              >
                Edit Resume
              </button>
              <button
                className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                View Results
              </button>
            </div>
          )}

          {activeTab === 'input' && (
            <>
              <div className="input-section">
                <h4>Paste Your Resume</h4>
                <p className="input-hint">Copy and paste the text content of your resume below.</p>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here...

Example format:
EXPERIENCE
Senior Product Manager | Company Name | 2020-Present
- Led cross-functional team of 8 to launch mobile app feature
- Drove 25% increase in user engagement through A/B testing
- Defined product roadmap aligned with $10M revenue target"
                  disabled={isEvaluating}
                  className="resume-textarea"
                />
                <div className="char-count">
                  {resumeText.length} characters
                  {resumeText.length < 100 && resumeText.length > 0 && (
                    <span className="hint"> (minimum 100)</span>
                  )}
                </div>
              </div>

              <div className="target-section">
                <div className="target-input">
                  <label>Target Role</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Product Manager"
                  />
                </div>
                <div className="target-input">
                  <label>Target Company (optional)</label>
                  <input
                    type="text"
                    value={targetCompany}
                    onChange={(e) => setTargetCompany(e.target.value)}
                    placeholder="e.g., Google, Startup, Michigan company"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                onClick={handleSubmit}
                disabled={isEvaluating || resumeText.length < 100}
                className="btn-primary submit-btn"
              >
                {isEvaluating ? 'Analyzing Resume...' : 'Get AI Feedback'}
              </button>
            </>
          )}

          {activeTab === 'results' && evaluation && (
            <div className="evaluation-results">
              {/* Overall Score */}
              <div className="overall-score-section">
                <div
                  className="score-circle"
                  style={{ borderColor: getScoreColor(evaluation.overallScore.score) }}
                >
                  <span className="score-number">{evaluation.overallScore.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <div className="score-info">
                  <div className="score-label">{evaluation.overallScore.label}</div>
                  <div className="score-subtitle">Overall Resume Score</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="score-breakdown">
                <h4>Score Breakdown</h4>
                {[
                  { label: 'Impact Statements', data: evaluation.impactStatements },
                  { label: 'Metrics & Numbers', data: evaluation.metrics },
                  { label: 'Action Verbs', data: evaluation.actionVerbs },
                  { label: 'PM Skills', data: evaluation.pmSkills },
                  { label: 'ATS Optimization', data: evaluation.atsOptimization },
                  { label: 'Formatting', data: evaluation.formatting },
                ].map((item) => (
                  <div key={item.label} className="score-row">
                    <span className="score-category">{item.label}</span>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${item.data.score.score * 10}%`,
                          backgroundColor: getScoreColor(item.data.score.score)
                        }}
                      />
                    </div>
                    <span className="score-value">{item.data.score.score}/10</span>
                  </div>
                ))}
              </div>

              {/* Strengths */}
              {evaluation.strengths.length > 0 && (
                <div className="feedback-section strengths">
                  <h4>Strengths</h4>
                  <ul>
                    {evaluation.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Priority Improvements */}
              {evaluation.improvements.length > 0 && (
                <div className="feedback-section improvements">
                  <h4>Priority Improvements</h4>
                  <ul>
                    {evaluation.improvements.map((improvement, i) => (
                      <li key={i}>{improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bullet Evaluations */}
              {evaluation.impactStatements.bulletEvaluations.length > 0 && (
                <div className="feedback-section bullets">
                  <h4>Bullet-by-Bullet Analysis</h4>
                  {evaluation.impactStatements.bulletEvaluations.map((bullet, i) => (
                    <div key={i} className="bullet-evaluation">
                      <div className="bullet-header">
                        <span
                          className="bullet-score"
                          style={{ backgroundColor: getScoreColor(bullet.score) }}
                        >
                          {bullet.score}/10
                        </span>
                        <span className={`relevance-badge ${bullet.pmRelevance}`}>
                          {bullet.pmRelevance} PM relevance
                        </span>
                        {bullet.hasMetrics && <span className="badge metrics">Has Metrics</span>}
                        {bullet.hasActionVerb && <span className="badge action">Strong Verb</span>}
                      </div>
                      <div className="bullet-original">
                        <strong>Original:</strong> {bullet.original}
                      </div>
                      <div className="bullet-feedback">{bullet.feedback}</div>
                      <div className="bullet-improved">
                        <strong>Improved:</strong> {bullet.improved}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Metrics Analysis */}
              <div className="feedback-section metrics-section">
                <h4>Metrics Analysis</h4>
                <p>{evaluation.metrics.feedback}</p>
                <div className="metrics-stat">
                  <strong>{evaluation.metrics.bulletsWithMetrics}</strong> of{' '}
                  <strong>{evaluation.metrics.totalBullets}</strong> bullets have metrics
                </div>
                {evaluation.metrics.suggestions.length > 0 && (
                  <div className="suggestions">
                    <strong>Suggestions to add metrics:</strong>
                    <ul>
                      {evaluation.metrics.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Verbs */}
              {evaluation.actionVerbs.weakVerbs.length > 0 && (
                <div className="feedback-section verbs-section">
                  <h4>Action Verb Upgrades</h4>
                  <div className="verb-upgrades">
                    {evaluation.actionVerbs.weakVerbs.map((v, i) => (
                      <div key={i} className="verb-upgrade">
                        <span className="weak-verb">"{v.weak}"</span>
                        <span className="arrow">→</span>
                        <span className="strong-verbs">{v.stronger.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PM Skills */}
              <div className="feedback-section skills-section">
                <h4>PM Skills Coverage</h4>
                <p>{evaluation.pmSkills.feedback}</p>
                {evaluation.pmSkills.skillsIdentified.length > 0 && (
                  <div className="skills-found">
                    <strong>Skills shown:</strong>
                    <div className="skill-tags">
                      {evaluation.pmSkills.skillsIdentified.map((skill, i) => (
                        <span key={i} className="skill-tag found">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {evaluation.pmSkills.missingSkills.length > 0 && (
                  <div className="skills-missing">
                    <strong>Consider adding:</strong>
                    <div className="skill-tags">
                      {evaluation.pmSkills.missingSkills.map((skill, i) => (
                        <span key={i} className="skill-tag missing">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ATS Optimization */}
              <div className="feedback-section ats-section">
                <h4>ATS Optimization</h4>
                <p>{evaluation.atsOptimization.feedback}</p>
                {evaluation.atsOptimization.missingKeywords.length > 0 && (
                  <div className="keywords-missing">
                    <strong>Keywords to consider:</strong>
                    <div className="keyword-tags">
                      {evaluation.atsOptimization.missingKeywords.map((kw, i) => (
                        <span key={i} className="keyword-tag">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              {evaluation.nextSteps.length > 0 && (
                <div className="feedback-section next-steps">
                  <h4>Your Next Steps</h4>
                  <ol>
                    {evaluation.nextSteps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <button onClick={handleReset} className="btn-secondary try-again-btn">
                Evaluate Updated Resume
              </button>
            </div>
          )}
          </>
          )}
        </div>
      )}
    </div>
  );
};
