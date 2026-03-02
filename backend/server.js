require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');
const {
  ENGLISH_COACH_PROMPT,
  FEEDBACK_PROMPT,
  WRITING_EVALUATION_PROMPT,
  SPEAKING_EVALUATION_PROMPT,
  PRONUNCIATION_EVALUATION_PROMPT,
  RESUME_EVALUATION_PROMPT,
  LINKEDIN_EVALUATION_PROMPT,
  WRITING_FLUENCY_EVALUATION_PROMPT,
  REASONING_EVALUATION_PROMPT,
  QUICK_FIRE_EVALUATION_PROMPT,
} = require('./prompt');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'SpeakUp Pro API is running' });
});

// Chat endpoint - handles conversation messages
app.post('/api/chat', async (req, res) => {
  try {
    const { conversationId, messages, topic, isFirstMessage } = req.body;

    if (!conversationId || !topic) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Format messages for Anthropic API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // If it's the first message, add a greeting
    if (isFirstMessage || messages.length === 0) {
      formattedMessages.push({
        role: 'user',
        content: `I'd like to practice English by discussing: ${topic}`,
      });
    }

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: ENGLISH_COACH_PROMPT,
      messages: formattedMessages,
    });

    const assistantMessage = response.content[0].text;

    res.json({
      message: assistantMessage,
      conversationId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      details: error.message,
    });
  }
});

// Feedback endpoint - generates post-conversation feedback
app.post('/api/feedback', async (req, res) => {
  console.log('\n=== Feedback Request Received ===');
  console.log('ConversationId:', req.body.conversationId);
  console.log('Messages count:', req.body.messages?.length);
  console.log('Topic:', req.body.topic);

  try {
    const { conversationId, messages, topic } = req.body;

    if (!conversationId || !messages || messages.length === 0) {
      console.error('Missing required fields:', { conversationId, messagesLength: messages?.length });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a conversation summary for feedback analysis
    const conversationText = messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n\n');

    console.log('Calling Anthropic API for feedback generation...');
    // Call Anthropic API for feedback
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3000,
      system: FEEDBACK_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Topic: ${topic}\n\nConversation:\n${conversationText}\n\nProvide detailed feedback in JSON format with the following structure:
{
  "strengths": ["strength 1", "strength 2"],
  "grammar_corrections": [
    {
      "incorrect": "original phrase",
      "correct": "corrected phrase",
      "explanation": "why this is correct"
    }
  ],
  "vocabulary_upgrades": [
    {
      "original": "word used",
      "suggestions": ["alternative 1", "alternative 2"]
    }
  ],
  "fluency_notes": ["note 1", "note 2"],
  "new_vocabulary": [
    {
      "word": "vocabulary word",
      "definition": "clear definition",
      "example_sentence": "example in professional context"
    }
  ]
}`,
        },
      ],
    });

    console.log('Anthropic API response received');
    const feedbackText = response.content[0].text;
    console.log('Feedback text length:', feedbackText.length);

    // Try to parse JSON from the response
    let feedback;
    try {
      // First, try to extract JSON from markdown code blocks
      let jsonText = feedbackText;
      const codeBlockMatch = feedbackText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1];
      } else {
        // Try to find JSON object in the text
        const jsonMatch = feedbackText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonText = jsonMatch[0];
        }
      }

      // Only remove trailing commas, keep newlines intact for proper JSON parsing
      jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1').trim();

      console.log('Attempting to parse JSON...');
      feedback = JSON.parse(jsonText);
      console.log('JSON parsed successfully!');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw feedback text (first 500 chars):', feedbackText.substring(0, 500));

      // Fallback structure if parsing fails
      feedback = {
        strengths: ['Good conversational flow', 'Clear communication'],
        grammar_corrections: [],
        vocabulary_upgrades: [],
        fluency_notes: ['Continue practicing regularly'],
        new_vocabulary: [],
      };
    }

    console.log('Sending feedback response...');
    res.json({
      feedback: {
        id: Date.now().toString(),
        conversation_id: conversationId,
        ...feedback,
        created_at: new Date().toISOString(),
      },
    });
    console.log('Feedback response sent successfully');
  } catch (error) {
    console.error('Feedback error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to generate feedback',
      details: error.message,
    });
  }
});

// Helper function to get score label
function getScoreLabel(score) {
  if (score >= 9) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 5) return 'Fair';
  if (score >= 3) return 'Needs Improvement';
  return 'Beginning';
}

// Helper function to parse JSON from Claude response
function parseJSONResponse(text) {
  let jsonText = text;

  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    jsonText = codeBlockMatch[1];
  } else {
    // Try to find JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
  }

  // Remove trailing commas
  jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1').trim();

  return JSON.parse(jsonText);
}

// Writing evaluation endpoint
app.post('/api/evaluate-writing', async (req, res) => {
  console.log('\n=== Writing Evaluation Request ===');

  try {
    const { text, prompt, dayNumber, vocabularyToUse, phrasesToUse } = req.body;

    if (!text || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: text and prompt' });
    }

    console.log('Day:', dayNumber);
    console.log('Text length:', text.length);
    console.log('Vocabulary to check:', vocabularyToUse?.join(', '));

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      system: WRITING_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this student's writing response.

**Writing Prompt Given:**
"${prompt}"

**Vocabulary from Today's Lesson (Day ${dayNumber}):**
${vocabularyToUse?.join(', ') || 'None specified'}

**Phrases from Today's Lesson:**
${phrasesToUse?.join(', ') || 'None specified'}

**Student's Writing:**
"${text}"

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "grammar": {
    "score": { "score": <1-10>, "label": "<label>" },
    "corrections": [
      { "original": "<exact phrase from text>", "corrected": "<corrected version>", "explanation": "<why>" }
    ]
  },
  "vocabulary": {
    "score": { "score": <1-10>, "label": "<label>" },
    "wordsUsedFromLesson": ["<words from the lesson vocabulary that were used>"],
    "suggestedUpgrades": [
      { "original": "<word used>", "suggestions": ["<better word 1>", "<better word 2>"] }
    ]
  },
  "content": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about content quality and relevance>",
    "relevanceToPrompt": <true/false>
  },
  "fluency": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about writing flow and style>"
  },
  "encouragement": "<1-2 encouraging sentences celebrating what was done well>",
  "nextSteps": ["<specific suggestion 1>", "<specific suggestion 2>"]
}

Return ONLY valid JSON, no other text.`
      }]
    });

    const rawText = response.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluation;
    try {
      evaluation = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Writing evaluation JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI evaluation. Please try again.' });
    }

    console.log('Evaluation parsed successfully');
    res.json({ evaluation });

  } catch (error) {
    console.error('Writing evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate writing', details: error.message });
  }
});

// Speaking evaluation endpoint
app.post('/api/evaluate-speaking', async (req, res) => {
  console.log('\n=== Speaking Evaluation Request ===');

  try {
    const { transcription, prompt, dayNumber, vocabularyToUse, phrasesToUse } = req.body;

    if (!transcription || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: transcription and prompt' });
    }

    console.log('Day:', dayNumber);
    console.log('Transcription length:', transcription.length);
    console.log('Vocabulary to check:', vocabularyToUse?.join(', '));

    // Sanitize transcription to prevent prompt injection / broken strings
    const safeTranscription = transcription.replace(/"/g, '\\"');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 3000,
      system: SPEAKING_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this student's spoken response (transcribed from speech).

**Speaking Prompt Given:**
"${prompt}"

**Vocabulary from Today's Lesson (Day ${dayNumber}):**
${vocabularyToUse?.join(', ') || 'None specified'}

**Phrases from Today's Lesson:**
${phrasesToUse?.join(', ') || 'None specified'}

**Student's Speech (Transcribed):**
"${safeTranscription}"

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "transcription": "<clean version of what they said>",
  "pronunciation": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about clarity and pronunciation>",
    "difficultWords": ["<words that might need pronunciation practice>"]
  },
  "grammar": {
    "score": { "score": <1-10>, "label": "<label>" },
    "corrections": [
      { "spoken": "<what was said>", "corrected": "<better version>", "explanation": "<why>" }
    ]
  },
  "vocabulary": {
    "score": { "score": <1-10>, "label": "<label>" },
    "wordsUsedFromLesson": ["<words from the lesson vocabulary that were used>"],
    "feedback": "<comment on vocabulary usage>"
  },
  "fluency": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about speaking flow>",
    "fillerWordsUsed": ["<filler words detected like um, uh, like, you know>"]
  },
  "encouragement": "<1-2 encouraging sentences - speaking is hard!>",
  "practiceRecommendations": ["<specific speaking practice suggestion 1>", "<suggestion 2>"]
}

Return ONLY valid JSON, no other text.`
      }]
    });

    const rawText = response.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluation;
    try {
      evaluation = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Speaking evaluation JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI evaluation. Please try again.' });
    }

    console.log('Evaluation parsed successfully');
    res.json({ evaluation });

  } catch (error) {
    console.error('Speaking evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate speaking', details: error.message });
  }
});

// Batch pronunciation evaluation endpoint - evaluates multiple words at once
app.post('/api/evaluate-pronunciation-batch', async (req, res) => {
  console.log('\n=== Batch Pronunciation Evaluation Request ===');

  try {
    const { attempts } = req.body;

    if (!attempts || !Array.isArray(attempts) || attempts.length === 0) {
      return res.status(400).json({ error: 'Missing required field: attempts (array of {word, transcription})' });
    }

    console.log('Evaluating', attempts.length, 'words');

    // Format attempts for the prompt
    const attemptsText = attempts.map((a, i) =>
      `${i + 1}. Word: "${a.word}" | Student said: "${a.transcription}"`
    ).join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      system: PRONUNCIATION_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate the student's pronunciation attempts for multiple words.

**Attempts:**
${attemptsText}

Provide your evaluation as a JSON array with one object per word, in the same order as the attempts:
[
  {
    "word": "<the target word>",
    "score": <1-10>,
    "feedback": "<1-2 sentences of encouraging, specific feedback>",
    "isCorrect": <true if score >= 7, false otherwise>
  },
  ...
]

Keep feedback brief since there are multiple words. Focus on the most important observation for each.

Return ONLY valid JSON array, no other text.`
      }]
    });

    const rawText = response.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluations;
    try {
      evaluations = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Batch pronunciation JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse pronunciation evaluation. Please try again.' });
    }

    console.log('Batch evaluation parsed successfully');
    res.json({ evaluations });

  } catch (error) {
    console.error('Batch pronunciation evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate pronunciation', details: error.message });
  }
});

// Resume evaluation endpoint
app.post('/api/evaluate-resume', async (req, res) => {
  console.log('\n=== Resume Evaluation Request ===');

  try {
    const { resumeText, targetRole, targetCompany, focusAreas } = req.body;

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide resume text (minimum 50 characters)' });
    }

    console.log('Resume length:', resumeText.length);
    console.log('Target role:', targetRole || 'Product Manager');
    console.log('Target company:', targetCompany || 'Not specified');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      system: RESUME_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this PM resume and provide detailed, actionable feedback.

**Target Role:** ${targetRole || 'Product Manager'}
**Target Company:** ${targetCompany || 'Not specified'}
**Focus Areas:** ${focusAreas?.join(', ') || 'All areas'}

**RESUME TEXT:**
${resumeText}

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "impactStatements": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about impact statement quality>",
    "bulletEvaluations": [
      {
        "original": "<exact bullet from resume>",
        "score": <1-10>,
        "feedback": "<specific feedback for this bullet>",
        "improved": "<rewritten version with better impact>",
        "hasMetrics": <true/false>,
        "hasActionVerb": <true/false>,
        "pmRelevance": "<high/medium/low>"
      }
    ]
  },
  "metrics": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<assessment of metrics usage>",
    "bulletsWithMetrics": <number>,
    "totalBullets": <number>,
    "suggestions": ["<specific suggestion for adding metrics>"]
  },
  "actionVerbs": {
    "score": { "score": <1-10>, "label": "<label>" },
    "verbsUsed": ["<strong verbs found>"],
    "weakVerbs": [{ "weak": "<weak verb used>", "stronger": ["<better option 1>", "<better option 2>"] }]
  },
  "pmSkills": {
    "score": { "score": <1-10>, "label": "<label>" },
    "skillsIdentified": ["<PM skills evident in resume>"],
    "missingSkills": ["<important PM skills not shown>"],
    "feedback": "<how to better showcase PM skills>"
  },
  "atsOptimization": {
    "score": { "score": <1-10>, "label": "<label>" },
    "keywordsFound": ["<PM keywords present>"],
    "missingKeywords": ["<important keywords to add>"],
    "feedback": "<ATS optimization advice>"
  },
  "formatting": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<formatting assessment>",
    "issues": ["<specific formatting issues>"]
  },
  "strengths": ["<top 3 strengths of this resume>"],
  "improvements": ["<top 3 priority improvements>"],
  "nextSteps": ["<specific action item 1>", "<specific action item 2>", "<specific action item 3>"]
}

Evaluate UP TO 5 bullets in bulletEvaluations (the most important ones to improve).
Return ONLY valid JSON, no other text.`
      }]
    });

    console.log('Claude response received');
    const evaluation = parseJSONResponse(response.content[0].text);
    console.log('Resume evaluation parsed successfully');

    res.json({ evaluation });

  } catch (error) {
    console.error('Resume evaluation error:', error);

    // Return a fallback evaluation on error
    if (error.message?.includes('JSON')) {
      res.json({
        evaluation: {
          overallScore: { score: 5, label: 'Fair' },
          impactStatements: {
            score: { score: 5, label: 'Fair' },
            feedback: 'Unable to fully parse resume. Please try again.',
            bulletEvaluations: []
          },
          metrics: {
            score: { score: 5, label: 'Fair' },
            feedback: 'Add more quantified metrics to strengthen your resume.',
            bulletsWithMetrics: 0,
            totalBullets: 0,
            suggestions: ['Add revenue impact', 'Include user numbers', 'Quantify efficiency gains']
          },
          actionVerbs: {
            score: { score: 5, label: 'Fair' },
            verbsUsed: [],
            weakVerbs: []
          },
          pmSkills: {
            score: { score: 5, label: 'Fair' },
            skillsIdentified: [],
            missingSkills: ['Product strategy', 'User research', 'Data analysis'],
            feedback: 'Ensure your resume clearly demonstrates PM competencies.'
          },
          atsOptimization: {
            score: { score: 5, label: 'Fair' },
            keywordsFound: [],
            missingKeywords: ['Product Manager', 'roadmap', 'stakeholder', 'metrics'],
            feedback: 'Include more PM-specific keywords for ATS optimization.'
          },
          formatting: {
            score: { score: 6, label: 'Fair' },
            feedback: 'Ensure consistent formatting throughout.',
            issues: []
          },
          strengths: ['Resume submitted for review'],
          improvements: ['Add more metrics', 'Strengthen impact statements', 'Include PM keywords'],
          nextSteps: ['Reformat bullets with metrics', 'Use stronger action verbs', 'Add PM-specific achievements']
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to evaluate resume', details: error.message });
    }
  }
});

// LinkedIn profile evaluation endpoint
app.post('/api/evaluate-linkedin', async (req, res) => {
  console.log('\n=== LinkedIn Evaluation Request ===');

  try {
    const { profileText, targetRole, targetIndustry } = req.body;

    if (!profileText || profileText.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide LinkedIn profile text (minimum 50 characters)' });
    }

    console.log('Profile length:', profileText.length);
    console.log('Target role:', targetRole || 'Product Manager');
    console.log('Target industry:', targetIndustry || 'Not specified');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      system: LINKEDIN_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this LinkedIn profile for a PM role and provide detailed, actionable feedback.

**Target Role:** ${targetRole || 'Product Manager'}
**Target Industry:** ${targetIndustry || 'Tech/General'}

**LINKEDIN PROFILE TEXT:**
${profileText}

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "headline": {
    "score": { "score": <1-10>, "label": "<label>" },
    "current": "<extract current headline if visible>",
    "feedback": "<specific feedback on headline>",
    "improved": ["<suggested headline option 1>", "<suggested headline option 2>"]
  },
  "summary": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<detailed feedback on summary/about section>",
    "keyElements": {
      "hasHook": <true/false - does first line grab attention?>,
      "hasValue": <true/false - is value proposition clear?>,
      "hasProof": <true/false - are achievements included?>,
      "hasCTA": <true/false - is there a call to action?>
    },
    "improved": "<rewritten summary that addresses gaps>"
  },
  "experience": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<feedback on experience section>",
    "bulletEvaluations": [
      {
        "original": "<exact bullet from profile>",
        "score": <1-10>,
        "feedback": "<specific feedback>",
        "improved": "<rewritten version>"
      }
    ]
  },
  "skills": {
    "score": { "score": <1-10>, "label": "<label>" },
    "found": ["<PM skills visible in profile>"],
    "missing": ["<important PM skills to add>"],
    "feedback": "<how to improve skills section>"
  },
  "keywords": {
    "score": { "score": <1-10>, "label": "<label>" },
    "found": ["<keywords present>"],
    "missing": ["<keywords to add for PM roles>"],
    "feedback": "<keyword optimization advice>"
  },
  "profileStrength": {
    "score": { "score": <1-10>, "label": "<label>" },
    "hasPhoto": <true/false/unknown>,
    "hasBanner": <true/false/unknown>,
    "hasFeatured": <true/false/unknown>,
    "hasRecommendations": <true/false/unknown>,
    "connectionsLevel": "<low/medium/high/unknown>",
    "feedback": "<advice on profile completeness>"
  },
  "strengths": ["<top 3 strengths of this profile>"],
  "improvements": ["<top 3 priority improvements>"],
  "nextSteps": ["<specific action 1>", "<specific action 2>", "<specific action 3>"]
}

Evaluate UP TO 3 bullets in bulletEvaluations (the most important ones to improve).
Return ONLY valid JSON, no other text.`
      }]
    });

    console.log('Claude response received');
    const evaluation = parseJSONResponse(response.content[0].text);
    console.log('LinkedIn evaluation parsed successfully');

    res.json({ evaluation });

  } catch (error) {
    console.error('LinkedIn evaluation error:', error);

    // Return a fallback evaluation on error
    if (error.message?.includes('JSON')) {
      res.json({
        evaluation: {
          overallScore: { score: 5, label: 'Fair' },
          headline: {
            score: { score: 5, label: 'Fair' },
            current: '',
            feedback: 'Unable to fully parse profile. Please try again.',
            improved: ['Product Manager | [Your Value Prop] | [Key Skills]']
          },
          summary: {
            score: { score: 5, label: 'Fair' },
            feedback: 'Ensure your summary has a strong hook and clear value proposition.',
            keyElements: { hasHook: false, hasValue: false, hasProof: false, hasCTA: false },
            improved: ''
          },
          experience: {
            score: { score: 5, label: 'Fair' },
            feedback: 'Add more impact-driven bullets with metrics.',
            bulletEvaluations: []
          },
          skills: {
            score: { score: 5, label: 'Fair' },
            found: [],
            missing: ['Product Management', 'Product Strategy', 'User Research'],
            feedback: 'Add key PM skills to improve discoverability.'
          },
          keywords: {
            score: { score: 5, label: 'Fair' },
            found: [],
            missing: ['Product Manager', 'roadmap', 'stakeholder', 'metrics'],
            feedback: 'Include more PM-specific keywords.'
          },
          profileStrength: {
            score: { score: 5, label: 'Fair' },
            hasPhoto: false,
            hasBanner: false,
            hasFeatured: false,
            hasRecommendations: false,
            connectionsLevel: 'unknown',
            feedback: 'Complete all profile sections for maximum visibility.'
          },
          strengths: ['Profile submitted for review'],
          improvements: ['Optimize headline', 'Strengthen summary', 'Add PM keywords'],
          nextSteps: ['Rewrite headline with value proposition', 'Add metrics to experience', 'Request recommendations']
        }
      });
    } else {
      res.status(500).json({ error: 'Failed to evaluate LinkedIn profile', details: error.message });
    }
  }
});

// Writing fluency evaluation endpoint
app.post('/api/evaluate-writing-fluency', async (req, res) => {
  console.log('\n=== Writing Fluency Evaluation Request ===');

  try {
    const { text, prompt, durationSeconds, wordCount, wpm } = req.body;

    if (!text || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: text and prompt' });
    }

    console.log('Duration:', durationSeconds, 'seconds');
    console.log('Word count:', wordCount);
    console.log('WPM:', wpm);

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: WRITING_FLUENCY_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this timed free writing exercise for fluency.

**Writing Prompt Given:**
"${prompt}"

**Session Stats:**
- Duration: ${durationSeconds} seconds (${(durationSeconds / 60).toFixed(1)} minutes)
- Words Written: ${wordCount}
- Words Per Minute: ${wpm.toFixed(1)}

**Student's Writing:**
"${text}"

Provide your evaluation as JSON with this EXACT structure:
{
  "overallFluencyScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "metrics": {
    "wordsWritten": ${wordCount},
    "wordsPerMinute": ${wpm.toFixed(1)},
    "wpmRating": { "score": <1-10>, "label": "<label based on WPM benchmarks>" },
    "targetWpm": <recommended target WPM for next session>
  },
  "sentenceAnalysis": {
    "score": { "score": <1-10>, "label": "<label>" },
    "totalSentences": <count sentences>,
    "avgWordsPerSentence": <calculate average>,
    "varietyFeedback": "<1-2 sentences about sentence structure variety>"
  },
  "flowAndCoherence": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about how ideas connect and flow>",
    "transitionsUsed": ["<transition words/phrases they used>"],
    "suggestedTransitions": ["<2-3 transitions they could try next time>"]
  },
  "writingMomentum": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<1-2 sentences about writing consistency - did they maintain flow or stop/start?>"
  },
  "encouragement": "<2-3 very encouraging sentences celebrating their effort and progress>",
  "nextSteps": ["<specific tip 1 for improving fluency>", "<specific tip 2>", "<specific tip 3>"]
}

Be very encouraging! Free writing builds confidence. Celebrate the word count!
Return ONLY valid JSON, no other text.`
      }]
    });

    const rawText = response.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluation;
    try {
      evaluation = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Writing fluency JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI evaluation. Please try again.' });
    }

    console.log('Fluency evaluation parsed successfully');
    res.json({ evaluation });

  } catch (error) {
    console.error('Writing fluency evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate writing fluency', details: error.message });
  }
});

// Reasoning evaluation endpoint (PREP mode)
app.post('/api/evaluate-reasoning', async (req, res) => {
  console.log('\n=== Reasoning Evaluation Request ===');

  try {
    const { question, response: userResponse, mode } = req.body;

    if (!question || !userResponse) {
      return res.status(400).json({ error: 'Missing required fields: question and response' });
    }

    console.log('Question:', question);
    console.log('Response length:', userResponse.length);
    console.log('Mode:', mode || 'writing');

    const apiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: REASONING_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this student's response using the PREP framework.

**Question Asked:**
"${question}"

**Input Mode:** ${mode || 'writing'} ${mode === 'speaking' ? '(transcribed from speech - minor transcription errors may exist)' : ''}

**Student's Response:**
"${userResponse}"

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "reasoning": {
    "score": { "score": <1-10>, "label": "<label>" },
    "hasClearPoint": <true/false - did they state a clear position?>,
    "hasReason": <true/false - did they provide a reason?>,
    "hasExample": <true/false - did they give an example?>,
    "hasConclusion": <true/false - did they restate or reinforce the point?>,
    "feedback": "<2-3 sentences about PREP structure quality>"
  },
  "language": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about language quality>",
    "corrections": [
      { "original": "<exact phrase>", "corrected": "<better version>", "explanation": "<why>" }
    ]
  },
  "coherence": {
    "score": { "score": <1-10>, "label": "<label>" },
    "feedback": "<2-3 sentences about logical flow>",
    "transitionsUsed": ["<transition words they used>"],
    "suggestedTransitions": ["<3-4 specific transitions that fix THIS response's weak spots, e.g. 'For instance... — use after your first reason to introduce your example'>"]
  },
  "encouragement": "<1-2 encouraging sentences>",
  "nextSteps": ["<suggestion 1 - be specific about which PREP stage to improve and how>", "<suggestion 2>"]
}

Return ONLY valid JSON, no other text.`
      }]
    });

    const rawText = apiResponse.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluation;
    try {
      evaluation = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Reasoning evaluation JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI evaluation. Please try again.' });
    }

    console.log('Reasoning evaluation parsed successfully');
    res.json({ evaluation });

  } catch (error) {
    console.error('Reasoning evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate reasoning', details: error.message });
  }
});

// Quick-fire evaluation endpoint (batch)
app.post('/api/evaluate-quick-fire', async (req, res) => {
  console.log('\n=== Quick-fire Evaluation Request ===');

  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ error: 'Missing required field: responses (array of {question, answer})' });
    }

    console.log('Evaluating', responses.length, 'quick-fire responses');

    const responsesText = responses.map((r, i) =>
      `Q${i + 1}: "${r.question}"\nA${i + 1}: "${r.answer}"`
    ).join('\n\n');

    const apiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: QUICK_FIRE_EVALUATION_PROMPT,
      messages: [{
        role: 'user',
        content: `Evaluate this batch of quick-fire spoken responses (transcribed from speech under time pressure).

**Responses:**
${responsesText}

Provide your evaluation as JSON with this EXACT structure:
{
  "overallScore": { "score": <1-10>, "label": "<Excellent/Good/Fair/Needs Improvement>" },
  "responses": [
    {
      "question": "<the question>",
      "answer": "<their answer>",
      "reasoningScore": { "score": <1-10>, "label": "<label>" },
      "languageScore": { "score": <1-10>, "label": "<label>" },
      "feedback": "<1-2 sentences of specific feedback>"
    }
  ],
  "patterns": {
    "strengths": ["<strength 1>", "<strength 2>"],
    "areasToImprove": ["<area 1>", "<area 2>"]
  },
  "encouragement": "<2-3 encouraging sentences about their performance under pressure>",
  "nextSteps": ["<tip 1>", "<tip 2>"]
}

Include one entry in "responses" for each Q&A pair, in order.
Return ONLY valid JSON, no other text.`
      }]
    });

    const rawText = apiResponse.content[0].text;
    console.log('Claude response received, length:', rawText?.length);

    let evaluation;
    try {
      evaluation = parseJSONResponse(rawText);
    } catch (parseError) {
      console.error('Quick-fire evaluation JSON parse error:', parseError.message);
      console.error('Raw Claude response:', rawText?.substring(0, 500));
      return res.status(500).json({ error: 'Failed to parse AI evaluation. Please try again.' });
    }

    console.log('Quick-fire evaluation parsed successfully');
    res.json({ evaluation });

  } catch (error) {
    console.error('Quick-fire evaluation error:', error.message || error);
    res.status(500).json({ error: 'Failed to evaluate quick-fire responses', details: error.message });
  }
});

// Transcript endpoint - serves and parses podcast transcripts
app.get('/api/transcript/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const { startLine, endLine } = req.query;

    // Sanitize filename to prevent directory traversal
    const sanitizedFilename = path.basename(filename);
    const transcriptPath = path.join(__dirname, '..', 'transcript', `${sanitizedFilename}.txt`);

    if (!fs.existsSync(transcriptPath)) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    const content = fs.readFileSync(transcriptPath, 'utf-8');
    const lines = content.split('\n');

    // Parse transcript into structured format
    const segments = [];
    let currentSegment = null;
    // Format 1: "Speaker Name (HH:MM:SS):" on its own line
    const speakerPattern = /^([A-Za-z\s.]+)\s*\((\d{2}:\d{2}(?::\d{2})?)\):?\s*$/;
    const timestampOnlyPattern = /^\((\d{2}:\d{2}(?::\d{2})?)\):?\s*$/;
    // Format 2: "[HH:MM:SS] Speaker: text" all on one line
    const bracketSpeakerPattern = /^\[(\d{2}:\d{2}(?::\d{2})?)\]\s+([A-Za-z][A-Za-z ]*?):\s+(.*)/;
    const bracketTimestampPattern = /^\[(\d{2}:\d{2}(?::\d{2})?)\]\s+(.*)/;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const speakerMatch = line.match(speakerPattern);
      const timestampMatch = line.match(timestampOnlyPattern);

      if (speakerMatch) {
        // New speaker segment (Format 1)
        if (currentSegment && currentSegment.text.trim()) {
          segments.push(currentSegment);
        }
        currentSegment = {
          speaker: speakerMatch[1].trim(),
          timestamp: speakerMatch[2],
          text: '',
          startLine: lineNumber,
          endLine: lineNumber
        };
      } else if (timestampMatch && currentSegment) {
        // Continuation with new timestamp (same speaker)
        if (currentSegment.text.trim()) {
          segments.push(currentSegment);
        }
        currentSegment = {
          speaker: currentSegment.speaker,
          timestamp: timestampMatch[1],
          text: '',
          startLine: lineNumber,
          endLine: lineNumber
        };
      } else {
        const bracketSpeakerMatch = line.match(bracketSpeakerPattern);
        const bracketTimestampMatch = line.match(bracketTimestampPattern);

        if (bracketSpeakerMatch) {
          // New speaker segment (Format 2)
          if (currentSegment && currentSegment.text.trim()) {
            segments.push(currentSegment);
          }
          currentSegment = {
            speaker: bracketSpeakerMatch[2].trim(),
            timestamp: bracketSpeakerMatch[1],
            text: bracketSpeakerMatch[3] || '',
            startLine: lineNumber,
            endLine: lineNumber
          };
        } else if (bracketTimestampMatch && currentSegment) {
          // Continuation with new timestamp, same speaker (Format 2)
          if (currentSegment.text.trim()) {
            segments.push(currentSegment);
          }
          currentSegment = {
            speaker: currentSegment.speaker,
            timestamp: bracketTimestampMatch[1],
            text: bracketTimestampMatch[2] || '',
            startLine: lineNumber,
            endLine: lineNumber
          };
        } else if (currentSegment) {
          // Add text to current segment
          currentSegment.text += (currentSegment.text ? ' ' : '') + line.trim();
          currentSegment.endLine = lineNumber;
        }
      }
    });

    // Don't forget the last segment
    if (currentSegment && currentSegment.text.trim()) {
      segments.push(currentSegment);
    }

    // Filter by line range if specified
    // Include segments that overlap with the requested range
    let filteredSegments = segments;
    if (startLine || endLine) {
      const start = parseInt(startLine) || 1;
      const end = parseInt(endLine) || lines.length;
      filteredSegments = segments.filter(seg =>
        seg.endLine >= start && seg.startLine <= end
      );
    }

    // Extract unique speakers
    const speakers = [...new Set(segments.map(s => s.speaker))];

    res.json({
      filename: sanitizedFilename,
      totalLines: lines.length,
      totalSegments: segments.length,
      speakers,
      segments: filteredSegments
    });

  } catch (error) {
    console.error('Transcript error:', error);
    res.status(500).json({ error: 'Failed to load transcript', details: error.message });
  }
});

// List available transcripts
app.get('/api/transcripts', (req, res) => {
  try {
    const transcriptDir = path.join(__dirname, '..', 'transcript');
    if (!fs.existsSync(transcriptDir)) {
      return res.json({ transcripts: [] });
    }
    const files = fs.readdirSync(transcriptDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => file.replace('.txt', ''));

    res.json({ transcripts: files });
  } catch (error) {
    console.error('List transcripts error:', error);
    res.status(500).json({ error: 'Failed to list transcripts' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SpeakUp Pro API running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
