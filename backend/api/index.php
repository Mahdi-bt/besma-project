<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// API endpoints
$endpoints = [
    'products' => 'ProductController',
    'clients' => 'ClientController',
    'orders' => 'OrderController',
    'cart' => 'CartController'
];

// Route the request
$endpoint = $uri[2] ?? '';
if (isset($endpoints[$endpoint])) {
    $controller = $endpoints[$endpoint];
    require_once "../controllers/{$controller}.php";
    $controller = new $controller();
    
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $controller->read();
            break;
        case 'POST':
            $controller->create();
            break;
        case 'PUT':
            $controller->update();
            break;
        case 'DELETE':
            $controller->delete();
            break;
        default:
            http_response_code(405);
            echo json_encode(['message' => 'Method not allowed']);
            break;
    }
} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
?> 