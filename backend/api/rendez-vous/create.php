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

header("Content-Type: application/json; charset=UTF-8");

// Validate JWT
$user = validate_jwt();

include_once '../../config/database.php';


$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->date_rdv) &&
    !empty($data->heure_rdv) &&
    !empty($data->type_rdv)
) {
    // Validate date format
    $date = DateTime::createFromFormat('Y-m-d', $data->date_rdv);
    if (!$date || $date->format('Y-m-d') !== $data->date_rdv) {
        http_response_code(400);
        echo json_encode(array("message" => "Format de date invalide. Utilisez YYYY-MM-DD."));
        exit();
    }

    // Validate time format
    $time = DateTime::createFromFormat('H:i', $data->heure_rdv);
    if (!$time || $time->format('H:i') !== $data->heure_rdv) {
        http_response_code(400);
        echo json_encode(array("message" => "Format d'heure invalide. Utilisez HH:MM."));
        exit();
    }

    $query = "INSERT INTO rendez_vous 
             (user_id, date_rdv, heure_rdv, type_rdv, description) 
             VALUES 
             (:user_id, :date_rdv, :heure_rdv, :type_rdv, :description)";

    $stmt = $db->prepare($query);

    // Sanitize input
    $user_id = $user->id;
    $date_rdv = htmlspecialchars(strip_tags($data->date_rdv));
    $heure_rdv = htmlspecialchars(strip_tags($data->heure_rdv));
    $type_rdv = htmlspecialchars(strip_tags($data->type_rdv));
    $description = isset($data->description) ? htmlspecialchars(strip_tags($data->description)) : null;

    // Bind values
    $stmt->bindParam(":user_id", $user_id);
    $stmt->bindParam(":date_rdv", $date_rdv);
    $stmt->bindParam(":heure_rdv", $heure_rdv);
    $stmt->bindParam(":type_rdv", $type_rdv);
    $stmt->bindParam(":description", $description);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Rendez-vous créé avec succès."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer le rendez-vous."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
} 