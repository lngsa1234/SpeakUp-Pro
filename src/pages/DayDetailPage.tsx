import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';
import { getDay } from '../data/learningPlan';
import type { LearningDay } from '../data/learningPlan';
import { WritingPractice } from '../components/WritingPractice';
import { SpeakingPractice } from '../components/SpeakingPractice';
import { TranscriptReader } from '../components/TranscriptReader';
import { PronunciationDrill } from '../components/PronunciationDrill';
import { PhonemeExercise } from '../components/PhonemeExercise';
import { WritingFluencyDrill } from '../components/WritingFluencyDrill';
import type { WritingFluencyResult } from '../components/WritingFluencyDrill';
import type { WritingEvaluation, SpeakingEvaluation, DrillItem, DrillResult, PhonemeSessionResult } from '../types';

export const DayDetailPage: React.FC = () => {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const isAuthenticated = !!user;

  const [day, setDay] = useState<LearningDay | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [vocabExpanded, setVocabExpanded] = useState(true);
  const [phrasesExpanded, setPhrasesExpanded] = useState(true);
  const [bonusDrillsExpanded, setBonusDrillsExpanded] = useState(false);
  const [notes, setNotes] = useState('');
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [writingCompleted, setWritingCompleted] = useState(false);
  const [speakingCompleted, setSpeakingCompleted] = useState(false);
  const [writingScore, setWritingScore] = useState<number | null>(null);
  const [speakingScore, setSpeakingScore] = useState<number | null>(null);
  const [writingInitialScore, setWritingInitialScore] = useState<number | null>(null);
  const [writingBestScore, setWritingBestScore] = useState<number | null>(null);
  const [writingAttemptCount, setWritingAttemptCount] = useState<number>(0);
  const [speakingInitialScore, setSpeakingInitialScore] = useState<number | null>(null);
  const [speakingBestScore, setSpeakingBestScore] = useState<number | null>(null);
  const [speakingAttemptCount, setSpeakingAttemptCount] = useState<number>(0);
  const [savedWritingEvaluation, setSavedWritingEvaluation] = useState<WritingEvaluation | null>(null);
  const [savedWritingText, setSavedWritingText] = useState<string>('');
  const [savedSpeakingEvaluation, setSavedSpeakingEvaluation] = useState<SpeakingEvaluation | null>(null);
  const [savedSpeakingTranscription, setSavedSpeakingTranscription] = useState<string>('');
  const [difficultWords, setDifficultWords] = useState<string[]>([]);
  const [drillScore, setDrillScore] = useState<number | null>(null);
  const [phonemeScore, setPhonemeScore] = useState<number | null>(null);
  const [fluencyScore, setFluencyScore] = useState<number | null>(null);
  const [savedFluencyResult, setSavedFluencyResult] = useState<WritingFluencyResult | null>(null);
  const [sectionReactions, setSectionReactions] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    const dayNum = parseInt(dayNumber || '1');
    const foundDay = getDay(dayNum);
    if (foundDay) {
      // Reset all state when changing days
      setDay(foundDay);
      setIsCompleted(false);
      setNotes('');
      setCompletedActivities([]);
      setWritingCompleted(false);
      setSpeakingCompleted(false);
      setWritingScore(null);
      setSpeakingScore(null);
      setWritingInitialScore(null);
      setWritingBestScore(null);
      setWritingAttemptCount(0);
      setSpeakingInitialScore(null);
      setSpeakingBestScore(null);
      setSpeakingAttemptCount(0);
      setSavedWritingEvaluation(null);
      setSavedWritingText('');
      setSavedSpeakingEvaluation(null);
      setSavedSpeakingTranscription('');
      setDrillScore(null);
      setPhonemeScore(null);
      setFluencyScore(null);
      setSavedFluencyResult(null);
      // Don't reset difficultWords - they persist across days

      loadDayProgress(dayNum);
    }
  }, [dayNumber, user]);

  const loadDayProgress = async (dayNum: number) => {
    if (!user) return;

    try {
      // Load progress - use maybeSingle and handle errors gracefully
      try {
        const { data } = await supabase
          .from('learning_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .maybeSingle();

        if (data) {
          setIsCompleted(data.completed);
          setNotes(data.notes || '');
          setCompletedActivities(data.completed_activities || []);
        }
      } catch (progressError) {
        console.log('Learning progress table may not exist yet:', progressError);
      }

      // Load writing evaluation
      try {
        const { data: writingData } = await supabase
          .from('writing_evaluations')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (writingData?.evaluation) {
          setSavedWritingEvaluation(writingData.evaluation);
          setSavedWritingText(writingData.user_text ?? '');
          setWritingScore(writingData.score ?? writingData.evaluation.overallScore?.score ?? null);
          setWritingInitialScore(writingData.initial_score ?? null);
          setWritingBestScore(writingData.best_score ?? null);
          setWritingAttemptCount(writingData.attempt_count ?? 1);
          setWritingCompleted(true);
        }
      } catch {
        console.log('Writing evaluations table may not exist yet');
      }

      // Load speaking evaluation
      try {
        const { data: speakingData } = await supabase
          .from('speaking_evaluations')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (speakingData?.evaluation) {
          setSavedSpeakingEvaluation(speakingData.evaluation);
          setSavedSpeakingTranscription(speakingData.user_transcription ?? '');
          setSpeakingScore(speakingData.score ?? speakingData.evaluation.overallScore?.score ?? null);
          setSpeakingInitialScore(speakingData.initial_score ?? null);
          setSpeakingBestScore(speakingData.best_score ?? null);
          setSpeakingAttemptCount(speakingData.attempt_count ?? 1);
          setSpeakingCompleted(true);
        }

        // Load difficult words from past speaking evaluations
        const { data: speakingEvaluations } = await supabase
          .from('speaking_evaluations')
          .select('evaluation')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (speakingEvaluations && speakingEvaluations.length > 0) {
          const allDifficultWords = speakingEvaluations
            .flatMap(e => e.evaluation?.pronunciation?.difficultWords || [])
            .filter((word, index, self) => self.indexOf(word) === index);
          setDifficultWords(allDifficultWords);
        }
      } catch {
        console.log('Speaking evaluations table may not exist yet');
      }

      // Load drill progress
      try {
        const { data: drillData } = await supabase
          .from('pronunciation_drills')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (drillData) {
          setDrillScore(drillData.average_score);
        }
      } catch {
        console.log('Pronunciation drills table may not exist yet');
      }

      // Load phoneme exercise progress
      try {
        const { data: phonemeData } = await supabase
          .from('phoneme_exercises')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (phonemeData) {
          setPhonemeScore(phonemeData.average_score);
        }
      } catch {
        console.log('Phoneme exercises table may not exist yet');
      }

      // Load writing fluency drill progress
      try {
        const { data: fluencyData } = await supabase
          .from('writing_fluency_drills')
          .select('*')
          .eq('user_id', user.id)
          .eq('day_number', dayNum)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fluencyData) {
          setFluencyScore(fluencyData.wpm);
          setSavedFluencyResult({
            text: fluencyData.text,
            wordCount: fluencyData.word_count,
            duration: fluencyData.duration_seconds,
            wpm: fluencyData.wpm,
            evaluation: fluencyData.evaluation,
          });
        }
      } catch {
        console.log('Writing fluency drills table may not exist yet');
      }
    } catch (err) {
      console.log('Error loading day progress:', err);
    }
  };

  const toggleActivity = async (activityName: string) => {
    const newCompletedActivities = completedActivities.includes(activityName)
      ? completedActivities.filter(a => a !== activityName)
      : [...completedActivities, activityName];

    setCompletedActivities(newCompletedActivities);

    // Auto-save when toggling activities
    if (user && day) {
      try {
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });
      } catch (err) {
        console.error('Error auto-saving activity:', err);
      }
    }
  };

  const saveVocabulary = async () => {
    if (!user || !day || day.vocabulary.length === 0) return;
    try {
      const vocabRows = day.vocabulary.map(v => ({
        user_id: user.id,
        word: v.word,
        definition: v.definition,
        example_sentence: v.example,
        learned_at: new Date().toISOString(),
        mastery_level: 'new',
        times_reviewed: 0,
      }));

      await supabase
        .from('vocabulary')
        .upsert(vocabRows, { onConflict: 'user_id,word' });
    } catch (err) {
      console.error('Error saving vocabulary:', err);
    }
  };

  const markDayComplete = async () => {
    if (!user || !day) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          day_number: day.day,
          completed: true,
          completed_at: new Date().toISOString(),
          notes: notes,
          completed_activities: completedActivities,
          vocabulary_learned: day.vocabulary.map(v => v.word)
        }, {
          onConflict: 'user_id,day_number'
        });

      if (!error) {
        setIsCompleted(true);

        // Update streak
        await updateUserStreak();

        // Save vocabulary to the vocabulary table
        await saveVocabulary();
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const updateUserStreak = async () => {
    if (!user) return;

    try {
      // Use local date to avoid timezone issues (e.g. 11pm EST = next day in UTC)
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const lastSession = user.last_session_date;

      let newStreak = user.current_streak || 0;
      let newLongestStreak = user.longest_streak || 0;
      let newTotalSessions = (user.total_sessions || 0) + 1;

      if (!lastSession) {
        // First session ever
        newStreak = 1;
      } else {
        // Parse last_session_date as local date (avoid UTC shift)
        const [ly, lm, ld] = lastSession.split('T')[0].split('-').map(Number);
        const lastDate = new Date(ly, lm - 1, ld);
        const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
          // Already completed today, don't increment streak but don't reset either
          newTotalSessions = user.total_sessions || 0; // Don't double count
        } else if (diffDays === 1) {
          // Consecutive day - increment streak
          newStreak = (user.current_streak || 0) + 1;
        } else {
          // Streak broken - reset to 1
          newStreak = 1;
        }
      }

      // Update longest streak if current is higher
      if (newStreak > newLongestStreak) {
        newLongestStreak = newStreak;
      }

      // Update user profile
      const { error } = await supabase
        .from('users')
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak,
          total_sessions: newTotalSessions,
          last_session_date: today
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating streak:', error);
      } else {
        // Refresh user context
        refreshUser();
      }
    } catch (err) {
      console.error('Error in updateUserStreak:', err);
    }
  };

  const saveProgress = async () => {
    if (!user || !day) return;
    setSaving(true);

    try {
      await supabase
        .from('learning_progress')
        .upsert({
          user_id: user.id,
          day_number: day.day,
          completed: isCompleted,
          notes: notes,
          completed_activities: completedActivities
        }, {
          onConflict: 'user_id,day_number'
        });
    } catch (err) {
      console.error('Error saving progress:', err);
    } finally {
      setSaving(false);
    }
  };

  const goToNextDay = () => {
    const nextDay = (parseInt(dayNumber || '1')) + 1;
    if (nextDay <= 60) {
      navigate(`/learning-plan/day/${nextDay}`);
    } else {
      navigate('/learning-plan');
    }
  };

  const goToPrevDay = () => {
    const prevDay = (parseInt(dayNumber || '1')) - 1;
    if (prevDay >= 1) {
      navigate(`/learning-plan/day/${prevDay}`);
    }
  };

  const handleWritingComplete = async (evaluation: WritingEvaluation, userText: string) => {
    const newScore = evaluation.overallScore.score;
    setWritingCompleted(true);
    setWritingScore(newScore);
    setSavedWritingEvaluation(evaluation);
    setSavedWritingText(userText);

    // Auto-mark Writing activity as completed
    const newCompletedActivities = completedActivities.includes('Writing')
      ? completedActivities
      : [...completedActivities, 'Writing'];
    setCompletedActivities(newCompletedActivities);

    // Save evaluation to database with initial/best score tracking
    if (user && day) {
      try {
        const isFirstAttempt = writingAttemptCount === 0 || writingInitialScore === null;
        const newAttemptCount = writingAttemptCount + 1;
        const newBestScore = isFirstAttempt ? newScore : Math.max(writingBestScore ?? newScore, newScore);
        const newInitialScore = isFirstAttempt ? newScore : writingInitialScore;

        await supabase
          .from('writing_evaluations')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            evaluation: evaluation,
            score: newScore,
            initial_score: newInitialScore,
            best_score: newBestScore,
            attempt_count: newAttemptCount,
            user_text: userText,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,day_number'
          });

        // Update local state
        setWritingInitialScore(newInitialScore);
        setWritingBestScore(newBestScore);
        setWritingAttemptCount(newAttemptCount);

        // Also update progress
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });

        // Save vocabulary from this lesson
        await saveVocabulary();
      } catch (err) {
        console.error('Error saving writing evaluation:', err);
      }
    }
  };

  const handleSpeakingComplete = async (evaluation: SpeakingEvaluation, userTranscription: string) => {
    const newScore = evaluation.overallScore.score;
    setSpeakingCompleted(true);
    setSpeakingScore(newScore);
    setSavedSpeakingEvaluation(evaluation);
    setSavedSpeakingTranscription(userTranscription);

    // Update difficult words with any new words from this evaluation
    const newDifficultWords = evaluation.pronunciation?.difficultWords || [];
    if (newDifficultWords.length > 0) {
      setDifficultWords(prevWords => {
        const combined = [...prevWords, ...newDifficultWords];
        // Deduplicate
        return combined.filter((word, index, self) =>
          self.findIndex(w => w.toLowerCase() === word.toLowerCase()) === index
        );
      });
    }

    // Auto-mark Recording activity as completed
    const newCompletedActivities = completedActivities.includes('Recording')
      ? completedActivities
      : [...completedActivities, 'Recording'];
    setCompletedActivities(newCompletedActivities);

    // Save evaluation to database with initial/best score tracking
    if (user && day) {
      try {
        const isFirstAttempt = speakingAttemptCount === 0 || speakingInitialScore === null;
        const newAttemptCount = speakingAttemptCount + 1;
        const newBestScore = isFirstAttempt ? newScore : Math.max(speakingBestScore ?? newScore, newScore);
        const newInitialScore = isFirstAttempt ? newScore : speakingInitialScore;

        await supabase
          .from('speaking_evaluations')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            evaluation: evaluation,
            score: newScore,
            initial_score: newInitialScore,
            best_score: newBestScore,
            attempt_count: newAttemptCount,
            user_transcription: userTranscription,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,day_number'
          });

        // Update local state
        setSpeakingInitialScore(newInitialScore);
        setSpeakingBestScore(newBestScore);
        setSpeakingAttemptCount(newAttemptCount);

        // Also update progress
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });
        // Save vocabulary from this lesson
        await saveVocabulary();
      } catch (err) {
        console.error('Error saving speaking evaluation:', err);
      }
    }
  };

  // Build drill items from vocabulary and difficult words
  const drillItems = useMemo((): DrillItem[] => {
    if (!day) return [];

    const items: DrillItem[] = [];

    // Add vocabulary from today's lesson
    day.vocabulary.forEach(vocab => {
      items.push({
        word: vocab.word,
        definition: vocab.definition,
        example: vocab.example,
        source: 'vocabulary',
      });
    });

    // Add difficult words from past evaluations (if not already in vocabulary)
    const vocabWords = day.vocabulary.map(v => v.word.toLowerCase());
    difficultWords.forEach(word => {
      if (!vocabWords.includes(word.toLowerCase())) {
        items.push({
          word: word,
          definition: 'Practice this challenging word',
          example: `Try saying: ${word}`,
          source: 'difficult_word',
        });
      }
    });

    return items;
  }, [day, difficultWords]);

  const handleDrillComplete = async (results: DrillResult[], averageScore: number) => {
    setDrillScore(averageScore);

    // Auto-mark Pronunciation activity as completed
    const newCompletedActivities = completedActivities.includes('Pronunciation')
      ? completedActivities
      : [...completedActivities, 'Pronunciation'];
    setCompletedActivities(newCompletedActivities);

    // Save drill session to database
    if (user && day) {
      try {
        await supabase
          .from('pronunciation_drills')
          .insert({
            user_id: user.id,
            day_number: day.day,
            words_practiced: results.length,
            average_score: averageScore,
          });

        // Also update progress
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });
        // Save vocabulary from this lesson
        await saveVocabulary();
      } catch (err) {
        console.error('Error saving drill progress:', err);
      }
    }
  };

  const handleScoreUpdate = async (word: string, score: number) => {
    if (!user) return;

    // Determine mastery level based on score
    let masteryLevel = 'learning';
    if (score >= 9) masteryLevel = 'mastered';
    else if (score >= 7) masteryLevel = 'familiar';

    try {
      // Upsert the pronunciation score
      await supabase
        .from('pronunciation_scores')
        .upsert({
          user_id: user.id,
          word: word,
          score: score,
          mastery_level: masteryLevel,
          last_practiced: new Date().toISOString(),
        }, {
          onConflict: 'user_id,word'
        });
    } catch (err) {
      console.error('Error updating pronunciation score:', err);
    }
  };

  const handlePhonemeComplete = async (result: PhonemeSessionResult) => {
    setPhonemeScore(result.averageScore);

    // Auto-mark Phoneme activity as completed
    const newCompletedActivities = completedActivities.includes('Phoneme')
      ? completedActivities
      : [...completedActivities, 'Phoneme'];
    setCompletedActivities(newCompletedActivities);

    // Save phoneme exercise to database
    if (user && day) {
      try {
        await supabase
          .from('phoneme_exercises')
          .insert({
            user_id: user.id,
            day_number: day.day,
            sound_pair: result.soundPair,
            total_pairs: result.totalPairs,
            correct_pairs: result.correctPairs,
            average_score: result.averageScore,
            results: result.results,
          });

        // Also update progress
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });
        // Save vocabulary from this lesson
        await saveVocabulary();
      } catch (err) {
        console.error('Error saving phoneme exercise:', err);
      }
    }
  };

  const handleFluencyComplete = async (result: WritingFluencyResult) => {
    setFluencyScore(result.wpm);
    setSavedFluencyResult(result);

    // Auto-mark Fluency activity as completed
    const newCompletedActivities = completedActivities.includes('Fluency')
      ? completedActivities
      : [...completedActivities, 'Fluency'];
    setCompletedActivities(newCompletedActivities);

    // Save fluency drill to database
    if (user && day) {
      try {
        await supabase
          .from('writing_fluency_drills')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            prompt: day.writingPrompt || 'Free writing prompt',
            text: result.text,
            word_count: result.wordCount,
            duration_seconds: result.duration,
            wpm: result.wpm,
            evaluation: result.evaluation,
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'user_id,day_number'
          });

        // Also update progress
        await supabase
          .from('learning_progress')
          .upsert({
            user_id: user.id,
            day_number: day.day,
            completed: isCompleted,
            notes: notes,
            completed_activities: newCompletedActivities
          }, {
            onConflict: 'user_id,day_number'
          });
        // Save vocabulary from this lesson
        await saveVocabulary();
      } catch (err) {
        console.error('Error saving fluency drill:', err);
      }
    }
  };

  if (!day) {
    return (
      <div className="day-detail-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const allActivitiesCompleted = day.activities.every(a => completedActivities.includes(a.name));

  const handleSectionReaction = async (section: string, reaction: 'up' | 'down') => {
    const current = sectionReactions[section];
    const newReaction = current === reaction ? undefined : reaction;

    setSectionReactions(prev => {
      const updated = { ...prev };
      if (newReaction) {
        updated[section] = newReaction;
      } else {
        delete updated[section];
      }
      return updated;
    });

    if (user && newReaction) {
      try {
        await supabase.from('feedback').insert({
          user_id: user.id,
          type: 'content',
          message: `[Day ${day.day}] ${newReaction === 'up' ? '👍' : '👎'} on "${section}"`,
        });
      } catch (err) {
        console.error('Error saving reaction:', err);
      }
    }
  };

  const SectionReaction: React.FC<{ section: string }> = ({ section }) => (
    <span className="section-reactions">
      <button
        className={`reaction-btn ${sectionReactions[section] === 'up' ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); handleSectionReaction(section, 'up'); }}
        title="Helpful"
      >
        👍
      </button>
      <button
        className={`reaction-btn ${sectionReactions[section] === 'down' ? 'active' : ''}`}
        onClick={(e) => { e.stopPropagation(); handleSectionReaction(section, 'down'); }}
        title="Needs improvement"
      >
        👎
      </button>
    </span>
  );

  return (
    <div className="day-detail-page">
      <div className="day-header">
        <button onClick={() => navigate('/learning-plan')} className="back-button">
          &larr; Back to Plan
        </button>
        <div className="day-nav">
          <button onClick={goToPrevDay} disabled={day.day === 1} className="nav-btn">
            &larr; Day {day.day - 1}
          </button>
          <span className="day-indicator">Day {day.day} of 60</span>
          <button onClick={goToNextDay} disabled={day.day === 60} className="nav-btn">
            Day {day.day + 1} &rarr;
          </button>
        </div>
      </div>

      <div className="day-content">
        <div className="day-title-section">
          <div className="day-meta">
            <span className="week-badge">Week {day.week}</span>
            <span className="theme-badge">{day.theme}</span>
            {day.isReviewDay && <span className="review-badge">Review Day</span>}
            {isCompleted && <span className="completed-badge">Completed</span>}
          </div>
          <h1>{day.title}</h1>
          {day.transcript && (
            <p className="transcript-info">
              <strong>Transcript:</strong> {day.transcript}
              {day.lineRange && ` (Lines ${day.lineRange})`}
            </p>
          )}
        </div>

        <div className="day-grid">
          <div className="main-content">
            <section className="day-section focus-section">
              <h2>Today's Focus</h2>
              <p className="focus-area">{day.focusArea}</p>
            </section>

            {day.transcriptFile && (
              <TranscriptReader
                filename={day.transcriptFile.replace('.txt', '')}
                startLine={day.lineRange ? parseInt(day.lineRange.split('-')[0]) : undefined}
                endLine={day.lineRange ? parseInt(day.lineRange.split('-')[1]) : undefined}
                highlightWords={day.vocabulary.map(v => v.word)}
              />
            )}

            <section className="day-section activities-section">
              <h2>Activities Checklist {isCompleted && <SectionReaction section="Activities" />}</h2>
              <div className="activities-list">
                {day.activities.map((activity, index) => (
                  <div
                    key={index}
                    className={`activity-item ${completedActivities.includes(activity.name) ? 'completed' : ''}`}
                    onClick={() => toggleActivity(activity.name)}
                  >
                    <div className="activity-checkbox">
                      {completedActivities.includes(activity.name) ? '✓' : ''}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <span className="activity-name">{activity.name}</span>
                        <span className="activity-duration">{activity.duration}</span>
                      </div>
                      <p className="activity-description">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="day-section bonus-drills-section">
              <h2>
                Bonus Drills
                <button className="toggle-btn" onClick={() => setBonusDrillsExpanded(!bonusDrillsExpanded)}>
                  {bonusDrillsExpanded ? '▲' : '▼'}
                </button>
              </h2>
              {!bonusDrillsExpanded && (
                <p className="bonus-drills-hint">Extra practice to sharpen your pronunciation and writing fluency.</p>
              )}
              {bonusDrillsExpanded && (
                <>
                  <PronunciationDrill
                    items={drillItems}
                    dayNumber={day.day}
                    onComplete={handleDrillComplete}
                    onScoreUpdate={handleScoreUpdate}
                  />

                  <PhonemeExercise
                    dayNumber={day.day}
                    onComplete={handlePhonemeComplete}
                  />

                  <WritingFluencyDrill
                    dayNumber={day.day}
                    onComplete={handleFluencyComplete}
                    savedResult={savedFluencyResult}
                    isAuthenticated={isAuthenticated}
                  />
                </>
              )}
            </section>
          </div>

          <div className="sidebar">
            <section className="day-section vocabulary-section">
              <h2>
                Vocabulary ({day.vocabulary.length})
                <button className="toggle-btn" onClick={() => setVocabExpanded(!vocabExpanded)}>
                  {vocabExpanded ? '▲' : '▼'}
                </button>
              </h2>
              {vocabExpanded && (
                <div className="vocabulary-list">
                  {day.vocabulary.map((word, index) => (
                    <div key={index} className="vocabulary-card">
                      <div className="vocab-word">{word.word}</div>
                      <div className="vocab-definition">{word.definition}</div>
                      <div className="vocab-example">"{word.example}"</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="day-section phrases-section">
              <h2>
                Key Phrases to Learn ({day.keyPhrases.length})
                <button className="toggle-btn" onClick={() => setPhrasesExpanded(!phrasesExpanded)}>
                  {phrasesExpanded ? '▲' : '▼'}
                </button>
              </h2>
              {phrasesExpanded && (
                <div className="phrases-list">
                  {day.keyPhrases.map((phrase, index) => (
                    <div key={index} className="phrase-card">
                      <div className="phrase-text">"{phrase.phrase}"</div>
                      <div className="phrase-meaning">{phrase.meaning}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <WritingPractice
              prompt={day.writingPrompt}
              dayNumber={day.day}
              vocabularyToUse={day.vocabulary.map(v => v.word)}
              phrasesToUse={day.keyPhrases.map(p => p.phrase)}
              onComplete={handleWritingComplete}
              savedText={savedWritingText}
              savedEvaluation={savedWritingEvaluation}
              isAuthenticated={isAuthenticated}
            />

            <SpeakingPractice
              prompt={day.speakingPrompt}
              dayNumber={day.day}
              vocabularyToUse={day.vocabulary.map(v => v.word)}
              phrasesToUse={day.keyPhrases.map(p => p.phrase)}
              onComplete={handleSpeakingComplete}
              savedTranscription={savedSpeakingTranscription}
              savedEvaluation={savedSpeakingEvaluation}
              isAuthenticated={isAuthenticated}
            />

            <section className="day-section notes-section">
              <h2>Your Notes</h2>
              {isAuthenticated ? (
                <>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write your reflections, new words learned, or any notes here..."
                    className="notes-textarea"
                  />
                  <button onClick={saveProgress} disabled={saving} className="btn-secondary save-btn">
                    {saving ? 'Saving...' : 'Save Notes'}
                  </button>
                </>
              ) : (
                <p className="sign-in-prompt">
                  <a href="/auth">Sign in</a> to save notes and track your progress.
                </p>
              )}
            </section>

            {(writingScore !== null || speakingScore !== null || drillScore !== null || phonemeScore !== null || fluencyScore !== null) && (
              <section className="day-section scores-summary">
                <h2>Today's Scores</h2>
                <div className="scores-grid">
                  {writingScore !== null && (
                    <div className="score-summary-item">
                      <span className="score-label">Writing</span>
                      <span className="score-value">{writingBestScore ?? writingScore}/10</span>
                      {writingAttemptCount > 1 && writingInitialScore !== null && (
                        <div className="score-progress">
                          <span className="progress-label">Progress:</span>
                          <span className="progress-initial">{writingInitialScore}</span>
                          <span className="progress-arrow">&rarr;</span>
                          <span className="progress-best">{writingBestScore}</span>
                          {writingBestScore !== null && writingInitialScore !== null && writingBestScore > writingInitialScore && (
                            <span className="progress-improvement">+{(writingBestScore - writingInitialScore).toFixed(1)}</span>
                          )}
                        </div>
                      )}
                      {writingAttemptCount > 0 && (
                        <span className="attempt-count">{writingAttemptCount} attempt{writingAttemptCount > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  )}
                  {speakingScore !== null && (
                    <div className="score-summary-item">
                      <span className="score-label">Speaking</span>
                      <span className="score-value">{speakingBestScore ?? speakingScore}/10</span>
                      {speakingAttemptCount > 1 && speakingInitialScore !== null && (
                        <div className="score-progress">
                          <span className="progress-label">Progress:</span>
                          <span className="progress-initial">{speakingInitialScore}</span>
                          <span className="progress-arrow">&rarr;</span>
                          <span className="progress-best">{speakingBestScore}</span>
                          {speakingBestScore !== null && speakingInitialScore !== null && speakingBestScore > speakingInitialScore && (
                            <span className="progress-improvement">+{(speakingBestScore - speakingInitialScore).toFixed(1)}</span>
                          )}
                        </div>
                      )}
                      {speakingAttemptCount > 0 && (
                        <span className="attempt-count">{speakingAttemptCount} attempt{speakingAttemptCount > 1 ? 's' : ''}</span>
                      )}
                    </div>
                  )}
                  {drillScore !== null && (
                    <div className="score-summary-item">
                      <span className="score-label">Pronunciation</span>
                      <span className="score-value">{drillScore.toFixed(1)}/10</span>
                    </div>
                  )}
                  {phonemeScore !== null && (
                    <div className="score-summary-item">
                      <span className="score-label">Phoneme</span>
                      <span className="score-value">{phonemeScore.toFixed(1)}/10</span>
                    </div>
                  )}
                  {fluencyScore !== null && (
                    <div className="score-summary-item">
                      <span className="score-label">Fluency</span>
                      <span className="score-value">{fluencyScore.toFixed(1)} WPM</span>
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>
        </div>

        <div className="day-footer">
          {isAuthenticated ? (
            !isCompleted ? (
              <button
                onClick={markDayComplete}
                disabled={saving || !allActivitiesCompleted}
                className="btn-primary complete-btn"
              >
                {saving ? 'Saving...' : allActivitiesCompleted ? 'Mark Day as Complete' : 'Complete all activities first'}
              </button>
            ) : (
              <div className="completed-message">
                <span className="check-icon">✓</span>
                Day completed! Great work!
                <button onClick={goToNextDay} className="btn-primary next-btn">
                  Continue to Day {day.day + 1} &rarr;
                </button>
              </div>
            )
          ) : (
            <div className="sign-in-footer">
              <a href="/auth" className="btn-primary">Sign in to save progress</a>
              <button onClick={goToNextDay} disabled={day.day === 60} className="btn-secondary next-btn">
                Next Day &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
