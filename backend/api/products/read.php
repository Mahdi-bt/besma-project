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

// Modified query to include images using the correct table name
$query = "SELECT p.id_prod, p.nom_prod, p.qte_prod, p.prix_prod, p.description_prod, p.categorie_id,
          COALESCE(json_agg(json_build_object('id', pi.id, 'url', pi.image_path)) FILTER (WHERE pi.id IS NOT NULL), '[]') as images
          FROM produit p
          LEFT JOIN product_images pi ON p.id_prod = pi.product_id
          GROUP BY p.id_prod, p.nom_prod, p.qte_prod, p.prix_prod, p.description_prod, p.categorie_id";

// Check if category filter is provided
if (isset($_GET['categorie_id'])) {
    $query .= " WHERE p.categorie_id = :cat_id";
}

$stmt = $db->prepare($query);

if (isset($_GET['categorie_id'])) {
    $stmt->bindParam(":cat_id", $_GET['categorie_id']);
}

if ($stmt->execute()) {
    $products = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $product = array(
            "id" => $row['id_prod'],
            "nom_prod" => $row['nom_prod'],
            "description_prod" => $row['description_prod'],
            "prix_prod" => floatval($row['prix_prod']),
            "qte_prod" => intval($row['qte_prod']),
            "categorie_id" => intval($row['categorie_id']),
            "images" => json_decode($row['images']),
            "details" => null
        );
        array_push($products, $product);
    }
    http_response_code(200);
    echo json_encode(array("products" => $products));
} else {
    http_response_code(500);
    echo json_encode(array("message" => "Erreur lors de la récupération des produits."));
} 