# Unit 5: Enablement

## Sales Enablement and the Death of the Static Battlecard

**Pragmatic Remix:** Sales Enablement → Sales Tools → Presentations → Collateral

---

I want to describe a scene that every product marketer has lived, and that I've lived more times than I can count. It's 4:47 PM on a Tuesday. A Slack message from a sales rep—let's call him Marcus—lands in the PMM channel: "Hey, I'm going up against [Competitor X] in a deal tomorrow morning. Our battlecard is from Q3. Anything new I should know?"

Marcus doesn't want to read a twenty-page competitive analysis. He wants three things: what has changed since the battlecard was published, what objections he's likely to face based on this specific prospect's profile, and what trap-setting questions he can ask to reframe the conversation in his favor. He needs those three things by 8 AM tomorrow. And the PMM who receives this message is already in back-to-back meetings until 6 PM, has a launch brief due on Wednesday, and hasn't looked at Competitor X's latest product announcement because they've been heads-down on a different priority.

So what actually happens? Usually one of three things. The PMM stays late and manually pulls together a quick brief from whatever they can find—which is heroic but unsustainable. Or the PMM points Marcus to the existing battlecard and tells him it's "mostly still accurate"—which might be true but doesn't give Marcus what he needs. Or Marcus goes into the meeting underprepared and relies on general product knowledge, which works fine if the competitor hasn't changed their pitch but fails badly if they have.

This scene—the real-time, deal-specific, competitive-intelligence-on-demand request that the PMM can't possibly fulfill at scale using manual methods—is the single best argument for why the static battlecard is already dead. Not because battlecards aren't useful. Because the format assumes a world where competitive intelligence is stable enough to be captured in a document and refreshed on a quarterly cadence. That world is gone.

The math is brutal. A PMM supporting twenty sales reps, each running three to five competitive deals at any given time, faces a potential sixty to a hundred deal-specific intelligence requests per quarter. Each request, properly answered, requires synthesis across multiple sources—recent competitive moves, prospect-specific context, current pricing, recent customer proof points. Manual fulfillment at that volume is simply impossible. The PMM either becomes a bottleneck, or the sales team stops asking—and neither outcome serves the business.

---

## The Battlecard Is an Artifact. The Intelligence Is a System.

I tested this proposition directly. For an article on futureofpmm.com, I gave the same competitive battlecard brief to Claude and ChatGPT and compared the results. Same competitor, same product, same format requirements. The exercise wasn't really about which AI was better—though the differences were instructive—it was about demonstrating what becomes possible when you treat competitive enablement as a generation problem rather than a document management problem.

The traditional battlecard workflow goes something like this: the competitive PMM gathers intelligence (analyst reports, product announcements, win/loss feedback, sales anecdotes), synthesizes it into a structured document (usually a PDF or a Confluence page with sections for overview, strengths, weaknesses, landmines, objection handling, and trap-setting questions), publishes it to the sales enablement platform, and then updates it somewhere between "quarterly" and "never."

### The Agent-Powered Workflow

The agent-powered workflow inverts this entirely. The intelligence-gathering runs continuously—the monitoring system from Unit 3 feeds into it. The synthesis isn't a document; it's a query. Marcus doesn't open a battlecard. He asks a question: "What do I need to know about Competitor X for a deal with a mid-market manufacturing company evaluating data platforms for supply chain analytics?" And the system generates a response that incorporates the latest competitive intelligence, tailored to the specific deal context, grounded in the same knowledge base that the static battlecard drew from but updated continuously and customized to the ask.

This isn't science fiction. I've seen it working. BattleCoach—the system I mentioned in Unit 3—does exactly this, and not in a demo environment, but in production, supporting live sales cycles. The system ingests the same intelligence sources that would have fed a traditional battlecard and makes them available as a conversational interface. Sales reps can ask questions in natural language. The system provides answers grounded in current competitive data. And because it's a system rather than a document, it doesn't decay—it gets better as more intelligence flows in.

Let me be concrete about what this looks like in practice. A sales rep preparing for a competitive call can ask:

- "What's changed in Snowflake's pricing since last quarter?"
- "What objections am I likely to face from an IT director evaluating us against Databricks?"
- "Give me three trap-setting questions to use if they bring up [specific competitor feature]."
- "How do I respond if they ask about our AI capabilities versus the competitor's?"

Each query returns a response synthesized from the current intelligence base, not from a document that was accurate when it was published but may have drifted.

## The Enablement Paradox

There's an uncomfortable truth lurking beneath the sales enablement transformation, and I want to name it directly: sales reps are getting their own AI tools, and those tools are changing what enablement means.

Two years ago, when a sales rep needed to understand a competitor, they went to the PMM. When they needed to customize a pitch deck, they asked the PMM. When they needed a customer-facing one-pager tailored to a specific industry, the PMM created it. The PMM was the bottleneck—the human through whom all competitive and positioning intelligence flowed on its way to the customer.

Today, a sales rep with a Claude or ChatGPT subscription can generate a reasonably good competitive summary in thirty seconds. They can customize a pitch deck by pasting in the prospect's website and asking the AI to tailor the messaging. They can produce an industry-specific one-pager that's—let's be honest—about 70% as good as what the PMM would have created. Maybe 80%.

### The Paradox Resolved

This creates what I think of as the enablement paradox: the better AI tools get at producing competent sales content, the less sales teams rely on PMMs for that content—but the more they need PMMs for the thing that AI can't provide, which is the strategic intelligence and judgment that makes the content accurate and differentiated rather than merely competent.

A sales rep's AI can generate a competitive comparison. It can't tell you that the competitor's new partnership announcement is actually a defensive move because they're losing deals in the mid-market segment, and that the right response isn't to counter their messaging but to lean into the very use cases they're implicitly conceding by pivoting their strategy. That's PMM intelligence—the kind that comes from deeply understanding the competitive landscape, the buyer psychology, and the market dynamics. And in the agentic era, that intelligence is more valuable than ever because it's the input that makes all the other AI-generated content correct.

The paradox resolves in the PMM's favor when you shift from artifact production to intelligence architecture. A sales rep's AI can produce a generic competitive comparison. A sales rep's AI connected to a well-curated PMM knowledge base can produce a differentiated, accurate, strategically grounded competitive comparison. The difference is the knowledge base—and that's what the PMM owns.

## From Artifact Factory to Intelligence Layer

The role shift this implies is significant, and I want to be clear about it because I think a lot of PMMs are going to be surprised by how fast it happens.

### The Old Model

In the old model, the PMM's sales enablement job was primarily artifact production. You created battlecards, pitch decks, one-pagers, talk tracks, objection-handling guides, customer reference lists, and demo scripts. The quality of those artifacts was how your sales enablement effectiveness was measured—and how, let's be real, you justified your headcount to leadership.

### The New Model

In the new model, the PMM's sales enablement job is primarily intelligence architecture. You design the systems that ensure sales teams have access to accurate, current, contextually relevant competitive and product intelligence at the moment they need it. You curate the knowledge base that the AI tools draw from—because the quality of the AI output is only as good as the intelligence that feeds it. You build the feedback loops that surface what's working in deals and what isn't. You're the person who ensures that when Marcus asks his AI for help with Competitor X, the answer is based on yesterday's intelligence, not last quarter's.

The artifacts still exist. They're just generated, not crafted. And the PMM's job shifts from producing the artifacts to ensuring the intelligence substrate that feeds them is accurate, current, strategically grounded, and differentiated. That's a harder job than producing battlecards. It's also a more valuable one.

## The Knowledge Base as Competitive Moat

Here's something that I don't think enough PMMs have internalized yet: the quality of your internal knowledge base is about to become one of your most important competitive advantages.

In a world where both your sales reps and your competitors' sales reps have access to the same general-purpose AI tools, the differentiator isn't the tool—it's the data the tool draws from. If your competitive knowledge base is deep, current, well-organized, and rich with contextual intelligence (win/loss insights, customer verbatims, deal-specific lessons, analyst perspectives), your AI-powered enablement system produces output that is categorically better than what your competitor's rep gets from the same general-purpose AI.

### RAG Architecture for Enablement

This is where the RAG architecture—retrieval-augmented generation—becomes a PMM responsibility, not just a technical architecture. RAG is the pattern where an AI retrieves relevant information from a curated knowledge base before generating a response, grounding its output in specific, verified data rather than general training knowledge. I wrote a weekend-project tutorial on futureofpmm.com about building a personal RAG system, and the response surprised me. PMMs at companies from Series B startups to Fortune 100 enterprises reached out to say they were building something similar for their sales enablement workflows.

The pattern is straightforward:

1. **Build the knowledge base.** This can be as simple as a well-organized collection of documents in a vector database, or as sophisticated as a purpose-built system with metadata tagging, recency weighting, and source quality scoring.

2. **Populate it with your intelligence.** Competitive intelligence, positioning documents, win/loss analyses, customer case studies, product documentation, analyst coverage—everything that a sales rep might need to answer a question or handle an objection.

3. **Connect it to a generation layer.** The LLM that synthesizes knowledge base content into deal-specific outputs on demand.

4. **Maintain it continuously.** A RAG system is only as good as the knowledge base behind it, and an out-of-date knowledge base produces confidently wrong answers, which is worse than no answer at all.

The PMM who owns and curates this knowledge base—who makes it their job to ensure that the intelligence substrate is excellent—is the PMM who becomes indispensable. Not because they're personally producing every battlecard and one-pager, but because every AI-generated enablement asset in the organization draws from the intelligence they maintain.

## The Knowledge Base Components

What should be in your enablement knowledge base? Here's a framework:

### Competitive Intelligence

- Competitor positioning summaries (updated continuously via your monitoring system)
- Competitive differentiation matrices
- Objection handling guides per competitor
- Trap-setting questions
- Win/loss patterns by competitor
- Recent competitive signals and what they mean

### Product Intelligence

- Current product capabilities with evidence
- Roadmap items (appropriately gated for confidentiality)
- Integration documentation
- Technical architecture explanations
- Use case documentation
- Demo scripts and workflows

### Customer Intelligence

- Case studies with quantified outcomes
- Customer reference database with context
- Customer quotes and verbatims by use case
- Win stories with detail on what worked
- Loss stories with lessons learned

### Market Intelligence

- Industry-specific messaging
- Buyer persona documentation
- Common objections by persona and industry
- Pricing positioning and value messaging
- Analyst perspectives and quotes

Each component should be tagged with metadata: recency (when was this last validated?), confidence (how certain are we this is accurate?), source (where did this come from?), and relevance flags (which competitors, industries, use cases does this apply to?).

## Feedback Loops: The Missing Piece

Most enablement systems are one-way: intelligence flows from PMM to sales. The best systems are two-way: intelligence flows from PMM to sales, and feedback flows from sales back to PMM.

When Marcus uses the competitive brief you provided and wins the deal, what did he learn that should feed back into the system? When he loses, what went wrong? What objections came up that weren't covered? What competitor claims did he encounter that weren't in your intelligence base?

### Building the Feedback Loop

The feedback loop has three components:

**Capture:** Make it easy for sales reps to report back. This might be a Slack reaction, a form embedded in the enablement tool, or a structured field in the CRM. The key is friction reduction—if reporting requires more than 30 seconds, adoption will be low.

**Synthesis:** Aggregate feedback into patterns. Individual data points are useful; patterns are strategic. "Three reps this week reported encountering a new competitor objection about AI accuracy" is actionable in a way that three separate reports aren't.

**Integration:** Feed insights back into the knowledge base. This closes the loop: sales feedback improves the intelligence, which improves the next enablement output.

The feedback loop turns your enablement system from static (even if frequently updated) to learning. Over time, the system gets smarter because it's continuously incorporating what's actually happening in deals.

## The Practitioner's Playbook: Rebuilding Sales Enablement

If you're a PMM responsible for sales enablement, here's where I'd start.

**First, audit your knowledge base—and be honest about what you find.** Pull up your competitive battlecards, your positioning documents, your product one-pagers, your customer references. When was each one last updated? How many of them are still accurate? If you fed them to an AI system right now, would the AI produce good output, or would it produce confidently stale output? In my experience, most PMM teams discover that 40–60% of their enablement content is materially out of date. That's not a failure of effort; it's a failure of model. The quarterly-refresh model can't keep pace with a market that shifts weekly.

**Second, pick one competitor and build the full pipeline.** Don't try to boil the ocean. Choose your most important competitor—the one that shows up in the most deals—and build an end-to-end agent-powered enablement workflow for that competitor alone. Set up continuous monitoring. Build a RAG-connected knowledge base with everything you know about them. Create a natural-language interface—even if it's just a well-engineered Claude prompt with your documents loaded as context—that sales reps can query. Get three or four reps to test it for two weeks and give you feedback. Iterate. Then expand to the next competitor.

**Third, redesign your enablement metrics.** If your current metrics are artifact-based—number of battlecards produced, content downloads, deck views—they're measuring the wrong thing. In the agent-powered model, the metrics that matter are: how current is the intelligence (average age of content in the knowledge base), how frequently is it being used (queries per week from the sales team), and most importantly, what's the outcome (win rate in competitive deals where the agent-powered enablement was used versus deals where it wasn't). That last metric is hard to measure cleanly, but even a directional signal is more useful than counting PDF downloads.

**Fourth, train sales on the new model.** The shift from "find the battlecard" to "ask the system" requires behavior change. Sales reps need to understand what they can ask, how to ask it effectively, and how to evaluate the responses. Build training around this—not a one-time session, but ongoing reinforcement as the system evolves.

**Fifth, build the feedback loop from day one.** Don't treat feedback as a phase-two feature. Make it part of the initial workflow, even if it's just a simple mechanism. The feedback data you collect early will shape how you develop the system going forward.

---

## When Enablement Fails

Let me describe what failure looks like, because it's instructive.

A competitive PMM I know—let's call him Daniel—built what he thought was a state-of-the-art enablement system. Agent-powered competitive monitoring, RAG-connected knowledge base, conversational interface for sales queries. On paper, it was exactly what I've been describing in this chapter.

Six months after launch, adoption was at 15%. Sales reps had gone back to asking the same ad-hoc Slack questions they'd always asked, or worse, just winging it in competitive deals.

What went wrong? Three things:

**First, the knowledge base wasn't curated.** Daniel had loaded every document he could find into the system—old battlecards, outdated product specs, presentation decks from two years ago. The agent dutifully retrieved and synthesized this content, producing answers that mixed current intelligence with stale information. Reps quickly learned they couldn't trust the output, and trust once lost is hard to regain.

**Second, the conversational interface was too generic.** The agent could answer questions, but it didn't understand the context of a sales deal—the industry, the stakeholder dynamics, the competitive history. Reps had to provide so much context in their queries that it was faster to just find the information manually.

**Third, there was no feedback loop.** When reps got wrong information and lost deals, there was no mechanism to capture what went wrong and fix it. The same mistakes repeated because the system never learned.

Daniel eventually rebuilt the system, but it took another six months—and by then, sales leadership had lost patience with "AI enablement experiments" and pushed back on further investment.

The lesson: the technology is the easy part. Curation, context, and continuous improvement are what make enablement systems actually work. A mediocre system that's well-maintained beats a sophisticated system that's neglected.

## EXECUTIVE PERSPECTIVE

The enablement paradox is real, and it's happening faster than most PMM leaders expect. Sales teams have adopted AI tools almost overnight—in some cases faster than the PMM teams supporting them. Reps are using ChatGPT to prep for calls, generate email sequences, and produce quick competitive summaries. The natural PMM response is concern: "If sales can do this themselves, what do they need us for?"

The answer is intelligence—the strategic layer that determines whether AI-generated content is right or wrong, differentiated or generic, helpful or dangerous.

From a budget and headcount perspective, this shift is actually clarifying. Justifying PMM value based on artifact output—twelve battlecards per quarter, four product launches—always confused activity with impact. In the agent-powered model, enablement effectiveness becomes more directly measurable: Is sales using the intelligence system? Are win rates improving in competitive deals? Is the time from competitive signal to sales response shrinking? Those are metrics that tie directly to revenue, and that's a better position for the PMM function, not a worse one.

The organizational implication: the PMM who owns the enablement knowledge base—who has the systems thinking to build and maintain it and the competitive expertise to curate it—becomes a strategic asset rather than a content producer. That's a promotion path, not a threat.

The organizational implication is significant: the PMM who owns the enablement knowledge base—who has the systems thinking to build and maintain it and the competitive expertise to curate it—becomes a strategic asset rather than a content producer. That's a promotion path, not a threat.

## The Rep Experience Test

Here's a practical test I've started using when evaluating enablement systems: can a sales rep get the answer they need in under sixty seconds, without leaving the tool they're already using?

Jennifer Walsh, a regional sales director I work with, put it bluntly: "Your PMMs produce great content. But if I have to open a browser, log into Confluence, navigate to the competitive folder, search for the battlecard, and then read a twenty-page document to find the one thing I need—I'm not going to do it. I'm going to wing it."

The sixty-second test forces you to think about enablement from the rep's perspective rather than the PMM's perspective. PMMs think about completeness and accuracy. Reps think about speed and relevance. An enablement system that's 95% complete but takes five minutes to navigate is worse, in practice, than a system that's 80% complete but gives you what you need instantly.

The agent-powered model excels at this because it's conversational. The rep doesn't have to know where the information lives or how it's organized. They just ask: "What should I know about Competitor X's new pricing?" The system figures out where to find the answer and delivers it in a format the rep can use immediately.

Kevin Park, a PMM who implemented this kind of system at a mid-market SaaS company, described the adoption curve: "The first two weeks, usage was light—reps were still defaulting to their old workflows. By week four, queries were up 300%. By week eight, the old battlecard library was basically untouched. The reps had voted with their behavior."

The lesson: enablement quality isn't just about content quality. It's about delivery quality—getting the right intelligence to the right person at the right moment in the format they can actually use.

## What Changes for the PMM

Let me be direct about what this means for how PMMs spend their time.

In the old model, a competitive PMM might spend their week like this: Monday researching competitor updates, Tuesday and Wednesday drafting a battlecard revision, Thursday getting stakeholder feedback and revisions, Friday publishing and announcing the update. That's a full week to get one competitor's battlecard updated.

In the agent-powered model, the week looks different: Monday reviewing the automated intelligence synthesis and flagging strategic implications, Tuesday training sales on a new competitive narrative that emerged from the data, Wednesday doing the customer research interview that feeds the knowledge base, Thursday reviewing the agent-generated battlecard draft and adding the strategic context the agent missed, Friday building the feedback loop that captures what sales learned this week.

The total output is higher. The quality is higher. But the nature of the work has shifted from production to curation, from drafting to directing, from artifact creation to system design.

Some PMMs will find this shift energizing—finally, time to do the strategic work they were hired for instead of the production work that consumed all their hours. Others will find it disorienting—the tangible deliverable that used to define their value is now produced by a system, and their contribution feels less visible even if it's more valuable.

The PMMs who thrive are the ones who lean into the shift rather than resisting it. Build the system. Curate the knowledge. Design the feedback loops. Let the agents handle the drafting. Your value isn't in the document—it's in the intelligence that makes the document right.
