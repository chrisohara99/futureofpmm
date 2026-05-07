-- Migration: Enable Assessment History Tracking
-- Run this in Supabase SQL Editor to allow storing multiple assessment attempts

-- Step 1: Drop the unique constraint that prevents multiple attempts
ALTER TABLE assessment_results 
DROP CONSTRAINT IF EXISTS assessment_results_user_id_assessment_type_key;

-- Step 2: Add attempt_number column (nullable for existing rows)
ALTER TABLE assessment_results 
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1;

-- Step 3: Add index for efficient history queries
CREATE INDEX IF NOT EXISTS idx_assessment_results_history 
ON assessment_results(user_id, assessment_type, completed_at DESC);

-- Note: After running this migration:
-- - New assessment attempts will be INSERTed (not upserted)
-- - Each attempt gets a new row with incrementing attempt_number
-- - Query for latest: ORDER BY completed_at DESC LIMIT 1
-- - Query for history: ORDER BY completed_at ASC
