-- Fix admin setup to work with Supabase auth users
-- This script creates the necessary functions and triggers

-- Function to create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'user',
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to make a user admin by email
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS json AS $$
DECLARE
  user_record record;
  result json;
BEGIN
  -- Find user in auth.users
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = user_email;

  -- Check if user exists
  IF NOT FOUND THEN
    result := json_build_object(
      'success', false,
      'message', 'User with email ' || user_email || ' not found. Please make sure they have registered first.'
    );
    RETURN result;
  END IF;

  -- Create or update user profile with admin role
  INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    user_record.id,
    user_record.email,
    user_record.email,
    'admin',
    now(),
    now()
  )
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = now();

  result := json_build_object(
    'success', true,
    'message', 'Successfully granted admin access to ' || user_email || '! They can now access the admin panel.'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_profiles TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.make_user_admin(text) TO authenticated;

-- Create profile for existing user if needed
DO $$
DECLARE
  user_record record;
BEGIN
  -- Check if holacupid7@gmail.com exists in auth.users but not in user_profiles
  SELECT id, email INTO user_record
  FROM auth.users
  WHERE email = 'holacupid7@gmail.com';
  
  IF FOUND THEN
    INSERT INTO public.user_profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (
      user_record.id,
      user_record.email,
      user_record.email,
      'user',
      now(),
      now()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Test the function for holacupid7@gmail.com
SELECT public.make_user_admin('holacupid7@gmail.com');
