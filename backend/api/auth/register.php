<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../../config/database.php';
include_once '../../models/Client.php';

$database = new Database();
$db = $database->getConnection();

$client = new Client($db);

$data = json_decode(file_get_contents("php://input"));

if(
    !empty($data->nom) &&
    !empty($data->email) &&
    !empty($data->telephone) &&
    !empty($data->password)
) {
    $client->nom_clt = $data->nom;
    $client->adresse_email_clt = $data->email;
    $client->tel_clt = $data->telephone;
    $client->password = $data->password;

    if($client->emailExists()) {
        http_response_code(400);
        echo json_encode(array("message" => "Email déjà utilisé."));
        exit();
    }

    if($client->create()) {
        http_response_code(201);
        echo json_encode(array("message" => "Inscription réussie."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Impossible de créer le compte."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Données incomplètes."));
} 