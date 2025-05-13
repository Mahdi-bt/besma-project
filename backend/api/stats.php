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
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get users count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM users");
$stmt->execute();
$users = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get products count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM produit");
$stmt->execute();
$products = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get orders count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM commande");
$stmt->execute();
$orders = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get categories count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM categorie");
$stmt->execute();
$categories = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get rendez-vous count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM rendez_vous");
$stmt->execute();
$rendezVous = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

// Get contact messages count
$stmt = $db->prepare("SELECT COUNT(*) as count FROM contact_messages");
$stmt->execute();
$messages = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

http_response_code(200);
echo json_encode([
    "users" => intval($users),
    "products" => intval($products),
    "orders" => intval($orders),
    "categories" => intval($categories),
    "rendezVous" => intval($rendezVous),
    "messages" => intval($messages)
]); 