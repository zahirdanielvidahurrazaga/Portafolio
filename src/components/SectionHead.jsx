/**
 * Apertura editorial de sección: el MISMO lenguaje que la portada del hero.
 * Una cabecera con filete (etiqueta a la izquierda, número a la derecha, como
 * el "Nº 01 — 2026" del hero), el titular grande a ras de la izquierda con la
 * parte enfatizada en <em> (itálica, como "haces negocio") y una entrada corta.
 * Todas las secciones abren con esto: es lo que hace que el sitio se lea como
 * una sola revista y no como bloques sueltos.
 */
export default function SectionHead({ num, label, lede, children, className = '' }) {
  return (
    <header className={`sh ${className}`.trim()}>
      <div className="sh-rule">
        <span>{label}</span>
        <span>Nº {num}</span>
      </div>
      <h2 className="sh-title">{children}</h2>
      {lede && <p className="sh-lede">{lede}</p>}
    </header>
  );
}
