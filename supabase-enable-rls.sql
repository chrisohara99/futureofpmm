-- =====================================================
-- ENABLE ROW LEVEL SECURITY FOR ALL TABLES
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Also enable on activity_progress if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_progress') THEN
        ALTER TABLE activity_progress ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- =====================================================
-- DROP EXISTING POLICIES (to avoid duplicates)
-- =====================================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role full access profiles" ON profiles;

DROP POLICY IF EXISTS "Users can view own quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Users can insert own quiz scores" ON quiz_scores;
DROP POLICY IF EXISTS "Service role full access quiz_scores" ON quiz_scores;

DROP POLICY IF EXISTS "Users can view own chapter progress" ON chapter_progress;
DROP POLICY IF EXISTS "Users can manage own chapter progress" ON chapter_progress;
DROP POLICY IF EXISTS "Service role full access chapter_progress" ON chapter_progress;

DROP POLICY IF EXISTS "Users can manage own assessment results" ON assessment_results;
DROP POLICY IF EXISTS "Service role full access assessment_results" ON assessment_results;

-- =====================================================
-- CREATE POLICIES
-- Service role (used by Netlify functions) bypasses RLS automatically
-- These policies allow authenticated users to access their own data
-- =====================================================

-- PROFILES
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- QUIZ_SCORES
CREATE POLICY "Users can view own quiz scores" ON quiz_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz scores" ON quiz_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CHAPTER_PROGRESS
CREATE POLICY "Users can manage own chapter progress" ON chapter_progress
    FOR ALL USING (auth.uid() = user_id);

-- ASSESSMENT_RESULTS
CREATE POLICY "Users can manage own assessment results" ON assessment_results
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- DONE! 
-- Your tables are now protected by Row Level Security.
-- The Netlify serverless functions use the service_role key,
-- which bypasses RLS, so they will continue to work.
-- =====================================================
SELECT 'RLS enabled successfully!' as status;
