// Unsubscribe endpoint for newsletter
// URL: /.netlify/functions/unsubscribe?email=xxx&token=xxx

const crypto = require('crypto');

// Simple secret for signing unsubscribe tokens
// In production, use environment variable
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'pmm-unsub-2026';

// Generate token for an email (use this when creating unsubscribe links)
function generateToken(email) {
    return crypto.createHmac('sha256', UNSUBSCRIBE_SECRET)
        .update(email.toLowerCase().trim())
        .digest('hex')
        .substring(0, 16);
}

// Verify token matches email
function verifyToken(email, token) {
    const expected = generateToken(email);
    return token === expected;
}

exports.handler = async (event) => {
    // Handle both GET (link click) and POST
    const params = event.queryStringParameters || {};
    const email = params.email;
    const token = params.token;
    
    // Missing params - show form or error
    if (!email || !token) {
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'text/html' },
            body: `
<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribe - Future of PMM</title>
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; text-align: center; }
        .error { color: #c84b31; }
    </style>
</head>
<body>
    <h1>Invalid Link</h1>
    <p class="error">This unsubscribe link is missing required information.</p>
    <p>Please use the link from your newsletter email, or contact <a href="mailto:christopher.ohara@sap.com">christopher.ohara@sap.com</a></p>
</body>
</html>`
        };
    }
    
    // Verify token
    if (!verifyToken(email, token)) {
        return {
            statusCode: 403,
            headers: { 'Content-Type': 'text/html' },
            body: `
<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribe - Future of PMM</title>
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; text-align: center; }
        .error { color: #c84b31; }
    </style>
</head>
<body>
    <h1>Invalid Link</h1>
    <p class="error">This unsubscribe link has expired or is invalid.</p>
    <p>Please contact <a href="mailto:christopher.ohara@sap.com">christopher.ohara@sap.com</a> to unsubscribe.</p>
</body>
</html>`
        };
    }
    
    // Token valid - record the unsubscribe
    // For now, we'll log it and show success
    // In production, this would write to Supabase or a file
    console.log(`UNSUBSCRIBE: ${email} at ${new Date().toISOString()}`);
    
    // TODO: Write to Supabase unsubscribes table
    // const { createClient } = require('@supabase/supabase-js');
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    // await supabase.from('unsubscribes').upsert({ email: email.toLowerCase() });
    
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: `
<!DOCTYPE html>
<html>
<head>
    <title>Unsubscribed - Future of PMM</title>
    <style>
        body { font-family: -apple-system, sans-serif; max-width: 500px; margin: 50px auto; padding: 20px; text-align: center; }
        .success { color: #2d5a27; background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        a { color: #c84b31; }
    </style>
</head>
<body>
    <h1>Unsubscribed</h1>
    <div class="success">
        <p><strong>${email}</strong> has been removed from the Future of PMM newsletter.</p>
    </div>
    <p>Changed your mind? <a href="https://futureofpmm.com/subscribe.html">Re-subscribe here</a></p>
    <p><a href="https://futureofpmm.com">← Back to Future of PMM</a></p>
</body>
</html>`
    };
};

// Export for use in newsletter generation
exports.generateToken = generateToken;
