# 🚀 Guía Completa: Backend Seguro con Next.js

## Arquitectura de 4 Capas de Seguridad

```
┌─────────────────────────────────────────────────┐
│  CAPA 1: IP Whitelist (Backend)                 │
│  Valida que la IP esté autorizada               │
└─────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────┐
│  CAPA 2: Token Secreto (Backend)                │
│  Verifica el token administrativo               │
└─────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────┐
│  CAPA 3: Supabase Auth (Backend)                │
│  Autentica email/password                       │
└─────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────┐
│  CAPA 4: JWT + RLS (Backend + DB)               │
│  Token con IP binding + Políticas de fila       │
└─────────────────────────────────────────────────┘
```

## Estructura del Proyecto

```
proyecto/
├── frontend/                    (React 19 + Vite)
│   ├── .env                    (VITE_BACKEND_URL)
│   ├── src/apps/admin_panel/
│   │   └── components/AdminGateway.jsx (ahora usa backend)
│   └── package.json
│
├── backend/                    (Next.js - NUEVO)
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/admin/login/route.js
│   │   │   ├── api/admin/verify/route.js
│   │   │   ├── api/admin/health/route.js
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   └── globals.css
│   │   └── lib/
│   │       ├── ip-validation.js
│   │       ├── jwt.js
│   │       └── supabase.js
│   ├── package.json
│   ├── next.config.js
│   ├── .env.local (desarrollo)
│   ├── .env.example
│   └── README.md
│
└── supabase/
    ├── supabase_security.sql   (RLS policies)
    └── public.admins table
```

---

## PASO 1: Configurar Variables de Entorno

### Backend (.env.local)

```bash
# Copiar backend/.env.example a backend/.env.local
cp backend/.env.example backend/.env.local
```

Editar `backend/.env.local`:

```env
# Supabase
SUPABASE_URL=https://yhaqhvabffziqavztjdp.supabase.co
SUPABASE_ANON_KEY=sb_publishable_RZfSIWf_V1eFCeuUCcDdMQ_3Jwum4j1
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secret (mínimo 32 caracteres - copiar del .env que generaste con openssl)
JWT_SECRET=tu-secret-super-seguro-de-32-caracteres-minimo

# Token de admin (mismo valor en backend y frontend)
ADMIN_SECRET_TOKEN=<REDACTED_ADMIN_SECRET_TOKEN>

# IP Whitelist - Solo permita tu IP (obtén con: curl https://api.ipify.org)
IP_WHITELIST=TU_IP_PUBLICA_AQUI

# Rate limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=5

# Frontend URL (para CORS)
FRONTEND_URL=http://localhost:5173

# Logging
LOG_FAILED_ATTEMPTS=true
```

### Frontend (.env)

Actualizar `frontend/.env`:

```env
VITE_SUPABASE_URL=https://yhaqhvabffziqavztjdp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_RZfSIWf_V1eFCeuUCcDdMQ_3Jwum4j1
VITE_ADMIN_SECRET_TOKEN=<REDACTED_ADMIN_SECRET_TOKEN>
VITE_BACKEND_URL=http://localhost:3001
```

---

## PASO 2: Desarrollo Local

### 1. Instalar dependencias backend

```bash
cd backend
npm install
```

### 2. Generar JWT_SECRET seguro

```bash
# En PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 })) | Select-Object -First 1

# O usar openssl
openssl rand -hex 32
```

Copiar el resultado a `backend/.env.local` → `JWT_SECRET`

### 3. Obtener tu IP pública

```bash
# PowerShell
Invoke-WebRequest -Uri "https://api.ipify.org?format=json" | Select-Object -ExpandProperty Content

# O simplemente visitar: https://api.ipify.org
```

Agregar a `backend/.env.local` → `IP_WHITELIST`

### 4. Ejecutar frontend y backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Corre en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Corre en http://localhost:5173
```

### 5. Probar flujo de login

1. Ir a `http://localhost:5173/admin`
2. Deberías ver el formulario AdminGateway
3. Ingresar:
  - Token: `<REDACTED_ADMIN_SECRET_TOKEN>`
   - Email: `admin@autolook.com` (el que creaste en Supabase)
   - Password: Tu contraseña en Supabase
4. Si todo OK → JWT se almacena en sessionStorage
5. ¡Acceso al admin panel!

---

## PASO 3: Deployment en Vercel

### 3.1 Crear proyecto backend en Vercel

```bash
cd backend
vercel
```

Seguir las instrucciones. Vercel detectará que es Next.js.

### 3.2 Configurar variables de entorno en Vercel

En [Vercel Dashboard](https://vercel.com/dashboard):

1. Ir a Settings → Environment Variables
2. Agregar variables (para Production y Preview):

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | `https://yhaqhvabffziqavztjdp.supabase.co` |
| `SUPABASE_ANON_KEY` | `sb_publishable_RZfSIWf_V1eFCeuUCcDdMQ_3Jwum4j1` |
| `SUPABASE_SERVICE_KEY` | (tu service key completa) |
| `JWT_SECRET` | (el que generaste con openssl) |
| `ADMIN_SECRET_TOKEN` | `<REDACTED_ADMIN_SECRET_TOKEN>` |
| `IP_WHITELIST` | Tu IP pública (o múltiples: `IP1,IP2,IP3`) |
| `FRONTEND_URL` | `https://tu-proyecto.vercel.app` (o tu dominio) |
| `RATE_LIMIT_WINDOW` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `5` |

### 3.3 Actualizar frontend con URL del backend

En `frontend/.env`:

```env
VITE_BACKEND_URL=https://tu-backend.vercel.app
```

En `frontend/.env.production`:

```env
VITE_BACKEND_URL=https://tu-backend.vercel.app
```

### 3.4 Desplegar frontend actualizado

```bash
cd frontend
vercel --prod
```

---

## PASO 4: Configurar en Supabase

### 4.1 Crear tabla de logs (opcional pero recomendado)

```sql
-- En Supabase SQL Editor
CREATE TABLE admin_access_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  ip_address text NOT NULL,
  success boolean NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE admin_access_logs ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden leer
CREATE POLICY "Only admins can read logs"
  ON admin_access_logs FOR SELECT
  USING (public.is_admin());
```

### 4.2 Verificar tabla public.admins

La tabla debe existir con tu UID de admin:

```sql
SELECT * FROM public.admins;
```

Si está vacía, agregar tu UID:

```sql
INSERT INTO public.admins (id) 
VALUES ('tu-uuid-aqui');
```

---

## PASO 5: Obtener tu IP Pública

### En diferentes redes:

**WiFi casera:**
```
curl https://api.ipify.org
→ 203.0.113.42
```

**Móvil (hotspot):**
```
curl https://api.ipify.org
→ 198.51.100.58
```

**Oficina:**
```
curl https://api.ipify.org
→ 192.0.2.100
```

### Agregar múltiples IPs

Si trabajas desde diferentes lugares:

```env
IP_WHITELIST=203.0.113.42,198.51.100.58,192.0.2.100
```

O usar rangos CIDR:

```env
IP_WHITELIST=192.168.1.0/24,10.0.0.0/8
```

---

## PASO 6: Testing Completo

### Test local:

```bash
# 1. Backend en puerto 3001
cd backend && npm run dev

# 2. Frontend en puerto 5173
cd frontend && npm run dev

# 3. Acceder a http://localhost:5173/admin

# 4. Intentar con token/email/password inválidos
# ✅ Debe mostrar errores apropiados

# 5. Usar credenciales válidas
# ✅ JWT debe guardarse en sessionStorage

# 6. Cerrar navegador y volver a abrir
# ✅ JWT debe estar borrado, necesitar reautenticarse
```

### Test en producción:

```bash
# 1. Verificar que backend está deployado
curl https://tu-backend.vercel.app

# 2. Verificar IP whitelist
curl -I https://tu-backend.vercel.app/api/admin/health

# 3. Probar login real
# ✅ Desde tu IP: debe funcionar
# ❌ Desde otra IP: debe rechazar

# 4. Verificar que JWT tiene IP binding
# Cambiar VPN/red → JWT debe ser inválido
```

---

## PASO 7: Monitoreo y Mantenimiento

### Ver logs de Vercel

```bash
cd backend
vercel logs
```

### Ver intentos fallidos

En Supabase → admin_access_logs table

### Actualizar IP whitelist en producción

```bash
# Sin redeploy (Vercel dashboard):
Settings → Environment Variables → Editar IP_WHITELIST → Save
```

### Revocar acceso urgentemente

```sql
-- Borrar un admin
DELETE FROM public.admins WHERE id = 'uuid-aqui';

-- O crear una tabla de banned users
CREATE TABLE admin_banned (
  id uuid PRIMARY KEY,
  banned_at timestamptz DEFAULT now()
);
```

---

## TROUBLESHOOTING

### ❌ "IP not whitelisted"
**Solución:**
- Verificar tu IP: `curl https://api.ipify.org`
- Agregar a `IP_WHITELIST` en Vercel
- Redeploy o esperar cache

### ❌ "Invalid credentials"
**Causas posibles:**
- Token secreto no coincide
- Email/password incorrecto
- Usuario no existe en tabla `public.admins`

### ❌ "Token verification failed: IP mismatch"
**Causas:**
- Cambió tu IP (VPN, Wi-Fi, Móvil)
- **Solución:** Volver a loguear

### ❌ Backend lento
**Motivo:**
- Vercel cold start (primera request)
- **Solución:** Usar Vercel Pro con always-on

### ❌ CORS error
**Solución:**
- Verificar `FRONTEND_URL` en backend `.env`
- Verificar que `VITE_BACKEND_URL` es correcto en frontend

### ❌ "Rate limit exceeded"
**Causas:**
- 5+ intentos fallidos en 15 minutos
- **Solución:** Esperar 15 minutos o editar `RATE_LIMIT_*`

---

## Checklist Final

- [ ] JWT_SECRET generado y almacenado
- [ ] IP pública configurada en `IP_WHITELIST`
- [ ] Backend deployado en Vercel
- [ ] Todas las variables de entorno configuradas
- [ ] Frontend apunta al backend correcto
- [ ] Tabla `public.admins` tiene tu UID
- [ ] Test local exitoso
- [ ] Test en producción exitoso
- [ ] Logs funcionando (admin_access_logs)
- [ ] Documentación guardada en lugar seguro

---

## Referencias

- [Next.js Deployment on Vercel](https://vercel.com/docs/nextjs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [José (JWT library)](https://github.com/panva/jose)
- [OWASP IP Whitelist](https://owasp.org/www-community/attacks/Bypassing_IP_Whitelist)
