// Reasoning practice question bank
// Categories: Opinion, Hypothetical, Behavioral, PM-specific

export interface ReasoningQuestion {
  id: number;
  category: 'opinion' | 'hypothetical' | 'behavioral' | 'pm';
  question: string;
}

const reasoningQuestions: ReasoningQuestion[] = [
  // Opinion questions (1-10)
  { id: 1, category: 'opinion', question: "Do you think remote work is better than in-office work? Why?" },
  { id: 2, category: 'opinion', question: "Should companies prioritize speed or quality when launching new products?" },
  { id: 3, category: 'opinion', question: "Is it better to be a specialist or a generalist in your career?" },
  { id: 4, category: 'opinion', question: "Do you think AI will replace most product managers in the next 10 years?" },
  { id: 5, category: 'opinion', question: "Should startups focus on profitability from day one or prioritize growth?" },
  { id: 6, category: 'opinion', question: "Is a CS degree still necessary for a successful career in tech?" },
  { id: 7, category: 'opinion', question: "Do you think unlimited PTO policies actually benefit employees?" },
  { id: 8, category: 'opinion', question: "Should product decisions be driven primarily by data or by intuition?" },
  { id: 9, category: 'opinion', question: "Is it better to launch with a minimal feature set or wait for a polished product?" },
  { id: 10, category: 'opinion', question: "Do you think meetings are the biggest productivity killer in companies?" },

  // Hypothetical questions (11-20)
  { id: 11, category: 'hypothetical', question: "If you could change one thing about how products are built, what would it be?" },
  { id: 12, category: 'hypothetical', question: "If you were CEO of a major tech company for one day, what would you change?" },
  { id: 13, category: 'hypothetical', question: "If you had unlimited budget but only 3 months, what product would you build?" },
  { id: 14, category: 'hypothetical', question: "If you could go back and give yourself career advice 5 years ago, what would it be?" },
  { id: 15, category: 'hypothetical', question: "If all apps had to be redesigned from scratch, which one would you start with?" },
  { id: 16, category: 'hypothetical', question: "If you had to choose between a 10x better product or 10x better marketing, which would you pick?" },
  { id: 17, category: 'hypothetical', question: "If you could only use three metrics to measure product success, which would you choose?" },
  { id: 18, category: 'hypothetical', question: "If you were building a product for a market you've never worked in, how would you start?" },
  { id: 19, category: 'hypothetical', question: "If your team's velocity suddenly dropped by 50%, what would you investigate first?" },
  { id: 20, category: 'hypothetical', question: "If you had to pivot your product tomorrow, how would you decide the new direction?" },

  // Behavioral questions (21-30)
  { id: 21, category: 'behavioral', question: "Tell me about a time you had to convince someone of your idea." },
  { id: 22, category: 'behavioral', question: "Describe a situation where you had to make a decision with incomplete information." },
  { id: 23, category: 'behavioral', question: "Tell me about a time you received critical feedback. How did you handle it?" },
  { id: 24, category: 'behavioral', question: "Describe a project where you had to manage conflicting stakeholder priorities." },
  { id: 25, category: 'behavioral', question: "Tell me about a time you failed at something. What did you learn?" },
  { id: 26, category: 'behavioral', question: "Describe a situation where you had to say no to a stakeholder's request." },
  { id: 27, category: 'behavioral', question: "Tell me about a time you had to lead without formal authority." },
  { id: 28, category: 'behavioral', question: "Describe a challenging cross-functional collaboration you navigated." },
  { id: 29, category: 'behavioral', question: "Tell me about a time you changed your mind based on new evidence." },
  { id: 30, category: 'behavioral', question: "Describe how you handled a situation where a project was falling behind schedule." },

  // PM-specific questions (31-40)
  { id: 31, category: 'pm', question: "How would you prioritize between two features that different stakeholders want?" },
  { id: 32, category: 'pm', question: "How would you measure the success of a feature that's hard to quantify?" },
  { id: 33, category: 'pm', question: "How would you handle a disagreement between engineering and design?" },
  { id: 34, category: 'pm', question: "How would you decide whether to build, buy, or partner for a new capability?" },
  { id: 35, category: 'pm', question: "How would you approach launching a product in a new market?" },
  { id: 36, category: 'pm', question: "How would you handle a situation where your product's key metric is declining?" },
  { id: 37, category: 'pm', question: "How would you communicate a major product pivot to your team and stakeholders?" },
  { id: 38, category: 'pm', question: "How would you balance technical debt with new feature development?" },
  { id: 39, category: 'pm', question: "How would you set up an A/B test for a controversial design change?" },
  { id: 40, category: 'pm', question: "How would you define and track the north star metric for a new product?" },
];

/**
 * Get a reasoning question for a specific day/index combination.
 * Rotates through questions to ensure variety across days.
 */
export function getReasoningQuestion(dayNumber: number, index: number = 0): ReasoningQuestion {
  const questionIndex = ((dayNumber - 1) * 3 + index) % reasoningQuestions.length;
  return reasoningQuestions[questionIndex];
}

/**
 * Get multiple questions for quick-fire mode.
 * Returns `count` questions starting from a day-based offset.
 */
export function getQuickFireQuestions(dayNumber: number, count: number = 5): ReasoningQuestion[] {
  const questions: ReasoningQuestion[] = [];
  const startIndex = ((dayNumber - 1) * 7) % reasoningQuestions.length;
  for (let i = 0; i < count; i++) {
    questions.push(reasoningQuestions[(startIndex + i) % reasoningQuestions.length]);
  }
  return questions;
}

export default reasoningQuestions;
