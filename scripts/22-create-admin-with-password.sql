-- Create admin user with password authentication
-- This script creates an admin user that can log in with email/password

DO $$
DECLARE
    admin_email TEXT := 'admin@holacupid.com'; -- CHANGE THIS TO YOUR EMAIL
    admin_password TEXT := 'AdminPass123!'; -- CHANGE THIS TO YOUR DESIRED PASSWORD
    admin_name TEXT := 'Admin User'; -- CHANGE THIS TO YOUR NAME
    new_user_id UUID;
BEGIN
    -- Create the user in auth.users with password
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object('full_name', admin_name),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO new_user_id;
    
    -- Create user profile with admin role
    INSERT INTO user_profiles (id, email, full_name, role, created_at, updated_at)
    VALUES (new_user_id, admin_email, admin_name, 'super_admin', NOW(), NOW());
    
    RAISE NOTICE 'Admin user created successfully!';
    RAISE NOTICE 'Email: %', admin_email;
    RAISE NOTICE 'Password: %', admin_password;
    RAISE NOTICE 'User ID: %', new_user_id;
    
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'User with email % already exists', admin_email;
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error creating admin user: %', SQLERRM;
END $$;
