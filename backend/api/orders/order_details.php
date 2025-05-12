<?php
require_once '../jwt_utils.php';


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$user = validate_jwt();

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

try {
    // Get order info
    $stmt = $db->prepare("
        SELECT c.*, u.nom as user_nom, u.email as user_email 
        FROM commande c 
        JOIN users u ON c.id_user = u.id 
        WHERE c.id_cmd = :id
    ");
    $stmt->execute([':id' => $order_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        http_response_code(404);
        echo json_encode(["message" => "Commande non trouvée."]);
        exit();
    }

    // Check if user has permission to view this order
    if ($user->role !== 'admin' && $order['id_user'] !== $user->id) {
        http_response_code(403);
        echo json_encode(["message" => "Accès non autorisé."]);
        exit();
    }

    // Get panier info
    $stmt = $db->prepare("SELECT * FROM panier WHERE id_panier = :id");
    $stmt->execute([':id' => $order['id_panier']]);
    $panier = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get products in panier
    $stmt = $db->prepare("
        SELECT 
            p.id_prod, 
            p.nom_prod, 
            p.prix_prod, 
            COUNT(*) as quantite
        FROM panier_produit pp 
        JOIN produit p ON pp.id_prod = p.id_prod 
        WHERE pp.id_panier = :id_panier 
        GROUP BY p.id_prod, p.nom_prod, p.prix_prod
    ");
    $stmt->execute([':id_panier' => $order['id_panier']]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get shipping information
    $stmt = $db->prepare("SELECT * FROM shipping_info WHERE commande_id = :commande_id");
    $stmt->execute([':commande_id' => $order_id]);
    $shipping = $stmt->fetch(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "order" => $order,
        "panier" => $panier,
        "products" => $products,
        "shipping" => $shipping
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur lors de la récupération des détails de la commande: " . $e->getMessage()
    ]);
}