-- SpeakUp Pro Database Schema
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  last_session_date DATE
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Conversation feedback table
CREATE TABLE IF NOT EXISTS public.conversation_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  strengths TEXT[] DEFAULT ARRAY[]::TEXT[],
  grammar_corrections JSONB DEFAULT '[]'::jsonb,
  vocabulary_upgrades JSONB DEFAULT '[]'::jsonb,
  fluency_notes TEXT[] DEFAULT ARRAY[]::TEXT[],
  new_vocabulary JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.conversation_feedback ENABLE ROW LEVEL SECURITY;

-- Feedback policies
CREATE POLICY "Users can view feedback for own conversations"
  ON public.conversation_feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_feedback.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert feedback for own conversations"
  ON public.conversation_feedback FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE conversations.id = conversation_feedback.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

-- Vocabulary table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  definition TEXT NOT NULL,
  example_sentence TEXT NOT NULL,
  learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mastery_level TEXT DEFAULT 'new' CHECK (mastery_level IN ('new', 'learning', 'mastered')),
  times_reviewed INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;

-- Vocabulary policies
CREATE POLICY "Users can view own vocabulary"
  ON public.vocabulary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vocabulary"
  ON public.vocabulary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary"
  ON public.vocabulary FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_started_at ON public.conversations(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_vocabulary_user_id ON public.vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_mastery ON public.vocabulary(mastery_level);
CREATE INDEX IF NOT EXISTS idx_feedback_conversation_id ON public.conversation_feedback(conversation_id);

-- Streak is updated client-side when a day plan is marked complete (DayDetailPage.tsx)

-- ============================================
-- Learning Progress Tracking
-- ============================================

-- Track user progress on each day's lesson
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  completed_activities TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning progress"
  ON public.learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning progress"
  ON public.learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learning progress"
  ON public.learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user_day ON public.learning_progress(user_id, day_number);

-- ============================================
-- Writing and Speaking Evaluations
-- ============================================

CREATE TABLE IF NOT EXISTS public.writing_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  evaluation JSONB NOT NULL,
  score NUMERIC,
  initial_score NUMERIC,
  best_score NUMERIC,
  attempt_count INTEGER DEFAULT 1,
  user_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.writing_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own writing evaluations"
  ON public.writing_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own writing evaluations"
  ON public.writing_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own writing evaluations"
  ON public.writing_evaluations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_writing_evaluations_user_day ON public.writing_evaluations(user_id, day_number);

CREATE TABLE IF NOT EXISTS public.speaking_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  evaluation JSONB NOT NULL,
  score NUMERIC,
  initial_score NUMERIC,
  best_score NUMERIC,
  attempt_count INTEGER DEFAULT 1,
  user_transcription TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.speaking_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own speaking evaluations"
  ON public.speaking_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own speaking evaluations"
  ON public.speaking_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own speaking evaluations"
  ON public.speaking_evaluations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_speaking_evaluations_user_day ON public.speaking_evaluations(user_id, day_number);

-- ============================================
-- Pronunciation Drills Feature
-- ============================================

-- Pronunciation drill sessions
CREATE TABLE IF NOT EXISTS public.pronunciation_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  words_practiced INTEGER DEFAULT 0,
  average_score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.pronunciation_drills ENABLE ROW LEVEL SECURITY;

-- Pronunciation drills policies
CREATE POLICY "Users can view own pronunciation drills"
  ON public.pronunciation_drills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pronunciation drills"
  ON public.pronunciation_drills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pronunciation drills"
  ON public.pronunciation_drills FOR UPDATE
  USING (auth.uid() = user_id);

-- Individual word scores for spaced repetition
CREATE TABLE IF NOT EXISTS public.pronunciation_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  score NUMERIC NOT NULL,
  attempts INTEGER DEFAULT 1,
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mastery_level TEXT DEFAULT 'learning' CHECK (mastery_level IN ('learning', 'familiar', 'mastered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word)
);

-- Enable Row Level Security
ALTER TABLE public.pronunciation_scores ENABLE ROW LEVEL SECURITY;

-- Pronunciation scores policies
CREATE POLICY "Users can view own pronunciation scores"
  ON public.pronunciation_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pronunciation scores"
  ON public.pronunciation_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pronunciation scores"
  ON public.pronunciation_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for pronunciation tables
CREATE INDEX IF NOT EXISTS idx_pronunciation_drills_user_id ON public.pronunciation_drills(user_id);
CREATE INDEX IF NOT EXISTS idx_pronunciation_drills_day ON public.pronunciation_drills(day_number);
CREATE INDEX IF NOT EXISTS idx_pronunciation_scores_user_id ON public.pronunciation_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_pronunciation_scores_mastery ON public.pronunciation_scores(mastery_level);
CREATE INDEX IF NOT EXISTS idx_pronunciation_scores_last_practiced ON public.pronunciation_scores(last_practiced);

-- ============================================
-- Migration: Add progress tracking columns
-- Run this if you have existing tables
-- ============================================

-- Add initial_score, best_score, attempt_count, user_text to writing_evaluations
ALTER TABLE public.writing_evaluations
  ADD COLUMN IF NOT EXISTS initial_score NUMERIC,
  ADD COLUMN IF NOT EXISTS best_score NUMERIC,
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS user_text TEXT;

-- Add unique constraint if not exists (for upsert support)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'writing_evaluations_user_id_day_number_key'
  ) THEN
    ALTER TABLE public.writing_evaluations ADD CONSTRAINT writing_evaluations_user_id_day_number_key UNIQUE (user_id, day_number);
  END IF;
END $$;

-- Add update policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'writing_evaluations' AND policyname = 'Users can update own writing evaluations'
  ) THEN
    CREATE POLICY "Users can update own writing evaluations"
      ON public.writing_evaluations FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add initial_score, best_score, attempt_count, user_transcription to speaking_evaluations
ALTER TABLE public.speaking_evaluations
  ADD COLUMN IF NOT EXISTS initial_score NUMERIC,
  ADD COLUMN IF NOT EXISTS best_score NUMERIC,
  ADD COLUMN IF NOT EXISTS attempt_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS user_transcription TEXT;

-- Add unique constraint if not exists (for upsert support)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'speaking_evaluations_user_id_day_number_key'
  ) THEN
    ALTER TABLE public.speaking_evaluations ADD CONSTRAINT speaking_evaluations_user_id_day_number_key UNIQUE (user_id, day_number);
  END IF;
END $$;

-- Add update policy if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'speaking_evaluations' AND policyname = 'Users can update own speaking evaluations'
  ) THEN
    CREATE POLICY "Users can update own speaking evaluations"
      ON public.speaking_evaluations FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Backfill existing records: set initial_score and best_score to current score
UPDATE public.writing_evaluations
SET initial_score = score, best_score = score
WHERE initial_score IS NULL AND score IS NOT NULL;

UPDATE public.speaking_evaluations
SET initial_score = score, best_score = score
WHERE initial_score IS NULL AND score IS NOT NULL;

-- ============================================
-- Phoneme Exercises Feature
-- ============================================

-- Phoneme exercise sessions
CREATE TABLE IF NOT EXISTS public.phoneme_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  sound_pair TEXT NOT NULL,
  total_pairs INTEGER,
  correct_pairs INTEGER,
  average_score NUMERIC,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.phoneme_exercises ENABLE ROW LEVEL SECURITY;

-- Phoneme exercises policies
CREATE POLICY "Users can view own phoneme exercises"
  ON public.phoneme_exercises FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phoneme exercises"
  ON public.phoneme_exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phoneme exercises"
  ON public.phoneme_exercises FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for phoneme exercises
CREATE INDEX IF NOT EXISTS idx_phoneme_exercises_user_id ON public.phoneme_exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_phoneme_exercises_day ON public.phoneme_exercises(day_number);
CREATE INDEX IF NOT EXISTS idx_phoneme_exercises_sound_pair ON public.phoneme_exercises(sound_pair);

-- ============================================
-- Job Search Progress Tracking
-- ============================================

-- Track user progress on job search plan
CREATE TABLE IF NOT EXISTS public.job_search_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  completed_activities TEXT[] DEFAULT '{}',
  applications_submitted INTEGER DEFAULT 0,
  networking_contacts_made INTEGER DEFAULT 0,
  interviews_scheduled INTEGER DEFAULT 0,
  interviews_completed INTEGER DEFAULT 0,
  follow_ups_sent INTEGER DEFAULT 0,
  companies_researched INTEGER DEFAULT 0,
  wins_of_the_day TEXT,
  challenges_faced TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

-- Enable Row Level Security
ALTER TABLE public.job_search_progress ENABLE ROW LEVEL SECURITY;

-- Job search progress policies
CREATE POLICY "Users can view own job search progress"
  ON public.job_search_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job search progress"
  ON public.job_search_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job search progress"
  ON public.job_search_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for job search progress
CREATE INDEX IF NOT EXISTS idx_job_search_progress_user_id ON public.job_search_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_job_search_progress_user_day ON public.job_search_progress(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_job_search_progress_completed ON public.job_search_progress(completed);

-- ============================================
-- Resume Evaluations
-- ============================================

CREATE TABLE IF NOT EXISTS public.resume_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  resume_text TEXT NOT NULL,
  target_role TEXT,
  target_company TEXT,
  evaluation JSONB NOT NULL,
  score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.resume_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own resume evaluations"
  ON public.resume_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own resume evaluations"
  ON public.resume_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own resume evaluations"
  ON public.resume_evaluations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own resume evaluations"
  ON public.resume_evaluations FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_resume_evaluations_user_id ON public.resume_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_evaluations_created ON public.resume_evaluations(created_at DESC);

-- ============================================
-- LinkedIn Evaluations
-- ============================================

CREATE TABLE IF NOT EXISTS public.linkedin_evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_text TEXT NOT NULL,
  target_role TEXT,
  target_industry TEXT,
  evaluation JSONB NOT NULL,
  score NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.linkedin_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own linkedin evaluations"
  ON public.linkedin_evaluations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linkedin evaluations"
  ON public.linkedin_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own linkedin evaluations"
  ON public.linkedin_evaluations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own linkedin evaluations"
  ON public.linkedin_evaluations FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_linkedin_evaluations_user_id ON public.linkedin_evaluations(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_evaluations_created ON public.linkedin_evaluations(created_at DESC);

-- ============================================
-- Job Applications Tracking
-- ============================================

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'researching',
  source TEXT NOT NULL DEFAULT 'linkedin',
  job_url TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  location TEXT,
  is_remote BOOLEAN DEFAULT false,
  contact_name TEXT,
  contact_email TEXT,
  contact_linkedin TEXT,
  notes TEXT,
  resume_version TEXT,
  cover_letter_used BOOLEAN DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  response_at TIMESTAMP WITH TIME ZONE,
  phone_screen_at TIMESTAMP WITH TIME ZONE,
  interview_at TIMESTAMP WITH TIME ZONE,
  offer_at TIMESTAMP WITH TIME ZONE,
  follow_up_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own job applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own job applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_job_applications_updated ON public.job_applications(updated_at DESC);

-- ============================================
-- Writing Fluency Drills
-- ============================================

CREATE TABLE IF NOT EXISTS public.writing_fluency_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  text TEXT NOT NULL,
  word_count INTEGER NOT NULL,
  duration_seconds INTEGER NOT NULL,
  wpm NUMERIC NOT NULL,
  evaluation JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, day_number)
);

ALTER TABLE public.writing_fluency_drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own writing fluency drills"
  ON public.writing_fluency_drills FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own writing fluency drills"
  ON public.writing_fluency_drills FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own writing fluency drills"
  ON public.writing_fluency_drills FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_writing_fluency_drills_user_id ON public.writing_fluency_drills(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_fluency_drills_user_day ON public.writing_fluency_drills(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_writing_fluency_drills_wpm ON public.writing_fluency_drills(wpm DESC);
