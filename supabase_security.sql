-- ==========================================
-- SCRIPT DE SEGURIDAD PARA SUPABASE (RLS)
-- ==========================================
-- Ejecuta este script en la consola SQL de tu panel de Supabase.

-- 1. Habilitar RLS en la tabla 'productos' (si no está habilitado ya)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON public.products;
DROP POLICY IF EXISTS "Permitir insertar productos solo a usuarios autenticados" ON public.products;
DROP POLICY IF EXISTS "Permitir actualizar productos solo a usuarios autenticados" ON public.products;
DROP POLICY IF EXISTS "Permitir borrar productos solo a usuarios autenticados" ON public.products;

-- 3. Crear política de lectura PÚBLICA (Cualquiera puede ver el catálogo)
CREATE POLICY "Permitir lectura pública de productos"
ON public.products
FOR SELECT
TO public
USING (true);

-- 4. Crear política de INSERCIÓN (Solo usuarios logueados / admins)
CREATE POLICY "Permitir insertar productos solo a usuarios autenticados"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 5. Crear política de ACTUALIZACIÓN (Solo usuarios logueados / admins)
CREATE POLICY "Permitir actualizar productos solo a usuarios autenticados"
ON public.products
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Crear política de BORRADO (Solo usuarios logueados / admins)
CREATE POLICY "Permitir borrar productos solo a usuarios autenticados"
ON public.products
FOR DELETE
TO authenticated
USING (true);


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

-- Inserción solo para autenticados
CREATE POLICY "Admin Upload Access to Catalogo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'catalogo');

-- Borrado solo para autenticados
CREATE POLICY "Admin Delete Access to Catalogo"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'catalogo');

-- ==========================================
-- RECOMENDACIÓN DE REGISTRO
-- ==========================================
-- Para máxima seguridad en tu Admin Panel:
-- 1. Ve a "Authentication" -> "Providers" -> "Email" en Supabase.
-- 2. Desactiva "Enable Signups" (Confirm user signups).
-- 3. De esta forma, nadie podrá registrarse y tú deberás invitar a los admins
--    desde la pestaña "Users" de tu panel de Supabase manualmente.
