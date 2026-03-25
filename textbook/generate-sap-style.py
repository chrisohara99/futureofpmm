#!/usr/bin/env python3
"""
Generate textbook chapter PDFs with SAP-style formatting:
- Dark navy header (#44546A)
- SAP orange accents (#ED7D31)
- Blue (#4472C4) for secondary elements
- Light gray (#E7E6E6) backgrounds
- Arial fonts
"""
import subprocess
import re
import sys

# SAP Template Colors
NAVY = "#44546A"
ORANGE = "#ED7D31"
BLUE = "#4472C4"
LIGHT_GRAY = "#E7E6E6"
GOLD = "#FFC000"
DARK_TEXT = "#2B3A4A"

CSS = f"""
@page {{ size: letter; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: Arial, 'Helvetica Neue', sans-serif; font-size: 10.5pt; line-height: 1.7; color: {DARK_TEXT}; }}

/* Header bar */
.header-bar {{
  background: {NAVY};
  padding: 0.6in 0.85in;
  margin-bottom: 0;
}}
.header-inner {{
  display: flex;
  justify-content: space-between;
  align-items: center;
}}
.site-title {{
  color: white;
  font-size: 11pt;
  font-weight: bold;
  letter-spacing: 0.05em;
}}
.authors {{
  color: rgba(255,255,255,0.8);
  font-size: 9pt;
}}

/* Chapter hero */
.chapter-hero {{
  background: linear-gradient(135deg, {BLUE} 0%, #5B9BD5 50%, {BLUE} 100%);
  padding: 1in 0.85in;
  color: white;
}}
.chapter-tag {{
  display: inline-block;
  background: {ORANGE};
  color: white;
  font-size: 9pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 0.3em 0.8em;
  margin-bottom: 0.75em;
}}
.chapter-title {{
  font-size: 28pt;
  font-weight: bold;
  line-height: 1.15;
  margin-bottom: 0.5em;
}}
.chapter-subtitle {{
  font-size: 12pt;
  color: rgba(255,255,255,0.9);
  font-style: italic;
}}

/* Main content */
.main-content {{
  padding: 0.75in 0.85in;
  max-width: 100%;
}}

/* Executive summary box */
.exec-summary {{
  background: {LIGHT_GRAY};
  padding: 1em 1.25em;
  margin-bottom: 1.5em;
  border-left: 4px solid {ORANGE};
}}
.exec-summary-title {{
  font-size: 11pt;
  font-weight: bold;
  color: {NAVY};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.5em;
}}
.exec-summary p {{
  font-size: 10.5pt;
  margin: 0;
  text-indent: 0;
}}

/* Section headings */
h2 {{
  font-size: 14pt;
  font-weight: bold;
  color: {NAVY};
  margin-top: 1.75em;
  margin-bottom: 0.75em;
  padding-bottom: 0.3em;
  border-bottom: 2px solid {ORANGE};
}}

/* Paragraphs */
p {{
  margin-bottom: 0.9em;
  text-align: justify;
}}

/* Pull quote */
blockquote {{
  margin: 1.5em 0;
  padding: 1em 1.25em;
  background: linear-gradient(135deg, {NAVY} 0%, {BLUE} 100%);
  color: white;
  font-size: 12pt;
  font-style: italic;
  line-height: 1.5;
  border-radius: 4px;
}}
blockquote::before {{
  content: '"';
  font-size: 28pt;
  color: {ORANGE};
  float: left;
  margin-right: 0.2em;
  margin-top: -0.1em;
  line-height: 1;
}}

/* CMO Perspective box */
.cmo-box {{
  margin: 1.5em 0;
  padding: 1.25em;
  background: white;
  border: 2px solid {NAVY};
  border-radius: 4px;
}}
.cmo-box-title {{
  font-size: 10pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: {NAVY};
  margin-bottom: 0.75em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid {LIGHT_GRAY};
}}
.cmo-box p {{
  text-indent: 0;
  font-size: 10pt;
  margin-bottom: 0.6em;
}}

/* Key Takeaways / Deliverables */
.takeaways {{
  margin: 1.5em 0;
  padding: 1.25em;
  background: {LIGHT_GRAY};
  border-left: 4px solid {ORANGE};
}}
.takeaways-title {{
  font-size: 11pt;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: {NAVY};
  margin-bottom: 0.75em;
}}
.takeaways ul, .takeaways ol {{
  margin: 0;
  padding-left: 1.5em;
}}
.takeaways li {{
  margin-bottom: 0.4em;
  font-size: 10pt;
}}

/* Figure placeholder */
.figure {{
  margin: 1.5em 0;
  text-align: center;
  padding: 1em;
  background: {LIGHT_GRAY};
  border-radius: 4px;
}}
.figure-caption {{
  font-size: 9pt;
  font-style: italic;
  color: #666;
  margin-top: 0.5em;
}}

/* Footer */
.footer {{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: {NAVY};
  color: white;
  padding: 0.4em 0.85in;
  font-size: 8pt;
  text-align: center;
}}
"""

def text_to_html(text, chapter_num, title, pragmatic, funnel=None):
    # Clean up text
    text = text.replace('—', '—').replace('"', '"').replace('"', '"')
    text = text.replace(''', "'").replace(''', "'")
    
    # Extract executive summary if present
    exec_summary = ""
    if "Executive summary" in text or "EXECUTIVE SUMMARY" in text.upper():
        match = re.search(r'(?:Executive summary|EXECUTIVE SUMMARY)[:\s]*(.+?)(?=\n\n[A-Z]|\n\nThe |\n\nWhen )', text, re.DOTALL | re.IGNORECASE)
        if match:
            exec_summary = match.group(1).strip().replace('\n', ' ')
    
    # Extract blockquote if present
    blockquote = ""
    quote_match = re.search(r'"([^"]{80,})"', text)
    if quote_match:
        blockquote = quote_match.group(1)
    
    # Remove header/footer lines
    text = re.sub(r'The Future of Product Marketing — O.Hara & Yu\s*', '', text)
    text = re.sub(r'DRAFT MANUSCRIPT — \d+\s*', '', text)
    text = re.sub(r'Figure \d+:.*?\n', '', text)
    text = re.sub(r'Executive summary.*?\n\n', '', text, flags=re.IGNORECASE)
    
    # Split into paragraphs
    paras = [p.strip() for p in text.split('\n\n') if p.strip()]
    
    html_parts = []
    in_cmo = False
    in_takeaways = False
    in_deliverables = False
    quote_added = False
    
    for i, para in enumerate(paras):
        para = para.replace('\n', ' ').strip()
        if not para:
            continue
            
        # Skip the chapter title line
        if para.startswith('Chapter ') and any(w in para for w in ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen']):
            continue
        if para == title:
            continue
        if para.startswith('Pragmatic Remix:'):
            continue
        if para.startswith('Funnel Stage:'):
            continue
            
        # Section breaks
        if para == '• • •':
            continue
            
        # Headings
        if para.startswith('THE CMO PERSPECTIVE') or para == 'The CMO Perspective':
            in_cmo = True
            html_parts.append('<div class="cmo-box"><div class="cmo-box-title">The CMO Perspective</div>')
            continue
        if 'KEY TAKEAWAYS' in para.upper() or 'TAKEAWAYS' == para.upper():
            if in_cmo:
                html_parts.append('</div>')
                in_cmo = False
            in_takeaways = True
            html_parts.append('<div class="takeaways"><div class="takeaways-title">Key Takeaways</div><ul>')
            continue
        if 'DELIVERABLES' in para.upper() or para.startswith('Chapter ') and 'deliverables' in para.lower():
            if in_cmo:
                html_parts.append('</div>')
                in_cmo = False
            if in_takeaways:
                html_parts.append('</ul></div>')
                in_takeaways = False
            in_deliverables = True
            html_parts.append('<div class="takeaways"><div class="takeaways-title">Chapter Deliverables</div><ol>')
            continue
            
        # List items
        if in_takeaways or in_deliverables:
            if para.startswith('•') or para.startswith('-'):
                item = para.lstrip('•-').strip()
                html_parts.append(f'<li>{item}</li>')
                continue
            elif re.match(r'^\d+\.', para):
                item = re.sub(r'^\d+\.\s*', '', para)
                html_parts.append(f'<li>{item}</li>')
                continue
            else:
                if in_takeaways:
                    html_parts.append('</ul></div>')
                    in_takeaways = False
                if in_deliverables:
                    html_parts.append('</ol></div>')
                    in_deliverables = False
                
        # Check if it's a section heading (short, no period at end, looks like title)
        if len(para) < 80 and not para.endswith('.') and not para.startswith('•') and not para.startswith('-'):
            if in_cmo:
                html_parts.append('</div>')
                in_cmo = False
            html_parts.append(f'<h2>{para}</h2>')
            
            # Add blockquote after first section
            if blockquote and not quote_added and len(html_parts) > 3:
                html_parts.append(f'<blockquote>{blockquote}</blockquote>')
                quote_added = True
            continue
            
        # Regular paragraph
        html_parts.append(f'<p>{para}</p>')
    
    # Close any open tags
    if in_cmo:
        html_parts.append('</div>')
    if in_takeaways:
        html_parts.append('</ul></div>')
    if in_deliverables:
        html_parts.append('</ol></div>')
    
    body = '\n'.join(html_parts)
    
    # Build executive summary section
    exec_html = ""
    if exec_summary:
        exec_html = f'''<div class="exec-summary">
  <div class="exec-summary-title">Executive Summary</div>
  <p>{exec_summary}</p>
</div>'''
    
    funnel_text = f" | {funnel}" if funnel else ""
    
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Chapter {chapter_num}: {title}</title>
<style>{CSS}</style>
</head>
<body>

<div class="header-bar">
  <div class="header-inner">
    <span class="site-title">THE FUTURE OF PRODUCT MARKETING</span>
    <span class="authors">Chris O'Hara & Dan Yu | futureofpmm.com</span>
  </div>
</div>

<div class="chapter-hero">
  <div class="chapter-tag">Chapter {chapter_num}</div>
  <div class="chapter-title">{title}</div>
  <div class="chapter-subtitle">{pragmatic}{funnel_text}</div>
</div>

<div class="main-content">
{exec_html}
{body}
</div>

</body>
</html>'''


def generate_pdf(html_file, pdf_file):
    """Generate PDF from HTML using wkhtmltopdf"""
    subprocess.run([
        'wkhtmltopdf', '--enable-local-file-access',
        '--page-size', 'Letter',
        '--margin-top', '0', '--margin-bottom', '0',
        '--margin-left', '0', '--margin-right', '0',
        '--encoding', 'UTF-8',
        '--disable-smart-shrinking',
        html_file, pdf_file
    ], capture_output=True)


if __name__ == '__main__':
    # Chapter 1 content - embedded for single file generation
    chapter_content = """Chapter One

The Old Playbook Is Dead

The agentic era didn't accelerate the old B2B playbook — it ended it. Product lifecycles run in continuous deployment. Buyers consume content through AI intermediaries. GEO has replaced SEO. The funnel is no longer a funnel. This chapter establishes the foundational thesis for the entire curriculum.

Executive summary
The agentic era didn't accelerate the old B2B playbook — it ended it. Product lifecycles run in continuous deployment. Buyers consume content through AI intermediaries. GEO has replaced SEO. The funnel is no longer a funnel. This chapter establishes the foundational thesis for the entire curriculum.

The buyer journey compression

When an AI agent compresses six weeks of buyer research into ninety seconds, the PMM's job is no longer to nurture leads through sequential stages. It's to ensure your product is represented in the data layer that agents access at the moment of evaluation.

The traditional funnel assumed a linear journey: awareness, consideration, decision. Each stage had its content, its metrics, its playbook. Marketing qualified leads flowed to sales qualified leads flowed to opportunities. The entire GTM apparatus was built on this architecture.

But agents don't follow funnels. They synthesize information across sources simultaneously. A procurement agent evaluating cloud infrastructure vendors doesn't read your blog post series in sequence. It ingests your entire digital presence — documentation, pricing pages, customer reviews, analyst reports, GitHub repositories — and generates a comparative analysis in seconds.

"The 10x PMM is not the one with the best prompt library. It is the one who has fundamentally rewired how they think about markets, products, and customers."

The Visibility Gap

The visibility gap is the delta between what AI agents can access and process versus what remains invisible to them. Most B2B marketing assets — the elaborate nurture sequences, the gated content, the personalized ABM campaigns — exist in the invisible zone.

Agents can't fill out forms. They don't click through email sequences. They don't attend webinars. The content that many marketing organizations spent years perfecting is becoming structurally inaccessible to the new buyer journey.

From SEO to GEO

Search engine optimization assumed humans would search, scan, and click. Generative engine optimization assumes AI will ingest, synthesize, and cite. The mechanics are fundamentally different.

SEO optimized for ranking. GEO optimizes for citation. SEO cared about keywords and backlinks. GEO cares about structured data, factual accuracy, and authoritative sourcing. SEO competed for the first page. GEO competes for inclusion in the training data and retrieval corpus.

The audit is straightforward: open Claude, ChatGPT, or Perplexity, and ask it to evaluate vendors in your product category. That sixty-second exercise will tell you more about your GEO readiness than any consultant's report.

Chapter 1 deliverables
1. Old vs. new playbook diagnostic — Map your current GTM against its agentic-era equivalent.
2. GEO audit — Run 5+ evaluation queries across AI assistants. Score visibility 0–5.
3. Content survivability assessment — Inventory top 20 assets. Score as agent-readable, agent-adjacent, or invisible.
4. 10x PMM self-assessment scorecard — Score across 10 dimensions. Design 30-day upskilling plan.
"""

    html = text_to_html(
        chapter_content,
        "1",
        "The Old Playbook Is Dead",
        "Pragmatic Remix: All 37 Boxes (Reframed)",
        "Funnel Stage: Foundational"
    )
    
    html_file = 'chapter-01-sap.html'
    pdf_file = 'chapter-01-sap.pdf'
    
    with open(html_file, 'w') as f:
        f.write(html)
    
    generate_pdf(html_file, pdf_file)
    print(f"Created {pdf_file}")
