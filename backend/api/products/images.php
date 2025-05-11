<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

$product_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing product id."]);
    exit();
}

$stmt = $db->prepare("SELECT id, image_path FROM product_images WHERE product_id = :pid");
$stmt->execute([':pid' => $product_id]);
$images = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($images as &$img) {
    $img['url'] = '/uploads/products/' . $img['image_path'];
}

http_response_code(200);
echo json_encode(["images" => $images]); 