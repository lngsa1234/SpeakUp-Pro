require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateMissingFeedback() {
  console.log('🔍 Finding sessions without feedback...\n');

  try {
    // Get all conversations
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .not('ended_at', 'is', null)
      .order('started_at', { ascending: false });

    if (error) throw error;

    console.log(`Found ${conversations.length} completed sessions\n`);

    for (const conv of conversations) {
      // Check if feedback exists
      const { data: existingFeedback } = await supabase
        .from('conversation_feedback')
        .select('id')
        .eq('conversation_id', conv.id)
        .single();

      if (existingFeedback) {
        console.log(`✓ Session "${conv.topic}" already has feedback - skipping`);
        continue;
      }

      console.log(`\n📝 Generating feedback for: "${conv.topic}"`);
      console.log(`   Started: ${new Date(conv.started_at).toLocaleString()}`);

      const messages = typeof conv.messages === 'string'
        ? JSON.parse(conv.messages)
        : conv.messages;

      console.log(`   Messages: ${messages.length} total`);

      // Call the feedback API
      const response = await fetch('http://localhost:3001/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conv.id,
          messages: messages,
          topic: conv.topic
        })
      });

      if (!response.ok) {
        console.error(`   ✗ Failed to generate feedback: ${response.statusText}`);
        continue;
      }

      const { feedback } = await response.json();

      // Save feedback to database
      const { error: insertError } = await supabase
        .from('conversation_feedback')
        .insert({
          conversation_id: conv.id,
          strengths: feedback.strengths || [],
          grammar_corrections: feedback.grammar_corrections || [],
          vocabulary_upgrades: feedback.vocabulary_upgrades || [],
          fluency_notes: feedback.fluency_notes || [],
          new_vocabulary: feedback.new_vocabulary || []
        });

      if (insertError) {
        console.error(`   ✗ Error saving feedback:`, insertError);
      } else {
        console.log(`   ✓ Feedback generated and saved successfully!`);
        console.log(`   - ${feedback.strengths?.length || 0} strengths`);
        console.log(`   - ${feedback.grammar_corrections?.length || 0} grammar corrections`);
        console.log(`   - ${feedback.new_vocabulary?.length || 0} new vocabulary words`);
      }
    }

    console.log('\n✅ Feedback generation complete!');

  } catch (error) {
    console.error('Error:', error);
  }
}

generateMissingFeedback();
