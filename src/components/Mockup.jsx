import { useState } from 'react';
import '../styles/Mockup.css';

/**
 * Imagen de mockup de dispositivo.
 *
 * Intenta primero el RENDER (`src`: PNG de Rotato/Shots.so, fondo transparente y
 * sin sombra horneada) y, si ese archivo todavía no existe, cae a la captura
 * plana (`fallback`). Así la página nunca se rompe mientras llegan los renders,
 * y cuando llegan es solo soltar el archivo: cero cambios de código.
 *
 * La sombra NO viene en el PNG a propósito: la pone el CSS con `drop-shadow`,
 * que sigue la silueta del alfa y además se adapta al tema claro/oscuro. Una
 * sombra renderizada para fondo negro se ve como una mancha gris sobre blanco.
 */
export default function Mockup({ src, fallback, alt, kind = 'phone', className = '' }) {
  const [fallo, setFallo] = useState(false);
  const usandoRender = Boolean(src) && !fallo;

  return (
    <img
      className={`mockup mockup--${kind} ${usandoRender ? 'is-render' : 'is-flat'} ${className}`.trim()}
      src={usandoRender ? src : fallback}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFallo(true)}
    />
  );
}
