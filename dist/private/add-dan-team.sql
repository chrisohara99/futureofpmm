-- =====================================================
-- ADD TEAM SEGMENTATION TO PROFILES
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Step 1: Add team column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS team TEXT DEFAULT NULL;

-- Step 2: Mark Dan's team members (40 people)
UPDATE profiles 
SET team = 'dan_yu'
WHERE LOWER(email) IN (
    'a.naji@sap.com',
    'axel.schuller@sap.com',
    'brian.raver@sap.com',
    'cathy.citarelli@sap.com',
    'christopher.ohara@sap.com',
    'corrie.birkeness@sap.com',
    'dan.yu@sap.com',
    'daniel.dukes@sap.com',
    'jacob.brass@sap.com',
    'jose.chicas@sap.com',
    'josh.ledbetter@sap.com',
    'justin.ham@sap.com',
    'kaiser.larsen@sap.com',
    'kara.reed@sap.com',
    'karsten.ruf@sap.com',
    'katryn.cheng@sap.com',
    'kendall.dignam@sap.com',
    'kuba.kufel@sap.com',
    'lauren.wong@sap.com',
    'liam.clarke@sap.com',
    'matthew.lyman@sap.com',
    'max.law@sap.com',
    'megan.hoy@sap.com',
    'neil.whitehead@sap.com',
    'olivier.duvelleroy@sap.com',
    'orla.cullen@sap.com',
    'pam.barrowcliffe@sap.com',
    'saely.espaillat@sap.com',
    'savannah.voll@sap.com',
    'scott.mackenzie@sap.com',
    'sim.patara@sap.com',
    'stuart.giles@sap.com',
    'tara.rogers@sap.com',
    'teuta.elezaj@sap.com',
    'thierry.audas@sap.com',
    'tiffany.baker@sap.com',
    'tony.fassette@sap.com',
    'tony.truong@sap.com',
    'venkata.giduthuri@sap.com',
    'yanhong.tong@sap.com'
);

-- Step 3: Mark everyone else as test_user
UPDATE profiles 
SET team = 'test_user'
WHERE team IS NULL;

-- Step 4: Verify the update
SELECT 
    team,
    COUNT(*) as count
FROM profiles
GROUP BY team
ORDER BY team;

-- =====================================================
-- DONE! You can now query by team:
-- SELECT * FROM profiles WHERE team = 'dan_yu';
-- SELECT * FROM profiles WHERE team = 'test_user';
-- =====================================================
