<?php
require_once '../jwt_utils.php';


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
validate_jwt(true);
header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

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
    http_response_code(200);
    echo json_encode(array("records" => array()));
}