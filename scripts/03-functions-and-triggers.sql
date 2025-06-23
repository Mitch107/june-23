-- Function to calculate cart total
CREATE OR REPLACE FUNCTION calculate_cart_total(user_uuid UUID)
RETURNS TABLE(
  item_count INTEGER,
  subtotal DECIMAL(10,2),
  processing_fee DECIMAL(10,2),
  total DECIMAL(10,2)
) AS $$
DECLARE
  count_items INTEGER;
  subtotal_amount DECIMAL(10,2);
  fee DECIMAL(10,2) := 2.99;
  total_amount DECIMAL(10,2);
BEGIN
  -- Count items and calculate subtotal
  SELECT COUNT(*), COALESCE(SUM(price), 0)
  INTO count_items, subtotal_amount
  FROM cart_items
  WHERE user_id = user_uuid;
  
  -- Apply bulk pricing (10+ items = $1 each)
  IF count_items >= 10 THEN
    subtotal_amount := count_items * 1.00;
  END IF;
  
  total_amount := subtotal_amount + fee;
  
  RETURN QUERY SELECT count_items, subtotal_amount, fee, total_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create order from cart
CREATE OR REPLACE FUNCTION create_order_from_cart(
  user_uuid UUID,
  billing_email_param VARCHAR(255),
  billing_name_param VARCHAR(100)
)
RETURNS UUID AS $$
DECLARE
  order_uuid UUID;
  cart_total RECORD;
  cart_item RECORD;
BEGIN
  -- Get cart total
  SELECT * INTO cart_total FROM calculate_cart_total(user_uuid);
  
  IF cart_total.item_count = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;
  
  -- Create order
  INSERT INTO orders (user_id, total_amount, processing_fee, billing_email, billing_name)
  VALUES (user_uuid, cart_total.total, cart_total.processing_fee, billing_email_param, billing_name_param)
  RETURNING id INTO order_uuid;
  
  -- Create order items from cart
  FOR cart_item IN 
    SELECT ci.profile_id, ci.price, p.name
    FROM cart_items ci
    JOIN profiles p ON p.id = ci.profile_id
    WHERE ci.user_id = user_uuid
  LOOP
    INSERT INTO order_items (order_id, profile_id, profile_name, price)
    VALUES (order_uuid, cart_item.profile_id, cart_item.name, cart_item.price);
  END LOOP;
  
  -- Clear cart
  DELETE FROM cart_items WHERE user_id = user_uuid;
  
  RETURN order_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deliver contact information
CREATE OR REPLACE FUNCTION deliver_contact_info(order_uuid UUID)
RETURNS VOID AS $$
DECLARE
  order_item RECORD;
  contact_info JSONB;
BEGIN
  -- Update order status
  UPDATE orders SET 
    status = 'completed',
    completed_at = NOW()
  WHERE id = order_uuid;
  
  -- Deliver contact info for each item
  FOR order_item IN 
    SELECT oi.id, oi.profile_id, o.user_id
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.id = order_uuid
  LOOP
    -- Get contact information from profile
    SELECT jsonb_build_object(
      'email', contact_email,
      'phone', contact_phone,
      'whatsapp', contact_whatsapp,
      'instagram', contact_instagram,
      'tiktok', contact_tiktok,
      'facebook', contact_facebook,
      'telegram', contact_telegram
    ) INTO contact_info
    FROM profiles
    WHERE id = order_item.profile_id;
    
    -- Update order item with delivered contact info
    UPDATE order_items SET 
      delivered_contact_info = contact_info,
      delivered_at = NOW()
    WHERE id = order_item.id;
    
    -- Create contact delivery record
    INSERT INTO contact_deliveries (order_item_id, user_id, profile_id, contact_data)
    VALUES (order_item.id, order_item.user_id, order_item.profile_id, contact_info);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search profiles
CREATE OR REPLACE FUNCTION search_profiles(
  search_query TEXT DEFAULT '',
  location_filter TEXT DEFAULT '',
  min_age INTEGER DEFAULT 18,
  max_age INTEGER DEFAULT 65,
  interests_filter TEXT[] DEFAULT '{}',
  featured_only BOOLEAN DEFAULT false,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
  id UUID,
  name VARCHAR(100),
  age INTEGER,
  location VARCHAR(100),
  price DECIMAL(10,2),
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
    pi.image_url as primary_image
  FROM profiles p
  LEFT JOIN profile_images pi ON pi.profile_id = p.id AND pi.is_primary = true
  WHERE 
    p.status = 'approved'
    AND (search_query = '' OR p.search_vector @@ plainto_tsquery('english', search_query))
    AND (location_filter = '' OR p.location ILIKE '%' || location_filter || '%')
    AND p.age >= min_age
    AND p.age <= max_age
    AND (array_length(interests_filter, 1) IS NULL OR p.interests && interests_filter)
    AND (NOT featured_only OR p.featured = true)
  ORDER BY 
    p.featured DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
