const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const payload = JSON.parse(event.body);
    
    // Resend sends events like: email.sent, email.delivered, email.opened, email.clicked, email.bounced
    const { type, data, created_at } = payload;
    
    // Extract relevant info
    const emailEvent = {
      event_type: type,
      email_id: data?.email_id || null,
      to_email: data?.to?.[0] || data?.email || null,
      subject: data?.subject || null,
      click_url: data?.click?.url || null,
      created_at: created_at || new Date().toISOString(),
      raw_data: payload
    };

    // Store in Supabase
    const { error } = await supabase
      .from('email_events')
      .insert(emailEvent);

    if (error) {
      console.error('Supabase insert error:', error);
      // Still return 200 so Resend doesn't retry
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true })
    };
  } catch (err) {
    console.error('Webhook error:', err);
    // Return 200 anyway to acknowledge receipt
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true, error: err.message })
    };
  }
};
