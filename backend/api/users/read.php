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

include_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../jwt_utils.php';

// Verify JWT token and require admin role
$decoded = validate_jwt(true);

$database = new Database();
$db = $database->getConnection();

try {
    // Query to get all users
    $query = "SELECT id, nom, email, tel, role 
              FROM users 
              ORDER BY id DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $users = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }
        
        echo json_encode([
            "success" => true,
            "users" => $users
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "users" => []
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Une erreur est survenue lors de la récupération des utilisateurs",
        "error" => $e->getMessage()
    ]);
} 