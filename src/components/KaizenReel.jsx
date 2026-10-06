import { useId, useState } from 'react';
import '../styles/KaizenReel.css';
import { useLang } from '../lib/LangContext';

/**
 * Animación de marca (~16 s, en loop) que vive en la pantalla de la laptop del
 * reel de Proyectos. Hilo: "Evoluciona la forma en que haces negocio".
 *   0–3 s   Idea: una línea se dibuja y aparece "Tu negocio".
 *   3–6 s   Diseño: la línea se vuelve el plano de una app (cajas punteadas).
 *   6–10 s  Construcción: Reservar, pase QR, ticket impreso, gráfica de ventas.
 *   10–13 s Lanzamiento: el ícono Κ cae en una pantalla de inicio.
 *   13–16 s Mejora continua: gráfica en escalones y cierre con ΚΛΙΖΣΝ.
 * Blanco y negro con fondo hueso: sin colores de clientes.
 *
 * Todo es CSS sobre un SVG (KaizenReel.css). Los tiempos están en % de 16 s
 * (1 s = 6.25%). Puede haber varias instancias (laptop y a sangre): todas
 * toman el retraso del mismo reloj (EPOCH) para ir sincronizadas.
 * `fit`: 'slice' llena el contenedor recortando; 'meet' lo muestra completo.
 * `paused`: detiene el reloj (fuera de pantalla no se anima).
 * `frozen`: se queda quieta en la escena de construcción (reduced-motion).
 */
const CICLO = 16000;
const EPOCH = typeof performance !== 'undefined' ? performance.now() : 0;

const BARRAS = [38, 62, 50, 84, 104];
// Patrón fijo de un QR de juguete (7×7, 1 = cuadro lleno)
const QR = ['1110111', '1010101', '1110111', '0001000', '1101011', '0101110', '1110101'];

function Qr({ x, y, size }) {
  const c = size / 7;
  return (
    <g>
      {QR.flatMap((fila, r) =>
        [...fila].map((v, k) =>
          v === '1' ? <rect key={`${r}-${k}`} x={x + k * c} y={y + r * c} width={c} height={c} /> : null,
        ),
      )}
    </g>
  );
}

export default function KaizenReel({ fit = 'slice', frozen = false, paused = false, className = '' }) {
  const { t } = useLang();
  const clip = useId();
  const [sync] = useState(() => (frozen ? '-8.6s' : `${-(((performance.now() - EPOCH) % CICLO) / 1000).toFixed(3)}s`));

  return (
    <svg
      className={`kr ${frozen ? 'kr--frozen' : ''} ${paused ? 'kr--paused' : ''} ${className}`}
      style={{ '--sync': sync }}
      viewBox="0 0 1600 1000"
      preserveAspectRatio={`xMidYMid ${fit}`}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clip}>
          <rect x="990" y="292" width="250" height="300" />
        </clipPath>
      </defs>
      <rect className="kr-bg" x="-2000" y="-2000" width="5600" height="5000" />

      {/* 1 · Idea */}
      <path className="kr-line" d="M500 580H1100" pathLength="1" />
      <text className="kr-title" x="800" y="530" textAnchor="middle">
        {t({ es: 'Tu negocio', en: 'Your business' })}
      </text>

      {/* 2 · Diseño: el teléfono y su plano */}
      <path
        className="kr-phone"
        d="M698 180H902A48 48 0 0 1 950 228V752A48 48 0 0 1 902 800H698A48 48 0 0 1 650 752V228A48 48 0 0 1 698 180Z"
        pathLength="1"
      />
      <g className="kr-wire">
        <rect style={{ '--k': 0 }} x="680" y="232" width="240" height="40" rx="10" />
        <rect style={{ '--k': 1 }} x="680" y="292" width="240" height="150" rx="14" />
        <rect style={{ '--k': 2 }} x="680" y="462" width="112" height="112" rx="14" />
        <rect style={{ '--k': 3 }} x="808" y="462" width="112" height="112" rx="14" />
        <rect style={{ '--k': 4 }} x="680" y="600" width="240" height="60" rx="30" />
      </g>

      {/* 3 · Construcción */}
      <g className="kr-build">
        <text className="kr-pop kr-small" x="696" y="261">
          {t({ es: 'Hoy · 7:00', en: 'Today · 7:00' })}
        </text>
        <g className="kr-bars">
          {BARRAS.map((h, i) => (
            <rect key={i} style={{ '--k': i }} x={702 + i * 44} y={428 - h} width="28" height={h} rx="4" />
          ))}
        </g>
        <g className="kr-pop kr-ink" style={{ '--d': '1.2s' }}>
          <Qr x={701} y={483} size={70} />
        </g>
        <g className="kr-pop" style={{ '--d': '1.6s' }}>
          <text className="kr-small" x="822" y="500">
            {t({ es: 'Ventas', en: 'Sales' })}
          </text>
          {/* Corto a propósito: "$1,250" no cabía en la caja de 112 */}
          <text className="kr-num" x="822" y="542">
            +24%
          </text>
        </g>
        <g className="kr-pop kr-btn" style={{ '--d': '0.2s' }}>
          <rect x="680" y="600" width="240" height="60" rx="30" />
          <text className="kr-btn-a" x="800" y="638" textAnchor="middle">
            {t({ es: 'Reservar', en: 'Book now' })}
          </text>
          <text className="kr-btn-b" x="800" y="638" textAnchor="middle">
            {t({ es: 'Reservado ✓', en: 'Booked ✓' })}
          </text>
        </g>

        {/* Pase QR (izquierda) */}
        <g transform="rotate(-6 485 445)">
          <g className="kr-pop kr-pass" style={{ '--d': '1.4s' }}>
            <rect className="kr-card" x="380" y="300" width="210" height="290" rx="20" />
            <text className="kr-small" x="404" y="342">
              {t({ es: 'PASE', en: 'PASS' })}
            </text>
            <text className="kr-pass-t" x="404" y="374">
              Pilates 7:00
            </text>
            <g className="kr-ink">
              <Qr x={420} y={410} size={130} />
            </g>
          </g>
        </g>

        {/* Impresora y ticket (derecha) */}
        <g className="kr-pop" style={{ '--d': '1.6s' }}>
          <rect className="kr-printer" x="1000" y="270" width="230" height="44" rx="12" />
          <g clipPath={`url(#${clip})`}>
            <g className="kr-ticket">
              <rect className="kr-card" x="1022" y="296" width="186" height="250" />
              <text className="kr-small" x="1040" y="336">
                {t({ es: 'Nº 0142', en: 'No. 0142' })}
              </text>
              <path className="kr-rule" d="M1040 356H1190 M1040 392H1150 M1040 422H1170 M1040 452H1130" />
              {/* Etiqueta y monto en dos renglones: en uno se enciman */}
              <text className="kr-small" x="1040" y="488">
                TOTAL
              </text>
              <text className="kr-total" x="1040" y="526">
                $1,250
              </text>
            </g>
          </g>
        </g>
      </g>

      {/* 4 · Lanzamiento */}
      <g className="kr-home">
        {[0, 1, 2].flatMap((r) =>
          [0, 1, 2].map((c) =>
            r === 1 && c === 1 ? null : (
              <rect key={`${r}${c}`} x={680 + c * 88} y={262 + r * 100} width="64" height="64" rx="16" />
            ),
          ),
        )}
      </g>
      <g className="kr-icon">
        <rect x="768" y="362" width="64" height="64" rx="16" />
        <path d="M790 377V411 M814 377 793 395 M800 389 815 411" />
      </g>
      <text className="kr-stores" x="800" y="880" textAnchor="middle">
        App Store · Google Play
      </text>

      {/* 5 · Mejora continua: la escalera va DEBAJO de ΚΛΙΖΣΝ (antes lo cruzaba) */}
      <path className="kr-steps" d="M380 880H520V830H660V780H800V730H940V680H1080V630H1220" pathLength="1" />
      <g transform="translate(800 470) scale(1.25) translate(-245 -50)">
        <g className="kr-mark">
          <path d="M7 0V100 M66 0 12 54 M30 37 70 100" />
          <path d="M92 100 132 6 172 100" />
          <path d="M201 0V100" />
          <path d="M230 7H300L230 93H300" />
          <path d="M388 7H322L360 50 322 93H388" />
          <path d="M417 100V7L473 93V0" />
        </g>
      </g>
    </svg>
  );
}
