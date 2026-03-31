-- SAP Email Domain Restriction
-- Run this in Supabase SQL Editor to restrict signups to @sap.com emails

-- Create function to validate SAP email domain
CREATE OR REPLACE FUNCTION check_sap_email()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if email ends with @sap.com
    IF NEW.email IS NOT NULL AND NOT LOWER(NEW.email) LIKE '%@sap.com' THEN
        RAISE EXCEPTION 'Access restricted to SAP employees. Please use your @sap.com email address.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users table
-- Note: This requires running as a superuser/service role
DROP TRIGGER IF EXISTS enforce_sap_email ON auth.users;
CREATE TRIGGER enforce_sap_email
    BEFORE INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION check_sap_email();

-- Alternative: If you can't create triggers on auth.users,
-- create a check on the profiles table instead
DROP TRIGGER IF EXISTS enforce_sap_email_profiles ON public.profiles;
CREATE TRIGGER enforce_sap_email_profiles
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_sap_email();
