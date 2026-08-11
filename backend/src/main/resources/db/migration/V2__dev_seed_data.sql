-- Dev/demo seed data. Password for both accounts is: "password123"
-- (BCrypt hash below — regenerate for production, never ship real
-- credentials in a migration.)

INSERT INTO factories (id, name, location, timezone)
VALUES ('11111111-1111-1111-1111-111111111111', 'Chennai Assembly Plant', 'Chennai, Tamil Nadu, India', 'Asia/Kolkata');

INSERT INTO users (id, email, password_hash, full_name, role_id, factory_id, is_active)
SELECT
    '22222222-2222-2222-2222-222222222222',
    'admin@ai-safety-audit.dev',
    '$2b$10$.s9Obg3SKaZweEhGmIkZm.66i94GPJY.DKGbNIE6jkwIT3QTPNhoW', -- password123
    'Demo Admin',
    r.id,
    '11111111-1111-1111-1111-111111111111',
    true
FROM roles r WHERE r.name = 'ADMIN';

INSERT INTO users (id, email, password_hash, full_name, role_id, factory_id, is_active)
SELECT
    '33333333-3333-3333-3333-333333333333',
    'officer@ai-safety-audit.dev',
    '$2b$10$.s9Obg3SKaZweEhGmIkZm.66i94GPJY.DKGbNIE6jkwIT3QTPNhoW', -- password123
    'Demo Safety Officer',
    r.id,
    '11111111-1111-1111-1111-111111111111',
    true
FROM roles r WHERE r.name = 'SAFETY_OFFICER';
