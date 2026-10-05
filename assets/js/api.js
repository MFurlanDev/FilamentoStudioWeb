export const base = document.querySelector('meta[name="app-base"]')?.content || '';
export const url = path => `${base}/${String(path).replace(/^\//, '')}`;
let csrf = document.querySelector('meta[name="csrf-token"]')?.content || '';
export function setCsrf(value) { csrf = value; }
export async function api(path, { method = 'GET', data, signal } = {}) {
    const headers = { Accept: 'application/json' };
    const options = { method, headers, credentials: 'same-origin', signal };
    if (method !== 'GET') headers['X-CSRF-Token'] = csrf;
    if (data instanceof FormData) options.body = data;
    else if (data !== undefined) { headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(data); }
    let response;
    try { response = await fetch(url(`api/${path}`), options); }
    catch (error) { if (error.name === 'AbortError') throw error; throw new Error('No se pudo conectar. Comprueba tu conexión e inténtalo de nuevo.'); }
    let result;
    try { result = await response.json(); }
    catch { throw new Error('El servidor no devolvió una respuesta válida. Revisa la configuración de PHP.'); }
    if (!response.ok || !result.success) {
        const error = new Error(result.error || 'No se pudo completar la operación.'); error.status = response.status; throw error;
    }
    if (result.data?.csrf) setCsrf(result.data.csrf);
    return result.data;
}