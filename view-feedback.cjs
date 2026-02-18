require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function viewFeedback() {
  try {
    // Get the most recent conversation with feedback
    const { data: conversations } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_feedback (*)
      `)
      .not('ended_at', 'is', null)
      .order('started_at', { ascending: false })
      .limit(1);

    if (!conversations || conversations.length === 0) {
      console.log('No conversations found');
      return;
    }

    const conv = conversations[0];

    console.log('\n' + '='.repeat(60));
    console.log('📚 CONVERSATION FEEDBACK');
    console.log('='.repeat(60));
    console.log(`\nTopic: ${conv.topic}`);
    console.log(`Date: ${new Date(conv.started_at).toLocaleString()}`);
    console.log(`Duration: ${Math.floor(conv.duration_seconds / 60)}m ${conv.duration_seconds % 60}s`);

    const feedback = conv.conversation_feedback[0];

    if (!feedback) {
      console.log('\n❌ No feedback found for this conversation');
      return;
    }

    console.log('\n✨ STRENGTHS:');
    feedback.strengths.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s}`);
    });

    if (feedback.grammar_corrections && feedback.grammar_corrections.length > 0) {
      console.log('\n📝 GRAMMAR CORRECTIONS:');
      feedback.grammar_corrections.forEach((g, i) => {
        console.log(`  ${i + 1}. "${g.incorrect}" → "${g.correct}"`);
        console.log(`     💡 ${g.explanation}`);
      });
    }

    if (feedback.vocabulary_upgrades && feedback.vocabulary_upgrades.length > 0) {
      console.log('\n📖 VOCABULARY UPGRADES:');
      feedback.vocabulary_upgrades.forEach((v, i) => {
        console.log(`  ${i + 1}. Instead of "${v.original}", try:`);
        v.suggestions.forEach(s => console.log(`     • ${s}`));
      });
    }

    console.log('\n💬 FLUENCY NOTES:');
    feedback.fluency_notes.forEach((n, i) => {
      console.log(`  ${i + 1}. ${n}`);
    });

    if (feedback.new_vocabulary && feedback.new_vocabulary.length > 0) {
      console.log('\n🎓 NEW VOCABULARY:');
      feedback.new_vocabulary.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.word}`);
        console.log(`     Definition: ${v.definition}`);
        console.log(`     Example: "${v.example_sentence}"`);
      });
    }

    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('Error:', error);
  }
}

viewFeedback();
