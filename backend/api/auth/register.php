<?php
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
require_once '../../vendor/autoload.php';

use Firebase\JWT\JWT;

$jwt_secret = 'your_jwt_secret_key'; // Change this in production

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->nom) && !empty($data->email) && !empty($data->password)) {
    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(409);
        echo json_encode(["message" => "Email déjà utilisé."]);
        exit();
    }
    $hashed_password = password_hash($data->password, PASSWORD_BCRYPT);
    $tel = isset($data->telephone) ? $data->telephone : null;
    $role = isset($data->role) ? $data->role : 'client';
    $stmt = $db->prepare("INSERT INTO users (nom, email, tel, password, role) VALUES (:nom, :email, :tel, :password, :role) RETURNING id");
    $stmt->bindParam(":nom", $data->nom);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":tel", $tel);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":role", $role);
    if ($stmt->execute()) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $payload = [
            'id' => $row['id'],
            'email' => $data->email,
            'role' => $role,
            'exp' => time() + 60*60*24
        ];
        $jwt = JWT::encode($payload, $jwt_secret, 'HS256');
        http_response_code(201);
        echo json_encode([
            "message" => "Inscription réussie.",
            "token" => $jwt,
            "user" => [
                "id" => $row['id'],
                "nom" => $data->nom,
                "email" => $data->email,
                "tel" => $tel,
                "role" => $role
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de l'inscription."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Données incomplètes."]);
} 