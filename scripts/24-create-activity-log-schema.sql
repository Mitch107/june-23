-- Create activity_logs table for tracking admin actions and system events

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    admin_user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL, -- 'profile', 'order', 'user', 'system'
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin_user_id ON activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_id ON activity_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON activity_logs(severity);

-- Enable RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all activity logs" ON activity_logs;

-- RLS Policy for activity_logs
CREATE POLICY "Admins can view all activity logs" ON activity_logs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
        )
    );

-- Insert sample activity log entries
INSERT INTO activity_logs (admin_user_id, action, entity_type, entity_id, description, severity, metadata) VALUES
(
    (SELECT id FROM auth.users WHERE email = 'admin@holacupid.com' LIMIT 1),
    'profile_approved',
    'profile',
    (SELECT id FROM profiles LIMIT 1),
    'Profile approved by admin',
    'info',
    '{"reason": "Profile meets all requirements", "auto_approved": false}'
),
(
    (SELECT id FROM auth.users WHERE email = 'admin@holacupid.com' LIMIT 1),
    'order_status_updated',
    'order',
    (SELECT id FROM orders LIMIT 1),
    'Order status changed from pending to processing',
    'info',
    '{"old_status": "pending", "new_status": "processing", "reason": "Payment confirmed"}'
),
(
    (SELECT id FROM auth.users WHERE email = 'admin@holacupid.com' LIMIT 1),
    'user_login',
    'system',
    NULL,
    'Admin user logged in',
    'info',
    '{"login_method": "password", "ip_address": "192.168.1.1"}'
),
(
    (SELECT id FROM auth.users WHERE email = 'admin@holacupid.com' LIMIT 1),
    'profile_rejected',
    'profile',
    (SELECT id FROM profiles OFFSET 1 LIMIT 1),
    'Profile rejected due to policy violation',
    'warning',
    '{"reason": "Inappropriate content", "violation_type": "content_policy"}'
),
(
    (SELECT id FROM auth.users WHERE email = 'admin@holacupid.com' LIMIT 1),
    'system_backup',
    'system',
    NULL,
    'Daily system backup completed',
    'info',
    '{"backup_size": "2.5GB", "duration": "45 minutes", "status": "success"}'
);
