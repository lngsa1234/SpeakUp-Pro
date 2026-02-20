import React from 'react';
import { useFeedbackReaction } from '../hooks/useFeedbackReaction';

interface FeedbackReactionProps {
  dayNumber: number;
  section: string;
}

export const FeedbackReaction: React.FC<FeedbackReactionProps> = ({ dayNumber, section }) => {
  const { reaction, handleReaction } = useFeedbackReaction(dayNumber, section);

  return (
    <div className="feedback-reaction">
      <span className="feedback-reaction-label">Was this feedback helpful?</span>
      <span className="section-reactions">
        <button
          className={`reaction-btn ${reaction === 'up' ? 'active' : ''}`}
          onClick={() => handleReaction('up')}
          title="Helpful"
        >
          👍
        </button>
        <button
          className={`reaction-btn ${reaction === 'down' ? 'active' : ''}`}
          onClick={() => handleReaction('down')}
          title="Not helpful"
        >
          👎
        </button>
      </span>
    </div>
  );
};
