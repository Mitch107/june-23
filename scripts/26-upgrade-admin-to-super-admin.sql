-- Upgrade admin@holacupid.com to super_admin role
-- This script will change the role from 'admin' to 'super_admin'

-- First, let's check the current role
SELECT email, role, created_at 
FROM user_profiles 
WHERE email = 'admin@holacupid.com';

-- Update the role to super_admin
UPDATE user_profiles 
SET role = 'super_admin', 
    updated_at = NOW()
WHERE email = 'admin@holacupid.com';

-- Verify the change
SELECT email, role, updated_at 
FROM user_profiles 
WHERE email = 'admin@holacupid.com';

-- Show all admin and super_admin users
SELECT email, role, created_at, updated_at
FROM user_profiles 
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at;
