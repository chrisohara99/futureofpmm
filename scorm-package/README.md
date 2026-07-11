# SAP Future of PMM Training - SCORM Package

## Overview

This SCORM 1.2 package contains the 8-unit SAP internal training curriculum on the Future of Product Marketing.

**Author:** Chris O'Hara  
**Version:** 1.0  
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

See `COPYRIGHT-NOTICE.md` for full licensing terms.

---

## Contents

### Units

| Unit | Title | Content |
|------|-------|---------|
| 1 | The Evolution of PMM | Foundations of AI-augmented product marketing |
| 2 | Visibility in the Age of Agents | How AI agents discover and evaluate vendors |
| 3 | Market Intelligence & Competitive Strategy | Competitive intelligence systems |
| 4 | Winning Satisfiers — Agents & Analysts | Analyst relations and AI agent optimization |
| 5 | Sales Enablement and the Death of the Static Battlecard | Dynamic intelligence systems |
| 6 | Content, Thought Leadership, and the Narrative Advantage | Content strategy for AI discoverability |
| 7 | The Demo Stack — Product Storytelling Reimagined | Product demonstration evolution |
| 8 | Pricing & Packaging in the Agent Era | Modern pricing strategies |

### Package Structure

```
├── imsmanifest.xml          # SCORM manifest
├── SCORM-schemas/           # Required XSD files
├── content/
│   ├── assets/
│   │   ├── scorm-api.js     # SCORM API wrapper
│   │   └── styles.css       # Common styles
│   ├── unit-01/
│   │   ├── index.html       # Unit content
│   │   └── quiz.html        # Unit assessment
│   └── unit-02 through unit-08/
```

## Installation in SuccessFactors Learning

1. Upload the ZIP file to SuccessFactors Learning as a new content object
2. Select "SCORM 1.2" as the content type
3. The system will parse the manifest and create learning items automatically
4. Assign to appropriate learning programs or curricula

## Tracking & Completion

- **Unit Content**: Learners can mark units complete via the "Mark Unit Complete" button
- **Quizzes**: Scores are automatically reported to the LMS upon submission
- **Passing Score**: 70% on quizzes marks the unit as "passed"
- **Below 70%**: Marked as "failed" — learner can retry

## Technical Notes

- SCORM 1.2 compliant (compatible with SuccessFactors)
- No external dependencies (all assets bundled)
- Works standalone for testing (graceful degradation without LMS)
- Quiz scores reported via `cmi.core.score.raw`
- Completion status via `cmi.core.lesson_status`

## Testing

To test locally without an LMS:
1. Unzip the package
2. Open `content/unit-01/index.html` in a browser
3. Console will show "SCORM API not found - running in standalone mode"
4. All content and quizzes will function normally

## Support

For issues with this content package, contact the SAP Learning Team.

---

*This curriculum is proprietary to SAP and is distinct from the public Future of Product Marketing Academy (futureofproductmarketing.com).*
