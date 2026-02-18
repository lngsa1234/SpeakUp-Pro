require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const http = require('http');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function regenerateFeedback() {
  console.log('🔄 Regenerating feedback for all sessions...\n');

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
      console.log(`\n📝 Regenerating feedback for: "${conv.topic}"`);
      console.log(`   Started: ${new Date(conv.started_at).toLocaleString()}`);

      // Delete existing feedback
      await supabase
        .from('conversation_feedback')
        .delete()
        .eq('conversation_id', conv.id);

      const messages = typeof conv.messages === 'string'
        ? JSON.parse(conv.messages)
        : conv.messages;

      console.log(`   Messages: ${messages.length} total`);

      // Call the feedback API using http module
      const postData = JSON.stringify({
        conversationId: conv.id,
        messages: messages,
        topic: conv.topic
      });

      const { feedback } = await new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 3001,
          path: '/api/feedback',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP ${res.statusCode}`));
            } else {
              resolve(JSON.parse(data));
            }
          });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
      });

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
        console.log(`   - ${feedback.vocabulary_upgrades?.length || 0} vocabulary upgrades`);
        console.log(`   - ${feedback.new_vocabulary?.length || 0} new vocabulary words`);
      }
    }

    console.log('\n✅ Feedback regeneration complete!');

  } catch (error) {
    console.error('Error:', error);
  }
}

regenerateFeedback();
