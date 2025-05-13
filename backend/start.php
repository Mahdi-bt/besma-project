<?php
// Load database configuration
require_once __DIR__ . '/config/database.php';

// Function to create database if it doesn't exist
function createDatabaseIfNotExists() {
    $db = new Database();
    $config = [
        'host' => $db->host ?? 'localhost',
        'username' => $db->username ?? 'postgres',
        'password' => $db->password ?? 'postgres',
        'dbname' => $db->db_name ?? 'bessma-db'
    ];
    
    try {
        // Connect to PostgreSQL server without specifying a database
        $pdo = new PDO("pgsql:host={$config['host']}", $config['username'], $config['password']);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Check if database exists
        $result = $pdo->query("SELECT 1 FROM pg_database WHERE datname = '{$config['dbname']}'");
        if ($result->rowCount() == 0) {
            echo "Creating database '{$config['dbname']}'...\n";
            $pdo->exec("CREATE DATABASE \"{$config['dbname']}\"");
            echo "Database created successfully.\n";
        } else {
            echo "Database '{$config['dbname']}' already exists.\n";
        }
    } catch (PDOException $e) {
        die("Database creation error: " . $e->getMessage() . "\n");
    }
}

// Function to create database schema
function createDatabaseSchema() {
    $db = new Database();
    $conn = $db->getConnection();
    
    if ($conn) {
        try {
            echo "Creating database schema...\n";
            $schema = file_get_contents(__DIR__ . '/database/schema.sql');
            $conn->exec($schema);
            echo "Schema created successfully.\n";
        } catch (PDOException $e) {
            die("Schema creation error: " . $e->getMessage() . "\n");
        }
    } else {
        die("Could not connect to database to create schema.\n");
    }
}

// Create database if it doesn't exist
createDatabaseIfNotExists();

// Create database schema
createDatabaseSchema();

// Run the setup script
require_once __DIR__ . '/scripts/setup.php';

// Start the PHP development server
$host = 'localhost';
$port = 8000;
$root = __DIR__;

echo "\nStarting server at http://$host:$port\n";
echo "Press Ctrl+C to stop the server\n\n";

// Start the server
$command = sprintf(
    'php -S %s:%d -t %s',
    $host,
    $port,
    escapeshellarg($root)
);

system($command); 