# Unit 11: AI Tools

## The PMM Tech Stack: A Practitioner's Evaluation

**Pragmatic Remix:** Sales Tools → Marketing Plan → Competitive Landscape → Content Creation

---

In late 2025, I put together an AI tools acquisition plan for my PMM organization at a major enterprise software company—fifty-three people across product marketing, competitive intelligence, pricing, and research. The exercise was supposed to take a week. It took three, because the landscape is a mess.

I don't mean the tools are bad. Many of them are excellent. I mean that the number of AI tools claiming to solve PMM problems has exploded past the point where any individual can evaluate them rationally. At last count, there were over 200 tools in the "AI for marketing" category on G2 alone—and that doesn't include the general-purpose LLMs, the developer-focused agent platforms, or the enterprise AI suites that include marketing features as part of a larger offering. A PMM trying to build a coherent tech stack is facing the same problem that CMOs faced with martech a decade ago: too many tools, too many categories, too many vendor claims, and not enough clarity about what actually works in practice.

This unit is my attempt to cut through that noise. Not with a comprehensive market map—those go stale before the ink dries—but with a practitioner's framework for thinking about which tools matter, which categories are real, and how to build a stack that's coherent rather than a Frankenstein of point solutions that each solve one problem while creating three new integration headaches.

## The Core Stack

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/23-tech-stack.svg" alt="PMM Tech Stack Architecture" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 11.1:</strong> PMM tech stack architecture by team maturity level</figcaption>
</figure>

Every PMM needs a foundation layer, and that foundation is a general-purpose LLM assistant. Full stop. If you don't have a Claude, ChatGPT, or Gemini subscription—or if your company hasn't provisioned one for you—fix that before you read another word of this unit. The general-purpose LLM is the Swiss Army knife of the agentic PMM. It's your first-draft generator, your research synthesizer, your brainstorming partner, your copy editor, your data analyst, and your format converter. It's not the best tool for any single one of those tasks, but it's good enough at all of them that it covers 70% of what a PMM needs to get started.

### Choosing Your LLM

When I did the evaluation for my team, I recommended Claude as the primary LLM for a few reasons that I think generalize beyond my specific context. Claude's strength in long-form writing, nuanced analysis, and maintaining context across complex multi-step tasks makes it particularly well-suited to PMM work, where the typical output isn't a quick answer but a positioning document, a competitive analysis, or a strategic recommendation that requires holding multiple dimensions in mind simultaneously.

ChatGPT has strengths in breadth and multimodal capabilities—the image generation and web browsing are genuinely useful—and Gemini has advantages in Google ecosystem integration. But for the core PMM workflow of research, analysis, and writing, Claude was the strongest fit.

### The Core Three

Alongside the LLM, I recommended two other core tools:

**Grammarly Pro**—not for grammar checking, which the LLM handles fine, but for brand voice consistency and tone management across a fifty-person team producing content in multiple channels.

**Perplexity Enterprise** for research—because Perplexity's web-grounded, citation-backed research workflow is better than any general-purpose LLM for the kind of competitive intelligence and market research that PMMs need to do quickly and accurately.

That's the core: Claude for creation and analysis, Grammarly for consistency, Perplexity for research. Three tools. Everything else is additive.

## The Specialist Layer

On top of the core stack, there are category-specific tools that are worth evaluating based on your team's specific needs. I'll cover the categories I've evaluated most thoroughly.

### Competitive Intelligence Platforms

Klue, Crayon, and Kompyte are purpose-built for the continuous monitoring and battlecard workflows I described in Unit 3 and Unit 5. They offer out-of-the-box competitor tracking, automated alerting, and integration with sales enablement platforms. The advantage over building your own CI pipeline from scratch is speed to value and maintenance—these platforms handle the plumbing so you can focus on the intelligence.

The disadvantage is cost (enterprise pricing starts around $30K annually) and flexibility—you're limited to the platform's data sources and synthesis capabilities, which may not match what you can build with a custom agent pipeline.

**My recommendation:** For teams at earlier maturity levels or with smaller budgets, the custom CI pipeline approach I outlined in Unit 3—RSS monitoring plus LLM synthesis plus a structured delivery mechanism—can achieve 80% of what a dedicated platform provides at a fraction of the cost. The trade-off is maintenance: you're building and supporting the infrastructure yourself.

### Content Generation Platforms

Jasper, Writer, and Copy.ai are specialized for marketing content production. They offer brand voice templates, campaign workflows, and team collaboration features that general-purpose LLMs don't provide natively.

I tested these against Claude for our content workflows and found that for commodity content (the bottom layer from Unit 9), they offer a workflow advantage: the templating and brand consistency features save time when you're producing high volumes of channel-specific content. For strategic and signature content, the general-purpose LLM is better because it handles the nuance, context, and analytical depth that content platforms sacrifice for workflow efficiency.

**My recommendation:** Consider content generation platforms if your team produces high-volume commodity content and workflow efficiency is a priority. For strategic content, stick with general-purpose LLMs.

### Demo Automation Platforms

The demo landscape I covered in Unit 10—Demostack, Reprise, Navattic, Arcade, Saleo, Walnut, Consensus—is a distinct category worth evaluating separately from the AI stack. But these tools are increasingly incorporating AI features (auto-personalization, engagement analytics, conversational demo experiences) that make them part of the agent-powered PMM workflow.

**My recommendation:** Evaluate demo platforms based on your specific needs. For product-led growth motions, interactive demo builders (Navattic, Arcade) are high-value. For enterprise sales motions with heavy demo customization, environment platforms (Demostack, Reprise) may be worth the investment.

### Research Tools

Beyond Perplexity, specialized research tools are useful for PMMs who do deep market analysis, pricing research, or product strategy work that requires grounding in quantitative evidence:

- **Elicit** for academic and technical research
- **Consensus** for evidence synthesis across published research
- **Statista** and similar platforms for market data (these aren't new, but they're increasingly AI-augmented)

## The Build-vs-Buy Decision

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/25-build-vs-buy.svg" alt="Build vs Buy Decision Framework" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 11.2:</strong> The build vs. buy decision framework — when to build custom, when to buy platforms</figcaption>
</figure>

The most important decision in building your PMM tech stack isn't which tool to buy. It's whether to buy a specialized tool or build a custom workflow using the general-purpose LLM and agent platforms.

I've seen this play out across my team and across the PMM teams I advise. The instinct—especially for PMMs who don't have a technical background—is to buy. Specialized tools have UIs, onboarding flows, customer success teams, and the psychological comfort of a vendor relationship. The instinct for technically inclined PMMs is to build. Agent platforms like LangChain and CrewAI offer enormous flexibility, and there's a genuine thrill in building a custom system that does exactly what you need.

### The Right Answer

The right answer is usually a combination, and the deciding factor is **maintenance burden**. A CI monitoring pipeline that you build yourself is great—until the RSS feeds break and nobody fixes them, or the LLM's output format changes and the parsing logic fails, or you leave the company and nobody understands how the system works. Purpose-built platforms handle that maintenance. The trade-off is flexibility and cost.

The right answer depends on your team's technical capacity and appetite for maintenance. A PMM with engineering inclinations might genuinely enjoy building and maintaining a custom CI pipeline—the tinkering is part of the appeal. A PMM who finds that kind of work draining should buy the platform and redirect their energy toward the strategic work that only they can do.

David Kim, a PMM at a Series C startup, described his decision process: "I tried building a custom competitive monitoring system using RSS feeds and Claude. It worked great for about six weeks. Then one of my data sources changed their feed format, and suddenly my whole pipeline was broken. I spent an entire weekend debugging instead of preparing for a product launch. That's when I realized the maintenance cost was higher than I wanted to pay. Now I use Klue, and I spend that time on analysis instead of plumbing."

The lesson: be honest about your maintenance tolerance. Building is seductive because the upfront cost is low and the customization potential is high. But the ongoing cost—the weekend debugging sessions, the format changes, the documentation debt—accumulates in ways that aren't obvious until you're already committed.

For most PMMs, I'd recommend this general guidance: buy for workflows that are stable and well-defined, where the platform's maintained infrastructure is worth the cost. Build for workflows that are experimental or unique to your organization, where the flexibility justifies the maintenance investment. And start with the general-purpose LLM for everything, because it's the fastest way to learn which workflows are worth investing in—you can always specialize later.

## Security, Governance, and the Enterprise Reality

I need to address something that every PMM at a large enterprise will encounter: the security and governance conversation. When you propose adopting AI tools for your team, your IT and security organizations are going to have questions—legitimate ones—about data handling, access controls, model training, and compliance.

### The Data Leakage Concern

The most common concern I hear is about data leakage: if PMMs are putting competitive intelligence, pricing strategies, product roadmaps, and customer data into AI tools, where does that data go? Does the AI vendor use it to train their models? Could a competitor's employee, using the same tool, access intelligence that your team provided?

The answer depends entirely on which tier of service you're using:

- **Consumer-tier LLM subscriptions** typically include data in model training unless you opt out.
- **Enterprise tiers**—Claude Team, ChatGPT Enterprise, Gemini for Workspace—typically include contractual guarantees that customer data isn't used for training and that access controls meet enterprise standards.

The cost difference between consumer and enterprise tiers is significant, but for a PMM team handling competitive intelligence and pricing strategy, the enterprise tier isn't optional. It's the cost of doing business responsibly.

### Getting Approval

My advice: don't wait for IT to come to you. Go to them with a proposal that addresses their concerns proactively. Specify which tools you want, at which tier, with which data handling guarantees. Show that you've done the homework on security and compliance.

In my experience, the PMMs who get AI tool adoption approved fastest are the ones who frame it as a responsible business case, not a request for permission to experiment.

## Stack by Team Maturity

Here's the recommendation by team maturity level.

### Solo PMM or Team of 2-3

Start with the core stack: one enterprise-tier LLM (Claude or ChatGPT), Perplexity for research, and whatever content management tool your company already uses.

Invest your time in learning the LLM deeply—building custom prompts for your recurring workflows, experimenting with context window management for complex analyses, and developing a personal RAG system for your competitive and product knowledge.

The general-purpose LLM, used well, can cover 90% of what a small team needs.

### Team of 5-15

Add the specialist layer: a competitive intelligence platform if your competitive landscape is complex enough to warrant it, a content generation tool if your production volume is high, and a demo automation platform if your product supports self-serve evaluation.

At this scale, the integration between tools starts to matter—make sure your CI platform feeds your enablement workflow, your content tool draws from your messaging framework, and your analytics span across tools.

### Team of 15+

You're building an ecosystem, and the biggest risk is fragmentation. Designate a PMM operations role—or at least a PMM who owns the stack—to ensure coherence.

Build the connective tissue between tools: shared knowledge bases, consistent taxonomies, unified analytics. And invest in custom agent pipelines for the workflows that are unique to your organization, because at this scale the general-purpose tools won't cover your specific needs.

## The Practitioner's Playbook: Building Your Stack

**First, start with the core.** Get enterprise-tier access to a general-purpose LLM. Learn it deeply before you add specialized tools. Most PMMs underutilize their LLM because they haven't invested in learning what it can do.

**Second, identify your highest-value workflows.** Where do you spend the most time? What's most painful? What would have the highest impact if it were faster or better? These are the workflows worth investing in—either through specialized tools or custom builds.

**Third, run pilots before committing.** Most specialized tools offer trials. Use them seriously—actually integrate the tool into your workflow for two weeks—before deciding. A tool that looks great in a demo might not fit your actual work.

**Fourth, address security proactively.** Don't wait for IT to ask questions. Prepare the answers. Specify the data handling requirements, identify the enterprise tiers, and make the business case for compliant AI adoption.

**Fifth, avoid the tool tax.** If your team spends more time moving data between tools than using it, the stack needs simplifying. Coherence beats comprehensiveness.

---

## EXECUTIVE PERSPECTIVE

The tools conversation is the one PMM teams bring to leadership most frequently, and here's how it should be evaluated—because understanding the CMO's framework helps any PMM make a better case.

Three criteria matter:

1. **Leverage:** Does this tool enable one person to produce what previously required two, or the same output 50% faster?
2. **Quality:** Does it maintain or improve output quality, or trade quality for speed? A tool that makes you faster at lower quality is a bad investment because the downstream cost of bad intelligence or positioning is higher than the time savings.
3. **Coherence:** Does it fit the existing workflow or create another silo?

The worst outcome—and it happens—is a team with twelve AI tools and no coherent workflow, where the PMM spends half their time copying information between systems. That's not leverage; that's tax.

When making the case for a tool, the strongest signal isn't the vendor's pitch deck. It's a demonstration that you've already tried it, built a workflow around it, and can show the output versus what you were producing before. Don't ask for permission to evaluate. Evaluate first and come with evidence.

## The Human-in-the-Loop Question

Every AI tool raises the same design question: how much human oversight does the workflow need?

At one extreme is full automation—the agent produces output and publishes it without human review. At the other extreme is full oversight—the agent produces a draft and a human reviews every word before anything ships.

Most PMM workflows should land somewhere in between, and the right answer depends on the stakes. I think about it in terms of blast radius: if this output is wrong, how bad is it?

**Low stakes (minimal review):** Internal summaries, research synthesis, first drafts that will be heavily edited anyway. If these are wrong, the cost is a revision cycle—annoying but not damaging.

**Medium stakes (spot check review):** Blog posts, social content, competitive updates. If these are wrong, they could embarrass the company or mislead customers, but the damage is contained and correctable.

**High stakes (full review):** Pricing communications, analyst briefings, customer-facing contractual content. If these are wrong, the consequences could be significant—lost deals, compliance issues, damaged relationships.

Jennifer Park, a PMM who manages AI tool adoption for her team, described her framework: "We categorize every workflow by blast radius, and that determines the review level. Social posts get a quick scan. Competitive battlecards get a detailed review. Anything with pricing or roadmap information gets reviewed by two people. The agent is fast; we add oversight proportional to risk."

The mistake I see teams make is applying uniform oversight—either reviewing everything in detail (which destroys the efficiency gains) or reviewing nothing (which creates quality and risk problems). Match oversight to stakes, and you get efficiency where it's safe and quality control where it matters.

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/29-oversight-matrix.svg" alt="Human-in-the-Loop Oversight Matrix" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 11.4:</strong> The human-in-the-loop oversight matrix — match review level to blast radius</figcaption>
</figure>

## Prompting as a PMM Skill

I'm increasingly convinced that prompting skill—the ability to get useful output from an LLM—is becoming a core PMM competency, and most PMMs dramatically underinvest in developing it.

The difference between a novice prompt and an expert prompt can be the difference between a useless output and a genuinely helpful one. A novice might ask: "Write a competitive analysis of Snowflake." An expert might ask: "Write a competitive analysis of Snowflake for a sales rep preparing for a meeting with a mid-market manufacturing company's data engineering team. Focus on data integration and real-time capabilities. The prospect has mentioned concerns about implementation complexity. Structure the output as talking points, not paragraphs. Include specific questions the rep can ask to probe Snowflake's weaknesses in this context."

The second prompt produces dramatically better output because it provides context, specifies the audience, defines the use case, identifies the key concerns, specifies the format, and requests actionable elements.

Building prompting skill requires practice and experimentation. Try different approaches to the same task. Save your best prompts for reuse. Develop templates for recurring workflows. Notice what makes the difference between outputs that are useful and outputs that need heavy revision.

Marcus Chen, a competitive PMM I work with, keeps a "prompt library"—a collection of prompts that have worked well for different tasks, organized by category and annotated with notes on what makes them effective. That library is as valuable as any software tool in his stack.

## The Obsolescence Question

A question I get asked frequently: won't these tool recommendations be obsolete by the time the book is published?

Probably, in specifics. The tools I've named—Claude, Perplexity, Klue, Jasper—will evolve, and new tools will emerge. Some will merge or be acquired. Some will fade. The landscape is genuinely unstable.

But the framework will hold. You'll always need a core layer of general-purpose AI capability. You'll always face the build-versus-buy decision for specialized workflows. Security and governance will always matter for enterprise adoption. The criteria for evaluating tools—leverage, quality, coherence—won't change even if the tools do.

Focus on building your evaluation framework rather than memorizing tool names. Learn how to assess whether a tool actually works for your specific workflow, not whether it got good press coverage. The tools will change; your ability to evaluate and adopt new tools is the durable skill.

## What Success Looks Like

Let me close with a picture of what a well-functioning PMM tech stack actually looks like in practice.

It's not about having the most tools or the most sophisticated tools. It's about having the right tools, well-integrated, with clear workflows that the whole team understands and uses consistently.

A PMM on a well-functioning stack can get from question to answer faster than a PMM drowning in point solutions. They can produce more output at higher quality because the stack amplifies their capabilities rather than fragmenting their attention. They spend their time on judgment and strategy—the work that only humans can do—rather than on data entry, format conversion, and tool administration.

Rachel Martinez, who leads PMM at a cloud infrastructure company, described her team's evolution: "Two years ago we had eleven tools and constant context-switching. Now we have four tools and clear handoffs between them. Our output has increased by fifty percent while our time spent on tool administration has dropped by seventy percent. That's not because we found better tools—it's because we ruthlessly simplified to what actually works."

The goal isn't the most advanced stack. It's the most effective one. Sometimes that means adopting cutting-edge AI capabilities. Sometimes that means saying no to a shiny new tool because it doesn't fit the workflow you already have working. The PMM who can tell the difference—and who builds the stack that amplifies rather than fragments—has a durable advantage regardless of which specific tools they're using.

## The Integration Tax

One pattern I've seen repeatedly: teams adopt tools that are excellent in isolation but create massive integration overhead when combined.

Consider a typical scenario. A PMM team adopts Claude for writing, Perplexity for research, Notion for documentation, Figma for visuals, HubSpot for marketing automation, and Gong for conversation intelligence. Each tool is strong at what it does. But the workflow requires constantly moving information between them: copy research from Perplexity into Claude for synthesis, paste the output into Notion for review, export to HubSpot for distribution, and manually cross-reference with Gong data to validate customer insights.

That movement—the copying, pasting, exporting, reformatting—is the integration tax. It's invisible in individual tool evaluations but compounds across a workflow. I've seen teams where the integration tax consumes 30-40% of the time that the tools were supposed to save.

The solutions are either native integrations (tools that connect automatically) or middle-layer platforms (Zapier, Make, or custom API connections) that move data between systems without manual intervention. Neither is free—native integrations limit your tool choices; middle-layer platforms add complexity and maintenance burden—but both are usually better than the manual alternative.

Amanda Chen, a PMM operations specialist, described her team's approach: "We now evaluate every new tool against integration cost, not just capability. A tool that's 90% as good but integrates natively with our existing stack beats a tool that's 100% as good but requires manual data movement. The time we save on integration we reinvest in actual work."

The implication for stack design: coherence matters more than individual tool excellence. Three tools that work together seamlessly outperform five tools that each require manual handoffs.

## Learning the Tools

I want to say something that feels obvious but apparently isn't: most PMMs dramatically underutilize their AI tools because they haven't invested in learning how to use them well.

The average PMM uses Claude or ChatGPT the way they'd use Google—type a query, get an answer, move on. They never explore the context window limits, don't understand how to structure multi-turn conversations, haven't experimented with system prompts, and treat every interaction as if the AI has no memory of previous exchanges.

This is like buying a professional camera and only using the automatic mode. You'll get decent photos, but you're missing 80% of what the tool can do.

The PMMs who get 10x leverage from their AI tools are the ones who've invested hours—maybe dozens of hours—in learning the tools' capabilities and limitations. They know that Claude excels at long-form analysis but needs to be prompted differently than ChatGPT. They've developed personal prompt libraries for recurring tasks. They understand when to start a new conversation versus continue an existing one. They've experimented with temperature settings, output formats, and persona prompts.

Daniel Kim, a competitive PMM who's become the de facto AI expert on his team, estimates he spent about forty hours over three months "just playing with the tools." "Most of my colleagues ask me how to do things with Claude that the tool could have taught them if they'd experimented. The investment in learning pays off every single day."

My recommendation: block four hours this week to experiment with your primary LLM. Not to produce anything—just to explore. Try edge cases. Test the limits. Build prompts for your specific workflows and iterate until they work well. That investment will compound for as long as you're using AI tools—which, at this point, means the rest of your career.

## The Model Selection Question

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/24-model-selection.svg" alt="Model Selection Matrix" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 11.3:</strong> Model selection matrix — match model capability to task complexity</figcaption>
</figure>

One decision that trips up PMMs: when to use which model.

The instinct is to default to the most capable model available—Claude Opus or GPT-4 for everything—because capability feels safe. But this is often the wrong choice. The most capable models are also the slowest and most expensive, and for many PMM tasks, the capability difference doesn't matter.

I've developed a rough heuristic based on task complexity:

**Tier 1 tasks (use the fastest, cheapest model):** Simple formatting, data extraction, translation, summarization of straightforward content. Claude Haiku or GPT-4o Mini handles these well at a fraction of the cost and latency of larger models.

**Tier 2 tasks (use the standard model):** Most writing tasks, competitive analysis synthesis, content adaptation, research summarization, standard Q&A. Claude Sonnet or GPT-4o provides good balance of capability and speed.

**Tier 3 tasks (use the most capable model):** Complex multi-step reasoning, subtle positioning work, analysis requiring deep domain nuance, anything where getting it slightly wrong has significant consequences. Claude Opus or GPT-4 for these—accept the cost and latency in exchange for quality.

Sarah Chen, who manages the AI budget for a PMM team of twenty, told me about implementing this tiering system: "We were burning through our Claude Enterprise credits in two weeks because everyone defaulted to Opus for everything. Now we tier our tasks, and the same budget lasts the full month. The quality difference on Tier 1 tasks is imperceptible—you're paying premium rates for capability you don't need."

The model landscape changes rapidly, and specific recommendations will be outdated by the time you read this. But the principle holds: match model capability to task complexity, and you'll get better throughput from your AI budget.

## The Context Window Strategy

Understanding context windows—how much information you can provide to an LLM in a single conversation—is surprisingly important for PMM work, and most PMMs don't think about it strategically.

Modern LLMs have large context windows—Claude can process 200,000 tokens, roughly equivalent to a 400-page book. This creates opportunities that weren't possible with earlier, more limited models. You can load entire product documentation sets, multiple competitive battlecards, full customer transcripts, and extensive positioning frameworks into a single context, then query against all of it simultaneously.

But context window size alone doesn't determine quality. The way you structure the context matters enormously. A context window stuffed with unorganized, redundant, or irrelevant information performs worse than a smaller, well-curated context—even when the smaller context contains less total information.

Patrick Liu, a PMM who's become his team's context engineering expert, described his approach: "I think about context curation the way a lawyer thinks about evidence. What's the minimum I need to include to support the conclusion I want? What will distract or confuse if I include it? What should be in the main context versus available as reference? Structuring the context well can be the difference between a usable output and garbage."

For practical PMM workflows, this means building modular context packages—pre-assembled collections of related documents that you can load together for specific task types. A competitive analysis package might include the latest battlecard, recent monitoring signals, and your positioning framework. A content creation package might include the messaging architecture, style guide, and relevant customer quotes. Having these packages ready to load means you're not building context from scratch every time—and the curation has already been done.

## When to Walk Away

A final thought on the tools question: sometimes the right answer is to not use AI at all.

There are PMM tasks where AI doesn't help—or actively hurts. High-touch relationship work. Sensitive stakeholder conversations. Situations where authenticity matters more than efficiency. Tasks that require presence rather than production.

The trap I see PMMs fall into is treating AI as a hammer and every task as a nail. They start running customer conversations through AI summarization tools even when the nuance matters more than the summary. They generate first drafts for communications that would have been better written from scratch, slowly. They optimize for speed when they should be optimizing for connection.

The PMM who knows when to turn the tools off is often more effective than the PMM who uses them constantly. The tools are leverage, not replacement. And leverage applied inappropriately is worse than no leverage at all.
