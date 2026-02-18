import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isRecovery: boolean;
  clearRecovery: () => void;
  isEmailConfirmation: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRecovery, setIsRecovery] = useState(() => {
    // Detect recovery flow from URL before any async auth resolves
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    return params.has('recovery') || hash.includes('type=recovery');
  });
  const [isEmailConfirmation, setIsEmailConfirmation] = useState(() => {
    const hash = window.location.hash;
    return hash.includes('type=signup') || hash.includes('type=email');
  });
  // Ref mirror for synchronous reads inside onAuthStateChange
  const isEmailConfirmationRef = useRef(isEmailConfirmation);

  // useRef is StrictMode-safe (persists across re-renders)
  const isMountedRef = useRef(true);

  const fetchOrCreateProfile = async (authUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('fetchUserProfile error:', error);
        return null;
      }

      // Profile exists — return it
      if (data) return data as User;

      // No profile yet — create one (happens on first sign-in after email confirmation)
      console.log('AuthContext: No profile found, creating one for', authUser.id);
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || authUser.email!.split('@')[0],
          current_streak: 0,
          longest_streak: 0,
          total_sessions: 0,
          last_session_date: null,
        })
        .select()
        .single();

      if (createError) {
        console.error('AuthContext: Auto-create profile failed:', createError.message);
        return null;
      }

      console.log('AuthContext: Profile auto-created successfully');
      return newProfile as User;
    } catch (e) {
      console.error('fetchUserProfile exception:', e);
      return null;
    }
  };

  const refreshUser = async () => {
    if (supabaseUser) {
      const profile = await fetchOrCreateProfile(supabaseUser);
      if (isMountedRef.current) {
        setUser(profile);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    let authStateReceived = false;

    console.log('AuthContext: Initializing...');

    // 1️⃣ Initialize session once (NO profile fetch here - prevents race condition)
    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMountedRef.current) return;

      console.log('AuthContext: getSession completed', {
        hasSession: !!data.session,
        hasError: !!error,
        error: error?.message
      });

      // Don't set session if this is an email confirmation
      if (isEmailConfirmationRef.current && data.session) {
        console.log('AuthContext: Email confirmation flow — skipping session set');
        return;
      }

      setSession(data.session);
      setSupabaseUser(data.session?.user ?? null);

      // Fallback: if no auth state change received within 2 seconds, set loading=false
      setTimeout(() => {
        if (!authStateReceived && isMountedRef.current) {
          console.log('AuthContext: Fallback - setting loading=false (no auth state change received)');
          setLoading(false);
        }
      }, 2000);
    }).catch((err) => {
      console.error('AuthContext: getSession error:', err);
      if (isMountedRef.current) {
        setLoading(false);
      }
    });

    // 2️⃣ Single source of truth: auth state changes handle profile fetching
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMountedRef.current) return;

      authStateReceived = true;
      console.log('AuthContext: onAuthStateChange', { event: _event, hasSession: !!session });

      if (_event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }

      // Email confirmation: suppress session so user sees the login form
      if (isEmailConfirmationRef.current) {
        console.log('AuthContext: Email confirmation flow — suppressing session');
        setLoading(false);
        return;
      }

      setSession(session);
      setSupabaseUser(session?.user ?? null);

      // Set loading=false FIRST, then fetch profile in background
      // This prevents the app from hanging if profile fetch is slow
      setLoading(false);

      if (session?.user) {
        // Fetch (or create) profile in background - don't block the UI
        fetchOrCreateProfile(session.user).then((profile) => {
          if (isMountedRef.current) {
            setUser(profile);
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('AuthContext: Starting sign up...');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          full_name: fullName || email.split('@')[0],
        },
      },
    });

    if (error) {
      console.error('AuthContext: Sign up auth error:', error);
      throw error;
    }

    console.log('AuthContext: Auth signup successful, user:', data.user?.id);
    // Profile will be auto-created on first sign-in after email confirmation
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Starting sign in...');

    // Clear email confirmation flag synchronously so onAuthStateChange will set the session
    isEmailConfirmationRef.current = false;
    setIsEmailConfirmation(false);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    console.log('AuthContext: Sign in response received', { hasError: !!error });
    if (error) {
      console.error('AuthContext: Sign in error:', error);
      throw error;
    }
    console.log('AuthContext: Sign in successful - auth state listener will handle the rest');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const changePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?recovery=true`,
    });
    if (error) throw error;
  };

  const clearRecovery = () => {
    setIsRecovery(false);
  };

  const value = {
    user,
    supabaseUser,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
    changePassword,
    resetPassword,
    isRecovery,
    clearRecovery,
    isEmailConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
