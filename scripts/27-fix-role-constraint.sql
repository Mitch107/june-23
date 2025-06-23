-- First, let's see what the current constraint allows
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'user_profiles'::regclass 
AND contype = 'c';

-- Drop the existing role check constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Create a new constraint that allows admin, super_admin, and user roles
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check 
CHECK (role IN ('user', 'admin', 'super_admin'));

-- Now update the admin user to super_admin
UPDATE user_profiles 
SET role = 'super_admin' 
WHERE email = 'admin@holacupid.com';

-- Verify the change
SELECT id, email, role, created_at 
FROM user_profiles 
WHERE email = 'admin@holacupid.com';
