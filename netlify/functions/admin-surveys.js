// Netlify function to fetch survey responses for admin dashboard
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
    // Fetch all survey responses, most recent first
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/survey_responses?select=*&order=created_at.desc&limit=100`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const rawResponses = await res.json();
    
    if (rawResponses.error) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: rawResponses.error }) };
    }

    // Filter out test surveys (test users and admin test submissions)
    const TEST_EMAILS = ['test.user@sap.com', 'testy.user@sap.com'];
    const responses = rawResponses.filter(r => {
      const email = (r.user_email || r.email || '').toLowerCase();
      return !TEST_EMAILS.includes(email) && !email.includes('test');
    });

    // Calculate summary stats
    const total = responses.length;
    const avgValue = total > 0 ? (responses.reduce((s, r) => s + (r.value_rating || 0), 0) / total).toFixed(2) : 0;
    const avgNPS = total > 0 ? (responses.reduce((s, r) => s + (r.nps || 0), 0) / total).toFixed(2) : 0;
    
    // NPS breakdown
    const promoters = responses.filter(r => r.nps >= 9).length;
    const passives = responses.filter(r => r.nps >= 7 && r.nps < 9).length;
    const detractors = responses.filter(r => r.nps < 7).length;
    const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        responses,
        summary: {
          total,
          avgValue,
          avgNPS,
          npsScore,
          promoters,
          passives,
          detractors
        }
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
