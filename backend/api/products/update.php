<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
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

if (
    !empty($data->id_prod) &&
    !empty($data->nom_prod) &&
    isset($data->qte_prod) &&
    isset($data->prix_prod)
) {
    $query = "UPDATE produit SET nom_prod = :nom, qte_prod = :qte, prix_prod = :prix, description_prod = :desc, categorie_id = :cat WHERE id_prod = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id_prod);
    $stmt->bindParam(":nom", $data->nom_prod);
    $stmt->bindParam(":qte", $data->qte_prod);
    $stmt->bindParam(":prix", $data->prix_prod);
    $desc = isset($data->description_prod) ? $data->description_prod : null;
    $stmt->bindParam(":desc", $desc);
    $cat = isset($data->categorie_id) ? $data->categorie_id : null;
    $stmt->bindParam(":cat", $cat);
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Produit mis à jour avec succès."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la mise à jour du produit."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 