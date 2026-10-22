# Memo: Future of PMM Site Reorganization

**To:** Sean Thomson  
**From:** Chris O'Hara  
**Date:** September 29, 2026  
**Re:** Book of Work Migration — What We Built Today

---

Sean,

Today we completed a significant restructuring of the Future of PMM site. I wanted to document exactly what we did and why, since you've been one of the most engaged users of the curriculum.

## The Problem

The original site was organized around two concepts:
- **Curriculum** (12 units of learning content)
- **Labs** (AI-powered tools for specific tasks)

While this worked well for our pilot, it doesn't map to how SAP IT wants to organize the content for broader distribution. They need something aligned with the **PMM Book of Work** — the official framework that defines what product marketers do.

## The Solution

We reorganized the entire site around the 19 areas of the Book of Work:

### PMM Leads (11 areas where PMM owns strategy)
1. Messaging & Positioning
2. Category & Vision
3. Market Insights
4. Launch Narrative
5. Personas
6. Commercialization
7. Launch & Disclosure
8. GTM Readiness
9. Demo
10. Customer Reference
11. Adoption & Growth

### PMM Supports (8 areas where PMM contributes)
12. Marketing Planning
13. Campaign Execution
14. Press & Media
15. Partner & ISV
16. Pricing Communication
17. Community
18. Learning Journeys
19. Customer Journey Content

## What Changed

### Curriculum → Articles
Each of the 12 curriculum units was converted to an article and placed in its relevant BoW area:

| Old | New Location |
|-----|--------------|
| Unit 1: Evolution of PMM | Messaging & Positioning |
| Unit 2: Messaging Architecture | Messaging & Positioning |
| Unit 3: Category Strategy | Category & Vision |
| Unit 4: Content Strategy | Customer Journey Content |
| Unit 5: Market Intelligence | Market Insights |
| Unit 6: Competitive Analysis | Market Insights |
| Unit 7: Launch Planning | Launch Narrative |
| Unit 8: Pricing & Packaging | Commercialization |
| Unit 9: Buyer Personas | Personas |
| Unit 10: Sales Enablement | GTM Readiness |
| Unit 11: Customer Marketing | Adoption & Growth |
| Unit 12: Full Stack Buyer | Personas |

### Articles → BoW Areas
All standalone articles (Human Premium, Great Bifurcation, Battlecards Guide, etc.) were also mapped to their most relevant BoW area. For example:
- "The Human Premium" → Messaging & Positioning
- "The Great Bifurcation" → Category & Vision
- "Competitive Battlecards Guide" → Market Insights

### Labs → Removed
The AI Labs have been removed from this version. They'll be reconsidered for a future phase once the core content is established on SAP infrastructure.

### Authentication → Removed
Login, signup, progress tracking, and leaderboards are all gone. Learning delivery will happen through SuccessFactors SCORM packages instead.

## The New Site Structure

```
Homepage
├── Book of Work (hub with all 19 areas)
│   ├── Each area has its own landing page
│   └── Each area contains relevant articles
└── Newsletter Archive (54 issues)
```

Every page uses the same SAP-styled template. Consistent header, footer, typography, and card designs throughout.

## Content Distribution

The final content counts by area:

| Area | Articles |
|------|----------|
| Messaging & Positioning | 8 |
| Learning Journeys | 10 |
| Category & Vision | 5 |
| Market Insights | 5 |
| Launch Narrative | 4 |
| Personas | 4 |
| Community | 3 |
| GTM Readiness | 2 |
| Customer Journey Content | 2 |
| Others | 1 each or placeholder |

**Total: 46 articles + 54 newsletters = 100 content pieces**

## Technical Details

The site is now pure static HTML — no database, no authentication, no server-side processing. This makes it easy for SAP IT to host on any standard web server.

All styles follow SAP's design language:
- SAP Blue (#0070f2) for primary actions
- System fonts for clean rendering
- Card-based layouts with subtle shadows
- Responsive design for mobile

## Live Preview

You can see the new site at: **https://bow-demo-pmm.netlify.app**

Key pages to explore:
- Homepage: https://bow-demo-pmm.netlify.app/
- Book of Work hub: https://bow-demo-pmm.netlify.app/bow/
- Your favorite unit (now an article): https://bow-demo-pmm.netlify.app/bow/messaging-positioning/guide-01.html

## What This Means for Users

For existing users like yourself who completed the curriculum:
- Your progress and achievements are preserved in our records
- The content itself hasn't changed — just how it's organized
- When the site moves to SAP infrastructure, you'll find familiar content in new locations

## Next Steps

1. SAP IT will review this package
2. They'll deploy it to their corporate infrastructure
3. We'll set up redirects from the old URLs to new locations
4. Content will be accessible to all SAP employees without authentication

---

Thanks for being such an active participant in the pilot, Sean. You were one of the first to complete all 12 units, and your engagement helped prove the value of this content. The reorganization ensures it'll reach a much broader audience.

Let me know if you have any questions about the new structure.

— Chris
