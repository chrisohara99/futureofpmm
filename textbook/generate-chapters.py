#!/usr/bin/env python3
import subprocess
import re

CSS = """
@page { size: letter; margin: 0.9in 1in; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Georgia, 'Times New Roman', serif; font-size: 11pt; line-height: 1.65; color: #1a1a1a; max-width: 6in; margin: 0 auto; }
.chapter-opener { text-align: center; margin-bottom: 2.5em; padding-bottom: 1.5em; border-bottom: 1px solid #999; }
.chapter-num { font-size: 13pt; letter-spacing: 0.25em; text-transform: uppercase; color: #555; margin-bottom: 0.75em; }
h1 { font-family: Georgia, serif; font-size: 22pt; font-weight: normal; margin-bottom: 0.5em; line-height: 1.2; }
.pragmatic-remix { font-size: 10pt; font-style: italic; color: #666; margin-top: 0.5em; }
h2 { font-family: Georgia, serif; font-size: 14pt; font-weight: normal; font-style: italic; margin-top: 2em; margin-bottom: 1em; padding-bottom: 0.25em; border-bottom: 1px solid #ccc; }
p { margin-bottom: 0.85em; text-align: justify; text-indent: 1.5em; }
p.first, h2 + p { text-indent: 0; }
.section-break { text-align: center; margin: 1.5em 0; font-size: 14pt; letter-spacing: 0.5em; color: #666; }
.cmo-box { margin: 2em 0; padding: 1.25em; border: 2px solid #333; background: #fafafa; }
.cmo-box-title { font-size: 10pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1em; padding-bottom: 0.5em; border-bottom: 1px solid #ccc; }
.cmo-box p { text-indent: 0; font-size: 10.5pt; margin-bottom: 0.75em; }
.takeaways { margin: 2em 0; padding: 1.25em; border: 2px solid #333; }
.takeaways-title { font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1em; }
.takeaways ul { margin: 0; padding-left: 1.25em; }
.takeaways li { margin-bottom: 0.5em; font-size: 10.5pt; }
"""

def text_to_html(text, chapter_num, title, pragmatic):
    # Clean up text
    text = text.replace('—', '—').replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    
    # Remove header/footer lines
    text = re.sub(r'The Future of Product Marketing — O.Hara & Yu\s*', '', text)
    text = re.sub(r'DRAFT MANUSCRIPT — \d+\s*', '', text)
    text = re.sub(r'Figure \d+:.*?\n', '', text)
    
    # Split into paragraphs
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    
    html_parts = []
    in_cmo = False
    in_takeaways = False
    first_para = True
    
    for para in paras:
        para = para.replace('\n', ' ').strip()
        if not para:
            continue
            
        # Skip the chapter title line since we handle it separately
        if para.startswith('Chapter ') and chapter_num in para:
            continue
        if para == title:
            continue
        if para.startswith('Pragmatic Remix:'):
            continue
            
        # Section breaks
        if para == '• • •':
            html_parts.append('<div class="section-break">• • •</div>')
            continue
            
        # Headings
        if para.startswith('THE CMO PERSPECTIVE'):
            in_cmo = True
            html_parts.append('<div class="cmo-box"><div class="cmo-box-title">The CMO Perspective</div>')
            continue
        if para.startswith('KEY TAKEAWAYS'):
            if in_cmo:
                html_parts.append('</div>')
                in_cmo = False
            in_takeaways = True
            html_parts.append('<div class="takeaways"><div class="takeaways-title">Key Takeaways</div><ul>')
            continue
            
        # Takeaway items
        if in_takeaways:
            if para.startswith('•'):
                item = para[1:].strip()
                html_parts.append(f'<li>{item}</li>')
                continue
            else:
                html_parts.append('</ul></div>')
                in_takeaways = False
                
        # Check if it's a section heading (short, no period at end)
        if len(para) < 80 and not para.endswith('.') and not para.startswith('•'):
            if in_cmo:
                html_parts.append('</div>')
                in_cmo = False
            html_parts.append(f'<h2>{para}</h2>')
            first_para = True
            continue
            
        # Regular paragraph
        css_class = ' class="first"' if first_para else ''
        html_parts.append(f'<p{css_class}>{para}</p>')
        first_para = False
    
    # Close any open tags
    if in_cmo:
        html_parts.append('</div>')
    if in_takeaways:
        html_parts.append('</ul></div>')
    
    body = '\n'.join(html_parts)
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Chapter {chapter_num}: {title}</title>
<style>{CSS}</style>
</head>
<body>
<div class="chapter-opener">
  <div class="chapter-num">Chapter {chapter_num}</div>
  <h1>{title}</h1>
  <div class="pragmatic-remix">{pragmatic}</div>
</div>
{body}
</body>
</html>'''

chapters = [
    ('09', 'Nine', 'Launch Management at Machine Speed', 'Pragmatic Remix: Go-to-Market Strategy • Launch Plan • Marketing Plan • Event Support', 'ch09-only.txt'),
    ('10', 'Ten', 'Analyst Relations and the Influence Layer', 'Pragmatic Remix: Analyst Relations • Industry Relations • Influencer Relations', 'ch10-only.txt'),
    ('11', 'Eleven', 'The PMM Tech Stack: A Practitioner\'s Evaluation', 'Pragmatic Remix: Sales Tools • Marketing Plan • Competitive Landscape • Content Creation', 'ch11-only.txt'),
    ('12', 'Twelve', 'Skills That Survive: What AI Can\'t Touch (Yet)', 'Pragmatic Remix: Distinctive Competence • Innovation Games • Market Problems • Buying Process', 'ch12-only.txt'),
    ('13', 'Thirteen', 'Team Structure and Hiring for the Agentic Org', 'Pragmatic Remix: All 37 Activities • Organizational Design • Talent Strategy', 'ch13-only.txt'),
]

for num, word, title, pragmatic, txtfile in chapters:
    print(f"Processing Chapter {num}...")
    with open(txtfile, 'r') as f:
        text = f.read()
    
    html = text_to_html(text, word, title, pragmatic)
    
    html_file = f'chapter-{num}-full.html'
    pdf_file = f'chapter-{num}-full.pdf'
    
    with open(html_file, 'w') as f:
        f.write(html)
    
    subprocess.run([
        'wkhtmltopdf', '--enable-local-file-access',
        '--page-size', 'Letter',
        '--margin-top', '20mm', '--margin-bottom', '20mm',
        '--margin-left', '22mm', '--margin-right', '22mm',
        '--encoding', 'UTF-8',
        html_file, pdf_file
    ], capture_output=True)
    
    print(f"  Created {pdf_file}")

print("\nDone!")
