-- First, let's see what RLS policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop all existing restrictive policies on profiles table
DROP POLICY IF EXISTS "Users can view approved profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public profile submissions" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

-- Create new policies that allow profile submissions

-- 1. Allow everyone to view approved/active profiles (for browsing)
CREATE POLICY "Public can view active profiles" ON profiles
  FOR SELECT USING (status IN ('approved', 'active'));

-- 2. Allow INSERT for profile submissions (this is key for submit-profile to work)
CREATE POLICY "Allow profile submissions" ON profiles
  FOR INSERT WITH CHECK (status = 'pending');

-- 3. Allow admins to see and manage all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );

-- Also fix profile_images policies
DROP POLICY IF EXISTS "Users can view profile images" ON profile_images;
DROP POLICY IF EXISTS "Allow profile image uploads" ON profile_images;
DROP POLICY IF EXISTS "Users can manage their profile images" ON profile_images;

-- Allow everyone to view profile images
CREATE POLICY "Public can view profile images" ON profile_images
  FOR SELECT USING (true);

-- Allow profile image uploads (for profile submissions)
CREATE POLICY "Allow profile image submissions" ON profile_images
  FOR INSERT WITH CHECK (true);

-- Allow admins to manage profile images
CREATE POLICY "Admins can manage profile images" ON profile_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role IN ('admin', 'super_admin')
    )
  );
