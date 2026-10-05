import { api } from './api.js';
import { escape, money, badge, state, imageUrl, empty, runForm, toast, showError, confirmAction, orderDetail } from './ui.js';
import { budgetHtml } from './solicitudes.js';
const resource = document.querySelector('.admin-page').dataset.resource;
const target = document.querySelector('#admin-content'); const editor = document.querySelector('#admin-editor');
const keys = { productos: 'id_producto', categorias: 'id_categoria', materiales: 'id_material', pedidos: 'id_pedido', solicitudes: 'id_solicitud', usuarios: 'id_usuario' };
const endpoint = (name = resource, id = '') => `admin/index.php?recurso=${name}${id ? `&id=${id}` : ''}`;
const crud = ['productos', 'categorias', 'materiales'].includes(resource);
const textInput = (name, label, value = '', options = '') => `<div class="field"><label for="edit-${name}">${label}</label><input id="edit-${name}" name="${name}" value="${escape(value)}" ${options}></div>`;
const descriptionInput = value => `<div class="field"><label for="edit-descripcion">Descripción</label><textarea id="edit-descripcion" name="descripcion" maxlength="10000" rows="5">${escape(value)}</textarea></div>`;
function openEditor(html) { editor.innerHTML = html; editor.scrollIntoView({ behavior: 'smooth', block: 'start' }); editor.querySelector('input:not([type="hidden"]),textarea,select,button')?.focus({ preventScroll: true }); }
function rowCells(row) {
    switch (resource) {
        case 'productos': return `<td>${escape(row.nombre)}</td><td>${money(row.precio)}</td><td>${row.stock}</td><td>${row.activo ? 'Activo' : 'Inactivo'}</td>`;
        case 'categorias': return `<td>${escape(row.nombre)}</td><td>${escape(row.descripcion)}</td>`;
        case 'materiales': return `<td>${escape(row.nombre)}</td><td>${escape(row.tipo)} / ${escape(row.color)}</td><td>${money(row.precio_kg)}</td><td>${escape(row.stock_gramos)} g</td><td>${row.activo ? 'Activo' : 'Inactivo'}</td>`;
        case 'pedidos': return `<td>#${row.id_pedido}</td><td>Cliente #${row.id_usuario}</td><td>${badge(row.estado)}</td><td>${money(row.total)}</td>`;
        case 'solicitudes': return `<td>${escape(row.titulo)}</td><td>Cliente #${row.id_usuario}</td><td>${badge(row.estado)}</td>`;
        case 'usuarios': return `<td>${escape(row.nombre)} ${escape(row.apellidos)}</td><td>${escape(row.email)}</td><td>${escape(row.rol)}</td><td>${row.activo ? 'Activo' : 'Inactivo'}</td>`;
    }
}
async function load() {
    try {
        if (resource === 'dashboard') {
            const data = await api(endpoint());
            const labels = { productos_activos: 'Productos activos', pedidos_pendientes: 'Pedidos pendientes', pedidos_impresion: 'En impresión', solicitudes_pendientes: 'Proyectos por revisar', usuarios: 'Usuarios', ingresos: 'Ingresos registrados' };
            target.innerHTML = `<div class="stats-grid">${Object.entries(labels).map(([key, label]) => `<article class="panel stat"><p class="eyebrow">${label}</p><strong>${key === 'ingresos' ? money(data[key]) : escape(data[key])}</strong></article>`).join('')}</div><p class="notice">Los ingresos corresponden a pagos confirmados manualmente y excluyen los reembolsados.</p>`;
            return;
        }
        const rows = await api(endpoint());
        const headings = { productos: ['Producto','Precio','Stock','Visibilidad'], categorias: ['Categoría','Descripción'], materiales: ['Material','Tipo / color','Precio por kg','Stock','Estado'], pedidos: ['Pedido','Usuario','Estado','Total'], solicitudes: ['Proyecto','Usuario','Estado'], usuarios: ['Nombre','Email','Rol','Estado'] };
        target.innerHTML = `${crud ? '<div class="actions admin-actions"><button class="button" id="crear-registro">Crear nuevo +</button></div>' : ''}${rows.length ? `<div class="table-wrap panel"><table><caption class="sr-only">Listado de ${escape(resource)}</caption><thead><tr>${headings[resource].map(heading => `<th>${heading}</th>`).join('')}${resource !== 'usuarios' ? '<th>Acciones</th>' : ''}</tr></thead><tbody>${rows.map(row => `<tr>${rowCells(row)}${resource !== 'usuarios' ? `<td><div class="actions"><button class="text-button" data-edit="${row[keys[resource]]}">${crud ? 'Editar' : 'Ver detalle'}</button>${crud ? `<button class="text-button danger" data-delete="${row[keys[resource]]}">${resource === 'productos' ? 'Desactivar' : 'Eliminar'}</button>` : ''}</div></td>` : ''}</tr>`).join('')}</tbody></table></div>` : empty('Todavía no hay registros.')}`;
        target.querySelector('#crear-registro')?.addEventListener('click', () => edit().catch(error => toast(error.message, 'error')));
        target.querySelectorAll('[data-edit]').forEach(button => button.addEventListener('click', () => edit(button.dataset.edit).catch(error => toast(error.message, 'error'))));
        target.querySelectorAll('[data-delete]').forEach(button => button.addEventListener('click', async () => {
            if (!await confirmAction(resource === 'productos' ? '¿Desactivar este producto? Dejará de aparecer en el catálogo.' : '¿Eliminar este registro? Las referencias asociadas se actualizarán según el modelo de datos.')) return;
            button.disabled = true;
            try { await api(endpoint(), { method: 'DELETE', data: { [keys[resource]]: Number(button.dataset.delete) } }); editor.innerHTML = ''; toast('Cambio guardado.'); await load(); }
            catch (error) { toast(error.message, 'error'); button.disabled = false; }
        }));
    } catch (error) { showError(target, error); }
}
async function edit(id = '') {
    const row = id ? await api(endpoint(resource, id)) : {};
    if (resource === 'pedidos') { editOrder(row); return; }
    if (resource === 'solicitudes') { editRequest(row); return; }
    let fields = textInput('nombre', 'Nombre', row.nombre, `maxlength="${resource === 'categorias' ? 100 : 150}" required`);
    if (resource === 'categorias') fields += descriptionInput(row.descripcion);
    if (resource === 'materiales') {
        fields += `<div class="form-grid">${textInput('tipo','Tipo',row.tipo,'maxlength="50" required')}${textInput('color','Color',row.color,'maxlength="50"')}</div>${textInput('fabricante','Fabricante',row.fabricante,'maxlength="100"')}<div class="form-grid">${textInput('precio_kg','Precio / kg (€)',row.precio_kg ?? '0.00','type="number" min="0" max="99999999.99" step="0.01" required')}${textInput('stock_gramos','Stock (g)',row.stock_gramos ?? '0.00','type="number" min="0" max="99999999.99" step="0.01" required')}</div>`;
    }
    if (resource === 'productos') {
        const [categories, materials] = await Promise.all([api('categorias/index.php'), api(endpoint('materiales'))]);
        fields += `${descriptionInput(row.descripcion)}<div class="form-grid">${textInput('precio','Precio (€)',row.precio ?? '0.00','type="number" min="0" max="99999999.99" step="0.01" required')}${textInput('stock','Stock',row.stock ?? 0,'type="number" min="0" max="1000000" step="1" required')}</div><div class="field"><label for="edit-categoria">Categoría</label><select id="edit-categoria" name="id_categoria"><option value="">Sin categoría</option>${categories.map(category => `<option value="${category.id_categoria}" ${Number(category.id_categoria) === Number(row.id_categoria) ? 'selected' : ''}>${escape(category.nombre)}</option>`).join('')}</select></div><fieldset><legend>Materiales y consumo por pieza</legend><p class="muted small">El consumo describe la fabricación. El checkout reserva piezas acabadas, sin descontar de nuevo el filamento.</p>${materials.map(material => {
            const assignment = row.materiales?.find(item => Number(item.id_material) === Number(material.id_material));
            return `<div class="material-row"><label><input type="checkbox" data-material="${material.id_material}" ${assignment ? 'checked' : ''}> ${escape(material.nombre)}${material.activo ? '' : ' (inactivo)'}</label><div class="field"><label for="grams-${material.id_material}">Gramos por pieza</label><input id="grams-${material.id_material}" data-grams="${material.id_material}" type="number" min="0.01" max="99999999.99" step="0.01" value="${escape(assignment?.cantidad_gramos ?? '')}"></div></div>`;
        }).join('') || '<p>No hay materiales. Crea uno desde el módulo Materiales.</p>'}</fieldset>`;
    }
    if (resource !== 'categorias') fields += `<label class="checkbox-label"><input name="activo" type="checkbox" ${row.activo !== 0 ? 'checked' : ''}> ${resource === 'productos' ? 'Visible en el catálogo' : 'Material activo'}</label>`;
    openEditor(`<section class="panel admin-editor"><div class="section-heading"><h2>${id ? 'Editar registro' : 'Nuevo registro'}</h2><button class="text-button" id="cerrar-editor">Cerrar</button></div><form id="crud-form">${fields}<p class="form-message" role="status"></p><button class="button">Guardar cambios</button></form>${resource === 'productos' && id ? '<section id="imagenes-editor" class="account-section"></section>' : ''}</section>`);
    editor.querySelector('#cerrar-editor').addEventListener('click', () => { editor.innerHTML = ''; });
    const form = editor.querySelector('#crud-form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        runForm(form, async () => {
            const data = Object.fromEntries(new FormData(form)); if (id) data[keys[resource]] = Number(id);
            if (resource !== 'categorias') data.activo = form.elements.activo.checked;
            if (resource === 'productos') data.materiales = [...form.querySelectorAll('[data-material]:checked')].map(input => ({ id_material: Number(input.dataset.material), cantidad_gramos: form.querySelector(`[data-grams="${input.dataset.material}"]`).value }));
            const result = await api(endpoint(), { method: id ? 'PATCH' : 'POST', data }); toast('Registro guardado.'); await load();
            if (!id) await edit(result[keys[resource]]);
        });
    });
    if (resource === 'productos' && id) await renderImages(id, row.imagenes);
}
async function renderImages(id, images) {
    const section = editor.querySelector('#imagenes-editor'); if (!section) return;
    section.innerHTML = `<h3>Imágenes del producto</h3><div class="admin-image-grid">${images.map(image => `<article><img src="${imageUrl(image.ruta_imagen)}" alt="Imagen de producto ${image.id_imagen}" width="120" height="100"><div>${image.principal ? '<span class="badge">Principal</span>' : `<button class="text-button" data-main="${image.id_imagen}">Hacer principal</button>`}<button class="text-button danger" data-remove-image="${image.id_imagen}">Eliminar</button></div></article>`).join('')}</div><form id="upload-form"><div class="field"><label for="imagen-upload">Añadir imagen (JPG, PNG o WebP, hasta 5 MB)</label><input id="imagen-upload" type="file" name="imagen" accept="image/jpeg,image/png,image/webp" required></div><p class="form-message" role="status"></p><button class="button button-secondary">Subir imagen</button></form>`;
    const reload = async () => { const product = await api(endpoint('productos', id)); await renderImages(id, product.imagenes); };
    const upload = section.querySelector('#upload-form');
    upload.addEventListener('submit', event => {
        event.preventDefault();
        runForm(upload, async () => { const data = new FormData(upload); data.append('id_producto', id); await api('admin/imagenes.php', { method: 'POST', data }); toast('Imagen añadida.'); await reload(); });
    });
    section.querySelectorAll('[data-main],[data-remove-image]').forEach(button => button.addEventListener('click', async () => {
        const removing = Boolean(button.dataset.removeImage);
        if (removing && !await confirmAction('¿Eliminar esta imagen del producto?')) return;
        button.disabled = true;
        try { await api('admin/imagenes.php', { method: removing ? 'DELETE' : 'PATCH', data: { id_imagen: Number(button.dataset.removeImage || button.dataset.main), orden: 0 } }); await reload(); }
        catch (error) { toast(error.message, 'error'); button.disabled = false; }
    }));
}
function editOrder(order) {
    const transitions = { pendiente: ['pagado','cancelado'], pagado: ['en_preparacion','cancelado'], en_preparacion: ['impresion','cancelado'], impresion: ['enviado'], enviado: ['entregado'], entregado: [], cancelado: [] };
    const options = transitions[order.estado];
    openEditor(`${orderDetail(order)}${options.length ? `<form id="state-form" class="panel"><h3>Actualizar estado</h3><div class="field"><label for="order-state">Nuevo estado</label><select id="order-state" name="estado">${options.map(option => `<option value="${option}">${state(option)}</option>`).join('')}</select></div><p class="notice">Marcar como pagado confirma que has recibido el importe. Los reembolsos se realizan fuera de la web.</p><label class="checkbox-label"><input type="checkbox" name="reembolso_confirmado"> He realizado el reembolso, si el pedido pagado se cancela.</label><p class="form-message" role="status"></p><button class="button">Guardar estado</button></form>` : '<p class="notice">Este pedido tiene un estado final.</p>'}`);
    const form = editor.querySelector('#state-form');
    form?.addEventListener('submit', async event => {
        event.preventDefault();
        if (!await confirmAction(`¿Cambiar el pedido #${order.id_pedido} a ${form.elements.estado.value.replaceAll('_', ' ')}?`)) return;
        runForm(form, async () => {
            await api(endpoint(), { method: 'PATCH', data: { id_pedido: order.id_pedido, estado: form.elements.estado.value, reembolso_confirmado: form.elements.reembolso_confirmado.checked } });
            toast('Estado actualizado.'); await load(); await edit(order.id_pedido);
        });
    });
}
function editRequest(request) {
    const transitions = { pendiente: ['revision','rechazado','cancelado'], revision: ['rechazado','cancelado'], presupuestado: ['revision','rechazado','cancelado'], aceptado: ['finalizado','cancelado'], rechazado: [], finalizado: [], cancelado: [] };
    const options = transitions[request.estado];
    const canBudget = ['pendiente','revision','presupuestado'].includes(request.estado);
    openEditor(`<section class="panel"><div class="section-heading"><h2>${escape(request.titulo)}</h2>${badge(request.estado)}</div><p>Solicitud #${request.id_solicitud} · Cliente #${request.id_usuario}</p><p class="preserve-lines">${escape(request.descripcion)}</p>${request.presupuestos.map(budget => budgetHtml(budget)).join('')}${options.length ? `<form id="request-state-form"><div class="field"><label for="request-state">Nuevo estado</label><select id="request-state" name="estado">${options.map(option => `<option value="${option}">${state(option)}</option>`).join('')}</select></div><p class="form-message" role="status"></p><button class="button button-secondary">Actualizar solicitud</button></form>` : ''}</section>${canBudget ? `<form id="budget-form" class="panel"><h3>Crear presupuesto</h3><p class="muted">Un nuevo presupuesto caduca el anterior que siga pendiente.</p><div class="form-grid">${[['precio_material','Material (€)'],['precio_diseno','Diseño (€)'],['precio_impresion','Impresión (€)'],['otros_costes','Otros costes (€)']].map(([name,label]) => textInput(name,label,'0.00','type="number" min="0" max="99999999.99" step="0.01" required')).join('')}</div><p class="product-price">Total: <output id="budget-total">${money(0)}</output></p><p class="form-message" role="status"></p><button class="button">Enviar presupuesto al cliente</button></form>` : ''}`);
    const stateForm = editor.querySelector('#request-state-form');
    stateForm?.addEventListener('submit', event => {
        event.preventDefault(); runForm(stateForm, async () => { await api(endpoint(), { method: 'PATCH', data: { id_solicitud: request.id_solicitud, estado: stateForm.elements.estado.value } }); toast('Solicitud actualizada.'); await load(); await edit(request.id_solicitud); });
    });
    const budgetForm = editor.querySelector('#budget-form');
    budgetForm?.addEventListener('input', () => {
        const total = [...budgetForm.querySelectorAll('input[type="number"]')].reduce((sum, input) => sum + Math.round(Number(input.value) * 100), 0);
        budgetForm.querySelector('#budget-total').textContent = money(total / 100);
    });
    budgetForm?.addEventListener('submit', event => {
        event.preventDefault(); runForm(budgetForm, async () => {
            await api(endpoint(), { method: 'POST', data: { ...Object.fromEntries(new FormData(budgetForm)), id_solicitud: request.id_solicitud, accion: 'presupuesto' } });
            toast('Presupuesto creado.'); await load(); await edit(request.id_solicitud);
        });
    });
}
await load();
