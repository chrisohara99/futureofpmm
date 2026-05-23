// Netlify function to fetch user quiz scores (bypasses RLS)
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
    const { email } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    // First get user_id from profiles
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
      return { statusCode: 200, headers, body: JSON.stringify({ scores: [], assessments: [] }) };
    }
    
    const userId = profiles[0].id;

    // Get quiz scores
    const scoresRes = await fetch(
      `${SUPABASE_URL}/rest/v1/quiz_scores?user_id=eq.${userId}&select=chapter,score,percentage,completed_at&order=completed_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    const scores = await scoresRes.json();

    // Get assessment results
    const assessRes = await fetch(
      `${SUPABASE_URL}/rest/v1/assessment_results?user_id=eq.${userId}&select=assessment_type,result_name,result_data,completed_at&order=completed_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    const assessments = await assessRes.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ userId, scores, assessments })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
