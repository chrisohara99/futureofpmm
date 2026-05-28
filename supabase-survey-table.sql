-- Create survey_responses table for curriculum feedback
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    value_rating INTEGER NOT NULL CHECK (value_rating >= 1 AND value_rating <= 5),
    newsletter_rating INTEGER CHECK (newsletter_rating >= 0 AND newsletter_rating <= 5),
    content_rating INTEGER CHECK (content_rating >= 0 AND content_rating <= 5),
    assessments_rating INTEGER CHECK (assessments_rating >= 0 AND assessments_rating <= 5),
    labs_rating INTEGER CHECK (labs_rating >= 0 AND labs_rating <= 5),
    top_learning TEXT NOT NULL,
    most_useful_unit TEXT NOT NULL,
    applying_at_work TEXT NOT NULL,
    improvements TEXT,
    nps INTEGER NOT NULL CHECK (nps >= 0 AND nps <= 10),
    email TEXT,  -- Optional, for tracking who responded
    week_number INTEGER,  -- Week of year for trend analysis
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for weekly analysis
CREATE INDEX IF NOT EXISTS idx_survey_week ON survey_responses(week_number);
CREATE INDEX IF NOT EXISTS idx_survey_created ON survey_responses(created_at);

-- No RLS needed - accessed via service key only
