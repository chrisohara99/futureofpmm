# Future of PMM — IT Handoff Package

**Prepared:** September 29, 2026  
**Site URL:** https://bow-demo-pmm.netlify.app  
**Status:** Ready for Migration to SAP Corporate Infrastructure

---

## Executive Summary

The Future of PMM site has been restructured around the **PMM Book of Work** framework — a 19-area model organizing all product marketing competencies into "PMM Leads" (areas PMM owns) and "PMM Supports" (cross-functional contributions).

All content has been migrated from the original curriculum/labs structure into this new organization. The site is now a static HTML site with no authentication, no database dependencies, and no server-side processing required.

---

## Site Structure

```
/                           Homepage
├── index.html              Main landing page
├── about.html              About page
├── 404.html                Error page
├── favicon.ico             Site icon
├── robots.txt              Search engine directives
├── sitemap.xml             Site map
│
├── /bow/                   Book of Work Hub
│   ├── index.html          Hub page listing all 19 areas
│   │
│   ├── /messaging-positioning/    PMM Lead area
│   │   ├── index.html             Area landing page
│   │   ├── human-premium.html     Article
│   │   ├── guide-01.html          Former curriculum unit
│   │   └── ...
│   │
│   ├── /category-vision/          PMM Lead area
│   ├── /market-insights/          PMM Lead area
│   ├── /launch-narrative/         PMM Lead area
│   ├── /personas/                 PMM Lead area
│   ├── /commercialization/        PMM Lead area
│   ├── /launch-disclosure/        PMM Lead area
│   ├── /gtm-readiness/            PMM Lead area
│   ├── /demo/                     PMM Lead area
│   ├── /customer-reference/       PMM Lead area
│   ├── /adoption-growth/          PMM Lead area
│   │
│   ├── /marketing-planning/       PMM Support area
│   ├── /campaign-execution/       PMM Support area
│   ├── /press-media/              PMM Support area
│   ├── /partner-isv/              PMM Support area
│   ├── /pricing-communication/    PMM Support area
│   ├── /community/                PMM Support area
│   ├── /learning-journeys/        PMM Support area
│   └── /customer-journey-content/ PMM Support area
│
├── /newsletter/            Newsletter Archive
│   ├── index.html          Archive listing
│   ├── issue-001.html      
│   ├── issue-002.html
│   └── ... (54 issues total)
│
└── /assets/                Static assets
    ├── /css/               Stylesheets
    ├── /js/                JavaScript (minimal)
    ├── /images/            Images
    └── /icons/             Icons
```

---

## Technical Specifications

### Hosting Requirements
- **Type:** Static HTML site
- **Server:** Any web server (Apache, Nginx, IIS, CDN)
- **SSL:** Required (HTTPS)
- **Database:** None
- **Server-side processing:** None

### File Counts
| Type | Count |
|------|-------|
| HTML pages | 123 |
| CSS files | ~5 |
| JavaScript files | ~3 |
| Images | ~20 |
| **Total files** | ~150 |

### Dependencies
- **None.** Pure HTML/CSS with minimal vanilla JavaScript.
- No npm packages, no build process, no external APIs.
- All styles are inlined or in local CSS files.

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Content Inventory

### PMM Lead Areas (11)

| Area | URL | Articles |
|------|-----|----------|
| Messaging & Positioning | /bow/messaging-positioning/ | 8 |
| Category & Vision | /bow/category-vision/ | 5 |
| Market Insights | /bow/market-insights/ | 5 |
| Launch Narrative | /bow/launch-narrative/ | 4 |
| Personas | /bow/personas/ | 4 |
| Commercialization | /bow/commercialization/ | 1 |
| Launch & Disclosure | /bow/launch-disclosure/ | 0 |
| GTM Readiness | /bow/gtm-readiness/ | 2 |
| Demo | /bow/demo/ | 0 |
| Customer Reference | /bow/customer-reference/ | 0 |
| Adoption & Growth | /bow/adoption-growth/ | 1 |

### PMM Support Areas (8)

| Area | URL | Articles |
|------|-----|----------|
| Marketing Planning | /bow/marketing-planning/ | 1 |
| Campaign Execution | /bow/campaign-execution/ | 0 |
| Press & Media | /bow/press-media/ | 0 |
| Partner & ISV | /bow/partner-isv/ | 0 |
| Pricing Communication | /bow/pricing-communication/ | 0 |
| Community | /bow/community/ | 3 |
| Learning Journeys | /bow/learning-journeys/ | 10 |
| Customer Journey Content | /bow/customer-journey-content/ | 2 |

### Newsletter Archive
- 54 issues (Issue #001 through #030, plus earlier issues)
- Located at /newsletter/

---

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| SAP Blue | #0070f2 | Primary brand, links, buttons |
| SAP Dark Blue | #0054b4 | Hover states |
| SAP Light Blue | #e8f4ff | Backgrounds, highlights |
| Text Primary | #1d2d3e | Headings, body text |
| Text Secondary | #526069 | Captions, metadata |
| Border | #e4e7eb | Dividers, card borders |
| Background Light | #f7f9fb | Section backgrounds |

### Typography
- **Font Family:** System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)
- **Headings:** 600-700 weight
- **Body:** 400 weight, 1.6 line-height

### Components
- **Header:** SAP logo + "Future of PMM" text + navigation
- **Cards:** White background, 1px border, 8px radius, hover effect
- **Badges:** Blue for PMM Leads, gray for PMM Supports
- **Footer:** Dark background (#1d2d3e) with copyright

---

## Migration Steps

### 1. Download the Package
```bash
# Clone or download the dist-bow folder
# Location: /dist-bow/
```

### 2. Deploy to SAP Infrastructure
- Upload all files maintaining directory structure
- Configure web server to serve index.html for directory requests
- Enable HTTPS

### 3. DNS Configuration
- Point desired domain to the hosting server
- Update any internal links if domain changes

### 4. Verification
- [ ] Homepage loads correctly
- [ ] All 19 BoW area pages accessible
- [ ] Newsletter archive accessible
- [ ] All article links work
- [ ] Mobile responsive design works

---

## Removed Features

The following features from the original site were intentionally removed:

| Feature | Reason |
|---------|--------|
| User authentication | Learning delivered via SuccessFactors SCORM |
| Quiz system | Assessments moved to SuccessFactors |
| Leaderboard | No longer needed without auth |
| AI Labs | Deferred to future phase |
| Progress tracking | Handled by SuccessFactors |
| Email signup | No longer collecting registrations |

---

## Support Contacts

**Original Developer:** Chris O'Hara  
**Migration Date:** September 29, 2026  
**Source Repository:** github.tools.sap/CMO/Future-of-PMM (to be created)

---

## Appendix: URL Mapping

### Old URL → New URL

| Old Path | New Path |
|----------|----------|
| /curriculum/unit-01/ | /bow/messaging-positioning/guide-01.html |
| /curriculum/unit-02/ | /bow/messaging-positioning/guide-02.html |
| /curriculum/unit-03/ | /bow/category-vision/guide-03.html |
| /curriculum/unit-04/ | /bow/customer-journey-content/guide-04.html |
| /curriculum/unit-05/ | /bow/market-insights/guide-05.html |
| /curriculum/unit-06/ | /bow/market-insights/guide-06.html |
| /curriculum/unit-07/ | /bow/launch-narrative/guide-07.html |
| /curriculum/unit-08/ | /bow/commercialization/guide-08.html |
| /curriculum/unit-09/ | /bow/personas/guide-09.html |
| /curriculum/unit-10/ | /bow/gtm-readiness/guide-10.html |
| /curriculum/unit-11/ | /bow/adoption-growth/guide-11.html |
| /curriculum/unit-12/ | /bow/personas/guide-12.html |
| /human-premium.html | /bow/messaging-positioning/human-premium.html |
| /the-great-bifurcation.html | /bow/category-vision/the-great-bifurcation.html |
| /competitive-battlecards-guide.html | /bow/market-insights/competitive-battlecards-guide.html |
| /newsletters/issue-XXX.html | /newsletter/issue-XXX.html |

---

*End of IT Handoff Package*
