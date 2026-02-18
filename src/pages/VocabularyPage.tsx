import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import type { VocabularyItem } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const VocabularyPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mastered'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVocabulary();
  }, [user, filter]);

  const loadVocabulary = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('vocabulary')
        .select('*')
        .eq('user_id', user.id)
        .order('learned_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('mastery_level', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVocabulary(data as VocabularyItem[]);
    } catch (err) {
      console.error('Error loading vocabulary:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateMasteryLevel = async (
    itemId: string,
    newLevel: 'new' | 'learning' | 'mastered'
  ) => {
    try {
      const { error } = await supabase
        .from('vocabulary')
        .update({
          mastery_level: newLevel,
          times_reviewed: vocabulary.find((v) => v.id === itemId)!.times_reviewed + 1,
          last_reviewed: new Date().toISOString(),
        })
        .eq('id', itemId);

      if (error) throw error;
      loadVocabulary();
    } catch (err) {
      console.error('Error updating mastery level:', err);
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'new':
        return '#3b82f6'; // blue
      case 'learning':
        return '#f59e0b'; // orange
      case 'mastered':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  if (loading) {
    return (
      <div className="vocabulary-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="vocabulary-page">
      <div className="page-header">
        <h1>My Vocabulary</h1>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          Back to Dashboard
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({vocabulary.length})
        </button>
        <button
          className={filter === 'new' ? 'active' : ''}
          onClick={() => setFilter('new')}
        >
          New
        </button>
        <button
          className={filter === 'learning' ? 'active' : ''}
          onClick={() => setFilter('learning')}
        >
          Learning
        </button>
        <button
          className={filter === 'mastered' ? 'active' : ''}
          onClick={() => setFilter('mastered')}
        >
          Mastered
        </button>
      </div>

      {vocabulary.length === 0 ? (
        <div className="empty-state">
          <p>No vocabulary items yet. Start a conversation to learn new words!</p>
          <button onClick={() => navigate('/topics')} className="btn-primary">
            Start Session
          </button>
        </div>
      ) : (
        <div className="vocabulary-grid">
          {vocabulary.map((item) => (
            <div key={item.id} className="vocabulary-card">
              <div className="vocab-header">
                <h3>{item.word}</h3>
                <span
                  className="mastery-badge"
                  style={{ backgroundColor: getMasteryColor(item.mastery_level) }}
                >
                  {item.mastery_level}
                </span>
              </div>

              <p className="vocab-definition">{item.definition}</p>

              <div className="vocab-example">
                <em>"{item.example_sentence}"</em>
              </div>

              <div className="vocab-meta">
                <span className="learned-date">
                  Learned {formatDistanceToNow(new Date(item.learned_at), { addSuffix: true })}
                </span>
                <span className="review-count">Reviewed {item.times_reviewed}x</span>
              </div>

              <div className="mastery-actions">
                {item.mastery_level !== 'mastered' && (
                  <button
                    onClick={() =>
                      updateMasteryLevel(
                        item.id,
                        item.mastery_level === 'new' ? 'learning' : 'mastered'
                      )
                    }
                    className="btn-small"
                  >
                    {item.mastery_level === 'new' ? 'Mark as Learning' : 'Mark as Mastered'}
                  </button>
                )}
                {item.mastery_level === 'mastered' && (
                  <span className="mastered-check">✓ Mastered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
