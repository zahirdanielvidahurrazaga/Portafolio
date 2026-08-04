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
- **`FactorMecatronico.jsx`** (id `#about`, "Servicios") — "Qué puedo construir": **carrusel/marquee controlado por JS** (rAF + transform, NO animación CSS) de 6 chips de servicio. Al tocar un chip: la MISMA tarjeta se expande EN SU LUGAR y el carrusel se **recoloca por JS para centrarla** (siempre visible). Señal "tocable" = respiro de glow MUY sutil (`chipBreathe`). Pausa por hover/touch.
- **`PortafolioShowcase.jsx` + `ProjectModal.jsx`** — listado + modal case-study. Modal: hero (título, tagline, **result**, plataformas — SIN descripción larga ni "visitar sitio web", ya están en la tarjeta) → pestañas de perfil (`.pm-roles`) → escenario/lista de funciones → footer con CTA "Ver el proyecto en vivo".
  - **Desktop (>860px):** "escenario" función-por-función con teléfono/navegador fijo, auto-avance, dots, flechas, swipe.
  - **Móvil (≤860px, por `matchMedia`):** **carrusel grande con swipe** (`.pm-mcar`): cada función a su MARCO correcto (teléfono alto / navegador ancho, SIN recortar), texto debajo, puntos+contador, flechas. Tocar la captura → **lightbox** (`.pm-lightbox`). El auto-avance NO corre en móvil.
- **`Testimonios.jsx`** — tarjetas con cita + **logo del cliente como avatar** (círculo blanco; `public/logos/tito.png`, `befit-mark.png`). ⚠️ Las CITAS son BORRADOR, faltan las reales.
  - **VIDEO DE CLIENTE (2026-08-04):** si el testimonio trae `video` + `poster` + `videoDuracion`, la tarjeta muestra una **miniatura vertical 9:16 GRANDE** (`min(200px, 62%)`, botón de play glass de 62px, píldora con la duración) que abre un **lightbox** (`.testimonio-lightbox`) con el video a pantalla completa, `controls` + `autoPlay` **con sonido** (permitido porque lo dispara un clic del usuario). Cierra con Escape, clic en el fondo o la ✕; reusa el patrón de `ProjectModal` (bloqueo de scroll + clase `pm-open` que esconde el botón flotante de WhatsApp). El `<video>` **solo se monta al abrir** → el MP4 no se descarga en la carga inicial (verificado).
  - **Tarjeta solo-video:** si hay `video` y `quote: null`, la tarjeta lleva `.testimonio-card--video` (todo centrado, sin ícono de comillas ni blockquote) y **el video ES el testimonio**. Decisión deliberada: no inventarle palabras al cliente. Las tarjetas de solo texto llevan `.testimonio-quote { margin: auto 0 }` para que la cita se centre cuando la rejilla las estira a la altura de la tarjeta con video (si no, queda un hueco enorme abajo).
  - Primer video: **Be Fit Lab** (`public/testimonios/befit-testimonio.mp4`, 5.9 MB, 576×1024, 52.8 s, 937 kbps, **ya trae `faststart`** — el átomo `moov` va antes del `mdat`, así que NO hay que recodificarlo). Póster `befit-poster.jpg` sacado del segundo 3.
  - **Cómo agregar otro video:** poner el MP4 y su póster en `public/testimonios/` y llenar los 3 campos en el arreglo `TESTIMONIOS`. Sin video, la tarjeta se ve igual que antes.
- **`ProcesoTrabajo.jsx`** (id `#process`) — 7 pasos con **tiempos estimados** (`step.time`, ⚠️ confirmar con el usuario). **Luz viajera** detrás (`.process-glow`, loop) + tarjetas **glass sutiles** para que se vea pasar la luz.
- **`Faq.jsx`** (id `#faq`) — acordeón anti-objeciones (6 preguntas: cuánto tarda [sitio 2-4 sem, app 7-8 sem], código es mío, soporte, presupuesto/fases, sube a tiendas, escalable).
- **`Footer.jsx`** (id `#contact`) — form que **arma un mensaje y abre WhatsApp** (`wa.me/522221622676?text=...`), sin backend. Correo directo: **zahirdaniel@hotmail.com**.
- **`FloatingWhatsApp.jsx`** — botón flotante, WhatsApp con mensaje prellenado.
- **`Navbar.jsx`** — links: Sobre mí · Servicios · Soluciones · Testimonios · Proceso · FAQ. Menú móvil centrado con `left/right` (NO `transform`: framer-motion lo pisa).

## Liquid Glass REAL (WebGL)
- **`src/lib/liquidGlass.js`** (renderer WebGL1 vanilla, `OES_standard_derivatives`) + **`src/components/LiquidGlass.jsx`** (wrapper).
- Enfoque HÍBRIDO: el **`backdrop-filter` de CSS hace el frost real** del contenido detrás (cross-browser); el WebGL encima, casi transparente, aporta solo la **iluminación de cristal** (filo refractivo, especular, barrido de luz). **NEUTRO, SIN color** (el usuario lo pidió así).
- Prop `intensity` (botón flotante 1.0; navbar 0.45; pestañas del modal 0.6). Patrón: padre `position:relative; overflow:hidden`, `<LiquidGlass>` absolute inset:0 z-index:0, contenido z-index:1.
- ⚠️ **CAVEAT HMR:** el `useEffect` crea el contexto WebGL una vez; editar `liquidGlass.js` NO lo recrea → **reiniciar dev server** + refresh fuerte para ver cambios del shader.

## SEO / compartir
- `index.html` con `lang=es`, title, meta description, **Open Graph + Twitter Card**. Imagen de marca `public/og-image.jpg` (1200×630, generada con PIL).
- ⚠️ **PENDIENTE al tener dominio:** cambiar `og:image`/`og:url` a URL **ABSOLUTA** (ej. `https://dominio.com/og-image.jpg`) para que el preview de WhatsApp funcione en todas las apps.

## Trucos / gotchas útiles
- **Escala de espaciado incompleta:** `index.css` solo define `--spacing-` **1, 2, 3, 4, 6, 8, 12, 16, 24, 32**. NO existen 5, 7, 9, 10… Si usas uno inexistente **sin valor de respaldo**, la propiedad cae a su valor inicial (un `gap` se va a `normal` = **0**) y el bloque se encima, sin error visible. `Hero.css` y `Faq.css` sí usan `--spacing-5/-10` pero **con respaldo** (`var(--spacing-5, 1.25rem)`), por eso funcionan. Regla: token de la escala, o respaldo siempre.
- **Orientación HEIC:** `sips -r` NO hornea la rotación (solo etiqueta) y un resize la pierde → usar **PIL** (`ImageOps.exif_transpose` + crop/rotate + guardar JPEG sin EXIF) para que navegador y visor coincidan. Optimizar capturas con `sips --resampleWidth`.
- **Inutilizar un QR** sin que pierda el look: PIL, revolver ~45% de los módulos de datos (rebasa la corrección de errores → indecodificable) dejando intactas las 3 esquinas. (Privacidad: no publicar QR funcional de galería privada.)
- **Imágenes del usuario** suelen llegar a `~/Downloads` como `IMG_*.HEIC`/`.jpg`, o copiadas en el portapapeles (a veces como ARCHIVO Finder → `osascript -e 'POSIX path of (the clipboard as «class furl»)'`; a veces es HTML de Canva sin imagen usable).

## Estado (al 2026-06-29) — DESPLEGADO
Roadmap de conversión P0+P1+P2 COMPLETO + Sobre mí + álbum de bodas + Liquid Glass. Commit `bd947d5` en `main` (en vivo en Cloudflare).

### Pendientes
- [ ] **Citas reales** de testimonios (Carlos de Plásticos Tito, dueña de Be Fit Lab) — hoy son borrador.
- [ ] **Dominio** + conectarlo en Cloudflare. Recomendados: `zahir.dev` o `zahirdaniel.com` (evitar el apellido completo). Comprar en Cloudflare Registrar.
- [ ] **og:image a URL absoluta** una vez haya dominio.
- [ ] Confirmar/ajustar **tiempos** del Proceso.
- [ ] **Revisión final completa en móvil** de arriba a abajo.
- [x] ~~Videos de experiencia de clientes~~ — **Be Fit Lab LISTO (2026-08-04)**. Falta el de Plásticos Tito (Carlos), si se consigue.
- [x] ~~Cita inventada de Be Fit Lab~~ — **QUITADA (2026-08-04)**: `quote: null`, la tarjeta es solo video. Si algún día dan una frase textual, se pone en `quote` y la tarjeta vuelve a mostrar cita + video.
- [ ] ⚠️ **La cita de Carlos (Plásticos Tito) SIGUE siendo borrador inventado.** O se consigue la frase real / un video, o se le aplica el mismo criterio.

## Cómo verificar sin desplegar
Patrón usado en este repo (no hay `chromium-cli` en esta Mac): **`playwright-core` + Chrome del sistema**
(`executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`), scripts sueltos en el
scratchpad. Sirve para capturas a 1280/390px, abrir modales, y leer estado real del DOM (p. ej. si un
`<video>` de verdad está reproduciendo: `currentTime > 0 && !paused`). **Sin ffmpeg en esta Mac**: para
sacar fotogramas de un video, cargarlo en una página local con `<video>`, hacer seek y tomar screenshot;
para leer duración/resolución/bitrate, `mdls`; para el orden de átomos MP4 (faststart), Python plano.

Mensajes de commit terminan con: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
