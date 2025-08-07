-- ============================================================================
-- FOLLOWERS TABLE
-- ============================================================================

-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Enable Row Level Security for followers
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Create policies for followers
DO $$
BEGIN
    -- Users can view all follower relationships (for public profiles)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'followers' AND policyname = 'Users can view all follower relationships'
    ) THEN
        CREATE POLICY "Users can view all follower relationships" ON public.followers
            FOR SELECT USING (true);
    END IF;

    -- Users can manage their own follow relationships
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'followers' AND policyname = 'Users can manage own follow relationships'
    ) THEN
        CREATE POLICY "Users can manage own follow relationships" ON public.followers
            FOR ALL USING (auth.uid() = follower_id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);
CREATE INDEX IF NOT EXISTS idx_followers_created_at ON public.followers(created_at);

-- ============================================================================
-- FUNCTIONS FOR FOLLOWERS
-- ============================================================================

-- Function to get follower count for a user
CREATE OR REPLACE FUNCTION get_follower_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM public.followers 
        WHERE following_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get following count for a user
CREATE OR REPLACE FUNCTION get_following_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM public.followers 
        WHERE follower_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is following another user
CREATE OR REPLACE FUNCTION is_following(follower_uuid UUID, following_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.followers 
        WHERE follower_id = follower_uuid AND following_id = following_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if followers table was created
SELECT 
    'followers' as table_name,
    COUNT(*) as total_followers
FROM followers;

-- Check RLS policies on followers table
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
WHERE tablename = 'followers';
