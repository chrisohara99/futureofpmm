// Custom email verification - bypasses Supabase entirely
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Simple JWT-like token (base64 encoded JSON with signature)
function createToken(data, secret) {
  const payload = {
    ...data,
    exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiry
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const crypto = require('crypto');
  const sig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
  return `${payloadB64}.${sig}`;
}

function verifyToken(token, secret) {
  try {
    const [payloadB64, sig] = token.split('.');
    const crypto = require('crypto');
    const expectedSig = crypto.createHmac('sha256', secret).update(payloadB64).digest('base64url');
    if (sig !== expectedSig) return null;
    
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
    if (payload.exp < Date.now()) return null; // Expired
    
    return payload;
  } catch (e) {
    return null;
  }
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const body = JSON.parse(event.body || '{}');
  const { action } = body;

  // ACTION: Send verification email
  if (action === 'send') {
    const { email, firstName, lastName, role } = body;
    
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Email required' }) };
    }

    // Check if profile already exists
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
      return { statusCode: 200, headers, body: JSON.stringify({ exists: true }) };
    }

    // Create verification token
    const token = createToken(
      { email: email.toLowerCase(), firstName, lastName, role },
      SUPABASE_SERVICE_KEY // Using service key as secret
    );

    const verifyUrl = `https://futureofpmm.com/curriculum/verify.html?token=${encodeURIComponent(token)}`;

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Future of PMM <noreply@futureofpmm.com>',
        to: email,
        subject: 'Verify your email - Future of PMM Curriculum',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #44546A;">Welcome to the Future of PMM! 🎓</h2>
            <p>Hi ${firstName || 'there'},</p>
            <p>Click the button below to verify your email and complete your enrollment:</p>
            <p style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #4472C4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Verify Email & Start Learning
              </a>
            </p>
            <p style="color: #666; font-size: 14px;">This link expires in 24 hours.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, you can ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #888; font-size: 12px;">The Future of PMM - AI-Powered Product Marketing Training</p>
          </div>
        `
      })
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to send email' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // ACTION: Verify token and create profile
  if (action === 'verify') {
    const { token } = body;
    
    if (!token) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Token required' }) };
    }

    const payload = verifyToken(token, SUPABASE_SERVICE_KEY);
    
    if (!payload) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid or expired token' }) };
    }

    // Check if profile already exists (in case they verify twice)
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(payload.email)}&select=id,first_name,last_name`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
        }
      }
    );
    
    const existing = await checkRes.json();
    if (existing && existing.length > 0) {
      return { 
        statusCode: 200, 
        headers, 
        body: JSON.stringify({ 
          success: true, 
          id: existing[0].id,
          firstName: existing[0].first_name,
          lastName: existing[0].last_name,
          email: payload.email
        }) 
      };
    }

    // Create profile
    const id = require('crypto').randomUUID();
    
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
        email: payload.email,
        first_name: payload.firstName || null,
        last_name: payload.lastName || null,
        role: payload.role || null,
        company: 'SAP'
      })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Profile create error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create profile' }) };
    }

    return { 
      statusCode: 200, 
      headers, 
      body: JSON.stringify({ 
        success: true, 
        id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email
      }) 
    };
  }

  return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid action' }) };
};
