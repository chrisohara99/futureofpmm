# Unit 1: The Evolution of PMM
## SAP Internal Training Curriculum

---

## Opening Scenario: The Midnight RFP

It's 11:47 PM on a Tuesday. Marcus Chen, a senior PMM on SAP's Business AI team, is staring at an RFP response due in 36 hours. The prospect—a Fortune 500 retailer—wants detailed competitive positioning against Salesforce, Microsoft, and three startups Marcus has barely heard of. They want pricing scenarios. They want customer references in retail. They want technical architecture diagrams annotated for their specific AWS environment.

Three years ago, Marcus would have blocked his calendar for two days, pulled in a solutions architect, begged a customer success manager for reference intros, and still delivered something mediocre. That night, he opened Claude, fed it the RFP, connected it to SAP's competitive intelligence repository, and started a conversation.

By 1:30 AM, he had:
- A competitive matrix with cited sources from the last 90 days
- Three positioning angles tailored to retail pain points
- Draft responses to 47 technical questions, flagged by confidence level
- A prioritized list of which sections needed human review

Marcus spent the next day refining—adding the judgment calls, the "what we don't say," the strategic nuance that comes from knowing this prospect's real decision criteria. The final submission was better than anything he'd produced with twice the time.

Here's the question this unit explores: **What exactly did Marcus do that the AI couldn't?**

---

## The Maturity Ladder

We've been running AI pilots across SAP's PMM organization for eighteen months. What emerged wasn't a simple "AI replaces tasks" story—it was a maturity pattern. PMMs progress through distinct stages, each with different AI relationships.

### Stage 1: The Skeptic
*"AI can't understand enterprise software. Our products are too complex."*

These PMMs use AI reluctantly, if at all. They view it as a threat or a toy. Their output hasn't changed much since 2022. They're working harder than ever but not smarter.

**Characteristic behaviors:**
- Manual competitive research (20+ hours per battlecard)
- Original drafting for every deliverable
- Treating AI-generated content as automatically inferior

### Stage 2: The Accelerator
*"AI does my first drafts. I make them good."*

These PMMs discovered speed. They use AI for research compilation, rough drafts, and template generation. Output volume has increased 2-3x. But they're still doing the same work—just faster.

**Characteristic behaviors:**
- AI-assisted first drafts, human refinement
- Prompt libraries for common tasks
- Time savings reinvested in more of the same work

### Stage 3: The Augmenter
*"AI challenges my thinking before I ship anything."*

These PMMs use AI as a sparring partner. They test positioning against simulated objections. They pressure-test messaging with different personas. They catch blind spots before stakeholders do.

**Characteristic behaviors:**
- Red-team prompts before finalizing strategy
- Persona-based message testing
- Competitive simulation ("argue against us as if you were Salesforce")

### Stage 4: The Architect
*"I design systems. AI operates them."*

These PMMs build AI-native workflows—always-on competitive monitoring, automated content pipelines, intelligent enablement systems. They've stopped thinking about AI as a tool and started thinking about it as infrastructure.

**Characteristic behaviors:**
- Standing AI workflows that run without prompting
- Integration with data sources (Gong, G2, analyst feeds)
- Scalable systems, not one-off assists

**Discussion prompt:** Where would you place yourself on this ladder? Where is your team?

---

## Workshop Exercise 1: The Activity Audit

Take 10 minutes. List everything you did last week that could be called "PMM work." Don't filter—include meetings, emails, the random Slack answer, the deck you tweaked at 9 PM.

Now sort them into three buckets:

| Bucket A: Production | Bucket B: Translation | Bucket C: Judgment |
|---------------------|----------------------|-------------------|
| Creating artifacts | Adapting for context | Making decisions |
| Research gathering | Format conversion | Prioritizing |
| Template filling | Stakeholder versions | Navigating politics |
| First drafts | Regional adaptation | Saying no |

**The pattern we've observed:** Most PMMs spend 60-70% of their time in Bucket A, 20-25% in Bucket B, and only 10-15% in Bucket C.

**The opportunity:** AI can handle most of Bucket A and significant portions of Bucket B. Bucket C—the judgment work—remains irreducibly human. The PMMs who are pulling ahead have inverted the ratio. They spend 60%+ of their time on judgment while AI handles production.

---

## The Buyer Has Changed

Here's a conversation that actually happened at a prospect meeting last quarter:

**SAP Sales Rep:** "Would you like me to walk you through our data integration capabilities?"

**Prospect (VP of Data):** "Actually, I had my team's AI assistant pull your technical documentation, your G2 reviews, and three analyst reports. I have specific questions about your Databricks connector latency and how you handle schema drift in streaming scenarios."

The first ten minutes of that meeting were spent catching up to what the buyer already knew.

### What's Different Now

**Before (2020-2023):**
- Buyers researched on vendor websites
- They downloaded gated content
- They scheduled discovery calls to learn basics
- Sales controlled information flow

**Now (2024+):**
- AI assistants do preliminary research
- They synthesize across sources in minutes
- Buyers arrive with specific, technical questions
- Third-party sources (reviews, analysts) carry more weight

**The implication for PMMs:** Your content doesn't just need to persuade humans. It needs to be parseable, quotable, and accurate enough that AI assistants will surface it—and surface it correctly.

---

## Workshop Exercise 2: The Agent Test

Pick one of your product pages or solution briefs. Now ask Claude or ChatGPT:

*"Based on publicly available information, summarize [SAP Product X] in three sentences. What are its main differentiators versus [Competitor Y]? What's unclear or inconsistent in the available information?"*

**What to look for:**
- Did the AI get your positioning right?
- Did it surface your key differentiators?
- What did it get wrong or miss entirely?
- What sources did it weight most heavily?

**The uncomfortable truth:** If your own AI assistant can't accurately describe your product, neither can your prospect's.

---

## The Three Roles

Based on our internal research and external conversations with PMM leaders at Adobe, Salesforce, and Microsoft, we've identified three distinct roles that are emerging:

### Role 1: The Narrator
**Focus:** Messaging, positioning, category strategy

These PMMs own the story. They craft narratives that survive compression—messaging that still works when an AI summarizes it in two sentences. They're masters of clarity and distinctiveness.

**AI relationship:** AI tests narratives against simulated audiences, generates variations, identifies inconsistencies. The human sets direction and makes judgment calls.

### Role 2: The Intelligence Officer
**Focus:** Competitive, market research, win/loss

These PMMs build information systems. They know what's happening in the market before it becomes consensus. They turn data into actionable recommendations.

**AI relationship:** AI monitors, aggregates, and surfaces patterns. The human interprets, prioritizes, and connects dots that aren't obvious.

### Role 3: The Enablement Architect
**Focus:** Sales tools, content systems, knowledge management

These PMMs build for scale. They create assets that work across thousands of sales conversations. They think in systems, not one-off deliverables.

**AI relationship:** AI generates, personalizes, and keeps content current. The human designs systems, sets guardrails, and handles edge cases.

**Discussion prompt:** Which role feels most natural to you? Which is your team weakest in?

---

## Key Principles (Summary)

1. **The ladder is real.** PMMs move from skeptic → accelerator → augmenter → architect. You can skip stages, but you can't skip the learning.

2. **Bucket C is your moat.** Production work (Bucket A) is increasingly commoditized. Judgment work (Bucket C) is where value concentrates.

3. **Buyers use AI too.** Your content must survive AI summarization. If agents can't parse it, prospects won't see it.

4. **Roles are specializing.** The generalist PMM who does a little of everything is being replaced by specialists who go deep in narrative, intelligence, or enablement.

5. **Systems beat heroics.** The PMMs pulling ahead aren't working harder—they've built AI workflows that compound over time.

---

## Before Unit 2

**Assignment:** Run the Agent Test (Exercise 2) on three different SAP product pages. Document:
- What the AI got right
- What it got wrong
- What sources it cited
- One specific fix you'd recommend

Bring your findings to the Unit 2 workshop on Visibility.

---

*This training is a derivative work based on "The Future of Product Marketing: The Practitioner's Guide to the Agentic Era" © 2026 Chris O'Hara. All Rights Reserved. Licensed to SAP for internal training use only.*
