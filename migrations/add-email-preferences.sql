-- Migration: Add email preferences to profiles table
-- Run this in Supabase Dashboard → SQL Editor

-- Add email preference columns
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT TRUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS digest_opt_in BOOLEAN DEFAULT TRUE;

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('newsletter_opt_in', 'digest_opt_in');
