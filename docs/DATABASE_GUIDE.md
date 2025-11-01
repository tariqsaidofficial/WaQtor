# 🗄️ WaQtor Database Complete Guide

## 📋 Table of Contents
1. [Database Overview](#database-overview)
2. [Database Schema](#database-schema)
3. [Table Structures](#table-structures)
4. [Relationships](#relationships)
5. [Access Methods](#access-methods)
6. [Common Operations](#common-operations)
7. [Backup & Restore](#backup--restore)
8. [Performance Optimization](#performance-optimization)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Database Overview

### Technology Stack
- **Database**: PostgreSQL 14+
- **ORM**: Sequelize v6
- **Connection Pool**: Built-in Sequelize pooling
- **Migration**: Custom migration scripts

### Connection Details
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=waqtor_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false
```

### Database Features
- ✅ Multi-user support with data isolation
- ✅ Role-based access control (Admin, User, Viewer)
- ✅ UUID primary keys for security
- ✅ Timestamps on all tables
- ✅ Soft deletes (where applicable)
- ✅ Foreign key constraints
- ✅ Indexes on frequently queried columns

---

## 📊 Database Schema

### Tables Overview
```
┌─────────────────────────────────────────────────────────┐
│                    WaQtor Database                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐                                          │
│  │  users   │──────┐                                   │
│  └──────────┘      │                                   │
│       │            │                                   │
│       │            ▼                                   │
│       │    ┌──────────────────┐                       │
│       ├───▶│ whatsapp_sessions│                       │
│       │    └──────────────────┘                       │
│       │                                                │
│       │    ┌──────────┐                               │
│       ├───▶│ messages │                               │
│       │    └──────────┘                               │
│       │                                                │
│       │    ┌───────────┐                              │
│       ├───▶│ campaigns │                              │
│       │    └───────────┘                              │
│       │                                                │
│       │    ┌────────────┐                             │
│       ├───▶│ recipients │◀────┐                       │
│       │    └────────────┘     │                       │
│       │                       │                       │
│       │    ┌────────┐    ┌────────────────┐          │
│       └───▶│ groups │───▶│recipient_groups│          │
│            └────────┘    └────────────────┘          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 📋 Table Structures

### 1. users
**Purpose**: Store user accounts and authentication

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
```

**Columns**:
- `id`: Unique identifier (UUID)
- `email`: User email (unique, used for login)
- `password_hash`: Bcrypt hashed password
- `name`: User's display name
- `role`: User role (admin/user/viewer)
- `is_active`: Account status
- `last_login_at`: Last login timestamp
- `created_at`: Account creation date
- `updated_at`: Last update timestamp

---

### 2. whatsapp_sessions
**Purpose**: Store WhatsApp account sessions

```sql
CREATE TABLE whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'disconnected', -- qr, connecting, ready, disconnected
    phone_number VARCHAR(50),
    session_data TEXT,
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, session_name)
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON whatsapp_sessions(user_id);
CREATE INDEX idx_sessions_status ON whatsapp_sessions(status);
CREATE INDEX idx_sessions_phone ON whatsapp_sessions(phone_number);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Owner of this session
- `session_name`: Unique name per user
- `status`: Connection status
- `phone_number`: WhatsApp number
- `session_data`: Encrypted session data
- `qr_code`: QR code for pairing
- `created_at`: Session creation date
- `updated_at`: Last update timestamp

---

### 3. messages
**Purpose**: Store sent/received messages

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES whatsapp_sessions(id) ON DELETE SET NULL,
    message_id VARCHAR(255),
    phone_number VARCHAR(50) NOT NULL,
    message_text TEXT,
    media_url TEXT,
    media_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    ack_status INTEGER DEFAULT 0, -- -1: failed, 0: pending, 1: sent, 2: delivered, 3: read, 4: played
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_phone ON messages(phone_number);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Message owner
- `session_id`: WhatsApp session used
- `message_id`: WhatsApp message ID
- `phone_number`: Recipient number
- `message_text`: Message content
- `media_url`: Media file URL
- `media_type`: image/video/audio/document
- `status`: Message status
- `ack_status`: WhatsApp ACK status
- `error_message`: Error details if failed
- `metadata`: Additional JSON data
- `created_at`: Message creation date
- `updated_at`: Last update timestamp

---

### 4. campaigns
**Purpose**: Store marketing campaigns

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES whatsapp_sessions(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, running, paused, completed, failed
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_scheduled_at ON campaigns(scheduled_at);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Campaign owner
- `session_id`: WhatsApp session to use
- `name`: Campaign name
- `message_template`: Message template with variables
- `status`: Campaign status
- `total_recipients`: Total recipients count
- `sent_count`: Successfully sent count
- `failed_count`: Failed messages count
- `scheduled_at`: Scheduled start time
- `started_at`: Actual start time
- `completed_at`: Completion time
- `metadata`: Additional JSON data
- `created_at`: Campaign creation date
- `updated_at`: Last update timestamp

---

### 5. recipients
**Purpose**: Store contact list

```sql
CREATE TABLE recipients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(50) NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    custom_fields JSONB,
    status VARCHAR(50) DEFAULT 'active', -- active, blocked, invalid
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, phone_number)
);

-- Indexes
CREATE INDEX idx_recipients_user_id ON recipients(user_id);
CREATE INDEX idx_recipients_phone ON recipients(phone_number);
CREATE INDEX idx_recipients_status ON recipients(status);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Recipient owner
- `phone_number`: Contact number
- `name`: Contact name
- `email`: Contact email
- `custom_fields`: Additional JSON fields
- `status`: Contact status
- `created_at`: Contact creation date
- `updated_at`: Last update timestamp

---

### 6. groups
**Purpose**: Store contact groups

```sql
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, name)
);

-- Indexes
CREATE INDEX idx_groups_user_id ON groups(user_id);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Group owner
- `name`: Group name
- `description`: Group description
- `created_at`: Group creation date
- `updated_at`: Last update timestamp

---

### 7. recipient_groups (Junction Table)
**Purpose**: Many-to-many relationship between recipients and groups

```sql
CREATE TABLE recipient_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES recipients(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recipient_id, group_id)
);

-- Indexes
CREATE INDEX idx_recipient_groups_recipient ON recipient_groups(recipient_id);
CREATE INDEX idx_recipient_groups_group ON recipient_groups(group_id);
```

**Columns**:
- `id`: Unique identifier
- `recipient_id`: Reference to recipient
- `group_id`: Reference to group
- `created_at`: Relationship creation date

---

## 🔗 Relationships

### Entity Relationship Diagram

```
users (1) ──────< (N) whatsapp_sessions
  │
  ├──────< (N) messages
  │
  ├──────< (N) campaigns
  │
  ├──────< (N) recipients
  │              │
  │              │ (N)
  │              │
  │              ▼
  │         recipient_groups
  │              │
  │              │ (N)
  │              │
  └──────< (N) groups
```

### Relationship Details

1. **users → whatsapp_sessions** (One-to-Many)
   - One user can have multiple WhatsApp sessions
   - Cascade delete: Deleting user deletes all sessions

2. **users → messages** (One-to-Many)
   - One user can send multiple messages
   - Cascade delete: Deleting user deletes all messages

3. **users → campaigns** (One-to-Many)
   - One user can create multiple campaigns
   - Cascade delete: Deleting user deletes all campaigns

4. **users → recipients** (One-to-Many)
   - One user can have multiple recipients
   - Cascade delete: Deleting user deletes all recipients

5. **users → groups** (One-to-Many)
   - One user can create multiple groups
   - Cascade delete: Deleting user deletes all groups

6. **recipients ↔ groups** (Many-to-Many)
   - One recipient can be in multiple groups
   - One group can have multiple recipients
   - Junction table: recipient_groups

---

## 🔧 Access Methods

### 1. PostgreSQL CLI (psql)

```bash
# Connect to database
psql -h localhost -U postgres -d waqtor_dev

# Common commands
\dt                    # List tables
\d users              # Describe users table
\l                    # List databases
\q                    # Quit
```

### 2. Node.js Script (db-manager.js)

```bash
# List all users
node runtime/server/scripts/db-manager.js list-users

# Create admin
node runtime/server/scripts/db-manager.js create-admin admin@test.com pass123 "Admin Name"

# Update role
node runtime/server/scripts/db-manager.js update-role user@test.com admin

# Show statistics
node runtime/server/scripts/db-manager.js show-stats

# Reset password
node runtime/server/scripts/db-manager.js reset-password user@test.com newpass123

# Delete user
node runtime/server/scripts/db-manager.js delete-user user@test.com
```

### 3. DBeaver (GUI)

See: [DBEAVER_SETUP.md](./DBEAVER_SETUP.md)

### 4. Sequelize ORM (Code)

```javascript
const { User, WhatsAppSession, Message } = require('./models');

// Find user
const user = await User.findOne({ where: { email: 'test@test.com' } });

// Create user
const newUser = await User.create({
    email: 'new@test.com',
    password_hash: await User.hashPassword('password123'),
    name: 'New User',
    role: 'user'
});

// Update user
await user.update({ role: 'admin' });

// Delete user
await user.destroy();

// Find with relations
const userWithSessions = await User.findOne({
    where: { email: 'test@test.com' },
    include: [
        { model: WhatsAppSession, as: 'sessions' },
        { model: Message, as: 'messages' }
    ]
});
```

---

## 💼 Common Operations

### User Management

```sql
-- Create user (use CLI tool instead)
-- node runtime/server/scripts/db-manager.js create-user email pass name

-- Find user
SELECT * FROM users WHERE email = 'test@test.com';

-- Update role
UPDATE users SET role = 'admin' WHERE email = 'test@test.com';

-- Activate/Deactivate
UPDATE users SET is_active = true WHERE email = 'test@test.com';
UPDATE users SET is_active = false WHERE email = 'test@test.com';

-- Delete user (use CLI tool for safe deletion)
-- node runtime/server/scripts/db-manager.js delete-user email@test.com
```

### Session Management

```sql
-- View user sessions
SELECT 
    s.*,
    u.email as user_email
FROM whatsapp_sessions s
JOIN users u ON s.user_id = u.id
WHERE u.email = 'test@test.com';

-- Update session status
UPDATE whatsapp_sessions 
SET status = 'ready', phone_number = '1234567890'
WHERE id = 'session-id';

-- Delete session
DELETE FROM whatsapp_sessions WHERE id = 'session-id';
```

### Message Queries

```sql
-- Recent messages
SELECT * FROM messages 
ORDER BY created_at DESC 
LIMIT 50;

-- Messages by user
SELECT 
    m.*,
    u.email as user_email
FROM messages m
JOIN users u ON m.user_id = u.id
WHERE u.email = 'test@test.com';

-- Failed messages
SELECT * FROM messages WHERE status = 'failed';

-- Message statistics
SELECT 
    status,
    COUNT(*) as count
FROM messages
GROUP BY status;
```

### Campaign Operations

```sql
-- Active campaigns
SELECT * FROM campaigns WHERE status = 'running';

-- Campaign with user info
SELECT 
    c.*,
    u.email as user_email,
    u.name as user_name
FROM campaigns c
JOIN users u ON c.user_id = u.id;

-- Update campaign status
UPDATE campaigns SET status = 'completed' WHERE id = 'campaign-id';
```

---

## 💾 Backup & Restore

### Full Database Backup

```bash
# Backup entire database
pg_dump -h localhost -U postgres waqtor_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression
pg_dump -h localhost -U postgres waqtor_dev | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Table-Specific Backup

```bash
# Backup users table only
pg_dump -h localhost -U postgres -t users waqtor_dev > users_backup.sql

# Backup multiple tables
pg_dump -h localhost -U postgres -t users -t messages waqtor_dev > backup.sql
```

### Restore Database

```bash
# Restore from backup
psql -h localhost -U postgres waqtor_dev < backup.sql

# Restore from compressed backup
gunzip -c backup.sql.gz | psql -h localhost -U postgres waqtor_dev
```

### Export to CSV

```bash
# Export users to CSV
psql -h localhost -U postgres -d waqtor_dev -c "COPY users TO '/tmp/users.csv' CSV HEADER;"

# Export with custom query
psql -h localhost -U postgres -d waqtor_dev -c "COPY (SELECT email, name, role FROM users) TO '/tmp/users_export.csv' CSV HEADER;"
```

### Import from CSV

```bash
# Import users from CSV
psql -h localhost -U postgres -d waqtor_dev -c "COPY users FROM '/tmp/users.csv' CSV HEADER;"
```

---

## ⚡ Performance Optimization

### Indexes

```sql
-- Check existing indexes
SELECT * FROM pg_indexes WHERE schemaname = 'public';

-- Create index
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Drop index
DROP INDEX idx_messages_created_at;

-- Analyze index usage
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';
```

### Query Optimization

```sql
-- Use EXPLAIN to analyze query
EXPLAIN ANALYZE SELECT * FROM messages WHERE user_id = 'some-uuid';

-- Add LIMIT to large queries
SELECT * FROM messages ORDER BY created_at DESC LIMIT 100;

-- Use indexes in WHERE clauses
SELECT * FROM users WHERE email = 'test@test.com'; -- Uses idx_users_email
```

### Maintenance

```sql
-- Vacuum (clean up dead rows)
VACUUM ANALYZE;

-- Vacuum specific table
VACUUM ANALYZE users;

-- Reindex
REINDEX TABLE users;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🔍 Troubleshooting

### Connection Issues

```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql@14

# Check connection
psql -h localhost -U postgres -c "SELECT 1;"

# Check port
lsof -i :5432
```

### Permission Issues

```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE waqtor_dev TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### Slow Queries

```sql
-- Enable query logging
ALTER DATABASE waqtor_dev SET log_statement = 'all';

-- Find slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;

-- Kill long-running query
SELECT pg_cancel_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';
```

### Database Locks

```sql
-- Check locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Find blocking queries
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS blocking_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

---

## 📚 Additional Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Sequelize Docs**: https://sequelize.org/docs/
- **DBeaver Setup**: [DBEAVER_SETUP.md](./DBEAVER_SETUP.md)
- **SQL Queries**: [useful-queries.sql](./useful-queries.sql)
- **CLI Tool**: `runtime/server/scripts/db-manager.js`

---

## ✅ Best Practices

1. **Always use transactions** for multiple related operations
2. **Use prepared statements** to prevent SQL injection
3. **Add indexes** on frequently queried columns
4. **Regular backups** (daily recommended)
5. **Monitor query performance** with EXPLAIN
6. **Use connection pooling** (already configured in Sequelize)
7. **Validate data** before insertion
8. **Use UUIDs** for primary keys (security)
9. **Soft deletes** for important data
10. **Regular VACUUM** for performance

---

**Last Updated**: 2025-11-01
**Version**: 2.3.0
