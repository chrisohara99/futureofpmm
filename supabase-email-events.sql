-- Email events tracking table for Resend webhooks
-- Run this in Supabase SQL editor

CREATE TABLE IF NOT EXISTS email_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  email_id TEXT,
  to_email TEXT,
  subject TEXT,
  click_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_to_email ON email_events(to_email);
CREATE INDEX IF NOT EXISTS idx_email_events_created ON email_events(created_at DESC);

-- Enable RLS
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts from service role (webhook function)
CREATE POLICY "Allow service role inserts" ON email_events
  FOR INSERT TO service_role
  WITH CHECK (true);

-- Allow reads from service role
CREATE POLICY "Allow service role reads" ON email_events
  FOR SELECT TO service_role
  USING (true);
