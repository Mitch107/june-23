-- Create sample profiles with proper UUIDs to work with existing schema
-- This works with the current database structure

-- First, let's check if we have any profiles
DO $$
BEGIN
  -- Only insert if profiles table is empty
  IF NOT EXISTS (SELECT 1 FROM profiles LIMIT 1) THEN
    
    -- Insert sample profiles with UUIDs
    INSERT INTO profiles (id, name, age, location, price, featured, interests, description, status) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Carmen', 25, 'Santo Domingo', 2.00, true, ARRAY['Dancing', 'Music', 'Travel'], 'Beautiful and charming woman from Santo Domingo', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Daniela', 28, 'Santiago', 2.00, false, ARRAY['Fitness', 'Cooking', 'Reading'], 'Intelligent and active woman from Santiago', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Sofia', 23, 'Puerto Plata', 2.00, true, ARRAY['Beach', 'Photography', 'Art'], 'Creative and fun-loving woman from Puerto Plata', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Scarlett', 26, 'Santo Domingo', 2.00, true, ARRAY['Fashion', 'Dancing', 'Music'], 'Stunning model and dancer from Santo Domingo', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Anyelina', 24, 'Santiago', 2.00, false, ARRAY['Travel', 'Food', 'Adventure'], 'Adventurous spirit from Santiago', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440006', 'Dina', 27, 'La Romana', 2.00, false, ARRAY['Books', 'Movies', 'Culture'], 'Cultured and intelligent woman from La Romana', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440007', 'Idelsy', 29, 'Puerto Plata', 2.00, false, ARRAY['Nature', 'Hiking', 'Wellness'], 'Nature lover from Puerto Plata', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440008', 'Osmaily', 22, 'Santo Domingo', 2.00, true, ARRAY['Music', 'Dance', 'Party'], 'Young and vibrant from Santo Domingo', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440009', 'Perla', 30, 'Santiago', 2.00, false, ARRAY['Business', 'Travel', 'Luxury'], 'Successful businesswoman from Santiago', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440010', 'Valentina', 25, 'La Romana', 2.00, true, ARRAY['Fashion', 'Beauty', 'Lifestyle'], 'Fashion enthusiast from La Romana', 'approved'),
    ('550e8400-e29b-41d4-a716-446655440011', 'Yoselin', 26, 'Puerto Plata', 2.00, false, ARRAY['Sports', 'Fitness', 'Health'], 'Fitness enthusiast from Puerto Plata', 'approved');

    -- Insert sample profile images
    INSERT INTO profile_images (profile_id, image_url, is_primary, display_order) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '/images/carmen-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440002', '/images/daniela-1.png', true, 1),
    ('550e8400-e29b-41d4-a716-446655440003', '/images/sofia-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-2.jpg', false, 2),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-3.jpg', false, 3),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-4.jpg', false, 4),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-5.jpg', false, 5),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-6.jpg', false, 6),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-7.jpg', false, 7),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-8.jpg', false, 8),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-9.jpg', false, 9),
    ('550e8400-e29b-41d4-a716-446655440004', '/images/scarlett-10.jpg', false, 10),
    ('550e8400-e29b-41d4-a716-446655440005', '/images/anyelina-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440006', '/images/dina-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440007', '/images/idelsy-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440008', '/images/osmaily-1.jpg', true, 1),
    ('550e8400-e29b-41d4-a716-446655440009', '/images/perla-1.png', true, 1),
    ('550e8400-e29b-41d4-a716-446655440010', '/images/valentina-1.png', true, 1),
    ('550e8400-e29b-41d4-a716-446655440011', '/images/yoselin-1.jpg', true, 1);

    RAISE NOTICE 'Sample profiles with UUIDs created successfully';
  ELSE
    RAISE NOTICE 'Profiles already exist, skipping sample data creation';
  END IF;
END $$;
