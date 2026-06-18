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

    const apiKey = process.env.LAB_ANTHROPIC_KEY || process.env.ANTHROPIC_API_KEY;
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
                model: 'claude-haiku-4-5-20251001',
                max_tokens: 2048,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Anthropic API error:', response.status, errorText);
            // Return full error for debugging
            return { 
                statusCode: response.status, 
                headers, 
                body: JSON.stringify({ error: `API Error ${response.status}: ${errorText.substring(0, 500)}` }) 
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

        'battlecoach-fud': `You are BattleCoach, an expert competitive intelligence assistant for SAP's Intelligent Spend Management portfolio (SAP Ariba, SAP Business Network, SAP Fieldglass, Taulia).

You create FUD Response Sheets — quick-reference guides that show what competitors will say and how SAP should respond. Your responses are:
- Specific to the named competitor
- Grounded in real SAP capabilities
- Written in a confident, conversational tone
- Actionable for sales conversations

Key SAP facts to leverage:
- SAP Business Network: 5.5M+ organizations, $6T+ commerce annually
- 90%+ of suppliers pay zero transaction fees
- Unified source-to-pay platform (not cobbled acquisitions)
- Deep industry expertise with dedicated teams
- Native S/4HANA integration
- Taulia for working capital optimization`,

        'battlecoach-area': `You are BattleCoach, an expert at handling competitive objections using the AREA framework:
- Acknowledge: Validate the concern without agreeing
- Reframe: Shift perspective to what matters
- Evidence: Ground with specific proof
- Ask: Hand them a question that favors SAP

Write scripts that sound natural in conversation, not robotic. The AE should be able to read this and immediately use it.`,

        'battlecoach-idea': `You are BattleCoach, an expert at proactive competitive differentiation using the IDEA framework:
- Insight: Lead with a surprising truth
- Differentiator: What only SAP can do
- Evidence: Prove it's real
- Ask: Reframe the evaluation criteria

Focus on offensive positioning — don't wait for objections, lead with differentiation. Be specific about SAP's unique advantages.`,

        'battlecoach-discovery': `You are BattleCoach, an expert at crafting discovery questions that shift competitive evaluations toward SAP.

Great discovery questions:
- Expose competitor weaknesses without naming them
- Plant criteria where SAP wins
- Sound curious, not leading
- Are appropriate for the deal stage

Write questions a ${'{inputs.audience}'} would find thoughtful, not salesy.`,

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

Format responses with clear sections, tables where helpful, and be direct about what to do FIRST.`,

        'messaging-lab': `You are an expert B2B messaging strategist, specifically for enterprise software positioning.

You help PMMs create compelling value propositions and messaging frameworks using the proven "Messaging House" structure:

**Core Messaging Framework:**
1. **Value Proposition**: One sentence that captures the unique value (Problem → Solution → Outcome)
2. **Key Messages** (3 pillars): Supporting proof points that ladder up to the value prop
3. **Proof Points**: Specific evidence (stats, customer quotes, capabilities) for each pillar
4. **Persona Variants**: How the message changes for different buyer roles

**Good messaging is:**
- Specific (not "leading" or "best-in-class")
- Outcome-focused (what changes for the buyer)
- Differentiated (why you, not alternatives)
- Verifiable (backed by evidence)
- Concise (under 25 words for key statements)

You write in a confident, conversational tone. You avoid jargon unless it's truly meaningful to the buyer.`,

        'pricing-rationale': `You are an expert in B2B software pricing strategy and value-based selling.

You help PMMs and sales teams build compelling pricing rationale documents that:
1. Quantify the value delivered (ROI, time savings, risk reduction)
2. Frame the investment against alternatives (cost of status quo, competitor pricing)
3. Create urgency through opportunity cost analysis
4. Provide ammunition for procurement negotiations

**Your frameworks include:**
- **Value Waterfall**: Break down total value into measurable components
- **TCO Analysis**: Compare total cost of ownership vs alternatives
- **Payback Period**: When does the investment pay for itself?
- **Risk-Adjusted ROI**: Factor in implementation and adoption risks

You write executive-ready content that finance teams will find credible. You use conservative assumptions and cite sources where possible.`,

        'enablement-bundler': `You are an expert sales enablement strategist for enterprise B2B software, specifically SAP.

You create region- and persona-tuned sales enablement kits that help Account Executives have better conversations and close deals faster. Your kits are:

**Practical:** Ready to use in the next customer call, not theoretical
**Contextual:** Tailored to the specific region, persona, industry, and deal stage
**Evidence-based:** Grounded in real proof points, customer wins, and competitive differentiation
**Actionable:** Clear talk tracks, objection handlers, and next-step recommendations

**Regional considerations you factor in:**
- NA: Direct, ROI-focused, fast-paced decision cycles
- EMEA: Relationship-oriented, compliance-conscious, longer consensus-building
- APJ: Varies by market — ANZ is direct like NA, Japan requires more formal process, India values references
- LATAM: Relationship-driven, price-sensitive, flexibility important

**Deal stage considerations:**
- Discovery: Focus on pain validation and qualification questions
- Evaluation: Focus on differentiation and proof points
- Proposal: Focus on value quantification and risk mitigation  
- Negotiation: Focus on procurement ammunition and final objection handling

You write in a confident, conversational tone that AEs can use directly in customer conversations. Avoid corporate-speak.`,

        'content-localization': `You are an expert content localization specialist for enterprise B2B software marketing, specifically SAP.

You adapt marketing content across regions and languages while preserving:
- **Messaging intent** — The core value proposition stays intact
- **Brand voice** — SAP's professional, confident, trustworthy tone
- **Regulatory compliance** — GDPR in EMEA, local data laws, industry regulations

**Regional expertise you bring:**

**DACH (German):**
- Formal "Sie" unless explicitly told otherwise
- Precision and technical accuracy highly valued
- Longer, more detailed explanations preferred
- Strong emphasis on data privacy and security
- Avoid hyperbole — Germans prefer understated claims with proof

**France (French):**
- Formal but elegant language
- Appreciation for well-crafted prose
- Strong regulatory environment (CNIL compliance)
- Business relationships matter — don't be too transactional

**Spain/LATAM (Spanish):**
- Spain: Formal European Spanish, tu/usted distinction
- LATAM: Varies by country, generally more warmth and relationship focus
- Brazil: Portuguese, not Spanish — different market entirely

**Japan (Japanese):**
- Extreme politeness levels (keigo)
- Indirect communication preferred
- Group consensus important — avoid singling out individuals
- Seasonal references appreciated
- Longer decision cycles expected

**Nordics (Scandinavian):**
- Often prefer English for business content
- Egalitarian tone — avoid hierarchical language
- Direct but not aggressive
- Sustainability and social responsibility resonate

**MENA (Arabic):**
- Right-to-left formatting considerations
- Relationship and trust emphasis
- Formal, respectful tone
- Religious and cultural sensitivities

You provide both the localized content AND notes explaining your adaptation choices.`,

        'launch-planner': `You are an expert GTM launch planner for enterprise B2B software companies, specifically SAP.

You create comprehensive Launch Bills of Materials (BOMs) — task trackers that cover all workstreams needed for a successful product launch, event, or campaign.

**Your BOMs follow the SAP launch playbook structure:**
- Tasks organized by workstream (Content, Web, Demand Gen, Enablement, Video, Social, PR/AR, Partners, etc.)
- T-minus timing (Pre-Launch, Launch, Post-Launch phases)
- Owner placeholders by function
- Clear dependencies and status tracking

**You understand:**
- Tier 1 launches need full coverage (all workstreams)
- Tier 2 launches focus on key workstreams
- Tier 3 launches are essentials only
- Timing varies: 8-12 weeks for major launches, 4-6 for features, 2-4 for campaigns

You create practical, actionable task lists that PMMs can immediately use to track their launch.`,

        'launch-planner-timeline': `You are an expert at creating visual T-minus launch timelines.

You organize launch tasks into clear phases:
- **T-8 to T-4 weeks**: Foundation (MPFs, web templates, video scripts)
- **T-4 to T-2 weeks**: Production (content creation, page builds, asset finalization)
- **T-2 to T-1 week**: Pre-launch (amplification, enablement, final reviews)
- **Launch Week**: Go-live activities
- **Post-Launch**: Follow-up, measurement, iteration

Your timelines are easy to scan and show dependencies clearly.`,

        'launch-planner-raci': `You are an expert at creating RACI matrices for GTM launches.

RACI = Responsible, Accountable, Consulted, Informed

You map typical GTM roles:
- PMM (Product Marketing Manager)
- Content Marketing
- Web Team
- Demand Gen
- Field Marketing
- Sales Enablement
- PR/Comms
- Product Management
- Design/Creative

Your RACI matrices help teams understand who owns what and reduce confusion during busy launch periods.`,

        'analyst-briefing-questions': `You are an expert in industry analyst relations for enterprise B2B software companies.

You understand how analysts at Gartner, Forrester, and IDC evaluate vendors:
- They compare systematically against criteria
- They weight evidence over claims
- They probe for gaps and inconsistencies
- They talk to customers and competitors
- They write "Cautions" sections that buyers read carefully

You help PMMs prepare for analyst briefings by predicting the tough questions they'll face. You think like an analyst: skeptical, evidence-focused, looking for the real story behind the marketing.

Your predictions are specific, grounded, and actionable — not generic "be prepared for tough questions."`,

        'analyst-briefing-cautions': `You are an expert industry analyst writing the "Cautions" section of a vendor evaluation.

You write like a Gartner analyst would: balanced but direct, specific about concerns, fair but not soft. Your cautions are:
- Based on evidence gaps you'd find in research
- Specific enough for buyers to act on
- Balanced (acknowledge strengths while noting concerns)
- Written in analyst voice (third-person, professional)

You help PMMs see what analysts might write so they can proactively address concerns.`,

        'analyst-briefing-evidence': `You are an expert in analyst relations, specifically in preparing counter-evidence for analyst briefings.

You know what analysts find credible:
- Named customer references with quantified outcomes
- Third-party validation (benchmarks, awards, peer reviews)
- Specific technical proof (architecture, integrations, certifications)
- Trend data showing improvement (not just current state)
- Competitive differentiators that can be verified

You help PMMs build evidence packages that address predicted concerns.`,

        'analyst-briefing-checklist': `You are an expert in analyst relations, specifically in briefing preparation.

You've run hundreds of analyst briefings and know what separates good prep from great prep:
- Anticipating questions, not just presenting slides
- Having evidence ready for every major claim
- Knowing the analyst's history and perspective
- Preparing for objections, not just positive stories
- Having a clear "ask" for the analyst

You create practical checklists that ensure PMMs walk into briefings fully prepared.`,

        'launch-planner-risks': `You are an expert at identifying launch risks and creating mitigation plans.

Common launch risks include:
- Content delays (reviews, approvals, production)
- Dependency failures (web team bandwidth, design resources)
- Scope creep (stakeholder additions)
- Technical issues (demo environments, integrations)
- External factors (market timing, competitive moves)

You create practical risk registers with:
- Risk description
- Likelihood (High/Medium/Low)
- Impact (High/Medium/Low)
- Mitigation strategy
- Owner

Your risk assessments help teams proactively address potential blockers.`
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

        case 'battlecoach-fud':
            // Filter FUD catalog for this competitor
            const catalogFud = getFudCatalog();
            const competitorFudsFud = catalogFud.filter(f => 
                f.competitor && f.competitor.toLowerCase() === inputs.competitor.toLowerCase()
            ).slice(0, 10);
            
            const fudContextFud = competitorFudsFud.map(f => 
                `• CLAIM: "${f.competitor_claim}"\n  REFRAME: ${f.reframe_override}`
            ).join('\n\n');
            
            return `Generate a FUD Response Sheet for this SAP competitive deal:

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
${fudContextFud || 'No specific FUD entries for this competitor. Use general competitive knowledge.'}

---

Create a **FUD Response Sheet** with the top 4-5 FUD claims this competitor will likely use in this deal.

Format as a markdown table:
| What ${inputs.competitor} Will Say | The Truth | Your Response |
|---|---|---|

Focus on claims relevant to:
- ${inputs.solutionArea} solution area
- ${inputs.industry} industry
- ${inputs.audience} buyer concerns

For each row:
- "What They'll Say" = the competitor's likely claim or objection
- "The Truth" = the factual reality (brief)
- "Your Response" = what the AE should say (conversational, confident)`;

        case 'battlecoach-area':
            const catalogArea = getFudCatalog();
            const competitorFudsArea = catalogArea.filter(f => 
                f.competitor && f.competitor.toLowerCase() === inputs.competitor.toLowerCase()
            ).slice(0, 5);
            
            const fudContextArea = competitorFudsArea.map(f => 
                `• "${f.competitor_claim}"`
            ).join('\n');
            
            return `Generate an AREA Script for handling the #1 objection in this SAP deal:

## DEAL CONTEXT
**Customer:** ${inputs.customerName} (${inputs.industry}, ${inputs.region})
**Competitor:** ${inputs.competitor}
**Buyer:** ${inputs.audience}
**Solution:** ${inputs.solutionArea}
**Stage:** ${inputs.dealStage}
**Context:** ${inputs.additionalContext || 'None'}

## LIKELY COMPETITOR CLAIMS
${fudContextArea}

---

Write a complete **AREA Script** for the most likely objection in this deal:

## 🛡️ AREA Script: Handling the "${inputs.competitor}" Objection

**THE OBJECTION:**
> [Write the specific objection the buyer will raise, based on competitor FUD]

**A — ACKNOWLEDGE**
[Validate their concern without agreeing. Show you understand why they'd think that. 1-2 sentences.]

**R — REFRAME**
[Shift the perspective to what really matters for their business. Connect to their goals as a ${inputs.audience}. 2-3 sentences.]

**E — EVIDENCE**
[Provide 2-3 specific proof points:]
- [Proof point 1 with source]
- [Proof point 2 with source]
- [Proof point 3 with source]

**A — ASK**
[One powerful question that reframes the evaluation criteria in SAP's favor. Make them think.]

---

**DELIVERY TIP:**
[One practical tip for how to deliver this in the conversation]`;

        case 'battlecoach-idea':
            return `Generate IDEA Talking Points for proactive differentiation in this SAP deal:

## DEAL CONTEXT
**Customer:** ${inputs.customerName} (${inputs.industry}, ${inputs.region})
**Competitor:** ${inputs.competitor}
**Buyer:** ${inputs.audience}
**Solution:** ${inputs.solutionArea}
**Stage:** ${inputs.dealStage}
**Context:** ${inputs.additionalContext || 'None'}

---

Write **3 IDEA Talking Points** for proactive differentiation. Don't wait for objections — lead with these.

## ⚔️ IDEA Talking Points vs. ${inputs.competitor}

### Point 1: Network Scale
- **I — INSIGHT:** [A surprising truth about B2B networks the buyer doesn't know]
- **D — DIFFERENTIATOR:** [What SAP Business Network does that ${inputs.competitor} cannot]
- **E — EVIDENCE:** [Specific proof: numbers, customer examples, analyst quotes]
- **A — ASK:** [Question that makes this a buying criterion]

### Point 2: Total Cost of Ownership
- **I — INSIGHT:** [Surprising truth about TCO in this space]
- **D — DIFFERENTIATOR:** [How SAP delivers better long-term value]
- **E — EVIDENCE:** [Specific proof]
- **A — ASK:** [Question that exposes hidden costs]

### Point 3: [Choose based on ${inputs.solutionArea}]
- **I — INSIGHT:** [Relevant to their solution area]
- **D — DIFFERENTIATOR:** [SAP's unique capability here]
- **E — EVIDENCE:** [Specific proof]
- **A — ASK:** [Reframe question]

---

**WHEN TO USE:**
- Point 1: [Best moment in the conversation]
- Point 2: [Best moment]
- Point 3: [Best moment]`;

        case 'battlecoach-discovery':
            return `Generate Discovery Questions for this SAP competitive deal:

## DEAL CONTEXT
**Customer:** ${inputs.customerName} (${inputs.industry}, ${inputs.region})
**Competitor:** ${inputs.competitor}
**Buyer:** ${inputs.audience}
**Solution:** ${inputs.solutionArea}
**Stage:** ${inputs.dealStage}
**Context:** ${inputs.additionalContext || 'None'}

---

Provide **5 Discovery Questions** the AE should ask to shift evaluation criteria toward SAP's strengths.

## ❓ Discovery Questions vs. ${inputs.competitor}

These questions should:
- Expose ${inputs.competitor}'s weaknesses WITHOUT naming them directly
- Highlight SAP strengths (network scale, integration, TCO, supplier adoption)
- Be appropriate for ${inputs.dealStage} stage
- Resonate with a ${inputs.audience}

### Question 1: Network & Scale
> "[The question]"

**Why it works:** [Brief tactical note — what weakness it exposes, what strength it highlights]

### Question 2: Integration & Ecosystem
> "[The question]"

**Why it works:** [Brief tactical note]

### Question 3: Total Cost of Ownership
> "[The question]"

**Why it works:** [Brief tactical note]

### Question 4: Supplier Adoption
> "[The question]"

**Why it works:** [Brief tactical note]

### Question 5: Future-Proofing
> "[The question]"

**Why it works:** [Brief tactical note]

---

**PRO TIP:** Ask these early in discovery before the buyer has locked in evaluation criteria based on ${inputs.competitor}'s framing.`;

        case 'messaging-lab':
            return `Create a messaging framework for this product:

**Product/Solution:** ${inputs.product}
**Product Category:** ${inputs.category}
**Primary Buyer Persona:** ${inputs.persona}
**Industry/Vertical:** ${inputs.industry || 'Cross-industry'}

**Key Capabilities/Features:**
${inputs.capabilities}

**Target Pain Points:**
${inputs.painPoints}

**Competitive Alternatives:**
${inputs.alternatives}

**Proof Points Available (customer wins, stats, etc.):**
${inputs.proofPoints}

Generate a complete messaging framework:

## 1. Value Proposition
Create a single compelling statement (under 25 words) following: [Pain/Problem] → [Solution/Approach] → [Outcome/Transformation]

## 2. Messaging Pillars (3)
For each pillar provide:
- **Pillar Name**: (2-4 words)
- **Key Message**: One sentence that supports the value prop
- **Proof Points**: 2-3 specific evidence items
- **Competitor Contrast**: How this differentiates from alternatives

## 3. Persona Variants
Reframe the value prop for these roles:
- **Economic Buyer** (CFO/Finance): Focus on ROI/cost
- **Technical Buyer** (IT/Ops): Focus on integration/risk
- **End User**: Focus on daily experience improvement

## 4. Elevator Pitches
- **10-second version**: For networking/quick intros
- **30-second version**: For first meetings
- **2-minute version**: For presentations

## 5. Common Objections & Responses
Anticipate 3 likely objections and provide response frameworks.`;

        case 'pricing-rationale':
            return `Build a pricing rationale document for this deal:

**Product/Solution:** ${inputs.product}
**Annual Contract Value:** ${inputs.acv}
**Customer Company:** ${inputs.customer}
**Industry:** ${inputs.industry}
**Company Size:** ${inputs.companySize}

**Current State (What they're doing today):**
${inputs.currentState}

**Key Value Drivers (What our solution enables):**
${inputs.valueDrivers}

**Known Metrics (any baseline data we have):**
${inputs.knownMetrics}

**Competitive Alternative Being Considered:**
${inputs.alternative}

Generate a comprehensive pricing rationale:

## 1. Executive Summary
One paragraph making the business case for this investment.

## 2. Value Waterfall
Break down the total value into measurable components:
| Value Driver | Calculation Approach | Conservative Estimate | Notes |
|--------------|---------------------|----------------------|-------|

## 3. ROI Analysis
- **Total Investment**: (License + Implementation + Training)
- **Year 1 Value**: 
- **Year 2-3 Value**:
- **Payback Period**:
- **3-Year ROI**:

## 4. Cost of Inaction
What does it cost them NOT to act?
- Direct costs of current approach
- Opportunity costs
- Risk exposure

## 5. Competitive Comparison
Position the investment against:
- Status quo (current tools/processes)
- Alternative vendor being considered
- Build vs buy

## 6. Risk Mitigation
Address procurement concerns:
- Implementation risk and how we mitigate
- Adoption risk and success planning
- Contractual protections

## 7. Negotiation Talking Points
3 key points for the champion to use with procurement.

Use conservative assumptions. Mark any estimates that need customer validation.`;

        case 'enablement-bundler':
            let assetsArray = Array.isArray(inputs.assets) ? inputs.assets : [];
            // If full-kit is selected or nothing selected, generate full kit
            const isFullKit = assetsArray.includes('full-kit') || assetsArray.length === 0 || assetsArray.length > 2;
            if (isFullKit) {
                assetsArray = ['full-kit'];
            }
            const assetsRequested = assetsArray.join(', ');
            const regionMap = {
                'north-america': 'North America',
                'emea-uk': 'EMEA — UK/Ireland',
                'emea-dach': 'EMEA — DACH (Germany, Austria, Switzerland)',
                'emea-nordics': 'EMEA — Nordics',
                'emea-france': 'EMEA — France',
                'emea-southern': 'EMEA — Southern Europe',
                'apj-anz': 'APJ — Australia/New Zealand',
                'apj-japan': 'APJ — Japan',
                'apj-india': 'APJ — India',
                'apj-sea': 'APJ — Southeast Asia',
                'latam': 'Latin America'
            };
            const personaMap = {
                'cfo': 'CFO / Chief Financial Officer',
                'cio': 'CIO / Chief Information Officer',
                'cpo': 'CPO / Chief Procurement Officer',
                'chro': 'CHRO / Chief Human Resources Officer',
                'cmo': 'CMO / Chief Marketing Officer',
                'coo': 'COO / Chief Operating Officer',
                'vp-it': 'VP IT / IT Director',
                'vp-finance': 'VP Finance / Controller',
                'vp-ops': 'VP Operations',
                'vp-supply-chain': 'VP Supply Chain',
                'director-procurement': 'Director of Procurement',
                'director-hr': 'Director of HR'
            };
            const stageMap = {
                'discovery': 'Discovery — Early qualification',
                'evaluation': 'Evaluation — Active comparison',
                'proposal': 'Proposal — Final decision',
                'negotiation': 'Negotiation — Contract stage'
            };
            
            // Build dynamic output sections based on selected assets
            const dealContext = `## DEAL CONTEXT
**Product/Solution:** ${inputs.product}
**Deal Stage:** ${stageMap[inputs.dealStage] || inputs.dealStage}
**Deal Size:** ${inputs.dealSize}
**Region:** ${regionMap[inputs.region] || inputs.region}
**Buyer Persona:** ${personaMap[inputs.persona] || inputs.persona}
**Industry:** ${inputs.industry}

**Current Situation / Pain Points:**
${inputs.currentSituation}

**Competitive Situation:**
${inputs.competitors || 'Not specified'}

**Known Objections:**
${inputs.keyObjections || 'Not specified'}`;

            // Check if ONLY battlecards is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'battlecards') {
                return `Generate a **Competitive Battlecard** for this opportunity:

${dealContext}

---

Create a detailed **Battlecard** with these sections:

## ⚔️ Competitive Battlecard: ${inputs.product} vs. Competition

### Executive Summary
2-3 sentences on the competitive landscape for this deal.

### Head-to-Head Comparison
| Capability | ${inputs.product} | Competitor(s) |
|------------|------------------|---------------|
| [Key area 1] | ✅ [Strength] | ⚠️ [Weakness] |
| [Key area 2] | ... | ... |
| [Key area 3] | ... | ... |
| [Key area 4] | ... | ... |
| [Key area 5] | ... | ... |

### Our Strengths (Lead With These)
- **[Strength 1]**: [Why it matters to this ${personaMap[inputs.persona] || inputs.persona}]
- **[Strength 2]**: [Specific proof point]
- **[Strength 3]**: [Specific proof point]

### Their Weaknesses (Expose Carefully)
- **[Weakness 1]**: [Discovery question to surface this]
- **[Weakness 2]**: [Discovery question to surface this]

### FUD They'll Spread (And How to Counter)
| What They'll Say | The Truth | Your Response |
|------------------|-----------|---------------|
| "[Claim 1]" | [Reality] | "[Talk track]" |
| "[Claim 2]" | [Reality] | "[Talk track]" |
| "[Claim 3]" | [Reality] | "[Talk track]" |

### Trap-Setting Questions
Questions to ask early that shift criteria in our favor:
1. "[Question that exposes competitor weakness]"
2. "[Question that highlights our strength]"
3. "[Question that reveals hidden costs/risks]"

### If They're Already Using [Competitor]
- Migration talking points
- Switching cost reframe
- Quick wins to demonstrate value

Make this specific to the deal context. Use confident but professional language.`;
            }
            
            // Check if ONLY demo-scripts is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'demo-scripts') {
                return `Generate a **Demo Script** for this opportunity:

${dealContext}

---

Create a structured **Demo Script** with transformation narrative:

## 🎬 Demo Script: ${inputs.product}

### Pre-Demo Setup
- **Duration**: [Recommended time]
- **Attendees to request**: [Key roles to have in the room]
- **Environment prep**: [What to have ready]

### Opening (2 min)
**Hook**: Start with their pain, not your product.
> "[Opening line that references their specific situation]"

**Agenda frame**:
> "Today I want to show you three things: [1], [2], and [3]. But more importantly, I want you to leave knowing exactly how this solves [their main pain point]. Fair?"

### Act 1: The Current State Pain (3-5 min)
Show/describe what their world looks like today:
- [Specific pain point 1 - make it visceral]
- [Specific pain point 2]
- [Bridge to transformation]: "Now let me show you what this looks like with ${inputs.product}..."

### Act 2: The Transformation (10-15 min)
**Scene 1: [Key workflow/capability]**
> "[Talk track for what you're showing]"
> [Click path: Where to click, what to highlight]
> **Pause point**: "What questions do you have about [X]?"

**Scene 2: [Second key capability]**
> "[Talk track]"
> [Click path]
> **Connect to their pain**: "Remember that issue with [X]? This is how that goes away."

**Scene 3: [Third key capability]**
> "[Talk track]"
> [Click path]

### Act 3: The Future State (3 min)
Paint the picture of their transformed life:
> "So imagine it's 90 days from now. [Describe their new reality]..."

### Objection Handling (have ready)
| If they say... | You say... |
|----------------|------------|
| "[Objection 1]" | "[Response]" |
| "[Objection 2]" | "[Response]" |

### Closing & Next Steps (2 min)
> "[Transition to next step appropriate for ${inputs.dealStage} stage]"

### Post-Demo Follow-up
- Send within 24 hours: [What to send]
- Key points to reinforce: [What to emphasize]

Make the talk tracks conversational and natural, not robotic.`;
            }
            
            // Check if ONLY roi-tools is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'roi-tools') {
                return `Generate an **ROI/Business Case Framework** for this opportunity:

${dealContext}

---

Create an **ROI Framework** the AE can use with this customer:

## 💰 ROI Framework: ${inputs.product}

### Executive Summary
One paragraph making the business case for investment.

### Value Drivers
| Value Driver | How to Quantify | Typical Range | Questions to Ask |
|--------------|-----------------|---------------|------------------|
| [Driver 1] | [Calculation] | [X-Y%] | "[Question to get their number]" |
| [Driver 2] | [Calculation] | [X-Y%] | "[Question]" |
| [Driver 3] | [Calculation] | [$X-$Y] | "[Question]" |
| [Driver 4] | [Calculation] | [X hours/week] | "[Question]" |

### Cost of Inaction Analysis
Help them quantify what doing nothing costs:
- **Direct costs**: [What they're paying today]
- **Opportunity costs**: [What they're missing]
- **Risk exposure**: [Compliance, security, competitive]

### Sample Business Case (for ${inputs.dealSize} deal)
| Category | Year 1 | Year 2 | Year 3 |
|----------|--------|--------|--------|
| Investment | $X | $X | $X |
| Savings/Value | $X | $X | $X |
| Net Value | $X | $X | $X |
| Cumulative ROI | X% | X% | X% |

**Payback period**: [X months]

### Discovery Questions for Business Case
Questions to get their specific numbers:
1. "[Question to quantify pain point 1]"
2. "[Question to quantify pain point 2]"
3. "[Question about current spend]"
4. "[Question about headcount/time]"

### Talking to Finance/Procurement
Key points that resonate with financial buyers:
- [Point 1 with proof]
- [Point 2 with proof]
- [Point 3 with proof]

### Risk Mitigation Talking Points
Address their concerns about investment risk:
- **Implementation risk**: [How we mitigate]
- **Adoption risk**: [How we ensure success]
- **Timeline risk**: [How we deliver on time]

Use conservative assumptions. Mark estimates that need customer validation with [VERIFY].`;
            }
            
            // Check if ONLY case-studies is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'case-studies') {
                return `Generate **Customer Reference Talking Points** for this opportunity:

${dealContext}

---

Create **Reference Story Talking Points** relevant to this deal:

## 📖 Customer Reference Talking Points

### Ideal Reference Profile for This Deal
Based on the context, the ideal reference would be:
- **Industry**: ${inputs.industry} or similar
- **Region**: ${regionMap[inputs.region] || inputs.region} preferred
- **Size**: Similar to ${inputs.dealSize}
- **Use case**: [Matching their pain points]

### Reference Story 1: [Industry] Company
**The Situation**: [1-2 sentences on their challenge - similar to this customer's]

**The Solution**: [What they implemented]

**The Results**:
- [Quantified outcome 1]
- [Quantified outcome 2]
- [Quantified outcome 3]

**Quote to use**:
> "[A compelling quote from the customer]"

**How to position this for your deal**:
> "I was talking to the [role] at [company type], and they had a very similar challenge to what you described with [X]. Here's what they found..."

### Reference Story 2: [Region-Specific]
[Same structure]

### Reference Story 3: [Persona-Specific]
[Same structure - relevant to ${personaMap[inputs.persona] || inputs.persona}]

### How to Request a Reference Call
- **When to offer**: [Right moment in the sales cycle]
- **How to position it**: "[Talk track for offering a reference]"
- **Prep the reference**: [What to tell them about this prospect]

### If No Perfect Reference Exists
Alternative proof points to use:
- Analyst validation: [Specific reports/quotes]
- Industry data: [Relevant statistics]
- Platform proof: [Network/scale metrics]

Make references specific and believable for the ${inputs.industry} industry.`;
            }
            
            // Check if ONLY analyst-reports is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'analyst-reports') {
                return `Generate **Analyst Relations Talking Points** for this opportunity:

${dealContext}

---

Create **Analyst Report Talking Points** for this deal:

## 📊 Analyst Talking Points

### Relevant Analyst Coverage
| Analyst Firm | Report Type | Key Finding | How to Use |
|--------------|-------------|-------------|------------|
| Gartner | [MQ/Critical Capabilities] | [Position/Quote] | "[Talk track]" |
| Forrester | [Wave/Report] | [Position/Quote] | "[Talk track]" |
| IDC | [MarketScape/Report] | [Position/Quote] | "[Talk track]" |

### Key Quotes to Use
**For ${personaMap[inputs.persona] || inputs.persona}**:
> "[Analyst quote relevant to their concerns]"
— [Analyst name], [Firm], [Report]

**For Technical Evaluation**:
> "[Quote about technical capabilities]"

**For Business Case**:
> "[Quote about ROI/value]"

### Strengths Analysts Highlight
- [Strength 1]: "[How analysts describe it]"
- [Strength 2]: "[How analysts describe it]"
- [Strength 3]: "[How analysts describe it]"

### Cautions to Be Prepared For
Analysts also note these areas (and how to address them):
| Analyst Caution | Reality | Your Response |
|-----------------|---------|---------------|
| "[Caution 1]" | [Context] | "[How to address]" |
| "[Caution 2]" | [Context] | "[How to address]" |

### How to Position Analyst Content
> "I don't know if you've seen the latest [Gartner/Forrester] report on [space], but they specifically called out [key finding]. I can send that over—it might be useful for your internal business case."

### Requesting Analyst Inquiry
If the customer wants to talk to analysts directly:
- When to suggest: [Right moment]
- How to facilitate: [Process]
- What to prep them for: [Key questions analysts will ask]

Focus on reports relevant to ${inputs.product} and ${inputs.industry}.`;
            }
            
            // Check if ONLY reference-customers is selected
            if (assetsArray.length === 1 && assetsArray[0] === 'reference-customers') {
                return `Generate **Reference Customer Strategy** for this opportunity:

${dealContext}

---

Create a **Reference Customer Strategy**:

## 🤝 Reference Customer Strategy

### Ideal Reference Criteria
For this specific deal, prioritize references with:
- ☐ Same industry: ${inputs.industry}
- ☐ Same region: ${regionMap[inputs.region] || inputs.region}
- ☐ Similar size: ${inputs.dealSize}
- ☐ Same persona led the decision: ${personaMap[inputs.persona] || inputs.persona}
- ☐ Similar pain points: [Based on their situation]
- ☐ Competed against same alternatives: [Based on competitors mentioned]

### Reference Call Strategy

**When to Offer**
- ✅ Good time: [When in the sales cycle]
- ❌ Too early: [When to avoid]
- 💡 Trigger phrases: "[What the customer says that signals they need a reference]"

**How to Position the Offer**
> "Would it be helpful to talk to someone who's been through this exact evaluation? I know the [role] at [company type] who had very similar concerns about [X]. I could set up a 20-minute call if that would be useful."

**Preparing the Reference**
Before the call, brief your reference on:
- [ ] Prospect's main concerns: [Specific to this deal]
- [ ] Questions they'll likely ask: [Predict 3-5]
- [ ] Points to emphasize: [Key proof points]
- [ ] What to avoid: [Sensitive topics]

### Reference Call Format
**Suggested agenda (30 min)**:
1. (5 min) Introductions and context
2. (10 min) Reference shares their journey
3. (10 min) Prospect Q&A
4. (5 min) Wrap-up and next steps

**Key questions to plant** (suggest the prospect ask):
- "[Question that surfaces a key strength]"
- "[Question about implementation]"
- "[Question about ROI/results]"

### Alternative to Live Reference
If no perfect reference is available:
- **Video testimonials**: [What's available]
- **Written case studies**: [Relevant ones]
- **Peer review sites**: G2, TrustRadius quotes
- **Conference recordings**: Customer sessions

### Post-Reference Call
Follow up within 24 hours:
- Thank the reference
- Debrief with the prospect: "What resonated most from that conversation?"
- Use their feedback to address remaining concerns

Tailor this to the ${inputs.industry} industry and ${personaMap[inputs.persona] || inputs.persona} buyer.`;
            }
            
            // Default: Generate full enablement kit for multiple selections
            return `Create a comprehensive sales enablement kit for this opportunity:

${dealContext}

**Selected Asset Types:** ${assetsRequested}

---

Generate a sales enablement kit with these sections:

## 1. Executive Briefing
A one-page summary the AE can read in 2 minutes before the call. Include:
- What this customer cares about (based on persona + industry + pain)
- The 3 most important things to convey
- What success looks like for this deal

## 2. Talk Track
A conversation guide appropriate for the ${inputs.dealStage} stage:
- Opening (how to frame the conversation)
- Key questions to ask
- Key points to make (with specific proof points)
- Transition to next step

Write this as actual dialogue the AE could use, not bullet points.

## 3. Proof Points
Region- and industry-specific evidence:
- Relevant customer references (name industries/regions, even if fictional examples)
- Quantified outcomes (ROI, time savings, etc.)
- Third-party validation (analyst quotes, awards)

## 4. Objection Handlers
For each known objection, provide:
- **Objection:** [What they'll say]
- **Acknowledge:** [Validate without agreeing]
- **Reframe:** [Shift perspective]
- **Evidence:** [Specific proof]
- **Bridge:** [Transition back to value]

## 5. Competitive Positioning
How to win against the alternatives mentioned:
- Key differentiators (specific, not generic)
- Questions that expose competitor weaknesses
- Traps to avoid

## 6. Recommended Assets
For each selected type (${assetsRequested}), provide specific recommendations:
| Asset Type | Specific Recommendation | When to Use | How to Position It |
|------------|------------------------|-------------|-------------------|

## 7. Next Steps
- Suggested call-to-action for this conversation
- What to send after the meeting
- Timeline recommendations

Make this immediately usable. Write in a tone the AE can use directly with the customer.`;

        case 'content-localization':
            const regionsList = Array.isArray(inputs.regions) ? inputs.regions : ['dach'];
            const regionDescriptions = {
                'dach': 'DACH (Germany, Austria, Switzerland) — German language',
                'france': 'France — French language',
                'spain': 'Spain — European Spanish',
                'italy': 'Italy — Italian language',
                'nordics': 'Nordics (Sweden, Norway, Denmark, Finland) — English with Nordic cultural adaptation',
                'japan': 'Japan — Japanese language',
                'latam': 'Latin America — Brazilian Portuguese and Latin American Spanish',
                'mena': 'MENA (Middle East & North Africa) — Arabic language'
            };
            const regionsFormatted = regionsList.map(r => regionDescriptions[r] || r).join('\n- ');
            
            const toneInstructions = {
                'preserve': 'Preserve the original tone as closely as possible while adapting for cultural context.',
                'adapt': 'Adapt the tone to match local business communication norms.',
                'formal': 'Make the tone more formal across all regions.',
                'casual': 'Make the tone more conversational and approachable.'
            };
            
            return `Localize this content for the specified regions:

## SOURCE CONTENT
**Content Type:** ${inputs.contentType}
**Product (if specified):** ${inputs.product || 'Not specified'}

---
${inputs.sourceContent}
---

## TARGET REGIONS
- ${regionsFormatted}

## INSTRUCTIONS
**Tone:** ${toneInstructions[inputs.tone] || toneInstructions['adapt']}
**Industry Context:** ${inputs.industry || 'General / Cross-Industry'}
**Special Instructions:** ${inputs.specialInstructions || 'None'}

---

For EACH target region, provide:

## [Region Name]

### Localized Content
Provide the fully localized version of the content in the target language (or culturally adapted English for Nordics).

### Adaptation Notes
Explain key changes made:
- **Tone shifts:** How did the voice change for this market?
- **Terminology:** Key terms that were adapted (provide a small glossary)
- **Cultural adaptations:** What was changed for cultural fit?
- **Removed/Added:** Anything removed as inappropriate or added for local relevance?

### Compliance Considerations
Note any regulatory or compliance factors for this region (GDPR, local privacy laws, industry regulations).

### Back-Translation Summary
In one paragraph, summarize what the localized version says (in English) to verify meaning was preserved.

---

Keep product names and trademarked terms in English unless there's a standard local translation.
Maintain all key proof points and statistics from the original.
Flag any claims that may need local verification or adjustment.`;

        case 'launch-planner':
            const workstreamsList = Array.isArray(inputs.workstreams) ? inputs.workstreams.join(', ') : inputs.workstreams;
            return `Create a comprehensive Launch Bill of Materials (BOM) for this launch:

## LAUNCH BRIEFING
**Launch Name:** ${inputs.launchName}
**Target Launch Date:** ${inputs.launchDate}
**Launch Type:** ${inputs.launchType}
**Solutions/Products:** ${inputs.solutions}
**Launch Tier:** ${inputs.launchTier}
**Team Size:** ${inputs.teamSize}
**Primary Audience:** ${inputs.audience}
**Region:** ${inputs.region}

**Workstreams to Include:** ${workstreamsList}

**Additional Context/Requirements:**
${inputs.additionalContext || 'None specified'}

---

Generate a **Launch BOM** as markdown tables, organized by workstream.

## Launch Overview
Brief summary of the launch scope and key milestones.

## Bill of Materials

For each workstream included (${workstreamsList}), create a table:

### [Workstream Emoji] [Workstream Name]

| Deliverable | Timing | Owner | Status | Dependencies | Notes |
|-------------|--------|-------|--------|--------------|-------|
| [Task name] | T-X weeks / Pre-Launch / Launch / Post-Launch | [Role placeholder] | Not Started | [Any blockers] | [Brief context] |

**Timing conventions:**
- T-8 to T-4: Foundation phase
- T-4 to T-2: Production phase  
- T-2 to Launch: Final prep
- Launch: Go-live day
- Post-Launch: Week 1-4 follow-up

**Owner placeholders:** Use role names (PMM, Content, Web, Demand Gen, Enablement, Video, Design, PR, etc.)

**Status options:** Not Started, In Progress, In Review, Complete, Blocked

Include 5-10 tasks per workstream based on the launch tier:
- Tier 1: Full task list
- Tier 2: Key tasks only
- Tier 3: Essentials only

## Key Milestones
List the 5-6 most critical dates/milestones for this launch.

## Dependencies & Risks
Flag any obvious dependencies or risks based on the context provided.`;

        case 'launch-planner-timeline':
            const workstreamsTimeline = Array.isArray(inputs.workstreams) ? inputs.workstreams.join(', ') : inputs.workstreams;
            return `Create a visual T-minus timeline for this launch:

**Launch:** ${inputs.launchName}
**Launch Date:** ${inputs.launchDate}
**Type:** ${inputs.launchType}
**Solutions:** ${inputs.solutions}
**Tier:** ${inputs.launchTier}
**Workstreams:** ${workstreamsTimeline}
**Context:** ${inputs.additionalContext || 'None'}

---

Create a **Visual Timeline** showing the launch countdown:

## 📅 T-Minus Timeline: ${inputs.launchName}

### Phase 1: Foundation (T-8 to T-4 weeks)
| Week | Key Activities | Workstream |
|------|---------------|------------|
| T-8 | [Activities] | [Workstreams] |
| T-6 | [Activities] | [Workstreams] |
| T-4 | [Activities] | [Workstreams] |

### Phase 2: Production (T-4 to T-2 weeks)
| Week | Key Activities | Workstream |
|------|---------------|------------|

### Phase 3: Pre-Launch (T-2 to T-1 week)
| Week | Key Activities | Workstream |
|------|---------------|------------|

### Phase 4: Launch Week
| Day | Key Activities |
|-----|---------------|
| Mon | |
| Tue | |
| Wed | |
| Thu | |
| Fri | |

### Phase 5: Post-Launch (Week 1-4)
| Week | Key Activities |
|------|---------------|

## Critical Path
List the 5-6 items that are on the critical path (if they slip, the launch slips).

## Milestone Checkpoints
Key go/no-go decision points.`;

        case 'launch-planner-raci':
            const workstreamsRaci = Array.isArray(inputs.workstreams) ? inputs.workstreams.join(', ') : inputs.workstreams;
            return `Create a RACI matrix for this launch:

**Launch:** ${inputs.launchName}
**Type:** ${inputs.launchType}
**Team Size:** ${inputs.teamSize}
**Workstreams:** ${workstreamsRaci}
**Context:** ${inputs.additionalContext || 'None'}

---

Create a **RACI Matrix** (Responsible, Accountable, Consulted, Informed):

## 👥 RACI Matrix: ${inputs.launchName}

### Key Roles
Define the typical roles involved based on team size (${inputs.teamSize}):
- **PMM Lead**: Overall launch owner
- **Content**: Blog, whitepapers, scripts
- **Web**: Page builds, updates
- **Demand Gen**: Campaigns, ads, nurture
- **Enablement**: Sales training, toolkits
- **Video**: Demo videos, sizzles
- **Design**: Visuals, creative
- **PR/Comms**: Press, analyst relations
- **Product**: Technical accuracy, roadmap

### RACI by Workstream

| Activity | PMM Lead | Content | Web | Demand Gen | Enablement | Design | PR |
|----------|----------|---------|-----|------------|------------|--------|-----|
| [Activity] | A | R | C | I | I | C | I |

**Legend:**
- **R** = Responsible (does the work)
- **A** = Accountable (final decision maker, only ONE per row)
- **C** = Consulted (provides input)
- **I** = Informed (kept in the loop)

### Key Handoffs
List critical handoff points between teams.

### Escalation Path
Who to escalate to when decisions stall.`;

        case 'analyst-briefing-questions':
            return `Predict analyst questions for this upcoming briefing:

## BRIEFING CONTEXT
**Your Company/Product:** ${inputs.companyName}
**Market Category:** ${inputs.marketCategory}
**Analyst Firm:** ${inputs.analystFirm}
**Briefing Purpose:** ${inputs.briefingPurpose}

**Your Key Positioning:**
${inputs.keyPositioning}

**Known Weaknesses/Gaps:**
${inputs.knownWeaknesses || 'None specified'}

**Primary Competitor:** ${inputs.competitor1}
**Secondary Competitor:** ${inputs.competitor2 || 'N/A'}

**Competitor Claims You've Heard:**
${inputs.competitorClaims || 'None specified'}

**Additional Context:**
${inputs.additionalContext || 'None'}

---

Predict the **10-12 toughest questions** this ${inputs.analystFirm} analyst will ask.

## ❓ Predicted Analyst Questions

Organize by category:

### Market Position & Strategy (3-4 questions)
Questions about your competitive position, market share, strategic direction.
> "Question here"
**Why they'll ask:** [Brief explanation of what they're probing for]
**Trap to avoid:** [Common mistake in answering]

### Product & Capabilities (3-4 questions)
Questions about gaps, roadmap, technical depth.

### Customer Evidence (2-3 questions)
Questions about proof points, references, outcomes.

### Competitive (2-3 questions)
Questions comparing you to ${inputs.competitor1}${inputs.competitor2 ? ' and ' + inputs.competitor2 : ''}.

---

## 🎯 The Question They REALLY Want Answered
What's the underlying concern behind all these questions? What's the analyst trying to figure out about ${inputs.companyName}?`;

        case 'analyst-briefing-cautions':
            return `Write potential "Cautions" for this vendor as a ${inputs.analystFirm} analyst would:

## VENDOR CONTEXT
**Company/Product:** ${inputs.companyName}
**Market Category:** ${inputs.marketCategory}
**Analyst Firm:** ${inputs.analystFirm}

**Their Positioning:**
${inputs.keyPositioning}

**Known Weaknesses:**
${inputs.knownWeaknesses || 'None specified'}

**Competitors:** ${inputs.competitor1}${inputs.competitor2 ? ', ' + inputs.competitor2 : ''}

**Competitor Claims:**
${inputs.competitorClaims || 'None specified'}

---

Write the **"Cautions" section** as it might appear in a ${inputs.analystFirm} ${inputs.analystFirm === 'Gartner' ? 'Magic Quadrant' : inputs.analystFirm === 'Forrester' ? 'Wave' : 'MarketScape'}:

## ⚠️ Potential Cautions: ${inputs.companyName}

Write 4-6 caution statements in authentic analyst voice:

**Caution 1: [Category]**
> "[Write as it would appear in the report - third person, specific, balanced]"

**What this means:** [Brief interpretation for the PMM]
**Evidence needed to address:** [What would change this caution]

**Caution 2: [Category]**
...

---

## Severity Assessment
Rate each caution:
- 🔴 **Critical**: Could affect quadrant/wave position
- 🟡 **Moderate**: Will appear but won't dominate narrative  
- 🟢 **Minor**: Worth addressing but not a major concern

## What Competitors Won't Have
Balance with 2-3 cautions the analyst would likely write about ${inputs.competitor1}${inputs.competitor2 ? ' and ' + inputs.competitor2 : ''}.`;

        case 'analyst-briefing-evidence':
            return `Build a counter-evidence package for this analyst briefing:

## BRIEFING CONTEXT
**Company/Product:** ${inputs.companyName}
**Market Category:** ${inputs.marketCategory}
**Analyst Firm:** ${inputs.analystFirm}

**Your Positioning:**
${inputs.keyPositioning}

**Known Weaknesses:**
${inputs.knownWeaknesses || 'None specified'}

**Competitors:** ${inputs.competitor1}${inputs.competitor2 ? ', ' + inputs.competitor2 : ''}

---

Based on likely analyst questions and potential cautions, create a **Counter-Evidence Package**:

## 📋 Evidence Needed

For each area of likely concern, specify:

### 1. [Concern Area]
**Likely Question/Caution:** [What they'll probe]

**Evidence to Prepare:**
| Evidence Type | Specific Item | Source | Status |
|---------------|---------------|--------|--------|
| Customer Reference | [Named customer, outcome] | [Where to get] | Needed |
| Data Point | [Specific stat] | [Source] | Have / Need |
| Third-Party | [Analyst quote, benchmark] | [Source] | Have / Need |

**Talking Points:** 2-3 key points to make when this comes up

### 2. [Next Concern Area]
...

---

## 🎯 Must-Have Evidence
The 5 most critical evidence items to bring to this briefing:
1. [Item + why critical]
2. ...

## Nice-to-Have Evidence
Additional proof points that would strengthen the narrative.

## Reference Customers to Prep
Which customers should be prepared for follow-up analyst calls?`;

        case 'analyst-briefing-checklist':
            return `Create a briefing preparation checklist for this ${inputs.analystFirm} meeting:

## BRIEFING CONTEXT
**Company/Product:** ${inputs.companyName}
**Market Category:** ${inputs.marketCategory}
**Analyst Firm:** ${inputs.analystFirm}
**Briefing Purpose:** ${inputs.briefingPurpose}

**Your Positioning:**
${inputs.keyPositioning}

**Known Weaknesses:**
${inputs.knownWeaknesses || 'None specified'}

**Competitors:** ${inputs.competitor1}${inputs.competitor2 ? ', ' + inputs.competitor2 : ''}

---

Create a comprehensive **Briefing Preparation Checklist**:

## ✅ Pre-Briefing Checklist: ${inputs.analystFirm} ${inputs.briefingPurpose}

### 1 Week Before
- [ ] **Analyst Research**
  - [ ] Read analyst's recent research on this market
  - [ ] Review their previous coverage of ${inputs.companyName}
  - [ ] Note their coverage of ${inputs.competitor1}${inputs.competitor2 ? ' and ' + inputs.competitor2 : ''}
  - [ ] Check their social media/blog for recent POVs

- [ ] **Content Preparation**
  - [ ] Update deck with latest proof points
  - [ ] Prepare evidence package for key claims
  - [ ] Draft responses to predicted tough questions
  - [ ] Prepare "leave-behind" materials

### 3 Days Before
- [ ] **Internal Alignment**
  - [ ] Dry run with presenters
  - [ ] Align on key messages and what NOT to say
  - [ ] Assign question handlers by topic
  - [ ] Prepare "parking lot" approach for off-topic questions

- [ ] **Reference Prep**
  - [ ] Alert reference customers about potential follow-up
  - [ ] Brief references on key messages
  - [ ] Have 2-3 backup references ready

### Day Before
- [ ] **Final Prep**
  - [ ] Test technology (video, screen share, audio)
  - [ ] Print/load all materials
  - [ ] Review analyst's latest publications one more time
  - [ ] Mental prep: anticipate the uncomfortable question

### Day Of
- [ ] **Before the Call**
  - [ ] Join 5 minutes early
  - [ ] Have evidence package open and ready
  - [ ] Have backup presenter ready if needed
  
- [ ] **During the Call**
  - [ ] Take notes on analyst reactions and follow-up questions
  - [ ] Note any commitments made
  - [ ] Ask for the analyst's perspective at the end

### Immediately After
- [ ] Send follow-up email with any promised materials
- [ ] Debrief internally while fresh
- [ ] Log notes in AR tracking system
- [ ] Schedule follow-up inquiry if appropriate

---

## 🎯 Top 3 Things to Get Right
1. [Most important success factor]
2. [Second]
3. [Third]

## ⚠️ Top 3 Mistakes to Avoid
1. [Common mistake]
2. [Second]
3. [Third]`;

        case 'launch-planner-risks':
            return `Create a risk register for this launch:

**Launch:** ${inputs.launchName}
**Launch Date:** ${inputs.launchDate}
**Type:** ${inputs.launchType}
**Tier:** ${inputs.launchTier}
**Team Size:** ${inputs.teamSize}
**Context:** ${inputs.additionalContext || 'None'}

---

Create a **Risk Register** for this launch:

## ⚠️ Risk Register: ${inputs.launchName}

### Risk Assessment Matrix

| Risk | Likelihood | Impact | Risk Score | Mitigation | Owner | Trigger |
|------|------------|--------|------------|------------|-------|---------|
| [Risk description] | H/M/L | H/M/L | H/M/L | [Mitigation strategy] | [Role] | [When to escalate] |

**Include risks across these categories:**

### Content & Creative Risks
- Review/approval delays
- Resource availability
- Quality issues

### Technical Risks
- Web/demo environment issues
- Integration dependencies
- Performance concerns

### Timeline Risks
- Scope creep
- Dependency delays
- External factors

### Resource Risks
- Team bandwidth
- Budget constraints
- Skill gaps

### External Risks
- Competitive timing
- Market conditions
- Customer readiness

## Risk Scoring
- **High (H)**: Likely to occur AND significant impact
- **Medium (M)**: Possible OR moderate impact
- **Low (L)**: Unlikely AND minimal impact

## Top 3 Risks to Watch
Highlight the highest priority risks that need active monitoring.

## Contingency Plans
For top risks, provide specific backup plans.`;

        default:
            return inputs.prompt || 'Please provide analysis.';
    }
}
