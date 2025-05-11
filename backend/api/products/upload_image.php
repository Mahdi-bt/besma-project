<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : 0;

if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing product_id."]);
    exit();
}

$upload_dir = __DIR__ . '/../../uploads/products/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$uploaded = [];
$errors = [];

if (!empty($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
        $original_name = basename($_FILES['images']['name'][$key]);
        $ext = strtolower(pathinfo($original_name, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (!in_array($ext, $allowed)) {
            $errors[] = "$original_name: Invalid file type.";
            continue;
        }
        $new_name = uniqid('prod_' . $product_id . '_') . '.' . $ext;
        $target = $upload_dir . $new_name;
        if (move_uploaded_file($tmp_name, $target)) {
            // Insert into product_images table
            $stmt = $db->prepare("INSERT INTO product_images (product_id, image_path) VALUES (:pid, :img)");
            $stmt->execute([':pid' => $product_id, ':img' => $new_name]);
            $uploaded[] = $new_name;
        } else {
            $errors[] = "$original_name: Upload failed.";
        }
    }
    http_response_code(200);
    echo json_encode([
        "uploaded" => $uploaded,
        "errors" => $errors
    ]);
} else {
    http_response_code(400);
    echo json_encode(["message" => "No images uploaded."]);
} 