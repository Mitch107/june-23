-- Create test approved profiles for debugging
-- This script ensures we have some approved profiles to display

-- First, let's check if we have any approved profiles
DO $$
DECLARE
    approved_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO approved_count FROM profiles WHERE status = 'approved';
    
    RAISE NOTICE 'Current approved profiles count: %', approved_count;
    
    -- If we have no approved profiles, let's approve some existing ones or create new ones
    IF approved_count = 0 THEN
        -- First try to approve existing pending profiles
        UPDATE profiles 
        SET status = 'approved', updated_at = NOW()
        WHERE status = 'pending'
        AND id IN (
            SELECT id FROM profiles 
            WHERE status = 'pending' 
            LIMIT 5
        );
        
        GET DIAGNOSTICS approved_count = ROW_COUNT;
        RAISE NOTICE 'Approved % existing pending profiles', approved_count;
        
        -- If still no approved profiles, create some test ones
        IF approved_count = 0 THEN
            INSERT INTO profiles (
                id,
                name,
                age,
                location,
                price,
                description,
                status,
                created_at,
                updated_at
            ) VALUES 
            (
                gen_random_uuid(),
                'Sofia Martinez',
                25,
                'Santo Domingo',
                2,
                'Friendly and outgoing person looking to meet new people. I love dancing, music, and exploring new places.',
                'approved',
                NOW(),
                NOW()
            ),
            (
                gen_random_uuid(),
                'Carmen Rodriguez',
                28,
                'Santiago',
                2,
                'Professional and ambitious. I enjoy reading, traveling, and spending time with family and friends.',
                'approved',
                NOW(),
                NOW()
            ),
            (
                gen_random_uuid(),
                'Daniela Fernandez',
                23,
                'Puerto Plata',
                2,
                'Creative and artistic soul. I love painting, photography, and beach walks at sunset.',
                'approved',
                NOW(),
                NOW()
            ),
            (
                gen_random_uuid(),
                'Isabella Santos',
                26,
                'La Romana',
                2,
                'Active and health-conscious. I enjoy yoga, hiking, and cooking healthy meals.',
                'approved',
                NOW(),
                NOW()
            ),
            (
                gen_random_uuid(),
                'Valentina Cruz',
                24,
                'Punta Cana',
                2,
                'Fun-loving and adventurous. I love water sports, dancing, and meeting people from different cultures.',
                'approved',
                NOW(),
                NOW()
            );
            
            RAISE NOTICE 'Created 5 new approved test profiles';
        END IF;
    END IF;
    
    -- Final count check
    SELECT COUNT(*) INTO approved_count FROM profiles WHERE status = 'approved';
    RAISE NOTICE 'Final approved profiles count: %', approved_count;
END $$;

-- Verify the profiles were created/updated
SELECT 
    id,
    name,
    age,
    location,
    status,
    created_at
FROM profiles 
WHERE status = 'approved'
ORDER BY created_at DESC
LIMIT 10;
