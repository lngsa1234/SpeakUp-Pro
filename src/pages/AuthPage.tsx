import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';

const SetNewPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { changePassword, clearRecovery } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await changePassword(password);
      setSuccess(true);
      setTimeout(() => {
        clearRecovery();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Set New Password</h2>
      <p className="subtitle">Enter your new password below</p>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Password updated! Redirecting to dashboard...
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
};

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isRecovery, isEmailConfirmation } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>SpeakUp Pro</h1>
          <p>Your Personal English Coach</p>
        </div>

        {isEmailConfirmation && (
          <div className="success-message" style={{ marginBottom: '1rem' }}>
            Email confirmed! Please sign in to continue.
          </div>
        )}

        {isRecovery ? (
          <SetNewPasswordForm />
        ) : isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};
