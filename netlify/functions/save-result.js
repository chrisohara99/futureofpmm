// Netlify function to save quiz scores and assessment results
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { type, email, data } = body;
    
    if (!email || !type || !data) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Get user_id from email
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const profiles = await profileRes.json();
    if (!profiles || profiles.length === 0) {
      return { statusCode: 404, headers, body: JSON.stringify({ error: 'Profile not found' }) };
    }
    
    const userId = profiles[0].id;

    if (type === 'quiz_score') {
      // Save quiz score
      const { chapter, score, total, percentage } = data;
      
      const res = await fetch(`${SUPABASE_URL}/rest/v1/quiz_scores`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id: userId,
          chapter,
          score,
          total,
          percentage
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Quiz save error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save quiz score' }) };
      }

      // Also update chapter_progress if passed
      if (percentage >= 80) {
        await fetch(`${SUPABASE_URL}/rest/v1/chapter_progress`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            user_id: userId,
            chapter,
            completed: true
          })
        });
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, userId }) };
    }

    if (type === 'assessment') {
      // Save assessment result
      const { assessment_type, result_key, result_name, result_data } = data;
      
      const res = await fetch(`${SUPABASE_URL}/rest/v1/assessment_results`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          user_id: userId,
          assessment_type,
          result_key,
          result_name,
          result_data
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Assessment save error:', err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save assessment' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true, userId }) };
    }

    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown type' }) };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
