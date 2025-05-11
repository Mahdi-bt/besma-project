<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing image id."]);
    exit();
}

// Get image filename
$stmt = $db->prepare("SELECT image_path FROM product_images WHERE id = :id");
$stmt->execute([':id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$row) {
    http_response_code(404);
    echo json_encode(["message" => "Image not found."]);
    exit();
}
$image_path = $row['image_path'];

// Delete from DB
$stmt = $db->prepare("DELETE FROM product_images WHERE id = :id");
$stmt->execute([':id' => $id]);

// Delete file
$file = __DIR__ . '/../../uploads/products/' . $image_path;
if (file_exists($file)) {
    unlink($file);
}

http_response_code(200);
echo json_encode(["message" => "Image deleted."]); 