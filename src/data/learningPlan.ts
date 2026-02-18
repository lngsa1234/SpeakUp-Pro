// 60-Day PM + English/Startup Learning Plan Data
// Using Lenny's Podcast Transcripts

export type DayActivity = {
  name: string;
  duration: string;
  description: string;
};

export type KeyPhrase = {
  phrase: string;
  meaning: string;
};

export type VocabularyWord = {
  word: string;
  definition: string;
  example: string;
};

export type LearningDay = {
  day: number;
  week: number;
  title: string;
  theme: string;
  transcript: string;
  transcriptFile: string;
  lineRange: string;
  focusArea: string;
  keyPhrases: KeyPhrase[];
  vocabulary: VocabularyWord[];
  writingPrompt: string;
  speakingPrompt: string;
  activities: DayActivity[];
  isReviewDay: boolean;
};

export type WeekInfo = {
  week: number;
  theme: string;
  description: string;
  transcripts: string[];
};

export const weekInfo: WeekInfo[] = [
  {
    week: 1,
    theme: "Product Strategy Foundation",
    description: "Learn core PM strategy frameworks from industry leaders",
    transcripts: ["Jackie Bavaro", "Gibson Biddle"]
  },
  {
    week: 2,
    theme: "Strategy & Growth Loops",
    description: "Understand growth loops and executive communication",
    transcripts: ["Shishir Mehrotra", "Casey Winters"]
  },
  {
    week: 3,
    theme: "Product-Market Fit",
    description: "Master PMF methodology and founder insights",
    transcripts: ["Rahul Vohra", "Ryan Hoover"]
  },
  {
    week: 4,
    theme: "Go-to-Market & Launch",
    description: "Modern growth tactics, building in public, and launching products",
    transcripts: ["Elena Verna 4.0", "Review"]
  },
  {
    week: 5,
    theme: "Product Craft & User Psychology",
    description: "Master product craft and understand what makes products habit-forming",
    transcripts: ["Brian Chesky", "Nir Eyal"]
  },
  {
    week: 6,
    theme: "Engagement & Defensibility",
    description: "Build engagement loops and create lasting competitive advantages",
    transcripts: ["Mike Krieger", "Sarah Tavel"]
  },
  {
    week: 7,
    theme: "Influence & Career Growth",
    description: "Build influence without authority and navigate career advancement",
    transcripts: ["Deb Liu", "Ethan Evans 2.0"]
  },
  {
    week: 8,
    theme: "Scaling & Delegation",
    description: "Growing yourself and your team",
    transcripts: ["Molly Graham", "Camille Fournier"]
  },
  {
    week: 9,
    theme: "Storytelling & Integration",
    description: "Master strategic storytelling and integrate all skills into your final pitch",
    transcripts: ["Andy Raskin", "Nancy Duarte", "Wes Kao 2.0"]
  }
];

export const learningPlan: LearningDay[] = [
  // Week 1: Product Strategy Foundation
  {
    day: 1,
    week: 1,
    title: "PM Career Journey & Early Lessons",
    theme: "Product Strategy Foundation",
    transcript: "Jackie Bavaro",
    transcriptFile: "Jackie Bavaro.txt",
    lineRange: "1-75",
    focusArea: "Past tense narratives, career vocabulary",
    keyPhrases: [
      { phrase: "worked my way up to", meaning: "gradually advanced to a higher position" },
      { phrase: "got rejected", meaning: "was not accepted or approved" },
      { phrase: "level the playing field", meaning: "make things fair for everyone" },
      { phrase: "front row seat to", meaning: "a position to observe something closely" },
      { phrase: "the first PM at", meaning: "the initial product manager hired" }
    ],
    vocabulary: [
      { word: "internship", definition: "a temporary job for learning", example: "My PM internship at Microsoft taught me the basics." },
      { word: "reference check", definition: "verifying someone's background", example: "The reference check confirmed her skills." },
      { word: "founding member", definition: "original team member", example: "As a founding member, she shaped the culture." }
    ],
    writingPrompt: "Describe your own career journey in 5 sentences. What unexpected turns did you take?",
    speakingPrompt: "Practice introducing yourself and your career path in 2 minutes.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Jackie Bavaro transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn and write down the 5 key phrases" },
      { name: "Shadowing", duration: "10 min", description: "Read aloud, mimicking Jackie's speaking style" },
      { name: "Writing", duration: "10 min", description: "Complete the writing prompt" },
      { name: "Recording", duration: "5 min", description: "Record yourself with the speaking prompt" }
    ],
    isReviewDay: false
  },
  {
    day: 2,
    week: 1,
    title: "The 'Say Yes' Leadership Lesson",
    theme: "Product Strategy Foundation",
    transcript: "Jackie Bavaro",
    transcriptFile: "Jackie Bavaro.txt",
    lineRange: "75-125",
    focusArea: "Giving and receiving feedback, coaching vocabulary",
    keyPhrases: [
      { phrase: "shut people down", meaning: "reject ideas quickly without consideration" },
      { phrase: "rethink how I saw the role", meaning: "change my perspective on the job" },
      { phrase: "for the next two weeks", meaning: "a timeboxed experiment" },
      { phrase: "weighed a lot on me", meaning: "caused stress or concern" },
      { phrase: "real collaboration", meaning: "genuine teamwork and partnership" }
    ],
    vocabulary: [
      { word: "defensive mindset", definition: "protecting yourself from criticism", example: "His defensive mindset prevented growth." },
      { word: "coaching", definition: "professional guidance and development", example: "Executive coaching transformed her leadership." },
      { word: "authenticity", definition: "being genuine and true to oneself", example: "Authenticity builds trust with your team." }
    ],
    writingPrompt: "Write about a time you received difficult feedback. How did you respond? What would you do differently?",
    speakingPrompt: "Role-play giving constructive feedback to a colleague about saying 'no' too often.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-125 of Jackie Bavaro transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn feedback and coaching vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice the key phrases in context" },
      { name: "Writing", duration: "10 min", description: "Write about receiving difficult feedback" },
      { name: "Recording", duration: "5 min", description: "Record the role-play exercise" }
    ],
    isReviewDay: false
  },
  {
    day: 3,
    week: 1,
    title: "Defining Strategy",
    theme: "Product Strategy Foundation",
    transcript: "Jackie Bavaro",
    transcriptFile: "Jackie Bavaro.txt",
    lineRange: "125-200",
    focusArea: "Abstract concept explanation, business vocabulary",
    keyPhrases: [
      { phrase: "be more strategic", meaning: "think about long-term goals and plans" },
      { phrase: "what does that even mean?", meaning: "requesting clarification on vague feedback" },
      { phrase: "robust vision", meaning: "a strong, well-developed future plan" },
      { phrase: "deep knowledge of", meaning: "thorough understanding" },
      { phrase: "that's not a strategy", meaning: "challenging weak strategic thinking" }
    ],
    vocabulary: [
      { word: "strategy", definition: "a plan to achieve long-term goals", example: "Our product strategy focuses on enterprise customers." },
      { word: "vision", definition: "a picture of the desired future state", example: "The company vision inspired the whole team." },
      { word: "promotion", definition: "advancement to a higher position", example: "She earned her promotion through strategic thinking." }
    ],
    writingPrompt: "Define 'product strategy' in your own words (100 words). Give an example from a product you use.",
    speakingPrompt: "Explain what makes a good product strategy to someone new to PM.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 125-200 of Jackie Bavaro transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Master strategy-related vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice explaining abstract concepts" },
      { name: "Writing", duration: "10 min", description: "Define strategy in your own words" },
      { name: "Recording", duration: "5 min", description: "Record your strategy explanation" }
    ],
    isReviewDay: false
  },
  {
    day: 4,
    week: 1,
    title: "DHM Framework Introduction",
    theme: "Product Strategy Foundation",
    transcript: "Gibson Biddle",
    transcriptFile: "Gibson Biddle.txt",
    lineRange: "1-115",
    focusArea: "Framework explanation, persuasive language",
    keyPhrases: [
      { phrase: "delight customers in hard-to-copy, margin-enhancing ways", meaning: "Netflix's core strategy framework" },
      { phrase: "the short answer is", meaning: "introducing a concise explanation" },
      { phrase: "balance delight versus margin", meaning: "trade-off between user happiness and profit" },
      { phrase: "what makes X hard to copy?", meaning: "identifying competitive advantages" },
      { phrase: "word of mouth factor", meaning: "how much users spread the product organically" }
    ],
    vocabulary: [
      { word: "delight", definition: "exceed customer expectations", example: "Our goal is to delight customers with every interaction." },
      { word: "margin", definition: "profit made on each sale", example: "The feature improved our margin by 15%." },
      { word: "retention", definition: "keeping users over time", example: "Our monthly retention rate is 85%." }
    ],
    writingPrompt: "Apply the DHM framework to your your product. What delights users? What's hard to copy? How do you make money?",
    speakingPrompt: "Explain the DHM framework as if teaching it to a new PM.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-115 of Gibson Biddle transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn DHM framework vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Gibson's teaching style" },
      { name: "Writing", duration: "10 min", description: "Apply DHM to your app" },
      { name: "Recording", duration: "5 min", description: "Teach the framework out loud" }
    ],
    isReviewDay: false
  },
  {
    day: 5,
    week: 1,
    title: "Netflix Case Study & A/B Testing",
    theme: "Product Strategy Foundation",
    transcript: "Gibson Biddle",
    transcriptFile: "Gibson Biddle.txt",
    lineRange: "115-170",
    focusArea: "Storytelling with data, conditional sentences",
    keyPhrases: [
      { phrase: "let me put it back to you", meaning: "asking the listener to think about it" },
      { phrase: "do you think...", meaning: "engaging the audience in reasoning" },
      { phrase: "the argument for why someone might...", meaning: "presenting alternative viewpoints" },
      { phrase: "A/B test", meaning: "comparing two versions to see which performs better" },
      { phrase: "control group", meaning: "the unchanged version in an experiment" }
    ],
    vocabulary: [
      { word: "hypothesis", definition: "an educated guess to be tested", example: "Our hypothesis was that faster delivery increases satisfaction." },
      { word: "metrics", definition: "measurements used to track success", example: "We track three key metrics: retention, engagement, and revenue." },
      { word: "iteration", definition: "repeated cycles of improvement", example: "Each iteration brought us closer to product-market fit." }
    ],
    writingPrompt: "Design an A/B test for your your product. What would you test? What metrics would you track?",
    speakingPrompt: "Present your A/B test idea as if pitching to your team.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 115-170 of Gibson Biddle transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn experimentation vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice data storytelling" },
      { name: "Writing", duration: "10 min", description: "Design your A/B test" },
      { name: "Recording", duration: "5 min", description: "Pitch your experiment" }
    ],
    isReviewDay: false
  },
  {
    day: 6,
    week: 1,
    title: "Hard-to-Copy Advantages",
    theme: "Product Strategy Foundation",
    transcript: "Gibson Biddle",
    transcriptFile: "Gibson Biddle.txt",
    lineRange: "163-240",
    focusArea: "Analytical thinking vocabulary",
    keyPhrases: [
      { phrase: "keep going, dig deep", meaning: "encouraging deeper analysis" },
      { phrase: "unique technology", meaning: "proprietary technical capabilities" },
      { phrase: "brand trust", meaning: "reputation built over time" },
      { phrase: "network effects", meaning: "product becomes more valuable as more people use it" },
      { phrase: "right sizing the investment", meaning: "matching investment to expected return" },
      { phrase: "high level theories", meaning: "strategic hypotheses about product direction" }
    ],
    vocabulary: [
      { word: "moat", definition: "competitive advantage that protects a business", example: "Their data moat makes them hard to compete with." },
      { word: "defensibility", definition: "ability to protect market position", example: "Network effects create strong defensibility." },
      { word: "differentiation", definition: "what makes you unique vs competitors", example: "Our differentiation is the AI-powered matching." },
      { word: "flywheel", definition: "self-reinforcing cycle that builds momentum", example: "Their content flywheel attracts more viewers which funds more content." }
    ],
    writingPrompt: "What makes your your product hard to copy? List 3-5 potential competitive advantages and explain each.",
    speakingPrompt: "Pitch your app's competitive advantages to an investor.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 163-240 of Gibson Biddle transcript on hard-to-copy advantages" },
      { name: "Vocabulary", duration: "10 min", description: "Master competitive advantage vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice analytical explanation" },
      { name: "Writing", duration: "10 min", description: "List your competitive advantages" },
      { name: "Recording", duration: "5 min", description: "Pitch to an imaginary investor" }
    ],
    isReviewDay: false
  },
  {
    day: 7,
    week: 1,
    title: "Week 1 Review & Synthesis",
    theme: "Product Strategy Foundation",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 1 Content",
    focusArea: "Consolidating vocabulary and concepts",
    keyPhrases: [
      { phrase: "to summarize", meaning: "bringing key points together" },
      { phrase: "the main takeaway is", meaning: "the most important lesson" },
      { phrase: "applying this to", meaning: "using knowledge in a new context" },
      { phrase: "in my experience", meaning: "sharing personal insights" },
      { phrase: "going forward", meaning: "in the future" }
    ],
    vocabulary: [
      { word: "synthesis", definition: "combining ideas into a unified whole", example: "The synthesis of these frameworks creates a complete strategy." },
      { word: "reflection", definition: "thinking deeply about experiences", example: "Weekly reflection helps reinforce learning." },
      { word: "application", definition: "putting knowledge into practice", example: "Application is the best way to learn." }
    ],
    writingPrompt: "Write 300 words: 'What I learned about product strategy this week.' Include at least 5 vocabulary words from the week.",
    speakingPrompt: "Record a 3-minute summary explaining the DHM framework and one key lesson from Jackie Bavaro.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 30+ words from Week 1" },
      { name: "Writing", duration: "20 min", description: "Write your 300-word reflection" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your 3-minute summary" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your understanding of each day's content" }
    ],
    isReviewDay: true
  },

  // Week 2: Strategy & Growth Loops
  {
    day: 8,
    week: 2,
    title: "Black Loop & Blue Loop",
    theme: "Strategy & Growth Loops",
    transcript: "Shishir Mehrotra",
    transcriptFile: "Shishir Mehrotra.txt",
    lineRange: "1-108",
    focusArea: "Metaphor explanation, visual description",
    keyPhrases: [
      { phrase: "I'll flash it up on screen", meaning: "showing a visual aid" },
      { phrase: "the process repeats itself", meaning: "describing a loop or cycle" },
      { phrase: "the viral actions of", meaning: "behaviors that spread naturally" },
      { phrase: "no friction on the share edge", meaning: "making sharing effortless" },
      { phrase: "loops not funnels", meaning: "thinking in cycles, not linear paths" }
    ],
    vocabulary: [
      { word: "loop", definition: "a self-reinforcing cycle", example: "The viral loop drives organic growth." },
      { word: "funnel", definition: "a linear user journey with drop-offs", example: "Our signup funnel converts 15% of visitors." },
      { word: "viral", definition: "spreading rapidly from user to user", example: "The feature has viral mechanics built in." }
    ],
    writingPrompt: "Draw and describe your your product's growth loop. How does one user bring in another?",
    speakingPrompt: "Explain the difference between loops and funnels using your own examples.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-108 of Shishir Mehrotra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn growth loop vocabulary" },
      { name: "Visual Exercise", duration: "10 min", description: "Draw your app's growth loops" },
      { name: "Writing", duration: "10 min", description: "Describe your loops in writing" },
      { name: "Recording", duration: "5 min", description: "Explain loops vs funnels" }
    ],
    isReviewDay: false
  },
  {
    day: 9,
    week: 2,
    title: "Pricing & Growth Decisions",
    theme: "Strategy & Growth Loops",
    transcript: "Shishir Mehrotra",
    transcriptFile: "Shishir Mehrotra.txt",
    lineRange: "95-130",
    focusArea: "Business reasoning, cause and effect",
    keyPhrases: [
      { phrase: "the reason we do that is...", meaning: "explaining business logic" },
      { phrase: "in terms of that diagram", meaning: "referring to a framework" },
      { phrase: "that's the moment where...", meaning: "identifying critical points" },
      { phrase: "I wanted no dollar signs in...", meaning: "removing friction from key actions" },
      { phrase: "Maker Billing", meaning: "charging only creators, not viewers" }
    ],
    vocabulary: [
      { word: "monetization", definition: "how a product makes money", example: "Our monetization strategy is subscription-based." },
      { word: "friction", definition: "obstacles that slow users down", example: "We removed friction from the signup flow." },
      { word: "conversion", definition: "users taking a desired action", example: "The conversion rate from free to paid is 5%." }
    ],
    writingPrompt: "Describe your pricing strategy for your your product. How does it align with your growth loops?",
    speakingPrompt: "Pitch your pricing model and explain why it makes sense for growth.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 95-130 of Shishir Mehrotra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn pricing and monetization vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice business reasoning phrases" },
      { name: "Writing", duration: "10 min", description: "Describe your pricing strategy" },
      { name: "Recording", duration: "5 min", description: "Pitch your pricing model" }
    ],
    isReviewDay: false
  },
  {
    day: 10,
    week: 2,
    title: "Finding Your Loops",
    theme: "Strategy & Growth Loops",
    transcript: "Shishir Mehrotra",
    transcriptFile: "Shishir Mehrotra.txt",
    lineRange: "130-150",
    focusArea: "Advice-giving language",
    keyPhrases: [
      { phrase: "the first piece of advice I'd give is...", meaning: "starting with the most important recommendation" },
      { phrase: "it can come from anywhere", meaning: "insights aren't limited to one source" },
      { phrase: "go look at what you told...", meaning: "reviewing past communication for patterns" },
      { phrase: "required a little bit of creativity", meaning: "needed innovative thinking" },
      { phrase: "hiding in plain sight", meaning: "obvious once you see it" }
    ],
    vocabulary: [
      { word: "insight", definition: "a deep understanding", example: "The user research gave us a key insight." },
      { word: "pattern", definition: "a repeated behavior or trend", example: "We noticed a pattern in user complaints." },
      { word: "iteration", definition: "repeated refinement", example: "After several iterations, we found the right approach." }
    ],
    writingPrompt: "What insights about your users are 'hiding in plain sight'? Write about 3 observations you've made.",
    speakingPrompt: "Give advice to a new founder on how to find their growth loops.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-150 of Shishir Mehrotra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Practice advice-giving phrases" },
      { name: "Shadowing", duration: "10 min", description: "Mimic Shishir's advisory tone" },
      { name: "Writing", duration: "10 min", description: "Document your user insights" },
      { name: "Recording", duration: "5 min", description: "Give advice to a founder" }
    ],
    isReviewDay: false
  },
  {
    day: 11,
    week: 2,
    title: "Career Arc & Growth Definition",
    theme: "Strategy & Growth Loops",
    transcript: "Casey Winters",
    transcriptFile: "Casey Winters.txt",
    lineRange: "1-50",
    focusArea: "Professional biography, role descriptions",
    keyPhrases: [
      { phrase: "near and dear to my heart", meaning: "something personally important" },
      { phrase: "that term didn't exist at the time", meaning: "describing emerging concepts" },
      { phrase: "formally labeled", meaning: "officially given a title" },
      { phrase: "reignite growth", meaning: "restart momentum after stagnation" },
      { phrase: "from Series A to IPO", meaning: "the full startup journey" }
    ],
    vocabulary: [
      { word: "IPO", definition: "Initial Public Offering - going public", example: "They're preparing for an IPO next year." },
      { word: "Series A", definition: "first major funding round", example: "We just closed our Series A at $10M." },
      { word: "demand side", definition: "the customers or buyers", example: "I focused on growing the demand side." }
    ],
    writingPrompt: "Write your professional biography in 150 words. Include your key achievements and what you're known for.",
    speakingPrompt: "Introduce yourself at a networking event in 90 seconds.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-50 of Casey Winters transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn startup stage vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice career storytelling" },
      { name: "Writing", duration: "10 min", description: "Write your professional bio" },
      { name: "Recording", duration: "5 min", description: "Record your networking intro" }
    ],
    isReviewDay: false
  },
  {
    day: 12,
    week: 2,
    title: "Executive Communication",
    theme: "Strategy & Growth Loops",
    transcript: "Casey Winters",
    transcriptFile: "Casey Winters.txt",
    lineRange: "50-100",
    focusArea: "Business communication, storytelling structure",
    keyPhrases: [
      { phrase: "start with chapter one", meaning: "provide necessary context first" },
      { phrase: "you haven't earned the right to...", meaning: "you skipped important setup" },
      { phrase: "de-risk the meeting", meaning: "reduce chances of failure" },
      { phrase: "role-play the entire thing", meaning: "practice by simulating the scenario" },
      { phrase: "executives communication", meaning: "each exec has different needs" }
    ],
    vocabulary: [
      { word: "stakeholder", definition: "person with interest in a decision", example: "We need to align all stakeholders first." },
      { word: "escalate", definition: "raise an issue to higher management", example: "I had to escalate the problem to the VP." },
      { word: "context", definition: "background information", example: "Let me give you some context first." }
    ],
    writingPrompt: "Write an executive summary (200 words) of your your product for a CEO who has 2 minutes to read it.",
    speakingPrompt: "Present your app to an executive in 3 minutes, starting with the 'why'.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 50-100 of Casey Winters transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn executive communication vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice structured storytelling" },
      { name: "Writing", duration: "10 min", description: "Write an executive summary" },
      { name: "Recording", duration: "5 min", description: "Practice your executive presentation" }
    ],
    isReviewDay: false
  },
  {
    day: 13,
    week: 2,
    title: "Justifying Non-Sexy Work",
    theme: "Strategy & Growth Loops",
    transcript: "Casey Winters",
    transcriptFile: "Casey Winters.txt",
    lineRange: "100-150",
    focusArea: "Persuasion, defending decisions",
    keyPhrases: [
      { phrase: "chronically underfunded", meaning: "consistently lacking resources" },
      { phrase: "get a team to buy in", meaning: "gain collective agreement" },
      { phrase: "perceived simplicity", meaning: "appearing simple while being powerful" },
      { phrase: "protect what you've got", meaning: "maintain existing gains" },
      { phrase: "what gets measured gets managed", meaning: "tracking drives attention" }
    ],
    vocabulary: [
      { word: "technical debt", definition: "accumulated shortcuts in code", example: "We need to address our technical debt." },
      { word: "infrastructure", definition: "underlying systems and foundations", example: "Infrastructure improvements rarely get attention." },
      { word: "buy-in", definition: "agreement and support", example: "I need buy-in from engineering before proceeding." }
    ],
    writingPrompt: "Write a persuasive memo justifying investment in performance improvements for your app.",
    speakingPrompt: "Convince your team to spend a sprint on technical debt reduction.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 100-150 of Casey Winters transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn persuasion vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice persuasive tone" },
      { name: "Writing", duration: "10 min", description: "Write a persuasive memo" },
      { name: "Recording", duration: "5 min", description: "Practice convincing your team" }
    ],
    isReviewDay: false
  },
  {
    day: 14,
    week: 2,
    title: "Week 2 Review & Synthesis",
    theme: "Strategy & Growth Loops",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 2 Content",
    focusArea: "Consolidating loops and communication skills",
    keyPhrases: [
      { phrase: "connecting the dots", meaning: "seeing relationships between ideas" },
      { phrase: "the bigger picture", meaning: "overall context and strategy" },
      { phrase: "putting it all together", meaning: "combining individual learnings" },
      { phrase: "key takeaways", meaning: "most important lessons" },
      { phrase: "moving forward", meaning: "applying learnings in the future" }
    ],
    vocabulary: [
      { word: "framework", definition: "a structured way of thinking", example: "The DHM framework guides our strategy." },
      { word: "ecosystem", definition: "interconnected system of users and products", example: "We're building an ecosystem, not just an app." },
      { word: "holistic", definition: "considering the whole system", example: "Take a holistic view of the user journey." }
    ],
    writingPrompt: "Write 400 words comparing the growth strategies of Coda (loops) and Netflix (DHM). What can you apply to your app?",
    speakingPrompt: "Record a 3-minute explanation of your app's growth loop, using vocabulary from this week.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 60+ words from Weeks 1-2" },
      { name: "Writing", duration: "20 min", description: "Write your comparison essay" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your growth loop explanation" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your understanding of growth loops" }
    ],
    isReviewDay: true
  },

  // Week 3: Product-Market Fit
  {
    day: 15,
    week: 3,
    title: "The Rapportive Story & Virality Secret",
    theme: "Product-Market Fit",
    transcript: "Rahul Vohra",
    transcriptFile: "Rahul Vohra.txt",
    lineRange: "1-70",
    focusArea: "Storytelling, narrative tension",
    keyPhrases: [
      { phrase: "hate to burst your bubble", meaning: "sorry to disappoint you" },
      { phrase: "there's no such thing as", meaning: "challenging a common belief" },
      { phrase: "the true secret behind", meaning: "revealing hidden knowledge" },
      { phrase: "word of mouth", meaning: "organic sharing between people" },
      { phrase: "viral factor", meaning: "how many new users each user brings" }
    ],
    vocabulary: [
      { word: "acquisition", definition: "getting new users", example: "Our main acquisition channel is referrals." },
      { word: "lifetime value", definition: "total revenue from one customer", example: "The lifetime value is $500 per user." },
      { word: "organic", definition: "happening naturally without paid promotion", example: "70% of our growth is organic." }
    ],
    writingPrompt: "What's the 'true secret' behind your app's potential growth? Write about what will make users tell friends.",
    speakingPrompt: "Tell the story of how you discovered your app idea, using narrative tension.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-70 of Rahul Vohra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn virality and growth vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Rahul's storytelling style" },
      { name: "Writing", duration: "10 min", description: "Write about your growth secret" },
      { name: "Recording", duration: "5 min", description: "Tell your origin story" }
    ],
    isReviewDay: false
  },
  {
    day: 16,
    week: 3,
    title: "Company Values & Remarkability",
    theme: "Product-Market Fit",
    transcript: "Rahul Vohra",
    transcriptFile: "Rahul Vohra.txt",
    lineRange: "70-125",
    focusArea: "Company culture description",
    keyPhrases: [
      { phrase: "create delight", meaning: "build joyful experiences" },
      { phrase: "deliver remarkable quality", meaning: "make something worth talking about" },
      { phrase: "build the extraordinary", meaning: "create innovative solutions" },
      { phrase: "raw ingredients for growth", meaning: "fundamental elements that drive expansion" },
      { phrase: "baking into your values", meaning: "making something fundamental to culture" }
    ],
    vocabulary: [
      { word: "remarkable", definition: "worthy of attention and comment", example: "The onboarding is so remarkable people screenshot it." },
      { word: "delight", definition: "great pleasure and satisfaction", example: "Small touches of delight increase retention." },
      { word: "values", definition: "core principles guiding behavior", example: "Our company values include transparency and speed." }
    ],
    writingPrompt: "Define 3 core values for your your product. Explain how each drives growth.",
    speakingPrompt: "Explain your company values as if onboarding a new employee.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 70-125 of Rahul Vohra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn values and culture vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice explaining company values" },
      { name: "Writing", duration: "10 min", description: "Define your company values" },
      { name: "Recording", duration: "5 min", description: "Onboard an imaginary employee" }
    ],
    isReviewDay: false
  },
  {
    day: 17,
    week: 3,
    title: "Product Velocity & Org Design",
    theme: "Product-Market Fit",
    transcript: "Rahul Vohra",
    transcriptFile: "Rahul Vohra.txt",
    lineRange: "125-190",
    focusArea: "Problem-solving language, organizational vocabulary",
    keyPhrases: [
      { phrase: "we felt it first ourselves", meaning: "internal recognition of a problem" },
      { phrase: "solution deepening vs market widening", meaning: "improving product vs reaching more users" },
      { phrase: "zone of genius", meaning: "area of exceptional skill" },
      { phrase: "I went from eight direct reports to two", meaning: "simplifying org structure" },
      { phrase: "the organization began to slow down", meaning: "growth deceleration" }
    ],
    vocabulary: [
      { word: "velocity", definition: "speed of shipping product changes", example: "We need to increase our shipping velocity." },
      { word: "bottleneck", definition: "constraint that limits speed", example: "Design reviews became a bottleneck." },
      { word: "delegate", definition: "assign responsibility to others", example: "I had to learn to delegate more." }
    ],
    writingPrompt: "What's your 'zone of genius'? What should you delegate? Write a plan for spending 60%+ of your time on your strengths.",
    speakingPrompt: "Describe a time when you simplified something to move faster.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 125-190 of Rahul Vohra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn organizational vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice problem-solving language" },
      { name: "Writing", duration: "10 min", description: "Write your delegation plan" },
      { name: "Recording", duration: "5 min", description: "Share a simplification story" }
    ],
    isReviewDay: false
  },
  {
    day: 18,
    week: 3,
    title: "Time Tracking & Focus",
    theme: "Product-Market Fit",
    transcript: "Rahul Vohra",
    transcriptFile: "Rahul Vohra.txt",
    lineRange: "130-170",
    focusArea: "Productivity language, self-improvement",
    keyPhrases: [
      { phrase: "switch log", meaning: "tracking when you change tasks" },
      { phrase: "your calendar says what you thought you were going to do", meaning: "plans vs reality" },
      { phrase: "attend to that thought", meaning: "address what's on your mind" },
      { phrase: "where your time is actually going", meaning: "real vs perceived time allocation" },
      { phrase: "transcendental meditation", meaning: "a specific meditation practice" }
    ],
    vocabulary: [
      { word: "productivity", definition: "effectiveness in producing results", example: "My productivity peaks in the morning." },
      { word: "focus", definition: "concentrated attention", example: "Deep focus requires eliminating distractions." },
      { word: "mindfulness", definition: "present-moment awareness", example: "Mindfulness practice improves decision-making." }
    ],
    writingPrompt: "Track your time for one day using Rahul's method. Write about what you discovered.",
    speakingPrompt: "Explain your ideal daily schedule and how you protect focus time.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-170 of Rahul Vohra transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn productivity vocabulary" },
      { name: "Time Tracking", duration: "All Day", description: "Track your time using the switch log method" },
      { name: "Writing", duration: "10 min", description: "Reflect on your time tracking" },
      { name: "Recording", duration: "5 min", description: "Describe your ideal schedule" }
    ],
    isReviewDay: false
  },
  {
    day: 19,
    week: 3,
    title: "Founder Vulnerability & Connection",
    theme: "Product-Market Fit",
    transcript: "Ryan Hoover",
    transcriptFile: "Ryan Hoover.txt",
    lineRange: "1-60",
    focusArea: "Emotional vocabulary, authenticity",
    keyPhrases: [
      { phrase: "that flutter in your stomach", meaning: "physical feeling of anxiety" },
      { phrase: "put on this mask", meaning: "hide true feelings" },
      { phrase: "pretty vulnerable", meaning: "open about weaknesses" },
      { phrase: "authentic relationships", meaning: "genuine connections" },
      { phrase: "wearing this unfortunate mask", meaning: "pretending everything is fine" }
    ],
    vocabulary: [
      { word: "vulnerability", definition: "openness about weaknesses", example: "Vulnerability builds trust with your team." },
      { word: "authenticity", definition: "being genuine", example: "Users value authenticity in founders." },
      { word: "anxiety", definition: "worry and unease", example: "Startup anxiety is normal but manageable." }
    ],
    writingPrompt: "Write about a challenging moment in your work journey. What did you learn? How did it change you?",
    speakingPrompt: "Share a vulnerable moment with a hypothetical mentee, and what you learned from it.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-60 of Ryan Hoover transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn emotional and authenticity vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice vulnerable storytelling" },
      { name: "Writing", duration: "10 min", description: "Write about a challenging moment" },
      { name: "Recording", duration: "5 min", description: "Practice sharing vulnerably" }
    ],
    isReviewDay: false
  },
  {
    day: 20,
    week: 3,
    title: "Should You Start a Company?",
    theme: "Product-Market Fit",
    transcript: "Ryan Hoover",
    transcriptFile: "Ryan Hoover.txt",
    lineRange: "60-100",
    focusArea: "Advice-giving, conditional sentences",
    keyPhrases: [
      { phrase: "do you see yourself working on this for a decade?", meaning: "testing long-term commitment" },
      { phrase: "we called it an experiment", meaning: "framing to reduce pressure" },
      { phrase: "the framing is helpful because...", meaning: "explaining a mental model" },
      { phrase: "what are you tinkering with on weekends?", meaning: "finding passion projects" },
      { phrase: "it's all contextual", meaning: "depends on the situation" }
    ],
    vocabulary: [
      { word: "venture-backable", definition: "suitable for VC investment", example: "Is this idea venture-backable or lifestyle?" },
      { word: "side project", definition: "work done outside main job", example: "Many companies started as side projects." },
      { word: "litmus test", definition: "decisive test of quality", example: "The decade question is a litmus test for founders." }
    ],
    writingPrompt: "Why do you want to build your your product? Can you see yourself working on it for a decade? Write 200 honest words.",
    speakingPrompt: "Advise a friend who's considering starting a company. What questions should they ask themselves?",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 60-100 of Ryan Hoover transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn startup decision vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice advice-giving tone" },
      { name: "Writing", duration: "10 min", description: "Write about your motivation" },
      { name: "Recording", duration: "5 min", description: "Advise a hypothetical friend" }
    ],
    isReviewDay: false
  },
  {
    day: 21,
    week: 3,
    title: "Week 3 Review & Synthesis",
    theme: "Product-Market Fit",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 3 Content",
    focusArea: "PMF concepts and founder mindset",
    keyPhrases: [
      { phrase: "product-market fit", meaning: "when product meets real demand" },
      { phrase: "the 40% test", meaning: "Rahul's PMF measurement" },
      { phrase: "founder-market fit", meaning: "when founder is right for the problem" },
      { phrase: "iterate until", meaning: "keep improving until goal is reached" },
      { phrase: "validate the hypothesis", meaning: "prove or disprove an assumption" }
    ],
    vocabulary: [
      { word: "pivot", definition: "fundamental change in strategy", example: "We had to pivot from B2C to B2B." },
      { word: "traction", definition: "evidence of growing demand", example: "We're seeing good traction with early users." },
      { word: "validation", definition: "confirmation that something works", example: "Customer validation is essential before building." }
    ],
    writingPrompt: "Write 500 words: 'My path to product-market fit.' Include insights from Rahul and Ryan.",
    speakingPrompt: "Record a 5-minute pitch for your your product, incorporating PMF concepts.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 90+ words from Weeks 1-3" },
      { name: "Writing", duration: "20 min", description: "Write your PMF essay" },
      { name: "Speaking Practice", duration: "20 min", description: "Record your 5-minute pitch" },
      { name: "Self-Assessment", duration: "5 min", description: "Rate your understanding of PMF" }
    ],
    isReviewDay: true
  },

  // Continue pattern for remaining weeks...
  // Week 4: Go-to-Market & Launch
  {
    day: 22,
    week: 4,
    title: "Lovable's Insane Growth Story",
    theme: "Go-to-Market & Launch",
    transcript: "Elena Verna 4.0",
    transcriptFile: "Elena Verna 4.0.txt",
    lineRange: "1-75",
    focusArea: "Numbers, scale, comparisons",
    keyPhrases: [
      { phrase: "over 200 million in ARR", meaning: "annual recurring revenue milestone" },
      { phrase: "once in a lifetime type of company", meaning: "exceptionally rare success" },
      { phrase: "don't set this as a benchmark", meaning: "this is unusual, not typical" },
      { phrase: "capabilities stage", meaning: "exploring what's possible" },
      { phrase: "the pace here is insane", meaning: "extremely fast movement" }
    ],
    vocabulary: [
      { word: "ARR", definition: "Annual Recurring Revenue", example: "We reached $1M ARR in 8 months." },
      { word: "benchmark", definition: "standard for comparison", example: "Don't use Lovable as your benchmark." },
      { word: "monetization model", definition: "how a product makes money", example: "Our monetization model is usage-based." }
    ],
    writingPrompt: "What would 'insane growth' look like for your your product? Define your ambitious 1-year goals.",
    speakingPrompt: "Describe Lovable's growth story as if you're a news reporter.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Elena Verna 4.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn scale and growth vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice speaking about numbers" },
      { name: "Writing", duration: "10 min", description: "Define your growth goals" },
      { name: "Recording", duration: "5 min", description: "Report on a growth story" }
    ],
    isReviewDay: false
  },
  {
    day: 23,
    week: 4,
    title: "Throwing Out the Growth Playbook",
    theme: "Go-to-Market & Launch",
    transcript: "Elena Verna 4.0",
    transcriptFile: "Elena Verna 4.0.txt",
    lineRange: "75-130",
    focusArea: "Contrasting past vs present",
    keyPhrases: [
      { phrase: "throw out most of your playbook", meaning: "abandon old strategies" },
      { phrase: "only 30-40% transfers here", meaning: "limited applicability of past knowledge" },
      { phrase: "5% optimizing, 95% innovating", meaning: "ratio of improvement vs invention" },
      { phrase: "fast moving waters", meaning: "rapidly changing environment" },
      { phrase: "capture the demand", meaning: "convert interest into users" }
    ],
    vocabulary: [
      { word: "playbook", definition: "standard strategies and tactics", example: "The traditional growth playbook doesn't work here." },
      { word: "optimization", definition: "improving existing things", example: "We spent too much time on optimization." },
      { word: "innovation", definition: "creating new solutions", example: "Innovation is more important than optimization right now." }
    ],
    writingPrompt: "What from your past experience might NOT apply to your your product? What new approaches might you need?",
    speakingPrompt: "Explain why old growth strategies might not work in a new market.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-130 of Elena Verna 4.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn change and adaptation vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice contrasting language" },
      { name: "Writing", duration: "10 min", description: "Analyze what doesn't transfer" },
      { name: "Recording", duration: "5 min", description: "Explain changing strategies" }
    ],
    isReviewDay: false
  },
  {
    day: 24,
    week: 4,
    title: "Building in Public",
    theme: "Go-to-Market & Launch",
    transcript: "Elena Verna 4.0",
    transcriptFile: "Elena Verna 4.0.txt",
    lineRange: "130-175",
    focusArea: "Marketing strategy vocabulary",
    keyPhrases: [
      { phrase: "maintain noise in the market", meaning: "stay visible and talked about" },
      { phrase: "shipping velocity", meaning: "speed of releasing updates" },
      { phrase: "everybody has a marketer within them", meaning: "everyone can promote" },
      { phrase: "social > SEO now", meaning: "social media matters more than search" },
      { phrase: "founder-led socials", meaning: "founders actively posting content" }
    ],
    vocabulary: [
      { word: "organic", definition: "unpaid, natural growth", example: "Our organic social strategy is working well." },
      { word: "engagement", definition: "user interaction with content", example: "Engagement rates are up 50%." },
      { word: "visibility", definition: "being seen by potential users", example: "We need more visibility in the market." }
    ],
    writingPrompt: "Create a 'building in public' plan. What will you share? Write 3 example social posts announcing features.",
    speakingPrompt: "Record a short video announcing a new feature as if posting to social media.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-175 of Elena Verna 4.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn social media marketing vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice energetic announcement style" },
      { name: "Writing", duration: "10 min", description: "Write 3 social posts" },
      { name: "Recording", duration: "5 min", description: "Record a feature announcement" }
    ],
    isReviewDay: false
  },
  {
    day: 25,
    week: 4,
    title: "New Growth Strategies",
    theme: "Go-to-Market & Launch",
    transcript: "Elena Verna 4.0",
    transcriptFile: "Elena Verna 4.0.txt",
    lineRange: "175-200",
    focusArea: "Strategic thinking, adaptation",
    keyPhrases: [
      { phrase: "giving your product away", meaning: "free access to drive adoption" },
      { phrase: "remove the barrier of entry", meaning: "eliminate friction to trying" },
      { phrase: "blow their socks off", meaning: "amaze and delight users" },
      { phrase: "cycles are really, really short", meaning: "rapid iteration" },
      { phrase: "word of mouth loop", meaning: "users naturally telling others" }
    ],
    vocabulary: [
      { word: "barrier", definition: "obstacle to taking action", example: "Price is a barrier for many users." },
      { word: "freemium", definition: "free basic + paid premium", example: "Our freemium model converts 5%." },
      { word: "adoption", definition: "users starting to use product", example: "Adoption accelerated after we removed signup friction." }
    ],
    writingPrompt: "How will you 'give away' your your product to drive growth? Design a generous free tier.",
    speakingPrompt: "Pitch your free tier as if convincing a skeptical investor it will drive growth.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 175-200 of Elena Verna 4.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn pricing and adoption vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice persuasive strategy talk" },
      { name: "Writing", duration: "10 min", description: "Design your free tier" },
      { name: "Recording", duration: "5 min", description: "Pitch your free tier strategy" }
    ],
    isReviewDay: false
  },
  {
    day: 26,
    week: 4,
    title: "Launch Strategy Deep Dive",
    theme: "Go-to-Market & Launch",
    transcript: "Ryan Hoover",
    transcriptFile: "Ryan Hoover.txt",
    lineRange: "100-150",
    focusArea: "Marketing vocabulary, cause and effect",
    keyPhrases: [
      { phrase: "what's the goal?", meaning: "clarifying objectives" },
      { phrase: "team morale", meaning: "team spirit and motivation" },
      { phrase: "serendipitous effect", meaning: "unexpected positive outcomes" },
      { phrase: "speak like a human, not PR", meaning: "authentic communication" },
      { phrase: "the gallery is often the first thing", meaning: "visuals matter most" }
    ],
    vocabulary: [
      { word: "launch", definition: "public release of a product", example: "Our Product Hunt launch drove 5,000 signups." },
      { word: "momentum", definition: "force of forward movement", example: "The launch created momentum for fundraising." },
      { word: "serendipity", definition: "happy accidents", example: "Launches create serendipity through exposure." }
    ],
    writingPrompt: "Write your Product Hunt launch description. Make it human, not PR-speak.",
    speakingPrompt: "Present your launch plan to your team, explaining the goals beyond just user acquisition.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 100-150 of Ryan Hoover transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn launch vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice human vs PR speaking" },
      { name: "Writing", duration: "10 min", description: "Write your launch description" },
      { name: "Recording", duration: "5 min", description: "Present your launch plan" }
    ],
    isReviewDay: false
  },
  {
    day: 27,
    week: 4,
    title: "Launch Best Practices",
    theme: "Go-to-Market & Launch",
    transcript: "Ryan Hoover",
    transcriptFile: "Ryan Hoover.txt",
    lineRange: "150-200",
    focusArea: "Tactical advice, specificity",
    keyPhrases: [
      { phrase: "how do your customers describe...", meaning: "using user language" },
      { phrase: "visually interesting story", meaning: "compelling visual narrative" },
      { phrase: "tap into something", meaning: "connect with deeper need" },
      { phrase: "the zeitgeist", meaning: "spirit of the times" },
      { phrase: "seemingly boring companies", meaning: "unexpected successes" }
    ],
    vocabulary: [
      { word: "microcopy", definition: "small pieces of UI text", example: "Good microcopy guides users effortlessly." },
      { word: "tagline", definition: "memorable phrase describing product", example: "Our tagline is 'Meet interesting people.'" },
      { word: "niche", definition: "specialized segment", example: "We're targeting a niche first." }
    ],
    writingPrompt: "Write 3 different taglines for your your product. Test them with friends.",
    speakingPrompt: "Practice your 30-second elevator pitch using your best tagline.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 150-200 of Ryan Hoover transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn copywriting vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice punchy, memorable phrases" },
      { name: "Writing", duration: "10 min", description: "Write 3 taglines" },
      { name: "Recording", duration: "5 min", description: "Practice elevator pitch" }
    ],
    isReviewDay: false
  },
  {
    day: 28,
    week: 4,
    title: "Week 4 Review & Mid-Point Celebration",
    theme: "Go-to-Market & Launch",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 4 Content + Weeks 1-3 Review",
    focusArea: "Growth strategies synthesis and mid-course reflection",
    keyPhrases: [
      { phrase: "halfway through", meaning: "at the midpoint" },
      { phrase: "looking back", meaning: "reflecting on past progress" },
      { phrase: "adjusted my approach", meaning: "changed strategy based on learning" },
      { phrase: "the compound effect", meaning: "accumulated gains over time" },
      { phrase: "celebrate the progress", meaning: "acknowledge achievements" }
    ],
    vocabulary: [
      { word: "milestone", definition: "significant achievement point", example: "Hitting 1,000 users was a major milestone." },
      { word: "reflection", definition: "thoughtful consideration", example: "Weekly reflection improves learning retention." },
      { word: "compound", definition: "accumulating over time", example: "Knowledge compounds with daily practice." }
    ],
    writingPrompt: "Write 600 words: 'My growth strategy for your product.' Synthesize all lessons from Weeks 1-4.",
    speakingPrompt: "Record a 5-minute podcast-style summary of what you've learned about growth.",
    activities: [
      { name: "Vocabulary Review", duration: "20 min", description: "Review all 120+ words from Weeks 1-4" },
      { name: "Writing", duration: "25 min", description: "Write your growth strategy essay" },
      { name: "Speaking Practice", duration: "10 min", description: "Record your 5-minute podcast" },
      { name: "Celebration", duration: "5 min", description: "Acknowledge your progress!" }
    ],
    isReviewDay: true
  },

  // Week 5: Product Craft & User Psychology
  {
    day: 29,
    week: 5,
    title: "Airbnb's Founder-Led Turnaround",
    theme: "Product Craft & User Psychology",
    transcript: "Brian Chesky",
    transcriptFile: "Brian Chesky.txt",
    lineRange: "1-75",
    focusArea: "Crisis storytelling, leadership in adversity",
    keyPhrases: [
      { phrase: "we lost 80% of our business", meaning: "dramatic revenue decline" },
      { phrase: "I decided to get involved in the details", meaning: "hands-on leadership approach" },
      { phrase: "founder mode", meaning: "CEO deeply engaged in product decisions" },
      { phrase: "we went back to our roots", meaning: "returning to core principles" },
      { phrase: "the whole world shut down", meaning: "describing a global crisis" }
    ],
    vocabulary: [
      { word: "turnaround", definition: "recovery from a bad situation", example: "The company turnaround required bold decisions." },
      { word: "resilience", definition: "ability to recover from setbacks", example: "Startup founders need extreme resilience." },
      { word: "pivot", definition: "fundamental change in direction", example: "We pivoted from events to virtual experiences." }
    ],
    writingPrompt: "Describe a crisis you faced in your work. How did you respond? What would you do differently?",
    speakingPrompt: "Tell the story of a professional setback and what you learned, in 3 minutes.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Brian Chesky transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn crisis and leadership vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Brian's storytelling intensity" },
      { name: "Writing", duration: "10 min", description: "Write about a crisis you faced" },
      { name: "Recording", duration: "5 min", description: "Tell your setback story" }
    ],
    isReviewDay: false
  },
  {
    day: 30,
    week: 5,
    title: "Product Review Culture",
    theme: "Product Craft & User Psychology",
    transcript: "Brian Chesky",
    transcriptFile: "Brian Chesky.txt",
    lineRange: "75-150",
    focusArea: "Design thinking vocabulary, attention to detail",
    keyPhrases: [
      { phrase: "I review every single pixel", meaning: "extreme attention to detail" },
      { phrase: "Steve Jobs used to", meaning: "drawing parallels to iconic leaders" },
      { phrase: "the details are not the details", meaning: "small things define the product" },
      { phrase: "I want to be in the room", meaning: "staying close to the work" },
      { phrase: "world-class experience", meaning: "best-in-class quality" }
    ],
    vocabulary: [
      { word: "pixel-perfect", definition: "extremely precise design", example: "Our UI needs to be pixel-perfect." },
      { word: "craft", definition: "skill and care in making things", example: "Great products require craft and attention." },
      { word: "iteration", definition: "repeated cycles of refinement", example: "Each iteration improved the user experience." }
    ],
    writingPrompt: "What level of detail matters in your product? Pick one feature and describe every detail that makes it great.",
    speakingPrompt: "Explain why attention to detail matters in product development.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-150 of Brian Chesky transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn design thinking vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice describing details precisely" },
      { name: "Writing", duration: "10 min", description: "Describe your product's details" },
      { name: "Recording", duration: "5 min", description: "Explain the importance of detail" }
    ],
    isReviewDay: false
  },
  {
    day: 31,
    week: 5,
    title: "Scaling Culture & Community",
    theme: "Product Craft & User Psychology",
    transcript: "Brian Chesky",
    transcriptFile: "Brian Chesky.txt",
    lineRange: "150-225",
    focusArea: "Community building, mission-driven language",
    keyPhrases: [
      { phrase: "belong anywhere", meaning: "Airbnb's mission statement" },
      { phrase: "community-driven growth", meaning: "users building the product together" },
      { phrase: "trust between strangers", meaning: "enabling new social behaviors" },
      { phrase: "scaling what doesn't scale", meaning: "doing unscalable things early on" },
      { phrase: "the host community", meaning: "supply-side user base" }
    ],
    vocabulary: [
      { word: "marketplace", definition: "platform connecting buyers and sellers", example: "Building a marketplace requires balancing supply and demand." },
      { word: "community", definition: "group of users with shared purpose", example: "Our community drives most of our growth." },
      { word: "mission", definition: "core purpose of a company", example: "A strong mission attracts passionate employees." }
    ],
    writingPrompt: "What is your product's mission? How do you build community around it? Write 200 words.",
    speakingPrompt: "Present your product's mission as if speaking at a company all-hands meeting.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 150-225 of Brian Chesky transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn community and mission vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice mission-driven speaking" },
      { name: "Writing", duration: "10 min", description: "Define your product's mission" },
      { name: "Recording", duration: "5 min", description: "Deliver your all-hands speech" }
    ],
    isReviewDay: false
  },
  {
    day: 32,
    week: 5,
    title: "The Hook Model Introduction",
    theme: "Product Craft & User Psychology",
    transcript: "Nir Eyal",
    transcriptFile: "Nir Eyal.txt",
    lineRange: "1-75",
    focusArea: "Behavioral psychology vocabulary",
    keyPhrases: [
      { phrase: "trigger, action, variable reward, investment", meaning: "the four steps of the Hook Model" },
      { phrase: "habit-forming products", meaning: "products users return to automatically" },
      { phrase: "internal trigger", meaning: "emotion or thought that prompts usage" },
      { phrase: "external trigger", meaning: "notification or cue from outside" },
      { phrase: "the user doesn't even think about it", meaning: "automatic behavior" }
    ],
    vocabulary: [
      { word: "habit", definition: "automatic behavior requiring little thought", example: "Checking Instagram is a habit for many people." },
      { word: "trigger", definition: "cue that initiates a behavior", example: "Boredom is a powerful internal trigger." },
      { word: "engagement", definition: "degree of user interaction", example: "Daily engagement is our north star metric." }
    ],
    writingPrompt: "Map your product to the Hook Model. What triggers bring users back? What rewards keep them engaged?",
    speakingPrompt: "Explain the Hook Model to a colleague using examples from products you use daily.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Nir Eyal transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn behavioral psychology vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Nir's educational style" },
      { name: "Writing", duration: "10 min", description: "Apply the Hook Model to your product" },
      { name: "Recording", duration: "5 min", description: "Teach the Hook Model" }
    ],
    isReviewDay: false
  },
  {
    day: 33,
    week: 5,
    title: "Variable Rewards & Investment",
    theme: "Product Craft & User Psychology",
    transcript: "Nir Eyal",
    transcriptFile: "Nir Eyal.txt",
    lineRange: "75-140",
    focusArea: "Explaining psychological concepts",
    keyPhrases: [
      { phrase: "variable reward", meaning: "unpredictable outcome that drives curiosity" },
      { phrase: "the investment phase", meaning: "user puts something in to get more out later" },
      { phrase: "stored value", meaning: "accumulated data, content, or reputation" },
      { phrase: "loading the next trigger", meaning: "setting up the reason to return" },
      { phrase: "the more you use it, the better it gets", meaning: "product improves with usage" }
    ],
    vocabulary: [
      { word: "dopamine", definition: "brain chemical linked to reward anticipation", example: "Variable rewards trigger dopamine release." },
      { word: "retention", definition: "keeping users over time", example: "Investment increases long-term retention." },
      { word: "personalization", definition: "tailoring experience to individual", example: "Personalization is a form of stored value." }
    ],
    writingPrompt: "What 'stored value' does your product accumulate? How does usage make the product better for each user?",
    speakingPrompt: "Explain why variable rewards are more engaging than predictable ones, using real examples.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-140 of Nir Eyal transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn reward and investment vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice explaining psychology concepts" },
      { name: "Writing", duration: "10 min", description: "Describe your product's stored value" },
      { name: "Recording", duration: "5 min", description: "Explain variable rewards" }
    ],
    isReviewDay: false
  },
  {
    day: 34,
    week: 5,
    title: "Ethics of Persuasive Design",
    theme: "Product Craft & User Psychology",
    transcript: "Nir Eyal",
    transcriptFile: "Nir Eyal.txt",
    lineRange: "140-200",
    focusArea: "Ethical reasoning, nuanced arguments",
    keyPhrases: [
      { phrase: "manipulation vs persuasion", meaning: "harmful vs helpful influence" },
      { phrase: "are you using your own product?", meaning: "the regret test" },
      { phrase: "materially improve their lives", meaning: "create genuine value" },
      { phrase: "the morality of the maker", meaning: "ethical responsibility of builders" },
      { phrase: "with great power comes great responsibility", meaning: "influence requires ethics" }
    ],
    vocabulary: [
      { word: "ethics", definition: "moral principles guiding behavior", example: "Product ethics should be part of every design review." },
      { word: "manipulation", definition: "controlling someone unfairly", example: "Dark patterns are a form of manipulation." },
      { word: "autonomy", definition: "user's freedom to choose", example: "Ethical design respects user autonomy." }
    ],
    writingPrompt: "Where is the ethical line for your product? How do you ensure you're helping users, not exploiting them?",
    speakingPrompt: "Debate both sides: 'Social media hooks are unethical' — argue for, then against.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 140-200 of Nir Eyal transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn ethics and persuasion vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice nuanced argumentation" },
      { name: "Writing", duration: "10 min", description: "Define your ethical boundaries" },
      { name: "Recording", duration: "5 min", description: "Debate both sides of an issue" }
    ],
    isReviewDay: false
  },
  {
    day: 35,
    week: 5,
    title: "Week 5 Review & Synthesis",
    theme: "Product Craft & User Psychology",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 5 Content",
    focusArea: "Consumer product design and behavioral psychology",
    keyPhrases: [
      { phrase: "user-centric design", meaning: "designing around user needs" },
      { phrase: "behavioral loop", meaning: "cycle of trigger, action, reward" },
      { phrase: "founder involvement", meaning: "hands-on leadership style" },
      { phrase: "ethical product design", meaning: "building responsibly" },
      { phrase: "habit-forming experience", meaning: "product users return to naturally" }
    ],
    vocabulary: [
      { word: "empathy", definition: "understanding user feelings", example: "Empathy is the foundation of good product design." },
      { word: "behavioral design", definition: "using psychology to shape UX", example: "Behavioral design drives our onboarding flow." },
      { word: "experience", definition: "user's overall interaction with product", example: "The end-to-end experience must feel seamless." }
    ],
    writingPrompt: "Write 400 words: 'How I would design a habit-forming product ethically.' Combine Chesky's craft with Nir's frameworks.",
    speakingPrompt: "Record a 3-minute summary of what you learned about consumer apps this week.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 150+ words from Weeks 1-5" },
      { name: "Writing", duration: "20 min", description: "Write your ethical design essay" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your weekly summary" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your understanding of consumer apps" }
    ],
    isReviewDay: true
  },

  // Week 6: Engagement & Defensibility
  {
    day: 36,
    week: 6,
    title: "Building Instagram's Culture",
    theme: "Engagement & Defensibility",
    transcript: "Mike Krieger",
    transcriptFile: "Mike Krieger.txt",
    lineRange: "1-75",
    focusArea: "Team building, engineering leadership",
    keyPhrases: [
      { phrase: "simplicity is a feature", meaning: "keeping things simple is intentional" },
      { phrase: "we were a team of 13", meaning: "small team, big impact" },
      { phrase: "do fewer things better", meaning: "focus on quality over quantity" },
      { phrase: "the technical co-founder", meaning: "engineering-focused leader" },
      { phrase: "we built it in 8 weeks", meaning: "speed of execution" }
    ],
    vocabulary: [
      { word: "simplicity", definition: "quality of being easy to understand", example: "Instagram's simplicity was its competitive advantage." },
      { word: "constraint", definition: "limitation that shapes decisions", example: "Constraints often breed creativity." },
      { word: "velocity", definition: "speed of development", example: "Small teams often have higher velocity." }
    ],
    writingPrompt: "What would your product look like if you could only keep 3 features? Which ones and why?",
    speakingPrompt: "Explain why simplicity in product design is harder than complexity.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Mike Krieger transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn simplicity and engineering vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Mike's clear, concise style" },
      { name: "Writing", duration: "10 min", description: "Simplify your product to 3 features" },
      { name: "Recording", duration: "5 min", description: "Explain simplicity vs complexity" }
    ],
    isReviewDay: false
  },
  {
    day: 37,
    week: 6,
    title: "Scaling Under Pressure",
    theme: "Engagement & Defensibility",
    transcript: "Mike Krieger",
    transcriptFile: "Mike Krieger.txt",
    lineRange: "75-140",
    focusArea: "Technical scaling, problem-solving under pressure",
    keyPhrases: [
      { phrase: "the servers kept crashing", meaning: "infrastructure couldn't handle demand" },
      { phrase: "we had to make trade-offs", meaning: "choosing between competing priorities" },
      { phrase: "move fast and fix things", meaning: "balancing speed with stability" },
      { phrase: "technical debt", meaning: "shortcuts that create future problems" },
      { phrase: "scaling from millions to billions", meaning: "massive growth in user base" }
    ],
    vocabulary: [
      { word: "scalability", definition: "ability to handle growth", example: "We need to think about scalability from day one." },
      { word: "infrastructure", definition: "underlying technical systems", example: "Infrastructure investments pay off during growth." },
      { word: "trade-off", definition: "giving up one thing for another", example: "Speed vs quality is a common trade-off." }
    ],
    writingPrompt: "What are the biggest technical challenges your product will face at 10x scale? How would you prepare?",
    speakingPrompt: "Describe a time you had to solve a problem under pressure. What did you prioritize?",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-140 of Mike Krieger transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn scaling and infrastructure vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice problem-solving narratives" },
      { name: "Writing", duration: "10 min", description: "Plan for 10x scale challenges" },
      { name: "Recording", duration: "5 min", description: "Tell a pressure-solving story" }
    ],
    isReviewDay: false
  },
  {
    day: 38,
    week: 6,
    title: "Product Taste & Decision-Making",
    theme: "Engagement & Defensibility",
    transcript: "Mike Krieger",
    transcriptFile: "Mike Krieger.txt",
    lineRange: "140-200",
    focusArea: "Product intuition, decision frameworks",
    keyPhrases: [
      { phrase: "product taste", meaning: "intuition for what makes a great product" },
      { phrase: "data-informed, not data-driven", meaning: "data supports but doesn't replace judgment" },
      { phrase: "ship and learn", meaning: "release to discover what works" },
      { phrase: "strong opinions, loosely held", meaning: "have a view but be open to change" },
      { phrase: "the user doesn't care about your org chart", meaning: "focus on user experience, not internal structure" }
    ],
    vocabulary: [
      { word: "intuition", definition: "instinctive understanding", example: "Product intuition develops through experience." },
      { word: "data-informed", definition: "using data as one input among many", example: "We're data-informed, not data-driven." },
      { word: "conviction", definition: "strong belief in a direction", example: "Great PMs have conviction in their product vision." }
    ],
    writingPrompt: "Describe a product decision where data and intuition disagreed. What would you do and why?",
    speakingPrompt: "Explain the difference between data-driven and data-informed decision-making.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 140-200 of Mike Krieger transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn decision-making vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice articulating product taste" },
      { name: "Writing", duration: "10 min", description: "Navigate a data vs intuition conflict" },
      { name: "Recording", duration: "5 min", description: "Explain data-informed decisions" }
    ],
    isReviewDay: false
  },
  {
    day: 39,
    week: 6,
    title: "Hierarchy of Engagement",
    theme: "Engagement & Defensibility",
    transcript: "Sarah Tavel",
    transcriptFile: "Sarah Tavel.txt",
    lineRange: "1-70",
    focusArea: "Framework explanation, analytical vocabulary",
    keyPhrases: [
      { phrase: "growing engaged users", meaning: "first level of the hierarchy" },
      { phrase: "retaining engaged users", meaning: "keeping users who find value" },
      { phrase: "self-perpetuating", meaning: "sustaining itself without external force" },
      { phrase: "core action", meaning: "the key behavior that defines engagement" },
      { phrase: "not all users are created equal", meaning: "focus on high-value users" }
    ],
    vocabulary: [
      { word: "hierarchy", definition: "ranked system of levels", example: "The hierarchy of engagement has three levels." },
      { word: "accruing benefit", definition: "value that builds over time", example: "Each connection adds accruing benefit to the network." },
      { word: "virtuous cycle", definition: "positive self-reinforcing loop", example: "Engagement creates a virtuous cycle of growth." }
    ],
    writingPrompt: "What is the 'core action' in your product? How does engagement build on itself over time?",
    speakingPrompt: "Teach Sarah Tavel's Hierarchy of Engagement framework using your product as the example.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-70 of Sarah Tavel transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn engagement framework vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Sarah's analytical style" },
      { name: "Writing", duration: "10 min", description: "Define your core action" },
      { name: "Recording", duration: "5 min", description: "Teach the engagement hierarchy" }
    ],
    isReviewDay: false
  },
  {
    day: 40,
    week: 6,
    title: "Mounting Losses & Network Effects",
    theme: "Engagement & Defensibility",
    transcript: "Sarah Tavel",
    transcriptFile: "Sarah Tavel.txt",
    lineRange: "70-130",
    focusArea: "Competitive strategy, retention mechanics",
    keyPhrases: [
      { phrase: "mounting loss", meaning: "increasing cost of leaving" },
      { phrase: "switching cost", meaning: "effort required to move to a competitor" },
      { phrase: "the product gets better with use", meaning: "usage improves the experience" },
      { phrase: "defensible engagement", meaning: "engagement that competitors can't replicate" },
      { phrase: "winner takes most", meaning: "the leader captures majority of the market" }
    ],
    vocabulary: [
      { word: "lock-in", definition: "when users can't easily leave", example: "Data lock-in keeps users on the platform." },
      { word: "switching cost", definition: "cost of changing products", example: "High switching costs create defensibility." },
      { word: "network effect", definition: "value increases with more users", example: "Strong network effects make the product defensible." }
    ],
    writingPrompt: "What creates 'mounting loss' in your product? How do you make leaving increasingly costly?",
    speakingPrompt: "Explain why some products become harder to leave the more you use them.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 70-130 of Sarah Tavel transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn competitive strategy vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice strategic analysis language" },
      { name: "Writing", duration: "10 min", description: "Analyze your product's mounting losses" },
      { name: "Recording", duration: "5 min", description: "Explain increasing switching costs" }
    ],
    isReviewDay: false
  },
  {
    day: 41,
    week: 6,
    title: "Identifying Winning Startups",
    theme: "Engagement & Defensibility",
    transcript: "Sarah Tavel",
    transcriptFile: "Sarah Tavel.txt",
    lineRange: "130-190",
    focusArea: "Investment thesis, pattern recognition",
    keyPhrases: [
      { phrase: "the ah-ha moment", meaning: "when a user first sees the value" },
      { phrase: "what I look for", meaning: "investor evaluation criteria" },
      { phrase: "leading indicators", meaning: "early signals of future success" },
      { phrase: "lagging indicators", meaning: "signals that confirm past success" },
      { phrase: "the magic number", meaning: "threshold that predicts retention" }
    ],
    vocabulary: [
      { word: "thesis", definition: "central argument or belief", example: "Our investment thesis focuses on network effects." },
      { word: "leading indicator", definition: "early predictor of outcome", example: "Day-1 retention is a leading indicator of product-market fit." },
      { word: "inflection point", definition: "moment when growth accelerates", example: "We hit an inflection point at 10,000 users." }
    ],
    writingPrompt: "What are the leading indicators for your product's success? What 'magic number' would predict long-term retention?",
    speakingPrompt: "Pitch your product to an investor, focusing on the engagement metrics that prove traction.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-190 of Sarah Tavel transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn investment and metrics vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice investor communication" },
      { name: "Writing", duration: "10 min", description: "Identify your leading indicators" },
      { name: "Recording", duration: "5 min", description: "Pitch using engagement metrics" }
    ],
    isReviewDay: false
  },
  {
    day: 42,
    week: 6,
    title: "Week 6 Review & Synthesis",
    theme: "Engagement & Defensibility",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 6 Content",
    focusArea: "Engagement frameworks and product craft",
    keyPhrases: [
      { phrase: "simplicity and focus", meaning: "doing fewer things well" },
      { phrase: "engagement hierarchy", meaning: "levels of user engagement" },
      { phrase: "defensible product", meaning: "hard for competitors to replicate" },
      { phrase: "product craft", meaning: "care and skill in building" },
      { phrase: "data-informed decisions", meaning: "using data as one input" }
    ],
    vocabulary: [
      { word: "moat", definition: "sustainable competitive advantage", example: "Our engagement moat grows with each user." },
      { word: "craft", definition: "skill in design and execution", example: "Product craft separates good from great." },
      { word: "defensibility", definition: "ability to maintain position", example: "Network effects create natural defensibility." }
    ],
    writingPrompt: "Write 400 words: 'My engagement strategy.' Combine Mike Krieger's craft with Sarah Tavel's framework.",
    speakingPrompt: "Record a 3-minute analysis of your product's engagement hierarchy.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 180+ words from Weeks 1-6" },
      { name: "Writing", duration: "20 min", description: "Write your engagement strategy" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your engagement analysis" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your understanding of engagement" }
    ],
    isReviewDay: true
  },

  // Week 7: Influence & Career Growth
  {
    day: 43,
    week: 7,
    title: "Breaking Into Leadership",
    theme: "Influence & Career Growth",
    transcript: "Deb Liu",
    transcriptFile: "Deb Liu.txt",
    lineRange: "1-75",
    focusArea: "Career advancement, self-advocacy",
    keyPhrases: [
      { phrase: "take a seat at the table", meaning: "assert yourself in important discussions" },
      { phrase: "no one will advocate for you", meaning: "you must speak up for yourself" },
      { phrase: "the rules are different", meaning: "expectations vary for different groups" },
      { phrase: "build your brand internally", meaning: "be known for something at work" },
      { phrase: "I didn't wait for permission", meaning: "taking initiative" }
    ],
    vocabulary: [
      { word: "advocacy", definition: "active support for a cause or person", example: "Self-advocacy is essential for career growth." },
      { word: "visibility", definition: "being noticed by decision-makers", example: "Visibility leads to opportunity." },
      { word: "sponsor", definition: "senior person who champions you", example: "A sponsor will put your name forward for promotions." }
    ],
    writingPrompt: "How do you make your work visible? Write 3 strategies for building your internal brand.",
    speakingPrompt: "Practice advocating for yourself in a promotion conversation with your manager.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-75 of Deb Liu transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn leadership and advocacy vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Deb's confident, direct style" },
      { name: "Writing", duration: "10 min", description: "Write your visibility strategies" },
      { name: "Recording", duration: "5 min", description: "Practice a promotion conversation" }
    ],
    isReviewDay: false
  },
  {
    day: 44,
    week: 7,
    title: "Building Cross-Functional Influence",
    theme: "Influence & Career Growth",
    transcript: "Deb Liu",
    transcriptFile: "Deb Liu.txt",
    lineRange: "75-140",
    focusArea: "Influence without authority, stakeholder management",
    keyPhrases: [
      { phrase: "influence without authority", meaning: "leading people who don't report to you" },
      { phrase: "build alignment", meaning: "get everyone on the same page" },
      { phrase: "understand their incentives", meaning: "know what motivates others" },
      { phrase: "find the win-win", meaning: "create mutual benefit" },
      { phrase: "bring people along", meaning: "include others in the journey" }
    ],
    vocabulary: [
      { word: "alignment", definition: "agreement on direction", example: "We need alignment before moving forward." },
      { word: "stakeholder", definition: "person with interest in outcome", example: "Managing stakeholders is half the PM job." },
      { word: "influence", definition: "power to affect decisions", example: "Influence comes from trust and credibility." }
    ],
    writingPrompt: "Describe a time you needed to influence someone without authority. What worked? What didn't?",
    speakingPrompt: "Role-play persuading an engineering lead to prioritize your feature request.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 75-140 of Deb Liu transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn influence and alignment vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice persuasion techniques" },
      { name: "Writing", duration: "10 min", description: "Reflect on influence experiences" },
      { name: "Recording", duration: "5 min", description: "Practice the persuasion role-play" }
    ],
    isReviewDay: false
  },
  {
    day: 45,
    week: 7,
    title: "Navigating Company Politics",
    theme: "Influence & Career Growth",
    transcript: "Deb Liu",
    transcriptFile: "Deb Liu.txt",
    lineRange: "140-200",
    focusArea: "Organizational dynamics, political awareness",
    keyPhrases: [
      { phrase: "politics is not a dirty word", meaning: "understanding dynamics is necessary" },
      { phrase: "read the room", meaning: "sense the social dynamics" },
      { phrase: "pick your battles", meaning: "choose what to fight for carefully" },
      { phrase: "organizational capital", meaning: "accumulated trust and goodwill" },
      { phrase: "play the long game", meaning: "think about long-term relationships" }
    ],
    vocabulary: [
      { word: "politics", definition: "power dynamics within organizations", example: "Navigating politics is a leadership skill." },
      { word: "capital", definition: "accumulated trust and credibility", example: "Spend your political capital wisely." },
      { word: "coalition", definition: "group allied for a common purpose", example: "Build a coalition before proposing big changes." }
    ],
    writingPrompt: "What organizational dynamics affect your work? How can you navigate them more effectively?",
    speakingPrompt: "Explain to a new employee how to navigate company politics without being political.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 140-200 of Deb Liu transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn organizational dynamics vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice diplomatic communication" },
      { name: "Writing", duration: "10 min", description: "Analyze your organizational dynamics" },
      { name: "Recording", duration: "5 min", description: "Advise on navigating politics" }
    ],
    isReviewDay: false
  },
  {
    day: 46,
    week: 7,
    title: "The Art of Saying No",
    theme: "Influence & Career Growth",
    transcript: "Ethan Evans 2.0",
    transcriptFile: "Ethan Evans 2.0.txt",
    lineRange: "1-70",
    focusArea: "Priority management, assertive communication",
    keyPhrases: [
      { phrase: "saying no is saying yes to something else", meaning: "every no protects a yes" },
      { phrase: "ruthless prioritization", meaning: "aggressively cutting low-value work" },
      { phrase: "what would you cut?", meaning: "forcing priority trade-offs" },
      { phrase: "the VP test", meaning: "would a VP approve how you spend time?" },
      { phrase: "protect your calendar", meaning: "guard time for important work" }
    ],
    vocabulary: [
      { word: "prioritization", definition: "deciding what matters most", example: "Ruthless prioritization is a senior skill." },
      { word: "trade-off", definition: "giving up one thing for another", example: "Every yes involves a trade-off." },
      { word: "leverage", definition: "maximum impact per unit of effort", example: "Focus on high-leverage activities." }
    ],
    writingPrompt: "List everything on your plate. Now cut half. Write about what you'd drop and why.",
    speakingPrompt: "Practice saying no to a request politely but firmly, explaining your priorities.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-70 of Ethan Evans 2.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn prioritization vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice assertive communication" },
      { name: "Writing", duration: "10 min", description: "Prioritize and cut your task list" },
      { name: "Recording", duration: "5 min", description: "Practice saying no" }
    ],
    isReviewDay: false
  },
  {
    day: 47,
    week: 7,
    title: "Managing Up Effectively",
    theme: "Influence & Career Growth",
    transcript: "Ethan Evans 2.0",
    transcriptFile: "Ethan Evans 2.0.txt",
    lineRange: "70-130",
    focusArea: "Executive communication, managing expectations",
    keyPhrases: [
      { phrase: "managing up", meaning: "proactively working with your manager" },
      { phrase: "no surprises", meaning: "keep leadership informed" },
      { phrase: "bring solutions, not problems", meaning: "come with recommendations" },
      { phrase: "earn trust", meaning: "build credibility through consistency" },
      { phrase: "under-promise and over-deliver", meaning: "set conservative expectations" }
    ],
    vocabulary: [
      { word: "escalation", definition: "raising issue to higher authority", example: "Know when escalation is appropriate." },
      { word: "credibility", definition: "quality of being trusted", example: "Credibility is built over time, lost in a moment." },
      { word: "transparency", definition: "openness about status and challenges", example: "Transparency builds trust with leadership." }
    ],
    writingPrompt: "How do you currently manage up? Write 3 ways you could improve communication with your manager.",
    speakingPrompt: "Practice giving a project status update to your VP — clear, concise, no surprises.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 70-130 of Ethan Evans 2.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn managing up vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice executive status updates" },
      { name: "Writing", duration: "10 min", description: "Improve your managing-up skills" },
      { name: "Recording", duration: "5 min", description: "Deliver a VP status update" }
    ],
    isReviewDay: false
  },
  {
    day: 48,
    week: 7,
    title: "Career Growth at Senior Levels",
    theme: "Influence & Career Growth",
    transcript: "Ethan Evans 2.0",
    transcriptFile: "Ethan Evans 2.0.txt",
    lineRange: "130-190",
    focusArea: "Senior career strategy, impact measurement",
    keyPhrases: [
      { phrase: "the scope of your impact", meaning: "how broadly your work matters" },
      { phrase: "from IC to leader", meaning: "transitioning from individual work to leading" },
      { phrase: "multiplier effect", meaning: "making the team better, not just yourself" },
      { phrase: "the higher you go, the less you do yourself", meaning: "leadership means enabling others" },
      { phrase: "your legacy", meaning: "lasting impact beyond your tenure" }
    ],
    vocabulary: [
      { word: "scope", definition: "breadth and scale of responsibility", example: "To grow, you need to increase your scope." },
      { word: "multiplier", definition: "force that amplifies results", example: "Great leaders are force multipliers." },
      { word: "legacy", definition: "lasting impact left behind", example: "What legacy will you leave at this company?" }
    ],
    writingPrompt: "Where do you want to be in 5 years? What scope of impact do you want to have? Write your career vision.",
    speakingPrompt: "Describe the difference between being a great IC and a great leader.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-190 of Ethan Evans 2.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn senior career vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice visionary speaking" },
      { name: "Writing", duration: "10 min", description: "Write your 5-year career vision" },
      { name: "Recording", duration: "5 min", description: "Explain IC vs leader difference" }
    ],
    isReviewDay: false
  },
  {
    day: 49,
    week: 7,
    title: "Week 7 Review & Synthesis",
    theme: "Influence & Career Growth",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 7 Content",
    focusArea: "Leadership principles and career strategy",
    keyPhrases: [
      { phrase: "executive presence", meaning: "projecting confidence and competence" },
      { phrase: "strategic thinking", meaning: "seeing the bigger picture" },
      { phrase: "influence and impact", meaning: "shaping outcomes and making a difference" },
      { phrase: "self-advocacy", meaning: "speaking up for yourself" },
      { phrase: "servant leadership", meaning: "leading by empowering others" }
    ],
    vocabulary: [
      { word: "presence", definition: "quality of commanding attention", example: "Executive presence is developed, not innate." },
      { word: "empowerment", definition: "giving others authority to act", example: "Empowerment is the mark of a mature leader." },
      { word: "mentorship", definition: "guidance from experienced person", example: "Mentorship accelerates career growth." }
    ],
    writingPrompt: "Write 500 words: 'My leadership philosophy.' Draw from Deb Liu and Ethan Evans.",
    speakingPrompt: "Record a 3-minute talk on what leadership means to you, using vocabulary from this week.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 210+ words from Weeks 1-7" },
      { name: "Writing", duration: "20 min", description: "Write your leadership philosophy" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your leadership talk" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your leadership skills" }
    ],
    isReviewDay: true
  },

  // Week 8: Scaling & Delegation
  {
    day: 50,
    week: 8,
    title: "The Give-Away Game",
    theme: "Scaling & Delegation",
    transcript: "Molly Graham",
    transcriptFile: "Molly Graham.txt",
    lineRange: "1-70",
    focusArea: "Delegation, letting go of responsibilities",
    keyPhrases: [
      { phrase: "give away your Legos", meaning: "let go of responsibilities as the team grows" },
      { phrase: "it feels like someone is taking something from you", meaning: "emotional challenge of delegation" },
      { phrase: "your job is to build the next thing", meaning: "focus on new challenges" },
      { phrase: "from doing to enabling", meaning: "shifting from execution to leadership" },
      { phrase: "if you hold on too tight", meaning: "clinging to old responsibilities slows growth" }
    ],
    vocabulary: [
      { word: "delegation", definition: "assigning tasks to others", example: "Effective delegation is a growth skill." },
      { word: "empowerment", definition: "giving others authority", example: "Empowerment requires trust." },
      { word: "scalable", definition: "able to grow without breaking", example: "Is your leadership style scalable?" }
    ],
    writingPrompt: "What 'Legos' are you holding onto that you should give away? List 3 responsibilities to delegate.",
    speakingPrompt: "Explain Molly Graham's 'give away your Legos' concept to a new manager.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-70 of Molly Graham transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn delegation vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Molly's relatable style" },
      { name: "Writing", duration: "10 min", description: "Identify what to delegate" },
      { name: "Recording", duration: "5 min", description: "Teach the Legos concept" }
    ],
    isReviewDay: false
  },
  {
    day: 51,
    week: 8,
    title: "Hiring & Team Building",
    theme: "Scaling & Delegation",
    transcript: "Molly Graham",
    transcriptFile: "Molly Graham.txt",
    lineRange: "70-130",
    focusArea: "Hiring vocabulary, team composition",
    keyPhrases: [
      { phrase: "hire for the next stage", meaning: "recruit for future needs, not current ones" },
      { phrase: "culture add, not culture fit", meaning: "bring diverse perspectives" },
      { phrase: "the team you need at 10 is different from 100", meaning: "team needs change with scale" },
      { phrase: "raise the bar", meaning: "each new hire should raise average quality" },
      { phrase: "set them up for success", meaning: "provide context and support" }
    ],
    vocabulary: [
      { word: "onboarding", definition: "process of integrating new employees", example: "Good onboarding reduces time to productivity." },
      { word: "culture", definition: "shared values and behaviors", example: "Culture is what happens when no one is watching." },
      { word: "bar-raiser", definition: "person who elevates team quality", example: "Every hire should be a bar-raiser." }
    ],
    writingPrompt: "What does your ideal team look like? Describe the first 3 hires you'd make and why.",
    speakingPrompt: "Conduct a mock interview — ask 3 questions that reveal if someone is a culture add.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 70-130 of Molly Graham transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn hiring and team vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice hiring conversation style" },
      { name: "Writing", duration: "10 min", description: "Describe your ideal team" },
      { name: "Recording", duration: "5 min", description: "Practice mock interview questions" }
    ],
    isReviewDay: false
  },
  {
    day: 52,
    week: 8,
    title: "Managing Through Hypergrowth",
    theme: "Scaling & Delegation",
    transcript: "Molly Graham",
    transcriptFile: "Molly Graham.txt",
    lineRange: "130-190",
    focusArea: "Change management, organizational scaling",
    keyPhrases: [
      { phrase: "what got you here won't get you there", meaning: "past strategies don't always scale" },
      { phrase: "redefine your role every 6 months", meaning: "rapid evolution in hypergrowth" },
      { phrase: "organizational growing pains", meaning: "challenges from rapid growth" },
      { phrase: "process is not the enemy", meaning: "structure enables speed at scale" },
      { phrase: "keep the founders close to the product", meaning: "maintain founder involvement" }
    ],
    vocabulary: [
      { word: "hypergrowth", definition: "extremely rapid scaling", example: "Hypergrowth breaks everything you've built." },
      { word: "growing pains", definition: "difficulties from rapid expansion", example: "Communication is the first growing pain." },
      { word: "process", definition: "defined way of doing things", example: "Process enables scale without chaos." }
    ],
    writingPrompt: "What processes does your product or team need now? What will you need at 10x scale?",
    speakingPrompt: "Describe a time when a previous way of working stopped working. How did you adapt?",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 130-190 of Molly Graham transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn scaling and change vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice change management language" },
      { name: "Writing", duration: "10 min", description: "Plan your scaling processes" },
      { name: "Recording", duration: "5 min", description: "Tell a story of adapting to change" }
    ],
    isReviewDay: false
  },
  {
    day: 53,
    week: 8,
    title: "What PMs Do That Annoy Engineers",
    theme: "Scaling & Delegation",
    transcript: "Camille Fournier",
    transcriptFile: "Camille Fournier.txt",
    lineRange: "1-80",
    focusArea: "Cross-functional collaboration, empathy",
    keyPhrases: [
      { phrase: "hoarding credit", meaning: "taking all the glory for shared work" },
      { phrase: "playing telephone", meaning: "being an unnecessary middle person" },
      { phrase: "act like the details don't matter", meaning: "dismissing engineering complexity" },
      { phrase: "hoarding all the ideas", meaning: "not letting engineers contribute creatively" },
      { phrase: "a real lack of empathy", meaning: "not understanding someone's perspective" }
    ],
    vocabulary: [
      { word: "empathy", definition: "understanding others' perspectives", example: "Empathy for engineering work builds trust." },
      { word: "credit", definition: "recognition for contributions", example: "Share credit generously with your team." },
      { word: "collaboration", definition: "working together effectively", example: "True collaboration means sharing ideas and ownership." }
    ],
    writingPrompt: "How do you share credit with your team? Write 3 specific ways you can better acknowledge others' contributions.",
    speakingPrompt: "Explain to a new PM the top 3 mistakes to avoid when working with engineers.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-80 of Camille Fournier transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn cross-functional collaboration vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Camille's direct, practical style" },
      { name: "Writing", duration: "10 min", description: "Write about sharing credit" },
      { name: "Recording", duration: "5 min", description: "Advise a new PM" }
    ],
    isReviewDay: false
  },
  {
    day: 54,
    week: 8,
    title: "The Rewrite Trap & Technical Decisions",
    theme: "Scaling & Delegation",
    transcript: "Camille Fournier",
    transcriptFile: "Camille Fournier.txt",
    lineRange: "80-160",
    focusArea: "Technical decision-making, trade-off analysis",
    keyPhrases: [
      { phrase: "rewrites are often a trap", meaning: "rebuilding from scratch rarely works" },
      { phrase: "underestimate the migration time", meaning: "moving from old to new takes longer than expected" },
      { phrase: "a thoughtful staged plan", meaning: "incremental improvement vs big bang" },
      { phrase: "over-engineering things", meaning: "making things more complex than needed" },
      { phrase: "you still have to support the old system", meaning: "you can't just stop maintaining what exists" }
    ],
    vocabulary: [
      { word: "rewrite", definition: "rebuilding a system from scratch", example: "The rewrite took twice as long as estimated." },
      { word: "migration", definition: "moving from one system to another", example: "Migration costs are always underestimated." },
      { word: "incremental", definition: "done in small steps", example: "Incremental improvement is safer than big rewrites." }
    ],
    writingPrompt: "Has your team ever debated a rewrite? Describe the situation. What was the right approach — rewrite or evolve?",
    speakingPrompt: "Argue against a full system rewrite to a team that's convinced it's the only option.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 80-160 of Camille Fournier transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn technical decision vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice balanced technical arguments" },
      { name: "Writing", duration: "10 min", description: "Analyze a rewrite decision" },
      { name: "Recording", duration: "5 min", description: "Argue against a rewrite" }
    ],
    isReviewDay: false
  },
  {
    day: 55,
    week: 8,
    title: "IC to Manager Transition",
    theme: "Scaling & Delegation",
    transcript: "Camille Fournier",
    transcriptFile: "Camille Fournier.txt",
    lineRange: "160-240",
    focusArea: "Career transitions, staying technical",
    keyPhrases: [
      { phrase: "don't stop being hands-on until it's in your bones", meaning: "achieve mastery before managing" },
      { phrase: "ask good questions", meaning: "guide through inquiry, not orders" },
      { phrase: "surround yourself with smart technical people", meaning: "build a strong network" },
      { phrase: "don't rush becoming a manager", meaning: "take time to develop IC skills first" },
      { phrase: "from doing to enabling", meaning: "shifting from execution to empowerment" }
    ],
    vocabulary: [
      { word: "mastery", definition: "deep expertise in a skill", example: "Achieve mastery before moving to management." },
      { word: "transition", definition: "process of change from one state to another", example: "The IC to manager transition is challenging." },
      { word: "hands-on", definition: "directly involved in the work", example: "Stay hands-on as long as you can." }
    ],
    writingPrompt: "Are you ready for a leadership transition? What skills do you still want to develop? Write an honest self-assessment.",
    speakingPrompt: "Advise a senior engineer who's considering becoming a manager — what should they consider?",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 160-240 of Camille Fournier transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn career transition vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice mentorship-style advice" },
      { name: "Writing", duration: "10 min", description: "Write your self-assessment" },
      { name: "Recording", duration: "5 min", description: "Advise on the management transition" }
    ],
    isReviewDay: false
  },
  {
    day: 56,
    week: 8,
    title: "Week 8 Review & Synthesis",
    theme: "Scaling & Delegation",
    transcript: "Review Day",
    transcriptFile: "",
    lineRange: "All Week 8 Content",
    focusArea: "Scaling leadership and delegation mastery",
    keyPhrases: [
      { phrase: "give away your Legos", meaning: "delegate as you grow" },
      { phrase: "hire ahead of the curve", meaning: "recruit before you're desperate" },
      { phrase: "radical candor", meaning: "honest and caring feedback" },
      { phrase: "leadership brand", meaning: "what you're known for as a leader" },
      { phrase: "systems over heroics", meaning: "build processes, not dependencies" }
    ],
    vocabulary: [
      { word: "succession", definition: "preparing others to take over", example: "Succession planning is a sign of mature leadership." },
      { word: "leverage", definition: "maximizing impact per effort", example: "Delegation is the highest leverage activity." },
      { word: "institutional knowledge", definition: "collective organizational wisdom", example: "Document institutional knowledge before people leave." }
    ],
    writingPrompt: "Write 500 words: 'How I will scale as a leader.' Include delegation strategy, hiring plan, and feedback practices.",
    speakingPrompt: "Record a 5-minute presentation on your leadership and scaling philosophy.",
    activities: [
      { name: "Vocabulary Review", duration: "15 min", description: "Review all 240+ words from Weeks 1-8" },
      { name: "Writing", duration: "20 min", description: "Write your scaling leadership essay" },
      { name: "Speaking Practice", duration: "15 min", description: "Record your leadership presentation" },
      { name: "Self-Assessment", duration: "10 min", description: "Rate your delegation and leadership skills" }
    ],
    isReviewDay: true
  },

  // Week 9: Storytelling & Integration
  {
    day: 57,
    week: 9,
    title: "Strategic Narrative & Positioning",
    theme: "Storytelling & Integration",
    transcript: "Andy Raskin",
    transcriptFile: "Andy Raskin_.txt",
    lineRange: "1-80",
    focusArea: "Strategic storytelling, pitch structure",
    keyPhrases: [
      { phrase: "the old game to a new game", meaning: "framing a shift in the world" },
      { phrase: "not a compelling story", meaning: "failing to engage the audience" },
      { phrase: "a movie is a pitch", meaning: "storytelling structure applies to business" },
      { phrase: "we didn't change the product", meaning: "the story made the difference, not the product" },
      { phrase: "defining a movement", meaning: "positioning your product as part of a bigger trend" }
    ],
    vocabulary: [
      { word: "narrative", definition: "a story that gives meaning and direction", example: "A strategic narrative aligns the whole company." },
      { word: "positioning", definition: "how product is perceived vs competitors", example: "Our positioning defines our market category." },
      { word: "movement", definition: "collective shift toward a new way", example: "Frame your product as a movement, not just a tool." }
    ],
    writingPrompt: "Write your product's strategic narrative using Andy's framework: What shift is happening? What's the new game? How do you help people win?",
    speakingPrompt: "Pitch your product as a movement — start with the shift in the world, not the features.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-80 of Andy Raskin transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn strategic narrative vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Andy's storytelling style" },
      { name: "Writing", duration: "10 min", description: "Write your strategic narrative" },
      { name: "Recording", duration: "5 min", description: "Pitch your product as a movement" }
    ],
    isReviewDay: false
  },
  {
    day: 58,
    week: 9,
    title: "Presentation Mastery",
    theme: "Storytelling & Integration",
    transcript: "Nancy Duarte",
    transcriptFile: "Nancy Duarte.txt",
    lineRange: "1-80",
    focusArea: "Presentation design, persuasion through contrast",
    keyPhrases: [
      { phrase: "what is, what could be", meaning: "contrasting current state with future possibility" },
      { phrase: "any moment of influence", meaning: "every interaction is a chance to persuade" },
      { phrase: "the ability to have contrast as a framework", meaning: "using tension to drive engagement" },
      { phrase: "a really well done presentation", meaning: "combining data, story, and visuals" },
      { phrase: "he would thoughtfully defer to experts", meaning: "humility makes leaders better communicators" }
    ],
    vocabulary: [
      { word: "contrast", definition: "showing difference between two states", example: "Contrast between 'what is' and 'what could be' drives action." },
      { word: "persuasion", definition: "convincing someone to act or believe", example: "Great presentations are acts of persuasion." },
      { word: "visualization", definition: "presenting data or ideas visually", example: "Data visualization makes complex ideas accessible." }
    ],
    writingPrompt: "Write a 5-minute presentation outline using Nancy's 'what is, what could be' contrast framework for your product.",
    speakingPrompt: "Deliver a 3-minute presentation about your product using contrast between the current problem and your solution.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-80 of Nancy Duarte transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn presentation and persuasion vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Nancy's clear, confident style" },
      { name: "Writing", duration: "10 min", description: "Outline your contrast presentation" },
      { name: "Recording", duration: "5 min", description: "Deliver your contrast presentation" }
    ],
    isReviewDay: false
  },
  {
    day: 59,
    week: 9,
    title: "Executive Communication & Influence",
    theme: "Storytelling & Integration",
    transcript: "Wes Kao 2.0",
    transcriptFile: "Wes Kao 2.0.txt",
    lineRange: "1-80",
    focusArea: "Concise communication, anticipating objections",
    keyPhrases: [
      { phrase: "Most Obvious Objection", meaning: "MOO — anticipate the pushback before it comes" },
      { phrase: "how might I be contributing?", meaning: "taking ownership of communication failures" },
      { phrase: "the blast radius of a poorly written memo", meaning: "bad writing wastes everyone's time" },
      { phrase: "communication is the job", meaning: "leadership is fundamentally about communicating well" },
      { phrase: "explain this more clearly", meaning: "always ask how to improve your message" }
    ],
    vocabulary: [
      { word: "concise", definition: "brief and to the point", example: "Executive communication must be concise." },
      { word: "objection", definition: "reason for disagreeing", example: "Anticipate the most obvious objection before presenting." },
      { word: "agency", definition: "taking ownership and initiative", example: "Agency means asking how you can improve, not blaming others." }
    ],
    writingPrompt: "Rewrite a recent email or Slack message using Wes's principles: be concise, include reasoning, anticipate the MOO.",
    speakingPrompt: "Present a proposal to your team, then preemptively address the 2 most obvious objections.",
    activities: [
      { name: "Read & Listen", duration: "20 min", description: "Read lines 1-80 of Wes Kao 2.0 transcript" },
      { name: "Vocabulary", duration: "10 min", description: "Learn executive communication vocabulary" },
      { name: "Shadowing", duration: "10 min", description: "Practice Wes's precise, structured style" },
      { name: "Writing", duration: "10 min", description: "Rewrite a message using MOO framework" },
      { name: "Recording", duration: "5 min", description: "Present and address objections" }
    ],
    isReviewDay: false
  },
  {
    day: 60,
    week: 9,
    title: "Final Presentation & Celebration",
    theme: "Storytelling & Integration",
    transcript: "Graduation Day",
    transcriptFile: "",
    lineRange: "All 60 days",
    focusArea: "Comprehensive demonstration",
    keyPhrases: [
      { phrase: "in conclusion", meaning: "wrapping up" },
      { phrase: "the journey has taught me", meaning: "reflecting on growth" },
      { phrase: "next steps", meaning: "future actions planned" },
      { phrase: "grateful for", meaning: "expressing appreciation" },
      { phrase: "this is just the beginning", meaning: "continued growth ahead" }
    ],
    vocabulary: [
      { word: "culmination", definition: "the highest point or climax", example: "This presentation is the culmination of 60 days of learning." },
      { word: "transformation", definition: "complete change", example: "The transformation in my English is remarkable." },
      { word: "mastery", definition: "comprehensive skill", example: "Mastery requires continued practice beyond this course." }
    ],
    writingPrompt: "Write a reflection on your 60-day journey. What changed? What will you continue?",
    speakingPrompt: "Record a 15-minute final presentation: 5 min product pitch, 5 min growth strategy, 5 min personal reflection.",
    activities: [
      { name: "Final Presentation", duration: "30 min", description: "Record your 15-minute presentation" },
      { name: "Written Reflection", duration: "15 min", description: "Write your journey reflection" },
      { name: "Celebrate", duration: "15 min", description: "You did it! Celebrate your achievement!" }
    ],
    isReviewDay: true
  }
];

// Helper function to get days for a specific week
export const getDaysForWeek = (week: number): LearningDay[] => {
  return learningPlan.filter(day => day.week === week);
};

// Helper function to get a specific day
export const getDay = (dayNumber: number): LearningDay | undefined => {
  return learningPlan.find(day => day.day === dayNumber);
};

// Calculate progress
export const calculateProgress = (completedDays: number[]): number => {
  return Math.round((completedDays.length / 60) * 100);
};
