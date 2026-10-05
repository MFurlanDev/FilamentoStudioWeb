<?php require __DIR__ . '/includes/auth.php'; $user = protect_page(); $title = 'Mi cuenta'; $pageScript = 'cuenta'; require __DIR__ . '/includes/header.php'; ?>
<section class="container section">
    <p class="eyebrow">TU ESPACIO EN EL ESTUDIO</p>
    <h1>Hola, <?= e($user['nombre']) ?>.</h1>
    <nav class="tabs" aria-label="Tu cuenta">
        <a href="#perfil">Perfil</a><a href="#direcciones">Direcciones</a>
        <a href="<?= e(url('pedidos.php')) ?>">Mis pedidos</a><a href="#solicitudes">Mis proyectos</a>
    </nav>
<section id="perfil" class="account-section">
    <h2>Tu perfil</h2>
    <form id="perfil-form" class="panel">
        <div class="form-grid">
            <div class="field">
                <label for="nombre">Nombre</label>
                <input id="nombre" name="nombre" value="<?= e($user['nombre']) ?>" maxlength="100" autocomplete="given-name" required>
            </div><div class="field">
                <label for="apellidos">Apellidos</label>
                <input id="apellidos" name="apellidos" value="<?= e($user['apellidos']) ?>" maxlength="150" autocomplete="family-name">
            </div>
        </div>
        <div class="form-grid">
            <div class="field">
                <label for="telefono">Teléfono</label>
                <input id="telefono" name="telefono" type="tel" value="<?= e($user['telefono']) ?>" maxlength="20" autocomplete="tel">
            </div>
            <div class="field">
                <label for="email-perfil">Email</label>
                <input id="email-perfil" type="email" value="<?= e($user['email']) ?>" readonly>
            </div>
        </div>
        <p class="form-message" role="status"></p>
        <button class="button">Guardar perfil</button>
    </form>
</section>
<section id="direcciones" class="account-section">
    <h2>Tus direcciones</h2>
    <div class="two-columns">
        <div id="direcciones-lista" aria-live="polite">
            <p class="loading">Cargando direcciones…</p>
        </div><?php require __DIR__ . '/includes/address-form.php'; ?>
    </div>
</section>
<section id="solicitudes" class="account-section">
    <div class="section-heading">
        <h2>Tus proyectos personalizados</h2>
        <a class="text-link" href="<?= e(url('solicitud-personalizada.php')) ?>">Crear un proyecto ↗</a>
    </div>
    <div id="solicitudes-lista" aria-live="polite">
        <p class="loading">Cargando proyectos…</p>
    </div>
</section>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
