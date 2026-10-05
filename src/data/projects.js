// Catálogo central de proyectos del portafolio.
// El orden de este arreglo = orden de aparición (los más recientes primero).
//
// Cada proyecto define:
//  - slides:    capturas para el mockup de la lista (auto-cycle).
//  - website:   URL pública para el botón "Visitar sitio web".
//  - platforms: ['iOS', 'Android', 'Web'] (chips).
//  - heroImage: captura del hero del modal.
//  - mockups:   LO QUE SE MUESTRA HOY. Un mockup del sitio web + el intro de la
//       app (entrada y login), nada más. Viene de la retroalimentación de 2026-08-13:
//       enseñar las 24 pantallas de una app es un manual de usuario, no un caso de
//       estudio. Cada imagen trae `src` (el render de Rotato, con fondo transparente
//       y SIN sombra horneada) y `fallback` (la captura plana, que se usa sola
//       mientras el render no exista). Ver CLAUDE.md.
//  - walkthrough: (YA NO SE RENDERIZA) recorrido función por función. Se conserva
//       porque son capturas y textos reales que puede que reusemos; no lo borres
//       sin avisar.

const allProjects = [
  {
    id: 'befit',
    category: 'Fitness & Wellness',
    title: 'Be Fit Lab',
    tagline: 'El estudio de pilates, en el bolsillo de tus clientas.',
    description:
      'PWA y app nativa (iOS / Android) para un estudio de pilates premium: reserva de clases, membresías con acceso por QR, una cafetería con pago nativo estilo Uber Eats y un panel de administración en tiempo real.',
    result:
      'Reemplazó las reservas por WhatsApp y el control manual de membresías: reservas, pase de acceso en Apple y Google Wallet, cafetería con pago nativo y panel en tiempo real en una sola app, publicada en App Store y Google Play.',
    tags: ['React', 'Capacitor', 'Supabase', 'Stripe', 'Apple Pay'],
    type: 'phone',
    // Imagen estática del card en el home (hero de marca, no rota).
    slides: ['/screenshots/befit-hero.png'],
    glow: '255, 140, 60',
    accent: '#FF8C3C',
    website: 'https://befitlab.app',
    platforms: ['iOS', 'Android', 'Web (PWA)'],
    heroImage: '/screenshots/befit-home.png',
    mockups: {
      web: {
        src: '/mockups/befit-mac.webp',
        fallback: '/screenshots/befit-web.jpg',
        caption: 'El sitio público en befitlab.app: clases, horarios, precios y cafetería.',
      },
      app: {
        src: '/mockups/befit-phones.webp',
        fallback: '/screenshots/befit-onboarding.png',
        caption: 'Bienvenida de marca y acceso al portal personal de cada clienta.',
      },
    },
    walkthrough: [
      // ───── Perfil CLIENTA ─────
      {
        role: 'Clienta',
        icon: 'Sparkles',
        title: 'Bienvenida premium',
        desc: 'La primera pantalla marca el tono: estética de marca «Eleva tu estándar», con acceso directo a crear cuenta o iniciar sesión.',
        image: '/screenshots/befit-onboarding.png',
      },
      {
        role: 'Clienta',
        icon: 'Lock',
        title: 'Inicio de sesión',
        desc: 'Acceso seguro al portal personal de cada clienta con correo y contraseña, y recuperación incluida.',
        image: '/screenshots/befit-login.png',
      },
      {
        role: 'Clienta',
        icon: 'Home',
        title: 'Inicio personalizado',
        desc: 'Saludo por nombre, estado de la membresía PREMIUM, accesos rápidos a Coffee Lab y cumpleaños, y tus próximas clases en una sola vista.',
        image: '/screenshots/befit-home.png',
      },
      {
        role: 'Clienta',
        icon: 'CalendarCheck',
        title: 'Reserva de clases',
        desc: 'Tu próxima clase y un calendario para reservar con cupos en tiempo real. Sin llamadas, sin WhatsApp, sin dobles reservas.',
        image: '/screenshots/befit-reservas.png',
      },
      {
        role: 'Clienta',
        icon: 'QrCode',
        title: 'Pase de acceso QR',
        desc: 'Membresía digital con código único y «Agregar a Apple Wallet»: la clienta entra al estudio escaneando desde su teléfono.',
        image: '/screenshots/befit-qr.png',
      },
      {
        role: 'Clienta',
        icon: 'Coffee',
        title: 'Coffee Lab',
        desc: 'La cafetería del estudio dentro de la app: novedades de temporada y un programa de recompensas «Coffee Lab Rewards» por cada compra.',
        image: '/screenshots/befit-cafeteria.png',
      },
      {
        role: 'Clienta',
        icon: 'ShoppingCart',
        title: 'Menú y carrito',
        desc: 'Menú visual por categorías (Ice Coffee, Especiales…). Personaliza cada bebida, agrégala al carrito y ordena con pago nativo y Apple Pay.',
        image: '/screenshots/befit-menu.png',
      },
      {
        role: 'Clienta',
        icon: 'TrendingUp',
        title: 'Evolución y progreso',
        desc: 'Define tu meta del mes, registra tu composición con la báscula Bluetooth del estudio y guarda tus fotos de progreso e insignias.',
        image: '/screenshots/befit-evolucion.png',
      },
      {
        role: 'Clienta',
        icon: 'Flame',
        title: 'Plan nutricional',
        desc: 'Plan «Healthy Era» con anillo de calorías del día, control de hidratación y recetas saludables marcables con «me lo comí».',
        image: '/screenshots/befit-nutricion.png',
      },

      // ───── Perfil ADMIN ─────
      {
        role: 'Admin',
        icon: 'LayoutDashboard',
        title: 'Control Center',
        desc: 'Pantalla de control con escaneo de QR de alumnas y métricas del día: reservas y ocupación promedio en tiempo real.',
        image: '/screenshots/befit-admin-control.png',
      },
      {
        role: 'Admin',
        icon: 'CalendarCheck',
        title: 'Calendario de clases',
        desc: 'Gestión del calendario del estudio con edición de horarios y carga masiva de clases para toda la semana.',
        image: '/screenshots/befit-admin-calendario.png',
      },
      {
        role: 'Admin',
        icon: 'Share2',
        title: 'Compartir horarios',
        desc: 'Genera una imagen lista de los horarios de la semana para compartir directo a Instagram o descargar.',
        image: '/screenshots/befit-admin-horarios.png',
      },
      {
        role: 'Admin',
        icon: 'CalendarPlus',
        title: 'Programar clase',
        desc: 'Agrega clases desde el catálogo asignando título, hora, coach y nivel, con un color visible para clientas y coaches.',
        image: '/screenshots/befit-admin-clase.png',
      },
      {
        role: 'Admin',
        icon: 'UserPlus',
        title: 'Inscribir clienta',
        desc: 'Alta de clientas con sus datos, membresía y contraseña temporal, incluyendo el cobro de la membresía.',
        image: '/screenshots/befit-admin-inscribir.png',
      },
      {
        role: 'Admin',
        icon: 'BarChart3',
        title: 'Reportes & Analítica',
        desc: 'Ingresos vía Stripe, socias activas, asistencias y pedidos de café, con histórico por 7, 30, 90 días o 1 año.',
        image: '/screenshots/befit-admin-reportes.png',
      },
      {
        role: 'Admin',
        icon: 'Users',
        title: 'Clientas & Staff',
        desc: 'Directorio con búsqueda y filtros por membresía y rol para administrar alumnas y personal del estudio.',
        image: '/screenshots/befit-admin-staff.png',
      },
      {
        role: 'Admin',
        icon: 'Award',
        title: 'Creador de insignias',
        desc: 'Define reglas automáticas (ej. asistir a 3 clases en una semana) que premian a las clientas con insignias.',
        image: '/screenshots/befit-admin-insignias.png',
      },
      {
        role: 'Admin',
        icon: 'Coffee',
        title: 'Catálogo de cafetería',
        desc: 'Administra los productos del Coffee Lab: precios, disponibilidad y opciones de personalización de cada bebida.',
        image: '/screenshots/befit-admin-cafeteria.png',
      },
      {
        role: 'Admin',
        icon: 'Utensils',
        title: 'Recetas y planes',
        desc: 'Crea y edita recetas y planes nutricionales que las clientas verán en su sección de nutrición.',
        image: '/screenshots/befit-admin-nutricion.png',
      },
      {
        role: 'Admin',
        icon: 'Bell',
        title: 'Enviar notificaciones',
        desc: 'Envía notificaciones push al instante a las clientas para avisos, recordatorios y novedades.',
        image: '/screenshots/befit-admin-notificaciones.png',
      },

      // ───── Perfil COACH ─────
      {
        role: 'Coach',
        icon: 'Dumbbell',
        title: 'Panel del día',
        desc: 'Resumen del día para el coach: alumnas y clases de hoy, acceso a compartir horarios y su calendario de sesiones.',
        image: '/screenshots/befit-coach-principal.png',
      },
      {
        role: 'Coach',
        icon: 'QrCode',
        title: 'Pase de coach',
        desc: 'Credencial digital del coach con estado «activo» y código QR para identificarse y registrar su acceso.',
        image: '/screenshots/befit-coach-qr.png',
      },

      // ───── Perfil BARISTA ─────
      {
        role: 'Barista',
        icon: 'ChefHat',
        title: 'Mostrador',
        desc: 'Rol dedicado donde el barista recibe los pedidos de Coffee Lab en tiempo real (Activos / Historial) y los marca conforme los prepara.',
        image: '/screenshots/befit-barista-mostrador.png',
      },

      // ───── Perfil RECEPCIÓN ─────
      {
        role: 'Recepción',
        icon: 'ScanLine',
        title: 'Control de acceso',
        desc: 'Pantalla de recepción para escanear el pase QR de las clientas y registrar su acceso al estudio.',
        image: '/screenshots/befit-recepcion.png',
      },
    ],
  },
  {
    id: 'pos',
    category: 'E-commerce & Retail',
    title: 'POS Admin System',
    tagline: 'Punto de venta multi-sucursal, en tiempo real.',
    description:
      'Sistema de punto de venta web y móvil con dashboard financiero, terminal de cobro, control de inventario y sincronización en tiempo real para negocios retail.',
    result:
      'Plásticos y Jarciería Tito digitalizó su operación: 215 productos por sucursal, cobro en terminal, cortes de caja e inventario en tiempo real, funcionando en web, iOS y Android.',
    tags: ['React', 'Supabase', 'Capacitor', 'Multi-sucursal'],
    type: 'desktop',
    // Card del home: capturas reales del POS (formato PC).
    slides: [
      '/screenshots/pos-emp-terminal.png',
      '/screenshots/pos-emp-caja.png',
    ],
    glow: '30, 80, 180',
    accent: '#1E50B4',
    platforms: ['Web', 'iOS', 'Android'],
    heroImage: null,
    mockups: {
      web: {
        src: '/mockups/pos-mac.webp',
        fallback: '/screenshots/pos-desktop-1.jpeg',
        caption: 'Historial de ventas y métricas financieras, en tiempo real.',
      },
      app: {
        src: '/mockups/pos-phones.webp',
        fallback: '/screenshots/pos-admin-login.png',
        caption: 'El dueño trae la tienda en el bolsillo.',
      },
    },
    walkthrough: [
      // ───── Perfil EMPLEADO — formato PC (navegador) ─────
      {
        role: 'Empleado',
        device: 'desktop',
        icon: 'Lock',
        title: 'Inicio de sesión',
        desc: 'Acceso del personal con correo y contraseña al sistema de Plásticos y Jarciería Tito.',
        image: '/screenshots/pos-emp-login.png',
      },
      {
        role: 'Empleado',
        device: 'desktop',
        icon: 'ScanLine',
        title: 'Checar entrada',
        desc: 'Registro de asistencia: el empleado escanea su gafete para marcar su horario de turno.',
        image: '/screenshots/pos-emp-asistencia.png',
      },
      {
        role: 'Empleado',
        device: 'desktop',
        icon: 'Wallet',
        title: 'Apertura de caja',
        desc: 'Antes de vender, registra el fondo inicial (billetes y monedas) y observaciones para abrir la caja del turno.',
        image: '/screenshots/pos-emp-caja.png',
      },
      {
        role: 'Empleado',
        device: 'desktop',
        icon: 'ShoppingCart',
        title: 'Punto de cobro',
        desc: 'Terminal de venta: escanea o busca productos (F4), arma el carrito con el ticket en vivo y cobra (F1).',
        image: '/screenshots/pos-emp-terminal.png',
      },

      // ───── Perfil ADMIN — formato teléfono ─────
      {
        role: 'Admin',
        device: 'phone',
        icon: 'Lock',
        title: 'Inicio de sesión',
        desc: 'La misma cuenta, en la app nativa: el dueño entra a la gestión del negocio desde su teléfono.',
        image: '/screenshots/pos-admin-login.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'LayoutDashboard',
        title: 'Panorama de operación',
        desc: 'Resumen del día: ventas totales, órdenes, ticket promedio y efectivo, con comparativas por periodo.',
        image: '/screenshots/pos-admin-dashboard.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'BarChart3',
        title: 'Pedidos y métricas',
        desc: 'Historial completo de pedidos con métricas financieras y desglose por método de pago (efectivo, tarjeta, transferencia).',
        image: '/screenshots/pos-admin-pedidos.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'Zap',
        title: 'Inventario',
        desc: '215 productos por sucursal con recepción de stock, alertas de stock crítico y búsqueda por SKU.',
        image: '/screenshots/pos-admin-inventario.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'CalendarCheck',
        title: 'Pedidos programados',
        desc: 'Pedidos del equipo por estado (pendientes, listos, entregados, cancelados) y por sucursal.',
        image: '/screenshots/pos-admin-programados.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'TrendingUp',
        title: 'Reportes y cortes de caja',
        desc: 'Historial de asistencias y cortes de caja: turnos abiertos/cerrados, total vendido y diferencias.',
        image: '/screenshots/pos-admin-reportes.png',
      },
      {
        role: 'Admin',
        device: 'phone',
        icon: 'Bell',
        title: 'Centro de avisos',
        desc: 'Notificaciones en tiempo real: stock bajo, productos agotados y entradas de personal registradas.',
        image: '/screenshots/pos-admin-avisos.png',
      },
    ],
  },
  {
    id: 'boda',
    category: 'Eventos & Tiempo Real',
    title: 'Galería de Bodas',
    tagline: 'El álbum del evento, construido por los invitados.',
    description:
      'Plataforma interactiva para eventos. Los invitados acceden con un código único, suben fotos desde la cámara y visualizan el álbum compartido en tiempo real.',
    result:
      'Los invitados arman el álbum del evento en vivo: entran con un código y suben fotos en tiempo real, sin descargar ninguna app ni juntar memorias después.',
    tags: ['React', 'Supabase Storage', 'Realtime', 'Cloudflare'],
    type: 'phone',
    slides: ['/screenshots/boda-entrada.jpg', '/screenshots/boda-album.jpg'],
    glow: '191, 90, 242',
    accent: '#BF5AF2',
    platforms: ['Web'],
    heroImage: '/screenshots/boda-album.jpg',
    // Sin `web`: este proyecto es solo móvil (se entra por QR desde el celular).
    mockups: {
      app: {
        src: '/mockups/boda-phones.webp',
        fallback: '/screenshots/boda-entrada.jpg',
        caption: 'Los invitados entran escaneando un QR en la mesa.',
      },
    },
    walkthrough: [
      {
        icon: 'QrCode',
        title: 'Sin apps: escanea y entra',
        desc: 'Cada mesa lleva un QR ("Captura el amor"). Los invitados lo escanean y entran a la galería al instante, desde el navegador y sin descargar nada.',
        image: '/screenshots/boda-qr.jpg',
      },
      {
        icon: 'Ticket',
        title: 'Acceso con tu nombre',
        desc: 'Cada invitado entra a la galería del evento poniendo su nombre, desde el navegador y sin descargar ninguna app.',
        image: '/screenshots/boda-entrada.jpg',
      },
      {
        icon: 'Camera',
        title: 'Sube tus fotos al instante',
        desc: 'Toma una foto o elígela de tu galería y súbela al álbum en segundos, en plena fiesta.',
        image: '/screenshots/boda-subir.jpg',
      },
      {
        icon: 'Zap',
        title: 'Álbum en tiempo real',
        desc: 'Las fotos de todos aparecen al instante en un álbum compartido estilo polaroid, con el nombre de quien las subió.',
        image: '/screenshots/boda-album.jpg',
      },
      {
        icon: 'LayoutDashboard',
        title: 'Panel del organizador',
        desc: 'Los novios entran con un código a un panel para administrar y moderar la galería del evento.',
        image: '/screenshots/boda-admin.jpg',
      },
    ],
  },
  {
    id: 'carperfit',
    category: 'Salud & Nutrición',
    title: 'CARPERfit',
    tagline: 'Planes de nutrición personalizados, paso a paso.',
    description:
      'App de asistencia nutricional con generador de planes dietéticos personalizados, control de citas, directorio de profesionales y seguimiento de matriz calórica diaria.',
    tags: ['React Native', 'Supabase', 'Nutrición'],
    type: 'phone',
    slides: [
      '/screenshots/carperfit-planes.png',
      '/screenshots/carperfit-menu.png',
    ],
    glow: '0, 200, 180',
    accent: '#00C8B4',
    platforms: ['iOS', 'Android'],
    heroImage: '/screenshots/carperfit-planes.png',
    walkthrough: [
      {
        icon: 'Sparkles',
        title: 'Generador de planes',
        desc: 'Crea planes dietéticos personalizados según el objetivo de cada persona.',
        image: '/screenshots/carperfit-planes.png',
      },
      {
        icon: 'Coffee',
        title: 'Menú del día',
        desc: 'Comidas organizadas y fáciles de seguir a lo largo del día.',
        image: '/screenshots/carperfit-menu.png',
      },
      {
        icon: 'Zap',
        title: 'Matriz calórica diaria',
        desc: 'Seguimiento del consumo y de las metas calóricas en tiempo real.',
        image: null,
      },
      {
        icon: 'Users',
        title: 'Directorio de nutriólogos',
        desc: 'Encuentra profesionales y agenda tus consultas desde la app.',
        image: null,
      },
    ],
  },
  {
    id: 'dental',
    category: 'Plataformas Clínicas',
    title: 'Portal Dental',
    tagline: 'Gestión clínica con expedientes digitales.',
    description:
      'Sistema de gestión clínica con agenda inteligente, expedientes digitales, consentimientos informados y registro de pacientes paso a paso.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'PDF Generation'],
    type: 'phone',
    slides: [
      '/screenshots/dental-consentimiento.jpeg',
      '/screenshots/dental-agenda.jpeg',
    ],
    glow: '10, 132, 255',
    accent: '#0A84FF',
    platforms: ['Web'],
    heroImage: '/screenshots/dental-agenda.jpeg',
    walkthrough: [
      {
        icon: 'CalendarCheck',
        title: 'Agenda inteligente',
        desc: 'Citas y disponibilidad organizadas para toda la clínica.',
        image: '/screenshots/dental-agenda.jpeg',
      },
      {
        icon: 'CreditCard',
        title: 'Consentimientos en PDF',
        desc: 'Generación y firma de consentimientos informados, listos para archivar.',
        image: '/screenshots/dental-consentimiento.jpeg',
      },
      {
        icon: 'FileText',
        title: 'Expedientes digitales',
        desc: 'Historial clínico centralizado y accesible por paciente.',
        image: null,
      },
    ],
  },
  {
    id: 'santuario',
    category: 'Sitio Web & Portal',
    title: 'Landing + Portal Premium',
    tagline: 'Presencia inmersiva con portal privado de membresías.',
    description:
      'Sitio web de alto impacto para gimnasio de calistenia y rendimiento. Landing page inmersiva con portal privado de membresías y acceso restringido.',
    tags: ['React', 'Framer Motion', 'Diseño Premium'],
    type: 'desktop',
    slides: ['/screenshots/santuario-desktop-1.png'],
    glow: '220, 40, 40',
    accent: '#DC2828',
    platforms: ['Web'],
    // Capturas de escritorio pendientes (las anteriores eran de un diseño viejo).
    heroImage: null,
    walkthrough: [
      {
        icon: 'Sparkles',
        title: 'Landing inmersiva',
        desc: 'Diseño premium con animaciones de alto impacto que comunican fuerza y exclusividad.',
        image: null,
      },
      {
        icon: 'Lock',
        title: 'Portal de membresías',
        desc: 'Área privada para miembros con contenido y beneficios exclusivos.',
        image: null,
      },
      {
        icon: 'QrCode',
        title: 'Acceso restringido',
        desc: 'Contenido protegido por autenticación para socios activos.',
        image: null,
      },
    ],
  },
];

// ─── Curaduría ───
// Solo se MUESTRAN los proyectos más recientes y visualmente completos
// (mejor pocos y fuertes que muchos a medias → más eficaz para convertir).
// Para volver a mostrar uno, agrega su id a esta lista (en el orden deseado).
// Archivados por ahora: 'carperfit', 'dental', 'santuario'.
const VISIBLES = ['befit', 'pos', 'boda'];

export const projects = VISIBLES
  .map((id) => allProjects.find((p) => p.id === id))
  .filter(Boolean);

// Catálogo completo por si se necesita (no se renderiza).
export const allProjectsCatalog = allProjects;
