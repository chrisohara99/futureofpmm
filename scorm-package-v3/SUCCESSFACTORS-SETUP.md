# SuccessFactors Learning Setup Guide

**Package:** SAP Future of PMM Training  
**Version:** 3.0  
**Format:** SCORM 1.2  
**Date:** July 13, 2026

---

## Quick Start

1. Log into **SuccessFactors Learning Administration**
2. Navigate to **Content Management → Import Content**
3. Upload `SAP-Future-of-PMM-Training-V3.zip`
4. Select **SCORM 1.2** as content type
5. The system will parse the manifest and create 8 learning items

---

## Package Contents

| File | Purpose |
|------|---------|
| `imsmanifest.xml` | SCORM manifest (defines course structure) |
| `SCORM-schemas/` | Required XSD validation files |
| `content/unit-01/` through `content/unit-08/` | 8 training units |
| `content/assets/scorm-api.js` | SCORM API wrapper for LMS communication |
| `PROVENANCE.md` | IP ownership and licensing documentation |
| `CURRICULUM-DIFFERENTIATION.md` | Differentiation from public curriculum |
| `COPYRIGHT-NOTICE.md` | Copyright and attribution requirements |

---

## Course Structure

The package creates **one course** with **8 sequential units**:

| Unit | Title | Duration (Est.) |
|------|-------|-----------------|
| 1 | The Evolution of PMM | 45 min |
| 2 | Visibility in the Age of Agents | 45 min |
| 3 | Market Intelligence & Competitive Strategy | 50 min |
| 4 | Winning Satisfiers — Agents & Analysts | 45 min |
| 5 | Sales Enablement and the Death of the Static Battlecard | 50 min |
| 6 | Content, Thought Leadership, and the Narrative Advantage | 55 min |
| 7 | The Demo Stack — Product Storytelling Reimagined | 45 min |
| 8 | Pricing & Packaging in the Agent Era | 50 min |

**Total Estimated Duration:** ~6.5 hours

---

## SuccessFactors Configuration

### Recommended Settings

| Setting | Recommended Value |
|---------|-------------------|
| **Content Type** | SCORM 1.2 |
| **Launch Behavior** | New Window |
| **Completion Criteria** | Learner-marked (units have "Mark Complete" button) |
| **Sequencing** | Sequential (units must be completed in order) |
| **Audience** | SAP PMM Organization |

### Course Description Template

Use this description in SuccessFactors:

```
Future of Product Marketing - SAP Training

An 8-unit workshop-based curriculum on product marketing in the AI era. Covers positioning, competitive intelligence, sales enablement, content strategy, demos, and pricing.

Adapted from "The Future of Product Marketing" by Chris O'Hara.

Format: Self-paced with discussion prompts
Duration: ~6.5 hours total
```

### Visibility Settings

- ✅ Visible to SAP employees only
- ❌ Not visible to external partners or contractors
- ❌ Not shareable outside SAP Learning

---

## Tracking & Completion

### How Completion Works

Each unit includes a **"Mark Unit Complete"** button. When clicked:
- SCORM API sends `cmi.core.lesson_status = "completed"` to SuccessFactors
- Progress is recorded in the learner's transcript
- Next unit becomes available (if sequential)

### Completion Reporting

SuccessFactors will track:
- `cmi.core.lesson_status` — completed/incomplete
- `cmi.core.session_time` — time spent per unit
- `cmi.core.score.raw` — not used (workshop format, no quiz scores)

---

## Troubleshooting

### "Content won't load"
- Ensure pop-ups are enabled for SuccessFactors domain
- Try a different browser (Chrome recommended)
- Check that SCORM 1.2 is selected during import

### "Progress not saving"
- Learner must click "Mark Unit Complete" button
- Check LMS communication in browser console (F12 → Console)
- Verify SCORM API wrapper is loading (`scorm-api.js`)

### "Units out of order"
- Enable sequential mode in SuccessFactors course settings
- Re-import package if manifest wasn't parsed correctly

---

## Workshop Facilitation Notes

This curriculum is designed for **facilitated workshops**, not just self-study. Each unit contains:

- **Discussion Prompts** — For team conversations
- **Workshop Activities** — Hands-on exercises
- **Scenarios** — SAP-specific case studies

**Recommended Delivery:**
- Assign units as pre-work
- Facilitate group discussions in team meetings
- Use scenarios for role-play and practice

---

## Support Contacts

| Issue | Contact |
|-------|---------|
| SuccessFactors technical issues | SAP Learning Support |
| Content questions | Chris O'Hara (chris@mainbranchcapital.com) |
| Licensing / IP questions | Chris O'Hara (chris@mainbranchcapital.com) |

---

## IP Compliance Checklist

Before publishing, confirm:

- [ ] `PROVENANCE.md` is retained with package
- [ ] Course description includes attribution line
- [ ] Visibility restricted to SAP internal only
- [ ] No modifications made to content without author approval

---

*Document Version: 1.0 | July 13, 2026*
