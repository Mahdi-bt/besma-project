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
        SELECT 
            c.*, 
            u.nom as user_nom, 
            u.email as user_email,
            CASE 
                WHEN c.etat_cmd = 'en attente' THEN 'Votre commande est en cours de traitement'
                WHEN c.etat_cmd = 'en cours' THEN 'Votre commande est en cours de préparation'
                WHEN c.etat_cmd = 'livrée' THEN 'Votre commande a été livrée'
                WHEN c.etat_cmd = 'annulée' THEN 'Votre commande a été annulée'
                ELSE 'Statut inconnu'
            END as status_description
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
            CAST(p.prix_prod AS FLOAT) as prix_prod,
            p.qte_prod as stock_quantity,
            pp.quantite as cart_quantity
        FROM panier_produit pp 
        JOIN produit p ON pp.id_prod = p.id_prod 
        WHERE pp.id_panier = :id_panier
    ");
    $stmt->execute([':id_panier' => $order['id_panier']]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get shipping information
    $stmt = $db->prepare("SELECT * FROM shipping_info WHERE commande_id = :commande_id");
    $stmt->execute([':commande_id' => $order_id]);
    $shipping = $stmt->fetch(PDO::FETCH_ASSOC);

    // Get order status history
    $stmt = $db->prepare("
        SELECT 
            status,
            created_at,
            CASE 
                WHEN status = 'en attente' THEN 'Votre commande est en cours de traitement'
                WHEN status = 'en cours' THEN 'Votre commande est en cours de préparation'
                WHEN status = 'livrée' THEN 'Votre commande a été livrée'
                WHEN status = 'annulée' THEN 'Votre commande a été annulée'
                ELSE 'Statut inconnu'
            END as description
        FROM order_status_history 
        WHERE order_id = :order_id 
        ORDER BY created_at DESC
    ");
    $stmt->execute([':order_id' => $order_id]);
    $statusHistory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "order" => $order,
        "panier" => $panier,
        "products" => $products,
        "shipping" => $shipping,
        "status_history" => $statusHistory
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur lors de la récupération des détails de la commande: " . $e->getMessage()
    ]);
}