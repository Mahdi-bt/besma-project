<?php
require_once '../jwt_utils.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

// Validate JWT
$user = validate_jwt();

// Check if user is admin
if ($user->role !== 'admin') {
    http_response_code(403);
    echo json_encode(array("message" => "Accès non autorisé."));
    exit();
}

include_once '../../config/database.php';


$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->status)) {
    // Validate status
    if (!in_array($data->status, ['en_attente', 'confirme', 'annule'])) {
        http_response_code(400);
        echo json_encode(array("message" => "Statut invalide."));
        exit();
    }

    $query = "UPDATE rendez_vous 
             SET status = :status, 
                 updated_at = CURRENT_TIMESTAMP 
             WHERE id = :id";

    $stmt = $db->prepare($query);

    // Sanitize input
    $id = htmlspecialchars(strip_tags($data->id));
    $status = htmlspecialchars(strip_tags($data->status));

    // Bind values
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":status", $status);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Statut du rendez-vous mis à jour avec succès."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de mettre à jour le statut."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
} 