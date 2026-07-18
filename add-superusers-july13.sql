-- Run this in Supabase SQL Editor (futureofpmm project)
-- Adds Chris Sierra and John Koblinsky with full team-tier access

-- First, create auth users via Supabase Dashboard > Authentication > Users > Add User:
-- 1. chris.sierra@sap.com
-- 2. john.koblinsky@sap.com
-- Select "Auto-confirm email" for both

-- Then run this to create/update profiles with team tier:

-- Chris Sierra
INSERT INTO public.profiles (id, email, first_name, last_name, tier, newsletter_subscribed, created_at)
SELECT id, 'chris.sierra@sap.com', 'Chris', 'Sierra', 'team', true, now()
FROM auth.users WHERE email = 'chris.sierra@sap.com'
ON CONFLICT (id) DO UPDATE SET tier = 'team', first_name = 'Chris', last_name = 'Sierra';

-- John Koblinsky
INSERT INTO public.profiles (id, email, first_name, last_name, tier, newsletter_subscribed, created_at)
SELECT id, 'john.koblinsky@sap.com', 'John', 'Koblinsky', 'team', true, now()
FROM auth.users WHERE email = 'john.koblinsky@sap.com'
ON CONFLICT (id) DO UPDATE SET tier = 'team', first_name = 'John', last_name = 'Koblinsky';

-- Verify:
SELECT id, email, first_name, last_name, tier, created_at 
FROM public.profiles 
WHERE email IN ('chris.sierra@sap.com', 'john.koblinsky@sap.com');
