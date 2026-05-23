// Netlify function to create new user profiles
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
    const { email, firstName, lastName, role } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    // Check if profile already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id,first_name,last_name`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const existing = await checkRes.json();
    
    if (existing && existing.length > 0) {
      // Profile exists, return it
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          exists: true,
          id: existing[0].id,
          firstName: existing[0].first_name,
          lastName: existing[0].last_name
        })
      };
    }
    
    // Generate UUID
    const id = require('crypto').randomUUID();
    
    // Create new profile
    const createRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id,
        email: email.toLowerCase(),
        first_name: firstName || null,
        last_name: lastName || null,
        role: role || null,
        company: 'SAP'
      })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Profile create error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create profile' }) };
    }

    const created = await createRes.json();
    const profile = Array.isArray(created) ? created[0] : created;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
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
