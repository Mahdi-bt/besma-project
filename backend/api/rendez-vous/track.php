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

// Get query parameters
$status = isset($_GET['status']) ? $_GET['status'] : null;
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : null;
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : null;

// Base query
$query = "SELECT rv.*, 
          CASE 
              WHEN rv.status = 'en_attente' THEN 'En attente de confirmation'
              WHEN rv.status = 'confirme' THEN 'Confirmé'
              WHEN rv.status = 'annule' THEN 'Annulé'
          END as status_display,
          CASE 
              WHEN rv.date_rdv < CURRENT_DATE THEN 'passé'
              WHEN rv.date_rdv = CURRENT_DATE THEN 'aujourd''hui'
              ELSE 'à venir'
          END as date_category
          FROM rendez_vous rv 
          WHERE rv.user_id = :user_id";

$params = array(":user_id" => $user->id);

// Add status filter if provided
if ($status && in_array($status, ['en_attente', 'confirme', 'annule'])) {
    $query .= " AND rv.status = :status";
    $params[":status"] = $status;
}

// Add date range filter if provided
if ($date_from) {
    $query .= " AND rv.date_rdv >= :date_from";
    $params[":date_from"] = $date_from;
}
if ($date_to) {
    $query .= " AND rv.date_rdv <= :date_to";
    $params[":date_to"] = $date_to;
}

// Order by date and time
$query .= " ORDER BY rv.date_rdv ASC, rv.heure_rdv ASC";

$stmt = $db->prepare($query);

// Bind all parameters
foreach ($params as $key => $value) {
    $stmt->bindValue($key, $value);
}

$stmt->execute();

if ($stmt->rowCount() > 0) {
    $appointments = array();
    $appointments["records"] = array();
    $appointments["summary"] = array(
        "total" => 0,
        "en_attente" => 0,
        "confirme" => 0,
        "annule" => 0,
        "passé" => 0,
        "aujourd'hui" => 0,
        "à venir" => 0
    );

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        
        // Update summary counts
        $appointments["summary"]["total"]++;
        $appointments["summary"][$status]++;
        $appointments["summary"][$date_category]++;

        $appointment = array(
            "id" => $id,
            "date_rdv" => $date_rdv,
            "heure_rdv" => $heure_rdv,
            "type_rdv" => $type_rdv,
            "description" => $description,
            "status" => $status,
            "status_display" => $status_display,
            "date_category" => $date_category,
            "created_at" => $created_at,
            "updated_at" => $updated_at
        );
        
        array_push($appointments["records"], $appointment);
    }

    http_response_code(200);
    echo json_encode($appointments);
} else {
    http_response_code(404);
    echo json_encode(array(
        "message" => "Aucun rendez-vous trouvé.",
        "summary" => array(
            "total" => 0,
            "en_attente" => 0,
            "confirme" => 0,
            "annule" => 0,
            "passé" => 0,
            "aujourd'hui" => 0,
            "à venir" => 0
        )
    ));
} 