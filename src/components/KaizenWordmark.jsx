import React from 'react';

/**
 * Wordmark ΚΛΙΖΣΝ (KaiZen): Λ en lugar de A y Σ en lugar de E.
 * Son puros trazos rectos, así que se dibuja como SVG y no depende de
 * ninguna fuente. Toma `currentColor`, así sigue al tema claro/oscuro.
 * Fuente del diseño: tools/marca/kaizen-logos.html (concepto 1).
 */
const KaizenWordmark = ({ className, height = 18 }) => (
  <svg
    className={className}
    viewBox="-8 -10 498 120"
    height={height}
    width={(height * 498) / 120}
    role="img"
    aria-label="KaiZen"
  >
    <g fill="none" stroke="currentColor" strokeWidth="15" strokeLinejoin="miter">
      <path d="M7 0V100 M66 0 12 54 M30 37 70 100" />
      <path d="M92 100 132 6 172 100" />
      <path d="M201 0V100" />
      <path d="M230 7H300L230 93H300" />
      <path d="M388 7H322L360 50 322 93H388" />
      <path d="M417 100V7L473 93V0" />
    </g>
  </svg>
);

export default KaizenWordmark;
