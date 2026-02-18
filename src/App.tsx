import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { LearningPlanPage } from './pages/LearningPlanPage';
import { DayDetailPage } from './pages/DayDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminFeedbackPage } from './pages/AdminFeedbackPage';
import { LandingPage } from './pages/LandingPage';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Use session (not user profile) to determine if authenticated
  return session ? <>{children}</> : <Navigate to="/" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, loading, isRecovery, isEmailConfirmation } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Stay on auth page during password recovery or email confirmation flow
  if (isRecovery || isEmailConfirmation) {
    return <>{children}</>;
  }

  // Use session (not user profile) to determine if authenticated
  return !session ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vocabulary"
        element={
          <PrivateRoute>
            <VocabularyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <PrivateRoute>
            <AdminFeedbackPage />
          </PrivateRoute>
        }
      />
      <Route path="/learning-plan" element={<LearningPlanPage />} />
      <Route path="/learning-plan/day/:dayNumber" element={<DayDetailPage />} />
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
