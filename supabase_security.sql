-- ==========================================
-- SCRIPT DE SEGURIDAD PARA SUPABASE (RLS)
-- ==========================================
-- Ejecuta este script en la consola SQL de tu panel de Supabase.

-- 1. Habilitar RLS en la tabla 'productos' (si no está habilitado ya)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes (incluso las que vienen por defecto) para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir insertar productos solo a usuarios autenticados" ON public.products;
DROP POLICY IF EXISTS "Permitir actualizar productos solo a usuarios autenticados" ON public.products;
DROP POLICY IF EXISTS "Permitir borrar productos solo a usuarios autenticados" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.products;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.products;

-- 3. SELECT: Público (Todos pueden ver el catálogo)
CREATE POLICY "Enable read access for all users" 
ON public.products 
FOR SELECT 
TO public
USING (true);

-- 4. INSERT: Solo admin@autolook.com
CREATE POLICY "Enable insert for admin only" 
ON public.products 
FOR INSERT 
TO authenticated 
WITH CHECK ( (auth.jwt() ->> 'email'::text) = 'admin@autolook.com' );

-- 5. UPDATE: Solo admin@autolook.com
CREATE POLICY "Enable update for admin only" 
ON public.products 
FOR UPDATE 
TO authenticated 
USING ( (auth.jwt() ->> 'email'::text) = 'admin@autolook.com' )
WITH CHECK ( (auth.jwt() ->> 'email'::text) = 'admin@autolook.com' );

-- 6. DELETE: Solo admin@autolook.com
CREATE POLICY "Enable delete for admin only" 
ON public.products 
FOR DELETE 
TO authenticated 
USING ( (auth.jwt() ->> 'email'::text) = 'admin@autolook.com' );


-- ==========================================
-- SEGURIDAD PARA STORAGE (BUCKET 'catalogo')
-- ==========================================

-- Asegurarse de que el bucket es público para lectura, pero seguro para escritura
-- NOTA: Si el bucket no existe, crearlo primero desde la UI o con este insert:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('catalogo', 'catalogo', true) ON CONFLICT DO NOTHING;

DROP POLICY IF EXISTS "Public Access to Catalogo Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access to Catalogo" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access to Catalogo" ON storage.objects;

-- Lectura pública de imágenes
CREATE POLICY "Public Access to Catalogo Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'catalogo');

-- Inserción solo para admin
CREATE POLICY "Admin Upload Access to Catalogo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalogo' AND (auth.jwt() ->> 'email'::text) = 'admin@autolook.com');

-- Borrado solo para admin
CREATE POLICY "Admin Delete Access to Catalogo"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalogo' AND (auth.jwt() ->> 'email'::text) = 'admin@autolook.com');

-- ==========================================
-- RECOMENDACIÓN DE REGISTRO
-- ==========================================
-- Para máxima seguridad en tu Admin Panel:
-- 1. Ve a "Authentication" -> "Providers" -> "Email" en Supabase.
-- 2. Desactiva "Enable Signups" (Confirm user signups).
-- 3. De esta forma, nadie podrá registrarse y tú deberás invitar a los admins
--    desde la pestaña "Users" de tu panel de Supabase manualmente.
