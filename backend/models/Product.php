<?php
class Product {
    private $conn;
    private $table_name = "produit";

    public $id_prod;
    public $nom_prod;
    public $qte_prod;
    public $prix_prod;
    public $description_prod;
    public $type;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($type = null) {
        $query = "SELECT p.*, 
                    CASE 
                        WHEN v.id_prod IS NOT NULL THEN 'vetement'
                        WHEN pn.id_prod IS NOT NULL THEN 'nourriture'
                        WHEN s.id_prod IS NOT NULL THEN 'seance'
                        ELSE 'autre'
                    END as type
                FROM " . $this->table_name . " p
                LEFT JOIN vetement v ON p.id_prod = v.id_prod
                LEFT JOIN produitnourritures pn ON p.id_prod = pn.id_prod
                LEFT JOIN seancesoutien s ON p.id_prod = s.id_prod";

        if($type) {
            $query .= " WHERE ";
            switch($type) {
                case 'vetement':
                    $query .= "v.id_prod IS NOT NULL";
                    break;
                case 'nourriture':
                    $query .= "pn.id_prod IS NOT NULL";
                    break;
                case 'seance':
                    $query .= "s.id_prod IS NOT NULL";
                    break;
            }
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    public function readOne() {
        $query = "SELECT p.*, 
                    CASE 
                        WHEN v.id_prod IS NOT NULL THEN 'vetement'
                        WHEN pn.id_prod IS NOT NULL THEN 'nourriture'
                        WHEN s.id_prod IS NOT NULL THEN 'seance'
                        ELSE 'autre'
                    END as type
                FROM " . $this->table_name . " p
                LEFT JOIN vetement v ON p.id_prod = v.id_prod
                LEFT JOIN produitnourritures pn ON p.id_prod = pn.id_prod
                LEFT JOIN seancesoutien s ON p.id_prod = s.id_prod
                WHERE p.id_prod = :id
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id_prod);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->nom_prod = $row['nom_prod'];
            $this->qte_prod = $row['qte_prod'];
            $this->prix_prod = $row['prix_prod'];
            $this->description_prod = $row['description_prod'];
            $this->type = $row['type'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    nom_prod = :nom_prod,
                    qte_prod = :qte_prod,
                    prix_prod = :prix_prod,
                    description_prod = :description_prod";

        $stmt = $this->conn->prepare($query);

        $this->nom_prod = htmlspecialchars(strip_tags($this->nom_prod));
        $this->qte_prod = htmlspecialchars(strip_tags($this->qte_prod));
        $this->prix_prod = htmlspecialchars(strip_tags($this->prix_prod));
        $this->description_prod = htmlspecialchars(strip_tags($this->description_prod));

        $stmt->bindParam(":nom_prod", $this->nom_prod);
        $stmt->bindParam(":qte_prod", $this->qte_prod);
        $stmt->bindParam(":prix_prod", $this->prix_prod);
        $stmt->bindParam(":description_prod", $this->description_prod);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    nom_prod = :nom_prod,
                    qte_prod = :qte_prod,
                    prix_prod = :prix_prod,
                    description_prod = :description_prod
                WHERE
                    id_prod = :id_prod";

        $stmt = $this->conn->prepare($query);

        $this->id_prod = htmlspecialchars(strip_tags($this->id_prod));
        $this->nom_prod = htmlspecialchars(strip_tags($this->nom_prod));
        $this->qte_prod = htmlspecialchars(strip_tags($this->qte_prod));
        $this->prix_prod = htmlspecialchars(strip_tags($this->prix_prod));
        $this->description_prod = htmlspecialchars(strip_tags($this->description_prod));

        $stmt->bindParam(":id_prod", $this->id_prod);
        $stmt->bindParam(":nom_prod", $this->nom_prod);
        $stmt->bindParam(":qte_prod", $this->qte_prod);
        $stmt->bindParam(":prix_prod", $this->prix_prod);
        $stmt->bindParam(":description_prod", $this->description_prod);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id_prod = ?";
        $stmt = $this->conn->prepare($query);
        $this->id_prod = htmlspecialchars(strip_tags($this->id_prod));
        $stmt->bindParam(1, $this->id_prod);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?> 