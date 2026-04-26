#!/usr/bin/env python3
"""
Newsletter sender with personalized unsubscribe links.
Usage: python send-newsletter.py <newsletter-html-file> <subject>
"""

import requests
import sys
import hashlib
import hmac
from urllib.parse import quote

# Resend API key
API_KEY = "re_RieSzpSV_EVieiVyPjC1GN8A9rTxr7dPN"

# Unsubscribe config (must match netlify function)
UNSUBSCRIBE_SECRET = "pmm-unsub-2026"
UNSUBSCRIBE_BASE = "https://futureofpmm.com/.netlify/functions/unsubscribe"

# Full subscriber list
SUBSCRIBERS = [
    # Add your subscribers here
    "christopher.ohara@sap.com",
    "chrisohara1968@gmail.com",
    # ... paste full list from Netlify Forms export
]

def generate_unsubscribe_token(email):
    """Generate HMAC token for email (must match netlify function)."""
    key = UNSUBSCRIBE_SECRET.encode()
    msg = email.lower().strip().encode()
    return hmac.new(key, msg, hashlib.sha256).hexdigest()[:16]

def get_unsubscribe_url(email):
    """Generate full unsubscribe URL for an email."""
    token = generate_unsubscribe_token(email)
    encoded_email = quote(email.lower().strip())
    return f"{UNSUBSCRIBE_BASE}?email={encoded_email}&token={token}"

def send_newsletter(html_file, subject, dry_run=False, limit=None):
    """Send newsletter to all subscribers."""
    
    # Read template
    with open(html_file, "r") as f:
        template = f.read()
    
    recipients = SUBSCRIBERS[:limit] if limit else SUBSCRIBERS
    
    print(f"Sending '{subject}' to {len(recipients)} recipients...")
    if dry_run:
        print("(DRY RUN - no emails will be sent)")
    print()
    
    success = 0
    failed = 0
    
    for email in recipients:
        # Personalize unsubscribe link
        unsub_url = get_unsubscribe_url(email)
        html = template.replace("{{UNSUBSCRIBE_URL}}", unsub_url)
        
        if dry_run:
            print(f"✓ {email}")
            print(f"  Unsubscribe: {unsub_url}")
            success += 1
            continue
        
        try:
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
                    "html": html
                }
            )
            
            if response.status_code == 200:
                print(f"✓ {email}")
                success += 1
            else:
                print(f"✗ {email}: {response.status_code} - {response.text}")
                failed += 1
                
        except Exception as e:
            print(f"✗ {email}: {e}")
            failed += 1
    
    print()
    print(f"Done: {success} sent, {failed} failed")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python send-newsletter.py <html-file> <subject> [--dry-run] [--limit=N]")
        print()
        print("Example:")
        print('  python send-newsletter.py issue-012.html "The Friday Note #12"')
        print('  python send-newsletter.py issue-012.html "Test" --dry-run --limit=2')
        sys.exit(1)
    
    html_file = sys.argv[1]
    subject = sys.argv[2]
    dry_run = "--dry-run" in sys.argv
    
    limit = None
    for arg in sys.argv:
        if arg.startswith("--limit="):
            limit = int(arg.split("=")[1])
    
    send_newsletter(html_file, subject, dry_run=dry_run, limit=limit)
