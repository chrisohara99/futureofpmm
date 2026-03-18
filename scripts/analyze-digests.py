#!/usr/bin/env python3
"""
Analyze digest files to extract keywords, trends, sources, and generate dashboard data.
Outputs JSON for the trends dashboard.
"""

import os
import re
import json
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from html.parser import HTMLParser

# Keywords to track (AI + Marketing focused)
# Excluding 'PMM' and 'AI' as they're implicit in every search
TRACKED_TERMS = {
    # AI Companies
    'openai': 'OpenAI', 'anthropic': 'Anthropic', 'google': 'Google', 
    'microsoft': 'Microsoft', 'nvidia': 'NVIDIA', 'meta': 'Meta',
    'salesforce': 'Salesforce', 'hubspot': 'HubSpot', 'adobe': 'Adobe',
    'oracle': 'Oracle', 'workday': 'Workday', 'sap': 'SAP',
    
    # AI Concepts (excluding generic "AI")
    'agentic': 'Agentic', 'agent': 'Agents', 'agents': 'Agents',
    'llm': 'LLM', 'gpt': 'GPT', 'claude': 'Claude', 'copilot': 'Copilot',
    'automation': 'Automation', 'genai': 'GenAI', 'generative': 'Generative',
    
    # Marketing Terms (excluding generic "PMM" and "Marketing")
    'content': 'Content',
    'seo': 'SEO', 'geo': 'GEO', 'personalization': 'Personalization',
    'martech': 'MarTech', 'cdp': 'CDP', 'crm': 'CRM',
    
    # Business Terms
    'saas': 'SaaS', 'enterprise': 'Enterprise', 'b2b': 'B2B',
    'revenue': 'Revenue', 'roi': 'ROI', 'growth': 'Growth',
    
    # Emerging
    'mcp': 'MCP', 'rag': 'RAG', 'workflow': 'Workflow',
    'perplexity': 'Perplexity', 'gartner': 'Gartner',
}

# Stop words to ignore
STOP_WORDS = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
              'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
              'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 
              'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
              'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 
              'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'how', 'why',
              'when', 'where', 'all', 'each', 'every', 'both', 'few', 'more',
              'most', 'other', 'some', 'such', 'no', 'not', 'only', 'same', 'so',
              'than', 'too', 'very', 'just', 'also', 'now', 'new', 'one', 'two',
              'html', 'com', 'www', 'http', 'https', 'read', 'more', 'here'}


class HTMLTextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        
    def handle_data(self, data):
        self.text.append(data)
    
    def get_text(self):
        return ' '.join(self.text)


def extract_text_from_html(html_content):
    """Extract plain text from HTML."""
    parser = HTMLTextExtractor()
    parser.feed(html_content)
    return parser.get_text()


def extract_sources(html_content):
    """Extract source names from source-link anchors."""
    # Look for "Read on Source Name →" pattern
    pattern = r'Read on ([^→]+)→'
    matches = re.findall(pattern, html_content)
    # Clean up whitespace
    return [m.strip() for m in matches if m.strip()]


def extract_keywords(text):
    """Extract keywords from text."""
    # Lowercase and extract words
    words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
    
    # Count tracked terms
    tracked_counts = Counter()
    for word in words:
        if word in TRACKED_TERMS:
            tracked_counts[TRACKED_TERMS[word]] += 1
    
    # Count all meaningful words
    all_words = [w for w in words if w not in STOP_WORDS and len(w) > 3]
    word_counts = Counter(all_words)
    
    return tracked_counts, word_counts


def parse_date_from_filename(filename):
    """Extract date from filename like 2026-03-18.html"""
    match = re.match(r'(\d{4}-\d{2}-\d{2})\.html', filename)
    if match:
        return datetime.strptime(match.group(1), '%Y-%m-%d')
    return None


def calculate_wow_change(term_data, days=7):
    """Calculate week-over-week change for a term."""
    if len(term_data) < days * 2:
        return 0
    
    this_week = sum(d['count'] for d in term_data[-days:])
    last_week = sum(d['count'] for d in term_data[-days*2:-days])
    
    if last_week == 0:
        return 100 if this_week > 0 else 0
    
    return round(((this_week - last_week) / last_week) * 100, 1)


def analyze_digests(digests_dir):
    """Analyze all digest files."""
    results = {
        'generated_at': datetime.now().isoformat(),
        'total_digests': 0,
        'date_range': {'start': None, 'end': None},
        'word_cloud': [],  # Top 50 terms for word cloud
        'tracked_trends': {},  # Time series for tracked terms
        'rising_terms': [],  # Terms trending up week-over-week
        'falling_terms': [],  # Terms trending down
        'sources': [],  # Most common sources (leaderboard)
        'sources_weekly': {},  # Sources by week
    }
    
    # Track term frequency over time
    daily_tracked = defaultdict(lambda: Counter())
    daily_all = defaultdict(lambda: Counter())
    all_tracked = Counter()
    all_words = Counter()
    all_sources = Counter()
    weekly_sources = defaultdict(lambda: Counter())
    
    # Process each digest file
    digest_files = sorted([f for f in os.listdir(digests_dir) 
                          if f.endswith('.html') and f != 'index.html'])
    
    for filename in digest_files:
        date = parse_date_from_filename(filename)
        if not date:
            continue
            
        filepath = os.path.join(digests_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        text = extract_text_from_html(html_content)
        tracked, words = extract_keywords(text)
        sources = extract_sources(html_content)
        
        # Store daily counts
        date_str = date.strftime('%Y-%m-%d')
        week_str = date.strftime('%Y-W%W')
        daily_tracked[date_str] = tracked
        daily_all[date_str] = words
        
        # Aggregate totals
        all_tracked.update(tracked)
        all_words.update(words)
        all_sources.update(sources)
        weekly_sources[week_str].update(sources)
        
        results['total_digests'] += 1
        
        # Update date range
        if results['date_range']['start'] is None or date_str < results['date_range']['start']:
            results['date_range']['start'] = date_str
        if results['date_range']['end'] is None or date_str > results['date_range']['end']:
            results['date_range']['end'] = date_str
    
    # Build word cloud data (top 50 terms)
    results['word_cloud'] = [
        {'text': word, 'value': count}
        for word, count in all_tracked.most_common(50)
    ]
    
    # Build time series for top tracked terms
    top_terms = [term for term, _ in all_tracked.most_common(15)]
    for term in top_terms:
        results['tracked_trends'][term] = []
        for date_str in sorted(daily_tracked.keys()):
            results['tracked_trends'][term].append({
                'date': date_str,
                'count': daily_tracked[date_str].get(term, 0)
            })
    
    # Calculate 7-day rolling averages for smoother trends
    for term in results['tracked_trends']:
        data = results['tracked_trends'][term]
        for i in range(len(data)):
            start_idx = max(0, i - 6)
            window = data[start_idx:i+1]
            avg = sum(d['count'] for d in window) / len(window)
            data[i]['rolling_avg'] = round(avg, 2)
    
    # Calculate week-over-week changes
    term_changes = []
    for term in results['tracked_trends']:
        change = calculate_wow_change(results['tracked_trends'][term])
        term_changes.append({
            'term': term,
            'change': change,
            'total': all_tracked[term]
        })
    
    # Sort by change to find rising/falling
    term_changes.sort(key=lambda x: x['change'], reverse=True)
    results['rising_terms'] = [t for t in term_changes if t['change'] > 10][:5]
    results['falling_terms'] = [t for t in term_changes if t['change'] < -10][-5:]
    
    # Add change data to word cloud items
    change_map = {t['term']: t['change'] for t in term_changes}
    for item in results['word_cloud']:
        item['change'] = change_map.get(item['text'], 0)
    
    # Source leaderboard
    results['sources'] = [
        {'name': source, 'count': count}
        for source, count in all_sources.most_common(20)
    ]
    
    # Weekly source data (last 4 weeks)
    recent_weeks = sorted(weekly_sources.keys())[-4:]
    for week in recent_weeks:
        results['sources_weekly'][week] = [
            {'name': s, 'count': c}
            for s, c in weekly_sources[week].most_common(10)
        ]
    
    return results


def main():
    digests_dir = '/root/.openclaw/workspace/futureofpmm/dist/digests'
    output_file = '/root/.openclaw/workspace/futureofpmm/dist/digests/trends-data.json'
    
    print(f"Analyzing digests in {digests_dir}...")
    results = analyze_digests(digests_dir)
    
    print(f"Found {results['total_digests']} digests")
    print(f"Date range: {results['date_range']['start']} to {results['date_range']['end']}")
    print(f"Top terms: {[w['text'] for w in results['word_cloud'][:10]]}")
    print(f"Rising: {[t['term'] for t in results['rising_terms']]}")
    print(f"Top sources: {[s['name'] for s in results['sources'][:5]]}")
    
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"Wrote trends data to {output_file}")


if __name__ == '__main__':
    main()
