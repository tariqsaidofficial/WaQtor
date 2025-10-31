# PostgreSQL Setup Guide

## 🗄️ **Installation**

### **macOS:**
```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create database
createdb waqtor_dev
```

### **Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres createdb waqtor_dev
```

### **Docker:**
```bash
# Run PostgreSQL in Docker
docker run --name waqtor-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=waqtor_dev \
  -p 5432:5432 \
  -d postgres:15

# Check if running
docker ps | grep waqtor-postgres
```

---

## ⚙️ **Configuration**

### **1. Update `.env` file:**
```bash
# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=waqtor_dev
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL=false

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### **2. Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE waqtor_dev;

# Create user (optional)
CREATE USER waqtor_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE waqtor_dev TO waqtor_user;

# Exit
\q
```

---

## 🚀 **Running the Application**

### **1. Install Dependencies:**
```bash
npm install
```

### **2. Start Server:**
```bash
npm start
```

The server will:
1. ✅ Connect to PostgreSQL
2. ✅ Create tables automatically (users, whatsapp_sessions, messages)
3. ✅ Start WhatsApp client
4. ✅ Start API server on port 8080

---

## 📊 **Database Schema**

### **Tables:**
- `users` - System users
- `whatsapp_sessions` - WhatsApp accounts
- `messages` - Sent/received messages
- `campaigns` - Message campaigns (coming soon)
- `recipients` - Contact list (coming soon)

### **View Tables:**
```bash
# Connect to database
psql -U postgres -d waqtor_dev

# List tables
\dt

# Describe table
\d users
\d whatsapp_sessions
\d messages

# Query data
SELECT * FROM users;
SELECT * FROM whatsapp_sessions;
```

---

## 🧪 **Testing**

### **1. Register a User:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User"
  }'
```

### **2. Login:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "admin@example.com",
      "name": "Admin User",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **3. Use Token:**
```bash
# Get current user
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 **Troubleshooting**

### **Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql
# or
sudo systemctl status postgresql

# Start if not running
brew services start postgresql@15
# or
sudo systemctl start postgresql
```

### **Authentication Failed:**
```
Error: password authentication failed for user "postgres"
```

**Solution:**
```bash
# Reset password
psql -U postgres
ALTER USER postgres WITH PASSWORD 'postgres';
```

### **Database Does Not Exist:**
```
Error: database "waqtor_dev" does not exist
```

**Solution:**
```bash
createdb waqtor_dev
```

---

## 📝 **Migration from SQLite**

If you have existing data in SQLite, you can migrate it:

```bash
# Export from SQLite
sqlite3 runtime/server/db/waqtor.db .dump > data.sql

# Import to PostgreSQL (requires manual conversion)
# SQLite and PostgreSQL have different syntax
# Use a migration tool or manually convert
```

---

## 🔐 **Production Setup**

### **1. Use Strong Credentials:**
```bash
# Generate random password
openssl rand -base64 32

# Update .env
DB_PASSWORD=your-strong-password-here
JWT_SECRET=your-super-secret-jwt-key-here
```

### **2. Enable SSL:**
```bash
DB_SSL=true
```

### **3. Connection Pooling:**
Already configured in `config/database.js`:
- Development: max 5 connections
- Production: max 20 connections

---

## 📚 **Resources**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Sequelize ORM](https://sequelize.org/)
- [JWT Authentication](https://jwt.io/)

---

**Created:** 2025-11-01  
**Author:** Development Team
