-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_deliveries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = created_by);

-- Profile images policies
CREATE POLICY "Profile images are viewable by everyone" ON profile_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_images.profile_id 
      AND profiles.status = 'approved'
    )
  );

CREATE POLICY "Users can manage their profile images" ON profile_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_images.profile_id 
      AND profiles.created_by = auth.uid()
    )
  );

-- User profiles policies
CREATE POLICY "Users can view and edit their own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

-- Cart items policies
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Contact deliveries policies
CREATE POLICY "Users can view their own contact deliveries" ON contact_deliveries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update access time" ON contact_deliveries
  FOR UPDATE USING (auth.uid() = user_id);
