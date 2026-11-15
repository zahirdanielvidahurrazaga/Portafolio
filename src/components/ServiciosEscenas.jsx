import { useState } from 'react';
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

// Sello de dónde sale la escena: un caso real (con su nombre) o un ejemplo
// Con caso real es un BOTÓN: abre ese proyecto en Proyectos (evento kaizen:proyecto)
const CASO_ID = { 'Somos Natural': 'natural', Tito: 'pos', 'Be Fit Lab': 'befit' };
// Clientes sin proyecto en Proyectos: el sello lleva a su red (Studio Kala = redes que manejamos)
const CASO_URL = { 'Studio Kala': 'https://www.instagram.com/studiokala27/' };
const Origen = ({ t, caso }) =>
  caso ? (
    <button
      type="button"
      className="esc-origen esc-origen--real"
      onClick={() => {
        if (CASO_URL[caso]) window.open(CASO_URL[caso], '_blank', 'noopener');
        else if (CASO_ID[caso]) window.dispatchEvent(new CustomEvent('kaizen:proyecto', { detail: { id: CASO_ID[caso] } }));
      }}
      title={t({ es: 'Ver el proyecto', en: 'See the project' })}
    >
      {t({ es: 'Caso real', en: 'Real case' })} · {caso} ↗
    </button>
  ) : (
    <span className="esc-origen">{t({ es: 'Ejemplo', en: 'Example' })}</span>
  );

// 14-nov-2026 (Zahir: "usemos ejemplos reales, no importa que salga del estilo"): Marca, Web,
// Tienda, Automatización y App enseñan a NUESTROS clientes con sus colores; Redes y
// Lanzamiento siguen con "Aurora" y dicen que son ejemplo.
function Marca({ t }) {
  return (
    <div className="esc esc--natural">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Manual de marca', en: 'Brand guidelines' })}</span>
        <Origen t={t} caso="Somos Natural" />
      </Fila>
      <Fila i={1} className="esc-logo esc-logo--natural">
        <img src="/logos/natural-crema.svg" alt="Natural" className="esc-logo-img" />
        <span>{t({ es: 'Aguas de sabor', en: 'Flavored waters' })}</span>
      </Fila>
      <Fila i={2} className="esc-swatches">
        {['#8C66BB', '#FFFDF2', '#E0F2F6', '#2A1A40', '#F07A1A'].map((c) => (
          <span key={c} className="esc-sw" style={{ background: c }} title={c} />
        ))}
      </Fila>
      <Fila i={3} className="esc-tipos">
        <span className="esc-aa esc-aa--serif">Aa</span>
        <span>
          Fraunces
          <br />
          <span className="esc-tenue">Rubik · {t({ es: 'texto', en: 'body' })}</span>
        </span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Etiquetas, sitio y redes con la misma cara', en: 'Labels, website and social with one face' })}
      </Fila>
    </div>
  );
}

// REDES: la publicación REAL de una clienta (Zahir, 14-nov). Mientras no esté la imagen en
// public/clientes/, sale la de ejemplo (Aurora) y el sello dice "Ejemplo".
const REDES_CASO = { usuario: 'studiokala27', nombre: 'Studio Kala', foto: '/clientes/redes-post.jpg', likes: '1,2 mil', compartidos: '43' };
function Redes({ t }) {
  const [real, setReal] = useState(!!REDES_CASO.usuario);
  return (
    <div className="esc esc--ig">
      <Fila i={0} className="esc-perfil">
        {/* sin fotito de perfil (14-nov: el círculo arcoíris no le gustó) */}
        <span>
          <b>{real ? REDES_CASO.usuario : 'aurora.cafe'}</b>
          <br />
          <span className="esc-tenue">{real ? t({ es: 'Uñas · Juxtlahuaca', en: 'Nails · Juxtlahuaca' }) : t({ es: 'Programado · Hoy 7:00 p. m.', en: 'Scheduled · Today 7:00 p.m.' })}</span>
        </span>
        <Origen t={t} caso={real ? REDES_CASO.nombre : null} />
      </Fila>
      <Fila i={1} className="esc-ig-foto">
        {real ? (
          <img src={REDES_CASO.foto} alt="" onError={() => setReal(false)} />
        ) : (
          <span className="esc-ig-ejemplo">
            <small>{t({ es: 'Nuevo en la barra', en: 'New at the bar' })}</small>
            <b>Latte de<br />cajeta</b>
            <i>$68</i>
          </span>
        )}
      </Fila>
      <Fila i={2} className="esc-ig-acciones">
        {real ? (
          <>
            <span>♥ {REDES_CASO.likes}</span>
            <span>{t({ es: `${REDES_CASO.compartidos} compartidos`, en: `${REDES_CASO.compartidos} reposts` })}</span>
            <span className="esc-derecha esc-tenue">Nails · Inspo Otoño</span>
          </>
        ) : (
          <>
            <span>♥ 248</span>
            <span>{t({ es: '32 comentarios', en: '32 comments' })}</span>
            <span className="esc-derecha esc-tenue">{t({ es: '+41 seguidores esta semana', en: '+41 followers this week' })}</span>
          </>
        )}
      </Fila>
      <Fila i={3} className="esc-pie">
        <Check /> {real ? t({ es: 'Agenda tu cita por DM o WhatsApp', en: 'Book by DM or WhatsApp' }) : t({ es: 'Calendario de noviembre: 12 de 12 publicadas', en: 'November calendar: 12 of 12 posted' })}
      </Fila>
    </div>
  );
}

// LANZAMIENTO: inventado pero completo (no hay caso real todavía): el cartel de apertura
// con su cuenta regresiva y lo que ya quedó listo.
function Lanzamiento({ t }) {
  const listos = [
    { es: 'Logo', en: 'Logo' },
    { es: 'Redes', en: 'Social' },
    { es: 'Página', en: 'Website' },
    { es: '8 posts', en: '8 posts' },
  ];
  return (
    <div className="esc esc--apertura">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Listo para abrir', en: 'Ready to open' })}</span>
        <Origen t={t} />
      </Fila>
      <Fila i={1} className="esc-cartel">
        <small>Aurora · {t({ es: 'café de especialidad', en: 'specialty coffee' })}</small>
        <b>{t({ es: 'Gran apertura', en: 'Grand opening' })}</b>
        <span>{t({ es: 'Sábado 22 · 9:00 a. m.', en: 'Saturday 22 · 9:00 a.m.' })}</span>
        <span className="esc-cuenta">
          <i><b>03</b>{t({ es: 'días', en: 'days' })}</i>
          <i><b>14</b>{t({ es: 'horas', en: 'hours' })}</i>
          <i><b>22</b>min</i>
        </span>
      </Fila>
      <Fila i={2} className="esc-chips">
        {listos.map((x) => (
          <span key={x.es}><Check /> {t(x)}</span>
        ))}
      </Fila>
      <Fila i={3} className="esc-noti">
        <span className="esc-vivo" />
        <span>
          <b>{t({ es: '48 personas confirmaron', en: '48 people RSVP’d' })}</b>
          <br />
          <span className="esc-tenue">{t({ es: 'desde el formulario de la página', en: 'through the website form' })}</span>
        </span>
      </Fila>
    </div>
  );
}

// WEB: el sitio REAL de Natural en un navegador, con su búsqueda arriba
function Web({ t }) {
  return (
    <div className="esc">
      <Fila i={0} className="esc-buscador">
        <span className="esc-tenue">{t({ es: 'aguas de sabor natural', en: 'natural flavored waters' })}</span>
      </Fila>
      <Fila i={1} className="esc-nav">
        <span className="esc-nav-barra">
          <i /><i /><i />
          <span>somos-natural.pages.dev</span>
        </span>
        <span className="esc-nav-sitio">
          <img src="/logos/natural-crema.svg" alt="Natural" />
          <small>{t({ es: 'Elige tu sabor', en: 'Pick your flavor' })}</small>
          <span className="esc-sabores">
            {['#C8243E', '#F2C230', '#F07A1A', '#7CB342', '#E0F2F6'].map((c) => (
              <i key={c} style={{ background: c }} />
            ))}
          </span>
          <span className="esc-nav-boton">{t({ es: 'Pedir por WhatsApp', en: 'Order on WhatsApp' })}</span>
        </span>
      </Fila>
      <Fila i={2} className="esc-noti">
        <span className="esc-vivo" />
        <span>
          <b>WhatsApp</b>
          <br />
          <span className="esc-tenue">{t({ es: '“Hola, vi su página. ¿Me mandan 2 de jamaica?”', en: '“Hi, I saw your website. Can I get 2 hibiscus?”' })}</span>
        </span>
      </Fila>
      <Fila i={3} className="esc-pie">
        <Origen t={t} caso="Somos Natural" />
      </Fila>
    </div>
  );
}

// TIENDA: el punto de venta REAL de Plásticos Tito (artículos y montos de ejemplo)
function Tienda({ t }) {
  const renglones = [
    [{ es: 'Cubeta 19 L', en: 'Bucket 19 L' }, '×3', '$165'],
    [{ es: 'Escoba de mijo', en: 'Broom' }, '×2', '$130'],
    [{ es: 'Jerga', en: 'Floor cloth' }, '×6', '$108'],
  ];
  return (
    <div className="esc esc--tito">
      <Fila i={0} className="esc-marca-fila">
        <img src="/logos/tito.png" alt="" />
        <span>
          <b>Plásticos y Jarciería Tito</b>
          <br />
          <span className="esc-tenue">{t({ es: 'Caja 1 · Folio 0842', en: 'Register 1 · Ticket 0842' })}</span>
        </span>
        <Origen t={t} caso="Tito" />
      </Fila>
      <Fila i={1} className="esc-ticket">
        {renglones.map(([n, c, m]) => (
          <span key={n.es}><span>{t(n)} <i>{c}</i></span><b>{m}</b></span>
        ))}
        <span className="esc-ticket-mayoreo"><span>{t({ es: 'Precio de mayoreo aplicado', en: 'Wholesale price applied' })}</span><b>−$38</b></span>
        <span className="esc-ticket-total"><span>Total</span><b>$365</b></span>
      </Fila>
      <Fila i={2} className="esc-grafica esc-grafica--tito">
        {[38, 52, 46, 64, 58, 80, 72].map((h, n) => (
          <span key={n} style={{ '--h': `${h}%`, '--j': n }} />
        ))}
      </Fila>
      <Fila i={3} className="esc-pie">
        <Check /> {t({ es: 'Inventario al día y corte de caja cuadrado', en: 'Inventory up to date, register balanced' })}
      </Fila>
    </div>
  );
}

// AUTOMATIZACIÓN: la lista de espera REAL de Be Fit Lab (oferta con tiempo, cascada)
function Automatizacion({ t }) {
  return (
    <div className="esc esc--befit">
      <Fila i={0} className="esc-cabeza">
        <span>{t({ es: 'Lista de espera automática', en: 'Automatic waitlist' })}</span>
        <Origen t={t} caso="Be Fit Lab" />
      </Fila>
      <Fila i={1} className="esc-push">
        <img src="/logos/befit-mark.png" alt="" />
        <span>
          <small>BE FIT LAB · {t({ es: 'ahora', en: 'now' })}</small>
          <b>{t({ es: '¡Se liberó tu lugar!', en: 'Your spot opened up!' })}</b>
          <span>Reformer · {t({ es: 'mañana 7:00 a. m.', en: 'tomorrow 7:00 a.m.' })}</span>
        </span>
      </Fila>
      <Fila i={2} className="esc-oferta">
        <span className="esc-oferta-reloj">59:12</span>
        <span className="esc-oferta-botones">
          <i className="si">{t({ es: 'Confirmar', en: 'Confirm' })}</i>
          <i>{t({ es: 'Ceder', en: 'Pass' })}</i>
        </span>
      </Fila>
      <Fila i={3} className="esc-fila-espera">
        <span className="on">1 · {t({ es: 'Tú', en: 'You' })}</span>
        <span>2 · Ana</span>
        <span>3 · Lucía</span>
        <span className="esc-tenue">{t({ es: 'si no confirmas, pasa a la siguiente', en: 'no reply → next in line' })}</span>
      </Fila>
      <Fila i={4} className="esc-pie">
        <Check /> {t({ es: 'Clase llena sin una sola llamada', en: 'Class full without a single call' })}
      </Fila>
    </div>
  );
}

// APP: Be Fit Lab REAL — la reserva y su pase de Wallet, con sus colores
function App({ t }) {
  return (
    <div className="esc esc--befit esc--tel">
      <Fila i={0} className="esc-marca-fila">
        <img src="/logos/befit-mark.png" alt="" />
        <span>
          <b>Be Fit Lab</b>
          <br />
          <span className="esc-tenue">{t({ es: 'Hola, Ana', en: 'Hi, Ana' })}</span>
        </span>
        <Origen t={t} caso="Be Fit Lab" />
      </Fila>
      <Fila i={1} className="esc-clase">
        <span>
          <small>{t({ es: 'Tu próxima clase', en: 'Your next class' })}</small>
          <b>Reformer</b>
          <span>{t({ es: 'Mañana · 7:00 a. m. · Coach Pili', en: 'Tomorrow · 7:00 a.m. · Coach Pili' })}</span>
        </span>
        <i>{t({ es: 'Reservada', en: 'Booked' })}</i>
      </Fila>
      <Fila i={2} className="esc-pase esc-pase--befit">
        <span>
          <span className="esc-pase-k">Wallet · {t({ es: 'Pase de acceso', en: 'Access pass' })}</span>
          <br />
          <b>Ana López</b>
          <br />
          <span className="esc-pase-k">{t({ es: '7 clases restantes', en: '7 classes left' })}</span>
        </span>
        <Qr />
      </Fila>
      <Fila i={3} className="esc-pie">
        <Check /> {t({ es: 'Publicada en App Store y Google Play', en: 'Live on the App Store and Google Play' })}
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
