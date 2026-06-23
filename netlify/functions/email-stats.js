const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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
    const params = event.queryStringParameters || {};
    const days = parseInt(params.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Get all events from the period
    const { data: events, error } = await supabase
      .from('email_events')
      .select('*')
      .gte('created_at', since)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      };
    }

    // Aggregate stats
    const stats = {
      period: `Last ${days} days`,
      sent: events.filter(e => e.event_type === 'email.sent').length,
      delivered: events.filter(e => e.event_type === 'email.delivered').length,
      opened: events.filter(e => e.event_type === 'email.opened').length,
      clicked: events.filter(e => e.event_type === 'email.clicked').length,
      bounced: events.filter(e => e.event_type === 'email.bounced').length,
      complained: events.filter(e => e.event_type === 'email.complained').length
    };

    // Calculate rates
    if (stats.delivered > 0) {
      stats.openRate = ((stats.opened / stats.delivered) * 100).toFixed(1) + '%';
      stats.clickRate = ((stats.clicked / stats.delivered) * 100).toFixed(1) + '%';
    }

    // Unique openers
    const uniqueOpeners = [...new Set(
      events
        .filter(e => e.event_type === 'email.opened')
        .map(e => e.to_email)
        .filter(Boolean)
    )];

    // Unique clickers
    const uniqueClickers = [...new Set(
      events
        .filter(e => e.event_type === 'email.clicked')
        .map(e => e.to_email)
        .filter(Boolean)
    )];

    // Recent opens (last 10)
    const recentOpens = events
      .filter(e => e.event_type === 'email.opened')
      .slice(0, 10)
      .map(e => ({
        email: e.to_email,
        subject: e.subject,
        opened_at: e.created_at
      }));

    // Recent clicks
    const recentClicks = events
      .filter(e => e.event_type === 'email.clicked')
      .slice(0, 10)
      .map(e => ({
        email: e.to_email,
        url: e.click_url,
        clicked_at: e.created_at
      }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        stats,
        uniqueOpeners,
        uniqueClickers,
        recentOpens,
        recentClicks
      }, null, 2)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
