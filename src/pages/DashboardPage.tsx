import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { weekInfo, getDaysForWeek, calculateProgress } from '../data/learningPlan';

export const DashboardPage: React.FC = () => {
  const { user, signOut, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'feature' | 'content'>('general');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProgress();
    validateStreak();
  }, [user]);

  useEffect(() => {
    if (!showFeedbackDialog) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (feedbackRef.current && !feedbackRef.current.contains(e.target as Node)) {
        setShowFeedbackDialog(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFeedbackDialog]);

  const loadProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('day_number')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (!error && data) {
        setCompletedDays(data.map((p: any) => p.day_number));
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateStreak = async () => {
    if (!user || !user.last_session_date || user.current_streak === 0) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [ly, lm, ld] = user.last_session_date.split('T')[0].split('-').map(Number);
    const lastDate = new Date(ly, lm - 1, ld);
    const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

    // If more than 1 day has passed since last session, streak is broken
    if (diffDays > 1) {
      await supabase
        .from('users')
        .update({ current_streak: 0 })
        .eq('id', user.id);
      refreshUser();
    }
  };

  const getNextDay = (): number => {
    for (let i = 1; i <= 60; i++) {
      if (!completedDays.includes(i)) return i;
    }
    return 60;
  };

  const progress = calculateProgress(completedDays);
  const nextDay = getNextDay();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError('');
    setFeedbackSuccess('');

    if (!feedbackText.trim()) {
      setFeedbackError('Please enter your feedback.');
      return;
    }

    setFeedbackSubmitting(true);
    try {
      const { error } = await supabase.from('feedback').insert({
        user_id: user?.id,
        type: feedbackType,
        message: feedbackText.trim(),
      });

      if (error) throw error;

      setFeedbackSuccess('Thank you for your feedback!');
      setFeedbackText('');
      setFeedbackType('general');
      setTimeout(() => {
        setFeedbackSuccess('');
        setShowFeedbackDialog(false);
      }, 2000);
    } catch (err: any) {
      setFeedbackError(err.message || 'Failed to submit feedback.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!</h1>
          <p>Your learning journey at a glance</p>
        </div>
        <div className="dashboard-header-actions">
          {user?.email === 'lngsa.wang@gmail.com' && (
            <button onClick={() => navigate('/admin/feedback')} className="btn-secondary">
              Admin: Feedback
            </button>
          )}
          <div className="feedback-button-wrapper" ref={feedbackRef}>
            <button onClick={() => setShowFeedbackDialog(!showFeedbackDialog)} className="btn-secondary">
              Share Feedback
            </button>
            {showFeedbackDialog && (
              <div className="feedback-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="feedback-dialog-header">
                  <h2>Share Your Feedback</h2>
                  <button className="feedback-dialog-close" onClick={() => setShowFeedbackDialog(false)}>&times;</button>
                </div>
                <p className="feedback-description">Help us improve your learning experience.</p>
                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                  {feedbackError && <div className="error-message">{feedbackError}</div>}
                  {feedbackSuccess && <div className="success-message">{feedbackSuccess}</div>}
                  <div className="feedback-type-selector">
                    {(['general', 'bug', 'feature', 'content'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`feedback-type-btn ${feedbackType === type ? 'active' : ''}`}
                        onClick={() => setFeedbackType(type)}
                      >
                        {type === 'general' && 'General'}
                        {type === 'bug' && 'Bug Report'}
                        {type === 'feature' && 'Feature Request'}
                        {type === 'content' && 'Content'}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="What's on your mind? Tell us what you like, what could be better, or report an issue..."
                    rows={10}
                  />
                  <button type="submit" className="btn-primary" disabled={feedbackSubmitting}>
                    {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            )}
          </div>
          <button onClick={handleSignOut} className="btn-secondary">
            Sign Out
          </button>
        </div>
      </div>

      {user && !loading && (
      <div className="progress-section">
        <div className="progress-card">
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{completedDays.length}</span>
              <span className="stat-label">Days Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">{60 - completedDays.length}</span>
              <span className="stat-label">Remaining Days</span>
            </div>
            <div className="stat">
              <span className="stat-number">{progress}%</span>
              <span className="stat-label">Complete</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.current_streak}</span>
              <span className="stat-label">Day Streak 🔥</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.longest_streak}</span>
              <span className="stat-label">Best Streak 🏆</span>
            </div>
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>
      )}

      <div className="action-section">
        {nextDay <= 60 && (
          <button onClick={() => navigate(`/learning-plan/day/${nextDay}`)} className="btn-primary">
            Continue Day {nextDay} &rarr;
          </button>
        )}
        <button onClick={() => navigate('/vocabulary')} className="btn-secondary">
          Review Vocabulary
        </button>
        <button onClick={() => navigate('/learning-plan')} className="btn-secondary">
          Browse Full Plan
        </button>
      </div>

      <div className="weekly-summary-section">
        <h2>Weekly Overview</h2>
        <div className="weekly-summary-grid">
          {weekInfo.map((week) => {
            const weekDays = getDaysForWeek(week.week);
            const weekCompleted = weekDays.filter(d => completedDays.includes(d.day)).length;

            return (
              <div
                key={week.week}
                className={`weekly-summary-card ${weekCompleted === weekDays.length && weekDays.length > 0 ? 'completed' : ''}`}
                onClick={() => navigate(`/learning-plan?week=${week.week}`)}
              >
                <div className="weekly-summary-header">
                  <span className="week-number">Week {week.week}</span>
                  <span className="week-completion">{weekCompleted}/{weekDays.length}</span>
                </div>
                <h3>{week.theme}</h3>
                <p className="week-description">{week.description}</p>
                <div className="week-transcripts-list">
                  {week.transcripts.join(' · ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
