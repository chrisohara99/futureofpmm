// Netlify function to check if a profile exists (bypasses client-side issues)
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

    // Check if profile exists
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id,first_name,last_name`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const profiles = await res.json();
    
    if (!profiles || profiles.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ exists: false }) };
    }
    
    const profile = profiles[0];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        exists: true,
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
