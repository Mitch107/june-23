-- Create orders and order_items tables for admin management

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id),
    profile_name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_profile_id ON order_items(profile_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Insert sample orders for testing
INSERT INTO orders (user_id, email, total_amount, status, payment_status, shipping_address, billing_address, notes) VALUES
(
    (SELECT id FROM auth.users LIMIT 1),
    'customer1@example.com',
    299.99,
    'completed',
    'paid',
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}',
    '{"street": "123 Main St", "city": "New York", "state": "NY", "zip": "10001", "country": "USA"}',
    'First order - completed successfully'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'customer2@example.com',
    149.99,
    'processing',
    'paid',
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    '{"street": "456 Oak Ave", "city": "Los Angeles", "state": "CA", "zip": "90210", "country": "USA"}',
    'Processing order - payment confirmed'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'customer3@example.com',
    89.99,
    'pending',
    'pending',
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    '{"street": "789 Pine Rd", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}',
    'New order - awaiting payment'
);

-- Insert sample order items
INSERT INTO order_items (order_id, profile_id, profile_name, price, quantity)
SELECT 
    o.id,
    p.id,
    p.name,
    199.99,
    1
FROM orders o
CROSS JOIN profiles p
WHERE o.email = 'customer1@example.com'
LIMIT 1;

INSERT INTO order_items (order_id, profile_id, profile_name, price, quantity)
SELECT 
    o.id,
    p.id,
    p.name,
    149.99,
    1
FROM orders o
CROSS JOIN profiles p
WHERE o.email = 'customer2@example.com'
LIMIT 1;

INSERT INTO order_items (order_id, profile_id, profile_name, price, quantity)
SELECT 
    o.id,
    p.id,
    p.name,
    89.99,
    1
FROM orders o
CROSS JOIN profiles p
WHERE o.email = 'customer3@example.com'
LIMIT 1;
