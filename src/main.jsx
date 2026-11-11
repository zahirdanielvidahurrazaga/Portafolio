import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Legal from './components/Legal.jsx'
import { ThemeProvider } from './lib/ThemeContext.jsx'
import { LangProvider } from './lib/LangContext.jsx'
import { cargado, precargar } from './lib/carga.js'

// Sin router: el sitio es una sola página y las legales son dos rutas fijas.
// (Cloudflare Pages sirve index.html en cualquier ruta, así que llegan aquí.)
const ruta = window.location.pathname.replace(/\/+$/, '');
const pagina =
  ruta === '/aviso-de-privacidad' ? <Legal tipo="privacidad" /> : ruta === '/terminos' ? <Legal tipo="terminos" /> : <App />;

// three.js (nube + cinta) empieza a bajar YA, en paralelo con React; antes se
// pedía hasta después del primer render y la carga iba en cadena.
if (pagina.type === App) {
  import('./lib/nube');
  import('./lib/heroRibbon');
  import('./lib/kai');
  // …y lo de más abajo (capturas, portadas, escenas 3D): la pantalla de carga lo espera
  precargar();
} else {
  // Páginas legales: no hay nada de esto que esperar
  ['kai', 'resto', 'medios'].forEach(cargado);
}
// Fuentes: la hoja de Google ya no bloquea el pintado (index.html), así que
// document.fonts.ready solo no basta (resolvería antes de que llegue la hoja).
// Se espera a la hoja y luego se piden las caras que usa el hero.
function esperarFuentes() {
  if (!document.fonts) return cargado('fuentes');
  const hoja = document.querySelector('link[rel="stylesheet"][href*="fonts.googleapis"]');
  const caras = () => Promise.all([
    document.fonts.load('700 1em "Familjen Grotesk"'),
    document.fonts.load('italic 600 1em "Familjen Grotesk"'),
    document.fonts.load('400 1em Inter'),
  ]).catch(() => {}).finally(() => cargado('fuentes'));
  if (!hoja || hoja.sheet) caras();
  else { hoja.addEventListener('load', caras, { once: true }); hoja.addEventListener('error', () => cargado('fuentes'), { once: true }); }
  setTimeout(() => cargado('fuentes'), 3000);   // red muy lenta: no detener la página por una fuente
}
esperarFuentes();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LangProvider>{pagina}</LangProvider>
    </ThemeProvider>
  </StrictMode>,
)
