-- Add admin role to user profiles
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin'));

-- Add more detailed status tracking for profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS status_changed_by UUID REFERENCES user_profiles(id),
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES user_profiles(id),
    action_type TEXT NOT NULL CHECK (action_type IN ('profile_approved', 'profile_deactivated', 'profile_edited', 'user_viewed')),
    target_type TEXT NOT NULL CHECK (target_type IN ('profile', 'user')),
    target_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
    total_users BIGINT,
    users_with_favorites BIGINT,
    users_with_purchases BIGINT,
    users_with_favorites_no_purchases BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM user_profiles WHERE role = 'user') as total_users,
        (SELECT COUNT(*) FROM user_profiles WHERE favorite_profiles IS NOT NULL AND array_length(favorite_profiles, 1) > 0) as users_with_favorites,
        (SELECT COUNT(DISTINCT user_id) FROM orders WHERE status = 'completed') as users_with_purchases,
        (SELECT COUNT(*) FROM user_profiles 
         WHERE favorite_profiles IS NOT NULL 
         AND array_length(favorite_profiles, 1) > 0 
         AND id NOT IN (SELECT DISTINCT user_id FROM orders WHERE status = 'completed')) as users_with_favorites_no_purchases;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get profile statistics
CREATE OR REPLACE FUNCTION get_profile_statistics()
RETURNS TABLE (
    total_profiles BIGINT,
    pending_profiles BIGINT,
    approved_profiles BIGINT,
    rejected_profiles BIGINT,
    suspended_profiles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_profiles,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_profiles,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_profiles,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_profiles,
        COUNT(*) FILTER (WHERE status = 'suspended') as suspended_profiles
    FROM profiles;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update profile status (admin only)
CREATE OR REPLACE FUNCTION update_profile_status(
    profile_uuid UUID,
    new_status TEXT,
    admin_uuid UUID,
    notes TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    -- Check if user is admin
    IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = admin_uuid AND role IN ('admin', 'super_admin')) THEN
        RAISE EXCEPTION 'Unauthorized: Admin access required';
    END IF;
    
    -- Update profile status
    UPDATE profiles 
    SET 
        status = new_status,
        status_changed_at = NOW(),
        status_changed_by = admin_uuid,
        admin_notes = COALESCE(notes, admin_notes)
    WHERE id = profile_uuid;
    
    -- Log the action
    INSERT INTO admin_activity_logs (admin_id, action_type, target_type, target_id, details)
    VALUES (
        admin_uuid,
        CASE 
            WHEN new_status = 'approved' THEN 'profile_approved'
            WHEN new_status = 'suspended' THEN 'profile_deactivated'
            ELSE 'profile_edited'
        END,
        'profile',
        profile_uuid,
        jsonb_build_object('new_status', new_status, 'notes', notes)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS policies for admin access
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs" ON admin_activity_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can insert activity logs" ON admin_activity_logs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Grant execute permissions on functions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION update_profile_status(UUID, TEXT, UUID, TEXT) TO authenticated;
