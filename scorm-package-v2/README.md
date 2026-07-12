# SAP Future of PMM Training - SCORM Package (Revised)

## Overview

This SCORM 1.2 package contains the **completely rewritten** 8-unit SAP internal training curriculum on the Future of Product Marketing.

**Author:** Chris O'Hara  
**Version:** 2.0  
**Date:** July 2026  
**Format:** SCORM 1.2

---

## Copyright & Attribution

> **IMPORTANT:** This training curriculum is a **derivative work** based on the book manuscript:
>
> ***"The Future of Product Marketing: The Practitioner's Guide to the Agentic Era"***  
> **© 2026 Chris O'Hara. All Rights Reserved.**
>
> The underlying book manuscript is the sole intellectual property of Chris O'Hara. SAP has been granted a limited license to use this derivative work for internal training purposes only.

---

## What's Different (Version 2.0)

This version contains **completely rewritten content** that is structurally and substantively distinct from the public 12-unit curriculum at futureofproductmarketing.com.

### Key Differentiators

| Aspect | Public 12-Unit | SAP 8-Unit (This Package) |
|--------|----------------|---------------------------|
| **Structure** | Lecture + Assessment | Workshop scenarios + exercises |
| **Voice** | Direct "you" address | Internal "we at SAP" voice |
| **Opening** | Statistics-driven | Scenario-driven narratives |
| **Frameworks** | 10x PMM, AI Impact Matrix | Maturity Ladder, Three Buckets, Three Roles |
| **Format** | Reading + quiz | Discussion prompts + assignments |
| **Unit Count** | 12 units | 8 units |

### Unique SAP Frameworks (Not in Public Curriculum)

- **The Maturity Ladder:** Skeptic → Accelerator → Augmenter → Architect
- **Three Buckets Model:** Production / Translation / Judgment work
- **Three Roles Model:** Narrator / Intelligence Officer / Enablement Architect
- **The Visibility Stack:** Documentation, Validation, Context, Consistency
- **The Intelligence Spectrum:** Reactive → Periodic → Continuous → Predictive
- **The Evidence Hierarchy:** Tier 1/2/3 evidence classification
- **The Narrative Framework:** World View → Implication → Path → Proof → Role
- **Demo Maturity Model:** Feature Tour → Use Case → Customer Story → Co-Created Discovery

---

## Contents

### Units

| Unit | Title | Focus |
|------|-------|-------|
| 1 | The Evolution of PMM | Maturity ladder, judgment vs. production work |
| 2 | Visibility in the Age of Agents | GEO principles, visibility stack |
| 3 | Market Intelligence & Competitive Strategy | Intelligence spectrum, living systems |
| 4 | Winning Satisfiers — Agents & Analysts | Evidence hierarchy, dual audience |
| 5 | Sales Enablement | Knowledge architecture, AI enablement layer |
| 6 | Content & Narrative | Commodity collapse, three-tier content model |
| 7 | The Demo Stack | Demo maturity, storytelling over features |
| 8 | Pricing & Packaging | Model evolution, AI pricing challenges |

### Package Structure

```
├── imsmanifest.xml          # SCORM manifest
├── SCORM-schemas/           # Required XSD files
├── content/
│   ├── assets/
│   │   └── scorm-api.js     # SCORM API wrapper
│   └── unit-01 through unit-08/
│       └── index.html       # Unit content
├── COPYRIGHT-NOTICE.md
├── CURRICULUM-DIFFERENTIATION.md
└── README.md
```

---

## Installation in SuccessFactors Learning

1. Upload the ZIP file to SuccessFactors Learning as a new content object
2. Select "SCORM 1.2" as the content type
3. The system will parse the manifest and create learning items automatically
4. Assign to appropriate learning programs or curricula

---

## Tracking & Completion

- **Unit Content:** Learners mark units complete via the "Mark Unit Complete" button
- **Completion Status:** Reported via `cmi.core.lesson_status`
- **Workshop Format:** Units designed for facilitated discussion, not assessment-based completion

---

## Technical Notes

- SCORM 1.2 compliant (compatible with SuccessFactors)
- No external dependencies (all assets bundled)
- Works standalone for testing (graceful degradation without LMS)

---

## Support

For issues with this content package, contact the SAP Learning Team.

---

*This curriculum is proprietary to SAP and is substantively distinct from the public Future of Product Marketing Academy (futureofproductmarketing.com).*
