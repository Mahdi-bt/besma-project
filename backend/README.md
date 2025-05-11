# Bessma Project Backend

This backend is built with PHP and PostgreSQL. It provides authentication, product management, and more for the Bessma project.

## Prerequisites
- PHP 8.x or newer (with PDO and password_hash support)
- Composer (for managing PHP dependencies)
- PostgreSQL 14 or newer
- curl (for testing endpoints)

## 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bessma-project/backend
```

## 2. Install Dependencies
Install PHP dependencies using Composer:
```bash
composer install
```
This will install the required packages including the JWT library for authentication.

## 3. Database Setup

### a. Create the Database
Make sure PostgreSQL is running, then create the database:
```bash
createdb bessma_db
```

### b. Create Tables
Import the schema file:
```bash
psql bessma_db < database/schema.sql
```

### c. Seed Data (Default Admin, Categories & Users)
Run the seed file to insert:
- A default administrator (admin@bessma.com / admin123)
- Default categories ("Vêtements", "Nourriture")
- Default users (clients):
  - Alice Dupont (alice@example.com / user123)
  - Bob Martin (bob@example.com / user123)
  - Claire Bernard (claire@example.com / user123)

```bash
psql bessma_db < database/seed.sql
```

### d. Database Configuration
Edit `config/database.php` if you need to change the database name, user, or password:
```php
// config/database.php
$host = "localhost";
$db_name = "bessma_db";
$username = "your_postgres_user";
$password = "your_postgres_password";
```

## 4. Start the PHP Server
From the `backend` directory, run:
```bash
php -S localhost:8000
```

The API will be available at `http://localhost:8000`.

## 5. API Endpoints
- Auth: `/api/auth/register.php`, `/api/auth/login.php`, `/api/auth/admin_login.php`
- Products: `/api/products/read.php`, `/api/products/read_one.php`, etc.
- Categories: `/api/categories/create.php`, `/api/categories/read.php`, etc.

See the included `bessma-api.postman_collection.json` for ready-to-use Postman requests.

## 6. Testing
You can use curl or Postman to test the endpoints. Example:
```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}'
```

## 7. File Uploads
Product images are stored in `backend/uploads/products/` (create this directory if it doesn't exist).

## 8. Troubleshooting
- Make sure your PHP installation supports `password_hash` and `password_verify`.
- Check your PostgreSQL service is running.
- Review CORS headers in the API files if you have frontend/backend on different ports.
- If you get a "Failed to open stream: No such file or directory" error for vendor/autoload.php, make sure you've run `composer install`.

---

For any issues, please check the code comments or contact the maintainer. 