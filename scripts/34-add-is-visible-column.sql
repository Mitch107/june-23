-- Add is_visible column to profile_images table if it doesn't exist
DO $$ 
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profile_images' 
        AND column_name = 'is_visible'
    ) THEN
        -- Add the column with default value
        ALTER TABLE profile_images 
        ADD COLUMN is_visible boolean DEFAULT true;
        
        -- Update existing records to be visible by default
        UPDATE profile_images 
        SET is_visible = true 
        WHERE is_visible IS NULL;
        
        RAISE NOTICE 'Added is_visible column to profile_images table';
    ELSE
        RAISE NOTICE 'is_visible column already exists in profile_images table';
    END IF;
END $$;

-- Verify the column was added correctly
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profile_images' 
AND column_name = 'is_visible';
