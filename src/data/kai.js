/**
 * LO QUE DICE KAI (el guía, ver lib/kai.js). Una línea corta por capítulo, con
 * la llave = el "Nº" de su SectionHead, y las ocurrencias de cuando lo tocan.
 * Versión 2, APROBADA por Zahir el 11-nov-2026 (la 1ª decía "soy más idea que cosa" y
 * "qué te duele": no le gustó). El inglés es traducción de Claude.
 * Si se cambia un texto y hay voz grabada, volver a correr `tools/kai/voz.mjs`
 * (cada audio se llama como su llave: public/kai/<idioma>/<llave>.mp3).
 */
export const KAI_FRASES = {
  '02': {
    es: 'Hola, soy Kai, tu guía. Empecemos por lo que podemos hacer por tu negocio.',
    en: 'Hi, I’m Kai, your guide. Let’s start with what we can do for your business.',
  },
  '03': {
    es: 'Esto no lo digo yo. Lo dicen sus clientes.',
    en: 'Don’t take my word for it. Their clients say it.',
  },
  '04': {
    es: 'Aquí puedes probar antes de comprar. Elige la demo de tu giro.',
    en: 'Here you can try before you buy. Pick the demo for your industry.',
  },
  '05': {
    es: 'Estos proyectos ya están funcionando, con clientes de verdad.',
    en: 'These projects are already up and running, with real customers.',
  },
  '06': {
    es: 'Te presento al equipo. Dos personas, un solo estudio.',
    en: 'Meet the team. Two people, one studio.',
  },
  '07': {
    es: 'Cinco pasos claros, de la idea a la entrega. Sin sorpresas.',
    en: 'Five clear steps, from idea to delivery. No surprises.',
  },
  '08': {
    es: '¿Dudas? Aquí están las que más nos hacen.',
    en: 'Questions? Here are the ones we get the most.',
  },
  '09': {
    es: 'Llegué hecho partículas y ya estoy completo. Así queremos dejar tu proyecto. ¿Hablamos?',
    en: 'I arrived as particles and now I’m complete. That’s how we want to leave your project. Shall we talk?',
  },
};

export const KAI_OCURRENCIAS = {
  'toque-1': { es: 'Si me tocas otra vez me mareo.', en: 'Poke me again and I’ll get dizzy.' },
  'toque-2': { es: 'Sigue bajando, todavía me falta tomar forma.', en: 'Keep scrolling, I’m still taking shape.' },
  'toque-3': { es: 'Yo solo guío. Los que cotizan son ellos.', en: 'I’m just the guide. They’re the ones who quote.' },
  'toque-4': { es: 'Cada sección me deja un poco mejor. Eso es kaizen.', en: 'Every section leaves me a bit better. That’s kaizen.' },
};

// En Servicios, Kai se queda junto a la hélice y dice una línea por servicio (llave =
// "srv-" + `forma` de Servicios.jsx). ⚠️ BORRADOR de Claude (11-nov), SIN VOZ grabada aún:
// mientras no se grabe, estas solo se leen.
export const KAI_SERVICIOS = {
  'srv-pluma': { es: 'Empieza aquí si tu negocio todavía no tiene cara.', en: 'Start here if your business doesn’t have a face yet.' },
  'srv-social': { es: 'Tú atiende el negocio. De publicar nos encargamos nosotros.', en: 'You run the business. We take care of the posting.' },
  'srv-cohete': { es: 'Marca, redes y página, en un solo paquete.', en: 'Brand, social and website, in one package.' },
  'srv-navegador': { es: 'Si no apareces en Google, para muchos no existes.', en: 'If you’re not on Google, for many people you don’t exist.' },
  'srv-carrito': { es: 'Vende aunque la tienda esté cerrada.', en: 'Sell even when the shop is closed.' },
  'srv-ia': { es: 'Lo repetitivo, que lo haga la máquina.', en: 'Let the machine handle the repetitive stuff.' },
  'srv-telefono': { es: 'Tu negocio, en el celular de tus clientes.', en: 'Your business, on your customers’ phones.' },
};

// En Demos (celular: carrusel), Kai se trepa en la demo del frente y dice una línea por giro
// (llave = "demo-" + id de GIROS en Demos.jsx). ⚠️ BORRADOR de Claude (12-nov), SIN VOZ:
// confirmar con Zahir y Karime que cada demo sí hace eso (salen de los `que` de Demos.jsx).
export const KAI_DEMOS = {
  'demo-alma': { es: 'Reservan su clase y entran con su pase, sin llamarte.', en: 'They book their class and walk in with their pass, no calls.' },
  'demo-atlas': { es: 'Sabes cuánta gente hay en el gym, en vivo.', en: 'You know how many people are in the gym, live.' },
  'demo-hoja': { es: 'El pedido llega sin que nadie conteste el teléfono.', en: 'Orders come in without anyone answering the phone.' },
  'demo-dalia': { es: 'Eligen el ramo y lo piden desde su celular.', en: 'They pick the bouquet and order it from their phone.' },
  'demo-raiz': { es: 'Tus pacientes siguen su plan todos los días, no solo en consulta.', en: 'Your patients follow their plan every day, not just at the appointment.' },
  'demo-bisagra': { es: 'La caja y las ventas del día, a la vista.', en: 'The register and the day’s sales, at a glance.' },
};

// PAPELES POR ESCENA (14-nov-2026, como Buddy de adamperlis.com: en cada escena Kai tiene
// un lugar y algo que hacer). ⚠️ BORRADOR de Claude, SIN VOZ grabada: solo se leen hasta
// que Zahir y Karime las aprueben y se graben.
export const KAI_ESCENAS = {
  // Testimonios: trepado en la esquina del video del cliente, viéndolo
  'caso-befit': { es: 'Ellas lo cuentan mejor que yo. Dale play.', en: 'They tell it better than I do. Hit play.' },
  'caso-pos': { es: 'Carlos cobra con esto todos los días. Escúchalo a él.', en: 'Carlos runs his register on this every day. Hear it from him.' },
  // Proceso: baja escalón por escalón junto al paso que estás leyendo
  'paso-01': { es: 'Primero te escuchamos. Nada de cotizar a ciegas.', en: 'First we listen. No blind quotes.' },
  'paso-02': { es: 'Todo por escrito antes de empezar.', en: 'Everything in writing before we start.' },
  'paso-03': { es: 'Aquí es donde tu idea toma forma.', en: 'This is where your idea takes shape.' },
  'paso-04': { es: 'Lo probamos antes de que lo pruebe tu cliente.', en: 'We test it before your customer does.' },
  'paso-05': { es: 'Y te lo dejamos funcionando, a tu nombre.', en: 'And we hand it over running, in your name.' },
  // Despedida, al final de la página
  despedida: { es: 'Fin del recorrido. Yo me quedo aquí cuidando el botón de WhatsApp.', en: 'End of the tour. I’ll stay right here guarding the WhatsApp button.' },
  // Proyectos: en su píldora, del proyecto que señalas con el cursor
  proyectos: { es: 'Pasa el cursor por un proyecto y te cuento de qué va.', en: 'Hover over a project and I’ll tell you what it’s about.' },
  'proyecto-natural': { es: 'Una familia que hace aguas, con su propia vitrina en línea.', en: 'A family that makes fruit waters, with its own online showcase.' },
  'proyecto-befit': { es: 'Un estudio de pilates que ya no agenda por WhatsApp.', en: 'A pilates studio that stopped booking over WhatsApp.' },
  'proyecto-pos': { es: 'Una tienda que cobra con esto todo el día.', en: 'A store that rings up sales with this all day.' },
  'proyecto-boda': { es: 'Las fotos de la boda, en vivo, desde el celular de los invitados.', en: 'Wedding photos, live, from the guests’ phones.' },
  // OUTFITS: al tocarlo da una vuelta y sale con otro (lib/kai.js → ORDEN_OUTFITS)
  'outfit-casco': { es: 'Casco puesto. Ellos programan, yo superviso.', en: 'Hard hat on. They code, I supervise.' },
  'outfit-lentes': { es: 'Lentes oscuros. No te ignoro, es que ya soy famoso.', en: 'Shades on. I’m not ignoring you, I’m just famous now.' },
  'outfit-gala': { es: 'De gala. Para un sitio web, sí. Así de formal soy.', en: 'Black tie. For a website, yes. That’s how formal I am.' },
  'outfit-audifonos': { es: 'Audífonos puestos. Prende el sonido y platicamos.', en: 'Headphones on. Turn the sound on and let’s talk.' },
  'outfit-normal': { es: 'Y otra vez como salí de fábrica.', en: 'And back to factory settings.' },
  // Contacto: al enviar el formulario (mientras lo llenas mira el campo, sin hablar)
  'contacto-listo': { es: '¡Eso! Ahora solo dale enviar en WhatsApp.', en: 'Nice! Now just hit send in WhatsApp.' },
  // Proyectos (sobre el mockup que sigue al cursor), Nosotros (entre las dos mitades) y
  // FAQ (junto a la pregunta abierta): ahí acompaña SIN hablar (sus llaves no tienen frase).
};
