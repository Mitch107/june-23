-- Ensure all profile fields exist in the profiles table
-- This script adds any missing columns that are needed for profile data synchronization

DO $$ 
BEGIN
    -- Add birth_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'birth_date') THEN
        ALTER TABLE profiles ADD COLUMN birth_date DATE;
    END IF;

    -- Add gender column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'gender') THEN
        ALTER TABLE profiles ADD COLUMN gender VARCHAR(50);
    END IF;

    -- Ensure height is stored as text (for values like "5'6")
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'profiles' AND column_name = 'height' AND data_type = 'integer') THEN
        ALTER TABLE profiles ALTER COLUMN height TYPE VARCHAR(20);
    END IF;

    -- Add height column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'height') THEN
        ALTER TABLE profiles ADD COLUMN height VARCHAR(20);
    END IF;

    -- Add first_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'first_name') THEN
        ALTER TABLE profiles ADD COLUMN first_name TEXT;
    END IF;

    -- Add last_name column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'last_name') THEN
        ALTER TABLE profiles ADD COLUMN last_name TEXT;
    END IF;

    -- Add education column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'education') THEN
        ALTER TABLE profiles ADD COLUMN education TEXT;
    END IF;

    -- Add occupation_details column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'occupation_details') THEN
        ALTER TABLE profiles ADD COLUMN occupation_details TEXT;
    END IF;

    -- Add relationship_status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'relationship_status') THEN
        ALTER TABLE profiles ADD COLUMN relationship_status TEXT;
    END IF;

    -- Add children column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'children') THEN
        ALTER TABLE profiles ADD COLUMN children TEXT;
    END IF;

    -- Add smoking column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'smoking') THEN
        ALTER TABLE profiles ADD COLUMN smoking TEXT;
    END IF;

    -- Add drinking column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'drinking') THEN
        ALTER TABLE profiles ADD COLUMN drinking TEXT;
    END IF;

    -- Add body_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'body_type') THEN
        ALTER TABLE profiles ADD COLUMN body_type TEXT;
    END IF;

    -- Add appearance column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'appearance') THEN
        ALTER TABLE profiles ADD COLUMN appearance TEXT;
    END IF;

    -- Ensure contact fields exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_whatsapp') THEN
        ALTER TABLE profiles ADD COLUMN contact_whatsapp TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_instagram') THEN
        ALTER TABLE profiles ADD COLUMN contact_instagram TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_tiktok') THEN
        ALTER TABLE profiles ADD COLUMN contact_tiktok TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_facebook') THEN
        ALTER TABLE profiles ADD COLUMN contact_facebook TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_telegram') THEN
        ALTER TABLE profiles ADD COLUMN contact_telegram TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'contact_email') THEN
        ALTER TABLE profiles ADD COLUMN contact_email TEXT;
    END IF;

END $$;

-- Update existing profiles to populate first_name and last_name from name field
UPDATE profiles 
SET 
    first_name = COALESCE(first_name, SPLIT_PART(name, ' ', 1)),
    last_name = COALESCE(last_name, TRIM(SUBSTRING(name FROM POSITION(' ' IN name) + 1)))
WHERE first_name IS NULL OR last_name IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_education ON profiles(education);
CREATE INDEX IF NOT EXISTS idx_profiles_relationship_status ON profiles(relationship_status);
