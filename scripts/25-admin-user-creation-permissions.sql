-- Ensure service role can create users and manage profiles
-- This script ensures proper permissions for admin user creation

-- Grant necessary permissions to service_role for user management
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;

-- Ensure user_profiles table has proper permissions
GRANT ALL ON user_profiles TO service_role;

-- Create or replace function to handle user creation with proper permissions
CREATE OR REPLACE FUNCTION create_user_with_profile(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT DEFAULT '',
  user_role TEXT DEFAULT 'user'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- Insert into auth.users (this requires service_role privileges)
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    raw_app_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('full_name', user_full_name),
    '{}',
    FALSE,
    '',
    '',
    '',
    ''
  )
  RETURNING id INTO new_user_id;

  -- Insert into user_profiles
  INSERT INTO user_profiles (
    id,
    email,
    full_name,
    role,
    favorite_profiles
  ) VALUES (
    new_user_id,
    user_email,
    user_full_name,
    user_role,
    '[]'::jsonb
  );

  -- Return success result
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', user_email,
    'full_name', user_full_name,
    'role', user_role
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  -- Return error result
  result := json_build_object(
    'success', false,
    'error', SQLERRM
  );
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users (admins)
GRANT EXECUTE ON FUNCTION create_user_with_profile TO authenticated;

-- Ensure RLS policies allow admins to create users
CREATE POLICY "Admins can insert user profiles" ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role IN ('admin', 'super_admin')
    )
  );
