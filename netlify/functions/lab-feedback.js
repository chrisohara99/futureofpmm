// Lab Feedback Handler - Suggest a Lab & LOB Customization Requests
// Stores in Supabase and emails Chris

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yyqzkczutlidhgyiyawc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = 'christopher.ohara@sap.com';

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const data = JSON.parse(event.body);
        const { type } = data; // 'suggest-lab' or 'lob-customize'

        // Initialize Supabase
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

        // Create table if not exists (first time only - handled by Supabase migration ideally)
        // For now, we'll insert and let it fail gracefully if table doesn't exist

        const record = {
            type: type,
            data: data,
            priority: 'unset',
            status: 'new',
            created_at: new Date().toISOString(),
            submitter_name: data.name || data.submitterName || 'Anonymous'
        };

        // Insert into Supabase
        const { data: inserted, error: dbError } = await supabase
            .from('lab_feedback')
            .insert([record])
            .select()
            .single();

        if (dbError) {
            console.error('Supabase error:', dbError);
            // Continue to send email even if DB fails
        }

        // Send email notification
        let emailSubject, emailBody;

        if (type === 'suggest-lab') {
            emailSubject = `💡 New Lab Suggestion: ${data.category || 'General'}`;
            emailBody = `
                <h2>New Lab Suggestion</h2>
                <p><strong>From:</strong> ${data.name || 'Anonymous'}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Line(s) of Business:</strong> ${(data.lobs || []).join(', ')}</p>
                <h3>Problem Statement</h3>
                <p>${data.problem}</p>
                <h3>Inputs</h3>
                <p>${data.inputs}</p>
                <h3>Expected Outputs</h3>
                <p>${data.outputs}</p>
                <hr>
                <p><a href="https://futureofpmm.com/admin/lab-queue.html">View Request Queue →</a></p>
            `;
        } else if (type === 'lob-customize') {
            emailSubject = `🎯 LOB Customization Request: ${data.lab} → ${data.lob}`;
            emailBody = `
                <h2>LOB Customization Request</h2>
                <p><strong>From:</strong> ${data.name || 'Anonymous'}</p>
                <p><strong>Lab:</strong> ${data.lab}</p>
                <p><strong>Line of Business:</strong> ${data.lob}</p>
                <h3>Notes</h3>
                <p>${data.notes || 'No additional notes'}</p>
                <hr>
                <p><a href="https://futureofpmm.com/admin/lab-queue.html">View Request Queue →</a></p>
            `;
        }

        // Send via Resend
        if (RESEND_API_KEY) {
            try {
                const emailRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Future of PMM <noreply@futureofpmm.com>',
                        to: [NOTIFY_EMAIL],
                        subject: emailSubject,
                        html: emailBody
                    })
                });

                if (!emailRes.ok) {
                    console.error('Resend error:', await emailRes.text());
                }
            } catch (emailErr) {
                console.error('Email send error:', emailErr);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                id: inserted?.id || null,
                message: 'Feedback submitted successfully'
            })
        };

    } catch (err) {
        console.error('Handler error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};
