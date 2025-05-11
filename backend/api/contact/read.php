<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
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

        // Get messages
        $query = "SELECT * FROM contact_messages ORDER BY created_at DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $messages_arr = array();
            $messages_arr["records"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $message_item = array(
                    "id" => $id,
                    "name" => $name,
                    "email" => $email,
                    "subject" => $subject,
                    "message" => $message,
                    "created_at" => $created_at,
                    "status" => $status
                );
                array_push($messages_arr["records"], $message_item);
            }

            http_response_code(200);
            echo json_encode($messages_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Aucun message trouvé."));
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