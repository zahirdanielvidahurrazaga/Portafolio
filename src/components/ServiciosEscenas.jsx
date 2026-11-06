import { useLang } from '../lib/LangContext';
import '../styles/ServiciosEscenas.css';

/*
 * ESCENAS DEL RESULTADO (Servicios, 2026-11-06). En lugar de un ícono, cada servicio
 * enseña lo que el cliente va a VER en su negocio cuando ya está hecho: el aviso de
 * venta, su sitio en Google, la reserva confirmada… Es UI de mentira en código
 * (mármol, sin color, sigue al tema), pero nada "presume" cifras: los montos y
 * nombres son de ejemplo, como en cualquier maqueta.
 * Cada renglón entra uno tras otro (--i) cuando cambia el servicio (Servicios.jsx
 * remonta la escena con key). El punto vivo (.esc-vivo) late siempre.
 */

const Fila = ({ i, className = '', children }) => (
  <div className={`esc-fila ${className}`} style={{ '--i': i }}>
    {children}
  </div>
);
const Check = () => <span className="esc-check" aria-hidden="true" />;

// QR de adorno: 21×21 con sus tres "ojos" y módulos pseudoaleatorios fijos (no
// codifica nada). El de CSS con conic-gradient parecía tablero de ajedrez.
const QR_N = 21;
const QR_MODULOS = (() => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const ojo = (x, y) => (x < 8 && y < 8) || (x > QR_N - 9 && y < 8) || (x < 8 && y > QR_N - 9);
  const d = [];
  for (let y = 0; y < QR_N; y++)
    for (let x = 0; x < QR_N; x++) if (!ojo(x, y) && rnd() > 0.52) d.push(`M${x} ${y}h1v1h-1z`);
  return d.join('');
})();
const Qr = () => (
  <svg className="esc-qr" viewBox={`0 0 ${QR_N} ${QR_N}`} aria-hidden="true" shapeRendering="crispEdges">
    <path d={QR_MODULOS} />
    {[
      [0, 0],
      [QR_N - 7, 0],
      [0, QR_N - 7],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <path d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`} fillRule="evenodd" />
        <rect x={x + 2} y={y + 2} width="3" height="3" />
      </g>
    ))}
  </svg>
);

function Marca({ t }) {
  return (
    <div className="esc">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Manual de marca', en: 'Brand guidelines' })}</span>
        <span className="esc-tenue">v1.0</span>
      </Fila>
      <Fila i={1} className="esc-logo">
        <span className="esc-logo-marca">Aurora</span>
        <span className="esc-tenue">{t({ es: 'Café de especialidad', en: 'Specialty coffee' })}</span>
      </Fila>
      <Fila i={2} className="esc-swatches">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`esc-sw esc-sw--${n}`} />
        ))}
      </Fila>
      <Fila i={3} className="esc-tipos">
        <span className="esc-aa">Aa</span>
        <span>
          Familjen Grotesk
          <br />
          <span className="esc-tenue">Inter · {t({ es: 'texto', en: 'body' })}</span>
        </span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Papelería, redes y fachada listas', en: 'Stationery, social and signage ready' })}
      </Fila>
    </div>
  );
}

function Redes({ t }) {
  return (
    <div className="esc">
      <Fila i={0} className="esc-perfil">
        <span className="esc-avatar" />
        <span>
          <b>aurora.cafe</b>
          <br />
          <span className="esc-tenue">{t({ es: 'Programado · Hoy 7:00 p. m.', en: 'Scheduled · Today 7:00 p.m.' })}</span>
        </span>
      </Fila>
      <Fila i={1} className="esc-post">
        <span className="esc-post-texto">{t({ es: 'Nuevo en la barra', en: 'New at the bar' })}</span>
      </Fila>
      <Fila i={2} className="esc-reacciones">
        <span>♥ 248</span>
        <span>{t({ es: '32 comentarios', en: '32 comments' })}</span>
        <span className="esc-tenue">{t({ es: '+41 seguidores', en: '+41 followers' })}</span>
      </Fila>
      <Fila i={3} className="esc-noti">
        <span className="esc-vivo" />
        <span>
          <b>{t({ es: 'Mensaje nuevo', en: 'New message' })}</b>
          <br />
          <span className="esc-tenue">{t({ es: '“¿Hacen pedidos para eventos?”', en: '“Do you cater events?”' })}</span>
        </span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Calendario de noviembre: 12 de 12', en: 'November calendar: 12 of 12' })}
      </Fila>
    </div>
  );
}

function Lanzamiento({ t }) {
  const items = [
    { es: 'Logo y paleta', en: 'Logo and palette' },
    { es: 'Instagram y Facebook', en: 'Instagram and Facebook' },
    { es: 'Página en línea', en: 'Website live' },
    { es: 'Primeras 8 publicaciones', en: 'First 8 posts' },
  ];
  return (
    <div className="esc">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Listo para abrir', en: 'Ready to open' })}</span>
        <span className="esc-tenue">4 / 4</span>
      </Fila>
      {items.map((x, n) => (
        <Fila key={n} i={n + 1} className="esc-lista">
          <Check /> {t(x)}
        </Fila>
      ))}
      <Fila i={5} className="esc-noti">
        <span className="esc-vivo" />
        <span>
          <b>{t({ es: 'Primer cliente', en: 'First customer' })}</b>
          <br />
          <span className="esc-tenue">{t({ es: 'Llegó por el formulario de tu página', en: 'Came in through your website form' })}</span>
        </span>
      </Fila>
    </div>
  );
}

function Web({ t }) {
  return (
    <div className="esc">
      <Fila i={0} className="esc-buscador">
        <span className="esc-tenue">{t({ es: 'café de especialidad en puebla', en: 'specialty coffee in puebla' })}</span>
      </Fila>
      <Fila i={1} className="esc-resultado">
        <span className="esc-tenue">aurora.cafe</span>
        <b className="esc-resultado-titulo">Aurora · {t({ es: 'Café de especialidad en Puebla', en: 'Specialty coffee in Puebla' })}</b>
        <span className="esc-tenue">
          {t({ es: 'Menú, horarios y pedidos por WhatsApp. Abierto hoy hasta las 9 p. m.', en: 'Menu, hours and WhatsApp orders. Open today until 9 p.m.' })}
        </span>
      </Fila>
      <Fila i={2} className="esc-resultado esc-resultado--otro">
        <span className="esc-raya" />
        <span className="esc-raya esc-raya--corta" />
      </Fila>
      <Fila i={3} className="esc-noti">
        <span className="esc-vivo" />
        <span>
          <b>WhatsApp</b>
          <br />
          <span className="esc-tenue">{t({ es: '“Hola, vi su página. ¿Tienen mesa para 6?”', en: '“Hi, I saw your website. Table for 6?”' })}</span>
        </span>
      </Fila>
    </div>
  );
}

function Tienda({ t }) {
  return (
    <div className="esc">
      <Fila i={0} className="esc-noti esc-noti--arriba">
        <span className="esc-vivo" />
        <span>
          <b>{t({ es: 'Nueva venta', en: 'New sale' })}</b>
          <br />
          <span className="esc-tenue">$1,250 · {t({ es: 'Caja 2 · Sucursal Centro', en: 'Register 2 · Downtown' })}</span>
        </span>
      </Fila>
      <Fila i={1} className="esc-cabeza">
        <span>{t({ es: 'Ventas de la semana', en: 'Sales this week' })}</span>
        <span className="esc-tenue">{t({ es: 'L–D', en: 'M–S' })}</span>
      </Fila>
      <Fila i={2} className="esc-grafica">
        {[38, 52, 46, 64, 58, 80, 72].map((h, n) => (
          <span key={n} style={{ '--h': `${h}%`, '--j': n }} />
        ))}
      </Fila>
      <Fila i={3} className="esc-lista">
        <span className="esc-tenue">{t({ es: 'Inventario', en: 'Inventory' })}</span>
        <span className="esc-derecha">{t({ es: '3 por surtir', en: '3 to restock' })}</span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Corte del día cuadrado', en: 'End-of-day count balanced' })}
      </Fila>
    </div>
  );
}

function Automatizacion({ t }) {
  return (
    <div className="esc esc--chat">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Asistente · 24/7', en: 'Assistant · 24/7' })}</span>
        <span className="esc-vivo" />
      </Fila>
      <Fila i={1} className="esc-burbuja esc-burbuja--cliente">
        {t({ es: '¿Tienen clase mañana a las 7?', en: 'Any class tomorrow at 7?' })}
      </Fila>
      <Fila i={2} className="esc-burbuja">
        {t({ es: 'Sí, quedan 3 lugares en Pilates 7:00. ¿Te aparto uno?', en: 'Yes, 3 spots left in Pilates 7:00. Want one?' })}
      </Fila>
      <Fila i={3} className="esc-burbuja esc-burbuja--cliente">
        {t({ es: 'Sí, porfa', en: 'Yes please' })}
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Reservado y cobrado, sin que nadie lo tocara', en: 'Booked and paid, untouched by staff' })}
      </Fila>
    </div>
  );
}

function App({ t }) {
  return (
    <div className="esc esc--tel">
      <Fila i={0} className="esc-cabeza">
        <span>9:41</span>
        <span className="esc-tenue">{t({ es: 'Tu app', en: 'Your app' })}</span>
      </Fila>
      <Fila i={1} className="esc-noti esc-noti--arriba">
        <span className="esc-vivo" />
        <span>
          <b>{t({ es: 'Reserva confirmada', en: 'Booking confirmed' })}</b>
          <br />
          <span className="esc-tenue">{t({ es: 'Pilates · Mañana 7:00', en: 'Pilates · Tomorrow 7:00' })}</span>
        </span>
      </Fila>
      <Fila i={2} className="esc-pase">
        <span>
          <span className="esc-tenue">{t({ es: 'Pase de acceso', en: 'Access pass' })}</span>
          <br />
          <b>Ana López</b>
        </span>
        <Qr />
      </Fila>
      <Fila i={3} className="esc-lista">
        <span className="esc-tenue">{t({ es: 'Clases restantes', en: 'Classes left' })}</span>
        <span className="esc-derecha">7</span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'En App Store y Google Play', en: 'On the App Store and Google Play' })}
      </Fila>
    </div>
  );
}

const ESCENAS = {
  pluma: Marca,
  social: Redes,
  cohete: Lanzamiento,
  navegador: Web,
  carrito: Tienda,
  ia: Automatizacion,
  telefono: App,
};

export default function Escena({ forma }) {
  const { t } = useLang();
  const E = ESCENAS[forma];
  return E ? <E t={t} /> : null;
}
