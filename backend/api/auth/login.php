<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // cache for 1 day

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';
include_once '../../models/Client.php';

$database = new Database();
$db = $database->getConnection();

$client = new Client($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)) {
    $client->adresse_email_clt = $data->email;
    $client->password = $data->password;

    if($client->login()) {
        http_response_code(200);
        echo json_encode(array(
            "message" => "Connexion réussie.",
            "user" => array(
                "id" => $client->id_clt,
                "nom" => $client->nom_clt,
                "email" => $client->adresse_email_clt,
                "telephone" => $client->tel_clt
            )
        ));
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Email ou mot de passe incorrect."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
} 