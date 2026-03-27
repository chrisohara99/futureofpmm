# Future of PMM - Header Audit Report
**Generated:** March 27, 2026

## Summary

| Metric | Count |
|--------|-------|
| **Total Pages** | 193 |
| **Pages OK** | 31 (16%) |
| **Pages with Issues** | 162 (84%) |

## Issue Categories

| Issue Type | Affected Pages |
|------------|----------------|
| Text brand instead of logo image | 91 (digests, posts) |
| Small logo (< 135px) | 24 |
| Simple nav CSS (not flex) | 53 |
| No dropdown nav CSS | 137 |
| No logo/brand element | 47 |

---

## Pages by Section

### ✅ Working Correctly (31 pages)

**Main Pages:**
- https://futureofpmm.com/ (Homepage)
- https://futureofpmm.com/newsletters.html
- https://futureofpmm.com/competitive-intel.html
- https://futureofpmm.com/ai-tools.html
- https://futureofpmm.com/ai-tools-guide.html
- https://futureofpmm.com/about.html
- https://futureofpmm.com/subscribe.html
- https://futureofpmm.com/10x-scorecard.html
- https://futureofpmm.com/sap-ai-resources.html
- https://futureofpmm.com/where-do-you-sit-article.html
- https://futureofpmm.com/deep-dive-full-stack-buyer.html
- https://futureofpmm.com/agentic-pmm-buyer-hired-agent.html
- https://futureofpmm.com/learning-of-the-week-prompt-workflow.html
- https://futureofpmm.com/use-case-anthropic-marketing.html
- https://futureofpmm.com/blog-details.html
- https://futureofpmm.com/blog-details-2.html
- https://futureofpmm.com/blog-details-3.html
- https://futureofpmm.com/blog-details-4.html
- https://futureofpmm.com/pmm-skills-ai-impact.html
- https://futureofpmm.com/user-of-the-week.html
- https://futureofpmm.com/battlecard-ai-showdown.html
- https://futureofpmm.com/competitive-battlecards-guide.html
- https://futureofpmm.com/content-gen-tools-evaluation.html
- https://futureofpmm.com/data-layer-wins-positioning-guide.html
- https://futureofpmm.com/how-to-build-rag-system.html
- https://futureofpmm.com/news-roundup-001.html
- https://futureofpmm.com/olivier-rag-brain.html
- https://futureofpmm.com/why-stories-still-win.html
- https://futureofpmm.com/this-week-in-ai-pmm-march-12.html
- https://futureofpmm.com/agent-powered-competitive-intel.html
- https://futureofpmm.com/page-about.html

---

### ❌ Pages Needing Fixes

#### Daily Digests (60 pages) - ALL BROKEN
**Issues:** Text brand instead of logo image, No dropdown nav CSS
**Fix needed:** Replace text nav-brand with logo image, add dropdown CSS
- All 60 digest pages from Jan 26 - Mar 27, 2026
- digests/index.html
- digests/archive.html

#### Blog Posts (31 pages) - ALL BROKEN
**Issues:** Text brand instead of logo image, Simple nav CSS, No dropdown nav CSS
**Fix needed:** Complete header replacement
- All 31 post-XXX.html files

#### Articles/Stories (10 pages) - ALL BROKEN
**Issues:** Simple nav CSS (not flex), No dropdown nav CSS
- All 10 story pages in /articles/stories/

#### Newsletter Issues (14 pages) - ALL BROKEN
**Issues:** No logo/brand element (email templates - OK to skip)
- All newsletter email templates (these are for email, not web viewing)

#### Curriculum (12 pages) - PARTIALLY BROKEN
**Issues:** Missing dropdown nav CSS, some missing logo
- curriculum/index.html
- curriculum/chapter-01/* (4 pages)
- curriculum/exercises/* (4 pages)
- curriculum/funnel-map.html
- curriculum/signup.html
- curriculum/login.html

#### Main Pages with Issues (18 pages)
| Page | Issue |
|------|-------|
| blog.html | Small logo (50px) |
| month-of-ai-pmm-stories.html | Small logo (50px) |
| content-for-two-audiences.html | Small logo (80px) |
| vendor-of-the-week-evertune.html | Small logo (80px) |
| vendor-of-the-week-klue.html | Small logo (80px) |
| what-is-mcp-explainer.html | Small logo (80px) |
| demo-stack-guide.html | Small logo (80px) |
| where-do-you-sit.html | No logo element |
| pragmatic-framework-ai.html | No logo element |
| ai-survey.html | No logo element |
| blog-2.html through blog-8.html | No logo element (template pages) |
| coming-soon.html | No logo element |

---

## Recommended Priority Fixes

### Priority 1: High-Traffic Main Pages
1. `blog.html` - Fix logo size to 135px
2. `content-for-two-audiences.html` - Fix logo size
3. `where-do-you-sit.html` - Add logo element
4. `month-of-ai-pmm-stories.html` - Fix logo size

### Priority 2: Section Landing Pages  
1. `digests/index.html` - Full header fix
2. All curriculum pages - Add dropdown CSS

### Priority 3: Bulk Fixes
1. All 60 digest pages - Script fix for logo + nav
2. All 31 post pages - Script fix for logo + nav
3. All 10 story pages - Script fix for nav CSS

### Priority 4: Low Priority (Templates/Emails)
1. Newsletter email templates (skip - email format)
2. Blog template pages (blog-2 through blog-8)
3. Coming soon page
