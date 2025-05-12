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

header("Content-Type: application/json; charset=UTF-8");

// Validate JWT
$user = validate_jwt();
if (!$user || !isset($user->id)) {
    http_response_code(401);
    echo json_encode(["message" => "Utilisateur non authentifié."]);
    exit();
}

include_once '../../config/database.php';
$database = new Database();
$db = $database->getConnection();

// Get and decode JSON data
$jsonData = file_get_contents("php://input");
$data = json_decode($jsonData, true);

// Validate required data
if (
    !isset($data['products']) || !is_array($data['products']) ||
    !isset($data['shipping']) || !is_array($data['shipping'])
) {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes ou invalides."]);
    exit();
}

// Validate shipping information
$requiredShippingFields = ['nom', 'prenom', 'email', 'telephone', 'adresse', 'ville', 'codePostal', 'pays'];
foreach ($requiredShippingFields as $field) {
    if (!isset($data['shipping'][$field]) || empty($data['shipping'][$field])) {
        http_response_code(400);
        echo json_encode(["message" => "Informations de livraison incomplètes: $field manquant."]);
        exit();
    }
}

try {
    $db->beginTransaction();

    // Calculate total and create panier
    $total = 0;
    $qte = 0;
    foreach ($data['products'] as $prod) {
        if (!isset($prod['id']) || !isset($prod['quantity'])) continue;

        $stmt = $db->prepare("SELECT prix_prod, qte_prod FROM produit WHERE id_prod = :id");
        $stmt->execute([':id' => $prod['id']]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            if ($row['qte_prod'] < $prod['quantity']) {
                throw new Exception("Stock insuffisant pour le produit ID: " . $prod['id']);
            }
            $total += $row['prix_prod'] * $prod['quantity'];
            $qte += $prod['quantity'];
        }
    }

    // Create panier
    $stmt = $db->prepare("INSERT INTO panier (total, prix, qte) VALUES (:total, :prix, :qte)");
    $stmt->execute([':total' => $total, ':prix' => $total, ':qte' => $qte]);
    $id_panier = $db->lastInsertId();

    // Add products to panier_produit and update stock
    foreach ($data['products'] as $prod) {
        if (!isset($prod['id']) || !isset($prod['quantity'])) continue;

        $stmt = $db->prepare("UPDATE produit SET qte_prod = qte_prod - :quantity WHERE id_prod = :id");
        $stmt->execute([':quantity' => $prod['quantity'], ':id' => $prod['id']]);

        $stmt = $db->prepare("INSERT INTO panier_produit (id_panier, id_prod, quantite) VALUES (:id_panier, :id_prod, :quantite)");
        $stmt->execute([
            ':id_panier' => $id_panier,
            ':id_prod' => $prod['id'],
            ':quantite' => $prod['quantity']
        ]);
    }

    // Create commande
    $stmt = $db->prepare("INSERT INTO commande (etat_cmd, id_panier, id_user) VALUES ('en attente', :id_panier, :id_user)");
    $stmt->execute([':id_panier' => $id_panier, ':id_user' => $user->id]);
    $id_cmd = $db->lastInsertId();
    if (!$id_cmd) {
        throw new Exception("La commande n'a pas pu être créée ou l'id_cmd n'a pas été retourné.");
    }

    // Save shipping information
    $shipping = $data['shipping'];
    $stmt = $db->prepare("
        INSERT INTO shipping_info (
            commande_id, nom, prenom, email, telephone, 
            adresse, ville, code_postal, pays
        ) VALUES (
            :commande_id, :nom, :prenom, :email, :telephone,
            :adresse, :ville, :code_postal, :pays
        )
    ");
    $stmt->execute([
        ':commande_id' => $id_cmd,
        ':nom' => $shipping['nom'],
        ':prenom' => $shipping['prenom'],
        ':email' => $shipping['email'],
        ':telephone' => $shipping['telephone'],
        ':adresse' => $shipping['adresse'],
        ':ville' => $shipping['ville'],
        ':code_postal' => $shipping['codePostal'],
        ':pays' => $shipping['pays']
    ]);

    $db->commit();

    http_response_code(201);
    echo json_encode([
        "message" => "Commande créée avec succès.",
        "id_cmd" => $id_cmd,
        "id_panier" => $id_panier,
        "total" => $total,
        "qte" => $qte
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    http_response_code(400);
    echo json_encode([
        "message" => "Erreur lors de la création de la commande: " . $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}