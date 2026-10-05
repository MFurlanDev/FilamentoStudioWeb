<?php

require_once __DIR__ . '/../src/database/Database.php';

try {
    $database = new Database();
    $connection = $database->getConnection();

    echo "<h1>FilamentoStudio</h1>";
    echo "<p>Conexión con MySQL correcta ✅</p>";

} catch (Throwable $e) {
    echo "<h1>Error</h1>";
    echo "<pre>" . htmlspecialchars($e->getMessage()) . "</pre>";
}