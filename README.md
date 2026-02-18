# SpeakUp Pro

Your Personal English Coach - An AI-powered English learning application with voice conversation practice, real-time feedback, and vocabulary tracking.

## Features

- **Daily Voice Conversations**: Practice English through natural voice conversations with an AI coach
- **Real-time Speech Recognition**: Using Web Speech API for instant transcription
- **Personalized Feedback**: Get detailed grammar corrections, vocabulary suggestions, and fluency notes
- **Vocabulary Tracking**: Build and review your vocabulary with spaced repetition
- **Progress Dashboard**: Track your learning streak, sessions, and improvements
- **Topic Selection**: Choose from business, technology, interviews, and custom topics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- React Router for navigation
- Supabase for authentication and database
- Web Speech API for voice recognition

### Backend
- Node.js with Express
- Anthropic Claude API for AI conversations
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- An Anthropic API key
- Google Chrome or Microsoft Edge (for Web Speech API support)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready
3. Go to Project Settings > API to get your:
   - `Project URL` (VITE_SUPABASE_URL)
   - `anon/public key` (VITE_SUPABASE_ANON_KEY)
4. Go to SQL Editor and run the entire `supabase-schema.sql` file
5. Verify tables are created under Database > Tables

### 3. Configure Environment Variables

#### Frontend (.env)
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001
```

#### Backend (backend/.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your-anthropic-api-key
PORT=3001
```

### 4. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys and create a new key
4. Copy the key to `backend/.env`

## Running the Application

You'll need two terminal windows:

### Terminal 1 - Backend Server
```bash
cd backend
npm start
```
The API will run on http://localhost:3001

### Terminal 2 - Frontend App
```bash
npm run dev
```
The app will run on http://localhost:5173

## Usage

1. **Sign Up**: Create an account with your email and password
2. **Dashboard**: View your learning stats and recent sessions
3. **Start Session**: Click "Start New Session" and choose a topic
4. **Conversation**:
   - Click the microphone button to start speaking
   - Speak naturally about the chosen topic
   - The AI coach will respond and engage in conversation
   - Click "End Session" when done
5. **Feedback**: Review detailed feedback on grammar, vocabulary, and fluency
6. **Vocabulary**: Track and review new words learned during sessions

## Browser Compatibility

The Web Speech API is currently supported in:
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Safari (limited support)

For the best experience, use Chrome or Edge.

## Project Structure

```
speakup-pro/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Login/Signup forms
│   │   ├── conversation/   # Conversation UI
│   │   ├── dashboard/      # Dashboard components
│   │   └── vocabulary/     # Vocabulary components
│   ├── pages/              # Page components
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TopicSelectionPage.tsx
│   │   ├── ConversationPage.tsx
│   │   ├── FeedbackPage.tsx
│   │   └── VocabularyPage.tsx
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── services/           # API services
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── hooks/              # Custom hooks
│   │   └── useSpeechRecognition.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── backend/
│   ├── server.js           # Express server
│   ├── prompt.js           # AI coach system prompt
│   └── .env                # Backend environment variables
├── supabase-schema.sql     # Database schema
└── README.md
```

## Key Features Explained

### AI English Coach

The AI coach uses Claude Sonnet 4.5 with a specialized system prompt that:
- Adapts to your professional context (PM, automotive, tech)
- Provides natural, flowing conversations
- Introduces new vocabulary contextually
- Gives structured post-conversation feedback
- Tracks your progress over time

### Vocabulary System

- **New**: Words just learned
- **Learning**: Words you're practicing
- **Mastered**: Words you've mastered

Track review count and last review date for each word.

### Streak System

- Automatically tracks daily practice
- Shows current streak and longest streak
- Updates when you complete a conversation

## Troubleshooting

### Speech Recognition Not Working
- Make sure you're using Chrome or Edge
- Check browser permissions for microphone
- Ensure you're on HTTPS or localhost

### Backend Connection Issues
- Verify backend is running on port 3001
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

### Supabase Errors
- Verify environment variables are correct
- Check Supabase dashboard for project status
- Ensure RLS policies are enabled

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production
```bash
npm run build
```

## Future Enhancements

- [ ] Text-to-speech for AI responses
- [ ] Mobile app with React Native
- [ ] Writing practice mode
- [ ] Daily notifications
- [ ] Progress charts and analytics
- [ ] Multiple language support
- [ ] Pronunciation scoring
- [ ] Conversation history playback

## License

MIT

## Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com)
- Powered by [Supabase](https://supabase.com)
- UI inspired by modern learning platforms
# SpeakUp-Pro
