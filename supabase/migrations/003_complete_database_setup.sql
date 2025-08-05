-- ============================================================================
-- COMPLETE DATABASE SETUP FOR M-TAJI APPLICATION
-- ============================================================================

-- Check existing policies for profiles table
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Create profiles table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    social_links JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Users can read their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
    ) THEN
        CREATE POLICY "Users can view own profile" ON public.profiles
            FOR SELECT USING (auth.uid() = id);
    END IF;

    -- Users can update their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" ON public.profiles
            FOR UPDATE USING (auth.uid() = id);
    END IF;

    -- Allow insert during registration
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile" ON public.profiles
            FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- USER PROJECTS TABLE
-- ============================================================================

-- Create user_projects table
CREATE TABLE IF NOT EXISTS public.user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('education', 'health', 'agriculture', 'environment', 'economic', 'technology')),
    impact_description TEXT,
    completion_date DATE,
    image_url TEXT,
    video_url TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('completed', 'in_progress', 'planned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for user_projects
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- Create policies for user_projects
DO $$
BEGIN
    -- Users can view all projects
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_projects' AND policyname = 'Users can view all projects'
    ) THEN
        CREATE POLICY "Users can view all projects" ON public.user_projects
            FOR SELECT USING (true);
    END IF;

    -- Users can manage their own projects
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_projects' AND policyname = 'Users can manage own projects'
    ) THEN
        CREATE POLICY "Users can manage own projects" ON public.user_projects
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create updated_at trigger for user_projects
DROP TRIGGER IF EXISTS handle_user_projects_updated_at ON public.user_projects;
CREATE TRIGGER handle_user_projects_updated_at
    BEFORE UPDATE ON public.user_projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- FUNDRAISING CAMPAIGNS TABLE
-- ============================================================================

-- Create fundraising_campaigns table
CREATE TABLE IF NOT EXISTS public.fundraising_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.user_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    funding_goal DECIMAL(10,2) NOT NULL,
    raised_amount DECIMAL(10,2) DEFAULT 0,
    campaign_duration INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for fundraising_campaigns
ALTER TABLE public.fundraising_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for fundraising_campaigns
DO $$
BEGIN
    -- Users can view all fundraising campaigns
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'fundraising_campaigns' AND policyname = 'Users can view all fundraising campaigns'
    ) THEN
        CREATE POLICY "Users can view all fundraising campaigns" ON public.fundraising_campaigns
            FOR SELECT USING (true);
    END IF;

    -- Users can manage fundraising campaigns for their own projects
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'fundraising_campaigns' AND policyname = 'Users can manage own fundraising campaigns'
    ) THEN
        CREATE POLICY "Users can manage own fundraising campaigns" ON public.fundraising_campaigns
            FOR ALL USING (
                auth.uid() = (
                    SELECT user_id FROM public.user_projects WHERE id = project_id
                )
            );
    END IF;
END $$;

-- Create updated_at trigger for fundraising_campaigns
DROP TRIGGER IF EXISTS handle_fundraising_campaigns_updated_at ON public.fundraising_campaigns;
CREATE TRIGGER handle_fundraising_campaigns_updated_at
    BEFORE UPDATE ON public.fundraising_campaigns
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    category TEXT NOT NULL CHECK (category IN ('clothing', 'accessories', 'books', 'art', 'other')),
    stock_quantity INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
DO $$
BEGIN
    -- Users can view all active products
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can view active products'
    ) THEN
        CREATE POLICY "Users can view active products" ON public.products
            FOR SELECT USING (is_active = true);
    END IF;

    -- Users can manage their own products
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Users can manage own products'
    ) THEN
        CREATE POLICY "Users can manage own products" ON public.products
            FOR ALL USING (auth.uid() = author_id);
    END IF;
END $$;

-- Create updated_at trigger for products
DROP TRIGGER IF EXISTS handle_products_updated_at ON public.products;
CREATE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    body TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
DO $$
BEGIN
    -- Users can view published blog posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Users can view published blog posts'
    ) THEN
        CREATE POLICY "Users can view published blog posts" ON public.blog_posts
            FOR SELECT USING (is_published = true);
    END IF;

    -- Users can manage own blog posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Users can manage own blog posts'
    ) THEN
        CREATE POLICY "Users can manage own blog posts" ON public.blog_posts
            FOR ALL USING (auth.uid() = author_id);
    END IF;
END $$;

-- Create updated_at trigger for blog_posts
DROP TRIGGER IF EXISTS handle_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER handle_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- MICROBLOG POSTS TABLE
-- ============================================================================

-- Create microblog_posts table
CREATE TABLE IF NOT EXISTS public.microblog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('job', 'event', 'news', 'announcement')),
    media JSONB DEFAULT '{}',
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    is_published BOOLEAN DEFAULT false,
    likes INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security for microblog_posts
ALTER TABLE public.microblog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for microblog_posts
DO $$
BEGIN
    -- Users can view published microblog posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'microblog_posts' AND policyname = 'Users can view published microblog posts'
    ) THEN
        CREATE POLICY "Users can view published microblog posts" ON public.microblog_posts
            FOR SELECT USING (is_published = true);
    END IF;

    -- Users can manage own microblog posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'microblog_posts' AND policyname = 'Users can manage own microblog posts'
    ) THEN
        CREATE POLICY "Users can manage own microblog posts" ON public.microblog_posts
            FOR ALL USING (auth.uid() = author_id);
    END IF;
END $$;

-- Create updated_at trigger for microblog_posts
DROP TRIGGER IF EXISTS handle_microblog_posts_updated_at ON public.microblog_posts;
CREATE TRIGGER handle_microblog_posts_updated_at
    BEFORE UPDATE ON public.microblog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check all created tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'user_projects', 'fundraising_campaigns', 'products', 'blog_posts', 'microblog_posts')
ORDER BY table_name;

-- Check all policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('profiles', 'user_projects', 'fundraising_campaigns', 'products', 'blog_posts', 'microblog_posts')
ORDER BY tablename, policyname;

-- Check all triggers
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
AND event_object_table IN ('profiles', 'user_projects', 'fundraising_campaigns', 'products', 'blog_posts', 'microblog_posts')
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: profiles, user_projects, fundraising_campaigns, products, blog_posts, microblog_posts';
    RAISE NOTICE 'RLS policies and triggers configured';
    RAISE NOTICE 'Ready for application use!';
END $$; 