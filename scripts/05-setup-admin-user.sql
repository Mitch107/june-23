-- Setup Admin User Script
-- This script will help you set up your first admin user

-- First, let's check if the admin enhancements have been applied
DO $$
BEGIN
    -- Check if role column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND column_name = 'role'
    ) THEN
        -- Add role column if it doesn't exist
        ALTER TABLE user_profiles 
        ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));
        
        RAISE NOTICE 'Added role column to user_profiles table';
    ELSE
        RAISE NOTICE 'Role column already exists in user_profiles table';
    END IF;
END $$;

-- Create a function to make a user admin (safer than direct UPDATE)
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
    user_count INTEGER;
    result_message TEXT;
BEGIN
    -- Check if user exists
    SELECT COUNT(*) INTO user_count
    FROM user_profiles 
    WHERE email = user_email;
    
    IF user_count = 0 THEN
        result_message := 'User with email ' || user_email || ' not found. Please register first.';
    ELSE
        -- Update user role to admin
        UPDATE user_profiles 
        SET role = 'admin' 
        WHERE email = user_email;
        
        result_message := 'Successfully granted admin access to ' || user_email;
    END IF;
    
    RETURN result_message;
END;
$$ LANGUAGE plpgsql;

-- Example usage (uncomment and replace with your email):
-- SELECT make_user_admin('your-email@example.com');

-- Check current admin users
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
WHERE role IN ('admin', 'super_admin')
ORDER BY created_at DESC;

-- If no results above, it means no admin users exist yet
