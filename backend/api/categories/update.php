<?php
require_once '../jwt_utils.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id_categorie) && !empty($data->nom_categorie)) {
    $stmt = $db->prepare("UPDATE categorie SET nom_categorie = :nom WHERE id_categorie = :id");
    $stmt->bindParam(":id", $data->id_categorie);
    $stmt->bindParam(":nom", $data->nom_categorie);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Catégorie mise à jour."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la mise à jour de la catégorie."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 