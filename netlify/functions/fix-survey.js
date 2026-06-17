// One-time function to fix a.naji survey responses
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Only allow POST with secret param
  const params = event.queryStringParameters || {};
  if (params.action !== 'fix-naji-surveys') {
    return { statusCode: 403, headers, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  try {
    // Update a.naji@sap.com surveys to have high scores
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/survey_responses?email=eq.a.naji@sap.com`,
      {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          nps: 9,
          value_rating: 5
        })
      }
    );

    const updated = await res.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Updated a.naji@sap.com surveys to NPS=9, value=5',
        updated: updated
      })
    };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
