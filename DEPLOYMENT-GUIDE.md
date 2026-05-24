# Future of PMM — Deployment Guide

A complete guide to deploying the Future of PMM curriculum site on your own infrastructure.

---

## Overview

**What this site does:**
- AI-powered PMM training curriculum (7 units with quizzes)
- User authentication via email verification
- Progress tracking and quiz scoring
- Daily digests and newsletters
- Assessment tools (Where Do You Sit?, 10x Scorecard)

**Tech Stack:**
- **Hosting:** Netlify (static site + serverless functions)
- **Database:** Supabase (PostgreSQL + Auth)
- **Email:** Resend (transactional emails)
- **Source Control:** GitHub

---

## Prerequisites

You'll need accounts on:
1. **GitHub** — to fork/clone the repo
2. **Netlify** — to host the site (free tier works)
3. **Supabase** — for database (free tier works)
4. **Resend** — for email verification (free tier: 100 emails/day)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/chrisohara99/futureofpmm.git
cd futureofpmm
```

Or fork it to your own GitHub account first.

---

## Step 2: Set Up Supabase

### 2.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** (e.g., `https://xxxxx.supabase.co`)
3. Go to **Settings → API** and copy:
   - `anon` (public) key
   - `service_role` key (keep this secret!)

### 2.2 Create Database Tables

Go to **SQL Editor** in Supabase and run this schema:

```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  company TEXT DEFAULT 'SAP',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz scores
CREATE TABLE quiz_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  score INTEGER,
  total INTEGER,
  percentage INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chapter progress
CREATE TABLE chapter_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  chapter TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, chapter)
);

-- Assessment results
CREATE TABLE assessment_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  result_key TEXT,
  result_name TEXT,
  result_data JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_quiz_scores_user ON quiz_scores(user_id);
CREATE INDEX idx_quiz_scores_chapter ON quiz_scores(chapter);
CREATE INDEX idx_chapter_progress_user ON chapter_progress(user_id);
CREATE INDEX idx_assessment_results_user ON assessment_results(user_id);
```

### 2.3 Enable Row Level Security (Optional but Recommended)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for serverless functions)
CREATE POLICY "Service role full access" ON profiles FOR ALL USING (true);
CREATE POLICY "Service role full access" ON quiz_scores FOR ALL USING (true);
CREATE POLICY "Service role full access" ON chapter_progress FOR ALL USING (true);
CREATE POLICY "Service role full access" ON assessment_results FOR ALL USING (true);
```

---

## Step 3: Set Up Resend

1. Go to [resend.com](https://resend.com) and create an account
2. Add and verify your domain (or use their test domain for dev)
3. Create an API key and copy it

---

## Step 4: Update Code Configuration

### 4.1 Update Supabase URLs and Keys

Search and replace these values in the codebase:

**Files to update:**
- `dist/assets/js/curriculum-progress.js`
- `dist/curriculum/login.html`
- `dist/curriculum/signup.html`
- `dist/curriculum/account.html`
- `dist/curriculum/index.html`
- `dist/curriculum/verify.html`
- `netlify/functions/*.js`

**Replace:**
```
https://yyqzkczutlidhgyiyawc.supabase.co  →  YOUR_SUPABASE_URL
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  →  YOUR_SUPABASE_ANON_KEY
```

### 4.2 Update Email "From" Address

In `netlify/functions/send-verification.js`, update:
```javascript
from: 'Future of PMM <noreply@futureofpmm.com>'
```
to your verified domain.

### 4.3 Update Verification Redirect URL

In `netlify/functions/send-verification.js`, update:
```javascript
const verifyUrl = `https://futureofpmm.com/curriculum/verify.html?token=...`
```
to your domain.

---

## Step 5: Deploy to Netlify

### 5.1 Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repo
4. Configure build settings:
   - **Build command:** `echo 'Static site ready'`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`

### 5.2 Add Environment Variables

In Netlify dashboard: **Site settings → Environment variables**

Add these:
```
SUPABASE_SERVICE_KEY = your_supabase_service_role_key
RESEND_API_KEY = your_resend_api_key
```

### 5.3 Deploy

Netlify will auto-deploy on push. Trigger a manual deploy if needed.

---

## Step 6: Configure Custom Domain (Optional)

1. In Netlify: **Domain settings → Add custom domain**
2. Update DNS records as instructed
3. Enable HTTPS (automatic with Netlify)

---

## Step 7: Test the Setup

1. **Signup flow:** Go to `/curriculum/signup.html`, register with an email
2. **Verification:** Check email, click link, verify account is created
3. **Login:** Go to `/curriculum/login.html`, login with the email
4. **Quiz:** Take a unit quiz, verify score is saved
5. **Progress:** Check `/curriculum/account.html` shows your progress

---

## File Structure

```
futureofpmm/
├── dist/                      # Static site files (deploy this)
│   ├── index.html             # Homepage
│   ├── curriculum/            # Curriculum pages
│   │   ├── index.html         # Dashboard
│   │   ├── login.html         # Login page
│   │   ├── signup.html        # Signup page
│   │   ├── verify.html        # Email verification
│   │   ├── account.html       # User profile/stats
│   │   ├── intro.html         # Curriculum intro
│   │   └── unit-01/ to unit-07/  # Unit content + quizzes
│   ├── assets/
│   │   ├── js/                # JavaScript files
│   │   └── images/            # Images
│   ├── digests/               # Daily digests
│   └── newsletters/           # Newsletter archive
├── netlify/
│   └── functions/             # Serverless functions
│       ├── check-profile.js   # Check if user exists
│       ├── create-profile.js  # Create new profile
│       ├── get-user-scores.js # Fetch user progress
│       ├── save-result.js     # Save quiz/assessment
│       └── send-verification.js # Email verification
└── netlify.toml               # Netlify config
```

---

## Serverless Functions Reference

| Function | Purpose |
|----------|---------|
| `check-profile` | Check if email exists in DB |
| `create-profile` | Create new user profile |
| `get-user-scores` | Fetch quiz scores + assessments for a user |
| `save-result` | Save quiz score or assessment result |
| `send-verification` | Send verification email + verify tokens |

---

## Customization

### Change Allowed Email Domains

In `dist/curriculum/signup.html` and `dist/curriculum/login.html`:
```javascript
const ALLOWED_DOMAINS = ['sap.com'];  // Change to your domain(s)
```

### Modify Quiz Content

Quiz files are in `dist/curriculum/unit-XX/quiz.html`. Each contains:
- Questions and answers in JavaScript
- Scoring logic
- Pass threshold (default: 80%)

### Update Branding

- Logo: `dist/assets/images/logo.svg` and `logo-white.svg`
- Colors: Search for CSS variables `--dark-slate`, `--sap-blue`, etc.
- Site name: Global search/replace "Future of PMM"

---

## Troubleshooting

### "No account found" on login
- Check Supabase connection (correct URL + keys)
- Verify the `profiles` table exists
- Check Netlify function logs

### Verification email not arriving
- Check Resend API key is valid
- Verify sender domain in Resend dashboard
- Check spam folder

### Quiz scores not saving
- Check browser console for errors
- Verify `SUPABASE_SERVICE_KEY` is set in Netlify
- Check Netlify function logs

### Corporate proxy issues
All Supabase calls go through Netlify functions specifically to avoid corporate proxy issues. If you still have problems, check that your corporate network allows HTTPS to your Netlify domain.

---

## Support

For questions about this codebase, contact:
- **Chris O'Hara** — christopher.ohara@sap.com

---

*Last updated: May 24, 2026*
