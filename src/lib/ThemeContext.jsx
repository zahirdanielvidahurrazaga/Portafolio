import { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Tema claro/oscuro del sitio.
 *
 * Reglas:
 * - Sin elección previa, seguimos al sistema operativo (y en vivo: si el visitante
 *   cambia el tema de su Mac/iPhone, el sitio cambia con él).
 * - En cuanto toca el botón, su elección manda y se guarda en localStorage.
 * - El `data-theme` del <html> lo pone PRIMERO el script de index.html, antes de
 *   pintar, para que no haya un destello del tema equivocado al cargar.
 */

const STORAGE_KEY = 'tema';
const ThemeContext = createContext(null);

function temaGuardado() {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === 'light' || t === 'dark' ? t : null;
  } catch {
    return null; // Safari en privado puede tirar al leer localStorage
  }
}

function temaInicial() {
  if (typeof window === 'undefined') return 'dark';
  return (
    temaGuardado() ??
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(temaInicial);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Tiñe la barra del navegador en móvil para que no quede un borde negro
    // arriba en modo claro.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#000000');
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const alCambiarElSistema = (e) => {
      if (temaGuardado()) return; // ya eligió a mano: no lo pisamos
      setTheme(e.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', alCambiarElSistema);
    return () => mq.removeEventListener('change', alCambiarElSistema);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((actual) => {
      const siguiente = actual === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, siguiente);
      } catch {
        /* sin persistencia, pero el tema sí cambia en esta visita */
      }
      return siguiente;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() usado fuera de <ThemeProvider>');
  return ctx;
}
