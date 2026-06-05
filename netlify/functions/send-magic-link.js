// Netlify function to send magic link for new user signup
// Uses Resend for reliable email delivery
const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

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

    const emailLower = email.toLowerCase();

    // Check if profile already exists
    const checkRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?email=eq.${encodeURIComponent(emailLower)}&select=id`,
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
          exists: true, 
          message: 'Account already exists. Please use the login page.' 
        })
      };
    }

    // Create profile in database
    const createRes = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        email: emailLower,
        first_name: firstName || '',
        last_name: lastName || '',
        role: role || ''
      })
    });

    if (!createRes.ok) {
      const err = await createRes.text();
      console.error('Profile creation error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed to create profile' }) };
    }

    // Send welcome email via Resend
    const emailHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; padding: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 2.5rem;">🎓</span>
        </div>
        <h1 style="color: #1e3a5f; font-size: 1.5rem; margin-bottom: 16px; text-align: center;">Welcome to 10× PMM, ${firstName || 'there'}!</h1>
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">You're now enrolled in the <strong>10× PMM Curriculum</strong> — a self-paced program designed to help product marketers thrive in the age of AI.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://futureofpmm.com/curriculum/login.html" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 1rem;">Access Curriculum →</a>
        </div>
        <p style="color: #64748b; font-size: 0.9rem; text-align: center;">Just enter your email (<strong>${emailLower}</strong>) to log in anytime.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
        <p style="color: #64748b; font-size: 0.85rem; text-align: center;">
          Questions? Reply to this email or reach out to <a href="mailto:christopher.ohara@sap.com" style="color: #3b82f6;">christopher.ohara@sap.com</a>
        </p>
      </div>
    `;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: '10× PMM <curriculum@futureofpmm.com>',
        to: emailLower,
        subject: `Welcome to 10× PMM, ${firstName || 'there'}! 🎓`,
        html: emailHtml
      })
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error('Resend error:', err);
      // Profile was created, so don't fail completely - just note the email issue
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          emailSent: false,
          message: 'Account created! You can log in now at the curriculum page.' 
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        emailSent: true,
        message: 'Welcome email sent! Check your inbox and click the link to get started.' 
      })
    };

  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server error' }) };
  }
};
