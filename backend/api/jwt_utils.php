<?php
require_once __DIR__ . '/../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwt_secret = 'your_jwt_secret_key'; // Use the same secret as in login/register

function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } elseif (isset($_SERVER['HTTP_AUTHORIZATION'])) { // Nginx or fast CGI
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    // HEADER: Get the access token from the header
    if (!empty($headers) && preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}

function validate_jwt($require_admin = false) {
    global $jwt_secret;
    $token = getBearerToken();
    if (!$token) {
        http_response_code(401);
        echo json_encode(["message" => "Token manquant."]);
        exit();
    }
    try {
        $decoded = JWT::decode($token, new Key($jwt_secret, 'HS256'));
        if ($require_admin && (!isset($decoded->role) || $decoded->role !== 'admin')) {
            http_response_code(403);
            echo json_encode(["message" => "Accès refusé: admin requis."]);
            exit();
        }
        return $decoded;
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(["message" => "Token invalide."]);
        exit();
    }
} 