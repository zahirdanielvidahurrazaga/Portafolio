import { fijarVoz, registrarAlternar } from '../lib/kaiVoz';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';
import { useLang } from '../lib/LangContext';
import { KAI_FRASES, KAI_OCURRENCIAS, KAI_SERVICIOS, KAI_DEMOS, KAI_ESCENAS } from '../data/kai';
import { cargado } from '../lib/carga';
import { alargarBloqueo, bloquearScroll, soltarScroll, vieneDeScroll, vigilarScroll } from '../lib/bloqueoScroll';
import '../styles/Kai.css';

/**
 * KAI, EL GUÍA: el personaje que acompaña la página (ver lib/kai.js). Aquí va
 * lo que NO es 3D: el globo con su frase, el idioma, y la VOZ.
 *
 * VOZ: audios ya grabados (ElevenLabs, `tools/kai/voz.mjs`), uno por frase, en
 * public/kai/<idioma>/<llave>.mp3, y un índice public/kai/voz.json con los que
 * existen. Sin índice no hay botón de voz y Kai solo escribe. La voz arranca
 * APAGADA (un sitio que habla sin permiso se cierra; además el navegador
 * bloquea el audio hasta que el visitante toca algo) y la elección se guarda.
 * Con voz, sus ojos laten con el volumen real del audio (AnalyserNode).
 *
 * MIENTRAS PRESENTA UN CAPÍTULO LA PÁGINA SE DETIENE (lib/bloqueoScroll.js; pedido
 * de Zahir: si se sigue bajando, la frase se corta). Con voz, hasta que termina
 * el audio; sin voz, lo que tarda en leerse. "Callar" la suelta de inmediato.
 * Afinado el 11-nov ("en algunas partes se queda trabado"; medido: 8 frenos
 * seguidos en Servicios y, en cada capítulo, Kai al fondo con el globo cortado):
 *  · frena SOLO la línea de un capítulo, la PRIMERA vez y si el visitante venía
 *    bajando con rueda o teclas. No frenan: las líneas por servicio (van dentro
 *    de un tramo que ya avanza con el scroll), volver a pasar por un capítulo,
 *    llegar por un link del menú, las ocurrencias, ni nada en celular;
 *  · al frenar, la página se desliza hasta dejar la cabecera bien puesta
 *    (`lectura`), no se congela donde caiga;
 *  · al volver a pasar por un capítulo la línea solo se lee (sin voz: sin freno
 *    se cortaría). Si llegó sin freno (menú), la voz espera un momento para no
 *    sonar a pedazos mientras la página cruza capítulos.
 *
 * "Callar" lo deja de compañía sin hablar; tocarlo lo despierta.
 * Con prefers-reduced-motion no se monta.
 */
const TODAS = { ...KAI_FRASES, ...KAI_OCURRENCIAS, ...KAI_SERVICIOS, ...KAI_DEMOS, ...KAI_ESCENAS };
const CAPITULO = /^\d+$/; // las líneas de capítulo llevan su "Nº" (igual que en lib/kai.js)
// Dónde se detiene la página para escuchar un capítulo: Kai a un tercio de la pantalla
// (la cabecera entera y su globo, que abre hacia abajo, caben), sin meter el titular
// debajo de la barra.
const lectura = (lugar) => {
  let y = lugar.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3;
  const cabecera = lugar.closest('.sh');
  if (cabecera) y = Math.min(y, cabecera.getBoundingClientRect().top + window.scrollY - 96);
  return Math.max(0, y);
};
const guardado = (k) => {
  try {
    return localStorage.getItem(k) === '1';
  } catch {
    return false;
  }
};
const guardar = (k, v) => {
  try {
    localStorage.setItem(k, v ? '1' : '0');
  } catch {
    /* sin almacenamiento */
  }
};

export default function Kai() {
  const reduced = useReducedMotion();
  const { theme } = useTheme();
  const { lang, t } = useLang();
  const cajaRef = useRef(null);
  const canvasRef = useRef(null);
  const globoRef = useRef(null);
  const instRef = useRef(null);
  const themeRef = useRef(theme);
  const langRef = useRef(lang);
  const indiceRef = useRef(null); // { es: [llaves], en: [llaves] }
  const audioRef = useRef(null);
  const analizaRef = useRef(null);
  const dichasRef = useRef(new Set()); // líneas que ya dijo en esta visita
  const esperaRef = useRef(0);
  const [voz, setVoz] = useState(() => guardado('kai-voz'));
  const [callado, setCallado] = useState(() => guardado('kai-callado'));
  const vozRef = useRef(voz);
  const calladoRef = useRef(callado);

  // ¿Hay audios grabados?
  useEffect(() => {
    if (reduced) return undefined;
    let vivo = true;
    fetch('/kai/voz.json')
      .then((r) => (r.ok && (r.headers.get('content-type') || '').includes('json') ? r.json() : null))
      .then((j) => {
        if (!vivo || !j) return;
        indiceRef.current = j;
        const hay = Object.values(j).some((l) => Array.isArray(l) && l.length > 0);
        fijarVoz({ hay });
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [reduced]);

  // Dice (o deja de decir) una frase (solo lee refs: no cambia entre renders).
  // `lugar` = donde está parado; `pedida` = el visitante pidió oírla (idioma o voz).
  const hablar = useCallback((id, lugar, pedida) => {
    clearTimeout(esperaRef.current);
    const audio = audioRef.current;
    if (audio) {
      audio.onended = null;
      audio.pause();
    }
    if (!id) {
      soltarScroll();
      return;
    }
    const l = langRef.current;
    const dichas = dichasRef.current;
    const toque = id.startsWith('toque-');
    const nueva = !dichas.has(id);
    const frena = CAPITULO.test(id) && nueva && !!lugar && !pedida && vieneDeScroll();
    const conVoz = vozRef.current && !!indiceRef.current?.[l]?.includes(id);
    // Lo que tarda en leerse: las palabras van apareciendo (0.075 s c/u) + un respiro
    const texto = TODAS[id]?.[l] ?? TODAS[id]?.es ?? '';
    const leer = (0.25 + texto.split(' ').length * 0.075 + 0.9) * 1000;
    const sonar = () => {
      const a = audioRef.current || (audioRef.current = new Audio());
      a.src = `/kai/${l}/${id}.mp3`;
      if (frena) {
        alargarBloqueo(9000); // con voz: hasta que termine de hablar (tope de seguridad)
        a.onended = () => alargarBloqueo(250);
      }
      a.play().catch(() => {
        /* el navegador aún no deja sonar: se queda en texto (y con su freno de texto) */
        if (frena) alargarBloqueo(leer);
      });
    };
    if (frena) {
      dichas.add(id);
      bloquearScroll(leer, lectura(lugar));
      if (conVoz) sonar();
      return;
    }
    if (toque || pedida) {
      if (conVoz) sonar();
      return;
    }
    if (!nueva) return; // ya la dijo: solo se lee
    // Primera vez pero sin freno (link del menú, celular, lo despertaron): cuenta como
    // dicha, y suena, solo si se queda ahí un momento
    esperaRef.current = setTimeout(() => {
      dichas.add(id);
      if (conVoz) sonar();
    }, 450);
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    vigilarScroll();
    let cancelado = false;
    // Desde el arranque: Kai ya está cuando se va la pantalla de carga (three.js ya
    // viene en camino por la nube y la cinta)
    const arrancar = () =>
      import('../lib/kai').then(({ createKai }) => {
        if (cancelado || !canvasRef.current) return;
        instRef.current = createKai(cajaRef.current, canvasRef.current, globoRef.current, {
          theme: themeRef.current,
          frase: (id) => TODAS[id]?.[langRef.current] ?? TODAS[id]?.es,
          alDecir: hablar,
          sonando: () => !!audioRef.current && !audioRef.current.paused && !audioRef.current.ended,
        });
        instRef.current?.callar(calladoRef.current);
        // la pantalla de carga lo dirige ("Kai imprime el logo") en cuanto existe
        window.__carga?.kai?.(!!instRef.current);
        cargado('kai');
      }, () => {
        window.__carga?.kai?.(false);
        cargado('kai');
      });
    arrancar();
    // Los ojos siguen el volumen de la voz
    let raf = 0;
    const datos = new Uint8Array(256);
    const pulso = () => {
      raf = requestAnimationFrame(pulso);
      const an = analizaRef.current;
      const audio = audioRef.current;
      if (!instRef.current || !an || !audio || audio.paused) {
        instRef.current?.voz(0);
        return;
      }
      an.getByteTimeDomainData(datos);
      let s = 0;
      for (let i = 0; i < datos.length; i++) {
        const v = (datos[i] - 128) / 128;
        s += v * v;
      }
      instRef.current.voz(Math.min(1, Math.sqrt(s / datos.length) * 5));
    };
    raf = requestAnimationFrame(pulso);
    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      clearTimeout(esperaRef.current);
      soltarScroll();
      audioRef.current?.pause();
      instRef.current?.destroy();
      instRef.current = null;
    };
  }, [reduced, hablar]);

  useEffect(() => {
    themeRef.current = theme;
    instRef.current?.setTheme(theme);
  }, [theme]);
  useEffect(() => {
    langRef.current = lang;
    instRef.current?.repetir();
  }, [lang]);
  useEffect(() => {
    calladoRef.current = callado;
    if (callado) soltarScroll();
    guardar('kai-callado', callado);
    instRef.current?.callar(callado);
  }, [callado]);

  const cambiarVoz = () => {
    const v = !vozRef.current;
    vozRef.current = v;
    setVoz(v);
    fijarVoz({ voz: v });
    guardar('kai-voz', v);
    if (!v) {
      audioRef.current?.pause();
      alargarBloqueo(600); // el freno esperaba el final del audio: ya no va a llegar
      return;
    }
    // Este clic es el permiso del navegador para sonar: se arma el audio aquí
    const audio = audioRef.current || (audioRef.current = new Audio());
    if (!analizaRef.current) {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        const an = ctx.createAnalyser();
        an.fftSize = 256;
        ctx.createMediaElementSource(audio).connect(an);
        an.connect(ctx.destination);
        analizaRef.current = an;
      } catch {
        /* sin WebAudio: suena igual, pero los ojos no siguen la voz */
      }
    }
    instRef.current?.repetir();
  };

  // El botón de sonido vive en la barra (Navbar.jsx); aquí solo se registra quién la cambia
  useEffect(() => {
    fijarVoz({ voz: vozRef.current });
    registrarAlternar(cambiarVoz);
    return () => registrarAlternar(null);
  });

  if (reduced) return null;
  return (
    <div ref={cajaRef} className="kai">
      <canvas
        ref={canvasRef}
        width="1"
        height="1"
        role="img"
        aria-label={t({ es: 'Kai, el guía del sitio', en: 'Kai, the site guide' })}
        onClick={() => callado && setCallado(false)}
      />
      <div className="kai-globo">
        <p ref={globoRef} className="kai-frase" role="status" />
        <div className="kai-acciones">
          <button type="button" onClick={() => setCallado(true)}>
            {t({ es: 'Callar', en: 'Mute' })}
          </button>
        </div>
      </div>
    </div>
  );
}
