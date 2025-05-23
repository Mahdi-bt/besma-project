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

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->nom_prod) &&
    isset($data->qte_prod) &&
    isset($data->prix_prod)
) {
    $query = "INSERT INTO produit (nom_prod, qte_prod, prix_prod, description_prod, categorie_id, features) 
              VALUES (:nom, :qte, :prix, :desc, :cat, :features) 
              RETURNING id_prod, nom_prod, qte_prod, prix_prod, description_prod, categorie_id, features";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nom", $data->nom_prod);
    $stmt->bindParam(":qte", $data->qte_prod);
    $stmt->bindParam(":prix", $data->prix_prod);
    $desc = isset($data->description_prod) ? $data->description_prod : null;
    $stmt->bindParam(":desc", $desc);
    $cat = isset($data->categorie_id) ? $data->categorie_id : null;
    $stmt->bindParam(":cat", $cat);
    $features = isset($data->features) ? json_encode($data->features) : null;
    $stmt->bindParam(":features", $features);
    
    if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Initialize empty images array since this is a new product
        $images = [];
        
        http_response_code(201);
        echo json_encode([
            "message" => "Produit créé avec succès.",
            "id" => intval($row['id_prod']),
            "nom_prod" => $row['nom_prod'],
            "description_prod" => $row['description_prod'],
            "prix_prod" => floatval($row['prix_prod']),
            "qte_prod" => intval($row['qte_prod']),
            "categorie_id" => intval($row['categorie_id']),
            "features" => $row['features'] ? json_decode($row['features']) : null,
            "images" => $images
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la création du produit."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 