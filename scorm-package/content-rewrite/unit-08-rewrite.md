# Unit 8: Pricing & Packaging in the Agent Era
## SAP Internal Training Curriculum

---

## Opening Scenario: The Pricing Puzzle

A prospect—a large European retailer—came to us last quarter with a straightforward request: "We want SAP Datasphere. What's the price?"

Simple question. Complicated answer.

Their situation:
- 500 active data users today, growing to 2,000 over three years
- Heavy seasonal spikes (10x query volume during retail peaks)
- Mix of business analysts (self-service BI) and data engineers (heavy compute)
- Replacing Snowflake, where they'd struggled to predict monthly costs

We could price by user (predictable but penalizes growth). By compute (flexible but scary for customers burned by cloud surprises). By data volume (simple but disconnected from value). By some hybrid (accurate but complex).

The sales team asked PMM: "What's the right model for this deal?"

**This scenario captures the modern pricing dilemma:** Pricing isn't just a number—it's a statement about how value gets measured and who bears the risk.

---

## The Pricing Model Landscape

Enterprise software pricing has evolved through distinct eras:

### Era 1: Perpetual License (1980s-2000s)
*"Buy the software. Own it forever."*

- Large upfront payment + annual maintenance
- Predictable for customer (after initial shock)
- Revenue recognition challenges for vendor
- Misaligned incentives (vendor doesn't care about adoption)

### Era 2: Subscription (2000s-2020)
*"Pay annually per user."*

- Lower upfront cost, recurring revenue
- Better alignment (vendor wants renewal)
- Simple to understand and budget
- But: penalizes growth, doesn't scale with value

### Era 3: Consumption (2015-present)
*"Pay for what you use."*

- Elastic scaling, pay-as-you-go
- Aligns with actual usage
- But: unpredictable costs, budget anxiety
- Procurement hates it. CFOs hate it more.

### Era 4: Outcome/Value (emerging)
*"Pay based on results delivered."*

- Pricing tied to business outcomes
- Ultimate alignment
- But: hard to attribute, requires trust
- Works for some use cases, not universal

### The Reality: Hybrid Models
Most enterprise software now blends approaches:
- Base subscription (predictability)
- Usage components (flexibility)
- Capacity tiers (scalability)
- Success fees (alignment)

**The PMM challenge:** Understand which model fits which customer situation—and how to position tradeoffs.

---

## Workshop Exercise 1: Pricing Model Analysis

For your primary product:

1. What's the current pricing model?
2. What behavior does it incentivize for customers?
3. What complaints do you hear from sales/customers?
4. What would be the impact of shifting toward more consumption-based pricing?
5. What would be the impact of shifting toward more predictable subscription pricing?

**Discussion:** Where does your current model create friction? What would you change?

---

## The AI Pricing Challenge

AI capabilities introduce new pricing questions:

### The Compute Problem
AI workloads are resource-intensive. Training models, running inference, processing prompts—all consume compute. Consumption-based pricing for AI features can lead to sticker shock.

**Customer fear:** "What if AI usage explodes and we get a massive bill?"

**Vendor dilemma:** Absorb AI costs in subscription (margin pressure) or pass through (adoption friction)?

### The Value Attribution Problem
When AI automates a workflow, where's the value?
- The AI feature itself?
- The automation it enables?
- The decision quality it improves?

**Pricing question:** Charge for AI as a feature, as consumption, or as embedded capability?

### The Credit Model
Emerging pattern: AI credits as a currency.
- Bundled credits with subscription
- Overage pricing for heavy users
- Predictability with flexibility

**Trade-off:** Simpler than pure consumption, but creates artificial constraints.

### SAP's Approach
We've implemented AI credits across our portfolio. PMMs should understand:
- How credits are calculated
- What activities consume credits
- How to position credit allocation in deals
- How to handle customer concerns about limits

---

## The Packaging Framework

Packaging is how you bundle capabilities into purchasable units. It's distinct from pricing (how you charge for each package).

### Packaging Principles

**1. Clear differentiation**
Each tier should have obvious differences. If customers can't immediately understand why Standard vs. Professional vs. Enterprise, packaging has failed.

**2. Logical upgrade path**
Customers should naturally grow into higher tiers as their needs evolve. Packaging should make expansion feel like natural progression, not a tax.

**3. Minimized shelfware**
Features customers buy but don't use create regret. Packaging should encourage right-sizing, not over-buying.

**4. Competitive positioning**
Packaging should make comparisons favorable—or at least fair. Be thoughtful about what's included at each tier vs. competitors.

**5. Sales simplicity**
Complex packaging slows deals. If sales can't explain it in two minutes, it's too complex.

### Common Packaging Models

**Good-Better-Best:**
Three tiers with progressively more capabilities. Familiar, easy to understand.

**Modular:**
Core platform + add-on modules. Maximum flexibility, but complexity risk.

**Use-Case Bundles:**
Packages aligned to specific outcomes ("Marketing Analytics," "Supply Chain Optimization"). Clear value, but can create overlap.

**All-Inclusive:**
One package, full capabilities. Simplest, but hard to entry-price competitively.

---

## Workshop Exercise 2: Competitive Packaging Analysis

Research your top competitor's packaging:

1. How many tiers do they offer?
2. What's the primary differentiation between tiers?
3. What's included in their base tier vs. ours?
4. Where do they have packaging advantage?
5. Where do we have packaging advantage?

**Deliverable:** One-page competitive packaging summary for sales use.

---

## Pricing Intelligence

PMMs should have ongoing visibility into pricing dynamics:

### What to Monitor

**Competitive pricing moves:**
- List price changes
- Promotional offers
- Packaging restructuring
- New pricing models (watch for consumption shifts)

**Win/loss pricing data:**
- Where did we win on price?
- Where did we lose on price?
- What discounting was required?
- What commercial terms mattered?

**Customer feedback:**
- Pricing objections heard
- Budget constraints mentioned
- Comparison points raised

### Building Pricing Intelligence

**Sources:**
- Sales CRM notes
- Win/loss interviews
- Gong call analysis
- Competitive research
- Partner intelligence
- Customer advisory boards

**Synthesis:**
- Quarterly pricing intelligence brief
- Competitive pricing database (maintained)
- Objection handlers for pricing conversations

---

## The Commercial Conversation

Pricing conversations require PMM support. Sales shouldn't be improvising.

### Common Pricing Objections

**"Competitor X is cheaper."**
- Probe: Cheaper on what basis? List price? TCO? Same scope?
- Response: Depends on comparison—arm sales with specifics

**"We can't predict consumption costs."**
- Probe: What's driving the concern? Past experience?
- Response: Commit models, caps, monitoring tools

**"This doesn't fit our budget cycle."**
- Probe: When is budget set? What would fit?
- Response: Commercial flexibility (timing, terms)

**"Your pricing is too complex."**
- Acknowledge: This is often true
- Response: Help simplify, focus on what matters for their use case

### Commercial Flexibility

PMMs should understand what levers sales has:
- Discount authority (by deal size, segment, situation)
- Payment terms (annual vs. multi-year, upfront vs. arrears)
- Pricing model alternatives (subscription vs. consumption options)
- Bundles and add-ons (packaging flexibility)

---

## The Pricing Roadmap

Pricing evolves. PMMs should participate in pricing strategy:

### Inputs to Pricing Decisions

- Market research (willingness to pay, competitive benchmarks)
- Cost analysis (margin impact)
- Sales feedback (what's working, what's blocking)
- Customer feedback (satisfaction, friction)
- Strategic direction (growth vs. profit optimization)

### PMM Role in Pricing

- **Voice of market:** Bring outside-in perspective
- **Competitive lens:** How pricing affects competitive position
- **Messaging bridge:** Translate pricing decisions into sales narrative
- **Feedback loop:** Channel field input back to pricing teams

---

## Key Principles (Summary)

1. **Pricing models signal value.** Subscription = predictability. Consumption = flexibility. Hybrid = complexity.

2. **AI adds new dimensions.** Compute costs, value attribution, and credit models are the new pricing frontiers.

3. **Packaging is positioning.** Clear differentiation, logical upgrade paths, competitive alignment.

4. **Intelligence is ongoing.** Monitor competitive moves, win/loss data, and customer feedback continuously.

5. **Enable the conversation.** Sales needs objection handlers, commercial flexibility knowledge, and confident positioning.

---

## Closing Assignment

**Create:** A one-page pricing FAQ for your product that answers the five most common pricing questions from prospects.

**Include:** 
- Clear explanation of the pricing model
- How to handle "competitor is cheaper" objection
- What commercial flexibility exists
- How to address consumption uncertainty (if applicable)

---

## Curriculum Summary

Over eight units, you've explored:

1. **The Evolution of PMM** — Maturity ladder, three buckets, the judgment imperative
2. **Visibility** — GEO, the four-layer visibility stack, systematic monitoring
3. **Intelligence** — From reactive to predictive, living knowledge systems
4. **Evaluators** — Analysts and AI as parallel systematic evaluators
5. **Enablement** — Modular knowledge architecture, AI-powered delivery
6. **Content** — The commodity collapse, narrative frameworks, three-tier strategy
7. **Demo Stack** — Storytelling over features, reference strategy, interactive options
8. **Pricing** — Model evolution, AI challenges, packaging principles

**The through-line:** PMM work is being restructured by AI. Production work accelerates. Judgment work intensifies. The PMMs who build systems—for intelligence, enablement, content, and visibility—will outpace those still producing artifacts by hand.

---

*This training is a derivative work based on "The Future of Product Marketing: The Practitioner's Guide to the Agentic Era" © 2026 Chris O'Hara. All Rights Reserved. Licensed to SAP for internal training use only.*
