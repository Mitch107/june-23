-- Fixed User Synchronization Script
-- This script corrects the column names to match your actual database schema

-- First, let's check if the user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'holacupid7@gmail.com';

-- Check the structure of user_profiles table to confirm column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles';

-- Check if profile already exists
SELECT * 
FROM user_profiles 
WHERE email = 'holacupid7@gmail.com';

-- Insert the user profile with the correct column names
-- The primary key column is 'id' not 'user_id'
INSERT INTO user_profiles (id, email, full_name, created_at, updated_at)
SELECT 
    id,
    email,
    COALESCE(raw_user_meta_data->>'full_name', 'User') as full_name,
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

-- Now let's check if there's a role column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND column_name = 'role';

-- If the role column exists, update it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'role'
    ) THEN
        EXECUTE 'UPDATE user_profiles SET role = ''admin'', updated_at = NOW() WHERE email = ''holacupid7@gmail.com''';
    END IF;
END $$;

-- Alternative approach: Add the user to the admin_users table if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'admin_users'
    ) THEN
        EXECUTE 'INSERT INTO admin_users (user_id) SELECT id FROM user_profiles WHERE email = ''holacupid7@gmail.com'' ON CONFLICT DO NOTHING';
    END IF;
END $$;
