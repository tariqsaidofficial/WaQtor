-- ============================================
-- WaQtor - Useful Database Queries
-- Use these in DBeaver or any PostgreSQL client
-- ============================================

-- ============================================
-- 1. USER MANAGEMENT
-- ============================================

-- View all users
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    created_at,
    last_login_at
FROM users
ORDER BY created_at DESC;

-- View admins only
SELECT * FROM users WHERE role = 'admin';

-- View active users
SELECT * FROM users WHERE is_active = true;

-- Search user by email
SELECT * FROM users WHERE email LIKE '%admin%';

-- Count users by role
SELECT 
    role,
    COUNT(*) as total,
    SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active
FROM users
GROUP BY role;

-- Recent logins
SELECT 
    email,
    name,
    role,
    last_login_at
FROM users
WHERE last_login_at IS NOT NULL
ORDER BY last_login_at DESC
LIMIT 10;

-- ============================================
-- 2. USER UPDATES
-- ============================================

-- Update user role to admin
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';

-- Activate user
UPDATE users 
SET is_active = true 
WHERE email = 'user@example.com';

-- Deactivate user
UPDATE users 
SET is_active = false 
WHERE email = 'user@example.com';

-- Reset password (you need to hash it first)
-- Use: node runtime/server/scripts/db-manager.js reset-password email@test.com newpass123

-- ============================================
-- 3. WHATSAPP SESSIONS
-- ============================================

-- View all sessions
SELECT 
    s.id,
    s.session_name,
    s.status,
    u.email as user_email,
    u.name as user_name,
    s.created_at,
    s.updated_at
FROM whatsapp_sessions s
JOIN users u ON s.user_id = u.id
ORDER BY s.created_at DESC;

-- Sessions by user
SELECT 
    u.email,
    u.name,
    COUNT(s.id) as session_count
FROM users u
LEFT JOIN whatsapp_sessions s ON u.id = s.user_id
GROUP BY u.id, u.email, u.name
ORDER BY session_count DESC;

-- Active sessions
SELECT * FROM whatsapp_sessions WHERE status = 'ready';

-- ============================================
-- 4. MESSAGES
-- ============================================

-- Recent messages
SELECT 
    m.id,
    m.message_id,
    m.phone_number,
    m.message_text,
    m.status,
    m.ack_status,
    u.email as user_email,
    m.created_at
FROM messages m
JOIN users u ON m.user_id = u.id
ORDER BY m.created_at DESC
LIMIT 50;

-- Messages by status
SELECT 
    status,
    ack_status,
    COUNT(*) as count
FROM messages
GROUP BY status, ack_status;

-- Failed messages
SELECT * FROM messages WHERE status = 'failed';

-- Messages by user
SELECT 
    u.email,
    u.name,
    COUNT(m.id) as message_count
FROM users u
LEFT JOIN messages m ON u.id = m.user_id
GROUP BY u.id, u.email, u.name
ORDER BY message_count DESC;

-- ============================================
-- 5. CAMPAIGNS
-- ============================================

-- View all campaigns
SELECT 
    c.id,
    c.name,
    c.status,
    c.total_recipients,
    c.sent_count,
    c.failed_count,
    u.email as user_email,
    c.created_at
FROM campaigns c
JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC;

-- Campaign statistics
SELECT 
    status,
    COUNT(*) as count,
    SUM(total_recipients) as total_recipients,
    SUM(sent_count) as total_sent,
    SUM(failed_count) as total_failed
FROM campaigns
GROUP BY status;

-- Active campaigns
SELECT * FROM campaigns WHERE status = 'running';

-- Completed campaigns
SELECT * FROM campaigns WHERE status = 'completed';

-- ============================================
-- 6. RECIPIENTS
-- ============================================

-- View all recipients
SELECT 
    r.id,
    r.phone_number,
    r.name,
    r.status,
    u.email as user_email,
    r.created_at
FROM recipients r
JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- Recipients by status
SELECT 
    status,
    COUNT(*) as count
FROM recipients
GROUP BY status;

-- Recipients by user
SELECT 
    u.email,
    u.name,
    COUNT(r.id) as recipient_count
FROM users u
LEFT JOIN recipients r ON u.id = r.user_id
GROUP BY u.id, u.email, u.name
ORDER BY recipient_count DESC;

-- ============================================
-- 7. GROUPS
-- ============================================

-- View all groups
SELECT 
    g.id,
    g.name,
    g.description,
    u.email as user_email,
    g.created_at
FROM groups g
JOIN users u ON g.user_id = u.id
ORDER BY g.created_at DESC;

-- Groups with recipient count
SELECT 
    g.id,
    g.name,
    COUNT(rg.recipient_id) as recipient_count
FROM groups g
LEFT JOIN recipient_groups rg ON g.id = rg.group_id
GROUP BY g.id, g.name
ORDER BY recipient_count DESC;

-- ============================================
-- 8. SYSTEM STATISTICS
-- ============================================

-- Complete system overview
SELECT 
    'Users' as entity,
    COUNT(*) as total
FROM users
UNION ALL
SELECT 'WhatsApp Sessions', COUNT(*) FROM whatsapp_sessions
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Campaigns', COUNT(*) FROM campaigns
UNION ALL
SELECT 'Recipients', COUNT(*) FROM recipients
UNION ALL
SELECT 'Groups', COUNT(*) FROM groups;

-- User activity summary
SELECT 
    u.email,
    u.name,
    u.role,
    u.last_login_at,
    COUNT(DISTINCT s.id) as sessions,
    COUNT(DISTINCT m.id) as messages,
    COUNT(DISTINCT c.id) as campaigns,
    COUNT(DISTINCT r.id) as recipients
FROM users u
LEFT JOIN whatsapp_sessions s ON u.id = s.user_id
LEFT JOIN messages m ON u.id = m.user_id
LEFT JOIN campaigns c ON u.id = c.user_id
LEFT JOIN recipients r ON u.id = r.user_id
GROUP BY u.id, u.email, u.name, u.role, u.last_login_at
ORDER BY u.last_login_at DESC NULLS LAST;

-- Daily message statistics (last 7 days)
SELECT 
    DATE(created_at) as date,
    COUNT(*) as message_count,
    COUNT(CASE WHEN status = 'sent' THEN 1 END) as sent,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed
FROM messages
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- 9. CLEANUP QUERIES (USE WITH CAUTION!)
-- ============================================

-- Delete old messages (older than 30 days)
-- DELETE FROM messages WHERE created_at < CURRENT_DATE - INTERVAL '30 days';

-- Delete failed messages
-- DELETE FROM messages WHERE status = 'failed';

-- Delete inactive users (not logged in for 90 days)
-- DELETE FROM users WHERE last_login_at < CURRENT_DATE - INTERVAL '90 days';

-- ============================================
-- 10. MAINTENANCE
-- ============================================

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check database size
SELECT pg_size_pretty(pg_database_size('waqtor_dev')) as database_size;

-- Vacuum analyze (optimize database)
-- VACUUM ANALYZE;

-- ============================================
-- 11. BACKUP QUERIES
-- ============================================

-- Export users to CSV (run in DBeaver: Right-click → Export Data)
SELECT * FROM users;

-- Export messages to CSV
SELECT * FROM messages;

-- Export campaigns to CSV
SELECT * FROM campaigns;
