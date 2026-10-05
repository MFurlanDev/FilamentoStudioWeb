<?php

class Database
{
    private PDO $connection;

    public function __construct()
    {
        $config = require __DIR__ . '/../config/config.php';

        $database = $config['database'];

        $dsn = "mysql:host={$database['host']};dbname={$database['name']};charset={$database['charset']}";

        try {
            $this->connection = new PDO(
                $dsn,
                $database['user'],
                $database['password'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $e) {
            throw new RuntimeException(
                'Error al conectar con la base de datos: ' . $e->getMessage()
            );
        }
    }

    public function getConnection(): PDO
    {
        return $this->connection;
    }
}