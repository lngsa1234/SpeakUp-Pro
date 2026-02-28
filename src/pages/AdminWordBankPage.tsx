import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const ADMIN_EMAIL = 'lngsa.wang@gmail.com';

type WordItem = {
  id: string;
  word: string;
  input_count: number;
  last_input_at: string;
  created_at: string;
};

type SortBy = 'date' | 'count' | 'alpha';

export const AdminWordBankPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');

  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.email === ADMIN_EMAIL) {
      loadWords();
    }
  }, [user]);

  const loadWords = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_word_bank')
        .select('id, word, input_count, last_input_at, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWords(data || []);
    } catch (err) {
      console.error('Error loading words:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = newWord.trim().toLowerCase();
    if (!trimmed) return;

    setAdding(true);
    try {
      const { error } = await supabase
        .from('admin_word_bank')
        .insert({ word: trimmed });

      if (error) {
        if (error.code === '23505') {
          // Word already exists — increment count
          const { data: existing } = await supabase
            .from('admin_word_bank')
            .select('id, input_count')
            .eq('word', trimmed)
            .single();

          if (existing) {
            const { error: updateError } = await supabase
              .from('admin_word_bank')
              .update({
                input_count: existing.input_count + 1,
                last_input_at: new Date().toISOString(),
              })
              .eq('id', existing.id);

            if (updateError) throw updateError;
          }
          setNewWord('');
          await loadWords();
        } else {
          throw error;
        }
      } else {
        setNewWord('');
        await loadWords();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add word.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteWord = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_word_bank')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setWords(words.filter((w) => w.id !== id));
    } catch (err) {
      console.error('Error deleting word:', err);
    }
  };

  const sortedWords = [...words].sort((a, b) => {
    if (sortBy === 'count') return b.input_count - a.input_count;
    if (sortBy === 'alpha') return a.word.localeCompare(b.word);
    return new Date(b.last_input_at).getTime() - new Date(a.last_input_at).getTime();
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  if (loading) {
    return (
      <div className="admin-feedback-page">
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading word bank...</p>
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
          <h1>Admin: Word Bank</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>{words.length} words total</p>
        </div>
      </div>

      <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', maxWidth: '500px' }}>
        <input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a word..."
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={adding || !newWord.trim()}
          style={{ whiteSpace: 'nowrap' }}
        >
          {adding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['date', 'count', 'alpha'] as SortBy[]).map((s) => (
          <button
            key={s}
            onClick={() => setSortBy(s)}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: sortBy === s ? '2px solid #3b82f6' : '1px solid #d1d5db',
              background: sortBy === s ? '#eff6ff' : '#fff',
              color: sortBy === s ? '#3b82f6' : '#6b7280',
              fontWeight: sortBy === s ? 600 : 400,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {s === 'date' ? 'Latest' : s === 'count' ? 'Most Input' : 'A-Z'}
          </button>
        ))}
      </div>

      {words.length === 0 ? (
        <div className="empty-state">No words added yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sortedWords.map((item) => (
            <div
              key={item.id}
              className="admin-feedback-card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{item.word}</span>
                {item.input_count > 1 && (
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    x{item.input_count}
                  </span>
                )}
                <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  {formatDate(item.last_input_at)}
                </span>
              </div>
              <button
                onClick={() => handleDeleteWord(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '0.25rem 0.5rem',
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
