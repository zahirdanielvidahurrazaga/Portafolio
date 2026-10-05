/**
 * Redirección a la dirección oficial: https://kaizenstudiomx.com
 * - zahirportafolio.pages.dev (el link viejo que ya tiene la gente) → 301
 * - www.kaizenstudiomx.com → 301 (una sola dirección canónica)
 * Se conserva la ruta y el query (?v=…, #anclas las conserva el navegador).
 * OJO: solo el host EXACTO del proyecto; las vistas previas de cada deploy
 * (<hash>.zahirportafolio.pages.dev) siguen funcionando para probar.
 */
const OFICIAL = 'kaizenstudiomx.com';
const VIEJOS = new Set(['zahirportafolio.pages.dev', `www.${OFICIAL}`]);

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (VIEJOS.has(url.hostname)) {
    url.hostname = OFICIAL;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
