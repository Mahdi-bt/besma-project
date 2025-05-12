<?php
require_once '../jwt_utils.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing category id."]);
    exit();
}

$stmt = $db->prepare("DELETE FROM categorie WHERE id_categorie = :id");
if ($stmt->execute([':id' => $id])) {
    http_response_code(200);
    echo json_encode(["message" => "Catégorie supprimée."]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur lors de la suppression de la catégorie."]);
} 