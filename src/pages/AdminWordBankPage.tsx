import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

const ADMIN_EMAIL = 'lngsa.wang@gmail.com';

type WordItem = {
  id: string;
  word: string;
  created_at: string;
};

export const AdminWordBankPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState<WordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

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
        .select('id, word, created_at')
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
          setError('This word already exists in the word bank.');
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

      <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', maxWidth: '500px' }}>
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

      {words.length === 0 ? (
        <div className="empty-state">No words added yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {words.map((item) => (
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
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{item.word}</span>
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
