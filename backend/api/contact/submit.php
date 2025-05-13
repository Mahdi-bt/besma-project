<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

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

// Get posted data
$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->subject) &&
    !empty($data->message)
) {
    try {
        // Insert message
        $query = "INSERT INTO contact_messages 
                (name, email, subject, message, user_id, status, created_at) 
                VALUES 
                (:name, :email, :subject, :message, :user_id, 'unread', NOW())";

        $stmt = $db->prepare($query);

        // Sanitize input
        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $subject = htmlspecialchars(strip_tags($data->subject));
        $message = htmlspecialchars(strip_tags($data->message));

        // Bind values
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":subject", $subject);
        $stmt->bindParam(":message", $message);
        $stmt->bindParam(":user_id", $user_id);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "message" => "Message sent successfully.",
                "id" => $db->lastInsertId()
            ]);
        } else {
            throw new Exception("Unable to send message.");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "Unable to send message.",
            "error" => $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "message" => "Unable to send message. Data is incomplete."
    ]);
} 