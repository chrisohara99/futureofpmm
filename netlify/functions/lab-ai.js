// Netlify Function: AI Lab Assistant
// Proxies requests to Claude API for interactive labs

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const fs = require('fs');
const path = require('path');

// FUD Catalog for BattleCoach - lazy load to handle bundling
let FUD_CATALOG = null;
function getFudCatalog() {
    if (FUD_CATALOG === null) {
        try {
            const catalogPath = path.join(__dirname, 'fud-catalog.json');
            const data = fs.readFileSync(catalogPath, 'utf8');
            FUD_CATALOG = JSON.parse(data);
        } catch (err) {
            console.error('Failed to load FUD catalog:', err);
            FUD_CATALOG = [];
        }
    }
    return FUD_CATALOG;
}

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

**IMPORTANT - SAP APPROVED TOOLS ONLY:**
You MUST only recommend tools from SAP's approved list:

**Tier 1 (Available Now):** Microsoft Copilot Chat, SAP GenAI Experience Lab (incl. PPT generator), CompeteGPT, EKX, Joule, Claude Code
**Tier 2 (Licensed):** Perplexity Pro, Canva, Synthesia, Claude, ChatGPT, Copilot in Word/PowerPoint/Teams

DO NOT recommend non-approved tools. If compelling alternatives exist, note them in a "Tools to Evaluate" section with caveat they need SAP onboarding (6-9 months).

You provide specific recommendations for which activities to automate, augment, or keep human.`,

        'battlecoach': `You are BattleCoach, an expert competitive intelligence assistant for SAP's Intelligent Spend Management portfolio (SAP Ariba, SAP Business Network, SAP Fieldglass, Taulia).

You help Account Executives and PMMs prepare for competitive deals using two battle-tested frameworks:

**AREA Framework (Defensive — handling objections):**
- **A**cknowledge: Validate the concern without agreeing
- **R**eframe: Shift the perspective to what matters
- **E**vidence: Ground with specific proof points
- **A**sk: Hand them a new question that favors SAP

**IDEA Framework (Offensive — proactive differentiation):**
- **I**nsight: Lead with a surprising truth the buyer doesn't know
- **D**ifferentiator: What only SAP can do (network scale, integration, etc.)
- **E**vidence: Prove it's real with data or references
- **A**sk: Reframe the evaluation criteria in SAP's favor

You have access to SAP's competitive battlecard data and know the common FUD (Fear, Uncertainty, Doubt) that competitors spread. Your responses are:
- Specific to the named competitor
- Grounded in real SAP capabilities
- Actionable for sales conversations
- Written in a confident but professional tone

Key SAP differentiators to leverage:
- SAP Business Network: World's largest B2B network (5.5M+ organizations, $6T+ commerce)
- 90%+ of suppliers on the network pay zero transaction fees
- Unified platform across source-to-pay vs. cobbled acquisitions
- Deep industry expertise with dedicated teams
- Native ERP integration (especially S/4HANA)
- Proven enterprise scale and compliance
- Taulia for working capital optimization

Always provide specific, defensible claims. Flag anything that would need verification.`,

        'activity-audit': `You are an expert in AI transformation for Product Marketing teams, specifically helping PMMs identify which activities to automate, augment, or keep fully human.

You understand the PMM AI Impact Matrix:
- **Automate (High AI Potential)**: Content drafts, competitive monitoring, data synthesis, reporting, social posts, email variants
- **Augment (AI + Human)**: Positioning refinement, demo narratives, customer interview synthesis, launch planning
- **Protect (Human Essential)**: Strategic narrative, executive relationships, cross-functional leadership, original thought leadership

**IMPORTANT - SAP APPROVED TOOLS ONLY:**
You MUST only recommend tools from SAP's approved list. Here are the approved tools by tier:

**Tier 1 (Enterprise-Approved - Available Now):**
- Microsoft Copilot Chat (general purpose drafting, summaries)
- SAP GenAI Experience Lab (multi-model playground, PPT generator)
- CompeteGPT (competitive intelligence)
- EKX (SAP knowledge graph, fact-checking)
- Joule (SAP product questions, transactions)
- Claude Code (coding, HTML artifacts, interactive tools)

**Tier 2 (Budget-Approved - Licensed):**
- Perplexity Pro (research with citations)
- Canva (design, presentations, graphics)
- Synthesia (AI video generation)
- Claude (long-form content, analysis)
- ChatGPT (general purpose)
- Copilot in Word/PowerPoint/Teams (document automation)

**DO NOT recommend non-approved tools like Gamma, Beautiful.ai, Copy.ai, Jasper, etc.**

If there are compelling non-approved tools that would be valuable, add a separate "Tools to Evaluate" section at the end noting they would need to go through SAP's onboarding process (6-9 months).

You provide specific, actionable recommendations with tool suggestions. You're practical and prioritize quick wins that build momentum.

Format responses with clear sections, tables where helpful, and be direct about what to do FIRST.`
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

        case 'activity-audit':
            const activitiesList = Array.isArray(inputs.activities) ? inputs.activities.join(', ') : inputs.activities;
            return `Analyze this PMM's activities for AI transformation potential:

**Role:** ${inputs.role}
**Products/Solutions Supported:** ${inputs.products}
**Team Context:** ${inputs.teamSize}

**Current Weekly Activities:**
${activitiesList}

**Current AI Tools in Use:**
${inputs.currentTools || 'None specified'}

**Pain Points / Time Drains:**
${inputs.painPoints}

**If AI freed up time, they'd focus on:**
${inputs.goals || 'Not specified'}

Please provide a comprehensive AI Transformation Roadmap:

## 1. AI Readiness Score
Give an overall score (1-10) with brief explanation of where this PMM is on the AI adoption curve.

## 2. Activity Analysis Table
Create a table with columns: Activity | AI Potential (High/Medium/Low) | Recommended Action | Tool Suggestion
Analyze each of their selected activities.

## 3. Priority Matrix
Rank their activities by: (Automation Potential × Time Savings × Ease of Implementation)
Identify the top 5 opportunities.

## 4. Quick Wins (This Week)
3 specific activities they can start automating immediately with exact steps:
- What to automate
- Which tool to use
- How to get started (be specific)

## 5. 30-Day Pilot Plan
A concrete plan for their first AI workflow transformation:
- Week 1: [specific actions]
- Week 2: [specific actions]
- Week 3-4: [specific actions]

## 6. Tool Stack Recommendation
Based on their activities, recommend a starter AI tool stack using ONLY SAP-approved tools:
- For [activity]: Use [tool] because...
- Keep it to 3-4 tools maximum
- Only recommend from: Copilot Chat, GenAI Lab, CompeteGPT, EKX, Joule, Claude Code, Perplexity, Canva, Claude, ChatGPT, Copilot in Word/PPT/Teams

## 7. What to Protect
Which of their activities should stay human and why. Be specific about the value of human judgment here.

## 8. Tools to Evaluate (Optional)
If there are compelling non-approved tools that would add significant value, list them here with a note that they would need to go through SAP's vendor onboarding process (typically 6-9 months). Only include if truly valuable - don't pad this section.`;

        case 'battlecoach':
            // Filter FUD catalog for this competitor
            const catalog = getFudCatalog();
            const competitorFuds = catalog.filter(f => 
                f.competitor && f.competitor.toLowerCase() === inputs.competitor.toLowerCase()
            ).slice(0, 15); // Top 15 relevant FUDs
            
            const fudContext = competitorFuds.map(f => 
                `• CLAIM: "${f.competitor_claim}"\n  REFRAME: ${f.reframe_override}`
            ).join('\n\n');
            
            return `Generate battle plays for this competitive deal:

## DEAL BRIEFING
**Customer:** ${inputs.customerName}
**Industry:** ${inputs.industry}
**Region:** ${inputs.region}
**Primary Competitor:** ${inputs.competitor}
**Buyer Persona:** ${inputs.audience}
**Solution Area:** ${inputs.solutionArea}
**Deal Stage:** ${inputs.dealStage}
**Additional Context:** ${inputs.additionalContext || 'None provided'}

## COMPETITOR FUD INTELLIGENCE (from battlecards)
${fudContext || 'No specific FUD entries for this competitor. Use general competitive knowledge.'}

---

Generate FOUR distinct sections. Use clear markdown headers so they can be parsed separately:

## FUD RESPONSE SHEET
Create a table of the top 3-4 FUD claims this competitor will likely use in this deal, with columns:
| What They'll Say | The Truth | Your Response |

Focus on claims relevant to the ${inputs.solutionArea} solution area and ${inputs.industry} industry.

## AREA SCRIPT (Defensive Objection Handling)
For the #1 most likely objection in this deal, write a complete AREA script:

**The Objection:** [What the competitor or buyer will say]

**A - Acknowledge:** [Validate without agreeing - 1-2 sentences]

**R - Reframe:** [Shift perspective to what really matters - 2-3 sentences]

**E - Evidence:** [Specific proof points with sources - 2-3 bullets]

**A - Ask:** [The question that reframes the evaluation - 1 powerful question]

## IDEA TALKING POINTS (Offensive Differentiation)
Write 3 proactive differentiation points using IDEA:

**Point 1: [Topic]**
- **Insight:** [Surprising truth they don't know]
- **Differentiator:** [What only SAP can do]
- **Evidence:** [Proof]
- **Ask:** [Reframe question]

**Point 2: [Topic]**
[Same structure]

**Point 3: [Topic]**
[Same structure]

## DISCOVERY QUESTIONS
Provide 5 questions the AE should ask to shift evaluation criteria in SAP's favor. These should:
- Expose competitor weaknesses without naming the competitor
- Highlight SAP strengths (network scale, integration, TCO)
- Be appropriate for the ${inputs.dealStage} stage
- Resonate with a ${inputs.audience}

Format: Question + [Why this works - brief tactical note]`;

        default:
            return inputs.prompt || 'Please provide analysis.';
    }
}
