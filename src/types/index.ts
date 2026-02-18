// User types
export type User = {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
  last_session_date: string | null;
}

// Conversation types
export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type Conversation = {
  id: string;
  user_id: string;
  topic: string;
  started_at: string;
  ended_at?: string;
  duration_seconds?: number;
  messages: Message[];
  feedback?: ConversationFeedback;
}

// Feedback types
export type GrammarCorrection = {
  incorrect: string;
  correct: string;
  explanation: string;
}

export type VocabularyUpgrade = {
  original: string;
  suggestions: string[];
}

export type ConversationFeedback = {
  id: string;
  conversation_id: string;
  strengths: string[];
  grammar_corrections: GrammarCorrection[];
  vocabulary_upgrades: VocabularyUpgrade[];
  fluency_notes: string[];
  new_vocabulary: VocabularyItem[];
  created_at: string;
}

// Vocabulary types
export type VocabularyItem = {
  id: string;
  user_id: string;
  word: string;
  definition: string;
  example_sentence: string;
  learned_at: string;
  mastery_level: 'new' | 'learning' | 'mastered';
  times_reviewed: number;
  last_reviewed?: string;
}

// Topic types
export type TopicCategory = 'business' | 'technology' | 'casual' | 'interview' | 'custom';

export type Topic = {
  id: string;
  category: TopicCategory;
  title: string;
  description: string;
  example_questions?: string[];
}

// Session types
export type SessionStats = {
  date: string;
  duration_minutes: number;
  new_vocabulary_count: number;
  corrections_count: number;
}

// Speech recognition types
export type SpeechRecognitionResult = {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

// API Response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
}

// Learning Plan types
export type LearningProgress = {
  id: string;
  user_id: string;
  day_number: number;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  vocabulary_learned: string[];
  time_spent_minutes?: number;
}

// Evaluation types for writing and speaking practice
export type EvaluationScore = {
  score: number; // 1-10
  label: string; // "Excellent", "Good", "Fair", "Needs Improvement"
}

export type WritingEvaluation = {
  overallScore: EvaluationScore;
  grammar: {
    score: EvaluationScore;
    corrections: Array<{
      original: string;
      corrected: string;
      explanation: string;
    }>;
  };
  vocabulary: {
    score: EvaluationScore;
    wordsUsedFromLesson: string[];
    suggestedUpgrades: Array<{
      original: string;
      suggestions: string[];
    }>;
  };
  content: {
    score: EvaluationScore;
    feedback: string;
    relevanceToPrompt: boolean;
  };
  fluency: {
    score: EvaluationScore;
    feedback: string;
  };
  encouragement: string;
  nextSteps: string[];
}

export type SpeakingEvaluation = {
  overallScore: EvaluationScore;
  transcription: string;
  pronunciation: {
    score: EvaluationScore;
    feedback: string;
    difficultWords: string[];
  };
  grammar: {
    score: EvaluationScore;
    corrections: Array<{
      spoken: string;
      corrected: string;
      explanation: string;
    }>;
  };
  vocabulary: {
    score: EvaluationScore;
    wordsUsedFromLesson: string[];
    feedback: string;
  };
  fluency: {
    score: EvaluationScore;
    feedback: string;
    fillerWordsUsed: string[];
  };
  encouragement: string;
  practiceRecommendations: string[];
}

// Pronunciation Drill types
export type DrillItem = {
  word: string;
  definition: string;
  example: string;
  phonetic?: string;
  previousScore?: number;
  source: 'vocabulary' | 'difficult_word' | 'review';
}

export type DrillResult = {
  word: string;
  transcription: string;
  score: number;
  feedback: string;
  isCorrect: boolean;
}

export type DrillSession = {
  items: DrillItem[];
  results: DrillResult[];
  averageScore: number;
}

export type PronunciationEvaluation = {
  score: number;
  feedback: string;
  isCorrect: boolean;
  suggestions?: string[];
}

// Phoneme Exercise types
export type PhonemeResult = {
  word1: string;
  word2: string;
  word1Score: number;
  word2Score: number;
  word1Transcription: string;
  word2Transcription: string;
  distinguishedCorrectly: boolean;
};

export type PhonemeSessionResult = {
  soundPair: string;
  totalPairs: number;
  correctPairs: number;
  averageScore: number;
  results: PhonemeResult[];
};

// Job Search Progress types
export type JobSearchDayProgress = {
  id: string;
  user_id: string;
  day_number: number;
  completed: boolean;
  completed_at?: string;
  notes?: string;
  completed_activities: string[];
  applications_submitted: number;
  networking_contacts_made: number;
  interviews_scheduled: number;
  interviews_completed: number;
  follow_ups_sent: number;
  companies_researched: number;
  wins_of_the_day?: string;
  challenges_faced?: string;
};

// Resume Evaluation types
export type ResumeBulletEvaluation = {
  original: string;
  score: number;
  feedback: string;
  improved: string;
  hasMetrics: boolean;
  hasActionVerb: boolean;
  pmRelevance: 'high' | 'medium' | 'low';
};

export type ResumeEvaluation = {
  overallScore: EvaluationScore;
  impactStatements: {
    score: EvaluationScore;
    feedback: string;
    bulletEvaluations: ResumeBulletEvaluation[];
  };
  metrics: {
    score: EvaluationScore;
    feedback: string;
    bulletsWithMetrics: number;
    totalBullets: number;
    suggestions: string[];
  };
  actionVerbs: {
    score: EvaluationScore;
    verbsUsed: string[];
    weakVerbs: Array<{ weak: string; stronger: string[] }>;
  };
  pmSkills: {
    score: EvaluationScore;
    skillsIdentified: string[];
    missingSkills: string[];
    feedback: string;
  };
  atsOptimization: {
    score: EvaluationScore;
    keywordsFound: string[];
    missingKeywords: string[];
    feedback: string;
  };
  formatting: {
    score: EvaluationScore;
    feedback: string;
    issues: string[];
  };
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
};

// LinkedIn Evaluation types
export type LinkedInSectionEvaluation = {
  score: EvaluationScore;
  feedback: string;
  suggestions: string[];
};

export type LinkedInEvaluation = {
  overallScore: EvaluationScore;
  headline: {
    score: EvaluationScore;
    current: string;
    feedback: string;
    improved: string[];
  };
  summary: {
    score: EvaluationScore;
    feedback: string;
    keyElements: {
      hasHook: boolean;
      hasValue: boolean;
      hasProof: boolean;
      hasCTA: boolean;
    };
    improved: string;
  };
  experience: {
    score: EvaluationScore;
    feedback: string;
    bulletEvaluations: Array<{
      original: string;
      score: number;
      feedback: string;
      improved: string;
    }>;
  };
  skills: {
    score: EvaluationScore;
    found: string[];
    missing: string[];
    feedback: string;
  };
  keywords: {
    score: EvaluationScore;
    found: string[];
    missing: string[];
    feedback: string;
  };
  profileStrength: {
    score: EvaluationScore;
    hasPhoto: boolean;
    hasBanner: boolean;
    hasFeatured: boolean;
    hasRecommendations: boolean;
    connectionsLevel: 'low' | 'medium' | 'high';
    feedback: string;
  };
  strengths: string[];
  improvements: string[];
  nextSteps: string[];
};

// Job Application Tracking types
export type ApplicationStatus =
  | 'researching'
  | 'ready_to_apply'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'final_round'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export type ApplicationSource =
  | 'linkedin'
  | 'company_website'
  | 'indeed'
  | 'glassdoor'
  | 'referral'
  | 'recruiter'
  | 'networking'
  | 'other';

export type JobApplication = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  status: ApplicationStatus;
  source: ApplicationSource;
  job_url?: string;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  is_remote?: boolean;
  contact_name?: string;
  contact_email?: string;
  contact_linkedin?: string;
  notes?: string;
  resume_version?: string;
  cover_letter_used?: boolean;
  applied_at?: string;
  response_at?: string;
  phone_screen_at?: string;
  interview_at?: string;
  offer_at?: string;
  follow_up_at?: string;
  created_at: string;
  updated_at: string;
};

export type ApplicationStats = {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  bySource: Record<ApplicationSource, number>;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  avgDaysToResponse: number;
};

// Writing Fluency Drill types
export type WritingFluencyEvaluation = {
  overallFluencyScore: EvaluationScore;
  metrics: {
    wordsWritten: number;
    wordsPerMinute: number;
    wpmRating: EvaluationScore;
    targetWpm: number;
  };
  sentenceAnalysis: {
    score: EvaluationScore;
    totalSentences: number;
    avgWordsPerSentence: number;
    varietyFeedback: string;
  };
  flowAndCoherence: {
    score: EvaluationScore;
    feedback: string;
    transitionsUsed: string[];
    suggestedTransitions: string[];
  };
  writingMomentum: {
    score: EvaluationScore;
    feedback: string;
  };
  encouragement: string;
  nextSteps: string[];
};

export type WritingFluencyDrillResult = {
  id: string;
  user_id: string;
  day_number: number;
  prompt: string;
  text: string;
  word_count: number;
  duration_seconds: number;
  wpm: number;
  evaluation: WritingFluencyEvaluation;
  created_at: string;
};
