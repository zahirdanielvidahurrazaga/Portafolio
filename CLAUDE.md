# Portafolio — Zahir Daniel Vidahurrázaga Marín

Portafolio personal/comercial. **Objetivo del sitio: conseguir clientes** (no solo lucir).
Público: dueños de negocio PyME en México (gyms, tiendas, consultorios, eventos).
Zahir = Ingeniero en Mecatrónica que vende soluciones **software + hardware** a la medida.

> ⚠️ Vive FUERA de iCloud a propósito: `/Users/karimeperez/Developer/Portafolio`
> (Desktop/Documents sincronizan y rompen `node_modules`/`.git`).

## 🔄 Cambio de identidad: Zahir → KaiZen (en curso desde 2026-10-03)
Por la unión del estudio (Zahir + su novia), el sitio pasará de la marca personal "Zahir
Vidahurrázaga" a **KaiZen**. Logo y tipografía AÚN se están diseñando → no renombrar a ciegas.
- [x] Titular del Hero: "Evoluciona la forma en que haces negocio" (también en og:title/twitter:title).
- [x] Wordmark **ΚΛΙΖΣΝ** (Λ=A, Σ=E, puros trazos rectos) ELEGIDO → `src/components/KaizenWordmark.jsx`, ya en la navbar (sin ícono al lado: logo+nombre juntos se siente repetitivo).
- [x] Ícono ELEGIDO: **Κ** (pasó por Λ → recuerda a BBVA, y por Σ). Favicon SVG/PNG/ICO/apple-touch regenerados con PIL
      (`?v=3`). OJO: `tools/marca/iconos.mjs` todavía genera la Z azul vieja — no correrlo sin actualizarlo.
- [x] **Color: paleta MÁRMOL** (sin color: hueso #ece8df en oscuro, tinta #1d1d1f en claro). Token nuevo `--on-accent`
      para el texto sobre botones de acento (antes era #fff a mano en 5 lugares).
- [x] **Tipografía: Familjen Grotesk (titulares, `--font-display`) + Inter (texto)**, Google Fonts en index.html.
      Elegidas en `tools/marca/kaizen-laboratorio.html` (comparador de 17 fuentes × 8 paletas).
- [x] **Hero estilo portada de revista**: cabecera con filete ("Apps móviles · …" / "Nº 01 — 2026"), titular gigante
      a la izquierda con "haces negocio" en itálica, sin la franja de 3 insignias (la pidió quitar), botones al pie.
- [x] **Scroll suave** (Lenis, `src/lib/useSmoothScroll.js`): solo rueda/trackpad, se detiene con `body.pm-open`,
      el modal lleva `data-lenis-prevent`, se apaga con reduced-motion.
- [x] **Cinta 3D del hero** (`src/lib/heroRibbon.js` + `HeroRibbon.jsx` + `styles/HeroRibbon.css`, three.js por
      import() diferido): cromo-hueso (oscuro) / grafito (claro). Reemplazó a las esferas CSS.
      **Ligada al scroll (2026-10-05):** forma DETERMINISTA f(tiempo, progreso) — sin física ni memoria — para que al
      subir regrese exactamente en reversa (como Lusion). Estado A = serpiente que vaga (punto i = Lissajous(t − i·LAG));
      estado B = **SALIDA**: arco fuera de pantalla por la derecha; termina de salir al 75% del recorrido hacia
      `#about .factor-header`. Se probaron ola, órbita y ∞ anclados a Servicios y se DESCARTARON: la cinta brillante
      detrás del título blanco lo volvía ilegible. Ya NO sigue al mouse (lo pidió él). Vive en App, canvas
      FIJOS (back z −1 / front z 11); se apaga y oculta en cuanto sale (p = 1).
      **TELÓN (2026-10-26, le gustó):** el estado B ya NO es el arco de salida. Sobre p: se endereza en banda
      diagonal (~22°, p 0→0.16), ENGORDA hasta tapar toda la pantalla (radio = medio ancho de pantalla sobre la
      normal ×1.12, p 0.10→0.28; centro en z 0.3 → silueta en el canvas de ENFRENTE, tapa el contenido) y SUBE
      destapando Servicios (p 0.50→0.88). Se apaga en p 0.9. Revisado cuadro por cuadro a 1440 y 390 (claro/oscuro)
      con playwright-core en el scratchpad (`telon.mjs`: scroll a p concretos + screenshot).
      Descartado ese mismo día (NO reproponer): disolver la cinta en partículas que arman la pluma, la cinta
      DIBUJANDO las figuras de Servicios en un trazo, y la cinta SUBRAYANDO el índice con una ficha a la derecha.
      **Cruza las letras:** 2 canvas (detrás z1 / delante z11 del titular) con la misma cámara y un plano de recorte
      en z=0; el recorrido en z va cargado hacia atrás (−0.75) para que pase delante solo ~30% del tiempo.
- [x] **Barra editorial**: arriba sin cápsula, transparente y en la retícula del hero (1280 + --spacing-4), links en
      versalitas espaciadas con filete al hover; al bajar se compacta en la cápsula liquid glass. Hamburguesa < 960px.
- [x] **Reel de Proyectos** (`ProyectosReel.jsx`, efectos 1+2 de Lusion): pista sticky de 320vh (240 en móvil);
      la laptop de Be Fit Lab crece hasta que su PANTALLA cubre el viewport (escala desde el centro de la pantalla,
      medida en px sobre `befit-mac.webp` → constante PANTALLA; si cambia el render, re-medir), se cambia a la
      captura a sangre y la frase "Proyectos reales, no demos." se abre palabra por palabra. Todo con useScroll.
- [x] **Animación de marca en el reel** (`KaizenReel.jsx` + `styles/KaizenReel.css`, 2026-10-05): ~16 s en loop,
      SVG + keyframes CSS (sin video: nítida a cualquier escala, sin ffmpeg). Guion: Idea ("Tu negocio") → Diseño
      (plano punteado del teléfono) → Construcción (Reservar, pase QR, ticket, gráfica) → Lanzamiento (Κ cae en la
      pantalla de inicio · App Store · Google Play) → Mejora continua (escalones + ΚΛΙΖΣΝ). B/N sobre hueso, NO sigue
      al tema. Va encima de la pantalla del render (`.reel-screen`, medido con PANTALLA) y a sangre en lugar de
      `befit-web.jpg`. **El video AVANZA CON EL SCROLL** (pidió que se viera completo antes de la frase; se
      prefirió a bloquear el scroll): ProyectosReel escribe `--sync` (segundo negativo) directo en los `svg.kr`
      con useMotionValueEvent, ambos KaizenReel en pausa permanente; tiempos en la constante `T` y la pista mide
      820vh (640 móvil). Termina en 15.3 s (ΚΛΙΖΣΝ completo) y recién ahí entra la frase. La laptop arranca 44px
      más abajo (`BAJA_PX`, no choca con la barra) y llega a 0 al llenar la pantalla.
      El tamaño base de la laptop también se limita por el ALTO (`(vh − 220)·1747/1068`): en laptops bajas pegaba
      con la barra y se cortaba abajo.
      Textos ajustados para que NO se encimen (revisado cuadro por cuadro): caja chica "Ventas · +24%" (antes
      "$1,250" no cabía), pase "Pilates 7:00" a 24px, ticket "Nº 0142" con TOTAL y monto en dos renglones, y la
      escalera final va DEBAJO de ΚΛΙΖΣΝ (antes lo cruzaba). Para revisar cuadros: clonar `svg.kr` en un overlay
      con tamaño fijo y `--sync: -Ns`.
      A sangre el lienzo va en slice (para empatar 1:1 con la laptop) y en pantallas anchas metía el teléfono bajo
      la barra → justo después del cambio (`ACOMODA`) se encoge/baja hasta caber completo en el área libre
      (`LIBRE`: 84px arriba por la barra, 28 abajo). En móvil la de
      sangre va en 'meet' (si no, el recorte vertical se come el pase y el ticket). Se pausa fuera de pantalla;
      con reduced-motion queda congelada en la escena de construcción. Tiempos en % de 16 s (1 s = 6.25%).
- [ ] **MODO PRESENTACIÓN + LA NUBE (2026-10-05, en construcción, sin probar en navegador)** — pedido tras su 2ª
      grabación de Lusion (/about: nube de partículas → haz de luz → cara de partículas → palabras gigantes).
      Se eligió D (estructura de diapositivas) + A (una nube que hila todo) + guiño de B (Kaizen = el sitio se mejora).
      - `src/lib/nube.js` + `Nube.jsx`: UN sistema de puntos three.js (7000 / 3200 en móvil), canvas fijo z −1, cámara
        ORTOGRÁFICA en px CSS, posiciones en CPU = f(tiempo, scroll) DETERMINISTA (igual que la cinta). Polvo tenue con
        parallax entre secciones; apagado en el hero (manda la cinta) y aparece mientras la cinta sale.
      - `Interludio.jsx` (`data-nube="forma"`, sticky 260vh / 210 móvil): la nube se ARMA (en curva) en la forma, se lee
        la frase, y EXPLOTA hacia afuera de vuelta a polvo. Fases en `estado()`: q = progreso de la sección
        (0 se fija, 1 se suelta); armado q −0.3→0.12, explosión 0.66→1.02. El texto usa el mismo progreso.
      - La forma se muestrea dibujándola en un canvas 2D del tamaño de `.interludio-forma` (el CSS decide tamaño y
        lugar); `FORMAS` en nube.js: `kaizen` (ΚΛΙΖΣΝ), `telefono` (geometría de KaizenReel), `k` (favicon).
      - ⚠️ La nube RELEE las escenas (`[data-nube]`) con un MutationObserver: antes las leía una sola vez y, tras
        una recarga en caliente, seguía buscando escenas viejas (el teléfono de Nosotros "no salía"). Editar
        `nube.js` en sí NO recrea la nube: recargar la página.
      - **Barra de scroll propia** (`BarraScroll.jsx`, como lusion.co): riel fino a la derecha (30vh), pulgar = cuánto
        va de la página y MARCAS donde empieza cada sección (ids en `SECCIONES`). `mix-blend-mode: difference` → se ve
        sobre claro y oscuro. La barra nativa se esconde en index.css. Oculta durante html.intro.
      - **Calidad en celular (2026-10-05):** se veía borrosa/rala en iPhone por (1) tope de DPR en 2 (iPhone es 3 →
        lienzo estirado 1.5×), (2) solo 3200 partículas, (3) borde difuminado fijo que en puntos chicos se comía todo.
        Ahora: DPR hasta 3, 5000 partículas en móvil, borde de ~1px físico (`1.2 / gl_PointSize`) en el shader.
      - **Sin polvo de fondo (pedido de Zahir):** las partículas SOLO se ven cuando forman algo; entre estaciones la
        nube ni calcula ni dibuja (`renderer.clear()` una vez). Llegan apareciendo desde toda la pantalla y al
        explotar se desvanecen. NO reponer el polvo ambiental.
      - **Pantalla de carga** (`html.intro`, la pone el script síncrono de index.html; sin #ancla ni reduced-motion;
        `scrollRestoration = 'manual'` → siempre arranca arriba): partículas SUELTAS por toda la pantalla, en
        movimiento (NO la nube circular: la descartó) → se arma ΚΛΙΖΣΝ →
        nube.js quita `intro` a los 2.9 s (`INTRO` en nube.js) y aparecen barra, WhatsApp y textos (CSS en
        index.css). El scroll se bloquea con listeners de rueda/touch/teclas en CAPTURA (index.html).
        ⚠️ **NUNCA bloquearlo con overflow:hidden en html/body ni con lenis.stop()** (que pone overflow:clip en
        <html>): en SAFARI alternar el overflow de la raíz rompe los position:sticky — el escenario del hero se iba
        hacia arriba y el titular nunca aparecía (grabación de Zahir, 5-oct). En Chrome no se nota. Durante la carga también se esconde el ΚΛΙΖΣΝ de respaldo
        (se veía "la marca sin partículas" mientras cargaba three.js). ⚠️ La transición de entrada va en la CAPA
        `.hero-kaizen`, nunca en el kicker/frase: su opacidad va ligada al scroll y una transición la atrasaba. Respaldos: index.html la quita a los 6 s; Nube.jsx la
        quita si no hay WebGL o hay reduced-motion.
      - Teléfono: "De una idea a *tu bolsillo.*" — SIN "~2 meses" (lo pidió quitar). Kicker "Del boceto a producción".
      - **APERTURA + HERO = UN SOLO ESCENARIO FIJO** (`Hero.jsx`, 680vh / 580 móvil; el viaje partículas→cinta dura
        ~2 pantallas porque Zahir lo pidió más largo; `.hero-stage` sticky). Primera
        versión era Interludio-apertura + hero aparte y Zahir la rechazó: "solo sube el texto". Visto en Chrome:
        **en Lusion NADA sube** — la pantalla se queda y el contenido se transforma EN SU LUGAR, ~4–6 golpes de
        rueda por cambio. Fases (P del escenario): ΚΛΙΖΣΝ quieto → frase se tuerce y se va palabra por palabra →
        las letras viajan a la cinta EN OLA de izquierda a derecha → la cinta se solidifica (`--born`) → el titular
        se arma palabra por palabra desde su ranura (`.hw` = máscara; filete con scaleX; botones al final) → pausa
        → el titular se va hacia arriba en su lugar → se suelta y entra Servicios.
        Puente entre canvas: `src/lib/cintaPuente.js` (la cinta publica su recorrido PROYECTADO a pantalla; `RELEVO`
        = tiempos compartidos por nube, cinta y textos). heroRibbon: p cuenta desde que el escenario SE SUELTA,
        anchorA = centro de pantalla. Reduced-motion: hero estático de siempre, sin escenario.
        ⚠️ **Gotcha:** `vector.project(camera)` usa la matriz de la cámara que SOLO se actualiza al renderizar; como
        la cinta no se dibuja antes de nacer, mandaba las partículas a 80 000 px → `camera.updateMatrixWorld()` antes.
        ⚠️ **Probar en Chrome con la extensión:** la pestaña de automatización va en segundo plano (`document.hidden`
        = true) y la nube se pausa → se ve en blanco. Para probar: `Object.defineProperty(document,'hidden',{get:()=>false})`
        y mover con `scrollTo` a P concretos. El tema se cambia con `localStorage.tema` + reload (no tocando data-theme).
        ⚠️ Nada de `overflow:hidden` en `.hero-section`: rompe el sticky.
      - **NOSOTROS = "DOS MITADES → UNA APP"** (`SobreMi.jsx`, 2026-10-05): arriba "Somos KaiZen" + bio; abajo escena
        fija (`.nos-pista`, 100vh + 2×95vh) con la nube en secuencia `mitades,telefono`: lápiz trazando un boceto
        (I · Estrategia y diseño) y `</>` (II · Ingeniería) lado a lado → se FUNDEN en el teléfono con
        "Del boceto a producción · De una idea a tu bolsillo." → explota y entra Proceso. Absorbió al Interludio
        del teléfono (ya no existe aparte).
        **CARAS (PROBADO 5-oct, DESACTIVADO hasta tener fotos buenas — `fotos: []` en `mitades`):** la mitad I puede ser la cara de Karime (`public/caras/karime.png`: escala de grises
        + alfa, fondo quitado). En nube.js una forma puede traer `fotos: [{src, box}]` → `muestrearFoto` las vuelve
        partículas por DENSIDAD (oscuro: más puntos donde hay luz; claro: donde hay sombra) y la caché se rehace al
        cambiar de tema o al cargar la foto (`versionFotos`). Sin foto cargada cae al lápiz. Falta la de Zahir (→ `</>`).
        Cómo se hizo el PNG: enderezar/recortar con PIL, fondo blanco quitado por flood-fill desde los bordes (Vision
        de macOS se colgó), contraste por percentiles dentro de la máscara.
      - Nosotros también lleva **Misión · Visión · Valores** (`MVV` en SobreMi.jsx, borrador 5-oct para que lo ajusten)
        y la bio/mitades ya cubren marca + redes + tecnología; frase del teléfono: "De una idea a las manos de tus
        clientes." (kicker "Marca + tecnología, un solo equipo").
      - Interludio que queda: antes del Footer
        (Κ · "¿Empezamos?" + botón a #contact).
      - Sin WebGL / reduced-motion: no hay nube; cada interludio muestra su `fallback` SVG (se esconde con body.nube-on).
      - SIGUIENTE: caras en Nosotros (falta sampler de imagen + las 2 fotos), guiño B en Proceso (arranca en boceto y se
        "mejora"), transiciones entre secciones (palabras gigantes que cruzan, cambio de color total tinta/hueso).
- [x] **SISTEMA EDITORIAL en todo el sitio (2026-10-05)** — diagnóstico visual en Chrome: el hero hablaba "revista" y
      el resto "plantilla Apple". Ahora: `SectionHead.jsx` (filete + etiqueta + "Nº 0X" + titular grande a la izquierda
      con `<em>` en itálica, estilos `.sh` en index.css) abre TODAS las secciones (02 Servicios … 08 Contacto).
      Sin cajas grises: `.rule-list` (filetes) en Proceso (índice con números grandes), FAQ (+ que gira a ×),
      Testimonios (cita grande sin estrellas) y Nosotros. Contacto: campos con solo línea inferior. Sin glows de
      color en Proyectos (tags como línea de créditos). `.section-container` 1200→1280 (misma retícula del hero);
      `--section-pad-y` 8→6.5rem.
- [x] **Voz "nosotros"** en todo el sitio + `<title>`/metas a KaiZen. "Sobre mí" → **Nosotros** (#sobre-mi se
      conserva): sin foto individual, ahí van las caras de partículas. Se quitó "Ingeniero en Mecatrónica".
      Correo de contacto: **info@kaizenstudiomx.com** → reenvía a kaizenstudioinfo@gmail.com con Cloudflare Email
      Routing (solo RECIBE; para responder como info@ hay que configurar "Enviar como" en Gmail). Regla creada por API
      con la sesión de wrangler (ojo: el login nuevo quedó en `~/.wrangler/config/default.toml`, no en
      `~/Library/Preferences/.wrangler`).
- [x] **Imagen al compartir = `og-image-v3.jpg` (2026-10-05)**: oscura, cabecera de revista, titular del hero con
      "haces negocio" en itálica con degradado, ΚΛΙΖΣΝ HECHO DE PARTÍCULAS y "Proyectos reales, no demos.". Sin foto.
      Se genera con `tools/marca/og.py` (PIL + Familjen Grotesk/Inter; fuentes en `tools/marca/.fuentes/`, no van
      en git — URLs en el script). og.mjs/og.html (playwright) se borraron. Revisada a tamaño WhatsApp (336px).
- ⚠️ **Gotcha Framer Motion:** con `useScroll({ target, offset })`, `useTransform(p, [rango], [valores])` en
      opacity/scale se delega al ScrollTimeline NATIVO, que calcula OTRO progreso (en el reel se veían laptop y
      captura a la vez). Usar `useTransform(p, (v) => …)` (helper `rango` en ProyectosReel.jsx).
- [x] **Transición diagonal** (`DiagonalReveal.jsx`): la sección se descubre con un corte diagonal ligado al scroll.
      Solo en Sobre mí y Proceso (en todas se volvería tic).
- [ ] Siguiente efecto (de la grabación de Lusion analizada cuadro por cuadro, 2026-10-03): **caras de Zahir y su novia hechas de partículas** en Nosotros (hacen falta 2 fotos).
      Descartados: túnel de colores y stickers 3D (no van con mármol / pesan mucho).
- [x] ~~Nombre en `<title>`, metas, Sobre mí, footer, favicon/logo e imagen OG~~ — hecho (OG v3, 2026-10-05).

## Laboratorio Awwwards (10-nov-2026) — `tools/lab/`, ESPERANDO QUE ZAHIR ELIJA
Pidió subir la experiencia ("animaciones, 3D") viendo los nominados de Awwwards. Revisados en Chrome: Wiro (entras por
una ventana a otro mundo), Hanusek (objeto 3D con líneas que señalan sus partes), Disrupt (imágenes flotando en
profundidad), BR& (texto en curva), Cius Labs, Douglus (tinta), Adam Perlis (cromo líquido), Matchball, Digital of
Things. Diagnóstico: hero/cinta/telón ya están a ese nivel; de Servicios para abajo todo es plano.
Se armaron 4 prototipos VIVOS en una página aparte — `http://localhost:5173/tools/lab/index.html` (solo con el
servidor de desarrollo; no entra al build ni se publica; vanilla JS + three, sin tocar `src/`):
- **A · `telefono.js`** — teléfono 3D del mismo cromo que la cinta (`TONOS` copiados de heroRibbon) con las capturas de
  `public/demos` como pantalla; todo f(scroll): entra → cada vuelta trae otro giro (se cambia de aparato cuando da la
  espalda, que lleva la Κ grabada) → líneas que señalan "Tu marca / Tu catálogo / Tres vistas" → abanico de 5 giros.
  Iría en Demos en lugar del teléfono plano de CSS.
- **B · `tela.js`** — mockup de Proyectos como plano WebGL: se comba con la velocidad del cursor, separa canales y
  barre de una imagen a otra. Vive en la mitad derecha para no tapar el nombre.
- **C · `marmol.js`** — mármol generado en shader (fbm deformado + vetas), fluye y se deja empujar con el cursor
  (textura de flujo 256² en ping-pong). Pensado para Contacto / portadas de capítulo.
- **D · `detalles.js`** — cursor con etiqueta, botón con imán, letras que ruedan, tarjetas que se inclinan, cinta de
  texto gigante ligada al scroll y sonido opcional (WebAudio sintetizado, apagado por defecto).
Revisado en Chrome a 1440 en claro y oscuro, sin errores de consola. **NO revisado en celular** (la ventana de la
extensión no se dejó achicar). Lo que no elija se borra con todo y la carpeta.
**Respuesta de Zahir (11-nov): le gustan A y C.** B y D quedaron sin elegir (no borrados aún).

### Propuesta 2 (11-nov) — `http://localhost:5173/tools/lab/dos.html`, ESPERANDO RESPUESTA
Pidió revisar a fondo 4 sitios y otra propuesta. Lo que hace cada uno (visto con scroll real):
- **madetodisrupt.com** — la "escalera" de servicios es CSS 3D puro (`.ss3d-ring`): cada tarjeta a 95° y ~176px más
  abajo que la anterior; el scroll gira y sube la hélice. El hero son tarjetas flotando en un canvas.
- **errormade.tech/?view=gallery** — un canvas a pantalla completa redibuja las imágenes; los bordes de arriba y
  abajo las doblan como vidrio curvo.
- **adamperlis.com** (Astro) — "Buddy": gota de cromo líquido con ojos (canvas 560²). Aparece al inicio de cada
  sección, dice UNA línea con humor que se lee palabra por palabra, se guarda en la barra, cambia de atuendo al
  tocarlo, tiene voz y se despide al final. Lo que le voló la cabeza a Zahir: el avatar que acompaña.
- **premotio.com** — un solo `<canvas class="story-scene">` fijo durante 37,000px: las MISMAS tarjetas se
  reacomodan por capítulo (nube → anillo → muro → cinta → rollo → abanico). "Le encantó todo".
Idea común: pocas cosas que nunca se van y se transforman. Propuesta = **un escenario, un elenco y un guía**:
- **Escenario** = el mármol (C) como fondo fijo de todo el sitio (`crearMarmol(zona, { global: true, fuerza })`).
- **E · Hélice de Servicios** (`dos.jsx`, React): las 7 `Escena` REALES de `ServiciosEscenas.jsx` en espiral CSS 3D
  (95° y 0.3·vh por tarjeta); índice y ficha se quedan. La activa se re-monta para que entren sus renglones.
- **F · Lente** (`lente.js`): casillas vacías en el DOM + un canvas fijo que dibuja cada imagen en su lugar; cerca de
  los bordes se enrolla sobre un "tambor" y con la velocidad del scroll el centro se atrasa.
- **G · Kai** (`kai.js`): el guía. NO es la gota de Buddy: es una PIEDRA en bruto con ojos (esfera recortada contra
  ~19 planos) que se pule con el avance hasta quedar mármol con veta (el shader del fondo, horneado a textura).
  Cada capítulo le reserva un hueco `.kai-lugar[data-kai="frase"]`; sin hueco a la vista espera abajo a la derecha.
  Mira al cursor, parpadea, brinca al hablar; al tocarlo dice una ocurrencia. Frases = BORRADOR para Zahir y Karime.
  Gotcha: blanco puro + barniz quemaba la veta → color tope `#f1eee7`, clearcoat 0.65, luz 0.95.
- La página termina con el recorrido completo del sitio (qué cambia y qué se queda por capítulo).
Revisado en Chrome a 1440, claro y oscuro, sin errores. No revisado en celular. `dos.jsx` monta una sola vez: ante
un cambio en caliente recarga la página sola.

### Propuesta 3 (11-nov) — `http://localhost:5173/tools/lab/tres.html`, ESPERANDO RESPUESTA
**Respuesta de Zahir a la Propuesta 2** (reglas de dirección, valen para todo lo que siga):
- El mármol le gusta **pero NO como fondo de todo el sitio**. El sitio sigue **futurista y minimalista, estilo Apple**
  (fondo limpio). El mármol queda como acento en UN lugar.
- Sintió que solo se usaban 2 de las 4 referencias → cada una debe tener un efecto visible y su lugar.
- Kai (el guía) sí, pero **con un estilo que vaya con el sitio**: la piedra→mármol quedó DESCARTADA.
- Partículas y cinta le gustan; quiere **potenciarlas**, no cambiarlas.
Lo armado (todo en `tools/lab/`, `src/` sin tocar; `helice.jsx` se separó de `dos.jsx` para compartirla):
- **`cromo.js`** — `TONOS` de la cinta + `entornoEstudio(renderer, { frente, relleno })`: entorno propio de cajas de
  luz largas (foto de producto) en vez de `RoomEnvironment`. Lo usan la cinta, Kai y debería usarlo el teléfono 3D.
- **H · `apertura.js`** (capítulo 01) con comparador "Hoy / Potenciada":
  `crearParticulas` = ΚΛΙΖΣΝ con profundidad (capas, bokeh, paralaje con el cursor), tacto (estela de 10 huellas que
  aparta los puntos; el empuje va TOPADO, si no el cursor quieto abría un hoyo enorme) y destellos.
  `crearCinta` = misma serpiente del hero pero con malla propia: sección elíptica que se aplana y se RETUERCE
  (listón), entorno de estudio y `scene.environmentRotation` ligado a tiempo + scroll (la luz la recorre).
- **E · hélice** (Disrupt) igual que en la Propuesta 2, sobre fondo limpio.
- **I · `elenco.js`** (Premotio + Errormade; iría en Demos): un canvas fijo, las 6 demos como planos que se mezclan
  entre 4 formaciones f(scroll) — nube → anillo (dice el giro de la que queda al frente) → abanico → muro — con el
  "tambor" de la lente en el shader de vértices (al entrar/salir de pantalla se enrollan) y atraso + separación de
  color con la velocidad. Tramos quietos en la constante `T`. Por detrás se ve la misma captura, apagada.
- **G · `kai2.js`** — Kai v2: nube de PARTÍCULAS alrededor de una cuenta de cromo que, con el avance, se vuelve una
  PERLA del cromo de la cinta con un ARO (tramo de cinta que lo orbita; botón para quitarlo). Cara = visor de vidrio
  negro (pintado en la textura; el barniz se baja ahí con `clearcoatMap`) + dos ojos de luz en píldora. Al cambiar de
  capítulo se deshace, viaja y se arma. Gotchas: giros de cabeza cortos (pasado ~35° el visor refleja las luces y
  se pierde un ojo); entorno sin luz de frente (se reflejaba como un cuadro en el visor).
- **C · mármol** solo en Contacto: una losa con esquinas redondeadas (`crearMarmol` sin `global`).
Revisado en Chrome a 1440, claro y oscuro, sin errores al cargar. **No revisado en celular.** Decisiones abiertas:
qué entra, Kai con o sin aro, tono de las frases (borrador). B, D, la piedra (`kai.js`) y `dos.*` siguen sin borrar.

### INTEGRACIÓN AL SITIO REAL (11-nov, EN CURSO, sin commit) — Zahir: "me encantó todo, vamos con eso, poténcialo al mil"
Aprobó la Propuesta 3 completa. Lo único que pidió pulir fue **el elenco** (mandó captura del anillo) → rehecho (v2).
También pidió que Kai tenga VOZ (como el Buddy de Adam Perlis; sugirió ElevenLabs).
**Ya en `src/` (verificado en Chrome a 1440, oscuro; falta claro completo, inglés y CELULAR):**
- `src/lib/cromo.js` — tonos del cromo + `entornoEstudio()` (cajas de luz). Lo usan cinta y Kai.
- **Cinta = LISTÓN** (`heroRibbon.js`): malla propia (SEG×RAD, sin TubeGeometry ni esferas en las puntas), sección
  elíptica que se retuerce, entorno de estudio, `scene.environmentRotation` con tiempo + scroll. `ANCHO = 1.15` (con
  1.5 tapaba demasiado titular). En el telón `liston → 0` (vuelve redonda: tapa la pantalla igual que antes).
- **Partículas** (`nube.js`): atributos `aCapa`/`aSeed` + uniforms `uTime/uFx/uPar/uEstela`: profundidad con bokeh y
  paralaje, tacto (estela de 10 huellas, empuje topado) y destellos. `uFx` se apaga camino a la cinta. Sin cursor
  (táctil) no hay tacto ni paralaje. Las semillas nuevas salen de OTRO generador (no cambian las figuras de hoy).
- **KAI** — `src/lib/kai.js` + `components/Kai.jsx` + `styles/Kai.css` + `src/data/kai.js` (frases {es,en} por "Nº" de
  capítulo y ocurrencias; **BORRADOR**, las deciden Zahir y Karime). `SectionHead` trae `.kai-lugar[data-kai=Nº]`
  (absoluto, en el aire sobre la cabecera: no mueve el layout; `.sh` ahora es `position: relative`). Sin lugar a la
  vista se guarda arriba del botón de WhatsApp; en celular nunca deja la esquina y habla 5 s al cambiar de capítulo.
  Nace al entrar Servicios; se forma de 0 a 1 entre el primer y el último capítulo. Botones de texto en el globo:
  "Callar" (se guarda en `kai-callado`; tocarlo lo despierta) y voz.
  **VOZ:** audios pregrabados, `public/kai/<es|en>/<llave>.mp3` + índice `public/kai/voz.json`; sin índice no hay
  botón de voz. Apagada por defecto (`kai-voz`). Los ojos laten con el volumen real (AnalyserNode). Se graban con
  `ELEVENLABS_API_KEY=… KAI_VOZ=<voice id> node tools/kai/voz.mjs` (lo corre Zahir; AÚN NO SE HA CORRIDO → hoy Kai
  solo escribe). Si cambia una frase: `--todo` o borrar su mp3.
- **ELENCO v2** — `src/lib/elenco.js` (copia pulida de `tools/lab/elenco.js`) dentro de `Demos.jsx` (`<Elenco>`), en
  lugar de la rejilla de tarjetas, SOLO con `(min-width: 900px) and (pointer: fine)`, sin reduced-motion y con
  WebGL; si no, queda la rejilla de siempre. Formaciones: nube (con foco: desenfoque por mipmaps) → anillo sobre
  piso con reflejo (grupo espejo con scale.y −1), avanza giro por giro → abanico → FILA con nombre debajo, tocable
  (se levanta, apaga las demás, abre el mismo WhatsApp de "Pedir acceso"). Textos {es,en} en `FORMACIONES` y
  `titulo`/`que` de `GIROS` (`que` = BORRADOR leyendo las capturas: confirmar). Enlaces reales en `.el-accesible`.
  Pista de 640vh; tramos en `T`. Texturas SIN colorSpace (con sRGB salían oscuras).
- **HÉLICE en Servicios** (`Servicios.jsx` → `Helice`, CSS 3D): las 7 `Escena` en espiral dentro de la 3ª columna
  (`.srv-forma`); índice y ficha intactos. `PASO = 78°` + `backface-visibility: hidden` (con 95° las vecinas se
  veían con el texto en espejo), `RADIO = 170px` (columna angosta). La que se va (arriba-izquierda, hacia la ficha)
  se apaga rápido. Mismo ritmo del texto (gira en el último 38% del tramo). En celular sigue la escena dentro de la
  ficha (sin hélice).
- **LOSA DE MÁRMOL en Contacto** (`Footer.jsx` → `Losa` + `src/lib/marmol.js`): solo la cabecera (SectionHead Nº 09)
  va sobre el mármol vivo; el formulario queda abajo en limpio. Sin WebGL queda un degradado. Único mármol del sitio.
Revisado en Chrome a 1440: oscuro, claro e inglés (hero, Servicios, Demos, Contacto, Kai), sin errores de consola.
**NO revisado: CELULAR** (la ventana de la extensión no se deja achicar) ni Safari.
**FALTA / por decidir con Zahir:**
- ~~Teléfono 3D (A)~~ → HECHO como Zahir eligió ("en los 3 pasos"): `src/lib/telefono.js` + `Demos.jsx` (`Motion`).
  El teléfono de cromo sustituye al de CSS en escritorio con WebGL (`.dm-stage--3d`; el de CSS queda de respaldo y
  en celular). Su pantalla es un lienzo 2D que pinta lo mismo según el scroll (nombre que se escribe → boceto →
  demo real que barre → "Pedido nuevo"); da UNA vuelta mientras "lo armamos" y gira hacia el pase al final.
- **Lente en Proyectos:** en escritorio los mockups de Proyectos flotan con el cursor (no pasan por las orillas), así
  que la lente ahí casi no tendría qué doblar; hoy vive en el elenco (entrada y salida). No se integró.
- **VOZ DE KAI GRABADA (11-nov):** 24 audios en `public/kai/{es,en}/` + `voz.json` (1 MB en total), voz "Brian -
  Social Media". Zahir generó en la web de ElevenLabs un audio por idioma con las 12 frases de corrido; los
  `<break>` NO hicieron pausa (todas < 0.5 s), así que se cortó con la TRANSCRIPCIÓN con tiempos por palabra de
  ElevenLabs (`POST /v1/speech-to-text`, `scribe_v1`): coincidió 117/117 y 123/123 palabras con `src/data/kai.js`.
  Márgenes: hasta 0.10 s antes y 0.22 s después, con fundido. Si cambia una frase: regenerar y volver a cortar así
  (los originales quedaron en ~/Downloads, `ElevenLabs_2026-11-11T17_20_29…` = es, `…17_21_45…` = en).
  Probado: el botón "Escuchar a Kai" aparece y pide `/kai/es/02.mp3`. Pendiente que Zahir escuche los cortes.
- (historial) Voz de Kai, intento por API: la llave de ElevenLabs de Zahir está en el llavero (`security
  find-generic-password -s ElevenLabs -w`). Su cuenta es GRATUITA (10,000 caracteres/mes): por API solo deja las
  voces "premade"; las de biblioteca (Isaac es-MX, "Kai" en) piden plan de pago (402). Se grabaron 4 muestras de la
  frase 02 (Will, Liam, Callum, Jessica) para que elija; falta su respuesta y correr
  `ELEVENLABS_API_KEY=$(security find-generic-password -s ElevenLabs -w) KAI_VOZ=<id> node tools/kai/voz.mjs`.
  Ids: Will bIHbv24MWmeRgasZH58o · Liam TX3LPaxmHKxFdv7VOQHJ · Callum N2lVS1w4EtoT3dr4eOWO · Jessica cgSgspJ2msm6clMCkdW9.
  **Plan actual (idea de Zahir):** él genera en la WEB de ElevenLabs UN audio por idioma con las 12 frases de corrido
  (voz elegida: "Brian - Social Media", `U9TSK9KHMlMU2qkeXlQP`; modelo Multilingual v2; frases separadas por
  `<break time="2.0s" />`, en el orden de `src/data/kai.js`: 02…09, toque-1…4) y Claude lo corta con ffmpeg
  (`silencedetect`) en `public/kai/<idioma>/<llave>.mp3` y escribe `public/kai/voz.json`. Ojo: plan gratuito =
  revisar licencia comercial.
- **Frases de Kai v2 APROBADAS por Zahir (11-nov)** — ya en `src/data/kai.js`. Faltan confirmar los `que` de las demos.
- **Testimonio en video de Carlos (Tito), 11-nov:** `public/testimonios/tito-testimonio.mp4` (44 s, 576×1024, crf 24,
  faststart, 3.7 MB) + `tito-poster.jpg`, sacados de `~/Downloads/WhatsApp Video 2026-11-10 at 17.24.51.mp4`. Su
  tarjeta pasó de cita a video (`quote: null`; la cita escrita anterior se quitó, quedó anotada en el código). El
  texto junto al video ahora es por testimonio (`voz`). Los 2 errores de lint de Testimonios.jsx ya estaban.
- Antes del commit: `/codex:review`; revisar celular; borrar de `tools/lab` lo descartado (B, D, piedra, `dos.*`).
- `Footer.jsx` ya traía un error de lint (`React` sin usar): no es de esta tanda.
Contextos WebGL vivos: nube, cinta ×2, vidrio líquido, Kai, elenco, mármol: cuidar el tope en iOS.

### Segunda tanda de cambios de Zahir (11-nov, tarde) — hecha en local, sin commit
Pidió: logo y Kai desde la pantalla de carga · ΚΛΙΖΣΝ más legible · que no asome "la cinta vieja" al formarse ·
que la cinta no dé saltos · telón que no "salte de la nada" · Kai con más peso (no solo acompañar) · quitar el hilo.
- **Saltos de la cinta = `computeFrenetFrames`** (elige su normal inicial por la componente más chica de la primera
  tangente; al cambiar, toda la cinta giraba de golpe). Ahora `heroRibbon.js` saca el marco de cada anillo de una
  referencia fija (eje Z): U = ancho dentro de la pantalla, V = canto hacia la cámara. Normales ANALÍTICAS de la
  elipse (ya no `computeVertexNormals` por cuadro) y `getPoint` uniforme. NO volver a `computeFrenetFrames`.
- **Partículas → listón:** `cinta.pts[i*3+2]` ya no es el radio del tubo viejo sino el medio ancho QUE SE VE del
  listón retorcido en ese punto (`giroEn(s)` compartido): las partículas arman el listón, no un tubo.
- **ΚΛΙΖΣΝ más legible:** profundidad de las partículas a la mitad (tamaño, alfa, bokeh y paralaje) en `nube.js`.
- **Telón rehecho:** se prepara en el último 10% del escenario del hero (mientras el titular se va): τ = ese tramo
  (0→0.2) + p. Estira a banda (τ 0→0.24), deja de retorcerse (0.06→0.32), ensancha (0.14→0.46, sigue tapando antes
  de que asome Servicios), sube (p 0.5→0.9); todo con `suave5`. Al tapar la sección es un óvalo (canto 0.55) y el
  material pasa a SATINADO (`satin`: roughness +0.24, clearcoatRoughness +0.34) para reflejos anchos.
- **HILO QUITADO** (`<Hilo />` fuera de App; `Hilo.jsx`/`Hilo.css`/`hiloPuente.js` quedan sin montar). La Κ del
  cierre se arma del polvo. Nosotros: la ranura central de 9rem pasó a un hueco normal. Los números de Proceso ya
  no se "encienden" (era CSS del hilo).
- **KAI CON MÁS PESO:** lienzo 176 px (antes 132); nace con la página. Pantalla de carga (`index.html`): ΚΛΙΖΣΝ
  que se dibuja + un Kai de CSS encaramado en su esquina + riel. Paradas nuevas (`.kai-lugar` sin número):
  hero encaramado en la Ν de ΚΛΙΖΣΝ (`--marca`) y junto a los botones (`--botones`), que Hero.jsx enciende con
  `display` según p; Servicios junto a la hélice (`--escena`, `data-kai="srv-<forma>"`, talla 0.72) con UNA LÍNEA
  POR SERVICIO (`KAI_SERVICIOS` en `src/data/kai.js`: BORRADOR, sin voz grabada → solo texto). Cabeceras: Kai va a
  la DERECHA del titular y su globo DEBAJO (`kai--abajo`; de lado tapaba titulares largos). FAQ: arriba de su
  columna. Reglas de "a la vista": capítulo = top entre 76 px y 70% del alto; parada = que quepa en pantalla.
  Lo formado sale solo de los lugares de capítulo (`CAPITULO = /^\d+$/`).
Revisado en Chrome a 1440×614, tema claro. Falta: oscuro de esta tanda, celular, y que Zahir confirme en movimiento
que la cinta ya no salta.

### Tercera tanda (11-nov, tarde) — hecha en local, sin commit
- **Pantalla de carga que SÍ espera** (`src/lib/carga.js`): piezas `nube · cinta · fuentes · kai · resto · medios`
  + MÍNIMO 2.6 s en pantalla + tope 9 s. `precargar()` (main.jsx) pide y DECODIFICA capturas de demos, portadas de
  video y logos, e importa elenco/teléfono (solo escritorio) y mármol. `Resto.jsx` y `Kai.jsx` avisan con
  `cargado()`. Al cerrar pone `html.cargado`: el Kai de verdad espera esa clase (antes se veía encima de la carga).
  El logo se dibuja UNA vez, letra por letra (ya no en bucle). ⚠️ Pieza nueva que no avise = 9 s de espera.
- **Scroll en pausa mientras Kai habla** (`src/lib/bloqueoScroll.js`, lo llama `Kai.jsx` en `hablar`): ignora
  rueda/dedo/teclas en captura (sin tocar overflow ni `lenis.stop()`), corta la inercia con
  `window.__lenis.scrollTo(scrollY, { immediate })`. Con voz: hasta `ended` (tope 9 s); sin voz: lo que tarda en
  leerse (0.25 + 0.075·palabras + 0.9 s). No frena con las ocurrencias (`toque-*`) ni con modal; "Callar" lo suelta.
  Probado: 5 golpes de rueda hablando = 0 px; después, normal.
- **Servicios: la hélice ahora manda.** Columnas 0.62 / 0.9 / 1.38 (antes 0.8 / 1.05 / 0.85), radio
  `min(300, 19vw)`, PASO 95°, vecinas visibles (opacidad mínima 0.2, sin esconder las de espaldas) y el cursor
  inclina la espiral: es la versión del laboratorio que Zahir aprobó. Índice y ficha con letra un poco menor.

### Revisión de Codex antes de subir (11-nov) — 4 hallazgos, los 4 reales y corregidos
1. En celular los `.kai-lugar` iban con `display:none` → medían 0 y Kai nunca decía la línea del capítulo. Ahora
   van con `visibility:hidden` (siguen midiéndose); solo las paradas (marca, botones, escena) se quitan.
2. El freno de teclas (`bloqueoScroll.js`) también se comía espacios/flechas en el formulario y en botones → ahora
   ignora inputs, textarea, select, botones, links y contenteditable.
3. Elenco: el clic global abría WhatsApp con la última tarjeta señalada aunque el clic fuera en otra cosa → ahora
   exige que el clic caiga sobre la tarjeta y no en un control; fuera de pantalla `sobre = -1`.
4. La losa de mármol se animaba aun con `prefers-reduced-motion` → ahora no se crea (queda el degradado).
`tools/lab/` NO se subió: está ignorado solo en esta Mac (`.git/info/exclude`).

## Rendimiento al cargar (8-nov-2026)
Zahir: "en teléfonos se traba el hero" / "tarda demasiado en cargar". Medido con la build servida (`vite preview`) y
`long-animation-frame` en Chrome; resultado en la Mac: primer pintado 0.06 s, 3D listo 0.20 s (antes 0.37), se puede
deslizar a 2.1 s (antes 3.2), sin cuadros largos durante la intro.
- **Pantalla de carga** `#carga` (inline en index.html, Κ que se dibuja + riel) → `src/lib/carga.js` la quita cuando
  `nube`, `cinta` y `fuentes` avisan (`cargado()`, deja `performance.mark('carga:…')` para medir); tope 9 s. El reloj
  de la intro de la nube (`INTRO`, ahora 0.6/1.5/2.0 s) arranca al quitarse. three.js se pide desde main.jsx.
- **Shaders precompilados** (`renderer.compile`) en nube y cinta: antes la cinta compilaba al nacer, a media apertura.
- **Canvas estables en celular** (`src/lib/viewport.js`): miden 100lvh y solo se redimensionan si cambia el ancho o
  ese alto; la barra del navegador que sube/baja al deslizar re-alocaba los 3 lienzos (el tirón del hero). Cinta en
  celular: DPR 1.25, menos segmentos, sin clearcoat. La frase de apertura sin `blur` animado en táctil.
- **Carga en dos partes**: todo lo de debajo de Servicios va en `Resto.jsx` (React.lazy; Servicios se queda porque la
  cinta sale rumbo a su título). OJO: lo que busque elementos de Resto al montar debe buscarlos tarde (el Hilo busca
  `.interludio--k` en cada cuadro hasta encontrarla — Codex lo cachó: la Κ final no se armaba).
- **Hilo** se arma después de la intro y en un momento libre (`requestIdleCallback`): medir la página son ~150 ms.
- **Fuentes de Google sin bloquear** (`media="print"` + onload); main.jsx espera la hoja y luego las caras del hero.

## Stack y despliegue
- **React 19 + Vite 8**, Framer Motion, lucide-react.
- **Dominio: `kaizenstudiomx.com`** (comprado en Cloudflare Registrar el 2026-10-05, renueva sola ~$10.46/año) +
  `www`. Conectado como Custom domain al MISMO proyecto de Pages `zahirportafolio` (CNAME `@` y `www` →
  `zahirportafolio.pages.dev`, proxied). og:url/og:image/twitter:image ya apuntan a él.
  **Redirección 301** en `functions/_middleware.js` (Pages Functions): `zahirportafolio.pages.dev` y
  `www.kaizenstudiomx.com` → `kaizenstudiomx.com` (conserva ruta y query; las previews `<hash>.…pages.dev` no
  se redirigen).
- **Despliegue:** Cloudflare Pages. **`git push` a `main` auto-despliega.** Repo `github.com/zahirdanielvidahurrazaga/Portafolio`.
- **Build:** `npx vite build` (rápido, <1s). **Dev:** `npm run dev -- --host` (para probar en iPhone en la IP de red; OJO la IP cambia, verla en el log de vite).
- **REGLA DE TRABAJO:** trabajar en LOCAL; desplegar (push) hasta el final / cuando el usuario lo aprueba. Verificar con `npx vite build` tras cada cambio.
- **Supabase:** el cliente quedó como stub (no se usa; el form de contacto ahora va por WhatsApp). `@supabase/supabase-js` sigue en deps pero sin uso.

## Arquitectura
- **`src/data/projects.js`** = catálogo central. Exporta `projects` = curaduría `VISIBLES` (hoy `['befit','pos','boda']`) mapeada desde `allProjects`. Para mostrar otro (carperfit/dental/santuario archivados), agregar su id a `VISIBLES`. Cada proyecto: `slides`, `website`, `platforms`, `heroImage`, `result` (outcome de negocio), `tagline`, `walkthrough` = funciones `{ role?, device?('phone'|'desktop'), icon, title, desc, image }`.
- **Orden de la página (`App.jsx`) — REORDENADO 2026-08-04 para conversión:** Hero → Servicios → **Testimonios** → PortafolioShowcase (Proyectos) → **SobreMi** → ProcesoTrabajo → Faq → Footer. Sigue las preguntas del cliente en el orden en que se las hace: ¿qué hace? → **¿le creo?** → ¿ya lo hizo? → ¿quién es? → ¿cómo trabajamos? → dudas → contacto.
  - **Por qué:** medido con playwright, el video de cliente empezaba en la **pantalla 6.5 de móvil (51% del scroll)** y casi nadie llegaba. Ahora empieza en la **pantalla 1.9 (15%)**. `SobreMi` bajó al 54%: la bio contesta una pregunta que el visitante frío todavía no se hace, y ocupaba la pantalla más cara del sitio. (Revierte la decisión vieja de "primero quién soy"; el usuario aprobó el cambio con los números enfrente.)
  - **El orden del navbar (`Navbar.jsx`, escritorio Y menú móvil) debe seguir al de la página** — se actualizaron los dos.
  - En `Testimonios.jsx`, **el testimonio con video va PRIMERO en el arreglo**: en móvil las tarjetas se apilan y el orden del arreglo decide qué se ve antes.

## Componentes clave
- **`Hero.jsx`** — titular estrella "Software a tu medida: que se adapte a ti, **no tú a él.**" + franja de prueba (`.hero-proof`: App Store/Play · en producción · proyectos reales) + 2 CTAs. Glows azul/morado viajeros por CSS. En móvil: anclado arriba (no centrado) con más aire.
- **`SobreMi.jsx`** — "Quién soy": foto (4:5) + bio corta + CTA "Trabajemos juntos". Foto en `public/sobre-mi.jpg`.
- **BILINGÜE ES / EN (2026-10-05):** botón `LangToggle` junto al sol/luna (barra y páginas legales). `src/lib/LangContext.jsx`
  (`useLang()` → `{ lang, setLang, t }`): elección guardada en localStorage `idioma`; sin elección, inglés si el
  navegador está en inglés. Los textos van como `{ es, en }` JUNTO a donde se usan (no en diccionario aparte) y se
  leen con `t(...)` (acepta texto o JSX). Proyectos: capa `EN` + `localizar(p, lang)` al final de projects.js (solo
  los VISIBLES). Testimonios: el traductor se llama `tr` (ahí `t` es el testimonio); la cita de Carlos en inglés dice
  "Translated from Spanish". Legales en inglés = traducción de cortesía (lo dice: rige el español). El mensaje de
  WhatsApp sale en el idioma del sitio. NO se usó el widget de Google Translate (rompe las animaciones por palabra).
  ⚠️ Al agregar texto nuevo visible: SIEMPRE `{ es, en }`. Metas/OG siguen en español (un solo URL).
- **OFERTA NUEVA = 7 LÍNEAS (catálogo "KaiZen Servicios", 2026-10-05, su PDF en Downloads):** Brand, Social
  (community management, NUEVO), Launch, Web, Commerce (tienda + POS), Automate, Experience (apps: reservaciones
  con lista de espera y pagos, Wallet, álbum, invitaciones). **SIN PRECIOS en el sitio** (decisión suya; se cotiza
  por WhatsApp). Adaptado en TODO el sitio: índice de Servicios (figuras nuevas `pluma`, `social`, `cohete`; se
  borraron `ticket` y `qr`), cabecera del hero "Marca · Redes · Web · Apps", tipos del formulario, FAQ (redes,
  publicidad pagada no incluida, cuentas de Apple/Google a nombre del cliente, tiempos por tipo), mitad I de
  Nosotros ("Estrategia, marca y redes"), lede de Proceso (los ~2 meses son "en un proyecto de software"), metas
  e imagen al compartir (`og-image-v4.jpg`).
- **Páginas legales** `/aviso-de-privacidad` y `/terminos` (`Legal.jsx`, main.jsx elige por la ruta; Pages sirve
  index.html en cualquier ruta). Redactadas DESDE CERO (pidió no copiar los puntos de su PDF) para cómo funciona el
  sitio: formulario → WhatsApp, sin base de datos ni cookies de rastreo. Responsables: Karime Pérez Cruz y Zahir
  Daniel Vidahurrázaga Marín (personas físicas). Datos en `src/data/contacto.js`: correo info@kaizenstudiomx.com,
  domicilio Segundo Andador de los Padres No. 1, Col. La Hacienda, C.P. 72570, Puebla, Puebla. La pantalla de carga solo corre en la portada (index.html).
  Recomendado: que un abogado las revise.
- **`Servicios.jsx`** (id `#about`, "Servicios") — **"ÍNDICE + NUBE" (2026-10-05)**. Reemplazó al carrusel de cápsulas
  (`FactorMecatronico.jsx`, borrado; su historia y las lecciones del marquee están en git) porque se veía "plantilla"
  junto al hero. Escena fija (`.srv-pista` = 100vh + 6×72vh; 6×60 en móvil): a la izquierda un ÍNDICE de revista
  (Nº + nombre grande; el activo se enciende en itálica y abre su descripción con grid 0fr→1fr); a la derecha la
  nube en modo **`secuencia`** (`data-nube="telefono,navegador,carrito,ticket,ia,qr"`): se arma al entrar, se
  TRANSFORMA de figura en figura SIN explotar (morph en el último 38% de cada tramo) y explota al soltarse.
  El texto cambia a la mitad del morph (`u + 0.19`). Clic en un servicio = scroll a su tramo. Reduced-motion:
  lista estática. Las figuras se dibujan en `FORMAS` de nube.js (canvas 2D).
  - ⚠️ `muestrear()` ordena los puntos por ÁNGULO alrededor del centro y la partícula i usa la fracción i/N
    (`floor(i*M/N)`): así al morfear cada partícula va a la parte equivalente de la siguiente figura. Con puntos
    barajados a la mitad del morph todo se volvía una bola.
  - Entrada/salida sin "polvo regado": alfa del armado ∝ a², y al explotar se apaga con (1−e)².
  - El `<SectionHead>` conserva la clase `factor-header`: la cinta del hero sale rumbo a `#about .factor-header`.
- **SERVICIOS v2 "Índice · Ficha · Nube" (2026-11-06, sin desplegar)** — reemplaza lo de arriba. Zahir: "no me
  gusta del todo" + "que VENDA". Tres columnas en la escena fija (60vh por servicio): índice con los 7 servicios
  agrupados en 3 NECESIDADES (Que te conozcan · Que te compren · Que funcione solo), FICHA (gancho = resultado con
  `<em>`, descripción, 3 entregables, botón **"Cotizar X"** y **"Ver caso real"** si hay proyecto VISIBLE que lo
  respalde: POS→Tito, Apps→Be Fit Lab) y la nube. "Cotizar" dispara `kaizen:cotizar` {tipo} → Footer preselecciona
  el `<select>`; "Ver caso" dispara `kaizen:proyecto` {id} → PortafolioShowcase abre el modal. Pantallas bajas
  esconden la descripción. Móvil: figura chica + fila de números 01–07 + ficha.
  **SIN ÍCONOS (6-nov):** se probaron partículas y luego trazo cromado; Zahir: "no quiero íconos". La columna
  derecha es una **ESCENA DEL RESULTADO** (`ServiciosEscenas.jsx` + css): mini pantalla en código, mármol, sigue
  al tema, con lo que el cliente VA A VER (manual de marca "Aurora", post programado, checklist "Listo para abrir",
  su resultado en Google + WhatsApp, "Nueva venta $1,250" + gráfica, chat del asistente, reserva + pase). Los
  renglones entran en cascada al cambiar de servicio y hay un punto vivo que late. Nombres/montos = de ejemplo de
  maqueta (no son cifras de clientes). Sin emoji (tienen color). **Móvil:** la escena va DENTRO de la ficha
  (`.srv-ficha-escena`, copia que en escritorio se oculta), con `zoom` 0.82/0.72/0.62 según el alto, sin párrafo
  y con los entregables en UNA línea separados por "·" (::after, para que el punto no quede al inicio del renglón).
  La nube ya no tiene estación en Servicios (sin `data-nube`).
  ⚠️ NO usar `forceContextLoss()`/`loseContext()` en los destroy de WebGL: el canvas es el mismo al re-montar
  (StrictMode, cambio de tema, HMR) y quedaba muerto — la barra liquid glass salió rota. Se revirtió.
- **EL HILO (`Hilo.jsx` + `styles/Hilo.css`, 2026-11-06, sin desplegar)** — lo que conecta la web tras el telón.
  SVG del alto del documento (z −1, coordenadas de PÁGINA) que se DIBUJA con el scroll: la punta va al 62% de la
  pantalla. Ruta en ÁNGULOS RECTOS con esquinas redondeadas (la curva libre Catmull-Rom cruzaba el texto): entra por
  la derecha en Testimonios, baja por los márgenes y cruza de lado SOLO en la frontera entre secciones; en Proceso
  baja en ESCALERA entre número y título (medida desde el `h3`, porque `.process-num` ocupa toda su columna) y cada
  paso se enciende (`.hilo-on`) cuando llega la punta; termina dentro de la Κ del "¿Empezamos?". Medición con
  offsetTop (no getBoundingClientRect: las filas entran con translateY). Tokens `--hilo-cuerpo/--hilo-brillo`.
  **BarraScroll** muestra el capítulo ("06 PROCESO") junto al pulgar SOLO mientras hay scroll (quieto se encimaba
  con el texto de la derecha).
- **TESTIMONIOS = "CASOS" (2026-11-06, sin desplegar)** — reemplaza "LECTURA" (2,611 px → 1,111). Una tarjeta por
  cliente, lado a lado: voz del cliente (video con vista previa muda que se monta al aparecer + lightbox con sonido,
  o cita que se lee palabra por palabra al entrar), autor, **"Qué cambió"** (`cambio` en el arreglo, sacado del
  `result` REAL de su proyecto — no inventar) y **"Ver el proyecto"** (`proyecto` id → evento `kaizen:proyecto`).
  Con >2 clientes la fila se vuelve carrusel con snap (`.casos--carrusel`). Móvil: apiladas, video recortado a 4:5.
- **PROYECTOS = ÍNDICE (2026-11-06, sin desplegar)** — reemplaza las filas alternadas de pantalla completa (no
  escalaban: vienen Natural sitio+sistema y otro). Renglones tipográficos grandes (Nº, nombre, tagline, categoría,
  plataformas, flecha); con mouse el resto se apaga, el activo pasa a itálica y su MOCKUP FLOTA SIGUIENDO AL CURSOR
  (`Flotante`, useSpring, fijo z 40). Sin mouse / <900px: el mockup va dentro del renglón. Clic = modal. El reel de
  la laptop sigue igual arriba (es lo que hace que la sección mida ~6,000 px; la lista son ~575).
  Para sumar un proyecto: entrada en `allProjects` + su id en `VISIBLES` + mockups en `public/mockups/`.
- **NOSOTROS = "DOS MITADES, UN HILO" (2026-11-06, sin desplegar)** — se QUITÓ la escena de partículas (lápiz y
  `</>` → teléfono; Zahir no quiere íconos). Flujo normal (2,845 → 1,880 px): bio → kicker "Marca + tecnología, un
  solo equipo" → dos columnas (I Estrategia, marca y redes / II Tecnología) con sus servicios en píldoras y una
  RANURA central de 9rem por donde baja EL HILO (las une) → frase "De una idea a las manos de tus clientes." →
  Misión·Visión·Valores → CTA. El hilo cruza a lo ancho en el hueco bajo el kicker (margin-bottom 4rem). La forma
  `mitades` de nube.js ya no se usa. Móvil: apiladas, hilo por el margen.
- **FAQ en DOS COLUMNAS (2026-11-06, sin desplegar)** — izquierda fija (sticky) con la cabecera + "¿Tu duda no está
  aquí? → Pregúntanos por WhatsApp" (mensaje armado) + "Te respondemos en menos de 24 horas"; derecha, preguntas
  numeradas 01–07. Móvil: `.faq-lado {display: contents}` para poner la salida a WhatsApp DESPUÉS de las preguntas.
- **CIERRE: EL HILO ESTALLA Y ARMA LA Κ (2026-11-06, idea de Zahir, sin desplegar)** — `src/lib/hiloPuente.js`
  (mismo patrón que cintaPuente): Hilo.jsx publica en cada scroll su TRAMO FINAL (1.2 pantallas) en px de pantalla
  y `estallido` (0→1, progreso de `.interludio--k`: q −0.2→0.14). El hilo se CONSUME desde la punta
  (`largo − tramo·min(1, est/SUELTA)`) y la punta se oculta. En nube.js, la estación con `data-nube-origen="hilo"`
  (prop `origen` de Interludio, App la pone en la Κ) usa `hilo.estallido` como armado y cada partícula nace en su
  punto del tramo (`cs[i]`), se suelta cuando el consumo la alcanza (`suelta(s) = (1−s)·0.6`), sale disparada
  hacia afuera (`boom`, dirección `cang[i]`) y la jala la Κ. Antes de soltarse es invisible (es parte del hilo).
  Ligado al scroll: al subir, el hilo se vuelve a formar. Editar nube.js = recargar la página.
- **DEMOS = "PRUÉBALO ANTES DE TENERLO" (2026-11-06, capítulo Nº 04 nuevo, sin desplegar)** — decisión de Zahir y
  Karime: demos por giro gratis para todos + "con tu marca" gratis tras 15 min + funciones nuevas = proyecto pagado.
  El sitio de demos SIGUE con candado (13-oct, salió en TikTok): las tarjetas piden acceso por WhatsApp con el giro
  escrito y ellos mandan código de 7 días (`accesos.mjs nuevo` en ~/Developer/demos). Capturas reales en
  `public/demos/*.webp` (playwright con el link maestro; pos y clínica del servidor local, sin publicar aún; barra de
  "demostración" recortada). Giros: pilates (Alma), gimnasio (Atlas), restaurante (Hoja), florería (Dalia), clínica
  (Raíz), ferretería POS (Bisagra, tarjeta ancha) y rifas (Fortuna). NO poner demos de prospectos reales (Autocinema,
  KADE). Motion (`.dm-pista` 380vh, ligado al scroll): pasos 01–03 a la izquierda; en el teléfono se escribe
  "Florería Dalia" → boceto que se dibuja (pathLength) → la captura real lo barre (clip-path) → entra "Pedido nuevo" y
  el pase de acceso con código → "Antes de firmar, ya lo viste funcionando." **Reemplazó al reel de la laptop de
  Proyectos** (ProyectosReel/KaizenReel ya no se usan en la página; quedan en el repo porque `tools/video` los filma).
  Capítulos renumerados: 04 Demos · 05 Proyectos · 06 Nosotros · 07 Proceso · 08 FAQ · 09 Contacto (Navbar y
  BarraScroll al día). El hilo cruza de lado en cada frontera (Testimonios→Demos→Proyectos→Nosotros).
- **CONTACTO v2 (2026-11-06, sin desplegar)** — "¿Qué necesitas?" en BOTONES (radios con `required`, estilo
  `.form-tipos .form-chip`: `.form-field label` les ponía mayúsculas) con la opción nueva **"Ver una demo"** (`demo`
  en TIPO_LABEL); **correo y descripción OPCIONALES** (menos fricción; el WhatsApp ya identifica); "¿Qué sigue?" a la
  izquierda (24 h · 15 min con la demo de tu giro · propuesta por escrito) + número de WhatsApp visible; confirmación
  con "¿No se abrió? Toca aquí" (guarda el wa.me) y "Escribir otro mensaje". `kaizen:cotizar` preselecciona el
  botón y enfoca el nombre sin mover la página. Probado interceptando `window.open`.
- **Navbar con 7 links (6-nov):** cápsula compacta 1000 → 1160px, gap/letter-spacing menores bajo 1360px y
  hamburguesa bajo **1180px** (antes 960). Verificado a 1440/1280/1190.
- **Revisión completa 6-nov:** modo claro, inglés, celular por sección, telón y modal OK, sin errores de consola.
  Página: **27,078 → 21,232 px** en escritorio, aun con el capítulo Demos nuevo.
- **HILO CON MÁS PROTAGONISMO (6-nov):** (1) cruza de lado JUSTO sobre el filete (`.sh-rule`) de cada capítulo
  — "dibuja" la línea "ETIQUETA ——— Nº 0X" — alternando: Testimonios entra desde fuera por la derecha → izq;
  Demos izq→der; Proyectos der→izq; Nosotros izq→der (luego der → ranura central); FAQ desde el último escalón hacia
  la izq. Proceso sigue entrando por arriba de la lista (cruzar su filete pasaba detrás del título). (2) Más peso:
  `.hilo-aura` 16px al 7%, cuerpo 4.5px, brillo 1.4px, punta 6.5/22px con drop-shadow, y `.hilo-estela` = los
  últimos 260px antes de la punta en `--text-strong` (dasharray calculado en `pintar`). ⚠️ SIN `filter` en la estela
  ni en los trazos: su caja es el hilo entero (~21,000 px) y se recalcularía cada cuadro.
- Demos: se QUITÓ Fortuna (rifas: es personal de Zahir). 6 demos; Bisagra (horizontal) ocupa 3 columnas.
- **`Mockup.jsx`** — la imagen de cualquier dispositivo. Intenta `src` (el render de
  Rotato/Shots.so en `/public/mockups/`) y si ese archivo no existe cae a `fallback` (la captura
  plana). Así la página funciona antes de que lleguen los renders y al soltarlos no se toca código.
  **La sombra la pone el CSS** (`drop-shadow` sobre el alfa), NO viene horneada en el PNG: una sombra
  renderizada para fondo negro se ve como mancha gris sobre blanco, y ahora hay dos temas.
- **`PortafolioShowcase.jsx` + `ProjectModal.jsx`** — listado + caso de estudio. **REESCRITOS
  2026-08-13** tras la retroalimentación: el modal ya NO es un recorrido función por función (eran 24
  pantallas de Be Fit Lab). Ahora: hero (título, tagline, **result**, plataformas) → **El sitio web**
  (un mockup) → **Así se entra a la app** (2 pantallas: entrada y login) → CTA. Tocar cualquier
  mockup lo amplía (`.pm-lightbox`, que sí se queda oscuro en los dos temas).
  - Los datos salen de `project.mockups`; `walkthrough` sigue en `projects.js` pero **ya no se
    renderiza** (son capturas y textos reales, no los borres sin avisar).
  - **Nada de `rotateY` por CSS sobre un mockup**: el render ya trae su ángulo y se deformaría.
- **`Testimonios.jsx` = "LECTURA" (2026-10-05, a prueba: si no le convence, regresar a las dos columnas — respaldo en
  el scratchpad de esa sesión o en git)**. Sin partículas (Zahir sintió que ya era mucho), mismo lenguaje: el video
  CRECE con el scroll (0.55→1) hasta una tarjeta 9:16 grande con vista previa MUDA en loop (se monta la 1ª vez que
  aparece y luego solo pausa/reanuda); la cita es una escena fija corta (`.tc`, 230vh) que se "lee": cada palabra
  pasa de gris a tinta; al final aparece el autor. Contador "01 / 02".
  ⚠️ En la pestaña de prueba de Chrome (oculta) IntersectionObserver NO dispara → useInView nunca es true; la vista
  previa del video hay que verificarla en un navegador real.
  (Lo de abajo describe la versión ANTERIOR de tarjetas; el lightbox del video sigue igual.)
- **`Testimonios.jsx` (versión anterior)** — tarjetas con cita + **logo del cliente como avatar** (círculo blanco; `public/logos/tito.png`, `befit-mark.png`). ⚠️ Las CITAS son BORRADOR, faltan las reales.
  - **VIDEO DE CLIENTE (2026-08-04):** si el testimonio trae `video` + `poster` + `videoDuracion`, la tarjeta muestra una **miniatura vertical 9:16 GRANDE** (`min(200px, 62%)`, botón de play glass de 62px, píldora con la duración) que abre un **lightbox** (`.testimonio-lightbox`) con el video a pantalla completa, `controls` + `autoPlay` **con sonido** (permitido porque lo dispara un clic del usuario). Cierra con Escape, clic en el fondo o la ✕; reusa el patrón de `ProjectModal` (bloqueo de scroll + clase `pm-open` que esconde el botón flotante de WhatsApp). El `<video>` **solo se monta al abrir** → el MP4 no se descarga en la carga inicial (verificado).
  - **Tarjeta solo-video:** si hay `video` y `quote: null`, la tarjeta lleva `.testimonio-card--video` (todo centrado, sin ícono de comillas ni blockquote) y **el video ES el testimonio**. Decisión deliberada: no inventarle palabras al cliente. Las tarjetas de solo texto llevan `.testimonio-quote { margin: auto 0 }` para que la cita se centre cuando la rejilla las estira a la altura de la tarjeta con video (si no, queda un hueco enorme abajo).
  - Primer video: **Be Fit Lab** (`public/testimonios/befit-testimonio.mp4`, 5.9 MB, 576×1024, 52.8 s, 937 kbps, **ya trae `faststart`** — el átomo `moov` va antes del `mdat`, así que NO hay que recodificarlo). Póster `befit-poster.jpg` sacado del segundo 3.
  - **Cómo agregar otro video:** poner el MP4 y su póster en `public/testimonios/` y llenar los 3 campos en el arreglo `TESTIMONIOS`. Sin video, la tarjeta se ve igual que antes.
- **`ProcesoTrabajo.jsx`** (id `#process`) — **5 pasos** (eran 7; ver el comentario del archivo), **sin tiempos por paso**: los había estimado yo y nunca se validaron. El usuario confirmó UNO —**~2 meses de la firma del contrato a producción**— y ese va en el encabezado (y en el FAQ). Cinco estimaciones inventadas junto a un dato real restaban. **Luz viajera** detrás (`.process-glow`, loop) + tarjetas **glass sutiles** para que se vea pasar la luz.
- **`Faq.jsx`** (id `#faq`) — acordeón anti-objeciones (6 preguntas: cuánto tarda [**~2 meses desde el contrato**], código es mío, soporte, presupuesto/fases, sube a tiendas, escalable).
- **`Footer.jsx`** (id `#contact`) — los tipos de proyecto del `<select>` salen de `TIPO_LABEL` y **deben seguir a las tarjetas de Servicios** (faltaba "Sitio web", que es servicio principal). Form que **arma un mensaje y abre WhatsApp** (`wa.me/528138833422?text=...`), sin backend. Correo: **info@kaizenstudiomx.com** (desde `src/data/contacto.js`).
- **`FloatingWhatsApp.jsx`** — botón flotante, WhatsApp con mensaje prellenado.
- **`Navbar.jsx`** — `LINKS` = Servicios · Testimonios · Proyectos · Nosotros · Proceso · FAQ (orden y nombres = los de cada SectionHead; "Soluciones" → "Proyectos" el 5-oct) + botón Cotizar (#contact). Resalta la sección en pantalla (`activa`). Menú móvil centrado con `left/right` (NO `transform`: framer-motion lo pisa).

## Posicionamiento: SIN "mecatrónica" (2026-08-13)
El usuario pidió sacar la mecatrónica de la identidad de la empresa; **solo se conserva en la bio de
`SobreMi.jsx`**. Donde estaba como CREDENCIAL ("como ingeniero en mecatrónica, conecto lo que otros no
pueden") se cambió por la CAPACIDAD concreta: a un dueño de tienda la carrera no le dice nada, "conecto
tu lector de códigos" sí. Cambiados: insignia del hero, subtítulo de Servicios, meta description.
- **Nada de sobreprometer.** El servicio "Hardware & Biometría" (reconocimiento facial, IoT) prometía
  cosas que NO se hacen → ahora es **"Acceso QR y tickets"**: pases de Apple/Google Wallet, lector QR
  e impresión de tickets. Lo de Wallet entró aquí en vez de sumar una séptima tarjeta al carrusel
  ("menos es más", regla del usuario).

## Tema claro / oscuro (2026-08-13)
Motivo: al mostrar el sitio, a varias personas **no les gustó que fuera solo oscuro**.

- **Todo el color sale de tokens en `src/index.css`.** El tema oscuro es el default (`:root`);
  el claro solo redefine valores en `:root[data-theme='light']`. Ningún componente debe tener
  un color escrito a mano.
- **Los `--tint-1…6` son velos**: blancos sobre fondo oscuro, NEGROS sobre fondo claro. Invertirlos
  arregla la mayoría de los componentes solo. Para elegir token, ver la tabla en el comentario de
  cabecera de `index.css`.
- **Lo que NO es un simple invertir:** sombras (una al 45% que en negro es sutil, sobre blanco es una
  mancha → bajan a 0.07–0.16), glows del hero/proceso (`--glow-*` y `--glow-opacity`), y el acento
  (`#0a84ff` de modo oscuro no da contraste sobre blanco → `#0071e3`).
- **`src/lib/ThemeContext.jsx`**: sin elección previa sigue al SO **en vivo**; al tocar el botón, su
  elección manda y se guarda en `localStorage` (clave `tema`). **`src/components/ThemeToggle.jsx`** =
  botón sol/luna, va en `.nav-actions` (visible también en móvil, junto al menú).
- **Anti-parpadeo:** `index.html` trae un `<script>` SÍNCRONO en el `<head>` que pone `data-theme`
  antes de pintar. Sin eso la página aparece un instante en el tema equivocado. No pasarlo a
  `defer`/`module`.
- **Liquid Glass:** el shader dibujaba luz blanca aditiva → sobre fondo claro sería invisible. Se le
  agregó el uniform **`u_tone`** (1 = brillo blanco / 0 = filo oscuro) y `LiquidGlass.jsx` lo deriva
  del tema. Cambiar de tema **recrea el contexto WebGL** a propósito (el tono va en los uniforms al
  crearlo); solo pasa al tocar el switch.
- **El modal de proyecto SIGUE AL TEMA** (`ProjectModal.css` tokenizado). Primero se dejó fijo en
  oscuro como "experiencia inmersiva", pero el usuario lo pidió claro y esa decisión mandó.
  Siguen oscuros a propósito, en los dos temas: el **lightbox de captura** y el **lightbox del video**
  (son visores a pantalla completa), el **cuerpo del teléfono** de los mockups, y el **texto blanco
  sobre acento sólido**.
- **Acento por proyecto en tema claro:** `--pm-accent` llega por `style` inline en `.pm-panel` y varios
  (naranja `#FF8C3C`, morado `#BF5AF2`) **no dan contraste sobre blanco**. Por eso existe
  **`--pm-accent-text`**: en oscuro es el acento tal cual, en claro es
  `color-mix(in srgb, var(--pm-accent) 58%, #000)` (el naranja pasa de 2.2:1 a ~6:1). Todo `color:` de
  acento lo usa; los `background:` se quedan con el acento puro.
  ⚠️ **`--pm-accent-text` DEBE declararse en `.pm-panel`, no en `:root`**: un `var()` dentro de una
  custom property se sustituye con el valor que esa variable tiene **en el elemento que la declara**,
  y `--pm-accent` solo existe en el panel.

## Liquid Glass REAL (WebGL)
- **`src/lib/liquidGlass.js`** (renderer WebGL1 vanilla, `OES_standard_derivatives`) + **`src/components/LiquidGlass.jsx`** (wrapper).
- Enfoque HÍBRIDO: el **`backdrop-filter` de CSS hace el frost real** del contenido detrás (cross-browser); el WebGL encima, casi transparente, aporta solo la **iluminación de cristal** (filo refractivo, especular, barrido de luz). **NEUTRO, SIN color** (el usuario lo pidió así).
- Prop `intensity` (botón flotante 1.0; navbar 0.45; pestañas del modal 0.6). Patrón: padre `position:relative; overflow:hidden`, `<LiquidGlass>` absolute inset:0 z-index:0, contenido z-index:1.
- ⚠️ **CAVEAT HMR:** el `useEffect` crea el contexto WebGL una vez; editar `liquidGlass.js` NO lo recrea → **reiniciar dev server** + refresh fuerte para ver cambios del shader.

## Marca: logo y favicon (2026-08-14)
Antes el favicon era **un rayo morado `#863bff` que venía de la plantilla original** — ni era suyo ni
era su azul. Ahora hay marca propia: **tile redondeado con el degradado azul (`#0A84FF → #0052CC`) y
una Z blanca**. Se eligió entre 4 candidatos viéndolos **a 16px**, que es donde un logo se rompe.
- ⚠️ **La Z es un TRAZO, no texto.** Un `<text font-family="-apple-system">` dentro de un SVG lo
  resuelve *el sistema que lo abre*: en Windows/Android saldría con otra fuente. Se extrajo el glifo
  real de **SF Pro Display Bold** con `fontTools` (`instancer` a `wght=700, opsz=96`, `SVGPathPen`) y
  se horneó como `<path>`. **SFNS.ttf es fuente VARIABLE**: hay que instanciarla, no basta abrirla.
  `fontTools` no está en esta Mac; se instaló con `pip3 install --target` en el scratchpad.
- Archivos en `public/`: **`favicon.svg`** (el bueno, vectorial) + `favicon-32.png` / `favicon-96.png`
  / `favicon.ico` (respaldo: Safari viejo, Windows) + **`apple-touch-icon.png`** (180×180).
  ⚠️ El apple-touch-icon va **a sangre, con `rx=0`**: iOS le pone sus propias esquinas redondeadas y
  si el PNG ya trae las suyas queda doble redondeo.
  Los PNG se generan desde el mismo SVG con playwright (`logo/iconos.mjs`), así nunca se despegan.
- ⚠️ **La marca NO va en la navbar.** Se probó al lado del nombre y el usuario la quitó: *"lo siento
  repetitivo"* — la marca y el nombre completo dicen lo mismo pegados uno al lado del otro. La navbar
  se queda solo con el nombre. No reponerla sin pedírselo.
- ⚠️ **CACHÉ DE FAVICON:** los navegadores lo guardan en un almacén aparte que **ni un refresh
  forzado limpia** — tras desplegar la marca nueva, la pestaña seguía enseñando el rayo morado.
  Por eso los `<link rel="icon">` llevan **`?v=2`**. Si algún día se rediseña el ícono, **hay que
  subir ese número**, igual que se renombra la imagen OG.
- **Nombre en la navbar:** lleva `white-space: nowrap` y baja a `1.05rem` bajo 380px. Sin eso se
  partía en "Zahir / Vidahurrázaga" a 320px (necesita 200px y solo hay 188). Era un defecto viejo,
  no lo introdujo el logo.

## SEO / compartir
- `index.html` con `lang=es`, title, meta description, **Open Graph + Twitter Card**.
- **Imagen al compartir: `public/og-image-v2.jpg`** (1200×630, 66 KB). Diseño: **avatar redondo con
  su cara + nombre y servicios** arriba, titular, y **2 sellos** (App Store/Play · negocios reales),
  todo a ras del margen izquierdo, sobre los glows azul/morado del hero. Se genera con
  **`tools/marca/og.mjs` + `og.html`**: se diseña como página web y se fotografía, así se edita con
  CSS y no a mano con PIL.
  - **Va en OSCURO aunque el sitio tenga los dos temas.** Se probaron 3 versiones claras y el usuario
    prefirió la oscura: contra la burbuja verde clara de WhatsApp destaca más. **La imagen NO tiene
    nada que ver con el tema del sitio** (es un JPG aparte; el sitio sigue su switch sol/luna).
  - **La foto arrancó ocupando el 40% a cuerpo completo y el usuario la sintió con demasiado
    protagonismo** → pasó a círculo de 118px, ~4% del área. Ojo: `sobre-mi.jpg` es de cuerpo entero,
    así que el círculo necesita un **recorte a la cara** (la caja va en `CAJA` dentro de `og.mjs`);
    metida tal cual, la cabeza sale diminuta y la foto deja de aportar confianza.
  - **Ritmo vertical AGRUPADO, no huecos iguales:** 46px entre la identidad y el titular, 26px entre
    el titular y los sellos. Con los tres a 34px iguales, los sellos se leían como un bloque suelto en
    vez de como la prueba de lo que promete el titular.
  - Se evaluó **sangrar el titular hasta el eje del nombre** (x=206, dejando el avatar colgando en el
    margen) para no tener dos alineaciones izquierdas compitiendo; el usuario prefirió **todo a ras**.
    La variante con sangría está descrita aquí por si se retoma.
  - La anterior decía **"INGENIERÍA EN MECATRÓNICA"**, que ya se había quitado del posicionamiento en
    agosto: la imagen se había quedado rezagada. Al cambiarla revisar SIEMPRE que el texto horneado
    siga coincidiendo con el discurso del sitio.
  - ⚠️ **WhatsApp cachea la vista previa por URL.** Sobrescribir el archivo con el mismo nombre NO
    basta: seguiría enseñando la vieja por días. **Hay que renombrar** (`og-image-v3.jpg`…) y
    actualizar los 2 metas (`og:image` y `twitter:image`).
  - ⚠️ Ojo con el ancho del titular: a 58px "…no tú a él." se iba a un tercer renglón y se veía roto.
  - **Cómo se decidió:** renderizando cada opción **dentro de una burbuja de WhatsApp a escala real**
    (la imagen se ve a 336px de ancho, o sea a poco más de la cuarta parte). Un diseño que se ve bien
    a 1200px puede no registrar nada a ese tamaño. Vale la pena rehacer esa hoja antes de cambiarla.
- **`og:url` / `og:image` / `twitter:image` ya van en URL ABSOLUTA** (`https://zahirportafolio.pages.dev/…`),
  porque varias apps no resuelven rutas relativas. **PENDIENTE al tener dominio propio:** cambiar el
  dominio en esos 3 metas.

## Trucos / gotchas útiles
- **Redefinir una variable NO alcanza al texto heredado.** Fijar `--text-color` en un contenedor no
  arregla a sus hijos que no usan `var(--text-color)` sino que *heredan* el `color` ya calculado del
  `<body>` (le pasó a `.pm-title`). Si un bloque tiene fondo propio que no sigue al tema, dale
  `color` explícito, no solo tokens.
- **Especificidad que solo se nota en un tema:** `.mobile-menu a` (0,1,1) le ganaba a `.btn-metallic`
  (0,1,0) e imponía `--text-color` al CTA del menú. En oscuro salía blanco y parecía correcto; en
  claro salió negro sobre azul. Al agregar el tema claro, revisar los botones de color sólido que
  además casan con un selector de tipo.
- **Escala de espaciado incompleta:** `index.css` solo define `--spacing-` **1, 2, 3, 4, 6, 8, 12, 16, 24, 32**. NO existen 5, 7, 9, 10… Si usas uno inexistente **sin valor de respaldo**, la propiedad cae a su valor inicial (un `gap` se va a `normal` = **0**) y el bloque se encima, sin error visible. `Hero.css` y `Faq.css` sí usan `--spacing-5/-10` pero **con respaldo** (`var(--spacing-5, 1.25rem)`), por eso funcionan. Regla: token de la escala, o respaldo siempre.
- **Orientación HEIC:** `sips -r` NO hornea la rotación (solo etiqueta) y un resize la pierde → usar **PIL** (`ImageOps.exif_transpose` + crop/rotate + guardar JPEG sin EXIF) para que navegador y visor coincidan. Optimizar capturas con `sips --resampleWidth`.
- **Inutilizar un QR** sin que pierda el look: PIL, revolver ~45% de los módulos de datos (rebasa la corrección de errores → indecodificable) dejando intactas las 3 esquinas. (Privacidad: no publicar QR funcional de galería privada.)
- **Imágenes del usuario** suelen llegar a `~/Downloads` como `IMG_*.HEIC`/`.jpg`, o copiadas en el portapapeles (a veces como ARCHIVO Finder → `osascript -e 'POSIX path of (the clipboard as «class furl»)'`; a veces es HTML de Canva sin imagen usable).

## Estado (al 2026-08-14) — DESPLEGADO
Commit **`0f9ead6`** en `main` → Cloudflare Pages lo publica solo. Incluye todo lo de la sesión
2026-08-13: tema claro/oscuro, mockups reales, modal reescrito, recorte de la página, posicionamiento
sin mecatrónica y el carrusel de servicios que se abre solo.

### Retroalimentación de la gente a la que Zahir le mostró el sitio (2026-08-13)
Tres observaciones, que dirigen el trabajo actual:
1. ~~El sitio solo en oscuro no le gustó a varios~~ → **RESUELTO** con el switch claro/oscuro.
2. **"Se siente muy atascado de información."** Medido: **10.1 pantallas en escritorio, 12.8 en móvil.**
3. **"Muestran todo lo que tienen las apps."** Cierto: el modal enseña **24 pantallas de Be Fit Lab**,
   11 del POS y 5 del álbum (40 capturas para 3 proyectos). Es un manual de usuario, no un caso de
   estudio.

### Mockups: MONTADOS ✅ (2026-08-13)
Los 5 renders están en `public/mockups/` y en uso. Lecciones que costaron varias vueltas:
- **La proporción del marco NO se adivina.** shots.so muestra "Screen pixels" del modelo elegido
  (el usuario usó **MacBook Pro 16 = 3456×2234 = 1.5470**). Hay que capturar EXACTAMENTE ese número:
  con 1.5397 (Pro 14") recortaba ~5px por orilla, invisible en el centro pero suficiente para comerse
  el botón flotante del sitio, que vive pegado a la esquina. **Si cambia el modelo, pedir el dato y
  regenerar.** La captura se hace con playwright a `viewport = pixels/2` y `deviceScaleFactor: 2`.
- **La captura del POS es 2.07 de ancha** (no cabe en ninguna pantalla de Mac). Se resolvió
  **extendiendo el fondo**, no recortando: se detecta dónde termina la barra lateral leyendo los
  saltos de color de la fila 0 (x=479) y se rellena cada zona con su color. Arriba se replica la fila
  0 (está limpia); abajo NO se puede replicar porque la última fila trae el avatar del usuario y
  dejaría una raya de color piel → color plano por zona.
- **Los teléfonos van 2-en-1.** El usuario compuso las dos pantallas (entrada + login) en una sola
  imagen desde shots.so, así que `mockups.app` es UN objeto `{src, fallback, caption}`, no un arreglo.
  ⚠️ **Ojo al dimensionarlos:** esa imagen NO es una silueta vertical, es casi cuadrada
  (boda 1.13, pos 0.93, befit 0.81). La primera versión los limitaba a 280px de ancho —medida
  pensada para un teléfono suelto— y en la tarjeta del home se veían enanos con un hueco enorme al
  lado. Ahora llenan su columna (`min(520px, 100%)`), igual que el mockup de escritorio.
- **WebP con alfa: 5.6 MB → 466 KB** (el PNG del mockup de Be Fit Lab pesaba 1.6 MB, en WebP 136 KB).
  Antes de guardar se recorta el margen transparente con el bbox del canal alfa (venían ~50% de aire).
- Verificado: sin sombra horneada (solo 0.4-0.6% de píxeles semitransparentes = antialias del borde).

### Mockups: renders, NO CSS (decidido 2026-08-13)
El usuario pidió mockups "más reales, no tan planos", con referencias (portafolios con la laptop
fotografiada sobre concreto; la página del iPhone 17 Pro de Apple). **Ninguna de esas referencias es
CSS**: son fotos y renders 3D. Se descartó recrear el aparato en código — llegaría a un marco plano
inclinado, no a eso. (Esto REVIERTE la decisión previa de "recrear la animación en código".)
- **Fuente:** el usuario exporta PNG desde **Rotato / Shots.so** (ellos ya meten la captura dentro
  del render, con sus reflejos → no hay que componer nada). Reglas de export: **fondo transparente,
  SIN sombra horneada, iluminación neutra, mismo ángulo entre las 2 pantallas del mismo teléfono.**
- **Destino:** `public/mockups/` → `befit-mac.webp`, `befit-phones.webp`, `pos-mac.webp`,
  `pos-phones.webp`, `boda-phones.webp` (ya montados).
- Si falta alguno, `Mockup.jsx` usa la captura plana de respaldo y la página funciona igual.
- En esta Mac **no hay Blender, ImageMagick ni ffmpeg**; solo PIL + numpy. Alcanza para deformar en
  perspectiva y componer, no para generar un render.

### Recorte (obs. 2) — hecho lo técnico, faltan decisiones de contenido
Móvil: **12.8 → 10.0 pantallas**. Escritorio 10.1 → ~9.4.
Cómo se midió: `medir.mjs` en el scratchpad (playwright + Chrome del sistema) da alto, pantallas,
% y **cuánto de cada sección es padding puro**. Correr eso ANTES de cortar a ojo.
- **Hallazgo principal:** 1504px de la página (1.8 pantallas) eran solo padding. Varias secciones
  fijaban `--spacing-32` (8rem) a pelo y su CSS le ganaba a la escala responsiva de
  `.section-container`, así que en móvil quedaban 256px de nada por sección. De ahí nació
  **`--section-pad-y`** (ver index.css). Bajó a 972px.
- **La tarjeta del home ahora muestra `tagline`, no `description`.** La descripción larga (209
  caracteres en Be Fit Lab) hacía que las 3 tarjetas ocuparan 3 pantallas. El gancho va en la
  tarjeta, el detalle en el modal. `description` quedó SIN USARSE en projects.js.
- Reparto actual en móvil: Proyectos 25%, Proceso 22%, Testimonios 12%, Footer 11%, Sobre mí 10%.
- **En pausa (2026-10-03), no proponer.** Lo que falta requiere decisión del usuario (es SU contenido, no cortar sin preguntar):
  FAQ de 6 → 4 (~0.2), bio de Sobre mí más corta, tags de 5 → 3 por proyecto.
- [x] **Proceso 7 → 5 pasos** (aprobado 2026-08-13): se fusionó "Formalización" dentro de
  "Propuesta y Acuerdo" y "Sincronización Continua" dentro de "Ingeniería y Desarrollo".
- Ojo: "atascado de información" era **densidad**, no largo. Lo que más pesaba era el modal de 24
  pantallas y los párrafos en las tarjetas; las dos cosas ya están resueltas.

### Pendientes — EN PAUSA (decidido 2026-10-03)
> Zahir pidió quitar todos estos pendientes "por el momento". NO proponerlos al retomar;
> quedan aquí solo como registro, por si él decide reabrir alguno.

- [ ] **Citas reales** de testimonios (Carlos de Plásticos Tito, dueña de Be Fit Lab) — hoy son borrador.
- [ ] **Dominio** + conectarlo en Cloudflare. Recomendados: `zahir.dev` o `zahirdaniel.com` (evitar el apellido completo). Comprar en Cloudflare Registrar.
- [x] ~~og:image a URL absoluta~~ — **HECHO 2026-08-14**, apuntando a `zahirportafolio.pages.dev`.
      Falta solo cambiar el dominio ahí cuando haya uno propio.
- [x] ~~Logo propio~~ — **HECHO 2026-08-14** (el rayo morado era de la plantilla).
- [ ] **Foto de la imagen al compartir**: hoy usa `sobre-mi.jpg`, donde Zahir sale con gorra y ropa
      deportiva. Él la aprobó sabiéndolo. Si algún día hay retrato sin gorra, se cambia el archivo,
      se reencuadra `CAJA` en `tools/marca/og.mjs` y se regenera.
- [ ] Confirmar/ajustar **tiempos** del Proceso.
- [ ] **Revisión final completa en móvil** de arriba a abajo.
- [x] ~~Videos de experiencia de clientes~~ — **Be Fit Lab LISTO (2026-08-04)**. Falta el de Plásticos Tito (Carlos), si se consigue.
- [x] ~~Cita inventada de Be Fit Lab~~ — **QUITADA (2026-08-04)**: `quote: null`, la tarjeta es solo video. Si algún día dan una frase textual, se pone en `quote` y la tarjeta vuelve a mostrar cita + video.
- [ ] ⚠️ **La cita de Carlos (Plásticos Tito) SIGUE siendo borrador inventado.** O se consigue la frase real / un video, o se le aplica el mismo criterio.
- [x] ~~Modo claro/oscuro~~ — **HECHO 2026-08-13** (sin desplegar). Incluye `ProjectModal.css`.
- [ ] **Contraste de los botones de acento sólido** (`.pm-cta`, `.pm-role.is-active`): texto blanco
      sobre el naranja de Be Fit Lab da ~2.2:1, en LOS DOS temas. Es de antes del modo claro, no lo
      introdujo. Se arregla oscureciendo el fondo del botón en claro o usando texto oscuro; requiere
      decisión de marca del usuario.

### Código muerto eliminado (2026-08-13)
`src/App.css` (sobras de la plantilla de Vite, referenciaba variables inexistentes) y
`PortafolioBento.jsx` + `.css` (no lo importaba nadie). Están en el historial de git si hicieran falta.

## Video para redes (Historias / Reels / TikTok) — `tools/video/`
`capturar.mjs` filma el sitio CUADRO POR CUADRO en un Chrome invisible 405×720 @3.333 (→1350×2400): reloj de la página
controlado con `page.clock` y scroll fijado por cuadro → video perfectamente fluido (las animaciones dependen del
scroll y del reloj, no del tiempo real). Tomas en `TOMAS` (selector de la pista + progreso de/a). `editar.py` (PIL)
hace acercamientos por toma, disolvencias de 5 cuadros y la tarjeta final (kaizenstudiomx.com / @kaizen.studio.mx),
salida 1080×1920; luego ffmpeg (`-crf 17 -pix_fmt yuv420p -movflags +faststart`). Herramientas (playwright-core +
ffmpeg-static) se instalaron en el scratchpad CON PERMISO de Zahir (6-oct); necesita el dev server corriendo.
Primer video: `~/Desktop/KaiZen-historia.mp4` (15 s, español, sin música: la música se pone en IG/TikTok).

## Cómo verificar sin desplegar
Patrón usado en este repo (no hay `chromium-cli` en esta Mac): **`playwright-core` + Chrome del sistema**
(`executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`), scripts sueltos en el
scratchpad. Sirve para capturas a 1280/390px, abrir modales, y leer estado real del DOM (p. ej. si un
`<video>` de verdad está reproduciendo: `currentTime > 0 && !paused`). **Sin ffmpeg en esta Mac**: para
sacar fotogramas de un video, cargarlo en una página local con `<video>`, hacer seek y tomar screenshot;
para leer duración/resolución/bitrate, `mdls`; para el orden de átomos MP4 (faststart), Python plano.

Mensajes de commit terminan con `Co-Authored-By: Claude <modelo> <noreply@anthropic.com>`, con el
modelo que realmente hizo el commit (los de agosto 2026 en adelante van con Opus 5).
