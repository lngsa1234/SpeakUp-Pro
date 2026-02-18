# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] Supabase account created
- [ ] Anthropic API key obtained
- [ ] Chrome or Edge browser

## 3-Minute Setup

### Step 1: Set Up Supabase (2 min)
1. Go to https://supabase.com and create a new project
2. Copy Project URL and anon key from Settings > API
3. Go to SQL Editor and paste the entire contents of `supabase-schema.sql`
4. Click Run to create all tables

### Step 2: Configure Environment Variables (1 min)

**Frontend (.env):**
```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:3001
```

**Backend (backend/.env):**
```bash
ANTHROPIC_API_KEY=your_anthropic_key_here
PORT=3001
```

### Step 3: Run the App

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit http://localhost:5173 and start learning!

## First Session Checklist
1. [ ] Sign up with your email
2. [ ] Choose a topic (try "PM Interview Prep")
3. [ ] Click the microphone and speak
4. [ ] End session and view feedback
5. [ ] Check vocabulary page

## Troubleshooting

**Can't hear AI?** - The app uses text-based chat. Text-to-speech is a future enhancement.

**Microphone not working?** - Allow microphone permissions in Chrome/Edge.

**Backend errors?** - Make sure you added the Anthropic API key to `backend/.env`.

**Supabase errors?** - Verify the SQL schema ran successfully and all tables exist.

## Key URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Backend Health: http://localhost:3001/health
- Supabase Dashboard: https://supabase.com/dashboard

Enjoy your English learning journey with SpeakUp Pro!
