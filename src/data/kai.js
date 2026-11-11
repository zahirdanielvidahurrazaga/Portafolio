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
