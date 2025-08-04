# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the M-taji fundraising webapp.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter a project name (e.g., "m-taji-fundraising")
5. Set a database password
6. Choose a region close to your users
7. Click "Create new project"

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **Anon public key** (starts with `eyJ`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root
2. Add the following variables:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual Supabase project credentials.

## Step 4: Set Up the Database

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql`
3. Click "Run" to execute the migration

This will create:
- A `profiles` table to store user information
- Row Level Security (RLS) policies
- Triggers to automatically create user profiles
- Functions to handle user management

## Step 5: Configure Authentication Settings

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following settings:

### Site URL
- Set to `http://localhost:5173` for development
- Set to your production URL for deployment

### Redirect URLs
Add these URLs to the redirect list:
- `http://localhost:5173/dashboard`
- `http://localhost:5173/signin`
- `http://localhost:5173/signup`

### Email Templates (Optional)
You can customize the email templates in Authentication > Email Templates:
- Confirm signup
- Magic link
- Change email address
- Reset password

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173/signup`
3. Create a new account
4. Verify that you can sign in and access the dashboard

## Step 7: Create an Admin User (Optional)

To create an admin user, you can either:

### Option A: Use the Supabase Dashboard
1. Go to Authentication > Users
2. Find your user
3. In the SQL Editor, run:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

### Option B: Use the SQL Editor
1. Go to the SQL Editor in your Supabase dashboard
2. Run the following query:
   ```sql
   UPDATE public.profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   ```

## Features Implemented

### Authentication
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Automatic session management
- ✅ Protected routes with loading states
- ✅ User profile management

### Database
- ✅ Profiles table with user information
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation on signup
- ✅ Role-based access control (admin/user)

### Security
- ✅ Password hashing (handled by Supabase)
- ✅ JWT token management
- ✅ Secure session handling
- ✅ Row Level Security policies

## Next Steps

After setting up authentication, you can extend the integration with:

1. **Storage**: Upload and manage images/files
2. **Real-time**: Live updates for donations and campaigns
3. **Database**: Additional tables for campaigns, donations, projects
4. **Edge Functions**: Serverless functions for complex operations

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure your `.env` file exists and has the correct values
   - Restart your development server after adding environment variables

2. **"Invalid login credentials"**
   - Check that the user exists in Supabase Authentication
   - Verify the email and password are correct

3. **"Row Level Security policy violation"**
   - Ensure the user is authenticated
   - Check that the RLS policies are correctly configured

4. **"Profile not found"**
   - The profile should be created automatically on signup
   - Check the database trigger is working correctly

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
- Check the browser console for detailed error messages 