-- Manual User Synchronization Script
-- This script will help you manually create a user profile for holacupid7@gmail.com

-- First, let's check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'holacupid7@gmail.com';

-- Check if profile already exists
SELECT * 
FROM user_profiles 
WHERE email = 'holacupid7@gmail.com';

-- If the user exists in auth.users but not in user_profiles, run this:
-- Replace 'USER_ID_FROM_ABOVE_QUERY' with the actual UUID from the first query
INSERT INTO user_profiles (user_id, email, full_name, role, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'User') as full_name,
    'user' as role,
    NOW() as created_at,
    NOW() as updated_at
FROM auth.users 
WHERE email = 'holacupid7@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE email = 'holacupid7@gmail.com'
);

-- Verify the profile was created
SELECT * 
FROM user_profiles 
WHERE email = 'holacupid7@gmail.com';

-- Now you can grant admin access
UPDATE user_profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'holacupid7@gmail.com';
