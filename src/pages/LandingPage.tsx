import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <h1>SpeakUp Pro: 60-Day PM Skills + Business English Learning Plan</h1>
        <p className="landing-subtitle">
          Master product management skills and business English through real podcast transcripts from industry leaders
        </p>
        <div className="landing-hero-actions">
          {session ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary large">
              Go to Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="btn-primary large">
              Get Started Free
            </button>
          )}
          <button onClick={() => navigate('/learning-plan')} className="btn-secondary large">
            Browse the Plan
          </button>
        </div>
      </section>

      <section className="landing-highlights">
        <div className="highlight-card">
          <span className="highlight-icon">60</span>
          <h3>Days of Learning</h3>
          <p>Structured daily lessons with reading, writing, and speaking exercises</p>
        </div>
        <div className="highlight-card">
          <span className="highlight-icon">9</span>
          <h3>Weekly Themes</h3>
          <p>From product strategy to leadership, each week covers a focused topic</p>
        </div>
        <div className="highlight-card">
          <span className="highlight-icon">200+</span>
          <h3>Vocabulary Words</h3>
          <p>Business English vocabulary with definitions, examples, and spaced review</p>
        </div>
        <div className="highlight-card">
          <span className="highlight-icon">55m</span>
          <h3>Daily Commitment</h3>
          <p>Read, shadow, write, and speak in under an hour each day</p>
        </div>
      </section>

      <section className="landing-daily-structure">
        <h2>What You'll Do Each Day</h2>
        <div className="daily-structure-grid">
          <div className="daily-step">
            <span className="step-time">20 min</span>
            <h3>Read & Listen</h3>
            <p>Study a section of a real podcast transcript from top PM leaders</p>
          </div>
          <div className="daily-step">
            <span className="step-time">10 min</span>
            <h3>Vocabulary</h3>
            <p>Learn key business phrases and PM terminology in context</p>
          </div>
          <div className="daily-step">
            <span className="step-time">10 min</span>
            <h3>Shadowing</h3>
            <p>Read aloud, mimicking the speaker's style and intonation</p>
          </div>
          <div className="daily-step">
            <span className="step-time">10 min</span>
            <h3>Writing</h3>
            <p>Respond to a prompt that applies the day's concepts to your own work</p>
          </div>
          <div className="daily-step">
            <span className="step-time">5 min</span>
            <h3>Speaking</h3>
            <p>Record yourself presenting, pitching, or explaining a concept</p>
          </div>
        </div>
      </section>

      <section className="landing-guests">
        <h2>Learn From Industry Leaders</h2>
        <div className="guests-grid">
          <div className="guest-card">
            <h3>Jackie Bavaro</h3>
            <p>Asana PM</p>
          </div>
          <div className="guest-card">
            <h3>Gibson Biddle</h3>
            <p>Netflix VP Product</p>
          </div>
          <div className="guest-card">
            <h3>Shishir Mehrotra</h3>
            <p>Coda CEO</p>
          </div>
          <div className="guest-card">
            <h3>Casey Winters</h3>
            <p>Eventbrite CPO</p>
          </div>
          <div className="guest-card">
            <h3>Rahul Vohra</h3>
            <p>Superhuman CEO</p>
          </div>
          <div className="guest-card">
            <h3>Ryan Hoover</h3>
            <p>Product Hunt Founder</p>
          </div>
          <div className="guest-card">
            <h3>Elena Verna</h3>
            <p>Growth Leader</p>
          </div>
          <div className="guest-card">
            <h3>Brian Chesky</h3>
            <p>Airbnb CEO</p>
          </div>
          <div className="guest-card">
            <h3>Nir Eyal</h3>
            <p>Hooked Author</p>
          </div>
          <div className="guest-card">
            <h3>Mike Krieger</h3>
            <p>Instagram Co-Founder</p>
          </div>
          <div className="guest-card">
            <h3>Sarah Tavel</h3>
            <p>Benchmark Partner</p>
          </div>
          <div className="guest-card">
            <h3>Deb Liu</h3>
            <p>Ancestry CEO</p>
          </div>
          <div className="guest-card">
            <h3>Molly Graham</h3>
            <p>Lambda School COO</p>
          </div>
          <div className="guest-card">
            <h3>Camille Fournier</h3>
            <p>The Manager's Path Author</p>
          </div>
          <div className="guest-card">
            <h3>Andy Raskin</h3>
            <p>Strategic Narrative Expert</p>
          </div>
          <div className="guest-card">
            <h3>Nancy Duarte</h3>
            <p>Presentation Expert</p>
          </div>
          <div className="guest-card">
            <h3>Wes Kao</h3>
            <p>Executive Communication</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to level up your English and PM skills?</h2>
        <p>Track your progress, build streaks, and review vocabulary with a free account.</p>
        <div className="landing-hero-actions">
          {session ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary large">
              Go to Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="btn-primary large">
              Sign Up Free
            </button>
          )}
          <button onClick={() => navigate('/learning-plan')} className="btn-secondary large">
            Browse the Plan
          </button>
        </div>
      </section>

    </div>
  );
};
