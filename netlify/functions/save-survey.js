// Netlify function to save curriculum survey responses
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
    const data = JSON.parse(event.body || '{}');
    
    const { 
      value_rating,
      newsletter_rating,
      content_rating,
      assessments_rating,
      labs_rating,
      presentation_rating,
      quiz_difficulty,
      top_learning, 
      most_useful_unit, 
      applying_at_work, 
      improvements, 
      nps,
      email 
    } = data;
    
    // Validate required fields
    if (!value_rating || !top_learning || !most_useful_unit || !applying_at_work || nps === undefined) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Save to Supabase
    const res = await fetch(`${SUPABASE_URL}/rest/v1/survey_responses`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        value_rating,
        newsletter_rating: newsletter_rating || null,
        content_rating: content_rating || null,
        assessments_rating: assessments_rating || null,
        labs_rating: labs_rating || null,
        presentation_rating: presentation_rating || null,
        quiz_difficulty: quiz_difficulty || null,
        top_learning,
        most_useful_unit,
        applying_at_work,
        improvements,
        nps,
        email: email || null,
        week_number: getWeekNumber()
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Survey save error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to save survey' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};

// Get current week number of the year
function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek);
}
