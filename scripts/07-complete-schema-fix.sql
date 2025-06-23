-- Complete database schema fix to use integer IDs for profiles
-- This script will recreate the tables with the correct data types

-- Drop existing tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS contact_deliveries CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS profile_images CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Recreate profiles table with integer ID
CREATE TABLE profiles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL,
    location VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) DEFAULT 2.00,
    featured BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    description TEXT,
    height VARCHAR(50),
    education VARCHAR(255),
    profession VARCHAR(255),
    languages TEXT[],
    interests TEXT[],
    relationship_status VARCHAR(100),
    children VARCHAR(100),
    smoking VARCHAR(50),
    drinking VARCHAR(50),
    body_type VARCHAR(100),
    appearance TEXT,
    looking_for TEXT[],
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_whatsapp VARCHAR(50),
    contact_instagram VARCHAR(100),
    contact_tiktok VARCHAR(100),
    contact_facebook VARCHAR(100),
    contact_telegram VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Recreate profile_images table
CREATE TABLE profile_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(profile_id, display_order)
);

-- Update user_profiles to use integer array for favorite_profiles
ALTER TABLE user_profiles 
ALTER COLUMN favorite_profiles TYPE INTEGER[] USING favorite_profiles::INTEGER[];

-- Recreate cart_items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, profile_id)
);

-- Recreate orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_intent_id VARCHAR(255),
    billing_email VARCHAR(255),
    billing_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Recreate order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    profile_name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    delivered_contact_info JSONB,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Recreate contact_deliveries table
CREATE TABLE contact_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    contact_data JSONB NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accessed_at TIMESTAMP WITH TIME ZONE
);

-- Insert sample profiles
INSERT INTO profiles (id, name, age, location, price, featured, interests, description, status) VALUES 
(1, 'Carmen', 25, 'Santo Domingo', 2.00, true, ARRAY['Dancing', 'Music', 'Travel'], 'Beautiful and charming woman from Santo Domingo', 'approved'),
(2, 'Daniela', 28, 'Santiago', 2.00, false, ARRAY['Fitness', 'Cooking', 'Reading'], 'Intelligent and active woman from Santiago', 'approved'),
(3, 'Sofia', 23, 'Puerto Plata', 2.00, true, ARRAY['Beach', 'Photography', 'Art'], 'Creative and fun-loving woman from Puerto Plata', 'approved'),
(4, 'Scarlett', 26, 'Santo Domingo', 2.00, true, ARRAY['Fashion', 'Dancing', 'Music'], 'Stunning model and dancer from Santo Domingo', 'approved'),
(5, 'Anyelina', 24, 'Santiago', 2.00, false, ARRAY['Travel', 'Food', 'Adventure'], 'Adventurous spirit from Santiago', 'approved'),
(6, 'Dina', 27, 'La Romana', 2.00, false, ARRAY['Books', 'Movies', 'Culture'], 'Cultured and intelligent woman from La Romana', 'approved'),
(7, 'Idelsy', 29, 'Puerto Plata', 2.00, false, ARRAY['Nature', 'Hiking', 'Wellness'], 'Nature lover from Puerto Plata', 'approved'),
(8, 'Osmaily', 22, 'Santo Domingo', 2.00, true, ARRAY['Music', 'Dance', 'Party'], 'Young and vibrant from Santo Domingo', 'approved'),
(9, 'Perla', 30, 'Santiago', 2.00, false, ARRAY['Business', 'Travel', 'Luxury'], 'Successful businesswoman from Santiago', 'approved'),
(10, 'Valentina', 25, 'La Romana', 2.00, true, ARRAY['Fashion', 'Beauty', 'Lifestyle'], 'Fashion enthusiast from La Romana', 'approved'),
(11, 'Yoselin', 26, 'Puerto Plata', 2.00, false, ARRAY['Sports', 'Fitness', 'Health'], 'Fitness enthusiast from Puerto Plata', 'approved');

-- Insert sample profile images
INSERT INTO profile_images (profile_id, image_url, is_primary, display_order) VALUES 
(1, '/images/carmen-1.jpg', true, 1),
(2, '/images/daniela-1.png', true, 1),
(3, '/images/sofia-1.jpg', true, 1),
(4, '/images/scarlett-1.jpg', true, 1),
(4, '/images/scarlett-2.jpg', false, 2),
(4, '/images/scarlett-3.jpg', false, 3),
(4, '/images/scarlett-4.jpg', false, 4),
(4, '/images/scarlett-5.jpg', false, 5),
(4, '/images/scarlett-6.jpg', false, 6),
(4, '/images/scarlett-7.jpg', false, 7),
(4, '/images/scarlett-8.jpg', false, 8),
(4, '/images/scarlett-9.jpg', false, 9),
(4, '/images/scarlett-10.jpg', false, 10),
(5, '/images/anyelina-1.jpg', true, 1),
(6, '/images/dina-1.jpg', true, 1),
(7, '/images/idelsy-1.jpg', true, 1),
(8, '/images/osmaily-1.jpg', true, 1),
(9, '/images/perla-1.png', true, 1),
(10, '/images/valentina-1.png', true, 1),
(11, '/images/yoselin-1.jpg', true, 1);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_deliveries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (status = 'approved');
CREATE POLICY "Profile images are viewable by everyone" ON profile_images FOR SELECT USING (true);
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can view their own contact deliveries" ON contact_deliveries FOR SELECT USING (auth.uid() = user_id);

-- Recreate functions with integer profile IDs
CREATE OR REPLACE FUNCTION calculate_cart_total(user_uuid UUID)
RETURNS TABLE(item_count INTEGER, subtotal DECIMAL, processing_fee DECIMAL, total DECIMAL) AS $$
DECLARE
    item_cnt INTEGER;
    subtotal_amt DECIMAL;
    processing_fee_amt DECIMAL;
    total_amt DECIMAL;
BEGIN
    SELECT COUNT(*), COALESCE(SUM(price), 0)
    INTO item_cnt, subtotal_amt
    FROM cart_items
    WHERE user_id = user_uuid;
    
    -- Calculate processing fee (5% of subtotal, minimum $0.50)
    processing_fee_amt := GREATEST(subtotal_amt * 0.05, 0.50);
    
    total_amt := subtotal_amt + processing_fee_amt;
    
    RETURN QUERY SELECT item_cnt, subtotal_amt, processing_fee_amt, total_amt;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update search function to return integer IDs
CREATE OR REPLACE FUNCTION search_profiles(
    search_query TEXT DEFAULT NULL,
    location_filter TEXT DEFAULT NULL,
    min_age INTEGER DEFAULT NULL,
    max_age INTEGER DEFAULT NULL,
    interests_filter TEXT[] DEFAULT NULL,
    featured_only BOOLEAN DEFAULT false,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id INTEGER,
    name TEXT,
    age INTEGER,
    location TEXT,
    price DECIMAL,
    featured BOOLEAN,
    description TEXT,
    interests TEXT[],
    primary_image TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.age,
        p.location,
        p.price,
        p.featured,
        p.description,
        p.interests,
        COALESCE(pi.image_url, '/placeholder.svg') as primary_image
    FROM profiles p
    LEFT JOIN profile_images pi ON p.id = pi.profile_id AND pi.is_primary = true
    WHERE 
        p.status = 'approved'
        AND (search_query IS NULL OR p.name ILIKE '%' || search_query || '%' OR p.description ILIKE '%' || search_query || '%')
        AND (location_filter IS NULL OR p.location = location_filter)
        AND (min_age IS NULL OR p.age >= min_age)
        AND (max_age IS NULL OR p.age <= max_age)
        AND (interests_filter IS NULL OR p.interests && interests_filter)
        AND (NOT featured_only OR p.featured = true)
    ORDER BY p.featured DESC, p.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
