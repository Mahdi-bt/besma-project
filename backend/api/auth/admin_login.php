<?php
// Allow from any origin
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");    // cache for 1 day

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';
include_once '../../models/Administrateur.php';

$database = new Database();
$db = $database->getConnection();

$admin = new Administrateur($db);

// Get posted data
$data = json_decode(file_get_contents("php://input"));

// Make sure email and password are not empty
if(
    !empty($data->email) &&
    !empty($data->password)
) {
    $admin->adresse_email_admin = $data->email;
    $admin->password = $data->password;

    if($admin->login()) {
        // Set response code - 200 OK
        http_response_code(200);
        
        // Return admin data
        echo json_encode(array(
            "message" => "Login successful.",
            "admin" => array(
                "id" => $admin->id_admin,
                "name" => $admin->nom_admin,
                "email" => $admin->adresse_email_admin
            )
        ));
    } else {
        // Set response code - 401 Unauthorized
        http_response_code(401);
        echo json_encode(array("message" => "Invalid email or password."));
    }
} else {
    // Set response code - 400 Bad Request
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
} 