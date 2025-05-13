<?php
require_once '../jwt_utils.php';


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$jwt_payload = validate_jwt();

// Check if user is admin
if ($jwt_payload->role !== 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Access denied']);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get all messages with user information
$query = "SELECT cm.*, u.nom as user_name, u.email as user_email 
          FROM contact_messages cm 
          LEFT JOIN users u ON cm.user_id = u.id 
          ORDER BY cm.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(['records' => $messages]);