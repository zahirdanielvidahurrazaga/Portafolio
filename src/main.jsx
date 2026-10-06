import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Legal from './components/Legal.jsx'
import { ThemeProvider } from './lib/ThemeContext.jsx'

// Sin router: el sitio es una sola página y las legales son dos rutas fijas.
// (Cloudflare Pages sirve index.html en cualquier ruta, así que llegan aquí.)
const ruta = window.location.pathname.replace(/\/+$/, '');
const pagina =
  ruta === '/aviso-de-privacidad' ? <Legal tipo="privacidad" /> : ruta === '/terminos' ? <Legal tipo="terminos" /> : <App />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>{pagina}</ThemeProvider>
  </StrictMode>,
)
