#!/usr/bin/env node
// Generate unsubscribe links for newsletter emails
// Usage: node unsubscribe-link.js email@example.com

const crypto = require('crypto');

const UNSUBSCRIBE_SECRET = process.env.UNSUBSCRIBE_SECRET || 'pmm-unsub-2026';
const BASE_URL = 'https://futureofpmm.com/.netlify/functions/unsubscribe';

function generateToken(email) {
    return crypto.createHmac('sha256', UNSUBSCRIBE_SECRET)
        .update(email.toLowerCase().trim())
        .digest('hex')
        .substring(0, 16);
}

function generateUnsubscribeLink(email) {
    const token = generateToken(email);
    const encodedEmail = encodeURIComponent(email.toLowerCase().trim());
    return `${BASE_URL}?email=${encodedEmail}&token=${token}`;
}

// If run directly, generate link for provided email
if (require.main === module) {
    const email = process.argv[2];
    if (!email) {
        console.log('Usage: node unsubscribe-link.js email@example.com');
        process.exit(1);
    }
    console.log(generateUnsubscribeLink(email));
}

module.exports = { generateToken, generateUnsubscribeLink };
