import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { weekInfo, getDaysForWeek, getDay } from '../data/learningPlan';

export const LearningPlanPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const weekParam = searchParams.get('week');
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedWeek, setSelectedWeek] = useState(weekParam ? parseInt(weekParam) : 1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, [user]);

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
        const completed = data.map((p: any) => p.day_number);
        setCompletedDays(completed);

        // Set selected week to the current week, unless a specific week was requested via URL
        if (!weekParam) {
          let nextDay = 60;
          for (let i = 1; i <= 60; i++) {
            if (!completed.includes(i)) { nextDay = i; break; }
          }
          const dayData = getDay(nextDay);
          if (dayData) setSelectedWeek(dayData.week);
        }
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDay = (): number => {
    // Find the first incomplete day
    for (let i = 1; i <= 60; i++) {
      if (!completedDays.includes(i)) return i;
    }
    return 60;
  };

  const currentDay = getCurrentDay();
  const daysThisWeek = getDaysForWeek(selectedWeek);

  if (loading) {
    return (
      <div className="learning-plan-page">
        <div className="loading">Loading your learning plan...</div>
      </div>
    );
  }

  return (
    <div className="learning-plan-page">
      <div className="plan-header">
        <button onClick={() => navigate(user ? '/dashboard' : '/')} className="back-button">&larr; Back</button>
        <div className="plan-header-top">
          <h1>60-Day PM + Business English Learning Plan</h1>
          <div className="plan-header-actions">
            {!user && (
              <button onClick={() => navigate('/auth')} className="btn-secondary sign-in-prompt-btn">
                Sign in to track progress
              </button>
            )}
          </div>
        </div>
        <p className="subtitle">Listen Carefully, Explain Clearly and Become Your Knowledge</p>
        <p className="subtitle">The best way to learn is to explain what you learned in your own words.</p>
      </div>


      <div className="week-selector">
        <h2>Select Week</h2>
        <div className="week-tabs">
          {weekInfo.map((week) => {
            const weekDays = getDaysForWeek(week.week);
            const weekCompleted = weekDays.filter(d => completedDays.includes(d.day)).length;
            const isCurrentWeek = weekDays.some(d => d.day === currentDay);

            return (
              <button
                key={week.week}
                onClick={() => setSelectedWeek(week.week)}
                className={`week-tab ${selectedWeek === week.week ? 'active' : ''} ${isCurrentWeek ? 'current' : ''}`}
              >
                <span className="week-number">Week {week.week}</span>
                <span className="week-progress">{weekCompleted}/{weekDays.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="week-content">
        <div className="week-header">
          <h2>Week {selectedWeek}: {weekInfo[selectedWeek - 1]?.theme}</h2>
          <p>{weekInfo[selectedWeek - 1]?.description}</p>
          <div className="week-transcripts">
            <strong>Transcripts:</strong> {weekInfo[selectedWeek - 1]?.transcripts.join(', ')}
          </div>
        </div>

        <div className="days-grid">
          {daysThisWeek.map((day) => {
            const isCompleted = completedDays.includes(day.day);
            const isCurrent = user ? day.day === currentDay : false;
            const isLocked = user ? (day.day > currentDay && !isCompleted) : false;

            const totalDuration = day.activities.reduce((sum, a) => {
              const mins = parseInt(a.duration) || 0;
              return sum + mins;
            }, 0);

            return (
              <div
                key={day.day}
                className={`day-card ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''} ${day.isReviewDay ? 'review' : ''}`}
                onClick={() => !isLocked && navigate(`/learning-plan/day/${day.day}`)}
              >
                <div className="day-card-header">
                  <span className="day-number">Day {day.day}</span>
                  <div className="day-card-badges">
                    {isCompleted && <span className="check-mark">✓</span>}
                    {isCurrent && <span className="current-badge">Current</span>}
                    {day.isReviewDay && <span className="review-badge">Review</span>}
                  </div>
                </div>
                <h3 className="day-title">{day.title}</h3>
                <p className="day-transcript">{day.transcript}</p>
                <div className="day-meta">
                  <span className="day-focus">{day.focusArea}</span>
                </div>
                <div className="day-card-footer">
                  <span className="day-stat">{day.vocabulary.length} words</span>
                  <span className="day-stat">{day.keyPhrases.length} phrases</span>
                  <span className="day-stat">{totalDuration} min</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="plan-overview">
        <h2>Plan Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>Daily Structure</h3>
            <ul>
              <li><strong>20 min</strong> - Read transcript section</li>
              <li><strong>10 min</strong> - Learn vocabulary</li>
              <li><strong>10 min</strong> - Shadowing practice</li>
              <li><strong>10 min</strong> - Writing exercise</li>
              <li><strong>5 min</strong> - Speaking recording</li>
            </ul>
          </div>
          <div className="overview-card">
            <h3>What You'll Gain</h3>
            <ul>
              <li>200+ business English words</li>
              <li>PM strategy frameworks</li>
              <li>Growth & PMF knowledge</li>
              <li>Leadership skills</li>
              <li>Complete app strategy</li>
            </ul>
          </div>
          <div className="overview-card">
            <h3>Featured Guests</h3>
            <ul>
              <li>Jackie Bavaro (Asana)</li>
              <li>Gibson Biddle (Netflix)</li>
              <li>Rahul Vohra (Superhuman)</li>
              <li>Ryan Hoover (Product Hunt)</li>
              <li>Elena Verna (Lovable)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
