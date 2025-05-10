<?php

class Administrateur {
    private $conn;
    private $table_name = "administrateur";

    public $id_admin;
    public $nom_admin;
    public $adresse_email_admin;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login() {
        $query = "SELECT id_admin, nom_admin, adresse_email_admin, password
                FROM " . $this->table_name . "
                WHERE adresse_email_admin = :email
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->adresse_email_admin = htmlspecialchars(strip_tags($this->adresse_email_admin));
        $stmt->bindParam(":email", $this->adresse_email_admin);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($this->password, $row['password'])) {
                $this->id_admin = $row['id_admin'];
                $this->nom_admin = $row['nom_admin'];
                $this->adresse_email_admin = $row['adresse_email_admin'];
                return true;
            }
        }
        return false;
    }

    public function emailExists() {
        $query = "SELECT id_admin FROM " . $this->table_name . "
                WHERE adresse_email_admin = :email
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->adresse_email_admin = htmlspecialchars(strip_tags($this->adresse_email_admin));
        $stmt->bindParam(":email", $this->adresse_email_admin);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
} 