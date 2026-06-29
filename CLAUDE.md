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
- **Orden de la página (`App.jsx`):** Hero → **SobreMi** → FactorMecatronico (Servicios) → PortafolioShowcase (Proyectos) → Testimonios → ProcesoTrabajo → Faq → Footer.

## Componentes clave
- **`Hero.jsx`** — titular estrella "Software a tu medida: que se adapte a ti, **no tú a él.**" + franja de prueba (`.hero-proof`: App Store/Play · en producción · proyectos reales) + 2 CTAs. Glows azul/morado viajeros por CSS. En móvil: anclado arriba (no centrado) con más aire.
- **`SobreMi.jsx`** — "Quién soy": foto (4:5) + bio corta + CTA "Trabajemos juntos". Foto en `public/sobre-mi.jpg`.
- **`FactorMecatronico.jsx`** (id `#about`, "Servicios") — "Qué puedo construir": **carrusel/marquee controlado por JS** (rAF + transform, NO animación CSS) de 6 chips de servicio. Al tocar un chip: la MISMA tarjeta se expande EN SU LUGAR y el carrusel se **recoloca por JS para centrarla** (siempre visible). Señal "tocable" = respiro de glow MUY sutil (`chipBreathe`). Pausa por hover/touch.
- **`PortafolioShowcase.jsx` + `ProjectModal.jsx`** — listado + modal case-study. Modal: hero (título, tagline, **result**, plataformas — SIN descripción larga ni "visitar sitio web", ya están en la tarjeta) → pestañas de perfil (`.pm-roles`) → escenario/lista de funciones → footer con CTA "Ver el proyecto en vivo".
  - **Desktop (>860px):** "escenario" función-por-función con teléfono/navegador fijo, auto-avance, dots, flechas, swipe.
  - **Móvil (≤860px, por `matchMedia`):** **carrusel grande con swipe** (`.pm-mcar`): cada función a su MARCO correcto (teléfono alto / navegador ancho, SIN recortar), texto debajo, puntos+contador, flechas. Tocar la captura → **lightbox** (`.pm-lightbox`). El auto-avance NO corre en móvil.
- **`Testimonios.jsx`** — tarjetas con cita + **logo del cliente como avatar** (círculo blanco; `public/logos/tito.png`, `befit-mark.png`). Campo `video` (null) listo para videos de experiencia a futuro. ⚠️ Las CITAS son BORRADOR, faltan las reales.
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
- [ ] (Opcional) Videos de experiencia de clientes (campo `video` ya existe en Testimonios).

Mensajes de commit terminan con: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
