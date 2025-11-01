# 🗄️ DBeaver Setup Guide for WaQtor

## 📥 Installation

### Option 1: Homebrew (Recommended)
```bash
brew install --cask dbeaver-community
```

### Option 2: Direct Download
Download from: https://dbeaver.io/download/

---

## ⚙️ Connection Setup

### 1. Open DBeaver
```bash
open -a DBeaver
```

### 2. Create New Connection
1. Click **Database** → **New Database Connection**
2. Select **PostgreSQL**
3. Click **Next**

### 3. Enter Connection Details

```
┌─────────────────────────────────────┐
│ Connection Settings                 │
├─────────────────────────────────────┤
│ Host:     localhost                 │
│ Port:     5432                      │
│ Database: waqtor_dev                │
│ Username: postgres                  │
│ Password: postgres                  │
└─────────────────────────────────────┘
```

### 4. Test Connection
- Click **Test Connection**
- Should see: ✅ **Connected**
- Click **Finish**

---

## 🎨 Interface Overview

### Left Panel - Database Navigator
```
waqtor_dev
├── Schemas
│   └── public
│       ├── Tables
│       │   ├── users
│       │   ├── whatsapp_sessions
│       │   ├── messages
│       │   ├── campaigns
│       │   ├── recipients
│       │   ├── groups
│       │   └── recipient_groups
│       ├── Views
│       └── Functions
└── ...
```

### Main Panel - Data/SQL Editor
- **Data Tab**: View and edit table data
- **SQL Editor**: Run custom queries
- **ER Diagram**: Visualize relationships

---

## 🚀 Quick Start Tasks

### 1. View All Users
```sql
-- Right-click on 'users' table → View Data
-- Or run this query:
SELECT * FROM users ORDER BY created_at DESC;
```

### 2. Run SQL Query
1. Click **SQL Editor** button (or press `Ctrl/Cmd + ]`)
2. Type your query
3. Press `Ctrl/Cmd + Enter` to execute

### 3. Edit Data Directly
1. Open table data
2. Double-click cell to edit
3. Press `Enter` to save
4. Click **Save** button

### 4. Export Data
1. Right-click on table
2. Select **Export Data**
3. Choose format (CSV, JSON, XML, etc.)
4. Click **Next** → **Proceed**

---

## 📋 Useful Queries

All queries are available in: `docs/useful-queries.sql`

### Quick Examples:

#### View Admin Users
```sql
SELECT * FROM users WHERE role = 'admin';
```

#### Recent Messages
```sql
SELECT 
    m.phone_number,
    m.message_text,
    m.status,
    u.email as sender
FROM messages m
JOIN users u ON m.user_id = u.id
ORDER BY m.created_at DESC
LIMIT 20;
```

#### System Statistics
```sql
SELECT 
    'Users' as entity, COUNT(*) as total FROM users
UNION ALL
SELECT 'Sessions', COUNT(*) FROM whatsapp_sessions
UNION ALL
SELECT 'Messages', COUNT(*) FROM messages
UNION ALL
SELECT 'Campaigns', COUNT(*) FROM campaigns;
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Enter` | Execute SQL |
| `Ctrl/Cmd + Space` | Auto-complete |
| `Ctrl/Cmd + /` | Comment/Uncomment |
| `Ctrl/Cmd + ]` | New SQL Editor |
| `F5` | Refresh |
| `Ctrl/Cmd + F` | Find |
| `Ctrl/Cmd + H` | Replace |

---

## 🎯 Common Tasks

### Update User Role
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### Activate/Deactivate User
```sql
-- Activate
UPDATE users SET is_active = true WHERE email = 'user@example.com';

-- Deactivate
UPDATE users SET is_active = false WHERE email = 'user@example.com';
```

### Delete User (with all data)
```sql
-- Delete user's sessions
DELETE FROM whatsapp_sessions WHERE user_id = 'user-id-here';

-- Delete user's messages
DELETE FROM messages WHERE user_id = 'user-id-here';

-- Delete user's campaigns
DELETE FROM campaigns WHERE user_id = 'user-id-here';

-- Delete user's recipients
DELETE FROM recipients WHERE user_id = 'user-id-here';

-- Delete user's groups
DELETE FROM groups WHERE user_id = 'user-id-here';

-- Finally, delete user
DELETE FROM users WHERE id = 'user-id-here';
```

**⚠️ Better way:** Use the CLI tool:
```bash
node runtime/server/scripts/db-manager.js delete-user user@example.com
```

---

## 🔍 Advanced Features

### 1. ER Diagram
1. Right-click on **public** schema
2. Select **View Diagram**
3. See all table relationships

### 2. Data Transfer
1. Right-click on table
2. Select **Export Data** or **Import Data**
3. Choose format and location

### 3. SQL History
1. Click **SQL History** tab
2. View all executed queries
3. Double-click to re-run

### 4. Query Formatting
1. Write messy SQL
2. Right-click → **Format SQL**
3. Beautiful formatted query!

### 5. Multiple Connections
- Connect to multiple databases
- Compare data across databases
- Transfer data between databases

---

## 💡 Tips & Tricks

### 1. Save Favorite Queries
```sql
-- Write your query
-- Click bookmark icon
-- Give it a name
-- Access from Bookmarks panel
```

### 2. Use Variables
```sql
-- DBeaver supports variables
SELECT * FROM users WHERE email = '${email}';
-- Will prompt for value when executed
```

### 3. Transaction Control
```sql
BEGIN;
UPDATE users SET role = 'admin' WHERE email = 'test@test.com';
-- Check if correct
SELECT * FROM users WHERE email = 'test@test.com';
-- If good:
COMMIT;
-- If bad:
-- ROLLBACK;
```

### 4. Batch Operations
```sql
-- Update multiple users at once
UPDATE users 
SET is_active = true 
WHERE email IN (
    'user1@test.com',
    'user2@test.com',
    'user3@test.com'
);
```

---

## 🛠️ Troubleshooting

### Connection Failed
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL if needed
brew services start postgresql@14

# Check connection
psql -h localhost -U postgres -d waqtor_dev -c "SELECT 1;"
```

### Driver Not Found
- DBeaver will auto-download PostgreSQL driver
- If fails, click **Download** in connection dialog

### Slow Queries
```sql
-- Add LIMIT to large queries
SELECT * FROM messages LIMIT 100;

-- Use WHERE clause
SELECT * FROM messages WHERE created_at > CURRENT_DATE - INTERVAL '7 days';
```

---

## 📚 Resources

- **Official Docs**: https://dbeaver.io/docs/
- **SQL Queries**: `docs/useful-queries.sql`
- **CLI Tool**: `runtime/server/scripts/db-manager.js`

---

## 🎉 You're Ready!

Now you can:
- ✅ View all database tables
- ✅ Run SQL queries
- ✅ Edit data directly
- ✅ Export/Import data
- ✅ Visualize relationships
- ✅ Manage users easily

**Happy querying! 🚀**
