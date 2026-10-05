<?php $title = 'Ideas que toman forma'; $pageScript = 'home'; require __DIR__ . '/includes/header.php'; ?>
<section class="hero">
    <div class="container hero-grid">
        <div class="hero-copy">
            <p class="eyebrow">
                <span class="status-dot"></span>
                TU ESTUDIO DE IMPRESIÓN 3D
            </p>
            <h1>Ideas que<br>toman<span>forma.</span></h1>
            <p class="hero-description">De ese «¿y si…?» a tenerlo en tus manos. Diseñamos e imprimimos piezas útiles, objetos únicos y soluciones hechas para ti.</p> 
            <div class="actions">
                <a class="button" href="<?= e(url('catalogo.php')) ?>">Explorar catálogo <span aria-hidden="true">↗</span></a>
                <a class="button button-outline" href="<?= e(url('solicitud-personalizada.php')) ?>">Tengo una idea</a>
            </div>
            <div class="hero-note">
                <span>01 / DISEÑO</span>
                <span>02 / IMPRESIÓN</span>
                <span>03 / TU PIEZA</span>
            </div>
            <div class="hero-art">
                <div class="art-label">FILAMENTO LAB / EST. 2026</div>
                <img src="<?= e(url('assets/icons/icono_filamentostudio.png')) ?>" alt="FilamentoStudio: impresión 3D a tu medida" width="1280" height="1280" fetchpriority="high">
                <div class="art-footer">
                    <span>
                        <span class="status-dot"></span>CREATIVIDAD EN CADA CAPA
                    </span>
                        <span>+ XYZ</span>
                </div>
            </div>
        </div>
    </div>
</section>
<div class="material-strip">
    <div class="container">
        <span>DISEÑO A MEDIDA</span>
        <span aria-hidden="true">✳</span>
        <span>FABRICACIÓN POR CAPAS</span>
        <span aria-hidden="true">✳</span>
        <span>PIEZAS CON PROPÓSITO</span>
        <span aria-hidden="true">✳</span>
        <span>PLA · TPU · MÁS POSIBILIDADES</span>
    </div>
</div>
<section class="container section">
    <div class="section-heading">
        <div>
            <p class="eyebrow">DEL ESTUDIO A TU DÍA A DÍA</p>
            <h2>Pequeñas piezas.<br>Grandes posibilidades.</h2>
        </div>
        <a class="text-link" href="<?= e(url('catalogo.php')) ?>">Ver todo el catálogo ↗</a>
    </div>
    <div id="destacados" class="product-grid" aria-live="polite">
        <p class="loading">Cargando productos…</p>
    </div>
</section>
<section class="services section">
    <div class="container">
        <div class="section-heading">
            <div>
                <p class="eyebrow">QUÉ HACEMOS</p>
                <h2>Si puedes imaginarlo,<br>podemos darle forma.</h2>
            </div>
            <p>Combinamos diseño y fabricación<br>para crear justo lo que necesitas.</p>
        </div>
        <div class="service-grid">
            <article>
                <span class="service-number">01</span>
                <h3>Impresión 3D</h3>
                <p>Objetos de catálogo fabricados capa a capa, con atención a cada detalle.</p>
            </article>
            <article>
                <span class="service-number">02</span>
                <h3>Diseño a medida</h3>
                <p>Tu idea, tus medidas, tu estilo. Una pieza pensada desde cero para ti.</p>
            </article>
            <article>
                <span class="service-number">03</span>
                <h3>Prototipado</h3>
                <p>Prueba la forma y la función de tu diseño antes de dar el siguiente paso.</p>
            </article>
            <article>
                <span class="service-number">04</span>
                <h3>Piezas funcionales</h3>
                <p>Soportes, adaptadores y soluciones para los pequeños retos cotidianos.</p>
            </article>
        </div>
    </div>
</section>
<section class="container section">
    <p class="eyebrow">ASÍ TRABAJAMOS</p>
    <h2>De la idea a tus manos.</h2>
    <div class="process-grid">
        <article>
            <span>01</span>
            <h3>Nos cuentas tu idea</h3>
            <p>Qué necesitas, cómo lo usarás y qué medidas tiene.</p>
        </article>
        <article>
            <span>02</span>
            <h3>Le damos forma</h3>
            <p>Revisamos el diseño y te enviamos un presupuesto claro.</p>
        </article>
        <article>
            <span>03</span>
            <h3>Imprimimos</h3>
            <p>Elegimos el material y fabricamos tu pieza por capas.</p>
        </article>
        <article>
            <span>04</span>
            <h3>La recibes</h3>
            <p>Preparamos tu pieza para que empieces a utilizarla.</p>
        </article>
    </div>
</section>
<section class="container custom-banner">
    <div>
        <p class="eyebrow">HECHO PARA TI</p>
        <h2>Tu próxima pieza<br>todavía no existe.</h2>
        <p>Vamos a crearla. Cuéntanos tu proyecto.</p>
    </div>
    <a class="button button-dark" href="<?= e(url('solicitud-personalizada.php')) ?>">Solicitar un presupuesto ↗</a>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>