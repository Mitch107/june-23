-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
  location VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) DEFAULT 2.00,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  
  -- Profile details
  description TEXT,
  height VARCHAR(10),
  education VARCHAR(100),
  profession VARCHAR(100),
  languages TEXT[], -- Array of languages
  interests TEXT[], -- Array of interests
  relationship_status VARCHAR(50),
  children VARCHAR(50),
  smoking VARCHAR(50),
  drinking VARCHAR(50),
  body_type VARCHAR(50),
  appearance VARCHAR(50),
  looking_for TEXT[],
  
  -- Contact information (encrypted)
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_whatsapp VARCHAR(50),
  contact_instagram VARCHAR(100),
  contact_tiktok VARCHAR(100),
  contact_facebook VARCHAR(100),
  contact_telegram VARCHAR(100),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || location || ' ' || COALESCE(description, '') || ' ' || array_to_string(interests, ' '))
  ) STORED
);

-- Create profile images table
CREATE TABLE profile_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- User preferences
  favorite_profiles UUID[],
  notification_preferences JSONB DEFAULT '{"email": true, "push": false}'::jsonb
);

-- Create shopping cart table
CREATE TABLE cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique profile per user cart
  UNIQUE(user_id, profile_id)
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  processing_fee DECIMAL(10,2) DEFAULT 2.99,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_intent_id VARCHAR(255), -- Stripe payment intent ID
  
  -- Billing information
  billing_email VARCHAR(255),
  billing_name VARCHAR(100),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create order items table
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id),
  profile_name VARCHAR(100) NOT NULL, -- Snapshot at time of purchase
  price DECIMAL(10,2) NOT NULL,
  
  -- Contact information delivered (encrypted)
  delivered_contact_info JSONB,
  delivered_at TIMESTAMP WITH TIME ZONE
);

-- Create contact deliveries table (for tracking)
CREATE TABLE contact_deliveries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id),
  user_id UUID REFERENCES auth.users(id),
  profile_id UUID REFERENCES profiles(id),
  contact_data JSONB NOT NULL, -- Encrypted contact information
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  accessed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_profiles_location ON profiles(location);
CREATE INDEX idx_profiles_featured ON profiles(featured) WHERE featured = true;
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_search ON profiles USING GIN(search_vector);
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
