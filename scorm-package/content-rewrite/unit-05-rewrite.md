# Unit 5: Sales Enablement and the Death of the Static Battlecard
## SAP Internal Training Curriculum

---

## Opening Scenario: The 2 AM Slack

It's 2:14 AM in Singapore. An SAP sales rep is preparing for a 7 AM meeting with a prospect who just told him—yesterday afternoon—that Microsoft Fabric is also in the evaluation. He needs competitive positioning. Now.

He checks the enablement portal. The Fabric battlecard was last updated four months ago. It doesn't address the new Fabric features announced at Ignite. It doesn't cover the pricing changes. It doesn't mention the partnership with Databricks that the prospect specifically asked about.

He does what reps increasingly do: He opens Claude, pastes in the prospect's concerns, and asks for help.

Claude gives him a serviceable response—but it's generic. It doesn't know SAP's current positioning, our latest customer wins, or the specific objection handlers that have worked in competitive situations.

The rep goes into the meeting with half-current information and a prayer.

**This scenario plays out dozens of times daily across SAP's sales organization.** The question isn't whether we create enablement content. We create plenty. The question is whether it's available, current, and useful in the moment of need.

---

## The Enablement Gap Analysis

We surveyed 150 SAP sales reps across regions. The findings:

| Question | Response |
|----------|----------|
| "I can find what I need in the portal within 5 minutes" | 23% agree |
| "Competitive content is current enough to use confidently" | 31% agree |
| "I've used AI to help me instead of internal resources" | 67% yes |
| "The content matches the questions I actually get" | 28% agree |

**The diagnosis:** We're producing content. It's just not reaching sellers in useful form.

### Where Enablement Breaks Down

**Discovery failure:** Rep can't find the asset. Search doesn't work. Navigation is confusing. Content exists but is invisible.

**Currency failure:** Rep finds the asset but doesn't trust it. Last updated date is months ago. Missing recent developments.

**Context failure:** Rep finds current content but it's wrong for their situation. Generic when they need specific. High-level when they need technical.

**Format failure:** Content exists but in wrong format. They need a talk track; they get a PDF. They need a data point; they get a 40-slide deck.

---

## Workshop Exercise 1: The Rep Shadow

**Assignment:** Shadow a sales rep for a half-day (or review their recent Gong calls). Document:

1. What questions did they face?
2. What content did they try to find?
3. Did they find it? How long did it take?
4. Was it useful? If not, why?
5. What did they do instead?

**Bring to discussion:** One specific moment where enablement failed and what would have fixed it.

---

## The Knowledge Architecture

Static artifacts (battlecards, pitch decks, one-pagers) assume we can anticipate every situation. We can't.

The alternative: **modular knowledge architecture**—building blocks that can be assembled for context.

### The Building Blocks

**1. Positioning modules**
Core messaging, differentiation, value propositions—in reusable chunks.

**2. Proof points**
Customer wins, metrics, quotes—tagged by industry, use case, region.

**3. Objection handlers**
Specific objections with tested responses—rated by effectiveness.

**4. Competitive intelligence**
Per-competitor: positioning, weaknesses, talk tracks—continuously updated.

**5. Technical depth**
Integration details, architecture, requirements—for technical buyers.

**6. Commercial guidance**
Pricing, packaging, negotiation—with guardrails.

### How It Assembles

**Scenario:** Rep is meeting with a German manufacturer evaluating SAP Datasphere vs. Snowflake for real-time analytics.

**Old model:** Rep searches portal for "Datasphere battlecard" and "Snowflake competitive." Finds two PDFs. Neither addresses manufacturing specifically. Neither mentions real-time use cases.

**New model:** Rep queries the knowledge system: "Datasphere vs. Snowflake, German manufacturer, real-time analytics"

System returns:
- Relevant positioning modules
- Manufacturing customer proof points
- Snowflake-specific objection handlers (ranked by win rate)
- Recent competitive intelligence on Snowflake's real-time gaps
- Technical architecture for real-time scenarios

Assembled on demand. Specific to context.

---

## The AI Enablement Layer

AI doesn't replace knowledge architecture—it makes it accessible.

### Pattern 1: The Intelligent Search
Instead of keyword search, natural language queries against the knowledge base.

**Rep asks:** "How do we respond when customers say Snowflake is cheaper?"

**System returns:** Top 3 objection handlers, ranked by effectiveness + supporting proof points + pricing comparison guidance.

### Pattern 2: The Deal Brief
AI generates custom enablement for specific deals.

**Input:** CRM opportunity data (industry, competitors, stage, notes)

**Output:** Deal-specific brief with relevant positioning, proof points, competitive intelligence, and recommended talk tracks.

### Pattern 3: The Call Prep
Before customer meetings, AI synthesizes relevant information.

**Input:** Meeting invite, past call transcripts, CRM data

**Output:** Context summary, likely questions, suggested talking points, relevant proof points.

### Pattern 4: The Real-Time Coach
During calls (or immediately after), AI surfaces relevant information.

**Integration with Gong/Chorus:** When competitor is mentioned, relevant competitive intelligence appears. When objection is raised, proven handlers surface.

---

## Workshop Exercise 2: The Knowledge Audit

For your product area, evaluate the current state of each building block:

| Building Block | Exists? | Current? | Findable? | Right Format? |
|---------------|---------|----------|-----------|---------------|
| Positioning modules | Y/N | Y/N | Y/N | Y/N |
| Proof points (by segment) | Y/N | Y/N | Y/N | Y/N |
| Objection handlers | Y/N | Y/N | Y/N | Y/N |
| Competitive intel | Y/N | Y/N | Y/N | Y/N |
| Technical depth | Y/N | Y/N | Y/N | Y/N |
| Commercial guidance | Y/N | Y/N | Y/N | Y/N |

**Identify:** Your biggest gap. What would it take to close it?

---

## The Feedback Loop

Enablement that doesn't learn is enablement that decays.

### What to Measure

**Usage metrics:**
- What content is accessed? What isn't?
- Search queries that return no results (signals gaps)
- Time to find information

**Effectiveness metrics:**
- Win rate by content usage
- Objection handler success rates (from call analysis)
- Rep confidence scores

**Currency metrics:**
- Content age by category
- Update frequency
- Competitive intelligence freshness

### The Update Cycle

**Real-time:** Competitive intelligence flows continuously
**Weekly:** Win/loss insights integrated, top objection handlers updated
**Monthly:** Proof points refreshed, positioning validated against field feedback
**Quarterly:** Full audit, archive outdated content, major refresh

---

## The Sales-PMM Partnership

Enablement works when PMMs and sales are partners, not just producer and consumer.

### Sales Contributions

- Field feedback on what works (and what doesn't)
- Competitive intelligence from deal front lines
- Customer quotes and proof points
- Real objections heard (not assumed ones)

### PMM Contributions

- Synthesized positioning and messaging
- Evidence collection and organization
- Competitive research and analysis
- Content creation and maintenance

### Structural Options

**Embedded model:** PMMs aligned to specific sales segments/regions
**Center of excellence:** Central PMM team with regular sales touchpoints
**Hybrid:** Central strategy + embedded execution

**The key:** Regardless of structure, feedback loops must be explicit. Scheduled touchpoints, shared OKRs, joint accountability.

---

## Key Principles (Summary)

1. **Static artifacts fail.** PDFs and battlecards decay immediately. Knowledge architecture scales.

2. **Six building blocks.** Positioning, proof points, objection handlers, competitive intel, technical depth, commercial guidance—modular and tagged.

3. **AI is the interface.** Natural language queries, deal briefs, call prep, real-time coaching—AI makes knowledge accessible.

4. **Feedback loops are essential.** Measure usage and effectiveness. Update continuously.

5. **Partnership, not production.** PMMs and sales share responsibility for enablement success.

---

## Before Unit 6

**Assignment:** Interview one sales rep. Ask them to describe the last time they needed competitive information urgently. What happened? What would have helped?

Document the story and bring to Unit 6 discussion.

---

*This training is a derivative work based on "The Future of Product Marketing: The Practitioner's Guide to the Agentic Era" © 2026 Chris O'Hara. All Rights Reserved. Licensed to SAP for internal training use only.*
