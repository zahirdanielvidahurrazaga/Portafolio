import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';
import { useLang } from '../lib/LangContext';
import { KAI_FRASES, KAI_OCURRENCIAS, KAI_SERVICIOS } from '../data/kai';
import { cargado } from '../lib/carga';
import { bloquearScroll, soltarScroll } from '../lib/bloqueoScroll';
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
 * MIENTRAS HABLA NO SE PUEDE BAJAR (lib/bloqueoScroll.js; pedido de Zahir: si se
 * sigue bajando, la frase se corta). Con voz, hasta que termina el audio; sin
 * voz, lo que tarda en leerse. Las ocurrencias de cuando lo tocan no frenan
 * nada, y "Callar" suelta el scroll de inmediato.
 *
 * "Callar" lo deja de compañía sin hablar; tocarlo lo despierta.
 * Con prefers-reduced-motion no se monta.
 */
const TODAS = { ...KAI_FRASES, ...KAI_OCURRENCIAS, ...KAI_SERVICIOS };
const OCURRENCIAS = Object.keys(KAI_OCURRENCIAS);
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
  const [hayVoz, setHayVoz] = useState(false);
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
        setHayVoz(Object.values(j).some((l) => Array.isArray(l) && l.length > 0));
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [reduced]);

  // Dice (o deja de decir) una frase en voz alta (solo lee refs: no cambia entre renders)
  const hablar = useCallback((id) => {
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
    // Lo que tarda en leerse: las palabras van apareciendo (0.075 s c/u) + un respiro
    const texto = TODAS[id]?.[l] ?? TODAS[id]?.es ?? '';
    const leer = (0.25 + texto.split(' ').length * 0.075 + 0.9) * 1000;
    const frena = !id.startsWith('toque-'); // las ocurrencias (lo tocaron) no frenan el scroll
    if (frena) bloquearScroll(leer);
    if (!vozRef.current || !indiceRef.current?.[l]?.includes(id)) return;
    const a = audio || (audioRef.current = new Audio());
    a.src = `/kai/${l}/${id}.mp3`;
    if (frena) {
      bloquearScroll(9000); // con voz: hasta que termine de hablar (tope de seguridad)
      a.onended = () => bloquearScroll(250);
    }
    a.play().catch(() => {
      /* el navegador aún no deja sonar: se queda en texto (y con su freno de texto) */
      if (frena) bloquearScroll(leer);
    });
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    let cancelado = false;
    // Desde el arranque: Kai ya está cuando se va la pantalla de carga (three.js ya
    // viene en camino por la nube y la cinta)
    const arrancar = () =>
      import('../lib/kai').then(({ createKai }) => {
        if (cancelado || !canvasRef.current) return;
        instRef.current = createKai(cajaRef.current, canvasRef.current, globoRef.current, {
          theme: themeRef.current,
          frase: (id) => TODAS[id]?.[langRef.current] ?? TODAS[id]?.es,
          ocurrencias: OCURRENCIAS,
          alDecir: hablar,
        });
        instRef.current?.callar(calladoRef.current);
        cargado('kai');
      }, () => cargado('kai'));
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
    const v = !voz;
    vozRef.current = v;
    setVoz(v);
    guardar('kai-voz', v);
    if (!v) {
      audioRef.current?.pause();
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
          {hayVoz && (
            <button type="button" onClick={cambiarVoz}>
              {voz ? t({ es: 'Quitar voz', en: 'Voice off' }) : t({ es: 'Escuchar a Kai', en: 'Hear Kai' })}
            </button>
          )}
          <button type="button" onClick={() => setCallado(true)}>
            {t({ es: 'Callar', en: 'Mute' })}
          </button>
        </div>
      </div>
    </div>
  );
}
