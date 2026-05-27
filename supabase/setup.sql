-- ============================================================
-- SQL para Supabase: Tabla de Leads (Solicitudes de Cotización)
-- Ejecuta este script en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Crear la tabla principal de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  tipo_proyecto TEXT NOT NULL CHECK (tipo_proyecto IN ('app', 'biometrico', 'ecommerce', 'ia')),
  descripcion TEXT NOT NULL,
  estado TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'en_proceso', 'cerrado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices para búsquedas rápidas
CREATE INDEX idx_leads_email ON public.leads (email);
CREATE INDEX idx_leads_estado ON public.leads (estado);
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);

-- 3. Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para auto-actualizar updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 6. Política: Permitir que cualquier visitante (anon) pueda INSERTAR un lead
--    (esto es lo que permite que el formulario de la web funcione sin login)
CREATE POLICY "Permitir insertar leads desde la web"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 7. Política: Solo usuarios autenticados (tú desde el dashboard) pueden LEER leads
CREATE POLICY "Solo autenticados pueden leer leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 8. Política: Solo usuarios autenticados pueden ACTUALIZAR leads (cambiar estado)
CREATE POLICY "Solo autenticados pueden actualizar leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- ¡Listo! Después de ejecutar esto, ve a Settings > API y copia:
--   - Project URL  →  VITE_SUPABASE_URL
--   - anon public  →  VITE_SUPABASE_ANON_KEY
-- Pégalos en tu archivo .env en la raíz del proyecto.
-- ============================================================
