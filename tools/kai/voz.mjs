/**
 * GRABA LA VOZ DE KAI con ElevenLabs: un mp3 por frase de src/data/kai.js, en
 * español y en inglés, y el índice public/kai/voz.json que usa el sitio para
 * saber qué audios existen (sin índice, Kai solo escribe).
 *
 * Uso (la llave la pones tú; no se guarda en ningún archivo):
 *   ELEVENLABS_API_KEY=xxxx KAI_VOZ=<id de la voz> node tools/kai/voz.mjs
 * Opciones:
 *   --todo        vuelve a grabar aunque el mp3 ya exista (por defecto se salta)
 *   --solo es     solo ese idioma (es | en)
 *   KAI_VOZ_EN    otra voz para inglés (si no, usa la misma)
 *   KAI_MODELO    modelo (por defecto eleven_multilingual_v2)
 * El id de la voz está en elevenlabs.io → Voices → (la voz) → "Copy voice ID".
 * Lo único que se manda a ElevenLabs es el texto de cada frase.
 */
import { mkdir, writeFile, access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { KAI_FRASES, KAI_OCURRENCIAS } from '../../src/data/kai.js';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const salida = path.join(raiz, 'public/kai');
const llave = process.env.ELEVENLABS_API_KEY;
const voces = { es: process.env.KAI_VOZ, en: process.env.KAI_VOZ_EN || process.env.KAI_VOZ };
const modelo = process.env.KAI_MODELO || 'eleven_multilingual_v2';
const todo = process.argv.includes('--todo');
const solo = process.argv.includes('--solo') ? process.argv[process.argv.indexOf('--solo') + 1] : null;

if (!llave || !voces.es) {
  console.error('Faltan ELEVENLABS_API_KEY y/o KAI_VOZ. Lee el encabezado de este archivo.');
  process.exit(1);
}

const frases = { ...KAI_FRASES, ...KAI_OCURRENCIAS };
const existe = (f) => access(f).then(() => true, () => false);

for (const idioma of ['es', 'en']) {
  if (solo && solo !== idioma) continue;
  await mkdir(path.join(salida, idioma), { recursive: true });
  for (const [id, textos] of Object.entries(frases)) {
    const archivo = path.join(salida, idioma, `${id}.mp3`);
    if (!todo && (await existe(archivo))) {
      console.log(`· ${idioma}/${id} ya existe`);
      continue;
    }
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voces[idioma]}?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': llave, 'content-type': 'application/json' },
      body: JSON.stringify({
        text: textos[idioma],
        model_id: modelo,
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
      }),
    });
    if (!r.ok) {
      console.error(`✗ ${idioma}/${id}: ${r.status} ${(await r.text()).slice(0, 300)}`);
      process.exit(1);
    }
    await writeFile(archivo, Buffer.from(await r.arrayBuffer()));
    console.log(`✓ ${idioma}/${id}`);
  }
}

// Índice: lo que de verdad hay en disco
const indice = {};
for (const idioma of ['es', 'en']) {
  const dir = path.join(salida, idioma);
  indice[idioma] = (await existe(dir)) ? (await readdir(dir)).filter((f) => f.endsWith('.mp3')).map((f) => f.slice(0, -4)).sort() : [];
}
await writeFile(path.join(salida, 'voz.json'), `${JSON.stringify(indice, null, 2)}\n`);
console.log(`Índice escrito: ${indice.es.length} en español, ${indice.en.length} en inglés.`);
