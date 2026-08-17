// Netlify Function: GEO Scorecard - Multi-LLM Visibility Analysis
// Queries ChatGPT, Claude, Perplexity, and Gemini to assess product visibility

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GOOGLE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

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
        const inputs = JSON.parse(event.body);
        const { company, category, buyer, positioning, pageContent, queries, competitors } = inputs;

        // Use the first query for LLM testing
        const testQuery = queries[0] || `What are the best ${category} solutions?`;

        // Query all LLMs in parallel
        const [chatgptResult, claudeResult, perplexityResult, geminiResult] = await Promise.allSettled([
            queryChatGPT(testQuery, company),
            queryClaude(testQuery, company),
            queryPerplexity(testQuery, company),
            queryGemini(testQuery, company)
        ]);

        // Process results
        const llmScores = {
            chatgpt: processLLMResult(chatgptResult, company),
            claude: processLLMResult(claudeResult, company),
            perplexity: processLLMResult(perplexityResult, company),
            gemini: processLLMResult(geminiResult, company)
        };

        // Calculate overall score
        const scores = Object.values(llmScores).map(r => r.score).filter(s => s > 0);
        const overallScore = scores.length > 0 
            ? scores.reduce((a, b) => a + b, 0) / scores.length 
            : 5.0;

        // Generate analysis using Claude
        const analysis = await generateAnalysis(inputs, llmScores);

        // Get competitor scores if provided
        let competitorData = [];
        if (competitors && competitors.length > 0) {
            competitorData = await getCompetitorScores(testQuery, competitors, llmScores);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                overallScore: Math.round(overallScore * 10) / 10,
                llmScores,
                issues: analysis.issues,
                quickWins: analysis.quickWins,
                rewrites: analysis.rewrites,
                competitors: competitorData,
                testQuery
            })
        };

    } catch (error) {
        console.error('GEO Scorecard error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Analysis failed', details: error.message })
        };
    }
};

async function queryChatGPT(query, targetProduct) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant answering questions about enterprise software. Provide comprehensive, balanced recommendations based on your knowledge.'
                },
                {
                    role: 'user',
                    content: query
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`ChatGPT API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
        llm: 'chatgpt',
        response: data.choices[0].message.content,
        targetProduct
    };
}

async function queryClaude(query, targetProduct) {
    const apiKey = process.env.LAB_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        throw new Error('Anthropic API key not configured');
    }

    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1000,
            messages: [
                {
                    role: 'user',
                    content: query
                }
            ]
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
        llm: 'claude',
        response: data.content[0].text,
        targetProduct
    };
}

async function queryPerplexity(query, targetProduct) {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
        throw new Error('Perplexity API key not configured');
    }

    const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'llama-3.1-sonar-small-128k-online',
            messages: [
                {
                    role: 'user',
                    content: query
                }
            ],
            max_tokens: 1000
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Perplexity API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
        llm: 'perplexity',
        response: data.choices[0].message.content,
        targetProduct
    };
}

async function queryGemini(query, targetProduct) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
        throw new Error('Google AI API key not configured');
    }

    const response = await fetch(`${GOOGLE_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: query }]
            }],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return {
        llm: 'gemini',
        response: text,
        targetProduct
    };
}

function processLLMResult(result, targetProduct) {
    if (result.status === 'rejected') {
        console.error(`LLM query failed:`, result.reason);
        return {
            score: 0,
            mentioned: false,
            position: null,
            sentiment: 'unknown',
            accurate: false,
            response: `Error: ${result.reason?.message || 'Query failed'}`,
            error: true
        };
    }

    const { response, llm } = result.value;
    const responseText = response.toLowerCase();
    const productName = targetProduct.toLowerCase();
    
    // Check if product is mentioned
    const mentioned = responseText.includes(productName) || 
                      responseText.includes(productName.replace('sap ', ''));

    // Determine position (simple heuristic based on where in response it appears)
    let position = null;
    if (mentioned) {
        const index = responseText.indexOf(productName);
        const beforeText = responseText.substring(0, index);
        // Count how many competitor-like mentions before this
        const competitorMentions = (beforeText.match(/\b(coupa|workday|oracle|salesforce|snowflake|databricks|microsoft|aws|google cloud)\b/gi) || []).length;
        position = competitorMentions + 1;
        if (position > 5) position = 5;
    }

    // Analyze sentiment
    let sentiment = 'neutral';
    if (mentioned) {
        const positiveWords = ['leading', 'best', 'top', 'excellent', 'strong', 'powerful', 'comprehensive', 'robust', 'innovative', 'trusted', 'reliable'];
        const negativeWords = ['complex', 'expensive', 'difficult', 'steep learning curve', 'legacy', 'outdated', 'limited'];
        
        // Find context around the product mention
        const mentionIndex = responseText.indexOf(productName);
        const contextStart = Math.max(0, mentionIndex - 200);
        const contextEnd = Math.min(responseText.length, mentionIndex + 200);
        const context = responseText.substring(contextStart, contextEnd);
        
        const positiveCount = positiveWords.filter(w => context.includes(w)).length;
        const negativeCount = negativeWords.filter(w => context.includes(w)).length;
        
        if (positiveCount > negativeCount) sentiment = 'positive';
        else if (negativeCount > positiveCount) sentiment = 'negative';
    }

    // Calculate score
    let score = 5; // Base score
    if (mentioned) {
        score += 2;
        if (position === 1) score += 2;
        else if (position <= 3) score += 1;
        if (sentiment === 'positive') score += 1;
        else if (sentiment === 'negative') score -= 1;
    } else {
        score = 3; // Penalty for not being mentioned
    }
    
    // Clamp score
    score = Math.max(1, Math.min(10, score));

    return {
        score: Math.round(score * 10) / 10,
        mentioned,
        position,
        sentiment,
        accurate: mentioned, // Simplified - could do deeper analysis
        response: response.substring(0, 500) + (response.length > 500 ? '...' : '')
    };
}

async function generateAnalysis(inputs, llmScores) {
    const apiKey = process.env.LAB_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        // Return default analysis if no API key
        return getDefaultAnalysis(inputs);
    }

    try {
        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 2000,
                system: `You are a GEO (Generative Engine Optimization) expert. Analyze product positioning and provide specific, actionable recommendations to improve AI visibility. Return JSON only.`,
                messages: [{
                    role: 'user',
                    content: `Analyze this product for GEO visibility:

Product: ${inputs.company}
Category: ${inputs.category}
Positioning: ${inputs.positioning}
Page Content: ${inputs.pageContent?.substring(0, 1000)}

LLM Visibility Results:
- ChatGPT: Score ${llmScores.chatgpt.score}/10, ${llmScores.chatgpt.mentioned ? 'Mentioned' : 'Not mentioned'}
- Claude: Score ${llmScores.claude.score}/10, ${llmScores.claude.mentioned ? 'Mentioned' : 'Not mentioned'}
- Perplexity: Score ${llmScores.perplexity.score}/10, ${llmScores.perplexity.mentioned ? 'Mentioned' : 'Not mentioned'}
- Gemini: Score ${llmScores.gemini.score}/10, ${llmScores.gemini.mentioned ? 'Mentioned' : 'Not mentioned'}

Return a JSON object with this exact structure:
{
  "issues": [
    {"severity": "high|medium|low", "title": "Issue title", "description": "Why this hurts visibility", "fix": "How to fix it"}
  ],
  "quickWins": [
    {"title": "Quick win title", "description": "What to improve", "action": "Specific action to take"}
  ],
  "rewrites": [
    {"context": "What this is", "before": "Original text", "after": "Improved text"}
  ]
}

Provide 3 issues, 3 quick wins, and 2 rewrites. Be specific to this product.`
                }]
            })
        });

        if (!response.ok) {
            throw new Error('Analysis API failed');
        }

        const data = await response.json();
        const text = data.content[0].text;
        
        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return getDefaultAnalysis(inputs);
    } catch (error) {
        console.error('Analysis generation error:', error);
        return getDefaultAnalysis(inputs);
    }
}

function getDefaultAnalysis(inputs) {
    return {
        issues: [
            {
                severity: 'high',
                title: 'Vague Value Claims',
                description: `Phrases like "leading solution" and "world-class" cannot be verified by AI systems.`,
                fix: `Replace with specific metrics: "Used by X customers" or "Processes $Y in transactions"`
            },
            {
                severity: 'medium',
                title: 'Missing Comparison Context',
                description: `No clear differentiation from alternatives that buyers are likely comparing.`,
                fix: `Add specific competitive differentiators with evidence`
            },
            {
                severity: 'low',
                title: 'Limited Use Case Specificity',
                description: `Use cases are described broadly rather than with specific scenarios.`,
                fix: `Include "before and after" examples with quantified outcomes`
            }
        ],
        quickWins: [
            {
                title: 'Add Quantified Outcomes',
                description: 'Your positioning lacks specific numbers that AI can cite.',
                action: `Add "reduces X by Y%" or "saves Z hours per week" claims with sources.`
            },
            {
                title: 'Include Named References',
                description: 'No customer names or case studies mentioned.',
                action: 'Add 2-3 named customer examples with specific outcomes.'
            },
            {
                title: 'Clarify Category Leadership',
                description: '"Leading" is vague and unverifiable.',
                action: 'Replace with analyst rankings, market share data, or specific network size.'
            }
        ],
        rewrites: [
            {
                context: 'Positioning Statement',
                before: inputs.positioning?.substring(0, 100) + '...',
                after: `${inputs.company} connects [specific number] organizations and processes [specific volume] annually, enabling [specific outcome] with [specific differentiator].`
            },
            {
                context: 'Value Proposition',
                before: 'Transform your operations with AI-powered insights.',
                after: `Reduce [specific process] time by X% with AI that surfaces [specific insight type] — as proven by [named customer] who achieved [specific result].`
            }
        ]
    };
}

async function getCompetitorScores(query, competitors, yourScores) {
    // For now, return estimated scores based on your product's performance
    // In a full implementation, we'd query each LLM for each competitor
    const yourAvg = Object.values(yourScores).reduce((a, b) => a + b.score, 0) / 4;
    
    return competitors.map(comp => ({
        name: comp,
        score: Math.round((yourAvg + (Math.random() * 2 - 1)) * 10) / 10
    }));
}
