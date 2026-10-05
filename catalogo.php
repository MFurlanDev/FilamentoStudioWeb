<?php $title = 'Catálogo'; $pageScript = 'catalogo'; require __DIR__ . '/includes/header.php'; ?>
<section class="container section">
    <p class="eyebrow">HECHO CAPA A CAPA</p>
    <h1>Encuentra tu próxima pieza.</h1>
    <p class="lead">Objetos con diseño, utilidad y un toque diferente.</p>
    <form id="filtros" class="filter-bar" role="search">
        <div class="field">
            <label for="buscar">Buscar una pieza</label>
            <input type="search" id="buscar" name="q" maxlength="100" placeholder="Soportes, llaveros, organizadores…">
        </div>
        <div class="field">
            <label for="categoria">Categoría</label>
            <select id="categoria" name="categoria">
                <option value="">Todas las categorías</option>
            </select>
        </div>
        <div class="field">
            <label for="orden">Ordenar por</label>
            <select id="orden" name="orden">
                <option value="recientes">Novedades</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
            </select>
        </div>
        <button class="button" type="submit">Buscar</button>
    </form>
    <p id="resultados-count" class="muted" aria-live="polite"></p>
    <div id="productos" class="product-grid" aria-live="polite">
        <p class="loading">Cargando catálogo…</p>
    </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
