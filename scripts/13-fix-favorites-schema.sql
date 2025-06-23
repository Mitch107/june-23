-- Drop existing favorites table if it exists
DROP TABLE IF EXISTS favorites CASCADE;

-- Create favorites table with proper foreign key to profiles
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);

-- Add RLS policies for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own favorites
CREATE POLICY favorites_select_policy ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow users to insert their own favorites
CREATE POLICY favorites_insert_policy ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own favorites
CREATE POLICY favorites_delete_policy ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX favorites_user_id_idx ON favorites(user_id);
CREATE INDEX favorites_profile_id_idx ON favorites(profile_id);

-- Insert some test data (optional)
-- Note: This assumes you have profiles with IDs 1, 2, 3 in your profiles table
-- You can remove this section if you don't want test data
