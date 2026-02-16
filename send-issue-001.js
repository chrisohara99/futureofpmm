const https = require('https');

const RESEND_API_KEY = 're_RE7HFCMz_JvBxdtA732inrjX1jaRTageG';
const FROM_EMAIL = 'The Future of PMM <chris@chrisohara.com>';
const SUBJECT = 'The Future of PMM — Issue #1';

const emails = [
  'thierry.audas@sap.com',
  'pam.barrowcliffe@sap.com',
  'katryn.cheng@sap.com',
  'juan.choung@sap.com',
  'orla.cullen@sap.com',
  'teuta.elezaj@sap.com',
  'saely.espaillat@sap.com',
  'antonio.giannelli@sap.com',
  'stuart.giles@sap.com',
  'megan.hoy@sap.com',
  'kuba.kufel@sap.com',
  'kaiser.larsen@sap.com',
  'max.law@sap.com',
  'josh.ledbetter@sap.com',
  'scott.mackenzie@sap.com',
  'sim.patara@sap.com',
  'savannah.voll@sap.com',
  'neil.whitehead@sap.com',
  'cathy.citarelli@sap.com',
  'daniel.dukes@sap.com',
  'kara.reed@sap.com',
  'axel.schuller@sap.com',
  'liam.clarke@sap.com',
  'kendall.dignam@sap.com',
  'venkata.giduthuri@sap.com',
  'matthew.lyman@sap.com',
  'jose.chicas@sap.com',
  'tony.truong@sap.com',
  'lauren.wong@sap.com',
  'tiffany.baker@sap.com',
  'christopher.ohara@sap.com',
  'tara.rogers@sap.com',
  'karsten.ruf@sap.com',
  'corrie.birkeness@sap.com',
  'a.naji@sap.com',
  'brian.raver@sap.com',
  'olivier.duvelleroy@sap.com',
  'jacob.brass@sap.com'
];

const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; color: #1a1a2e; line-height: 1.6;">
  
  <p style="font-size: 16px;">The first Friday Note is live!</p>
  
  <p style="font-size: 15px;"><strong>This week:</strong></p>
  <ul style="font-size: 15px; padding-left: 20px;">
    <li>Budget approved for AI tools</li>
    <li>Gartner Skills Assessment (please complete!)</li>
    <li>AI Tools Guide for PMM</li>
    <li>User of the Week: Jacob Brass</li>
    <li>Survey early results + news roundup</li>
  </ul>
  
  <p style="margin: 24px 0;">
    <a href="https://futureofpmm.com/newsletters/issue-001.html" style="display: inline-block; background: #c84b31; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 15px;">Read the Full Newsletter →</a>
  </p>
  
  <p style="font-size: 15px; color: #666; margin-top: 32px;">—Chris</p>
  
</div>
`;

async function sendEmail(to) {
  return new Promise((resolve) => {
    const data = JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject: SUBJECT,
      html: htmlContent
    });

    const req = https.request({
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + RESEND_API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ to, success: true });
        } else {
          resolve({ to, success: false, error: body });
        }
      });
    });
    req.on('error', (e) => resolve({ to, success: false, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function sendAll() {
  console.log(`Sending Issue #1 to ${emails.length} recipients...`);
  
  let success = 0;
  let failed = 0;
  const failures = [];
  
  for (const email of emails) {
    const result = await sendEmail(email);
    if (result.success) {
      console.log(`✓ ${email}`);
      success++;
    } else {
      console.log(`✗ ${email}`);
      failures.push(email);
      failed++;
    }
    // 600ms delay for rate limiting
    await new Promise(r => setTimeout(r, 600));
  }
  
  console.log(`\n--- COMPLETE ---`);
  console.log(`Sent: ${success}/${emails.length}`);
  if (failed > 0) console.log(`Failed: ${failures.join(', ')}`);
}

sendAll();
