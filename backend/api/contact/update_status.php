<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../config/core.php';
include_once '../../objects/user.php';
include_once '../../config/jwt.php';

$database = new Database();
$db = $database->getConnection();

// Get JWT token from header
$headers = getallheaders();
$jwt = isset($headers['Authorization']) ? $headers['Authorization'] : "";

if ($jwt) {
    try {
        // Verify JWT token
        $decoded = JWT::decode($jwt, $key, array('HS256'));
        
        // Check if user is admin
        if ($decoded->data->role !== 'admin') {
            http_response_code(403);
            echo json_encode(array("message" => "Accès non autorisé."));
            exit();
        }

        $data = json_decode(file_get_contents("php://input"));

        if (!empty($data->id) && !empty($data->status)) {
            // Validate status
            if (!in_array($data->status, ['unread', 'read', 'replied'])) {
                http_response_code(400);
                echo json_encode(array("message" => "Statut invalide."));
                exit();
            }

            $query = "UPDATE contact_messages 
                     SET status = :status 
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
                echo json_encode(array("message" => "Statut mis à jour avec succès."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Impossible de mettre à jour le statut."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Données incomplètes."));
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(array(
            "message" => "Accès non autorisé.",
            "error" => $e->getMessage()
        ));
    }
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Accès non autorisé."));
} 