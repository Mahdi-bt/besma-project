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

try {
    // If admin, get all orders. If regular user, get only their orders
    if ($user->role === 'admin') {
        $stmt = $db->prepare("
            SELECT 
                c.id_cmd,
                c.date_cmd,
                c.etat_cmd,
                c.id_panier,
                p.total,
                p.qte,
                u.nom as user_nom,
                u.email as user_email,
                s.nom as shipping_nom,
                s.prenom as shipping_prenom,
                s.ville as shipping_ville
            FROM commande c
            JOIN panier p ON c.id_panier = p.id_panier
            JOIN users u ON c.id_user = u.id
            LEFT JOIN shipping_info s ON c.id_cmd = s.commande_id
            ORDER BY c.date_cmd DESC
        ");
        $stmt->execute();
    } else {
        $stmt = $db->prepare("
            SELECT 
                c.id_cmd,
                c.date_cmd,
                c.etat_cmd,
                c.id_panier,
                p.total,
                p.qte,
                s.nom as shipping_nom,
                s.prenom as shipping_prenom,
                s.ville as shipping_ville
            FROM commande c
            JOIN panier p ON c.id_panier = p.id_panier
            LEFT JOIN shipping_info s ON c.id_cmd = s.commande_id
            WHERE c.id_user = :user_id
            ORDER BY c.date_cmd DESC
        ");
        $stmt->execute([':user_id' => $user->id]);
    }

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "orders" => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur lors de la récupération des commandes: " . $e->getMessage()
    ]);
}