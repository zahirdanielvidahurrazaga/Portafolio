// Catálogo central de proyectos del portafolio.
// El orden de este arreglo = orden de aparición (los más recientes primero).
//
// Cada proyecto define:
//  - slides:    capturas para el mockup de la lista (auto-cycle).
//  - website:   URL pública para el botón "Visitar sitio web".
//  - platforms: ['iOS', 'Android', 'Web'] (chips).
//  - heroImage: captura del hero del modal.
//  - walkthrough: RECORRIDO función por función. Cada item:
//       { icon, title, desc, image }
//       icon  = nombre de ícono de lucide-react (ver ICONS en ProjectModal).
//       image = ruta de la captura de ESA función (o null = placeholder elegante).
//     👉 Para enriquecerlo: pon la captura en /public/screenshots y referénciala aquí.

export const projects = [
  {
    id: 'befit',
    category: 'Fitness & Wellness',
    title: 'BE FIT LAB',
    tagline: 'El estudio de pilates, en el bolsillo de tus clientas.',
    description:
      'PWA y app nativa (iOS / Android) para un estudio de pilates premium: reserva de clases, membresías con acceso por QR, una cafetería con pago nativo estilo Uber Eats y un panel de administración en tiempo real.',
    tags: ['React', 'Capacitor', 'Supabase', 'Stripe', 'Apple Pay'],
    type: 'phone',
    // Imagen estática del card en el home (hero de marca, no rota).
    slides: ['/screenshots/befit-hero.png'],
    glow: '255, 140, 60',
    accent: '#FF8C3C',
    website: 'https://befitlab.app',
    platforms: ['iOS', 'Android', 'Web (PWA)'],
    heroImage: '/screenshots/befit-home.png',
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
    tags: ['React', 'Supabase', 'Capacitor', 'Dashboard Analytics'],
    type: 'desktop',
    slides: [
      '/screenshots/pos-desktop-1.jpeg',
      '/screenshots/pos-desktop-2.jpeg',
      '/screenshots/pos-desktop-3.jpeg',
    ],
    glow: '30, 80, 180',
    accent: '#1E50B4',
    platforms: ['iOS', 'Android', 'Web'],
    // Capturas de escritorio pendientes (las anteriores eran de un diseño viejo).
    heroImage: null,
    walkthrough: [
      {
        icon: 'CreditCard',
        title: 'Terminal de cobro',
        desc: 'Búsqueda en vivo del catálogo y cobro inmediato. Pensado para vender rápido en mostrador.',
        image: null,
      },
      {
        icon: 'Zap',
        title: 'Inventario en tiempo real',
        desc: 'Recepción atómica de stock, control por sucursal y existencias siempre sincronizadas.',
        image: null,
      },
      {
        icon: 'BarChart3',
        title: 'Dashboard financiero',
        desc: 'Métricas de ventas y desempeño del negocio consolidadas en una vista clara.',
        image: null,
      },
      {
        icon: 'Users',
        title: 'Roles y multi-sucursal',
        desc: 'Accesos diferenciados admin / empleado y ventas atribuidas a la sucursal correcta.',
        image: null,
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
    tags: ['React', 'Supabase Storage', 'Realtime', 'Cloudflare'],
    type: 'phone',
    slides: ['/screenshots/boda-galeria.jpeg'],
    glow: '191, 90, 242',
    accent: '#BF5AF2',
    platforms: ['Web'],
    heroImage: '/screenshots/boda-galeria.jpeg',
    walkthrough: [
      {
        icon: 'Ticket',
        title: 'Acceso por código',
        desc: 'Cada invitado entra a la galería del evento con un código único, sin descargar nada.',
        image: '/screenshots/boda-galeria.jpeg',
      },
      {
        icon: 'Camera',
        title: 'Subida desde la cámara',
        desc: 'Captura y sube fotos al instante desde el celular durante la fiesta.',
        image: null,
      },
      {
        icon: 'Zap',
        title: 'Álbum en tiempo real',
        desc: 'Las fotos de todos aparecen en la galería compartida en el momento en que se suben.',
        image: null,
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
