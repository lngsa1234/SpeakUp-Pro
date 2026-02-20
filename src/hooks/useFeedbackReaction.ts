import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useFeedbackReaction = (dayNumber: number, section: string) => {
  const { user } = useAuth();
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  // Load persisted reaction
  useEffect(() => {
    if (!user) return;
    setReaction(null);

    supabase
      .from('feedback')
      .select('id, message')
      .eq('user_id', user.id)
      .eq('type', 'ai_feedback')
      .like('message', `[Day ${dayNumber}] % on ${section}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setReaction(data[0].message.includes('\u{1F44D}') ? 'up' : 'down');
        }
      });
  }, [user, dayNumber, section]);

  const handleReaction = async (newValue: 'up' | 'down') => {
    const next = reaction === newValue ? null : newValue;
    setReaction(next);

    if (!user) return;

    // Delete previous reaction for this section/day
    await supabase
      .from('feedback')
      .delete()
      .eq('user_id', user.id)
      .eq('type', 'ai_feedback')
      .like('message', `[Day ${dayNumber}] % on ${section}`);

    // Insert new reaction if not toggling off
    if (next) {
      await supabase.from('feedback').insert({
        user_id: user.id,
        type: 'ai_feedback',
        message: `[Day ${dayNumber}] ${next === 'up' ? '\u{1F44D}' : '\u{1F44E}'} on ${section}`,
      });
    }
  };

  return { reaction, handleReaction };
};
