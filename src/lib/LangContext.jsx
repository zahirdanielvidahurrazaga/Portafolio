import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Idioma del sitio (español / inglés), igual que el tema claro/oscuro:
 * - La elección del visitante manda y se guarda en localStorage ('idioma').
 * - Sin elección previa: inglés si el navegador está en inglés, si no español.
 * - Pone <html lang> para lectores de pantalla y buscadores.
 *
 * Cómo se traduce: los textos van como { es, en } junto a donde se usan (no en
 * un diccionario aparte, para que al editar un texto se vea su par) y se leen
 * con `t(...)`. Un valor { es, en } puede ser texto o JSX (con <em>, etc.).
 * Lo que no sea { es, en } se devuelve tal cual.
 */
const STORAGE_KEY = 'idioma';
const LangContext = createContext(null);

function idiomaInicial() {
  try {
    const g = localStorage.getItem(STORAGE_KEY);
    if (g === 'es' || g === 'en') return g;
  } catch {
    /* Safari en privado */
  }
  const nav = (navigator.languages?.[0] || navigator.language || 'es').toLowerCase();
  return nav.startsWith('en') ? 'en' : 'es';
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* sin almacenamiento: dura lo que dure la pestaña */
    }
  }, []);

  const t = useCallback(
    (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'es' in v ? (v[lang] ?? v.es) : v),
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang debe usarse dentro de <LangProvider>');
  return ctx;
}
