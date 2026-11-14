/**
 * LA PÍLDORA DE KAI (14-nov-2026, como la de adamperlis.com): una cápsula con Kai
 * adentro y su frase al lado. Para escenas largas donde un globo flotante taparía
 * el contenido (Demos, Proyectos). El hueco `.kai-lugar` es una parada normal de
 * lib/kai.js; con `data-kai-pildora` Kai escribe su frase DENTRO de la cápsula
 * (`.kai-pildora-texto`) en vez de en su globo. `cel` = lo que muestra su mini celular.
 */
export default function KaiPildora({ kai, cel, className = '', style }) {
  return (
    <div className={`kai-pildora ${className}`} style={style}>
      <span
        className="kai-lugar kai-lugar--pildora"
        data-kai={kai}
        data-kai-pildora=""
        data-kai-talla="0.5"
        {...(cel ? { 'data-kai-cel': cel } : {})}
        aria-hidden="true"
      />
      <p className="kai-pildora-texto" role="status" />
    </div>
  );
}
