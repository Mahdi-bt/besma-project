#!/bin/bash
set -e

echo "Waiting for PostgreSQL to start..."

# Function to check if PostgreSQL is ready
check_postgres() {
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -c '\q' 2>/dev/null
    return $?
}

# Wait for PostgreSQL to be ready
until check_postgres; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "PostgreSQL is up - executing commands"

# Create database if it doesn't exist
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -tc "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1 || \
    PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -c "CREATE DATABASE $POSTGRES_DB"

echo "Applying database schema..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /var/www/html/database/schema.sql

echo "Applying seed data..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -f /var/www/html/database/seed.sql

echo "Database setup complete"

# Start Apache in foreground
echo "Starting Apache..."
apache2-foreground 