import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import KaizenReel from './KaizenReel';
import '../styles/ProyectosReel.css';

/**
 * Entrada a Proyectos al estilo lusion.co (seg. 4–13 de la grabación):
 * 1. La laptop CRECE con el scroll hasta que su pantalla llena la pantalla del
 *    visitante. En la pantalla corre la animación de marca (KaizenReel), puesta
 *    encima de la captura de Be Fit Lab que trae el render: así la entrada habla
 *    de KaiZen y no de un cliente.
 * 2. Ahí se cambia a la misma animación a sangre (la de la laptop, ampliada con
 *    transform, se vería borrosa). La animación AVANZA CON EL SCROLL (ver T).
 * 3. Al terminar el video aparece la frase, cuyas palabras se SEPARAN al seguir
 *    bajando.
 * Todo va ligado al scroll (sticky + useScroll): al subir corre en reversa.
 * Con prefers-reduced-motion no hay pin: se ve la laptop fija y la frase.
 */

// Dónde está la pantalla dentro de befit-mac.webp (1747×1068), medido sobre el
// render. Si se cambia el render, volver a medir.
const PANTALLA = { x: 158 / 1747, y: 24 / 1068, w: 1430 / 1747, h: 924 / 1068 };
const FRASE = ['Proyectos', 'reales,', 'no', 'demos.'];

/* Tiempos (progreso de la pista, 0…1). La animación de marca (KaizenReel) NO
   corre sola: AVANZA CON EL SCROLL (`video`), así nadie se pierde una escena y
   la frase solo entra cuando terminó. Se prefirió a bloquear el scroll (eso se
   siente como página trabada). Al subir, el video va en reversa. */
const T = {
  crece: [0, 0.16], // la laptop crece hasta que su pantalla llena la pantalla
  sangre: [0.16, 0.175], // se cambia a la versión a sangre (nítida)
  video: [0.02, 0.8], // 0 → FIN_VIDEO segundos de la animación de 16 s
  velo: [0.8, 0.86], // se oscurece y desenfoca para la frase
  frase: [0.82, 0.88], // entra "Proyectos reales, no demos."; luego se abre
};
// Último segundo que se muestra: a los 15.3 s ΚΛΙΖΣΝ sigue completo (después
// la animación se apaga para volver a empezar).
const FIN_VIDEO = 15.3;
// La laptop arranca un poco más abajo para no chocar con la barra
const BAJA_PX = 44;
// Área libre a pantalla completa: debajo de la barra (arriba) y un respiro abajo
const LIBRE = { arriba: 84, abajo: 28 };
const ACOMODA = [0.175, 0.23]; // tras el cambio a sangre, la animación se acomoda en ese área

/* Interpolación con tope, para usar dentro de useTransform(progress, fn).
   OJO: aquí NO se usa la forma useTransform(progress, [rango], [valores]).
   Con useScroll({ target, offset }) Framer Motion le pasa opacity/scale al
   motor de scroll NATIVO del navegador, que calcula otro progreso: la laptop y
   la captura a sangre quedaban visibles a la vez, desalineadas (2026-10-05).
   Con una función, todo sale del mismo progreso. */
const rango = (v, [a, b], [c, d]) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return c + (d - c) * t;
};

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return vp;
}

function Palabra({ texto, i, total, progress, abre }) {
  // Se abren desde el centro hacia los lados, como en Lusion
  const lado = i - (total - 1) / 2;
  const x = useTransform(progress, (v) => `${rango(v, [T.frase[1], 0.99], [0, lado * abre])}vw`);
  const opacity = useTransform(progress, (v) =>
    v < 0.95 ? rango(v, T.frase, [0, 1]) : rango(v, [0.95, 1], [1, 0])
  );
  return (
    <motion.span className="reel-word" style={{ x, opacity }}>
      {texto}
    </motion.span>
  );
}

export default function ProyectosReel() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { w: vw, h: vh } = useViewport();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Video ligado al scroll: se escribe --sync (retraso negativo = segundo a
  // mostrar) directo en los <svg class="kr">, sin re-render de React. Los dos
  // KaizenReel van en pausa permanente.
  const pintarVideo = (v) => {
    const seg = rango(v, T.video, [0, FIN_VIDEO]);
    ref.current?.querySelectorAll('svg.kr').forEach((el) => el.style.setProperty('--sync', `${-seg}s`));
  };
  useMotionValueEvent(scrollYProgress, 'change', pintarVideo);
  useEffect(() => pintarVideo(scrollYProgress.get()), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Tamaño base de la laptop y escala a la que su pantalla cubre el viewport
  // También limitada por el ALTO: en laptops bajas, solo por ancho, la Mac
  // pegaba con la barra y se cortaba abajo (deja ~220px para barra y letrero)
  const base = Math.min(vw * (vw < 768 ? 0.92 : 0.66), 1000, ((vh - 220) * 1747) / 1068);
  const screenW = base * PANTALLA.w;
  const screenH = (base * (1068 / 1747)) * PANTALLA.h;
  const escalaFinal = Math.max(vw / screenW, vh / screenH) * 1.02;

  // Orden importante (antes se veían las DOS imágenes desalineadas a la vez):
  // 1) la laptop termina de crecer, 2) recién ahí entra encima la versión a
  // sangre, 3) la laptop se oculta cuando ya quedó tapada.
  const scale = useTransform(scrollYProgress, (v) => rango(v, T.crece, [1, escalaFinal]));
  // Baja un poco al inicio y llega a 0 justo al llenar la pantalla
  const bajar = useTransform(scrollYProgress, (v) => rango(v, T.crece, [BAJA_PX, 0]));
  const fullOpacity = useTransform(scrollYProgress, (v) => rango(v, T.sangre, [0, 1]));
  const macOpacity = useTransform(scrollYProgress, (v) => rango(v, [T.sangre[1], T.sangre[1] + 0.005], [1, 0]));
  // Velo fuerte para que la frase se lea encima de la animación
  const velo = useTransform(scrollYProgress, (v) => rango(v, T.velo, [0, 0.78]));
  const desenfoque = useTransform(scrollYProgress, (v) => `blur(${rango(v, T.velo, [0, 10])}px)`);
  // El blur deja ver el borde del lienzo: se agranda un poco A LA PAR del
  // blur (antes de eso debe coincidir 1:1 con la pantalla de la laptop).
  const fullScale = useTransform(scrollYProgress, (v) => rango(v, T.velo, [1, 1.06]));
  const introOpacity = useTransform(scrollYProgress, (v) => rango(v, [0, 0.05], [1, 0]));

  // A sangre, el lienzo 1600×1000 se recorta (slice) para empatar 1:1 con la
  // pantalla de la laptop; en pantallas anchas eso metía el teléfono debajo de
  // la barra. Justo después del cambio se encoge hasta caber COMPLETO en el
  // área libre (el fondo es hueso igual, no se ve borde).
  const fit = vw < 768 ? 'meet' : 'slice';
  const escalaLienzo = fit === 'slice' ? Math.max(vw / 1600, vh / 1000) : Math.min(vw / 1600, vh / 1000);
  const escalaLibre = Math.min(vw / 1600, (vh - LIBRE.arriba - LIBRE.abajo) / 1000);
  const encoge = Math.min(1, escalaLibre / escalaLienzo);
  const acomodaScale = useTransform(scrollYProgress, (v) => rango(v, ACOMODA, [1, encoge]));
  const acomodaY = useTransform(scrollYProgress, (v) => rango(v, ACOMODA, [0, (LIBRE.arriba - LIBRE.abajo) / 2]));

  // La animación se monta exactamente sobre la pantalla del render
  const pantallaStyle = {
    left: `${PANTALLA.x * 100}%`,
    top: `${PANTALLA.y * 100}%`,
    width: `${PANTALLA.w * 100}%`,
    height: `${PANTALLA.h * 100}%`,
  };

  if (reduced) {
    return (
      <div className="reel reel--static">
        <div className="reel-mac-static">
          <img src="/mockups/befit-mac.webp" alt="" />
          <div className="reel-screen" style={pantallaStyle}>
            <KaizenReel frozen />
          </div>
        </div>
        <p className="reel-phrase reel-phrase--static">{FRASE.join(' ')}</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="reel">
      <div className="reel-sticky">
        {/* Distinto al "Proyectos recientes" del encabezado que viene después */}
        <motion.p className="reel-intro" style={{ opacity: introOpacity }}>
          Idea · Diseño · Construcción · Lanzamiento
        </motion.p>

        {/* La pantalla de la laptop se centra en el viewport y la escala se
            hace desde el centro de la pantalla, no del render completo. */}
        <motion.div
          className="reel-mac"
          style={{
            width: base,
            scale,
            y: bajar,
            opacity: macOpacity,
            transformOrigin: `${(PANTALLA.x + PANTALLA.w / 2) * 100}% ${(PANTALLA.y + PANTALLA.h / 2) * 100}%`,
            marginTop: -(base * (1068 / 1747)) * (PANTALLA.y + PANTALLA.h / 2 - 0.5) * 2,
          }}
        >
          <img src="/mockups/befit-mac.webp" alt="" />
          <div className="reel-screen" style={pantallaStyle}>
            <KaizenReel paused />
          </div>
        </motion.div>

        {/* En móvil (vertical) el lienzo 16:10 recortado perdería el pase y el
            ticket: se muestra completo sobre el mismo fondo hueso. */}
        <motion.div className="reel-full" style={{ opacity: fullOpacity, filter: desenfoque, scale: fullScale }}>
          <motion.div className="reel-full-lienzo" style={{ scale: acomodaScale, y: acomodaY }}>
            <KaizenReel fit={fit} paused />
          </motion.div>
        </motion.div>
        <motion.div className="reel-veil" style={{ opacity: velo }} />

        <p className="reel-phrase" aria-label={FRASE.join(' ')}>
          {FRASE.map((p, i) => (
            <Palabra
              key={p}
              texto={p}
              i={i}
              total={FRASE.length}
              progress={scrollYProgress}
              abre={vw < 768 ? 7 : 14}
            />
          ))}
        </p>
      </div>
    </div>
  );
}
