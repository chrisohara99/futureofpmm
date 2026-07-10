# Unit 4: Analysts

## Analyst Relations and the Influence Layer

**Pragmatic Remix:** Analyst Relations → Industry Relations → Influencer Relations

---

In 2024, one of my team leads showed me a spreadsheet tracking the time we spent on analyst RFIs—the detailed questionnaires that firms like Gartner, Forrester, and IDC send when they're evaluating vendors for Magic Quadrants, Waves, MarketScapes, and the rest of the industry's competitive evaluation apparatus. The numbers were staggering. A single Gartner Magic Quadrant RFI consumed, on average, 120 person-hours across product marketing, product management, and engineering. We were completing six to eight of these per year across different product lines. That's somewhere between 720 and 960 hours annually—the equivalent of half a full-time employee doing nothing but answering analyst questions.

And here's the thing: most of that time wasn't spent on strategy. It wasn't spent crafting compelling narratives or identifying the perfect customer references or thinking deeply about how to position emerging capabilities. It was spent searching through folders for previous responses, updating capability descriptions that had drifted since the last evaluation, reconciling the answers product management wanted to give with the answers that were actually accurate, and chasing down stakeholders for approvals that should have been routine.

The RFIs are important—that part isn't changing. Gartner alone influences more than $100 billion in enterprise software purchasing decisions annually, and a Magic Quadrant placement can make or break a sales quarter. I've watched deals stall for weeks because a prospect's procurement team wanted to wait for the new Quadrant before making a final decision. I've seen competitive situations flip because a rival moved from Challenger to Leader. The stakes are real. But the process of completing these evaluations is brutally inefficient in ways that haven't changed meaningfully in twenty years.

We built an agent to fix this. Not to replace the human judgment that goes into crafting an RFI response—the strategic decisions about what to emphasize, how to position roadmap items, which customer references to cite—but to handle the mechanical retrieval and first-draft generation that consumed most of those 120 hours. The agent draws from a curated knowledge base of past RFI responses, product documentation, customer success stories, and competitive positioning documents. It generates a first-pass response for each question, pulling from the most relevant source material and flagging where the previous response may be stale or where new product capabilities need to be incorporated.

The result: we reduced RFI response effort by 50 to 60 percent, and in some cases by as much as 70 percent on targeted workflows where the questions closely matched previous evaluations. The quality didn't suffer—in fact, it improved, because the agent was more consistent about pulling in the latest product capabilities and customer proof points than a human working against a deadline and a growing sense of panic. The human's job became editing, strategic adjustment, and the genuinely hard work of deciding how to position emerging capabilities that hadn't been part of previous evaluations.

But the RFI automation story, important as it is, is actually the easy part of what's changing in analyst relations. The harder and more interesting transformation is about what the analysts themselves are becoming—and how the influence landscape is fragmenting in ways that fundamentally change the PMM's job.

## The Analyst Landscape Is Shifting

The big three—Gartner, Forrester, IDC—still dominate enterprise technology purchasing decisions. That's not changing anytime soon. When a CIO is making a multimillion-dollar platform decision, they're still going to reference the Magic Quadrant or the Wave. When a procurement team needs to justify a vendor choice to the board, analyst validation still matters. The institutional credibility of the major analyst firms is deeply embedded in how large enterprises buy technology.

But the way these analysts work is changing. The analysts themselves are processing more vendor information, faster, using their own AI tools. A Gartner analyst evaluating twenty vendors for a Magic Quadrant is almost certainly using AI to help synthesize the mountains of RFI data, briefing notes, and customer reference feedback they receive. They're human—they have opinions, preferences, relationships—but they're augmented humans working with tools that help them extract and compare information at scale.

This means that the structured, specific, evidence-backed communication that works for buyer agents (as we covered in Unit 2 on Messaging) also works for analyst evaluations. Vague claims get filtered out or, worse, get categorized generically in a way that makes you look undifferentiated. Specific capabilities with quantified outcomes get weighted and compared.

I talked to a former Gartner analyst—someone who spent eight years evaluating enterprise software before moving to an advisory role—and she was blunt about how this changes what vendors should submit. "The old game was to sound impressive. Fill the RFI with confident language, vision-forward positioning, the kind of thing that makes executives nod approvingly. That still works in briefings, where I'm reading your body language and forming a gestalt impression. But in RFI processing? I'm looking for specific claims I can verify and compare. 'Industry-leading AI' tells me nothing. '23% accuracy improvement in customer deployments at these three named companies' tells me something I can actually use."

### The Implication for RFI Responses

This shift has a direct implication for how you approach RFI responses. In the past, you could get away with marketing language—aspirational descriptions, vision-forward positioning, the kind of language that sounds impressive but doesn't actually say what the product does. Analysts would read between the lines, ask clarifying questions in briefings, and generally tolerate a certain amount of vendor spin because that's what everyone submitted.

That tolerance is decreasing. When an analyst is using AI to synthesize twenty vendor responses, the AI extracts concrete claims and maps them to evaluation criteria. "Industry-leading AI capabilities" gets mapped to nothing—or worse, gets flagged as the kind of non-answer that suggests you don't have much to say. "Predictive analytics with 15-minute training cycles on datasets up to 50M rows, with documented accuracy improvements of 23% in customer deployments at Acme Corp and GlobalTech" gets mapped to specific criteria with verifiable evidence.

The same specificity principles from Unit 2 apply here: capability layer, evidence layer, architecture layer. Your RFI responses should be optimized for extraction by AI systems, because that's increasingly how analysts are processing them. The analyst is still the decision-maker—they're still applying judgment about what the criteria mean and how to weight different factors—but the raw material they're working with is being pre-processed in ways that reward specificity and punish vagueness.

## The Expanding Influence Landscape

At the same time that traditional analyst work is evolving, new influence channels are emerging that require PMM attention. The traditional AR function focused on the big three. The modern influence function needs to think much more broadly.

### Independent Analysts and Practitioners

Independent analysts and practitioners with large followings—people building audiences on Substack, LinkedIn, YouTube, and increasingly on platforms like Threads—are shaping buyer perceptions in ways that didn't exist five years ago. When a respected practitioner writes a detailed comparison of data platforms based on their actual experience implementing them, that content gets shared in Slack channels and buying committee discussions alongside the Gartner report. Sometimes it carries more weight, because it comes from someone who's actually used the tools rather than someone who evaluated vendor briefings.

David Raab, who runs the Customer Data Platform Institute, is a good example of this phenomenon. He's technically an independent analyst, but his influence comes less from a traditional analyst model and more from being the recognized expert on CDP technology—someone who's been tracking the category since before most vendors knew what to call themselves. When David publishes a comparison or names winners in his Real CDP certification program, buyers pay attention because they trust his judgment and his independence. His methodology is public, his opinions are clearly stated, and his business model doesn't depend on vendor sponsorships in ways that compromise his credibility.

These independent voices operate differently from traditional analysts. They're not bound by vendor relationships or standardized evaluation methodologies. They write what they think based on what they've seen. They can be brutally honest in ways that institutional analysts can't be—because their credibility depends on honesty, not on maintaining access to vendor briefings. And their audiences trust them precisely because of that independence.

For PMMs, this creates both opportunity and risk. The opportunity: a positive mention from a respected practitioner can drive awareness and credibility in ways that feel more authentic than a Magic Quadrant placement. The risk: a negative experience, shared publicly, can spread faster than any analyst report and be harder to address because you don't have a formal relationship to lean on.

### The AI Influence Layer

And then there's the AI influence layer—the GEO dimension we covered in Unit 2. When a buyer asks Perplexity or ChatGPT to recommend data platform vendors, the AI's response is shaped by the same content that shapes analyst opinions: product documentation, review sites, published evaluations, customer case studies, and vendor content. This isn't analyst relations in the traditional sense, but it's influence—and managing it requires many of the same skills: understanding what the evaluating entity is looking for, ensuring your story is told accurately and compellingly in the channels that matter, and maintaining the consistency and evidence depth that builds credibility.

The AI influence layer is particularly important because it operates continuously and at scale. A Gartner analyst publishes an evaluation once a year. An AI search engine answers thousands of vendor evaluation questions every day. The aggregate impact of how your product is represented in AI responses may exceed the impact of any single analyst report—not because any individual AI response is more influential, but because there are so many of them and they're happening at every stage of the buyer journey.

I ran an experiment last month: I asked Claude, ChatGPT, and Perplexity the same question—"What are the leading customer data platforms for enterprise retail?"—and compared the responses. The overlap was significant but not identical. All three mentioned the major players, but the framing, the specific strengths highlighted, and the competitive comparisons varied meaningfully. One cited a recent Gartner report. Another emphasized G2 review scores. A third pulled from a detailed technical comparison someone had published on Medium. The buyer who uses AI to research vendors is getting a synthesized view that blends these sources—and if your product is poorly represented in any of them, you're disadvantaged in ways you might never see directly.

### Review Sites and Peer Communities

G2, TrustRadius, Gartner Peer Insights, and similar platforms have become significant influence channels in their own right. The transformation here isn't that reviews exist—they've existed for years—but that they're becoming primary sources for AI synthesis and, increasingly, for buyers who trust peer experience over vendor claims or even analyst evaluations.

A product with 4.5 stars and 200 reviews on G2 has a credibility signal that's hard to replicate through other channels. The reviews are written by actual users describing actual experiences. Yes, vendors influence the process—they solicit reviews from happy customers, they respond to negative reviews, they optimize their profiles—but the core signal is peer-generated in a way that analyst reports are not.

These platforms also feed the AI influence layer directly. When ChatGPT or Perplexity synthesizes vendor information, they draw heavily on review sites because the content is user-generated, detailed, and frequently updated. Your G2 profile isn't just a review page—it's training data for every AI system that answers vendor evaluation questions. If your reviews mention specific strengths, those strengths get cited. If your reviews mention specific weaknesses, those weaknesses get cited too.

## The PMM as Influence Architect

The traditional AR function is relatively narrow: manage the relationship with Gartner, Forrester, and IDC analysts who cover your category. Prepare for briefings. Respond to RFIs. Lobby for positioning. Provide customer references. Track placements. It's a well-defined job with clear activities and measurable outcomes.

In the agentic era, the AR function expands into something broader that I've started calling influence architecture: the deliberate design and management of how your product is perceived across all the evaluation channels that matter to your buyers. This includes traditional analysts, but it also includes independent voices, AI systems, peer communities, and the increasingly important layer of customer advocates who share their experiences publicly.

Rachel Kim, who leads analyst relations at an enterprise AI company, described the shift in how she thinks about her role. "Three years ago, I was the Gartner person. I managed analyst relationships, I coordinated briefings, I ran the RFI process. That was the job. Now I think of myself as owning influence infrastructure—all the places where buyers form opinions about us before they talk to sales. The analysts are still the biggest single piece, but they're maybe 40% of what I think about. GEO, review sites, independent experts, customer advocacy—all of that is influence infrastructure, and all of it needs strategy."

### The Skill Set Shift

The skill set shifts accordingly. The traditional AR skill was relationship management—knowing the analyst, understanding their evaluation criteria, building rapport over time, earning their trust so they'd tell you what they really think and give you a fair hearing. That skill still matters. You can't outsource relationship-building to an agent, and the analysts who influence billions of dollars in purchasing decisions are still humans who respond to genuine connection and demonstrated expertise.

But the influence architect also needs to think about dimensions that traditional AR didn't touch:

**Structured information delivery:** How do you make your story evaluable by AI systems and AI-augmented analysts? This means the same four-layer positioning from Unit 2—narrative, capability, evidence, architecture—applied specifically to the content that analysts and AI systems will process. It's not enough for your story to be compelling to humans; it needs to be extractable by machines.

**Content strategy for influence:** How do you ensure the right content exists in the right channels to be surfaced by independent voices and AI search? This isn't about creating content for analysts specifically—traditional AR briefing decks don't help here. It's about ensuring that when anyone looks for information about your product category, they find accurate, compelling, and differentiated content that tells your story the way you want it told.

**Evidence management:** How do you maintain a continuously updated library of customer proof points, quantified outcomes, and capability evidence that can be deployed across any influence channel on demand? This is the evidence layer from Unit 2, operationalized: a living database of proof points that's always current and always ready. When an analyst asks for customer references, when an independent expert wants to verify a claim, when an AI system synthesizes your capabilities—the evidence needs to be accessible and fresh.

**Channel monitoring:** How do you track how your product is being represented across influence channels—not just analyst reports, but AI responses, review sites, independent content, and social discussion? This is the competitive monitoring system from Unit 3, extended to include your own brand. You need to know what's being said about you, not just what's being said about competitors.

## Building the RFI Knowledge Base

Let me go deeper on the RFI automation workflow, because it's the most immediately actionable improvement for any PMM who touches analyst relations. Even if you don't have budget for new tools, even if your organization isn't ready for AI adoption broadly, you can start building the knowledge base that makes RFI response dramatically more efficient.

The core insight is that analyst RFIs are repetitive. Not identical—each evaluation has its specific criteria and context—but built from a relatively small set of question types. An AI Magic Quadrant RFI might ask about AI capabilities, data integration, scalability, security, and customer success. A BI Magic Quadrant RFI asks about visualization capabilities, data connectivity, embedded analytics, and enterprise deployment. There's overlap (data integration, security, customer success) and there's differentiation. Over two to three evaluation cycles, you build a corpus that covers most of what any analyst will ask.

### The Knowledge Base Structure

Structure your RFI knowledge base around question types, not specific evaluations. For each question type, maintain:

**The canonical response:** Your best, most complete answer to this question type, updated whenever your product capabilities change. This isn't a template—it's a comprehensive answer that can be edited down for specific evaluations.

**Variation examples:** How this question type has been asked in different evaluations, with the evaluation-specific customizations that were required. This helps the agent understand how to adapt the canonical response for different contexts.

**Evidence inventory:** The customer references, case studies, and proof points that support this response, tagged by industry, use case, and recency. Old evidence is worse than no evidence—if your best reference is from 2021, you need a fresher example.

**Freshness flags:** Indicators of when the response was last validated and whether product changes have made it stale. A response about your AI capabilities from before you shipped your new ML pipeline is probably wrong.

When a new RFI arrives, the agent workflow is:

1. Parse each question and match it to question types in the knowledge base
2. Generate a first-pass response using the canonical response plus evaluation-specific context
3. Flag questions that don't match existing question types (these need human attention)
4. Flag responses where freshness flags indicate potential staleness
5. Compile the draft with citations and evidence gaps highlighted

The human reviews the draft, makes strategic adjustments, and handles the genuinely new questions. The time savings come from not starting from scratch on the 70% of questions that are variations on things you've answered before.

### Maintaining the Knowledge Base

The knowledge base requires maintenance—it's not a one-time build. After each RFI submission, add the final responses back to the knowledge base:

- New question types that weren't previously covered
- Better articulations of existing question types that you developed during this evaluation
- New evidence and proof points that were developed for this evaluation
- Corrections to responses that proved to be stale or inaccurate

Tom Bradley, who runs AR at a mid-market data company, described building his team's knowledge base over eighteen months. "The first two evaluations, we barely saved any time—we were building the corpus while also completing the RFIs. By the third evaluation, we started seeing real leverage. By the fifth, we were cutting response time in half. Now we're on our eighth or ninth cycle, and the knowledge base is genuinely comprehensive. New questions still come up, but they're maybe 20% of any given RFI. The rest is adaptation and curation, not creation."

The compound returns are significant. Every evaluation makes the next one easier. Every new question type, once answered well, becomes an asset. The organizations that start building now will have substantial advantages over those that start later.

## The Analyst Briefing as Intelligence Channel

Most PMMs treat analyst briefings as a pitch—an opportunity to tell the analyst your story, update them on your product, and lobby for favorable positioning. That's not wrong, exactly. You need to communicate your story. But it's an incomplete use of the opportunity.

The better play is to use briefings as intelligence gathering. What are analysts hearing from buyers? What evaluation criteria are shifting? Which competitive narratives are gaining traction? What are they skeptical about in your story? What surprised them in other vendor briefings?

An analyst who trusts you enough to share candid feedback is giving you intelligence that's worth more than the Magic Quadrant placement itself, because you can use it to improve your positioning, your product, and your competitive strategy. The placement is a point-in-time outcome. The intelligence informs everything you do until the next evaluation.

### Shifting Your Briefing Approach

This requires a shift in how you prepare for and conduct briefings:

**Prepare questions, not just talking points.** Yes, you need to communicate your story. But also prepare five to seven specific questions about market dynamics, buyer behavior, and competitive positioning that you want the analyst's perspective on. Good questions to ask: "What are you hearing from buyers about [emerging requirement]?" "How are buyers thinking about the tradeoff between [capability A] and [capability B]?" "What would you want to see from us to view our [specific positioning claim] as credible?"

**Leave time for dialogue.** A briefing that's 55 minutes of presentation and 5 minutes of Q&A is a missed opportunity. I've seen teams deliver such polished, comprehensive presentations that they leave no room for the analyst to push back, ask questions, or share perspective. That's efficient presentation delivery, but it's terrible intelligence gathering. Aim for 30 minutes of presentation and 25 minutes of discussion. Let the analyst interrupt. Welcome skeptical questions.

**Take detailed notes on analyst reactions.** Not just what they say, but how they react. Skepticism about a particular claim? That's a positioning gap you need to address—either the claim isn't credible, or your evidence isn't sufficient, or the analyst has heard something from a competitor that contradicts your story. Genuine interest in a capability you mentioned briefly? That's a differentiation opportunity worth developing.

**Follow up on insights.** When an analyst shares something valuable, acknowledge it and follow up. "You mentioned last time that you're seeing buyers prioritize X—we've been thinking about how to address that, and I'd love to share where we've landed." This builds the relationship and demonstrates that you value their perspective for more than just placement lobbying.

Mira Chen, who spent twelve years in analyst relations before becoming a VP of Marketing, put it this way: "The PMMs who treat analysts as transaction partners—I give you information, you give me placement—never get the full value. The PMMs who treat analysts as intelligence partners—help me understand the market, I'll help you understand my product—those are the ones who build relationships that actually influence outcomes."

## The Practitioner's Playbook

If you own AR or influence at your company, here's where to focus your energy.

**First, build the RFI knowledge base.** Even if you don't automate the full RFI workflow, creating a curated repository of past responses, organized by topic and tagged with recency and accuracy flags, will cut your response time significantly. Every time you complete an RFI, add the final responses to the knowledge base with metadata about which evaluation it was for, which analyst, and when. Over two to three evaluation cycles, you'll have a corpus that an agent can draw from effectively—or that your future self can draw from even without an agent.

**Second, map your influence landscape.** Make a list of every entity that shapes how buyers in your category evaluate vendors: the major analyst firms, the independent analysts and practitioners, the review sites (G2, TrustRadius, Gartner Peer Insights), the AI systems that surface vendor recommendations, the community forums and Slack groups where practitioners share opinions. For each entity, assess your current presence: are you well-represented? Is the information accurate and current? Are there gaps? This map becomes your influence strategy—a prioritized list of channels where investment will move the needle on buyer perception.

**Third, audit your GEO presence.** Ask Claude, ChatGPT, and Perplexity to recommend vendors in your category. What do they say about you? Is it accurate? Is it differentiated? Is it compelling? If you're not appearing, or if the information is stale or inaccurate, that's an influence gap with direct pipeline implications. Document what each AI says and track it over time—as you improve your content and evidence, the AI responses should improve too.

**Fourth, build relationships with independent voices.** Identify the practitioners and independent analysts who matter in your category. Follow their work. Engage authentically—comment on their posts, share their content, offer perspectives that add value. When you have something genuinely interesting to share, they're more likely to pay attention if you've already established yourself as someone who contributes to the conversation rather than someone who only shows up when they want something.

**Fifth, operationalize review site management.** G2 and similar platforms shouldn't be afterthoughts—they should be part of your ongoing influence strategy. Build a systematic process for soliciting reviews from satisfied customers, responding to negative reviews constructively, and ensuring your profile information is current. The compound effect of consistent review site attention is significant over time, both for human buyers who check reviews and for AI systems that synthesize from review content.

---

## EXECUTIVE PERSPECTIVE

Analyst relations is one of the areas where agent-powered workflows have delivered the most tangible ROI—and the RFI automation described in this chapter is a real example from my team. But the broader point is about reframing AR investment entirely.

The traditional model treats analyst relations as a tax—something you have to do to maintain Gartner and Forrester placements, a cost center that doesn't directly generate pipeline, a defensive activity that prevents bad things from happening rather than making good things happen. Every AR leader I know has had the budget conversation where they're justifying headcount based on "we need to maintain our Leader position" rather than "here's how AR contributes to revenue."

In the agentic era, that framing is even less appropriate. When a buyer's agent evaluates vendors, it draws on analyst evaluations as a high-credibility signal. A Leader placement in the Magic Quadrant isn't just a website badge—it's a data point that AI systems weight heavily when filtering vendor shortlists. The ROI of AR isn't just the human buyers who read the report. It's the AI agents that cite the report, multiply it across thousands of queries, and use it to shape recommendations that humans then follow.

The influence landscape framing matters for budget and strategy. Think about influence holistically—analyst placements plus GEO, review sites, independent voices, and the full spectrum of evaluation channels. The PMM who thinks about influence this way will outperform the PMM who treats AR as "the Gartner relationship." And the budget for influence strategy is easier to justify than the budget for analyst relations alone, because the scope of impact is broader and the connections to pipeline are more direct.

The organizational implication: AR might need to expand into a broader influence function, with dedicated attention to GEO, review sites, and independent voices alongside traditional analyst coverage. Some organizations are creating "influence strategist" roles that span all of these channels. Others are expanding the AR remit while keeping the title. The structure matters less than the recognition that influence is broader than analysts and requires coordinated strategy across channels.

