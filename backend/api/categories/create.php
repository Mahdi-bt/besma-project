<?php
require_once '../jwt_utils.php';
validate_jwt(true);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
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

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nom_categorie)) {
    $stmt = $db->prepare("INSERT INTO categorie (nom_categorie) VALUES (:nom) RETURNING id_categorie");
    $stmt->bindParam(":nom", $data->nom_categorie);
    if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(201);
        echo json_encode([
            "message" => "Catégorie créée avec succès.",
            "id_categorie" => $row['id_categorie']
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la création de la catégorie."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 