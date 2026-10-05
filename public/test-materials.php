<?php

require_once __DIR__ . '/../src/database/Database.php';
require_once __DIR__ . '/../src/models/Material.php';

try {

    $database = new Database();
    $connection = $database->getConnection();

    $materialModel = new Material($connection);

    $materiales = $materialModel->getActive();

} catch (Throwable $e) {

    die(
        '<pre>' .
        htmlspecialchars($e->getMessage()) .
        '</pre>'
    );
}

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Materiales - FilamentoStudio</title>
</head>

<body>

    <h1>Materiales disponibles</h1>

    <?php foreach ($materiales as $material): ?>

        <article>

            <h2>
                <?= htmlspecialchars($material['nombre']) ?>
            </h2>

            <p>
                <?= htmlspecialchars($material['descripcion'] ?? '') ?>
            </p>

        </article>

    <?php endforeach; ?>

</body>

</html>