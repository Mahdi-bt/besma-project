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

header("Content-Type: application/json; charset=UTF-8");

// Validate JWT
$user = validate_jwt();

include_once '../../config/database.php';


$database = new Database();
$db = $database->getConnection();

// Prepare query based on user role
if ($user->role === 'admin') {
    $query = "SELECT rv.*, u.nom as user_name, u.email as user_email 
             FROM rendez_vous rv 
             JOIN users u ON rv.user_id = u.id 
             ORDER BY rv.date_rdv DESC, rv.heure_rdv DESC";
    $stmt = $db->prepare($query);
} else {
    $query = "SELECT * FROM rendez_vous WHERE user_id = :user_id ORDER BY date_rdv DESC, heure_rdv DESC";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user->id);
}

$stmt->execute();

if ($stmt->rowCount() > 0) {
    $rdv_arr = array();
    $rdv_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $rdv_item = array(
            "id" => $id,
            "user_id" => $user_id,
            "user_name" => isset($user_name) ? $user_name : null,
            "user_email" => isset($user_email) ? $user_email : null,
            "date_rdv" => $date_rdv,
            "heure_rdv" => $heure_rdv,
            "type_rdv" => $type_rdv,
            "description" => $description,
            "status" => $status,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );
        array_push($rdv_arr["records"], $rdv_item);
    }

    http_response_code(200);
    echo json_encode($rdv_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Aucun rendez-vous trouvé."));
} 