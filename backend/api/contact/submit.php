<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include_once '../../config/database.php';
include_once '../../config/core.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->subject) &&
    !empty($data->message)
) {
    // Validate email
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(array("message" => "Email invalide."));
        exit();
    }

    $query = "INSERT INTO contact_messages 
              (name, email, subject, message) 
              VALUES 
              (:name, :email, :subject, :message)";

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

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Message envoyé avec succès."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible d'envoyer le message."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Impossible d'envoyer le message. Données incomplètes."));
} 