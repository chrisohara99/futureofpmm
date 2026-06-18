// Netlify Function: Fetch URL content and extract readable text
// Used by Content Localization lab

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        const { url } = JSON.parse(event.body);
        
        if (!url) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required' }) };
        }

        // Validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
            if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
                throw new Error('Invalid protocol');
            }
        } catch (e) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid URL format' }) };
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; SAP PMM Content Fetcher/1.0)',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            timeout: 10000
        });

        if (!response.ok) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` }) 
            };
        }

        const html = await response.text();
        
        // Extract readable content
        const content = extractContent(html);
        
        if (!content || content.trim().length < 50) {
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ error: 'Could not extract meaningful content from this URL' }) 
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                content: content.substring(0, 15000), // Limit to ~15k chars
                title: extractTitle(html),
                truncated: content.length > 15000
            })
        };

    } catch (error) {
        console.error('Fetch error:', error);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Failed to fetch content: ' + (error.message || 'Unknown error') }) 
        };
    }
};

function extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
}

function extractContent(html) {
    // Remove scripts, styles, and other non-content elements
    let text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '');
    
    // Try to find main content areas
    const mainMatch = text.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                      text.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                      text.match(/<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
    
    if (mainMatch) {
        text = mainMatch[1];
    } else {
        // Fall back to body content
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            text = bodyMatch[1];
        }
    }
    
    // Convert common elements to readable format
    text = text
        // Headings
        .replace(/<h1[^>]*>/gi, '\n# ')
        .replace(/<h2[^>]*>/gi, '\n## ')
        .replace(/<h3[^>]*>/gi, '\n### ')
        .replace(/<h4[^>]*>/gi, '\n#### ')
        .replace(/<\/h[1-6]>/gi, '\n')
        // Paragraphs and line breaks
        .replace(/<p[^>]*>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<hr\s*\/?>/gi, '\n---\n')
        // Lists
        .replace(/<li[^>]*>/gi, '\n• ')
        .replace(/<\/li>/gi, '')
        .replace(/<[uo]l[^>]*>/gi, '\n')
        .replace(/<\/[uo]l>/gi, '\n')
        // Bold and italic
        .replace(/<strong[^>]*>/gi, '**')
        .replace(/<\/strong>/gi, '**')
        .replace(/<b[^>]*>/gi, '**')
        .replace(/<\/b>/gi, '**')
        .replace(/<em[^>]*>/gi, '*')
        .replace(/<\/em>/gi, '*')
        .replace(/<i[^>]*>/gi, '*')
        .replace(/<\/i>/gi, '*')
        // Links - keep the text
        .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
        // Remove remaining tags
        .replace(/<[^>]+>/g, '')
        // Decode entities
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&rsquo;/gi, "'")
        .replace(/&lsquo;/gi, "'")
        .replace(/&rdquo;/gi, '"')
        .replace(/&ldquo;/gi, '"')
        .replace(/&mdash;/gi, '—')
        .replace(/&ndash;/gi, '–')
        .replace(/&bull;/gi, '•')
        // Clean up whitespace
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();
    
    return text;
}
