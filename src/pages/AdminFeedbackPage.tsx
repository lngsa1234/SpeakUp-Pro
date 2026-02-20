import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const ADMIN_EMAIL = 'lngsa.wang@gmail.com';

type FeedbackItem = {
  id: string;
  user_id: string;
  type: string;
  message: string;
  created_at: string;
  users: {
    full_name: string | null;
    email: string;
  } | null;
};

type FilterType = 'all' | 'general' | 'bug' | 'feature' | 'content' | 'ai_feedback';

const TYPE_LABELS: Record<string, string> = {
  general: 'General',
  bug: 'Bug Report',
  feature: 'Feature Request',
  content: 'Content',
  ai_feedback: 'AI Feedback',
};

export const AdminFeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      loadFeedback();
    }
  }, [user]);

  const loadFeedback = async () => {
    try {
      // Try with join first
      const { data, error } = await supabase
        .from('feedback')
        .select('id, user_id, type, message, created_at, users(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Join query failed, falling back to separate queries:', error);
        // Fallback: query feedback without join, then fetch users separately
        const { data: feedbackData, error: fbError } = await supabase
          .from('feedback')
          .select('id, user_id, type, message, created_at')
          .order('created_at', { ascending: false });

        if (fbError) throw fbError;

        // Get unique user IDs and fetch their info
        const userIds = [...new Set((feedbackData || []).map(f => f.user_id))];
        const { data: usersData } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', userIds);

        const usersMap = new Map((usersData || []).map(u => [u.id, u]));

        const enriched = (feedbackData || []).map(f => ({
          ...f,
          users: usersMap.get(f.user_id) || null,
        }));

        setFeedback(enriched as unknown as FeedbackItem[]);
        return;
      }

      setFeedback((data as unknown as FeedbackItem[]) || []);
    } catch (err) {
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedback = filter === 'all'
    ? feedback
    : feedback.filter((f) => f.type === filter);

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-feedback-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-feedback-page">
      <div className="admin-feedback-header">
        <div>
          <button className="link-button" onClick={() => navigate('/dashboard')}>
            &larr; Back to Dashboard
          </button>
          <h1>Admin: All Feedback</h1>
          <p>{feedback.length} total submissions</p>
        </div>
      </div>

      <div className="admin-filter-tabs">
        {(['all', 'general', 'bug', 'feature', 'content', 'ai_feedback'] as FilterType[]).map((type) => (
          <button
            key={type}
            className={`admin-filter-btn ${filter === type ? 'active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type === 'all' ? 'All' : TYPE_LABELS[type]}
            <span className="admin-filter-count">
              {type === 'all'
                ? feedback.length
                : feedback.filter((f) => f.type === type).length}
            </span>
          </button>
        ))}
      </div>

      {filteredFeedback.length === 0 ? (
        <div className="empty-state">No feedback found.</div>
      ) : (
        <div className="admin-feedback-list">
          {filteredFeedback.map((item) => (
            <div key={item.id} className="admin-feedback-card">
              <div className="admin-feedback-card-header">
                <div className="admin-feedback-user">
                  <span className="admin-feedback-name">
                    {item.users?.full_name || 'Unknown User'}
                  </span>
                  <span className="admin-feedback-email">
                    {item.users?.email || item.user_id}
                  </span>
                </div>
                <span className={`admin-feedback-type-badge type-${item.type}`}>
                  {TYPE_LABELS[item.type] || item.type}
                </span>
              </div>
              <p className="admin-feedback-message">{item.message}</p>
              <span className="admin-feedback-date">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
