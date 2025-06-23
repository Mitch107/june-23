-- Manual Admin Setup Script
-- Replace 'your-email@example.com' with your actual email address

-- Method 1: Using the helper function
SELECT make_user_admin('your-email@example.com');

-- Method 2: Direct update (if the function doesn't work)
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify the admin user was created
SELECT 
    email,
    role,
    created_at,
    CASE 
        WHEN role = 'admin' THEN '✅ Admin Access'
        WHEN role = 'super_admin' THEN '🔥 Super Admin Access'
        ELSE '👤 Regular User'
    END as access_level
FROM user_profiles 
WHERE email = 'your-email@example.com';
