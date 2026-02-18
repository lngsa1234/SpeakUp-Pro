import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { supabase } from '../services/supabase';
import type { LinkedInEvaluation } from '../types';
import './LinkedInFeedback.css';

interface LinkedInFeedbackProps {
  userId?: string;
  onComplete?: (evaluation: LinkedInEvaluation) => void;
}

export const LinkedInFeedback: React.FC<LinkedInFeedbackProps> = ({
  userId,
  onComplete,
}) => {
  const [profileText, setProfileText] = useState('');
  const [targetRole, setTargetRole] = useState('Product Manager');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<LinkedInEvaluation | null>(null);
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
          .from('linkedin_evaluations')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          setProfileText(data.profile_text || '');
          setTargetRole(data.target_role || 'Product Manager');
          setTargetIndustry(data.target_industry || '');
          setEvaluation(data.evaluation as LinkedInEvaluation);
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
    if (!profileText.trim()) {
      setError('Please paste your LinkedIn profile text.');
      return;
    }

    if (profileText.trim().length < 100) {
      setError('Please paste more profile content for a meaningful evaluation.');
      return;
    }

    setIsEvaluating(true);
    setError(null);

    try {
      const response = await api.evaluateLinkedIn({
        profileText: profileText.trim(),
        targetRole,
        targetIndustry: targetIndustry || undefined,
      });

      setEvaluation(response.evaluation);
      setActiveTab('results');

      // Save evaluation to database
      if (userId) {
        try {
          await supabase
            .from('linkedin_evaluations')
            .upsert({
              user_id: userId,
              profile_text: profileText.trim(),
              target_role: targetRole,
              target_industry: targetIndustry || null,
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
      setError('Failed to evaluate your LinkedIn profile. Please try again.');
      console.error('LinkedIn evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setProfileText('');
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

  return (
    <div className="linkedin-feedback">
      <div className="linkedin-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>LinkedIn Profile Audit</h3>
        <button className="expand-btn">{isExpanded ? '−' : '+'}</button>
      </div>

      {isExpanded && (
        <div className="linkedin-content">
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
                Edit Profile
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
                <h4>Paste Your LinkedIn Profile</h4>
                <p className="input-hint">
                  Copy your LinkedIn profile content (headline, about, experience) and paste below.
                </p>
                <textarea
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                  placeholder={`Paste your LinkedIn profile text here...

Example format:
HEADLINE:
Product Manager | Building AI-Powered Solutions | Ex-Ford

ABOUT:
I help companies build products users love...

EXPERIENCE:
Senior Product Manager | Company Name | 2020-Present
- Led cross-functional team to launch mobile app
- Drove 25% increase in user engagement`}
                  disabled={isEvaluating}
                  className="profile-textarea"
                />
                <div className="char-count">
                  {profileText.length} characters
                  {profileText.length < 100 && profileText.length > 0 && (
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
                  <label>Target Industry (optional)</label>
                  <input
                    type="text"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    placeholder="e.g., FinTech, HealthTech, Automotive"
                  />
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button
                onClick={handleSubmit}
                disabled={isEvaluating || profileText.length < 100}
                className="btn-primary submit-btn"
              >
                {isEvaluating ? 'Analyzing Profile...' : 'Get AI Feedback'}
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
                  <div className="score-subtitle">Overall Profile Score</div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="score-breakdown">
                <h4>Score Breakdown</h4>
                {[
                  { label: 'Headline', data: evaluation.headline },
                  { label: 'Summary/About', data: evaluation.summary },
                  { label: 'Experience', data: evaluation.experience },
                  { label: 'Skills', data: evaluation.skills },
                  { label: 'Keywords', data: evaluation.keywords },
                  { label: 'Profile Strength', data: evaluation.profileStrength },
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

              {/* Headline Analysis */}
              <div className="feedback-section headline-section">
                <h4>Headline Analysis</h4>
                {evaluation.headline.current && (
                  <div className="current-headline">
                    <strong>Current:</strong> {evaluation.headline.current}
                  </div>
                )}
                <p>{evaluation.headline.feedback}</p>
                {evaluation.headline.improved.length > 0 && (
                  <div className="suggested-headlines">
                    <strong>Suggested Headlines:</strong>
                    <ul>
                      {evaluation.headline.improved.map((headline, i) => (
                        <li key={i} className="suggested-item">{headline}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Summary Analysis */}
              <div className="feedback-section summary-section">
                <h4>Summary/About Analysis</h4>
                <p>{evaluation.summary.feedback}</p>
                <div className="key-elements">
                  <h5>Key Elements Check:</h5>
                  <div className="element-grid">
                    <div className={`element ${evaluation.summary.keyElements.hasHook ? 'present' : 'missing'}`}>
                      {evaluation.summary.keyElements.hasHook ? '✓' : '✗'} Attention-grabbing hook
                    </div>
                    <div className={`element ${evaluation.summary.keyElements.hasValue ? 'present' : 'missing'}`}>
                      {evaluation.summary.keyElements.hasValue ? '✓' : '✗'} Clear value proposition
                    </div>
                    <div className={`element ${evaluation.summary.keyElements.hasProof ? 'present' : 'missing'}`}>
                      {evaluation.summary.keyElements.hasProof ? '✓' : '✗'} Proof points/achievements
                    </div>
                    <div className={`element ${evaluation.summary.keyElements.hasCTA ? 'present' : 'missing'}`}>
                      {evaluation.summary.keyElements.hasCTA ? '✓' : '✗'} Call to action
                    </div>
                  </div>
                </div>
                {evaluation.summary.improved && (
                  <div className="improved-summary">
                    <strong>Suggested Summary:</strong>
                    <div className="improved-text">{evaluation.summary.improved}</div>
                  </div>
                )}
              </div>

              {/* Experience Bullets */}
              {evaluation.experience.bulletEvaluations.length > 0 && (
                <div className="feedback-section bullets-section">
                  <h4>Experience Bullet Analysis</h4>
                  <p>{evaluation.experience.feedback}</p>
                  {evaluation.experience.bulletEvaluations.map((bullet, i) => (
                    <div key={i} className="bullet-evaluation">
                      <div className="bullet-header">
                        <span
                          className="bullet-score"
                          style={{ backgroundColor: getScoreColor(bullet.score) }}
                        >
                          {bullet.score}/10
                        </span>
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

              {/* Skills */}
              <div className="feedback-section skills-section">
                <h4>Skills Coverage</h4>
                <p>{evaluation.skills.feedback}</p>
                {evaluation.skills.found.length > 0 && (
                  <div className="skills-found">
                    <strong>Skills shown:</strong>
                    <div className="skill-tags">
                      {evaluation.skills.found.map((skill, i) => (
                        <span key={i} className="skill-tag found">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {evaluation.skills.missing.length > 0 && (
                  <div className="skills-missing">
                    <strong>Consider adding:</strong>
                    <div className="skill-tags">
                      {evaluation.skills.missing.map((skill, i) => (
                        <span key={i} className="skill-tag missing">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div className="feedback-section keywords-section">
                <h4>Keyword Optimization</h4>
                <p>{evaluation.keywords.feedback}</p>
                {evaluation.keywords.missing.length > 0 && (
                  <div className="keywords-missing">
                    <strong>Keywords to add:</strong>
                    <div className="keyword-tags">
                      {evaluation.keywords.missing.map((kw, i) => (
                        <span key={i} className="keyword-tag">{kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Strength */}
              <div className="feedback-section profile-strength-section">
                <h4>Profile Completeness</h4>
                <p>{evaluation.profileStrength.feedback}</p>
                <div className="profile-checklist">
                  <div className={`checklist-item ${evaluation.profileStrength.hasPhoto ? 'complete' : 'incomplete'}`}>
                    {evaluation.profileStrength.hasPhoto ? '✓' : '○'} Professional photo
                  </div>
                  <div className={`checklist-item ${evaluation.profileStrength.hasBanner ? 'complete' : 'incomplete'}`}>
                    {evaluation.profileStrength.hasBanner ? '✓' : '○'} Custom banner image
                  </div>
                  <div className={`checklist-item ${evaluation.profileStrength.hasFeatured ? 'complete' : 'incomplete'}`}>
                    {evaluation.profileStrength.hasFeatured ? '✓' : '○'} Featured section
                  </div>
                  <div className={`checklist-item ${evaluation.profileStrength.hasRecommendations ? 'complete' : 'incomplete'}`}>
                    {evaluation.profileStrength.hasRecommendations ? '✓' : '○'} Recommendations
                  </div>
                </div>
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
                Evaluate Updated Profile
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
