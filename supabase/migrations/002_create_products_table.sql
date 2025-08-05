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

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view all active products
CREATE POLICY "Users can view active products" ON public.products
    FOR SELECT USING (is_active = true);

-- Users can manage their own products
CREATE POLICY "Users can manage own products" ON public.products
    FOR ALL USING (auth.uid() = author_id);

-- Create updated_at trigger
CREATE OR REPLACE TRIGGER handle_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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
CREATE POLICY "Users can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage own blog posts" ON public.blog_posts
    FOR ALL USING (auth.uid() = author_id);

-- Create updated_at trigger for blog_posts
CREATE OR REPLACE TRIGGER handle_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

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
CREATE POLICY "Users can view published microblog posts" ON public.microblog_posts
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can manage own microblog posts" ON public.microblog_posts
    FOR ALL USING (auth.uid() = author_id);

-- Create updated_at trigger for microblog_posts
CREATE OR REPLACE TRIGGER handle_microblog_posts_updated_at
    BEFORE UPDATE ON public.microblog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at(); 