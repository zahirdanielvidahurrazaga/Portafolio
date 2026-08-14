# Portafolio — Zahir Daniel Vidahurrázaga Marín

Portafolio personal/comercial. **Objetivo del sitio: conseguir clientes** (no solo lucir).
Público: dueños de negocio PyME en México (gyms, tiendas, consultorios, eventos).
Zahir = Ingeniero en Mecatrónica que vende soluciones **software + hardware** a la medida.

> ⚠️ Vive FUERA de iCloud a propósito: `/Users/karimeperez/Developer/Portafolio`
> (Desktop/Documents sincronizan y rompen `node_modules`/`.git`).

## Stack y despliegue
- **React 19 + Vite 8**, Framer Motion, lucide-react.
- **Despliegue:** Cloudflare Pages. **`git push` a `main` auto-despliega.** Repo `github.com/zahirdanielvidahurrazaga/Portafolio`.
- **Build:** `npx vite build` (rápido, <1s). **Dev:** `npm run dev -- --host` (para probar en iPhone en la IP de red; OJO la IP cambia, verla en el log de vite).
- **REGLA DE TRABAJO:** trabajar en LOCAL; desplegar (push) hasta el final / cuando el usuario lo aprueba. Verificar con `npx vite build` tras cada cambio.
- **Supabase:** el cliente quedó como stub (no se usa; el form de contacto ahora va por WhatsApp). `@supabase/supabase-js` sigue en deps pero sin uso.

## Arquitectura
- **`src/data/projects.js`** = catálogo central. Exporta `projects` = curaduría `VISIBLES` (hoy `['befit','pos','boda']`) mapeada desde `allProjects`. Para mostrar otro (carperfit/dental/santuario archivados), agregar su id a `VISIBLES`. Cada proyecto: `slides`, `website`, `platforms`, `heroImage`, `result` (outcome de negocio), `tagline`, `walkthrough` = funciones `{ role?, device?('phone'|'desktop'), icon, title, desc, image }`.
- **Orden de la página (`App.jsx`) — REORDENADO 2026-08-04 para conversión:** Hero → FactorMecatronico (Servicios) → **Testimonios** → PortafolioShowcase (Proyectos) → **SobreMi** → ProcesoTrabajo → Faq → Footer. Sigue las preguntas del cliente en el orden en que se las hace: ¿qué hace? → **¿le creo?** → ¿ya lo hizo? → ¿quién es? → ¿cómo trabajamos? → dudas → contacto.
  - **Por qué:** medido con playwright, el video de cliente empezaba en la **pantalla 6.5 de móvil (51% del scroll)** y casi nadie llegaba. Ahora empieza en la **pantalla 1.9 (15%)**. `SobreMi` bajó al 54%: la bio contesta una pregunta que el visitante frío todavía no se hace, y ocupaba la pantalla más cara del sitio. (Revierte la decisión vieja de "primero quién soy"; el usuario aprobó el cambio con los números enfrente.)
  - **El orden del navbar (`Navbar.jsx`, escritorio Y menú móvil) debe seguir al de la página** — se actualizaron los dos.
  - En `Testimonios.jsx`, **el testimonio con video va PRIMERO en el arreglo**: en móvil las tarjetas se apilan y el orden del arreglo decide qué se ve antes.

## Componentes clave
- **`Hero.jsx`** — titular estrella "Software a tu medida: que se adapte a ti, **no tú a él.**" + franja de prueba (`.hero-proof`: App Store/Play · en producción · proyectos reales) + 2 CTAs. Glows azul/morado viajeros por CSS. En móvil: anclado arriba (no centrado) con más aire.
- **`SobreMi.jsx`** — "Quién soy": foto (4:5) + bio corta + CTA "Trabajemos juntos". Foto en `public/sobre-mi.jpg`.
- **`FactorMecatronico.jsx`** (id `#about`, "Servicios") — "Qué puedo construir": **carrusel/marquee controlado por JS** (rAF + transform, NO animación CSS) de 6 chips de servicio.
  - **APERTURA AUTOMÁTICA AL CENTRO (2026-08-13):** frena sobre cada tarjeta, la abre, la deja leer 3.2 s y sigue. Antes la descripción solo se veía si el visitante tocaba, y casi nadie toca. Por eso se quitó el "Toca cada uno para saber más" del subtítulo.
  - ⚠️ **REGLA QUE SOSTIENE TODO: abrir NO debe cambiar el layout.** La primera versión se sintió trabadísima porque la tarjeta abierta pasaba de ~200px a 360px de ancho. Eso (a) empujaba a las siguientes a la derecha, (b) cambiaba el `scrollWidth` del carril → la medida del wrap quedaba mal → tirón al reanudar, y (c) al crecer hacia abajo **empujaba la página entera** cada 3 s.
    → **Todas las tarjetas miden lo mismo** (`.service-chip { width: 290px }`, 268 en móvil) y la activa NO cambia de ancho: solo crece hacia abajo, y en una fila flex con `align-items:flex-start` eso no mueve a nadie en horizontal.
    → **`.service-marquee` reserva el alto** de la tarjeta abierta (`min-height`), por eso la página no se mueve. Como esa reserva ya separa de la sección siguiente, `.factor-section` lleva `padding-bottom` chico: sumarle el padding normal dejaba un hueco enorme con todo cerrado.
  - ⚠️ **El bucle rAF es el ÚNICO que escribe `transform`.** Antes también lo hacía una transición de CSS y se peleaban. Frenar y arrancar son interpolaciones DENTRO del bucle. Nada de `style.transition` en el carril.
  - ⚠️ **La duración del frenado se CALCULA, no es fija.** Con una curva de duración fija el frenado arrancaba a ~300 px/s (4× la marcha de 70): daba un acelerón y luego un alto en seco — el usuario lo describió como "parón de golpe". La velocidad debe decaer en línea recta de la actual a 0, y entonces la distancia es v·T/2 → **T = 2·d/v** con **easeOutQuad** (`p*(2-p)`). Así el frenado ENTRA exactamente a la velocidad que ya llevaba. Se usa `vActual` (la real de ese momento, que puede ir a media aceleración), no la constante.
  - ⚠️ **El periodo del carrusel NO es `scrollWidth / 2`.** Son 12 tarjetas y 11 huecos, así que la mitad se queda corta por medio hueco (8px) y pegaba un brinco cada vuelta. Se mide como `children[6].offsetLeft - children[0].offsetLeft`.
  - **Cuidado al medir esto con playwright:** una sonda en `requestAnimationFrame` se cruza con el bucle de la animación y a veces cuenta dos avances como uno → reporta picos falsos de ~1.8×. Medir en ventanas de ~50 ms (`vel2.mjs` en el scratchpad) o mirar el desplazamiento por fotograma en px, no la velocidad.
  - La detección corre **cada 100 ms, no en cada fotograma**: medir 12 elementos con `getBoundingClientRect` fuerza recálculo de layout y a 60fps se nota. Engancha ~52px ANTES del centro para tener con qué frenar.
  - `frenarRef` / `reanudarRef` / `cerrarRef` son refs que llena el bucle o el render, porque el efecto tiene deps `[]` y si no se llamaría a versiones viejas.
  - El clic **manda sobre el reloj** y reusa el mismo frenado (la tarjeta se acomoda al centro en vez de abrirse a medio salir). Antes de frenar hacia otra hay que **soltar `openRef`**, si no el bucle sigue detenido. El hover cancela el cierre para no cerrarle encima a quien lee. Sin apertura automática con `prefers-reduced-motion`.
  - Verificado con playwright: **0 tirones** (>8px en un fotograma) en 18 s, las tarjetas aterrizan a **0px del centro** y la sección mantiene **una sola altura**.
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
- **`Testimonios.jsx`** — tarjetas con cita + **logo del cliente como avatar** (círculo blanco; `public/logos/tito.png`, `befit-mark.png`). ⚠️ Las CITAS son BORRADOR, faltan las reales.
  - **VIDEO DE CLIENTE (2026-08-04):** si el testimonio trae `video` + `poster` + `videoDuracion`, la tarjeta muestra una **miniatura vertical 9:16 GRANDE** (`min(200px, 62%)`, botón de play glass de 62px, píldora con la duración) que abre un **lightbox** (`.testimonio-lightbox`) con el video a pantalla completa, `controls` + `autoPlay` **con sonido** (permitido porque lo dispara un clic del usuario). Cierra con Escape, clic en el fondo o la ✕; reusa el patrón de `ProjectModal` (bloqueo de scroll + clase `pm-open` que esconde el botón flotante de WhatsApp). El `<video>` **solo se monta al abrir** → el MP4 no se descarga en la carga inicial (verificado).
  - **Tarjeta solo-video:** si hay `video` y `quote: null`, la tarjeta lleva `.testimonio-card--video` (todo centrado, sin ícono de comillas ni blockquote) y **el video ES el testimonio**. Decisión deliberada: no inventarle palabras al cliente. Las tarjetas de solo texto llevan `.testimonio-quote { margin: auto 0 }` para que la cita se centre cuando la rejilla las estira a la altura de la tarjeta con video (si no, queda un hueco enorme abajo).
  - Primer video: **Be Fit Lab** (`public/testimonios/befit-testimonio.mp4`, 5.9 MB, 576×1024, 52.8 s, 937 kbps, **ya trae `faststart`** — el átomo `moov` va antes del `mdat`, así que NO hay que recodificarlo). Póster `befit-poster.jpg` sacado del segundo 3.
  - **Cómo agregar otro video:** poner el MP4 y su póster en `public/testimonios/` y llenar los 3 campos en el arreglo `TESTIMONIOS`. Sin video, la tarjeta se ve igual que antes.
- **`ProcesoTrabajo.jsx`** (id `#process`) — **5 pasos** (eran 7; ver el comentario del archivo), **sin tiempos por paso**: los había estimado yo y nunca se validaron. El usuario confirmó UNO —**~2 meses de la firma del contrato a producción**— y ese va en el encabezado (y en el FAQ). Cinco estimaciones inventadas junto a un dato real restaban. **Luz viajera** detrás (`.process-glow`, loop) + tarjetas **glass sutiles** para que se vea pasar la luz.
- **`Faq.jsx`** (id `#faq`) — acordeón anti-objeciones (6 preguntas: cuánto tarda [**~2 meses desde el contrato**], código es mío, soporte, presupuesto/fases, sube a tiendas, escalable).
- **`Footer.jsx`** (id `#contact`) — los tipos de proyecto del `<select>` salen de `TIPO_LABEL` y **deben seguir a las tarjetas de Servicios** (faltaba "Sitio web", que es servicio principal). Form que **arma un mensaje y abre WhatsApp** (`wa.me/522221622676?text=...`), sin backend. Correo directo: **zahirdaniel@hotmail.com**.
- **`FloatingWhatsApp.jsx`** — botón flotante, WhatsApp con mensaje prellenado.
- **`Navbar.jsx`** — links: Sobre mí · Servicios · Soluciones · Testimonios · Proceso · FAQ. Menú móvil centrado con `left/right` (NO `transform`: framer-motion lo pisa).

## Posicionamiento: SIN "mecatrónica" (2026-08-13)
El usuario pidió sacar la mecatrónica de la identidad de la empresa; **solo se conserva en la bio de
`SobreMi.jsx`**. Donde estaba como CREDENCIAL ("como ingeniero en mecatrónica, conecto lo que otros no
pueden") se cambió por la CAPACIDAD concreta: a un dueño de tienda la carrera no le dice nada, "conecto
tu lector de códigos" sí. Cambiados: insignia del hero, subtítulo de Servicios, meta description.
- **Nada de sobreprometer.** El servicio "Hardware & Biometría" (reconocimiento facial, IoT) prometía
  cosas que NO se hacen → ahora es **"Acceso QR y tickets"**: pases de Apple/Google Wallet, lector QR
  e impresión de tickets. Lo de Wallet entró aquí en vez de sumar una séptima tarjeta al carrusel
  ("menos es más", regla del usuario).
- ⚠️ El componente sigue llamándose `FactorMecatronico.jsx` (y sus clases `.factor-*`) por historia;
  no se ve en el sitio. Renombrarlo es cosmético y toca varios archivos.

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
- **Lo que falta requiere decisión del usuario** (es SU contenido, no cortar sin preguntar):
  FAQ de 6 → 4 (~0.2), bio de Sobre mí más corta, tags de 5 → 3 por proyecto.
- [x] **Proceso 7 → 5 pasos** (aprobado 2026-08-13): se fusionó "Formalización" dentro de
  "Propuesta y Acuerdo" y "Sincronización Continua" dentro de "Ingeniería y Desarrollo".
- Ojo: "atascado de información" era **densidad**, no largo. Lo que más pesaba era el modal de 24
  pantallas y los párrafos en las tarjetas; las dos cosas ya están resueltas.

### Pendientes
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

## Cómo verificar sin desplegar
Patrón usado en este repo (no hay `chromium-cli` en esta Mac): **`playwright-core` + Chrome del sistema**
(`executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`), scripts sueltos en el
scratchpad. Sirve para capturas a 1280/390px, abrir modales, y leer estado real del DOM (p. ej. si un
`<video>` de verdad está reproduciendo: `currentTime > 0 && !paused`). **Sin ffmpeg en esta Mac**: para
sacar fotogramas de un video, cargarlo en una página local con `<video>`, hacer seek y tomar screenshot;
para leer duración/resolución/bitrate, `mdls`; para el orden de átomos MP4 (faststart), Python plano.

Mensajes de commit terminan con `Co-Authored-By: Claude <modelo> <noreply@anthropic.com>`, con el
modelo que realmente hizo el commit (los de agosto 2026 en adelante van con Opus 5).
