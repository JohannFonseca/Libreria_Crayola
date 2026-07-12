-- 1. Crear tabla de marcas (brands)
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  color TEXT DEFAULT '#10B981',
  bg_color TEXT DEFAULT 'bg-emerald-50',
  text_color TEXT DEFAULT 'text-emerald-600',
  visible_en_web BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enlazar productos con marcas
ALTER TABLE public.products 
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL;

-- 3. Habilitar seguridad de nivel de fila (RLS) en brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de lectura pública y acceso completo para administradores
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Admin full access brands" ON public.brands FOR ALL TO authenticated USING (true);

-- NOTA: Si ya habías creado la tabla de marcas anteriormente, ejecuta esta línea en el SQL Editor de Supabase:
-- ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS visible_en_web BOOLEAN DEFAULT true;
