<?php

// Function to check if database is already seeded
function isDatabaseSeeded($db) {
    try {
        $stmt = $db->query("SELECT COUNT(*) FROM users");
        $count = $stmt->fetchColumn();
        return $count > 0;
    } catch (PDOException $e) {
        return false;
    }
}

// Function to seed the database
function seedDatabase($db) {
    try {
        // Read and execute the seed.sql file
        $seedFile = __DIR__ . '/../database/seed.sql';
        $sql = file_get_contents($seedFile);
        
        // Split the SQL file into individual statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        // Execute each statement
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                $db->exec($statement);
            }
        }
        
        echo "Database seeded successfully.\n";
        return true;
    } catch (PDOException $e) {
        echo "Error seeding database: " . $e->getMessage() . "\n";
        return false;
    }
}

// Function to copy seed images
function copySeedImages() {
    $sourceDir = __DIR__ . '/../seed_images';
    $targetDir = __DIR__ . '/../uploads/products';

    // Create target directory if it doesn't exist
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Get all jpg files from source directory
    $files = glob($sourceDir . '/*.jpg');
    $success = true;

    foreach ($files as $file) {
        $filename = basename($file);
        $targetFile = $targetDir . '/' . $filename;
        
        // Copy file if it doesn't exist in target directory
        if (!file_exists($targetFile)) {
            if (copy($file, $targetFile)) {
                echo "Copied $filename to uploads directory\n";
            } else {
                echo "Failed to copy $filename\n";
                $success = false;
            }
        } else {
            echo "$filename already exists in uploads directory\n";
        }
    }

    return $success;
}

// Main setup process
try {
    // Include database configuration
    require_once __DIR__ . '/../config/database.php';
    
    // Create database connection
    $database = new Database();
    $db = $database->getConnection();
    
    echo "Starting setup process...\n";
    
    // Check if database is already seeded
    if (!isDatabaseSeeded($db)) {
        echo "Seeding database...\n";
        if (!seedDatabase($db)) {
            throw new Exception("Failed to seed database");
        }
    } else {
        echo "Database already seeded.\n";
    }
    
    // Copy seed images
    echo "Copying seed images...\n";
    if (!copySeedImages()) {
        throw new Exception("Failed to copy some seed images");
    }
    
    echo "Setup completed successfully!\n";
    
} catch (Exception $e) {
    echo "Setup failed: " . $e->getMessage() . "\n";
    exit(1);
} 