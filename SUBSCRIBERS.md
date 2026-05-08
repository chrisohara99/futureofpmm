# Subscriber Management

## Source of Truth
**Supabase `profiles` table** is the canonical source for all subscribers.

## Key Files
- `subscribers.json` — Local snapshot of all subscribers (auto-generated)
- `known-users.json` — DEPRECATED, use subscribers.json

## Subscriber Fields (in Supabase)
- `email` — SAP email (required)
- `first_name`, `last_name` — Name
- `newsletter_opt_in` — Boolean, receives weekly newsletter
- `digest_opt_in` — Boolean, receives daily digest

## Adding Subscribers
New users are added via:
1. **Self-signup** at futureofpmm.com/curriculum/signup.html
2. **Manual import** via Supabase or script

## Newsletter Send Process
1. Query Supabase for `newsletter_opt_in = true`
2. Send via Resend API
3. Rate limit: max 5/second (use 0.3s delay)

## Current Stats
- **65 subscribers** as of May 8, 2026
- All @sap.com emails
