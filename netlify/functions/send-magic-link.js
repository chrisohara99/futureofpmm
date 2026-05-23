// Netlify function to send magic link for new user signup
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
    const { email, firstName, lastName, role, redirectTo } = JSON.parse(event.body || '{}');
    
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    // Check if profile already exists (grandfathered user)
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(email.toLowerCase())}&select=id`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const existing = await checkRes.json();
    
    if (existing && existing.length > 0) {
      // User already exists - they should use login, not signup
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          exists: true, 
          message: 'Account already exists. Please use the login page.' 
        })
      };
    }

    // Send magic link via Supabase Auth
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role
        },
        options: {
          emailRedirectTo: redirectTo || 'https://futureofpmm.com/curriculum/verify.html'
        }
      })
    });

    if (!authRes.ok) {
      const err = await authRes.text();
      console.error('Magic link error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to send verification email' }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Verification email sent! Check your inbox.' 
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
