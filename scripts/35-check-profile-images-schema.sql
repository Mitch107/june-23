-- Check the current schema of profile_images table
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'profile_images'
ORDER BY ordinal_position;
