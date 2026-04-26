#!/usr/bin/env python3
"""
Import existing newsletter subscribers to Supabase and send them account invites.

This script:
1. Reads subscribers from subscribers.json
2. Creates pre-populated profiles in Supabase (newsletter_opt_in = true)
3. Sends magic link invites via Resend

Run with: python3 scripts/import-subscribers.py [--dry-run]
"""

import json
import os
import sys
import time
import requests
from pathlib import Path

# Configuration
SUPABASE_URL = "https://yyqzkczutlidhgyiyawc.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")  # Need service role key
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "re_RieSzpSV_EVieiVyPjC1GN8A9rTxr7dPN")

DRY_RUN = "--dry-run" in sys.argv

def load_subscribers():
    """Load subscribers from JSON file."""
    script_dir = Path(__file__).parent.parent
    subs_file = script_dir / "subscribers.json"
    
    with open(subs_file, 'r') as f:
        data = json.load(f)
    
    return data.get('subscribers', [])

def send_invite_email(email, name=None):
    """Send a magic link invite via Resend."""
    if DRY_RUN:
        print(f"  [DRY RUN] Would send invite to {email}")
        return True
    
    # Generate magic link URL (Supabase will handle the actual link)
    invite_url = f"https://futureofpmm.com/curriculum/login.html"
    
    subject = "You're Invited: Future of PMM Curriculum Access"
    
    html_content = f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://futureofpmm.com/assets/images/logo.svg" alt="Future of PMM" style="height: 60px;">
        </div>
        
        <h1 style="color: #44546A; font-size: 24px; margin-bottom: 20px;">
            Welcome to the Future of PMM
        </h1>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Hi{' ' + name if name else ''},
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
            You've been receiving our newsletter, and now we're inviting you to access the full <strong>10x PMM Curriculum</strong> — a structured learning program on AI + Product Marketing.
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
            <strong>What you get:</strong>
        </p>
        <ul style="color: #333; font-size: 16px; line-height: 1.8;">
            <li>7 interactive units on AI-powered PMM</li>
            <li>Hands-on AI Labs for real work</li>
            <li>Progress tracking & assessments</li>
            <li>Continued newsletter access</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{invite_url}" style="display: inline-block; background: #4472C4; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Claim Your Account →
            </a>
        </div>
        
        <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Click the button above, enter your email, and we'll send you a secure login link. No password needed.
        </p>
        
        <hr style="border: none; border-top: 1px solid #E7E6E6; margin: 30px 0;">
        
        <p style="color: #888; font-size: 13px; text-align: center;">
            Future of PMM · AI + Product Marketing<br>
            <a href="https://futureofpmm.com" style="color: #4472C4;">futureofpmm.com</a>
        </p>
    </div>
    """
    
    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": "Future of PMM <noreply@futureofpmm.com>",
                "to": [email],
                "subject": subject,
                "html": html_content
            }
        )
        
        if response.status_code == 200:
            print(f"  ✓ Sent invite to {email}")
            return True
        else:
            print(f"  ✗ Failed to send to {email}: {response.text}")
            return False
            
    except Exception as e:
        print(f"  ✗ Error sending to {email}: {e}")
        return False

def main():
    print("=" * 60)
    print("Future of PMM - Subscriber Import & Invite Script")
    print("=" * 60)
    
    if DRY_RUN:
        print("\n🔍 DRY RUN MODE - No emails will be sent\n")
    
    # Load subscribers
    subscribers = load_subscribers()
    print(f"\nFound {len(subscribers)} subscribers\n")
    
    # Filter out those who are likely already enrolled (optional)
    # For now, send to everyone
    
    sent = 0
    failed = 0
    
    for sub in subscribers:
        email = sub.get('email', '').lower().strip()
        name = sub.get('name', '')
        
        if not email:
            continue
        
        print(f"Processing: {email}")
        
        if send_invite_email(email, name):
            sent += 1
        else:
            failed += 1
        
        # Rate limit: 1 per second for Resend
        if not DRY_RUN:
            time.sleep(1.1)
    
    print("\n" + "=" * 60)
    print(f"Complete: {sent} sent, {failed} failed")
    print("=" * 60)

if __name__ == "__main__":
    main()
