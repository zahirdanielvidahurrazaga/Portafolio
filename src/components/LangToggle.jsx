import { useLang } from '../lib/LangContext';

/**
 * Botón ES / EN de la barra, junto al de sol/luna. El idioma activo va en
 * tinta y el otro tenue; un toque cambia todo el sitio al instante.
 */
export default function LangToggle() {
  const { lang, setLang } = useLang();
  const otro = lang === 'es' ? 'en' : 'es';
  return (
    <button
      type="button"
      className="lang-toggle"
      onClick={() => setLang(otro)}
      aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a español'}
      lang={otro}
    >
      <span className={lang === 'es' ? 'is-on' : undefined}>ES</span>
      <span className="lang-toggle-sep" aria-hidden="true">/</span>
      <span className={lang === 'en' ? 'is-on' : undefined}>EN</span>
    </button>
  );
}
