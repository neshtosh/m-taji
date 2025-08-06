-- ============================================================================
-- FIX PROFILES RLS POLICY FOR PUBLIC SEARCH
-- ============================================================================

-- Add policy to allow public reading of all profiles (for search functionality)
CREATE POLICY "Public can view all profiles" ON public.profiles
    FOR SELECT USING (true);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all policies on profiles table
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test the policy by counting users
SELECT COUNT(*) as total_users FROM profiles;

-- Show all users in profiles table
SELECT 
    id,
    name,
    email,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Public read policy added to profiles table!';
    RAISE NOTICE 'Search functionality should now work correctly.';
    RAISE NOTICE 'Users can now search and view all profiles.';
END $$; 