import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

console.log('Supabase client created successfully');

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          created_at: string;
          current_streak: number;
          longest_streak: number;
          total_sessions: number;
          last_session_date: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          topic: string;
          started_at: string;
          ended_at: string | null;
          duration_seconds: number | null;
          messages: any;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      conversation_feedback: {
        Row: {
          id: string;
          conversation_id: string;
          strengths: string[];
          grammar_corrections: any;
          vocabulary_upgrades: any;
          fluency_notes: string[];
          new_vocabulary: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['conversation_feedback']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['conversation_feedback']['Insert']>;
      };
      vocabulary: {
        Row: {
          id: string;
          user_id: string;
          word: string;
          definition: string;
          example_sentence: string;
          learned_at: string;
          mastery_level: 'new' | 'learning' | 'mastered';
          times_reviewed: number;
          last_reviewed: string | null;
        };
        Insert: Omit<Database['public']['Tables']['vocabulary']['Row'], 'id' | 'learned_at'>;
        Update: Partial<Database['public']['Tables']['vocabulary']['Insert']>;
      };
    };
  };
}
