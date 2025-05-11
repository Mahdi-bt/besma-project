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
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$client_id = isset($_GET['client_id']) ? intval($_GET['client_id']) : 0;

if ($client_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing client_id."]);
    exit();
}

$stmt = $db->prepare("SELECT id_cmd, date_cmd, etat_cmd, id_panier FROM commande WHERE id_clt = :id_clt ORDER BY date_cmd DESC");
$stmt->execute([':id_clt' => $client_id]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode(["orders" => $orders]); 