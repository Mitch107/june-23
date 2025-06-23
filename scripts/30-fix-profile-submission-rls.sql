-- Allow public profile submissions for the submit-profile endpoint
-- This policy allows INSERT operations without authentication for profile submissions

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profiles" ON profiles;

-- Create new policy that allows public profile submissions
CREATE POLICY "Allow public profile submissions" ON profiles
  FOR INSERT WITH CHECK (status = 'pending');

-- Keep the existing SELECT policy for approved profiles
-- (This should already exist from previous scripts)

-- Ensure profile_images can be inserted for new profiles
DROP POLICY IF EXISTS "Users can manage their profile images" ON profile_images;

CREATE POLICY "Allow profile image uploads" ON profile_images
  FOR INSERT WITH CHECK (true);

-- Keep existing SELECT policy for profile images
-- (This should already exist from previous scripts)
