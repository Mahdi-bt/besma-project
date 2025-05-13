<?php

$sourceDir = __DIR__ . '/../seed_images';
$targetDir = __DIR__ . '/../uploads/products';

// Create target directory if it doesn't exist
if (!file_exists($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Get all jpg files from source directory
$files = glob($sourceDir . '/*.jpg');

foreach ($files as $file) {
    $filename = basename($file);
    $targetFile = $targetDir . '/' . $filename;
    
    // Copy file if it doesn't exist in target directory
    if (!file_exists($targetFile)) {
        if (copy($file, $targetFile)) {
            echo "Copied $filename to uploads directory\n";
        } else {
            echo "Failed to copy $filename\n";
        }
    } else {
        echo "$filename already exists in uploads directory\n";
    }
}

echo "Done copying seed images.\n"; 