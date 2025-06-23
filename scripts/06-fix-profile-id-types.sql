-- Fix profile ID data types to use integers instead of UUIDs
-- This aligns with the frontend which uses integer IDs

-- First, drop existing foreign key constraints
ALTER TABLE IF EXISTS cart_items DROP CONSTRAINT IF EXISTS cart_items_profile_id_fkey;
ALTER TABLE IF EXISTS orders DROP CONSTRAINT IF EXISTS orders_profile_id_fkey;
ALTER TABLE IF EXISTS profile_images DROP CONSTRAINT IF EXISTS profile_images_profile_id_fkey;

-- Update profiles table to use integer ID
ALTER TABLE profiles 
  ALTER COLUMN id TYPE INTEGER USING id::INTEGER;

-- Update related tables to use integer profile_id
ALTER TABLE IF EXISTS cart_items 
  ALTER COLUMN profile_id TYPE INTEGER USING profile_id::INTEGER;

ALTER TABLE IF EXISTS orders 
  ALTER COLUMN profile_id TYPE INTEGER USING profile_id::INTEGER;

ALTER TABLE IF EXISTS profile_images 
  ALTER COLUMN profile_id TYPE INTEGER USING profile_id::INTEGER;

-- Recreate foreign key constraints
ALTER TABLE cart_items 
  ADD CONSTRAINT cart_items_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE orders 
  ADD CONSTRAINT orders_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE profile_images 
  ADD CONSTRAINT profile_images_profile_id_fkey 
  FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Insert sample profiles with integer IDs if they don't exist
INSERT INTO profiles (id, name, age, location, price, featured, interests, description, details, status, created_at, updated_at)
VALUES 
  (1, 'Carmen', 25, 'Santo Domingo', 2.00, true, ARRAY['Dancing', 'Music', 'Travel'], 'Beautiful and charming woman from Santo Domingo', '{"height": "5''6\"", "education": "University", "profession": "Model", "languages": ["Spanish", "English"], "relationship": "Single", "children": "None", "smoking": "No", "drinking": "Socially"}', 'approved', NOW(), NOW()),
  (2, 'Daniela', 28, 'Santiago', 2.00, false, ARRAY['Fitness', 'Cooking', 'Reading'], 'Intelligent and active woman from Santiago', '{"height": "5''4\"", "education": "Masters", "profession": "Teacher", "languages": ["Spanish", "English"], "relationship": "Single", "children": "None", "smoking": "No", "drinking": "Occasionally"}', 'approved', NOW(), NOW()),
  (3, 'Sofia', 23, 'Puerto Plata', 2.00, true, ARRAY['Beach', 'Photography', 'Art'], 'Creative and fun-loving woman from Puerto Plata', '{"height": "5''5\"", "education": "University", "profession": "Artist", "languages": ["Spanish"], "relationship": "Single", "children": "None", "smoking": "No", "drinking": "No"}', 'approved', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  age = EXCLUDED.age,
  location = EXCLUDED.location,
  updated_at = NOW();

-- Insert sample profile images
INSERT INTO profile_images (profile_id, image_url, is_primary, display_order)
VALUES 
  (1, '/images/carmen-1.jpg', true, 1),
  (2, '/images/daniela-1.png', true, 1),
  (3, '/images/sofia-1.jpg', true, 1)
ON CONFLICT (profile_id, display_order) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  is_primary = EXCLUDED.is_primary;
