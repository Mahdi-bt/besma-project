<?php

class Client {
    private $conn;
    private $table_name = "client";

    public $id_clt;
    public $nom_clt;
    public $adresse_email_clt;
    public $tel_clt;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (nom_clt, adresse_email_clt, tel_clt, password)
                VALUES
                (:nom, :email, :tel, :password)";

        $stmt = $this->conn->prepare($query);

        // Sanitize and hash password
        $this->nom_clt = htmlspecialchars(strip_tags($this->nom_clt));
        $this->adresse_email_clt = htmlspecialchars(strip_tags($this->adresse_email_clt));
        $this->tel_clt = htmlspecialchars(strip_tags($this->tel_clt));
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        // Bind values
        $stmt->bindParam(":nom", $this->nom_clt);
        $stmt->bindParam(":email", $this->adresse_email_clt);
        $stmt->bindParam(":tel", $this->tel_clt);
        $stmt->bindParam(":password", $this->password);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function login() {
        $query = "SELECT id_clt, nom_clt, adresse_email_clt, tel_clt, password
                FROM " . $this->table_name . "
                WHERE adresse_email_clt = :email
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->adresse_email_clt = htmlspecialchars(strip_tags($this->adresse_email_clt));
        $stmt->bindParam(":email", $this->adresse_email_clt);
        $stmt->execute();

        if($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($this->password, $row['password'])) {
                $this->id_clt = $row['id_clt'];
                $this->nom_clt = $row['nom_clt'];
                $this->adresse_email_clt = $row['adresse_email_clt'];
                $this->tel_clt = $row['tel_clt'];
                return true;
            }
        }
        return false;
    }

    public function emailExists() {
        $query = "SELECT id_clt FROM " . $this->table_name . "
                WHERE adresse_email_clt = :email
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $this->adresse_email_clt = htmlspecialchars(strip_tags($this->adresse_email_clt));
        $stmt->bindParam(":email", $this->adresse_email_clt);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
} 