# Bessma Project Backend

This backend is built with PHP and PostgreSQL. It provides authentication, product management, and more for the Bessma project.

## Prerequisites
- PHP 8.x or newer (with PDO and password_hash support)
- Composer (for managing PHP dependencies)
- PostgreSQL 14 or newer
- curl (for testing endpoints)

## Step-by-Step Setup Guide

### 1. Clone and Navigate
```bash
git clone <your-repo-url>
cd bessma-project/backend
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Database Setup

#### a. Start PostgreSQL
Make sure PostgreSQL service is running on your system.

#### b. Create Database
```bash
createdb bessma_db
```

#### c. Configure Database Connection
Edit `config/database.php` with your PostgreSQL credentials:
```php
$host = "localhost";
$db_name = "bessma-db";
$username = "your_postgres_user";
$password = "your_postgres_password";
```

#### d. Import Database Schema
```bash
psql -d bessma_db -f database/schema.sql
```

### 4. Start the Server

#### Option 1: Automatic Setup (Recommended)
Run the following command from the `backend` directory:
```bash
php start.php
```

This will automatically:
- Check and seed the database if needed
- Create default admin and user accounts
- Set up default categories
- Copy seed images
- Start the PHP development server

#### Option 2: Manual Setup
If you prefer to set up manually:
```bash
# Seed the database
psql -d bessma_db -f database/seed.sql

# Start PHP server
php -S localhost:8000
```

### 5. Verify Installation
The API will be available at `http://localhost:8000`

Test the connection using curl:
```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bessma.com","password":"admin123"}'
```

## Default Accounts
After setup, you can use these accounts:

### Admin Account
- Email: admin@bessma.com
- Password: admin123

### User Accounts
- Alice Dupont (alice@example.com / user123)
- Bob Martin (bob@example.com / user123)
- Claire Bernard (claire@example.com / user123)

## API Documentation
- Auth endpoints: `/api/auth/register.php`, `/api/auth/login.php`, `/api/auth/admin_login.php`
- Product endpoints: `/api/products/read.php`, `/api/products/read_one.php`, etc.
- Category endpoints: `/api/categories/create.php`, `/api/categories/read.php`, etc.

For detailed API documentation, see the included `bessma-api.postman_collection.json`.

## Troubleshooting

### Common Issues
1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `config/database.php`
   - Ensure database `bessma_db` exists

2. **PHP Dependencies**
   - Run `composer install` if you see missing dependency errors
   - Verify PHP version is 8.x or newer

3. **File Permissions**
   - Ensure `uploads/products/` directory is writable
   - Check permissions on `seed_images/` directory

4. **Server Issues**
   - If automatic setup fails, run manually:
     ```bash
     php scripts/setup.php
     ```

For additional help, please check the code comments or contact the maintainer. 