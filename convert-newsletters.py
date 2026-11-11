#!/usr/bin/env python3
"""Convert newsletters from SAP blue template to dark navy template"""

import re
import os
from pathlib import Path

def extract_content(html):
    """Extract metadata and body content from old template"""
    
    # Extract issue number
    issue_match = re.search(r'Issue #(\d+)', html)
    issue_num = issue_match.group(1) if issue_match else "?"
    
    # Extract date
    date_match = re.search(r'<span class="badge badge-muted">([^<]+)</span>', html)
    date = date_match.group(1) if date_match else "2026"
    
    # Extract title
    title_match = re.search(r'<h1>([^<]+)</h1>', html)
    title = title_match.group(1) if title_match else "Newsletter"
    
    # Extract lead/description
    lead_match = re.search(r'<p class="lead">([^<]+)</p>', html)
    lead = lead_match.group(1) if lead_match else ""
    
    # Extract body content
    body_match = re.search(r'<div class="article-body">\s*<div class="inner">(.*?)</div>\s*</div>', html, re.DOTALL)
    body = body_match.group(1).strip() if body_match else ""
    
    # Extract prev/next
    prev_match = re.search(r'<a class="nav-card" href="([^"]+)">\s*<p class="nav-label">Older[^<]*</p>\s*<p class="nav-title">([^<]+)</p>', html, re.DOTALL)
    next_match = re.search(r'<a class="nav-card right" href="([^"]+)">\s*<p class="nav-label">Newer[^<]*</p>\s*<p class="nav-title">([^<]+)</p>', html, re.DOTALL)
    
    prev_link = prev_match.group(1) if prev_match else None
    prev_title = prev_match.group(2) if prev_match else None
    next_link = next_match.group(1) if next_match else None
    next_title = next_match.group(2) if next_match else None
    
    return {
        'issue_num': issue_num,
        'date': date,
        'title': title,
        'lead': lead,
        'body': body,
        'prev_link': prev_link,
        'prev_title': prev_title,
        'next_link': next_link,
        'next_title': next_title
    }

def convert_body_to_new_format(body):
    """Convert body content classes to inline styles for email template"""
    
    # Convert eyebrows
    body = re.sub(
        r'<p class="nb-eyebrow">([^<]*)</p>',
        r'<p style="font-family: monospace; font-size: 10px; letter-spacing: 2px; color: #c84b31; margin: 28px 0 16px 0; text-transform: uppercase;">\1</p>',
        body
    )
    
    # Convert h2
    body = re.sub(
        r'<h2 class="nb-h2">([^<]*)</h2>',
        r'<h2 style="font-family: Georgia, serif; font-size: 24px; margin: 0 0 16px 0; color: #1a1a2e;">\1</h2>',
        body
    )
    
    # Convert paragraphs
    body = re.sub(
        r'<p class="nb-p">',
        r'<p style="font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; color: #333;">',
        body
    )
    
    # Convert lists
    body = re.sub(
        r'<ul class="nb-ul">',
        r'<ul style="font-size: 14px; color: #333; margin: 0 0 20px 0; padding-left: 20px; line-height: 1.7;">',
        body
    )
    body = re.sub(
        r'<li>',
        r'<li style="margin-bottom: 8px;">',
        body
    )
    
    # Convert callouts
    body = re.sub(
        r'<aside class="nb-callout callout-insight">',
        r'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #e8f4ff 0%, #dbeafe 100%); border-radius: 12px; border: 1px solid #93c5fd; margin: 16px 0;"><tr><td style="padding: 20px;">',
        body
    )
    body = re.sub(
        r'<aside class="nb-callout callout-success">',
        r'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #86efac; margin: 16px 0;"><tr><td style="padding: 20px;">',
        body
    )
    body = re.sub(
        r'<aside class="nb-callout callout-alert">',
        r'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; border: 2px solid #f59e0b; margin: 16px 0;"><tr><td style="padding: 20px;">',
        body
    )
    body = re.sub(r'</aside>', r'</td></tr></table>', body)
    
    body = re.sub(
        r'<p class="callout-title">([^<]*)</p>',
        r'<p style="font-family: Georgia, serif; font-size: 16px; font-weight: bold; margin: 0 0 8px 0; color: #1a1a2e;">\1</p>',
        body
    )
    body = re.sub(
        r'<p class="callout-body">',
        r'<p style="font-size: 14px; color: #555; margin: 0; line-height: 1.5;">',
        body
    )
    
    # Convert quotes
    body = re.sub(
        r'<blockquote class="nb-quote">',
        r'<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e; border-radius: 12px; margin: 16px 0;"><tr><td style="padding: 24px; text-align: center;"><p style="font-family: Georgia, serif; font-size: 18px; font-style: italic; margin: 0; color: rgba(255,255,255,0.9); line-height: 1.6;">',
        body
    )
    body = re.sub(r'</blockquote>', r'</p></td></tr></table>', body)
    
    # Convert footer notes
    body = re.sub(
        r'<p class="nb-footer-note">',
        r'<p style="font-size: 13px; color: #888; margin: 24px 0 8px 0; padding-top: 16px; border-top: 1px solid #e5e2dd;">',
        body
    )
    
    return body

def create_new_template(data):
    """Create newsletter in new dark navy template"""
    
    body_content = convert_body_to_new_format(data['body'])
    
    # Wrap body in proper table cells with dividers
    sections = body_content.split('<p style="font-family: monospace; font-size: 10px;')
    formatted_sections = []
    for i, section in enumerate(sections):
        if i == 0:
            formatted_sections.append(section)
        else:
            formatted_sections.append(f'''
                    </td>
                </tr>
                <tr><td style="padding: 0 32px;"><hr style="border: none; border-top: 1px solid #e5e2dd; margin: 0;"></td></tr>
                <tr>
                    <td style="padding: 28px 32px;">
                        <p style="font-family: monospace; font-size: 10px;{section}''')
    
    body_html = ''.join(formatted_sections)
    
    template = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>D&A PMM Weekly Update #{data['issue_num']}: {data['title']}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #e8e6e1; font-family: Georgia, 'Times New Roman', serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #e8e6e1;">
        <tr>
            <td align="center" style="padding: 24px 16px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #faf9f7; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1a1a2e; padding: 40px 32px 32px; color: white;">
                            <p style="font-family: monospace; font-size: 11px; letter-spacing: 2px; color: #c84b31; margin: 0 0 12px 0; text-transform: uppercase;">D&A PMM Weekly Update · Issue #{data['issue_num']}</p>
                            <h1 style="font-family: Georgia, serif; font-size: 32px; font-weight: bold; margin: 0 0 8px 0; line-height: 1.2;">The Future of <span style="border-bottom: 3px solid #c84b31;">PMM</span></h1>
                            <p style="font-size: 14px; color: rgba(255,255,255,0.5); margin: 8px 0 0 0;">{data['date']} · Chris O'Hara</p>
                        </td>
                    </tr>
                    
                    <!-- Title Section -->
                    <tr>
                        <td style="padding: 28px 32px;">
                            <p style="font-family: monospace; font-size: 10px; letter-spacing: 2px; color: #c84b31; margin: 0 0 16px 0; text-transform: uppercase;">📰 This Week</p>
                            <h2 style="font-family: Georgia, serif; font-size: 24px; margin: 0 0 16px 0; color: #1a1a2e;">{data['title']}</h2>
                            <p style="font-size: 15px; line-height: 1.7; margin: 0; color: #333;">{data['lead']}</p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr><td style="padding: 0 32px;"><hr style="border: none; border-top: 1px solid #e5e2dd; margin: 0;"></td></tr>
                    
                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 28px 32px;">
                            {body_html}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f5f3ef; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e2dd;">
                            <p style="font-size: 13px; color: #888; margin: 0 0 8px 0;">The Future of PMM · SAP Product Marketing · Internal Use Only</p>
                            <p style="font-size: 13px; margin: 0;">
                                <a href="https://futureofpmm.com" style="color: #c84b31; text-decoration: none;">Website</a> · 
                                <a href="https://futureofpmm.com/newsletters/" style="color: #c84b31; text-decoration: none;">All Newsletters</a> · 
                                <a href="https://futureofpmm.com/feedback" style="color: #c84b31; text-decoration: none;">Give Feedback</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>'''
    
    return template

def main():
    newsletters_dir = Path('/root/.openclaw/workspace/sap-pmm-internal/dist/newsletters')
    output_dir = Path('/root/.openclaw/workspace/sap-pmm-internal/newsletters-converted')
    output_dir.mkdir(exist_ok=True)
    
    # Get all newsletter files (exclude drafts, emails, previews)
    files = sorted([f for f in newsletters_dir.glob('issue-0*.html') 
                   if not any(x in f.name for x in ['draft', 'email', 'preview'])])
    
    converted = 0
    for f in files:
        try:
            html = f.read_text()
            data = extract_content(html)
            new_html = create_new_template(data)
            
            output_file = output_dir / f.name
            output_file.write_text(new_html)
            print(f"Converted: {f.name}")
            converted += 1
        except Exception as e:
            print(f"Error converting {f.name}: {e}")
    
    # Also copy issue-031 as is (already in correct format)
    issue_031 = newsletters_dir / 'issue-031.html'
    if issue_031.exists():
        (output_dir / 'issue-031.html').write_text(issue_031.read_text())
        print("Copied: issue-031.html")
        converted += 1
    
    print(f"\nConverted {converted} newsletters to {output_dir}")

if __name__ == '__main__':
    main()
