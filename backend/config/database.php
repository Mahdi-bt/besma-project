<?php
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct() {
        $this->host = getenv('POSTGRES_HOST') ?: 'localhost';
        $this->db_name = getenv('POSTGRES_DB') ?: 'bessma_db';
        $this->username = getenv('POSTGRES_USER') ?: 'postgres';
        $this->password = getenv('POSTGRES_PASSWORD') ?: 'postgres';
    }

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "pgsql:host=" . $this->host . 
                ";dbname=" . $this->db_name . 
                ";options='--client_encoding=UTF8'",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // PostgreSQL specific charset setting
            $this->conn->exec("SET client_encoding TO 'UTF8'");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?> 