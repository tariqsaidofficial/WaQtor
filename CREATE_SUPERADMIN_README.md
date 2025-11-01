# Create SuperAdmin Account

## 📋 Overview

This script creates a SuperAdmin account with full permissions in the PostgreSQL database.

## 🔧 Account Details

- **Email:** info@dxbmark.com
- **Name:** Tariq Said
- **Role:** admin (SuperAdmin)
- **Password:** You will be prompted to enter it

## 🚀 Usage

### Step 1: Make sure PostgreSQL is running

Check your `.env` file for database configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=waqtor_dev
DB_USER=postgres
DB_PASSWORD=your_password
```

### Step 2: Run the script

```bash
node create_superadmin.js
```

### Step 3: Enter password

The script will prompt you to enter a password:
```
Enter password for info@dxbmark.com: [type your password]
```

**Password Requirements:**
- Minimum 6 characters
- Recommended: Use a strong password with letters, numbers, and symbols

### Step 4: Confirmation

You will see:
```
✅ SuperAdmin account created successfully!
================================================================================
Account Details:
  - ID: [UUID]
  - Email: info@dxbmark.com
  - Name: Tariq Said
  - Role: admin
  - Active: true
  - Created: [timestamp]
================================================================================

🎉 You can now login with:
  Email: info@dxbmark.com
  Password: [the password you entered]
================================================================================
```

## 🔄 Update Existing Account

If the account already exists, the script will ask:
```
⚠️  User already exists!
Do you want to update the password? (yes/no):
```

Type `yes` to update the password, or `no` to cancel.

## ✅ Features

- ✅ Uses PostgreSQL database (not SQLite)
- ✅ Secure password hashing with bcrypt
- ✅ UUID primary key
- ✅ Full admin permissions
- ✅ Can update existing account password
- ✅ Validates password length

## 🔒 Security Notes

1. **Never share your password**
2. **Use a strong password** (mix of uppercase, lowercase, numbers, symbols)
3. **Store password securely** (use password manager)
4. **This account has full system access** - protect it carefully

## 🎯 After Creation

1. Go to: http://localhost:3000/auth/login
2. Login with:
   - Email: info@dxbmark.com
   - Password: [your password]
3. You will have full admin access to:
   - User Management
   - WhatsApp Sessions
   - Campaigns
   - Messages
   - System Settings

## 🐛 Troubleshooting

### Error: Unable to connect to database

**Solution:** Check your PostgreSQL is running and `.env` file has correct credentials.

```bash
# Check PostgreSQL status
psql -U postgres -d waqtor_dev -c "SELECT 1"
```

### Error: Password must be at least 6 characters

**Solution:** Enter a password with 6 or more characters.

### Error: User already exists

**Solution:** The script will ask if you want to update the password. Type `yes` to proceed.

## 📝 Notes

- This script uses the same database configuration as the main application
- The account is created in the `users` table
- The role is set to `admin` which has full permissions
- The account is automatically activated (`is_active: true`)
