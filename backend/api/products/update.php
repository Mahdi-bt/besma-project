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
    // First, get the current product data to merge features
    $get_current = "SELECT features FROM produit WHERE id_prod = :id";
    $stmt_current = $db->prepare($get_current);
    $stmt_current->bindParam(":id", $data->id_prod);
    $stmt_current->execute();
    $current_product = $stmt_current->fetch(PDO::FETCH_ASSOC);
    
    // Merge existing features with new ones
    $current_features = $current_product && $current_product['features'] 
        ? json_decode($current_product['features'], true) 
        : [];
    $new_features = isset($data->features) ? (array)$data->features : [];
    $merged_features = array_merge($current_features, $new_features);

    $query = "UPDATE produit 
              SET nom_prod = :nom, 
                  qte_prod = :qte, 
                  prix_prod = :prix, 
                  description_prod = :desc, 
                  categorie_id = :cat, 
                  features = :features 
              WHERE id_prod = :id 
              RETURNING id_prod, nom_prod, qte_prod, prix_prod, description_prod, categorie_id, features";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $data->id_prod);
    $stmt->bindParam(":nom", $data->nom_prod);
    $stmt->bindParam(":qte", $data->qte_prod);
    $stmt->bindParam(":prix", $data->prix_prod);
    $desc = isset($data->description_prod) ? $data->description_prod : null;
    $stmt->bindParam(":desc", $desc);
    $cat = isset($data->categorie_id) ? $data->categorie_id : null;
    $stmt->bindParam(":cat", $cat);
    $features = json_encode($merged_features);
    $stmt->bindParam(":features", $features);
    
    if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get the images for the product
        $images_query = "SELECT id, image_path as url FROM product_images WHERE product_id = :id";
        $images_stmt = $db->prepare($images_query);
        $images_stmt->bindParam(":id", $data->id_prod);
        $images_stmt->execute();
        $images = $images_stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "message" => "Produit mis à jour avec succès.",
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
        echo json_encode(["message" => "Erreur lors de la mise à jour du produit."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 