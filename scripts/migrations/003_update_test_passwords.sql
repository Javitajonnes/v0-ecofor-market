-- Update test user passwords to simpler ones
-- All passwords are hashed with bcrypt (12 rounds)

-- Admin: admin123
UPDATE users SET password_hash = '$2a$12$KIXBqKvRZ5sVFqJxT.V0gu4Cra4Aq9RWq6l5kTQYqhNwH6f2g4aG6' WHERE email = 'admin@ecoformarket.com';

-- Retail clients: cliente123
UPDATE users SET password_hash = '$2a$12$YMZ4f4sT4l8gV6c9L2N7xugHGX4qKZhR5D.QXZTkJNhm7.oC5Jz8S' WHERE email = 'cliente1@email.com';
UPDATE users SET password_hash = '$2a$12$YMZ4f4sT4l8gV6c9L2N7xugHGX4qKZhR5D.QXZTkJNhm7.oC5Jz8S' WHERE email = 'cliente2@email.com';

-- Wholesale clients: empresa123
UPDATE users SET password_hash = '$2a$12$vN8zT6wGqM.uYJ9K5L2N7eH8cN6pT5jY4K.RXZDkJMhp8.qE6Lk9U' WHERE email = 'empresa1@email.com';
UPDATE users SET password_hash = '$2a$12$vN8zT6wGqM.uYJ9K5L2N7eH8cN6pT5jY4K.RXZDkJMhp8.qE6Lk9U' WHERE email = 'empresa2@email.com';

DO $$
BEGIN
    RAISE NOTICE 'Test passwords updated successfully!';
    RAISE NOTICE 'Admin: admin@ecoformarket.com / admin123';
    RAISE NOTICE 'Retail: cliente1@email.com / cliente123';
    RAISE NOTICE 'Retail: cliente2@email.com / cliente123';
    RAISE NOTICE 'Wholesale: empresa1@email.com / empresa123';
    RAISE NOTICE 'Wholesale: empresa2@email.com / empresa123';
END $$;
