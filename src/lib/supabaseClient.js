import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Sin .env el portafolio sigue funcionando; sólo el formulario queda inactivo.
  console.warn(
    '[Supabase] Falta VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'El formulario de contacto no enviará datos hasta crear el archivo .env.'
  );
}

// Stub que imita la cadena supabase.from(...).insert(...) cuando no hay credenciales,
// para que createClient no lance "supabaseUrl is required" y la app renderice.
const stub = {
  from() {
    return {
      insert: async () => ({
        error: { message: 'Supabase no está configurado (falta .env).' },
      }),
    };
  },
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : stub;
