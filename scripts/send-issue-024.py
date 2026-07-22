#!/usr/bin/env python3
"""Send Newsletter Issue #24 to all subscribers."""

import requests
import hashlib
import hmac
from urllib.parse import quote
import time

# New Resend API key
API_KEY = "re_hXnv6aq3_KNsedW7JvhNawo2A913SZ4pw"

# Unsubscribe config
UNSUBSCRIBE_SECRET = "pmm-unsub-2026"
UNSUBSCRIBE_BASE = "https://futureofpmm.com/.netlify/functions/unsubscribe"

def generate_unsubscribe_token(email):
    key = UNSUBSCRIBE_SECRET.encode()
    msg = email.lower().strip().encode()
    return hmac.new(key, msg, hashlib.sha256).hexdigest()[:16]

def get_unsubscribe_url(email):
    token = generate_unsubscribe_token(email)
    encoded_email = quote(email.lower().strip())
    return f"{UNSUBSCRIBE_BASE}?email={encoded_email}&token={token}"

def send_email(email, subject, html):
    unsub_url = get_unsubscribe_url(email)
    personalized_html = html.replace("{{UNSUBSCRIBE_URL}}", unsub_url)
    
    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "from": "Chris O'Hara <chris@futureofpmm.com>",
            "to": [email],
            "subject": subject,
            "html": personalized_html
        }
    )
    return response.status_code == 200, response.text

if __name__ == "__main__":
    import subprocess
    import json
    
    # Get subscribers from Supabase
    result = subprocess.run([
        "curl", "-s",
        "https://yyqzkczutlidhgyiyawc.supabase.co/rest/v1/profiles?newsletter_opt_in=eq.true&select=email",
        "-H", "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ2NjQ3OSwiZXhwIjoyMDkwMDQyNDc5fQ.0s65OtVUqKhvyfmf0e2bz23urbnsMegHLZeHOeqjw0E",
        "-H", "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cXprY3p1dGxpZGhneWl5YXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ2NjQ3OSwiZXhwIjoyMDkwMDQyNDc5fQ.0s65OtVUqKhvyfmf0e2bz23urbnsMegHLZeHOeqjw0E"
    ], capture_output=True, text=True)
    
    all_emails = [p["email"] for p in json.loads(result.stdout)]
    # Filter out test emails
    subscribers = [e for e in all_emails if "test@" not in e.lower() and e != "no@sap.com"]
    
    # Read newsletter HTML
    with open("/root/.openclaw/workspace/futureofpmm/dist/newsletters/issue-024.html", "r") as f:
        html = f.read()
    
    subject = "The Future of PMM — Issue #24: The Final Stretch"
    
    print(f"Sending to {len(subscribers)} subscribers...")
    print()
    
    success = 0
    failed = 0
    
    for i, email in enumerate(subscribers):
        ok, resp = send_email(email, subject, html)
        if ok:
            print(f"✓ [{i+1}/{len(subscribers)}] {email}")
            success += 1
        else:
            print(f"✗ [{i+1}/{len(subscribers)}] {email}: {resp}")
            failed += 1
        # Rate limit: ~2/sec to stay under Resend limits
        time.sleep(0.5)
    
    print()
    print(f"Done: {success} sent, {failed} failed")
