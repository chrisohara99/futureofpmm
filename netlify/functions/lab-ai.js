// Netlify Function: AI Lab Assistant
// Proxies requests to Claude API for interactive labs

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'API key not configured' }) 
        };
    }

    try {
        const { labType, inputs } = JSON.parse(event.body);
        
        // Build prompt based on lab type
        const systemPrompt = getSystemPrompt(labType);
        const userPrompt = buildUserPrompt(labType, inputs);

        const response = await fetch(ANTHROPIC_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Anthropic API error:', error);
            return { 
                statusCode: response.status, 
                headers, 
                body: JSON.stringify({ error: 'AI service error' }) 
            };
        }

        const data = await response.json();
        const content = data.content[0].text;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ result: content })
        };

    } catch (error) {
        console.error('Function error:', error);
        return { 
            statusCode: 500, 
            headers, 
            body: JSON.stringify({ error: 'Internal error' }) 
        };
    }
};

function getSystemPrompt(labType) {
    const prompts = {
        'geo-audit': `You are an expert in Generative Engine Optimization (GEO) - the discipline of optimizing content to be surfaced and cited by AI systems like ChatGPT, Claude, and Perplexity.

Your role is to analyze product/company information and evaluate how visible it would be to AI-assisted buyer research. You provide specific, actionable recommendations.

When analyzing, consider:
- Specificity vs vagueness of claims
- Presence of quantified outcomes and evidence
- Structured information that AI can parse
- Technical depth and verifiability
- Whether content answers specific buyer questions

Format your responses with clear sections, use markdown formatting, and be direct and actionable.`,

        'positioning-test': `You are an expert in B2B product positioning, specifically for the agentic era where AI agents evaluate vendors on behalf of buyers.

Your role is to analyze product pages and positioning as if you were an AI procurement agent. You identify:
- Vague claims that can't be verified
- Missing specificity that would cause an agent to hedge
- Gaps between marketing claims and documentation
- Opportunities to make positioning more agent-readable

Provide specific before/after rewrites and prioritized recommendations.`,

        'demo-narrative': `You are an expert in B2B product demos, specifically the transformation narrative approach.

Great demos aren't feature tours - they're transformation stories with:
1. Current State Pain (the prospect's world today)
2. Transformation Moment (introducing your solution)
3. Future State Resolution (their transformed life)

You help craft compelling demo narratives that make prospects FEEL what their life would be like using the product, not just understand what it does.`,

        'ci-brief': `You are an expert competitive intelligence analyst for B2B technology companies.

You help PMMs create living competitive intelligence by:
- Identifying key monitoring signals
- Structuring intelligence for quick consumption
- Highlighting strategic implications, not just facts
- Suggesting trap-setting questions for sales

Your briefs are concise, actionable, and focused on what sales needs to know TODAY.`,

        'content-audit': `You are an expert in B2B content strategy, specifically the three-layer content model:

1. Commodity Content (20% of time): Blog posts, social, email - should be AI-generated
2. Strategic Content (40% of time): GEO-optimized articles, competitive pieces - human-directed, AI-assisted  
3. Signature Content (40% of time): Keynotes, essays with original POV - entirely human

You help teams classify their content and reallocate effort toward higher-impact work.`,

        'ai-impact': `You are an expert in AI transformation for Product Marketing organizations.

You help PMMs audit their activities against the AI Impact Matrix:
- Production tasks (high AI potential): content generation, data analysis, reporting
- Strategic tasks (human-essential): positioning, narrative, relationship building

You provide specific recommendations for which activities to automate, augment, or keep human.`
    };

    return prompts[labType] || prompts['geo-audit'];
}

function buildUserPrompt(labType, inputs) {
    switch (labType) {
        case 'geo-audit':
            return `Analyze this product/company for GEO (Generative Engine Optimization) visibility:

**Company/Product:** ${inputs.company}
**Product Category:** ${inputs.category}
**Target Buyer:** ${inputs.buyer}
**Key Use Cases:** ${inputs.useCases}

**Current Product Page Content:**
${inputs.pageContent}

**Current Positioning Statement:**
${inputs.positioning}

Please provide:
1. **GEO Visibility Score** (1-10) with explanation
2. **Specificity Analysis**: What claims are too vague for AI to cite?
3. **Missing Elements**: What would an AI agent need to confidently recommend you?
4. **Quick Wins**: 3 specific changes that would immediately improve AI visibility
5. **Rewrite Examples**: Take 2-3 vague statements and rewrite them as agent-readable claims
6. **Test Queries**: 5 queries a buyer might ask AI where you should appear (but might not today)`;

        case 'positioning-test':
            return `Run the "Agent Test" on this product positioning:

**Product:** ${inputs.product}
**Category:** ${inputs.category}
**Target Buyer:** ${inputs.buyer}

**Product Page Content:**
${inputs.pageContent}

**Requirements this buyer typically has:**
${inputs.requirements}

Evaluate as if you're an AI procurement agent. Provide:
1. **Fit Assessment**: Based only on this page, how would you assess fit for these requirements?
2. **Confidence Level**: How confident is your assessment? What made you hedge?
3. **Gaps Identified**: What couldn't you evaluate from this content?
4. **Competitive Blindspots**: What would make a competitor more visible than this vendor?
5. **Specificity Rewrites**: Rewrite 3 vague claims as specific, verifiable statements
6. **Documentation Check**: What should the docs say to match marketing claims?`;

        case 'demo-narrative':
            return `Create transformation narratives for this product demo:

**Product:** ${inputs.product}
**What it does:** ${inputs.whatItDoes}
**Target Buyer Role:** ${inputs.buyerRole}
**Industry:** ${inputs.industry}
**Key Pain Points:** ${inputs.painPoints}

Create 3 transformation narratives following this structure:
1. **Current State Pain**: Paint the picture of their world today (specific, visceral)
2. **Transformation Moment**: "Here's what [day/workflow] looks like with [product]..."
3. **Future State Resolution**: The emotional payoff - what their life becomes

For each narrative, include:
- Opening hook (the specific pain moment)
- The "aha" transition line
- Closing that makes them FEEL the transformation
- One specific data point or proof to ground it`;

        case 'ci-brief':
            return `Create a competitive intelligence brief:

**Your Company:** ${inputs.yourCompany}
**Competitor:** ${inputs.competitor}
**Deal Context:** ${inputs.dealContext}
**What You Know About Them:**
${inputs.knownIntel}

**Recent News/Signals:**
${inputs.recentNews}

Create a brief for sales with:
1. **TL;DR** (3 bullets max - what they MUST know for tomorrow's call)
2. **What's Changed** since last quarter
3. **Their Current Pitch** - how they're positioning against you
4. **Landmines** - objections to expect
5. **Trap-Setting Questions** - 3 questions to reframe the conversation
6. **If They Say X, You Say Y** - top 3 objection handlers`;

        case 'content-audit':
            return `Audit this content portfolio against the three-layer model:

**Content Pieces (last 30 days):**
${inputs.contentList}

**Team Size:** ${inputs.teamSize}
**Current Time Allocation (estimate):**
- Content production: ${inputs.timeProduction}%
- Strategy/planning: ${inputs.timeStrategy}%
- Original thought leadership: ${inputs.timeSignature}%

Provide:
1. **Classification**: Sort each piece into Commodity / Strategic / Signature
2. **Current Ratio**: What % of content falls into each category?
3. **Time Mismatch**: Where is effort misallocated vs. impact?
4. **Automation Candidates**: Which pieces should be AI-generated?
5. **Signature Opportunities**: What original POV content is missing?
6. **90-Day Reallocation Plan**: How to shift toward 20/40/40`;

        case 'ai-impact':
            return `Audit these PMM activities for AI transformation potential:

**Your PMM Activities (weekly hours):**
${inputs.activities}

**Current Tools Used:**
${inputs.tools}

**Team Structure:**
${inputs.teamStructure}

Provide:
1. **Activity Classification**: Sort each into Production (automate) / Strategic (augment) / Human-Essential (protect)
2. **Time Recovery Estimate**: Hours/week that could be reclaimed through AI
3. **Quick Wins**: 3 activities to automate THIS WEEK
4. **Augmentation Plays**: Where AI assists but human directs
5. **Sacred Cows**: What must stay human and why
6. **Tool Recommendations**: Specific tools for top automation opportunities
7. **30-Day Pilot Plan**: First AI workflow to implement`;

        default:
            return inputs.prompt || 'Please provide analysis.';
    }
}
