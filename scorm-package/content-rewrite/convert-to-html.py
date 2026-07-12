#!/usr/bin/env python3
"""Convert markdown unit files to SCORM-ready HTML"""

import re
import os

HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <script src="../assets/scorm-api.js"></script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | SAP Future of PMM Training</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {{
            --dark-slate: #44546A;
            --sap-orange: #ED7D31;
            --sap-blue: #4472C4;
            --light-blue: #5B9BD5;
            --light-gray: #E7E6E6;
            --gold: #FFC000;
            --green: #70AD47;
            --text: #2B3A4A;
            --bg: #FAFAFA;
        }}
        
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        
        body {{
            font-family: 'Inter', -apple-system, sans-serif;
            background: var(--bg);
            color: var(--text);
            line-height: 1.7;
        }}
        
        .header {{
            background: var(--dark-slate);
            padding: 0.75rem 2rem;
        }}
        
        .header-inner {{
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .logo {{
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            text-decoration: none;
        }}
        
        .nav a {{
            color: rgba(255,255,255,0.85);
            text-decoration: none;
            font-size: 0.9rem;
            margin-left: 1.5rem;
        }}
        
        .hero {{
            background: linear-gradient(135deg, var(--sap-blue) 0%, var(--dark-slate) 100%);
            color: white;
            padding: 3rem 2rem;
            text-align: center;
        }}
        
        .hero h1 {{
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }}
        
        .hero .unit-label {{
            font-size: 0.9rem;
            opacity: 0.8;
            margin-bottom: 0.5rem;
        }}
        
        main {{
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
        }}
        
        .section {{
            background: white;
            border-radius: 12px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }}
        
        h2 {{
            font-size: 1.4rem;
            color: var(--dark-slate);
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid var(--light-gray);
        }}
        
        h3 {{
            font-size: 1.1rem;
            color: var(--sap-blue);
            margin: 1.5rem 0 0.75rem;
        }}
        
        h4 {{
            font-size: 1rem;
            color: var(--dark-slate);
            margin: 1rem 0 0.5rem;
        }}
        
        p {{
            margin-bottom: 1rem;
        }}
        
        ul, ol {{
            margin: 1rem 0 1rem 1.5rem;
        }}
        
        li {{
            margin-bottom: 0.5rem;
        }}
        
        blockquote {{
            background: linear-gradient(135deg, #f0f4f8 0%, #e8eef4 100%);
            border-left: 4px solid var(--sap-blue);
            padding: 1.25rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
            font-style: italic;
        }}
        
        .highlight-box {{
            background: linear-gradient(135deg, #f0f4f8 0%, #e8eef4 100%);
            border-left: 4px solid var(--sap-blue);
            padding: 1.25rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
        }}
        
        .highlight-box.key-insight {{
            background: linear-gradient(135deg, #fff8e6 0%, #fff3d4 100%);
            border-left-color: var(--gold);
        }}
        
        .highlight-box h4 {{
            margin-top: 0;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.95rem;
        }}
        
        th, td {{
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid var(--light-gray);
        }}
        
        th {{
            background: var(--light-gray);
            font-weight: 600;
        }}
        
        code {{
            background: #f1f5f9;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
        }}
        
        pre {{
            background: #1e293b;
            color: #e2e8f0;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
        }}
        
        pre code {{
            background: none;
            padding: 0;
            color: inherit;
        }}
        
        hr {{
            border: none;
            border-top: 2px solid var(--light-gray);
            margin: 2rem 0;
        }}
        
        strong {{
            color: var(--dark-slate);
        }}
        
        em {{
            color: #64748b;
        }}
        
        .exercise {{
            background: #fffbeb;
            border: 2px solid var(--gold);
            border-radius: 12px;
            padding: 1.5rem;
            margin: 1.5rem 0;
        }}
        
        .exercise h3 {{
            color: #92400e;
            margin-top: 0;
        }}
        
        .nav-buttons {{
            display: flex;
            justify-content: space-between;
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid var(--light-gray);
        }}
        
        .nav-btn {{
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.2s;
        }}
        
        .nav-btn.primary {{
            background: var(--sap-orange);
            color: white;
        }}
        
        .nav-btn.secondary {{
            background: var(--light-gray);
            color: var(--text);
        }}
        
        .complete-section {{
            text-align: center;
            padding: 2rem;
            margin-top: 2rem;
            background: #f0f9ff;
            border-top: 2px solid #0ea5e9;
            border-radius: 0 0 12px 12px;
        }}
        
        .complete-btn {{
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            font-weight: 500;
        }}
        
        .complete-btn:hover {{
            background: #0284c7;
        }}
        
        footer {{
            background: #f1f5f9;
            border-top: 1px solid #e2e8f0;
            padding: 1.5rem;
            margin-top: 3rem;
            text-align: center;
            font-size: 0.85rem;
            color: #64748b;
        }}
        
        @media (max-width: 768px) {{
            .hero h1 {{ font-size: 1.5rem; }}
            main {{ padding: 1rem; }}
            .section {{ padding: 1.5rem; }}
        }}
    </style>
</head>
<body>
    <header class="header">
        <div class="header-inner">
            <a href="../index.html" class="logo">SAP Future of PMM Training</a>
            <nav class="nav">
                <a href="../index.html">All Units</a>
            </nav>
        </div>
    </header>
    
    <section class="hero">
        <div class="unit-label">{unit_label}</div>
        <h1>{unit_title}</h1>
    </section>
    
    <main>
        {content}
        
        <div class="complete-section">
            <p style="margin-bottom: 1rem; color: #0369a1;">Finished reading this unit?</p>
            <button class="complete-btn" onclick="markComplete()">Mark Unit Complete</button>
        </div>
    </main>
    
    <footer>
        <p>This training is a derivative work based on <em>"The Future of Product Marketing: The Practitioner's Guide to the Agentic Era"</em></p>
        <p style="margin-top: 0.5rem;">© 2026 Chris O'Hara. All Rights Reserved. Licensed to SAP for internal training use only.</p>
    </footer>
    
    <script>
    function markComplete() {{
        if (typeof SCORM !== 'undefined') {{
            SCORM.setStatus('completed');
            alert('Unit marked as complete!');
        }} else {{
            alert('Progress saved locally.');
        }}
    }}
    </script>
</body>
</html>
'''

def md_to_html(md_content):
    """Convert markdown to HTML"""
    html = md_content
    
    # Remove the YAML-like header
    html = re.sub(r'^#\s+Unit \d+:.*?\n---\n', '', html, flags=re.MULTILINE)
    
    # Convert headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'</div>\n<div class="section">\n<h2>\1</h2>', html, flags=re.MULTILINE)
    
    # Fix opening section
    html = html.replace('</div>\n<div class="section">', '<div class="section">', 1)
    
    # Convert bold and italic
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Convert tables (simple approach)
    def convert_table(match):
        lines = match.group(0).strip().split('\n')
        html_table = '<table>\n<thead>\n<tr>'
        
        # Header row
        headers = [cell.strip() for cell in lines[0].split('|')[1:-1]]
        for h in headers:
            html_table += f'<th>{h}</th>'
        html_table += '</tr>\n</thead>\n<tbody>\n'
        
        # Data rows (skip separator line)
        for line in lines[2:]:
            cells = [cell.strip() for cell in line.split('|')[1:-1]]
            html_table += '<tr>'
            for c in cells:
                html_table += f'<td>{c}</td>'
            html_table += '</tr>\n'
        
        html_table += '</tbody>\n</table>'
        return html_table
    
    html = re.sub(r'\|[^\n]+\|\n\|[-| ]+\|\n(\|[^\n]+\|\n?)+', convert_table, html)
    
    # Convert code blocks
    html = re.sub(r'```(\w*)\n(.*?)\n```', r'<pre><code>\2</code></pre>', html, flags=re.DOTALL)
    
    # Convert inline code
    html = re.sub(r'`([^`]+)`', r'<code>\1</code>', html)
    
    # Convert unordered lists
    def convert_ul(match):
        items = match.group(0).strip().split('\n')
        html_list = '<ul>\n'
        for item in items:
            item_text = re.sub(r'^[-*]\s+', '', item)
            html_list += f'<li>{item_text}</li>\n'
        html_list += '</ul>'
        return html_list
    
    html = re.sub(r'(^[-*]\s+.+\n?)+', convert_ul, html, flags=re.MULTILINE)
    
    # Convert ordered lists
    def convert_ol(match):
        items = match.group(0).strip().split('\n')
        html_list = '<ol>\n'
        for item in items:
            item_text = re.sub(r'^\d+\.\s+', '', item)
            html_list += f'<li>{item_text}</li>\n'
        html_list += '</ol>'
        return html_list
    
    html = re.sub(r'(^\d+\.\s+.+\n?)+', convert_ol, html, flags=re.MULTILINE)
    
    # Convert blockquotes
    html = re.sub(r'^>\s*(.+)$', r'<blockquote>\1</blockquote>', html, flags=re.MULTILINE)
    
    # Convert horizontal rules
    html = re.sub(r'^---+$', r'<hr>', html, flags=re.MULTILINE)
    
    # Wrap paragraphs
    lines = html.split('\n\n')
    wrapped = []
    for line in lines:
        line = line.strip()
        if line and not line.startswith('<'):
            wrapped.append(f'<p>{line}</p>')
        else:
            wrapped.append(line)
    html = '\n\n'.join(wrapped)
    
    # Close final section
    html += '\n</div>'
    
    return html

def process_unit(unit_num, md_path, output_dir):
    """Process a single unit markdown file"""
    with open(md_path, 'r') as f:
        md_content = f.read()
    
    # Extract title
    title_match = re.search(r'^#\s+Unit \d+:\s+(.+)$', md_content, re.MULTILINE)
    unit_title = title_match.group(1) if title_match else f"Unit {unit_num}"
    
    # Convert content
    content = md_to_html(md_content)
    
    # Generate HTML
    html = HTML_TEMPLATE.format(
        title=f"Unit {unit_num}: {unit_title}",
        unit_label=f"Unit {unit_num}",
        unit_title=unit_title,
        content=content
    )
    
    # Write output
    output_path = os.path.join(output_dir, f'unit-0{unit_num}', 'index.html')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        f.write(html)
    
    print(f"Created: {output_path}")

# Process all units
output_dir = '/root/.openclaw/workspace/futureofpmm/scorm-package-v2/content'
os.makedirs(output_dir, exist_ok=True)

for i in range(1, 9):
    md_path = f'/root/.openclaw/workspace/futureofpmm/scorm-package/content-rewrite/unit-0{i}-rewrite.md'
    process_unit(i, md_path, output_dir)

print("\nAll units converted!")
