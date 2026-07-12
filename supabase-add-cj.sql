-- =====================================================
-- ADD CJ O'HARA ACCESS (cj@sap.com)
-- Run this in Supabase Dashboard > SQL Editor (futureofpmm project)
-- =====================================================

-- First, create auth user via Supabase Dashboard > Authentication > Users > Add User:
-- Email: cj@sap.com
-- Select "Auto-confirm email"

-- Then run this to create profile:
INSERT INTO public.profiles (id, email, first_name, last_name, team, created_at)
SELECT id, 'cj@sap.com', 'CJ', 'O''Hara', 'test_user', now()
FROM auth.users WHERE email = 'cj@sap.com'
ON CONFLICT (id) DO UPDATE SET 
  first_name = 'CJ', 
  last_name = 'O''Hara',
  team = 'test_user';

-- Verify:
SELECT id, email, first_name, last_name, team, created_at 
FROM public.profiles 
WHERE email = 'cj@sap.com';
