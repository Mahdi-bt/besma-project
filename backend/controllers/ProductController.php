<?php
require_once '../models/Product.php';

class ProductController {
    private $db;
    private $product;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->product = new Product($this->db);
    }

    public function read() {
        $result = $this->product->read();
        $num = $result->rowCount();

        if ($num > 0) {
            $products_arr = array();
            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $product_item = array(
                    'id_prod' => $id_prod,
                    'nom_prod' => $nom_prod,
                    'qte_prod' => $qte_prod,
                    'prix_prod' => $prix_prod,
                    'description_prod' => $description_prod
                );
                array_push($products_arr, $product_item);
            }
            http_response_code(200);
            echo json_encode($products_arr);
        } else {
            http_response_code(404);
            echo json_encode(array('message' => 'No products found.'));
        }
    }

    public function create() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (
            !empty($data->nom_prod) &&
            !empty($data->qte_prod) &&
            !empty($data->prix_prod)
        ) {
            $this->product->nom_prod = $data->nom_prod;
            $this->product->qte_prod = $data->qte_prod;
            $this->product->prix_prod = $data->prix_prod;
            $this->product->description_prod = $data->description_prod;

            if ($this->product->create()) {
                http_response_code(201);
                echo json_encode(array('message' => 'Product created successfully.'));
            } else {
                http_response_code(503);
                echo json_encode(array('message' => 'Unable to create product.'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Unable to create product. Data is incomplete.'));
        }
    }

    public function update() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id_prod)) {
            $this->product->id_prod = $data->id_prod;
            $this->product->nom_prod = $data->nom_prod;
            $this->product->qte_prod = $data->qte_prod;
            $this->product->prix_prod = $data->prix_prod;
            $this->product->description_prod = $data->description_prod;

            if ($this->product->update()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Product updated successfully.'));
            } else {
                http_response_code(503);
                echo json_encode(array('message' => 'Unable to update product.'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Unable to update product. ID is required.'));
        }
    }

    public function delete() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (!empty($data->id_prod)) {
            $this->product->id_prod = $data->id_prod;

            if ($this->product->delete()) {
                http_response_code(200);
                echo json_encode(array('message' => 'Product deleted successfully.'));
            } else {
                http_response_code(503);
                echo json_encode(array('message' => 'Unable to delete product.'));
            }
        } else {
            http_response_code(400);
            echo json_encode(array('message' => 'Unable to delete product. ID is required.'));
        }
    }
}
?> 