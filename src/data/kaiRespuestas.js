/**
 * PREGÚNTALE A KAI (14-nov-2026): respuestas PREPARADAS, sin IA (decidido con Zahir:
 * gratis, sin servidor y Kai nunca dice algo que no aprobaron). components/KaiPregunta.jsx
 * busca la que mejor empata con lo que escribe el visitante (palabras clave, sin acentos);
 * si ninguna empata, lo manda a WhatsApp.
 * ⚠️ BORRADOR de Claude: Zahir y Karime deben aprobarlas. Salen del FAQ (Faq.jsx), de
 * Servicios y de los datos de contacto: nada de precios ni cifras inventadas.
 * `claves` = pedazos de palabra SIN acentos (empatan dentro de otras: "precio" → "precios").
 * `ir` = botón opcional bajo la respuesta: '#seccion' o 'whatsapp'.
 */
export const KAI_RESPUESTAS = [
  {
    id: 'que-hacen',
    pregunta: { es: '¿Qué hacen?', en: 'What do you do?' },
    claves: ['que hacen', 'a que se dedican', 'servicio', 'que ofrecen', 'en que ayudan', 'what do you do', 'services', 'offer'],
    r: {
      es: 'Ayudamos a negocios a verse bien, aparecer en internet y trabajar más fácil: logo y marca, redes sociales, páginas web, tiendas y punto de venta, automatización y apps para celular.',
      en: 'We help businesses look good, show up online and run more easily: logo and branding, social media, websites, stores and point of sale, automation and phone apps.',
    },
    ir: '#about',
  },
  {
    id: 'precio',
    pregunta: { es: '¿Cuánto cuesta?', en: 'How much does it cost?' },
    claves: ['cuanto cuesta', 'precio', 'costo', 'cobran', 'cotiza', 'presupuesto', 'barato', 'caro', 'price', 'cost', 'quote', 'budget'],
    r: {
      es: 'Cada proyecto se cotiza a la medida, sin paquetes cerrados. Podemos arrancar con lo esencial y crecer por fases. Escríbenos y te decimos qué conviene para tu caso.',
      en: 'Every project is quoted individually, no fixed packages. We can start with the essentials and grow in phases. Message us and we’ll tell you what makes sense for you.',
    },
    ir: 'whatsapp',
  },
  {
    id: 'pagos',
    pregunta: { es: '¿Cómo puedo pagar?', en: 'How can I pay?' },
    claves: ['como pago', 'como puedo pagar', 'forma de pago', 'metodo de pago', 'efectivo', 'transferencia', 'tarjeta', 'credito', 'debito', 'payment', 'pay', 'card', 'cash', 'transfer'],
    r: {
      es: 'Puedes pagar en efectivo, por transferencia o con tarjeta de débito o crédito. Con tarjeta se suma la comisión del banco, que corre por cuenta del cliente.',
      en: 'You can pay in cash, by bank transfer or with a debit or credit card. Card payments add the bank fee, which is covered by the client.',
    },
  },
  {
    id: 'plazos',
    pregunta: { es: '¿Puedo pagar en plazos?', en: 'Can I pay in installments?' },
    claves: ['plazo', 'mensualidad', 'parcialidad', 'pagos chiquitos', 'a meses', 'en partes', 'anticipo', 'financ', 'installment', 'monthly', 'deposit'],
    r: {
      es: 'Sí. Los plazos de pago se adaptan a cada proyecto: lo acordamos contigo y queda por escrito en la propuesta.',
      en: 'Yes. Payment terms are tailored to each project: we agree on them with you and put them in writing in the proposal.',
    },
    ir: 'whatsapp',
  },
  {
    id: 'tiempo',
    pregunta: { es: '¿Cuánto tardan?', en: 'How long does it take?' },
    claves: ['cuanto tarda', 'tiempo', 'cuando esta', 'semanas', 'meses', 'rapido', 'entrega', 'how long', 'time', 'deadline'],
    r: {
      es: 'Depende de lo que necesites: una marca o una landing page toma semanas; un sistema o una app, alrededor de 2 meses desde que firmamos hasta que está funcionando. El tiempo exacto va por escrito en la propuesta.',
      en: 'It depends on what you need: a brand or a landing page takes weeks; a system or an app, about 2 months from signing until it’s running. The exact timeline goes in writing in the proposal.',
    },
  },
  {
    id: 'demos',
    pregunta: { es: '¿Puedo probar algo antes?', en: 'Can I try something first?' },
    claves: ['probar', 'demo', 'ejemplo', 'ver como', 'antes de comprar', 'try', 'example'],
    r: {
      es: 'Sí. Tenemos demos funcionando por giro: estudio de pilates, gimnasio, restaurante, florería, clínica y punto de venta. Pídenos el acceso por WhatsApp y las pruebas como si fueran tuyas.',
      en: 'Yes. We have working demos by industry: pilates studio, gym, restaurant, flower shop, clinic and point of sale. Ask us for access on WhatsApp and try them as if they were yours.',
    },
    ir: '#demos',
  },
  {
    id: 'propiedad',
    pregunta: { es: '¿Lo que hacen es mío?', en: 'Do I own it?' },
    claves: ['es mio', 'mio', 'propiedad', 'dueno', 'codigo', 'own', 'ownership'],
    r: {
      es: 'Sí. Al liquidar el proyecto, tu marca, tu sitio, tu código y tus datos son tuyos, sin ataduras con nosotros.',
      en: 'Yes. Once the project is paid in full, your brand, website, code and data are yours, no strings attached.',
    },
  },
  {
    id: 'redes',
    pregunta: { es: '¿Manejan redes sociales?', en: 'Do you manage social media?' },
    claves: ['redes', 'instagram', 'facebook', 'tiktok', 'publicacion', 'reels', 'community', 'social'],
    r: {
      es: 'Sí. Planeamos el calendario, diseñamos y escribimos las publicaciones, hacemos reels, respondemos a tu comunidad y te mandamos un reporte cada mes.',
      en: 'Yes. We plan the calendar, design and write the posts, make reels, reply to your community and send you a report every month.',
    },
  },
  {
    id: 'anuncios',
    pregunta: { es: '¿Incluye publicidad pagada?', en: 'Is paid advertising included?' },
    claves: ['publicidad', 'anuncio', 'pauta', 'campana', 'ads', 'meta ads', 'google ads', 'advertis'],
    r: {
      es: 'Podemos crear y administrar tus campañas, pero el dinero de los anuncios lo pagas directo a Meta, TikTok o Google. Así siempre controlas cuánto inviertes.',
      en: 'We can create and run your campaigns, but the ad budget is paid directly to Meta, TikTok or Google. That way you always control how much you invest.',
    },
  },
  {
    id: 'apps',
    pregunta: { es: '¿Hacen apps para celular?', en: 'Do you build phone apps?' },
    claves: ['app', 'aplicacion', 'celular', 'iphone', 'android', 'app store', 'google play', 'play store'],
    r: {
      es: 'Sí, y las publicamos en App Store y Google Play. Las cuentas de desarrollador van a nombre de tu negocio, para que la app sea tuya. Be Fit Lab es una de ellas.',
      en: 'Yes, and we publish them on the App Store and Google Play. The developer accounts are in your business’s name, so the app is yours. Be Fit Lab is one of them.',
    },
    ir: '#portfolio',
  },
  {
    id: 'web',
    pregunta: { es: '¿Hacen páginas web?', en: 'Do you build websites?' },
    claves: ['pagina', 'sitio', 'web', 'landing', 'google', 'dominio', 'website', 'seo'],
    r: {
      es: 'Sí: páginas a la medida, sin plantillas, que se ven bien en celular, aparecen en Google y llevan a tus clientes directo a tu WhatsApp.',
      en: 'Yes: custom websites, no templates, that look great on phones, show up on Google and send customers straight to your WhatsApp.',
    },
  },
  {
    id: 'pos',
    pregunta: { es: '¿Tienen punto de venta?', en: 'Do you have a point of sale?' },
    claves: ['punto de venta', 'pos', 'caja', 'inventario', 'tienda', 'vender', 'cobrar', 'ticket', 'store', 'inventory'],
    r: {
      es: 'Sí. Hacemos tiendas en línea y puntos de venta con inventario, cortes de caja y tickets. Plásticos y Jarciería Tito cobra con el nuestro todos los días.',
      en: 'Yes. We build online stores and points of sale with inventory, cash closing and receipts. Plásticos y Jarciería Tito rings up sales with ours every day.',
    },
  },
  {
    id: 'ia',
    pregunta: { es: '¿Usan inteligencia artificial?', en: 'Do you use AI?' },
    claves: ['inteligencia', 'ia', 'automat', 'bot', 'asistente', 'ai', 'chatbot'],
    r: {
      es: 'Sí, cuando ayuda: automatizamos lo repetitivo (avisos, reportes, listas de espera) y armamos asistentes que contestan por ti. Lo importante es que le ahorre horas a tu equipo.',
      en: 'Yes, when it helps: we automate the repetitive stuff (alerts, reports, waitlists) and build assistants that answer for you. The point is to save your team hours.',
    },
  },
  {
    id: 'marca',
    pregunta: { es: '¿Diseñan logos?', en: 'Do you design logos?' },
    claves: ['logo', 'marca', 'identidad', 'branding', 'diseno', 'brand'],
    r: {
      es: 'Sí. Diseñamos tu logo y sus variantes, tu paleta y tipografías, y un manual para que tu negocio se vea igual en todos lados. Somos Natural es un ejemplo.',
      en: 'Yes. We design your logo and its variations, palette and typography, plus a guide so your business looks the same everywhere. Somos Natural is an example.',
    },
  },
  {
    id: 'soporte',
    pregunta: { es: '¿Dan soporte después?', en: 'Do you offer support after?' },
    claves: ['soporte', 'mantenimiento', 'despues', 'falla', 'actualiza', 'support', 'maintenance'],
    r: {
      es: 'Sí. Tenemos planes de soporte y mantenimiento para que tu sitio o sistema siga actualizado, seguro y funcionando.',
      en: 'Yes. We have support and maintenance plans to keep your site or system up to date, secure and running.',
    },
  },
  {
    id: 'proceso',
    pregunta: { es: '¿Cómo trabajan?', en: 'How do you work?' },
    claves: ['como trabajan', 'proceso', 'pasos', 'como empiezo', 'empezar', 'contrato', 'how do you work', 'process', 'start'],
    r: {
      es: 'En cinco pasos: primero te escuchamos, luego todo va por escrito, lo construimos, lo probamos y te lo entregamos funcionando a tu nombre.',
      en: 'In five steps: first we listen, then everything goes in writing, we build it, test it and hand it over running in your name.',
    },
    ir: '#process',
  },
  {
    id: 'quienes',
    pregunta: { es: '¿Quiénes son?', en: 'Who are you?' },
    claves: ['quienes son', 'quien', 'equipo', 'nosotros', 'karime', 'zahir', 'who are you', 'team'],
    r: {
      es: 'Somos KaiZen, un estudio de dos: Karime lleva la marca, el diseño y las redes, y Zahir la tecnología. Un solo equipo de la idea a la entrega.',
      en: 'We’re KaiZen, a two-person studio: Karime leads brand, design and social media, and Zahir leads technology. One team from idea to delivery.',
    },
    ir: '#sobre-mi',
  },
  {
    id: 'donde',
    pregunta: { es: '¿Dónde están?', en: 'Where are you?' },
    claves: ['donde', 'ubicacion', 'puebla', 'ciudad', 'presencial', 'oficina', 'where', 'location'],
    r: {
      es: 'Estamos en Puebla, pero trabajamos con negocios de cualquier parte: casi todo se resuelve por WhatsApp y videollamada.',
      en: 'We’re in Puebla, Mexico, but we work with businesses anywhere: almost everything happens over WhatsApp and video calls.',
    },
  },
  {
    id: 'contacto',
    pregunta: { es: '¿Cómo los contacto?', en: 'How do I reach you?' },
    claves: ['contacto', 'contactar', 'whatsapp', 'telefono', 'correo', 'mail', 'hablar', 'llamar', 'contact', 'call', 'email'],
    r: {
      es: 'Por WhatsApp es lo más rápido: te respondemos en menos de 24 horas. También puedes escribir a info@kaizenstudiomx.com.',
      en: 'WhatsApp is fastest: we reply within 24 hours. You can also email info@kaizenstudiomx.com.',
    },
    ir: 'whatsapp',
  },
  {
    id: 'kai',
    pregunta: { es: '¿Quién eres tú?', en: 'Who are you, Kai?' },
    claves: ['quien eres', 'que eres', 'kai', 'robot', 'who are you kai'],
    r: {
      es: 'Soy Kai, el guía de KaiZen. Te acompaño por el sitio y contesto lo básico. Lo difícil se lo paso al equipo.',
      en: 'I’m Kai, KaiZen’s guide. I walk you through the site and answer the basics. The hard stuff I pass to the team.',
    },
  },
];

// Las que salen como sugerencia al abrir
export const KAI_SUGERIDAS = ['que-hacen', 'precio', 'tiempo', 'demos', 'apps'];

export const KAI_NO_SE = {
  es: 'Esa no me la sé todavía. Mejor pregúntale al equipo por WhatsApp, te responden en menos de 24 horas.',
  en: 'I don’t know that one yet. Better ask the team on WhatsApp, they reply within 24 hours.',
};

const limpiar = (s) =>
  ` ${s}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ ]+/g, ' ')
    .replace(/\s+/g, ' ') + ' ';

/** La respuesta que mejor empata con lo que escribió (o null) */
export function buscarRespuesta(texto) {
  const q = limpiar(texto);
  let mejor = null;
  let puntos = 0;
  for (const x of KAI_RESPUESTAS) {
    let p = 0;
    for (const c of x.claves) {
      const cl = limpiar(c).trim();
      // las cortas ("ia", "app", "pos") solo como palabra completa: "ia" no debe empatar con "dia"
      const hay = cl.length <= 3 ? q.includes(` ${cl} `) : q.includes(cl);
      if (hay) p += cl.includes(' ') ? 2 : 1;
    }
    if (p > puntos) {
      puntos = p;
      mejor = x;
    }
  }
  return mejor;
}
