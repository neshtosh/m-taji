-- ============================================================================
-- CHECK USERS IN DATABASE
-- ============================================================================

-- Check if profiles table exists and has data
SELECT 
    'profiles' as table_name,
    COUNT(*) as total_users,
    COUNT(CASE WHEN name ILIKE '%alex%' THEN 1 END) as alex_users
FROM profiles;

-- Show all users in profiles table
SELECT 
    id,
    name,
    email,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- Check if auth.users table has data
SELECT 
    'auth.users' as table_name,
    COUNT(*) as total_auth_users
FROM auth.users;

-- Show auth users
SELECT 
    id,
    email,
    raw_user_meta_data,
    created_at
FROM auth.users
ORDER BY created_at DESC;

-- Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 