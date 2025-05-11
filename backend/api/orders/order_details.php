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

$order_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($order_id <= 0) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid or missing order id."]);
    exit();
}

// Get order info
$stmt = $db->prepare("SELECT * FROM commande WHERE id_cmd = :id");
$stmt->execute([':id' => $order_id]);
$order = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$order) {
    http_response_code(404);
    echo json_encode(["message" => "Commande non trouvée."]);
    exit();
}

// Get panier info
$stmt = $db->prepare("SELECT * FROM panier WHERE id_panier = :id");
$stmt->execute([':id' => $order['id_panier']]);
$panier = $stmt->fetch(PDO::FETCH_ASSOC);

// Get products in panier
$stmt = $db->prepare("SELECT p.id_prod, p.nom_prod, p.prix_prod, COUNT(*) as quantite FROM panier_produit pp JOIN produit p ON pp.id_prod = p.id_prod WHERE pp.id_panier = :id_panier GROUP BY p.id_prod, p.nom_prod, p.prix_prod");
$stmt->execute([':id_panier' => $order['id_panier']]);
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

http_response_code(200);
echo json_encode([
    "order" => $order,
    "panier" => $panier,
    "products" => $products
]); 