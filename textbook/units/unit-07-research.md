# Unit 7: Research

## Market Research and Customer Insights in the Agentic Era

**Pragmatic Remix:** Market Research → Customer Insights → Voice of Customer → Buyer Personas → Use Cases

---

The research request came at 4 PM on a Friday—the kind of timing that signals either genuine urgency or someone who just remembered a deliverable they'd been avoiding. "We need to understand how mid-market manufacturing companies are thinking about AI adoption for supply chain planning. The exec team has a strategy session on Tuesday." Three business days to understand a market segment's mindset well enough to inform strategic decisions.

In the traditional research model, this request would be impossible. A proper research study—survey design, respondent recruitment, data collection, analysis, presentation—takes weeks even when you have budget and internal alignment. The fast-turnaround alternative, desk research supplemented by a handful of expert interviews, might produce something useful but would feel thin. Either way, the PMM faces the familiar dilemma: deliver something superficial or miss the window entirely.

I've watched this pattern play out dozens of times across companies of every size. The research that actually informs decisions is the research that arrives when decisions are being made—not two weeks later when everyone has already committed to a direction and the research becomes either confirmation or an awkward artifact that nobody knows what to do with. The timing problem has always been the real constraint, more than budget, more than methodology, more than access to respondents.

This is the research problem that agents are reshaping. Not by replacing rigorous primary research—that still matters, probably more than ever—but by making the synthesis layer dramatically faster and more comprehensive. The PMM who can combine agent-powered synthesis of existing knowledge with targeted primary research produces insights that are both timely and substantive. That combination is the new standard, and it's making the old excuses about research timing increasingly hard to sustain.

## Secondary Research: From Hours to Minutes

Secondary research—the synthesis of existing data, reports, articles, and expert commentary—has always been the foundation of market understanding. But the traditional process is time-intensive in ways that are hard to appreciate until you've done it: searching databases, downloading reports, reading through pages of analyst commentary, extracting the three sentences that actually matter to your question, organizing those extracts into a coherent picture, and then realizing you need to go back and search again because the first round surfaced a thread you hadn't anticipated. A thorough secondary research effort might take a week of dedicated PMM time, and even then you'd wonder what you missed.

Agent-augmented secondary research compresses this dramatically. Tools like Perplexity, with built-in web access and citation tracking, can synthesize publicly available information in minutes rather than hours. I ran a test recently—the same research question submitted to a traditional analyst database search versus an agent with web access. The database search required downloading twelve PDFs, skimming about 300 pages of content, and manually extracting relevant findings. Total time: about four hours, and I'm reasonably efficient at this. The agent produced a synthesis with citations in about three minutes. The quality wasn't identical—the database search surfaced some proprietary data that the agent couldn't access—but for a first-pass understanding, the agent got me 80% of the way there in 1% of the time.

But the real power comes from combining web-accessible research with proprietary sources: your company's market intelligence database, past research reports, analyst briefings from firms like Gartner and Forrester, customer interview transcripts, and competitive intelligence your team has gathered over time. When you point an agent at all of these sources simultaneously, you get synthesis that no individual analyst could produce—not because the agent is smarter, but because it can process volume that humans can't.

### The Research Synthesis Workflow

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/14-research-workflow.svg" alt="Research Synthesis Workflow" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 7.1:</strong> The research synthesis workflow — web sources, proprietary sources, agent synthesis, human insight</figcaption>
</figure>

Here's the workflow I've found most effective, refined over probably fifty research requests in the past year:

**Define the research question precisely.** This sounds obvious but it's where most research efforts go sideways. Vague questions produce vague answers—the agent equivalent of "it depends." "How do mid-market manufacturing companies think about AI for supply chain?" is too broad. The agent will return a survey of everything anyone has ever said about AI in supply chain, most of it irrelevant to your actual decision. "What are the top three barriers to AI adoption in supply chain planning for manufacturers with $100M-$500M revenue?" is specific enough to drive useful synthesis. The constraint forces focus, both for the agent and for your own thinking about what you actually need to know.

**Layer the sources.** Start with web-accessible synthesis—Perplexity or similar—then layer in proprietary sources. Your past customer interviews might have relevant quotes. Your analyst briefings might include relevant data. Your competitive intelligence might show how competitors are positioning to this segment. The agent synthesizes across all of these, but you need to feed it the proprietary context. I've seen PMMs skip this step and then wonder why their synthesis reads like a Wikipedia article. The proprietary sources are where the differentiated insights live.

**Validate with primary signals.** Agent synthesis tells you what the public record says. It doesn't tell you whether the public record is accurate or current. Cross-reference against recent customer conversations, sales feedback, and any primary data you have access to. The synthesis is a starting point, not a conclusion—a hypothesis to be tested, not a finding to be reported.

**Surface the confidence level.** Not all insights are equally reliable. Agent-generated synthesis should include confidence indicators: Is this based on recent data or outdated reports? Is there consensus across sources or conflicting perspectives? Is this a direct observation or an inference the agent made? I've started asking agents explicitly: "For each key finding, indicate whether this is well-supported, moderately supported, or speculative based on the sources you accessed." Building this metadata into your research output helps decision-makers calibrate appropriately—and it forces you to think more carefully about what you actually know versus what you're inferring.

### What Agents Can't Do in Secondary Research

The limitation is obvious but worth stating: agents can only synthesize what's been published. For truly novel questions—emerging market dynamics, nascent customer needs, competitive signals that haven't surfaced publicly—agent synthesis will return either nothing or stale information. I ran into this recently when trying to understand how a specific competitor was positioning a new product launch. The agent returned information about their previous product generation, confidently synthesized from press releases and analyst reports that were eighteen months old. The actual positioning had shifted significantly, but the new positioning hadn't made it into any public source the agent could access.

The skill is knowing when agent synthesis is sufficient and when primary research is required. As a rough heuristic: if the question is about established market dynamics, well-documented competitive positions, or historical patterns, agent synthesis is probably enough. If the question is about what's happening right now, what customers are actually thinking today, or how a competitive landscape is shifting—primary research is non-negotiable.

## Primary Research: Agent-Augmented, Not Agent-Replaced

<figure style="margin: 2rem 0; text-align: center;">
  <img src="/diagrams/15-research-matrix.svg" alt="Primary vs Secondary Research Matrix" style="max-width: 100%; height: auto;">
  <figcaption style="margin-top: 0.75rem; font-size: 0.9rem; color: #6b7280;"><strong>Figure 7.2:</strong> Primary vs. Secondary Research — when to use each, and how agents augment them</figcaption>
</figure>

Primary research—customer interviews, surveys, focus groups, ethnographic observation—remains essential for insights that don't exist in the public record. What's changing is how agents augment every stage of the primary research process, from preparation through analysis.

### Interview Preparation

Before a customer research interview, an agent can synthesize everything you know about that customer: their CRM history, support ticket patterns, product usage data, any prior interview transcripts, and publicly available information about their company and industry. This synthesis produces what I've started calling a "customer intelligence brief"—a one-pager that prepares you to ask more relevant questions and follow up more effectively.

The traditional preparation might be: review the CRM record (if you remember to), skim their company website, hope you remember what they told you last time. I've walked into interviews with less preparation than I should have, and the conversations always suffer. You ask questions they've already answered, you miss connections that would have been obvious with context, and you waste precious interview time on ground you could have covered in advance.

The agent-augmented preparation is different: here's a synthesis of their journey with your product over the past eighteen months, the three challenges they've mentioned most frequently in support interactions, the use cases they've explored and the ones they've abandoned, the competitive alternatives they've evaluated based on what they've mentioned to your sales team, recent news about their company including a leadership change last quarter that might affect priorities, and suggested questions based on patterns from interviews with similar customers. That preparation takes the agent about thirty seconds and would have taken me an hour to assemble manually.

Jennifer Polk, who runs customer insights at a mid-sized SaaS company, told me she's started doing this preparation for every customer conversation—not just formal research interviews. "The delta in conversation quality is noticeable immediately. Customers can tell when you've done your homework versus when you're treating them like a stranger. And the insights you surface are dramatically better because you're building on context instead of starting from scratch every time."

### Real-Time Transcription and Synthesis

During interviews, transcription tools—Otter, Fireflies, Gong, Chorus, and a dozen others—capture the conversation. But transcription alone is just the first step. You've turned audio into text; you haven't turned text into insight. Agent-powered analysis can process transcripts immediately after the interview—or in some configurations, in near real-time—to identify themes, extract key quotes, and flag insights that warrant follow-up.

I've seen PMMs use a workflow where, within an hour of completing an interview, they receive an AI-generated summary that includes: key themes discussed with approximate time stamps, notable quotes that might be useful for positioning or content, questions the customer asked that might indicate concerns or interests you should address, areas where the customer seemed hesitant or uncertain, and suggested follow-up topics for the next conversation or for the sales team to pursue.

This doesn't replace the PMM's own analysis—the PMM still needs to interpret what the patterns mean strategically, and the agent will sometimes miss subtext that a human would catch—but it dramatically reduces the time from interview to actionable insight. And critically, it means the insight is available while the conversation is still fresh, when you can still follow up, when the context is still loaded in your memory. A transcript that sits unanalyzed for three weeks might as well not exist.

### Survey Design and Analysis

Survey research has always been a PMM responsibility, and it's one where agent augmentation is particularly powerful—though you have to be careful about where you apply it.

**Survey design:** Agents can help draft survey questions based on your research objectives, flag potential bias in question wording, and suggest response options based on patterns from similar surveys. I'll usually generate a first draft with an agent, then revise heavily—the agent tends toward questions that are technically correct but emotionally flat, and surveys live or die on whether respondents find them engaging enough to complete thoughtfully. The PMM still needs to apply judgment about tone, about which questions might feel intrusive or leading, about how the survey will feel to someone who's giving you ten minutes of their day. But the first-draft quality is significantly higher than starting from scratch, and having something to react to is easier than staring at a blank page.

**Response analysis:** This is where agent augmentation genuinely shines. A survey with 500 responses and open-ended text fields would traditionally require hours of manual coding and analysis—reading each response, categorizing it, tracking frequency, identifying themes. An agent can process those responses in minutes, identifying themes, clustering similar responses, and quantifying sentiment. The PMM's job becomes validating the agent's categorization and interpreting what the patterns mean, rather than doing the pattern-identification manually.

Marcus Chen, a PMM at an enterprise software company, described running a win/loss survey where the open-ended "why did you choose us / why didn't you" field generated over 600 unique responses. "In the old model, I would have either sampled—read maybe a hundred and extrapolated—or spent two full days coding responses. The agent processed all 600 in about four minutes, identified eight distinct themes with sub-themes, and surfaced the quotes I'd want to include in a presentation. I spent an hour validating and interpreting. The total insight quality was higher, and I got a week of my life back."

**Cross-tabulation and segmentation:** Agents excel at finding patterns across dimensions that a human analyst might not think to explore. "Respondents who mentioned pricing concerns were 2.3x more likely to also mention integration challenges" is the kind of correlation an agent surfaces automatically, prompting the PMM to investigate whether there's a strategic connection—whether these are both symptoms of budget-constrained evaluation processes, or whether something about your integration story is making price sensitivity worse. The agent doesn't know the answer, but it surfaces the question you wouldn't have thought to ask.

## Win/Loss Analysis at Scale

Win/loss analysis deserves special attention because it's one of the highest-leverage research activities a PMM can do, and it's been historically constrained by the same time and resource limitations that affect all primary research.

The traditional win/loss program looks something like this: after a deal closes (won or lost), someone—often a third party to ensure candor—conducts an interview with the buyer to understand their decision process. What were they trying to solve? Who else did they evaluate? What were the deciding factors? The insights from these interviews inform competitive positioning, sales enablement, and sometimes product priorities.

The problem is that traditional win/loss programs are expensive and slow. Third-party interviews might cost $500-1,000 each, limiting coverage to a sample of deals. Interview scheduling adds weeks of latency. And the resulting insights are often so delayed that they describe a competitive landscape that's already shifted.

Agent augmentation changes the economics in three ways:

**First, coverage expands.** When analysis time drops from hours to minutes, you can analyze more deals. Some organizations are moving toward analyzing every deal of meaningful size, not just a statistical sample—using CRM data, email threads, call recordings, and any available documentation to reconstruct the decision process even when a formal interview isn't possible. The insight quality per deal might be lower than a dedicated interview, but the coverage is dramatically higher, and patterns surface faster.

**Second, latency compresses.** When analysis is automated, insights can emerge within days of deal closure rather than weeks or months. This means competitive intelligence is actually current—you're learning about how a competitor positioned last week, not last quarter.

**Third, pattern detection improves.** Human analysts are good at qualitative interpretation but struggle with quantitative pattern detection across large datasets. An agent can identify that losses against Competitor X increased 40% after they launched Feature Y, or that deals involving Stakeholder Type Z close at half the rate of deals without that stakeholder. These patterns inform strategy in ways that anecdote-based analysis can't.

But there's a trap here worth naming. Agent analysis of win/loss data is only as good as the data it's analyzing. If your CRM capture is thin—if reps aren't logging competitive mentions, if call recordings aren't transcribed, if loss reasons are selected from a dropdown menu with six generic options—the agent will synthesize garbage and present it as insight. The shift toward agent-augmented win/loss requires a corresponding investment in data capture quality. The organizations getting the most value are the ones that treat CRM hygiene as a competitive advantage rather than an administrative burden.

## Voice of Customer Programs

Voice of customer programs—the systematic collection and analysis of customer feedback across touchpoints—are evolving rapidly in the agentic era. The traditional VoC program aggregates NPS scores, support ticket themes, customer advisory board feedback, and periodic surveys into a quarterly report that influences product roadmap and positioning decisions.

The limitation of the quarterly model has always been obvious: by the time insights are aggregated and reported, they're already stale. The customer who complained about a workflow issue in January might have churned by the time the Q1 report surfaces the pattern in March. The competitive threat that emerged in February might have cost you three deals before anyone connected the dots.

### The Continuous VoC Model

Agent-powered VoC moves from quarterly synthesis to continuous monitoring—not as an aspiration but as a practical reality. The components aren't new; what's new is the ability to synthesize across them in real time.

**Support ticket analysis:** Agents process every support interaction as it happens, categorizing issues, identifying trends, and flagging emerging problems before they become widespread. A spike in questions about a specific integration might surface within days rather than waiting for the quarterly review. I talked to a PMM who caught a competitive displacement pattern this way—support tickets mentioning a competitor's name increased 300% over two weeks, and her team was able to respond with updated competitive positioning before the trend became visible in win/loss data.

**Product usage signals:** For products with usage telemetry, agents can correlate usage patterns with customer feedback. Customers who drop off at a particular workflow step might share common characteristics that inform both product improvements and positioning adjustments. "Customers who don't complete onboarding step 4 are 3x more likely to mention complexity in support tickets and 2x more likely to churn within 90 days" is actionable in a way that abstract NPS trends aren't.

**Social listening:** Agents monitor mentions of your product and category across social platforms, Reddit threads, community forums, and professional networks—synthesizing sentiment and surfacing notable discussions. A thread where practitioners debate your product's strengths and weaknesses is valuable feedback that traditional VoC programs often miss entirely.

**Review site monitoring:** G2, TrustRadius, Gartner Peer Insights, Capterra—agents track new reviews, analyze themes, and flag reviews that require response or investigation. When a negative review mentions a competitive alternative favorably, that's a signal worth understanding. When positive reviews cluster around a use case you hadn't emphasized, that's a positioning opportunity.

### From Aggregation to Synthesis

The shift isn't just about speed; it's about depth. Traditional VoC aggregates metrics: NPS went up two points, support tickets are down 10%, feature X is the most requested. Useful, but shallow. Agent-powered VoC synthesizes narratives: customers who successfully adopt use case Y report high satisfaction, but the path to success involves overcoming onboarding friction that smaller customers describe as "overwhelming"—here are three representative quotes, here's how competitors are addressing similar friction, and here's a correlation with time-to-value that suggests where product investment might have the highest impact.

The PMM's role in VoC shifts from "collect and report data" to "interpret patterns and recommend actions." That's a higher-value activity, and it requires deeper product and market understanding rather than data management skills. The PMM who thrives in this model is the one who can look at the synthesis, spot the signal that matters, and translate it into something product teams and executives can act on.

## Persona Development in Practice

Buyer personas—the archetypal representations of your target customers—are foundational to positioning and messaging work. Traditional persona development involves desk research, customer interviews, sales feedback synthesis, and eventually a documented persona with demographics, goals, challenges, and buying behavior.

The dirty secret of persona work is that most personas are either too generic to be useful or so specific to a moment in time that they're obsolete within a year. "Sarah, the digital transformation leader who values innovation but struggles with legacy systems" describes approximately everyone in the target market and therefore distinguishes no one. Meanwhile, personas built on customer research from 2022 might not reflect how buying processes have shifted since then—different stakeholders involved, different evaluation criteria, different competitive landscape.

### Agent-Augmented Persona Development

Agents accelerate every stage of persona development, but more importantly, they make personas maintainable:

**Initial hypothesis generation:** Based on your product description and target market, an agent can generate draft personas that serve as starting hypotheses. These aren't finished personas—they're informed starting points that focus your primary research on validation and refinement rather than starting from scratch. I've found this useful for getting alignment early: "Here are three hypothesis personas based on what we know. Which of these resonates with what you're seeing in the field?" is a better conversation than "What should our personas be?"

**Interview synthesis at scale:** Across multiple interviews, agents identify patterns that map to persona dimensions: common goals, shared challenges, typical evaluation processes, recurring objections. The patterns emerge faster and more reliably than trying to hold all the interview content in your head.

**CRM validation:** Agents can analyze your CRM data to test whether the personas you've developed actually map to your customer base. "We defined three personas, but 65% of closed deals don't fit any of them cleanly" is useful feedback that prompts persona refinement. Or alternatively: "Persona 2 represents only 15% of deals but 40% of revenue—maybe we should weight our positioning accordingly."

**Continuous updating:** This is the real shift. Personas should evolve as markets change, but nobody has time to redo persona research every quarter. Agent monitoring can flag when customer feedback patterns shift in ways that might indicate persona evolution—new challenges emerging, evaluation criteria changing, buying processes restructuring. You're not rebuilding from scratch; you're maintaining a living asset.

### The Depth Problem

One caution worth dwelling on: agent-generated personas tend toward generic unless you provide specific input. "A technology decision-maker who values efficiency and cost reduction" describes every persona ever documented in the history of B2B marketing. It's not wrong; it's just useless. The depth comes from specific stories, specific quotes, specific behaviors that you've observed in real customer interactions—the moment in an interview when a buyer's voice changed because you touched a real frustration, the offhand comment that revealed an evaluation criterion nobody had mentioned explicitly.

Agents can help organize and synthesize this specificity, but the specificity itself must come from primary research. The PMM who relies entirely on agent-generated personas will produce artifacts that look professional and read generic. The PMM who uses agents to synthesize and maintain insights gathered through direct customer contact will produce personas that actually inform decisions.

## Use Case Development

Use case documentation—the specific ways customers use your product to solve problems—bridges product capabilities and customer needs. It's essential for positioning, sales enablement, and content strategy. Yet most organizations have use cases that are either too abstract ("improve operational efficiency") or too narrow ("configure the API endpoint for Salesforce integration") to be strategically useful.

Agents can identify use cases by analyzing multiple data streams simultaneously:

**Customer interview transcripts:** "What do you use the product for?" is a standard interview question. Across dozens of interviews, agents identify patterns and cluster similar use cases. More usefully, they can identify use cases that customers describe differently but that are functionally similar—different language for the same underlying workflow.

**Support ticket analysis:** Questions customers ask often reveal use cases they're pursuing. "How do I export data to our ERP system?" indicates an integration use case that might warrant documentation. Patterns in support questions can reveal use cases you're under-supporting or use cases that are emerging faster than your documentation can track.

**Product usage data:** For products with telemetry, usage patterns reveal actual use cases as opposed to intended ones. Customers might be using your product in ways you didn't anticipate, and those emergent use cases might be strategically important. Or they might indicate confusion that's worth addressing.

**Competitive analysis:** What use cases are competitors emphasizing? Agent synthesis of competitor content can reveal use cases you might be under-emphasizing or over-emphasizing relative to market expectations.

The research question for use cases is usually: should we go deep on a few use cases or broad across many? Agent analysis can inform this decision by quantifying use case prevalence and value. A use case that's common but low-value might warrant less positioning emphasis than a use case that's less common but highly correlated with expansion revenue and customer advocacy.

---

## EXECUTIVE PERSPECTIVE

Research investment in PMM organizations tends to be inconsistent—heavy investment during annual planning cycles, minimal investment during execution periods. The planning cycle researcher produces a thick market study that informs strategy in November, then spends the next ten months executing on other priorities while the market continues to evolve around them.

The agentic era makes continuous research economically viable in a way it wasn't before. If secondary research synthesis takes minutes instead of days, and if primary research analysis is agent-augmented, the argument for continuous market and customer sensing becomes much stronger. You can afford to stay current because staying current doesn't cost what it used to cost.

The metric shift for research mirrors what we've seen in other PMM activities. Traditional metrics—number of interviews conducted, survey response rates, reports produced—measure activity. They tell you the research function is busy; they don't tell you whether it matters. The metrics that matter are influence: Did research insights change a positioning decision? Did customer feedback surface a product priority that shipped? Did competitive intelligence shift a sales narrative? Those are harder to measure, but they're what justify research investment—and they're what distinguish research as a strategic function from research as an overhead cost.

One organizational pattern worth noting: several companies I've talked to are embedding research capability in PMM pods rather than centralizing it. When every PMM has agent tools for research synthesis, the research bottleneck disappears and insights flow more quickly to decisions. The tradeoff is methodological consistency—a central research function can enforce standards that distributed research might miss. The right balance depends on team maturity and how much methodological rigor your context requires. But the direction is clear: research is becoming a distributed capability rather than a centralized service.

