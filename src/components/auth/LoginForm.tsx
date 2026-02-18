import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('LoginForm: Submitting sign in...');

    try {
      await signIn(email, password);
      console.log('LoginForm: Sign in completed successfully');
    } catch (err: any) {
      console.error('LoginForm: Sign in failed', err);
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
      console.log('LoginForm: Loading state set to false');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  if (forgotPassword) {
    return (
      <div className="auth-form">
        <h2>Reset Password</h2>
        <p className="subtitle">Enter your email to receive a password reset link</p>

        {error && <div className="error-message">{error}</div>}
        {resetSent && (
          <div className="success-message">
            Check your email for a password reset link.
          </div>
        )}

        {!resetSent && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="toggle-mode">
          <button
            onClick={() => {
              setForgotPassword(false);
              setResetSent(false);
              setError('');
            }}
            className="link-button"
          >
            Back to login
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h2>Welcome Back</h2>
      <p className="subtitle">Sign in to continue your English learning journey</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>

        <p className="forgot-password">
          <button
            type="button"
            onClick={() => { setForgotPassword(true); setError(''); }}
            className="link-button"
          >
            Forgot password?
          </button>
        </p>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="toggle-mode">
        Don't have an account?{' '}
        <button onClick={onToggleMode} className="link-button">
          Sign up
        </button>
      </p>
    </div>
  );
};
