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

$user = validate_jwt();

// Check if user is admin
if ($user->role !== 'admin') {
    http_response_code(403);
    echo json_encode(["message" => "Accès non autorisé. Admin requis."]);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");
include_once '../../config/database.php';

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['order_id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["message" => "Données manquantes."]);
    exit();
}

$order_id = intval($data['order_id']);
$status = $data['status'];
$description = $data['description'] ?? '';

// Validate status
$valid_statuses = ['en attente', 'en cours', 'livrée', 'annulée'];
if (!in_array($status, $valid_statuses)) {
    http_response_code(400);
    echo json_encode(["message" => "Statut invalide."]);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    $db->beginTransaction();

    // First check if the status is different from current status
    $stmt = $db->prepare("SELECT etat_cmd FROM commande WHERE id_cmd = :id");
    $stmt->execute([':id' => $order_id]);
    $current_status = $stmt->fetchColumn();

    if ($current_status === $status) {
        http_response_code(200);
        echo json_encode([
            "message" => "Le statut est déjà défini sur cette valeur.",
            "status" => $status
        ]);
        exit();
    }

    // Update order status
    $stmt = $db->prepare("UPDATE commande SET etat_cmd = :status WHERE id_cmd = :id");
    $stmt->execute([
        ':status' => $status,
        ':id' => $order_id
    ]);

    // Delete any existing status history records for this order and status
    $stmt = $db->prepare("DELETE FROM order_status_history WHERE order_id = :order_id AND status = :status");
    $stmt->execute([
        ':order_id' => $order_id,
        ':status' => $status
    ]);

    // Insert into status history
    $stmt = $db->prepare("
        INSERT INTO order_status_history (order_id, status, created_at, updated_by)
        VALUES (:order_id, :status, NOW(), :updated_by)
    ");
    $stmt->execute([
        ':order_id' => $order_id,
        ':status' => $status,
        ':updated_by' => $user->id
    ]);

    $db->commit();

    http_response_code(200);
    echo json_encode([
        "message" => "Statut de la commande mis à jour avec succès.",
        "status" => $status
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(500);
    echo json_encode([
        "message" => "Erreur lors de la mise à jour du statut: " . $e->getMessage()
    ]);
} 