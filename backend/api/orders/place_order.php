<?php
require_once '../jwt_utils.php';
validate_jwt();

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

$data = json_decode(file_get_contents("php://input"), true);

if (empty($data['client_id']) || empty($data['products']) || !is_array($data['products'])) {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes ou invalides."]);
    exit();
}

// Calculate total and create panier
$total = 0;
$qte = 0;
foreach ($data['products'] as $prod) {
    if (empty($prod['id']) || empty($prod['quantity'])) continue;
    $stmt = $db->prepare("SELECT prix_prod FROM produit WHERE id_prod = :id");
    $stmt->execute([':id' => $prod['id']]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row) {
        $total += $row['prix_prod'] * $prod['quantity'];
        $qte += $prod['quantity'];
    }
}

$stmt = $db->prepare("INSERT INTO panier (total, prix, qte) VALUES (:total, :prix, :qte) RETURNING id_panier");
$stmt->execute([':total' => $total, ':prix' => $total, ':qte' => $qte]);
$panier = $stmt->fetch(PDO::FETCH_ASSOC);
$id_panier = $panier['id_panier'];

// Add products to panier_produit
foreach ($data['products'] as $prod) {
    if (empty($prod['id']) || empty($prod['quantity'])) continue;
    $stmt = $db->prepare("INSERT INTO panier_produit (id_panier, id_prod) VALUES (:id_panier, :id_prod)");
    for ($i = 0; $i < $prod['quantity']; $i++) {
        $stmt->execute([':id_panier' => $id_panier, ':id_prod' => $prod['id']]);
    }
}

// Create commande
$stmt = $db->prepare("INSERT INTO commande (etat_cmd, id_panier, id_clt) VALUES ('en attente', :id_panier, :id_clt) RETURNING id_cmd");
$stmt->execute([':id_panier' => $id_panier, ':id_clt' => $data['client_id']]);
$commande = $stmt->fetch(PDO::FETCH_ASSOC);

http_response_code(201);
echo json_encode([
    "message" => "Commande créée avec succès.",
    "id_cmd" => $commande['id_cmd'],
    "id_panier" => $id_panier,
    "total" => $total,
    "qte" => $qte
]); 