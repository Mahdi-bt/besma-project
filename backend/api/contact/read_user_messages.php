<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // 24 hours cache

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../jwt_utils.php';
$jwt_payload = validate_jwt();
$user_id = $jwt_payload->id;

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get messages for the user
$stmt = $db->prepare("SELECT * FROM contact_messages WHERE user_id = ? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(['records' => $messages]); 