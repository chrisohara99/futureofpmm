# The Future of PMM — SAP BTP Migration Guide

**Prepared for:** SAP IT / Corporate Infrastructure Team  
**Site:** futureofpmm.com  
**Current Status:** Production (Netlify + Supabase)  
**Target:** SAP Business Technology Platform (BTP)  
**Date:** August 27, 2026

---

## Executive Summary

The Future of PMM is an internal learning platform for SAP Product Marketing serving ~170 registered users. The site includes a 12-unit curriculum, interactive assessments, AI-powered labs, and a weekly newsletter system. This guide documents the current architecture and requirements for migrating to SAP-managed infrastructure.

---

## 1. Current Architecture Overview

### 1.1 Hosting & CDN
| Component | Current Provider | Purpose |
|-----------|-----------------|---------|
| Static Hosting | **Netlify** | HTML/CSS/JS serving |
| CDN | Netlify Edge | Global content delivery |
| SSL Certificate | Netlify (auto-renewed) | HTTPS |
| Domain DNS | Network Solutions | DNS management |

### 1.2 Backend Services
| Service | Provider | Purpose |
|---------|----------|---------|
| Database | **Supabase** (PostgreSQL) | User profiles, quiz scores, progress tracking |
| Authentication | Supabase Auth | Magic link email login |
| Serverless Functions | Netlify Functions | API endpoints, AI integrations |
| Email Delivery | **Resend** | Newsletters, welcome emails, magic links |

### 1.3 AI/External APIs
| Service | Provider | Purpose |
|---------|----------|---------|
| AI Text Generation | **Anthropic Claude** | Messaging Lab, BattleCoach |
| AI Text Generation | **OpenAI GPT-4** | GEO Lab, competitive analysis |
| Web Search | **Brave Search API** | Research tools, daily digest |

---

## 2. Database Schema

### 2.1 Core Tables

```sql
-- User profiles (linked to Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT DEFAULT 'SAP',
  role TEXT,
  team TEXT,
  newsletter_opt_in BOOLEAN DEFAULT true,
  digest_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz scores for curriculum units
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  chapter TEXT NOT NULL,  -- 'unit-01', 'unit-02', etc.
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Assessment results (10x Scorecard, Cognitive Style, etc.)
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  assessment_type TEXT NOT NULL,
  result_key TEXT,
  result_name TEXT,
  result_data JSONB,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- Chapter/unit progress tracking
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  chapter TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Activity-level progress (granular tracking)
CREATE TABLE activity_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  activity_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ
);

-- Survey/feedback responses
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  value_rating INTEGER,
  nps INTEGER,
  top_learning TEXT,
  most_useful_unit TEXT,
  applying_at_work TEXT,
  improvements TEXT,
  from_unit TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lab feedback submissions
CREATE TABLE lab_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT,
  data JSONB,
  submitter_name TEXT,
  priority TEXT DEFAULT 'unset',
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email event tracking (opens, clicks)
CREATE TABLE email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  email_id TEXT,
  to_email TEXT,
  subject TEXT,
  click_url TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.2 Current Data Volume
- **Profiles:** ~170 registered users
- **Quiz Scores:** ~800 records
- **Assessment Results:** ~200 records
- **Survey Responses:** ~50 records

---

## 3. Serverless Functions (API Endpoints)

### 3.1 Authentication & User Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/send-verification` | POST | Send magic link email |
| `/api/verify-token` | POST | Validate magic link token |
| `/api/subscriber-status` | GET | Admin dashboard data |

### 3.2 Progress Tracking
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/save-result` | POST | Save quiz/assessment results |
| `/api/progress` | GET/POST | Get/update user progress |

### 3.3 AI Labs
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/lab-ai` | POST | Messaging Lab, BattleCoach (Claude) |
| `/api/geo-scorecard` | POST | GEO Visibility Lab (multi-LLM) |

### 3.4 Newsletter System
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/send-newsletter` | POST | Bulk email send |
| `/api/resend-webhook` | POST | Email event tracking |

---

## 4. Third-Party Service Requirements

### 4.1 Required API Keys & Credentials

#### Email Service (Currently: Resend)
```
RESEND_API_KEY=re_xxxxx
FROM_EMAIL=chris@futureofpmm.com
```
**SAP Alternative:** Consider SAP's internal email infrastructure or approved enterprise email service.

#### AI Services
```
# Anthropic Claude (Messaging Lab, BattleCoach)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# OpenAI (GEO Lab, some analysis tools)
OPENAI_API_KEY=sk-xxxxx

# Brave Search (Research tools, daily digest)
BRAVE_API_KEY=BSAxxxxx
```
**Note:** These would need to go through SAP's AI governance/procurement process.

#### Database
```
SUPABASE_URL=https://yyqzkczutlidhgyiyawc.supabase.co
SUPABASE_SERVICE_KEY=eyJxxxxx
SUPABASE_ANON_KEY=eyJxxxxx
```
**SAP Alternative:** SAP HANA Cloud or PostgreSQL on BTP.

### 4.2 Service Comparison Matrix

| Current Service | Purpose | SAP BTP Equivalent |
|----------------|---------|-------------------|
| Supabase | Database + Auth | SAP HANA Cloud + SAP IAS |
| Netlify | Static hosting | SAP Build Work Zone / Static Files |
| Netlify Functions | Serverless | SAP BTP Cloud Foundry / Kyma |
| Resend | Email | SAP internal SMTP / approved service |
| Anthropic Claude | AI | SAP AI Core (if available) |
| OpenAI | AI | SAP AI Core (if available) |

---

## 5. Authentication Architecture

### 5.1 Current Flow (Magic Link)
1. User enters SAP email on login page
2. System sends magic link via Resend
3. User clicks link → JWT token generated
4. Token stored in localStorage (7-day expiry)
5. Token validated on each protected page

### 5.2 SAP Alternative: SAP Identity Authentication Service (IAS)
- Integrate with SAP's corporate SSO
- Users authenticate via existing SAP credentials
- No separate account creation needed
- Automatic user provisioning from SAP directory

### 5.3 Migration Consideration
Current system restricts to `@sap.com` email addresses only. SAP IAS would provide:
- Single sign-on with existing SAP credentials
- Automatic role/team mapping from SAP HR data
- Audit logging for compliance
- No separate password management

---

## 6. Static Assets & Content

### 6.1 File Structure
```
/dist/
├── index.html                 # Homepage
├── curriculum/               
│   ├── index.html            # Curriculum overview
│   ├── unit-01/ through unit-12/  # 12 unit pages
│   ├── labs/                 # Interactive labs
│   └── signup.html           # Registration
├── newsletters/              # 29 newsletter issues
├── digests/                  # 200+ daily AI digests
├── assessments/              # Interactive assessments
├── admin/                    # Admin dashboard
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
└── private/                  # Gated content
```

### 6.2 Content Volume
- **HTML Pages:** ~350 files
- **CSS/JS:** ~20 files
- **Images:** ~50 files
- **Total Size:** ~15 MB

---

## 7. Migration Steps

### Phase 1: Infrastructure Setup
1. Provision SAP HANA Cloud or PostgreSQL instance on BTP
2. Set up SAP IAS for authentication
3. Configure SAP BTP Cloud Foundry runtime for serverless functions
4. Set up static file hosting (SAP Build Work Zone or CDN)

### Phase 2: Database Migration
1. Export data from Supabase (CSV/JSON)
2. Create tables in SAP database
3. Import user profiles, quiz scores, progress data
4. Verify data integrity

### Phase 3: Authentication Migration
1. Configure SAP IAS integration
2. Map existing users to SAP directory
3. Update frontend auth code to use SAP IAS
4. Test SSO flow

### Phase 4: Function Migration
1. Port Netlify Functions to SAP BTP runtime
2. Update environment variables
3. Configure AI service access (if approved)
4. Update API endpoints in frontend

### Phase 5: DNS & Go-Live
1. Configure SAP CDN/hosting
2. Update DNS records
3. SSL certificate provisioning
4. Cutover with minimal downtime

---

## 8. AI Service Considerations

### 8.1 Current AI Usage
| Feature | Model | Monthly Volume |
|---------|-------|---------------|
| Messaging Lab | Claude 3.5 Sonnet | ~500 requests |
| BattleCoach | Claude 3.5 Sonnet | ~200 requests |
| GEO Scorecard | GPT-4 + Claude | ~100 requests |
| Daily Digest | GPT-4 + Brave | ~30 requests |

### 8.2 SAP AI Options
1. **SAP AI Core** — If Anthropic/OpenAI models are available
2. **Joule** — For SAP-native AI capabilities
3. **Direct API Access** — Requires procurement/security approval
4. **Graceful Degradation** — Labs could work without AI (show static examples)

### 8.3 Recommendation
The AI labs are valuable but not critical to core learning. Suggest:
- Core curriculum (Units 1-12) works without AI
- Labs marked as "AI-powered" with fallback content
- AI access added post-migration if/when approved

---

## 9. Environment Variables Summary

```bash
# Database
DATABASE_URL=<SAP_HANA_OR_POSTGRES_CONNECTION_STRING>
DB_SERVICE_KEY=<SERVICE_ACCOUNT_KEY>

# Authentication
SAP_IAS_CLIENT_ID=<IAS_CLIENT_ID>
SAP_IAS_CLIENT_SECRET=<IAS_CLIENT_SECRET>
SAP_IAS_TENANT=<TENANT_URL>

# Email (if using external service)
EMAIL_API_KEY=<APPROVED_EMAIL_SERVICE_KEY>
FROM_EMAIL=<APPROVED_SENDER_ADDRESS>

# AI Services (if approved)
ANTHROPIC_API_KEY=<IF_APPROVED>
OPENAI_API_KEY=<IF_APPROVED>
BRAVE_API_KEY=<IF_APPROVED>

# Admin
ADMIN_EMAILS=christopher.ohara@sap.com,<OTHER_ADMINS>
```

---

## 10. Support & Contact

**Site Owner:** Chris O'Hara (christopher.ohara@sap.com)  
**Current Hosting:** Netlify (Team: chrisohara99)  
**GitHub Repository:** github.com/chrisohara99/futureofpmm  
**Supabase Project:** yyqzkczutlidhgyiyawc

---

## Appendix A: Current Netlify Functions Code

All serverless functions are in `/netlify/functions/`:
- `send-verification.js` — Magic link emails
- `save-result.js` — Quiz/assessment saves
- `subscriber-status.js` — Admin dashboard API
- `lab-ai.js` — AI lab integrations
- `geo-scorecard.js` — GEO visibility lab
- `resend-webhook.js` — Email tracking

These would need to be ported to SAP BTP Cloud Foundry or Kyma runtime.

---

## Appendix B: Data Export Commands

```bash
# Export from Supabase (using service key)
curl -H "apikey: SERVICE_KEY" \
  "https://yyqzkczutlidhgyiyawc.supabase.co/rest/v1/profiles" \
  > profiles_export.json

curl -H "apikey: SERVICE_KEY" \
  "https://yyqzkczutlidhgyiyawc.supabase.co/rest/v1/quiz_scores" \
  > quiz_scores_export.json

# etc. for each table
```

---

*Document Version: 1.0*  
*Last Updated: August 27, 2026*
