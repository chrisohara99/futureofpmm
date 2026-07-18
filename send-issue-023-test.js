const https = require('https');
const fs = require('fs');

const RESEND_API_KEY = 're_QMDX7Run_NXZGvSYgZPcbae2pLFY8CTEu';
const FROM_EMAIL = 'The Future of PMM <chris@chrisohara.com>';
const SUBJECT = '[TEST] The Future of PMM — Issue #23: The Demo Stack';

// Test recipient - Chris
const testEmails = [
  'chrisohara1968@gmail.com'
];

// Read the HTML content
const htmlContent = fs.readFileSync('./dist/newsletter/issue-023.html', 'utf8');

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
          console.log(`✓ Sent to ${to}`);
          console.log(`  Response: ${body}`);
          resolve({ to, success: true });
        } else {
          console.log(`✗ Failed for ${to}`);
          console.log(`  Status: ${res.statusCode}`);
          console.log(`  Response: ${body}`);
          resolve({ to, success: false, error: body });
        }
      });
    });
    req.on('error', (e) => {
      console.log(`✗ Error for ${to}: ${e.message}`);
      resolve({ to, success: false, error: e.message });
    });
    req.write(data);
    req.end();
  });
}

async function sendTest() {
  console.log(`Sending Issue #23 TEST to ${testEmails.length} recipients...`);
  console.log('---');
  
  for (const email of testEmails) {
    await sendEmail(email);
  }
  
  console.log('---');
  console.log('Test complete!');
}

sendTest();
