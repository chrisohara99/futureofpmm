# Future of PMM → SAP Corporate Migration Plan
**Version:** 1.0  
**Date:** September 29, 2026  
**Status:** Phase 1 Planning

---

## Executive Summary

This document maps the existing futureofpmm.com content to the new SAP corporate Book of Work (BoW) structure for handoff to IT. The migration reorganizes content around PMM's 19 capability areas while preserving all existing assets.

**Design Principles:**
- Phase 1: Weekly newsletter + articles mapped to BoW areas (no Labs)
- Phase 2: Labs, assessments, certifications (future)
- All content anchored to specific BoW capability areas
- Three pillars: Disciplined Operations, Connected Community, Continuous Learning

---

## Book of Work Structure

### PMM Leads / Accountable (11 areas)

| # | BoW Area | URL Slug | Description |
|---|----------|----------|-------------|
| 1 | Messaging & Positioning | `/bow/messaging-positioning` | Narrative, value articulation, persona-level messaging, L0/L1 decks |
| 2 | Category, Vision & Use-Case Storytelling | `/bow/category-vision` | Market category framing, vision story, buyer-relevant stories |
| 3 | Market Insights & Signal Synthesis | `/bow/market-insights` | Customer, analyst, competitive, field insights synthesis |
| 4 | Launch Narrative Inputs | `/bow/launch-narrative` | Buyer value, positioning, approved messaging for launches |
| 5 | Adoption & Growth Strategy | `/bow/adoption-growth` | Launch, adoption, expansion, feedback loops |
| 6 | Customer Profiles / Personas | `/bow/personas` | Personas, buying committees, journey needs |
| 7 | Commercialization | `/bow/commercialization` | Pricing narrative, packaging readiness |
| 8 | Launch & Disclosure | `/bow/launch-disclosure` | Tiering, briefs, messaging lock, readiness, post-launch |
| 9 | GTM & Field Readiness | `/bow/gtm-readiness` | Positioning, value prop, objection handling for sales |
| 10 | Demo | `/bow/demo` | Demo prioritization, buyer narrative, use-case strategy |
| 11 | Customer Reference Strategy | `/bow/customer-reference` | Customer proof strategy, story priorities |

### PMM Partners / Supports (8 areas)

| # | BoW Area | URL Slug | Description |
|---|----------|----------|-------------|
| 12 | Marketing Planning | `/bow/marketing-planning` | Product priorities, audience insights for Integrated Marketing |
| 13 | Campaign Execution | `/bow/campaign-execution` | Approved messaging, buyer context for campaigns |
| 14 | Press, Media & Communications | `/bow/press-media` | Product truth, spokesperson context |
| 15 | Partner & ISV | `/bow/partner-isv` | Partner-facing positioning, business value |
| 16 | Pricing Communication | `/bow/pricing-communication` | Buyer-facing value narrative, ROI framing |
| 17 | Community | `/bow/community` | Community strategy, audience priorities |
| 18 | Learning Journeys | `/bow/learning-journeys` | Messaging and role-based content strategy |
| 19 | Customer Journey Content | `/bow/customer-journey-content` | What to say, to which audiences, and why |

---

## Content Inventory & BoW Mapping

### 12-Unit Curriculum → BoW Mapping

| Unit | Title | Primary BoW | Secondary BoW |
|------|-------|-------------|---------------|
| 1 | AI Foundations for PMM | Learning Journeys | - |
| 2 | AI-Powered Visibility (GEO) | Market Insights | Category/Vision |
| 3 | Competitive Intelligence | Market Insights | GTM Readiness |
| 4 | Content Strategy | Customer Journey Content | Campaign Execution |
| 5 | Sales Enablement | GTM & Field Readiness | Launch & Disclosure |
| 6 | Pricing & Packaging | Commercialization | Pricing Communication |
| 7 | Messaging & Positioning | Messaging & Positioning | Category/Vision |
| 8 | Demand Generation | Marketing Planning | Campaign Execution |
| 9 | Buyer Personas | Customer Profiles/Personas | Customer Journey Content |
| 10 | Market Intelligence | Market Insights | Adoption & Growth |
| 11 | Influencer & Analyst Relations | Press/Media/Communications | Community |
| 12 | Segmentation & Targeting | Customer Profiles/Personas | Marketing Planning |

### Labs → BoW Mapping

| Lab | Primary BoW | Status |
|-----|-------------|--------|
| GEO Visibility Test | Market Insights | Live |
| CI Brief Generator | Market Insights | Live |
| Launch Planner | Launch & Disclosure | Live |
| Persona Builder | Customer Profiles/Personas | Ready |
| Messaging Framework | Messaging & Positioning | Ready |
| Battlecoach | GTM & Field Readiness | Ready |
| Segment Builder | Customer Profiles/Personas | Ready |
| Content Audit | Customer Journey Content | Ready |
| Demo Narrative | Demo | Ready |
| Analyst Briefing | Press/Media/Communications | Ready |
| Pricing Rationale | Commercialization | Ready |
| Content Localization | Campaign Execution | Ready |

### Newsletter Archive → BoW Tagging

**30 issues** to be tagged by primary BoW area for archive migration.

| Issue Range | Primary Topics | BoW Areas |
|-------------|----------------|-----------|
| #1-5 | AI Foundations, Tool Stack | Learning Journeys |
| #6-10 | GEO/SEO, Visibility | Market Insights |
| #11-15 | Competitive Intel, Content | Market Insights, Customer Journey Content |
| #16-20 | Sales Enablement, Launches | GTM Readiness, Launch & Disclosure |
| #21-25 | Personas, Demand Gen | Customer Profiles, Marketing Planning |
| #26-30 | Labs, AI Tools, Wrapup | Learning Journeys |

### Articles → BoW Mapping

| Article | BoW Area |
|---------|----------|
| The Great Bifurcation | Category/Vision |
| Content for Two Audiences | Customer Journey Content |
| Where Do You Sit | Category/Vision |
| Competitive Battlecards Guide | GTM & Field Readiness |
| Human Premium | Messaging & Positioning |
| Five Ways Ready for Agentic | Learning Journeys |
| Data Layer Wins Positioning | Messaging & Positioning |
| From Keywords to Entities | Market Insights |
| Buyer Hired Agent | Customer Profiles/Personas |
| Pragmatic Framework AI | Learning Journeys |
| PMM AI Tool Stack | Learning Journeys |
| Is Your Brand AI Visible | Market Insights |

---

## New Site Structure

```
/                           # Homepage (new design)
├── /bow/                   # Book of Work hub
│   ├── index.html          # All 19 areas grid
│   ├── messaging-positioning/
│   │   ├── index.html      # Area overview
│   │   ├── articles/       # Related articles
│   │   ├── playbooks/      # Phase 2
│   │   └── labs/           # Phase 2
│   ├── category-vision/
│   ├── market-insights/
│   ├── launch-narrative/
│   ├── adoption-growth/
│   ├── personas/
│   ├── commercialization/
│   ├── launch-disclosure/
│   ├── gtm-readiness/
│   ├── demo/
│   ├── customer-reference/
│   ├── marketing-planning/
│   ├── campaign-execution/
│   ├── press-media/
│   ├── partner-isv/
│   ├── pricing-communication/
│   ├── community/
│   ├── learning-journeys/
│   └── customer-journey-content/
├── /learning/              # Learning journey (Pillar 3)
│   ├── index.html          # Journey overview
│   ├── curriculum/         # 12 units
│   └── labs/               # Phase 2
├── /community/             # Connected community (Pillar 2)
│   ├── index.html          # Community hub
│   ├── spotlights/         # PMM Spotlights
│   └── office-hours/       # Office hours archive
├── /resources/             # Standards & tools
│   ├── index.html          # Resource hub
│   ├── playbooks/          # Phase 2
│   └── tools/              # AI tools guide
├── /newsletter/            # Newsletter archive
│   ├── index.html          # Archive listing
│   └── issue-XXX.html      # Individual issues
├── /digests/               # Daily digests
│   └── YYYY-MM-DD.html     # Daily digest archive
└── /assistant/             # PMM Assistant CTA
```

---

## Page Templates Needed

### 1. Homepage Template
**File:** `index.html`
- Hero section: "Know the work. Build the skills. Accelerate with AI."
- Three-pillar cards (Know the Work, Build Your Skills, Put AI to Work)
- Book of Work tiles (8 featured areas)
- PMM Assistant CTA bar
- Featured content carousel

### 2. BoW Area Template
**File:** `bow/[area]/index.html`
- Area title and description
- "PMM Leads" or "PMM Supports" badge
- Related articles grid
- Related Labs (Phase 2)
- Related playbooks (Phase 2)
- Cross-links to adjacent areas

### 3. Article Template
**File:** Standard article layout
- BoW area tag at top
- Breadcrumb: Home > Book of Work > [Area] > Article
- Article content
- Related content sidebar

### 4. Learning Journey Template
**File:** `learning/index.html`
- Progress tracker
- Unit cards with BoW mapping
- Labs section (Phase 2)
- Certification path (Phase 2)

### 5. Newsletter Archive Template
**File:** `newsletter/index.html`
- Issue listing by date
- Filter by BoW area
- Search functionality

---

## Phase 1 Deliverables (This Migration)

### Must-Have
- [ ] New homepage with BoW structure
- [ ] 19 BoW area landing pages
- [ ] Article BoW tagging and routing
- [ ] Newsletter archive with BoW tags
- [ ] Resource/tools section

### Nice-to-Have
- [ ] Learning journey page (without Labs)
- [ ] Community hub (spotlights, office hours)
- [ ] PMM Assistant integration

### Not In Phase 1
- Labs functionality
- Assessments/quizzes
- User authentication
- Progress tracking
- Certifications

---

## Redirect Mapping

All existing URLs should redirect to new BoW-organized locations:

| Old URL | New URL |
|---------|---------|
| `/curriculum/unit-01/` | `/learning/curriculum/unit-01/` |
| `/curriculum/unit-02/` | `/learning/curriculum/unit-02/` |
| `/curriculum/labs/geo-visibility` | `/bow/market-insights/labs/geo-visibility/` |
| `/competitive-intel.html` | `/bow/market-insights/articles/competitive-intel/` |
| `/content-for-two-audiences.html` | `/bow/customer-journey-content/articles/content-for-two-audiences/` |
| `/the-great-bifurcation.html` | `/bow/category-vision/articles/the-great-bifurcation/` |
| `/newsletters/issue-XXX.html` | `/newsletter/issue-XXX.html` |

---

## IT Handoff Checklist

### For Demo Site
- [ ] All HTML templates in `/dist/`
- [ ] CSS/JS assets in standard locations
- [ ] No external dependencies requiring API keys
- [ ] All content static (no Supabase in Phase 1)
- [ ] Redirect file for legacy URLs

### Documentation
- [ ] This migration plan
- [ ] Template usage guide
- [ ] BoW content tagging guide
- [ ] URL structure spec

### Content
- [ ] 19 BoW area descriptions (from PDF)
- [ ] All existing articles tagged to BoW
- [ ] Newsletter archive with BoW tags
- [ ] Featured content selection

---

## Timeline Estimate

| Phase | Deliverable | Duration |
|-------|-------------|----------|
| 1.1 | Homepage + BoW structure | 2-3 days |
| 1.2 | Content tagging & routing | 2-3 days |
| 1.3 | Newsletter archive migration | 1 day |
| 1.4 | Testing & polish | 1-2 days |
| **Total Phase 1** | **Demo-ready site** | **~1 week** |

---

## Next Steps

1. **Immediate:** Create homepage template matching screenshot
2. **Then:** Build BoW area template with one example area
3. **Then:** Tag all existing articles to BoW areas
4. **Then:** Build newsletter archive with BoW filtering
5. **Finally:** Create redirect mapping file

---

*Document created by Chris O'Hara's PMM team*  
*For SAP IT handoff*
