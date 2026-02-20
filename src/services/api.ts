import type { Message, ConversationFeedback, WritingEvaluation, SpeakingEvaluation, PronunciationEvaluation, ResumeEvaluation, LinkedInEvaluation, WritingFluencyEvaluation } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Fetch with timeout and auto-retry (handles Render cold starts)
async function fetchWithRetry(url: string, options: RequestInit, retries = 1, timeoutMs = 60000): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      if (response.ok || attempt === retries) return response;
      // Retry on server errors (5xx) which can happen during cold start
      if (response.status >= 500) continue;
      return response;
    } catch (err) {
      clearTimeout(timeout);
      if (attempt === retries) throw err;
      // Wait briefly before retry
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Request failed after retries');
}

export interface ChatRequest {
  conversationId: string;
  messages: Message[];
  topic: string;
  isFirstMessage?: boolean;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
}

export interface FeedbackRequest {
  conversationId: string;
  messages: Message[];
  topic: string;
}

export interface FeedbackResponse {
  feedback: ConversationFeedback;
}

export interface WritingEvaluationRequest {
  text: string;
  prompt: string;
  dayNumber: number;
  vocabularyToUse: string[];
  phrasesToUse: string[];
}

export interface WritingEvaluationResponse {
  evaluation: WritingEvaluation;
}

export interface SpeakingEvaluationRequest {
  transcription: string;
  prompt: string;
  dayNumber: number;
  vocabularyToUse: string[];
  phrasesToUse: string[];
}

export interface SpeakingEvaluationResponse {
  evaluation: SpeakingEvaluation;
}

export interface PronunciationEvaluationRequest {
  word: string;
  transcription: string;
  context?: string;
}

export interface PronunciationEvaluationResponse {
  evaluation: PronunciationEvaluation;
}

export interface PronunciationAttempt {
  word: string;
  transcription: string;
}

export interface BatchPronunciationEvaluation {
  word: string;
  score: number;
  feedback: string;
  isCorrect: boolean;
}

export interface BatchPronunciationEvaluationResponse {
  evaluations: BatchPronunciationEvaluation[];
}

export interface ResumeEvaluationRequest {
  resumeText: string;
  targetRole?: string;
  targetCompany?: string;
  focusAreas?: string[];
}

export interface ResumeEvaluationResponse {
  evaluation: ResumeEvaluation;
}

export interface LinkedInEvaluationRequest {
  profileText: string;
  targetRole?: string;
  targetIndustry?: string;
}

export interface LinkedInEvaluationResponse {
  evaluation: LinkedInEvaluation;
}

export interface WritingFluencyEvaluationRequest {
  text: string;
  prompt: string;
  durationSeconds: number;
  wordCount: number;
  wpm: number;
}

export interface WritingFluencyEvaluationResponse {
  evaluation: WritingFluencyEvaluation;
}

export const api = {
  // Send message to AI agent and get response
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  },

  // Get conversation feedback from AI agent
  async getFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to get feedback');
    }

    return response.json();
  },

  // Evaluate writing practice
  async evaluateWriting(request: WritingEvaluationRequest): Promise<WritingEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-writing`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate writing');
    }

    return response.json();
  },

  // Evaluate speaking practice
  async evaluateSpeaking(request: SpeakingEvaluationRequest): Promise<SpeakingEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-speaking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate speaking');
    }

    return response.json();
  },

  // Evaluate pronunciation for single word (kept for backwards compatibility)
  async evaluatePronunciation(request: PronunciationEvaluationRequest): Promise<PronunciationEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-pronunciation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate pronunciation');
    }

    return response.json();
  },

  // Batch evaluate pronunciation for multiple words (more cost-effective)
  async evaluatePronunciationBatch(attempts: PronunciationAttempt[]): Promise<BatchPronunciationEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-pronunciation-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attempts }),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate pronunciation');
    }

    return response.json();
  },

  // Evaluate resume for PM roles
  async evaluateResume(request: ResumeEvaluationRequest): Promise<ResumeEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate resume');
    }

    return response.json();
  },

  // Evaluate LinkedIn profile for PM roles
  async evaluateLinkedIn(request: LinkedInEvaluationRequest): Promise<LinkedInEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-linkedin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate LinkedIn profile');
    }

    return response.json();
  },

  // Evaluate writing fluency drill
  async evaluateWritingFluency(request: WritingFluencyEvaluationRequest): Promise<WritingFluencyEvaluationResponse> {
    const response = await fetchWithRetry(`${API_URL}/api/evaluate-writing-fluency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Failed to evaluate writing fluency');
    }

    return response.json();
  },
};
