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
    echo json_encode(["message" => "Invalid or missing product id."]);
    exit();
}

// Delete images from filesystem
$stmt = $db->prepare("SELECT image_path FROM product_images WHERE product_id = :id");
$stmt->execute([':id' => $id]);
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($images as $img) {
    $file = __DIR__ . '/../../uploads/products/' . $img['image_path'];
    if (file_exists($file)) {
        unlink($file);
    }
}

// Delete product (CASCADE will remove images from DB)
$stmt = $db->prepare("DELETE FROM produit WHERE id_prod = :id");
if ($stmt->execute([':id' => $id])) {
    http_response_code(200);
    echo json_encode(["message" => "Produit et images supprimés."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la suppression du produit."]);
} 