// Unsubscribe endpoint for newsletter
// URL: /.netlify/functions/unsubscribe?email=xxx&token=xxx

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// Simple secret for signing unsubscribe tokens
const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'pmm-unsub-2026';

// Initialize Supabase (uses service key for write access)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

function getSupabase() {
    if (!supabaseUrl || !supabaseServiceKey) {
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey);
}

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
    const params = event.queryStringParameters || {};
    const email = params.email;
    const token = params.token;
    const source = params.source || 'newsletter';
    
    // Missing params
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
    const normalizedEmail = email.toLowerCase().trim();
    let dbError = null;
    
    const supabase = getSupabase();
    if (supabase) {
        try {
            const { error } = await supabase
                .from('unsubscribes')
                .upsert({ 
                    email: normalizedEmail,
                    source: source,
                    unsubscribed_at: new Date().toISOString()
                }, { 
                    onConflict: 'email' 
                });
            
            if (error) {
                console.error('Supabase error:', error);
                dbError = error.message;
            }
        } catch (err) {
            console.error('Supabase exception:', err);
            dbError = err.message;
        }
    } else {
        console.log(`UNSUBSCRIBE (no DB): ${normalizedEmail} at ${new Date().toISOString()}`);
    }
    
    // Also update profile if user exists (for authenticated users)
    if (supabase) {
        try {
            await supabase
                .from('profiles')
                .update({ newsletter_opt_in: false })
                .eq('email', normalizedEmail);
        } catch (err) {
            // Ignore - user may not have a profile
        }
    }
    
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
        <p><strong>${normalizedEmail}</strong> has been removed from the Future of PMM newsletter.</p>
    </div>
    <p>Changed your mind? <a href="https://futureofpmm.com/subscribe.html">Re-subscribe here</a></p>
    <p><a href="https://futureofpmm.com">← Back to Future of PMM</a></p>
</body>
</html>`
    };
};

// Export for use in newsletter generation
exports.generateToken = generateToken;
