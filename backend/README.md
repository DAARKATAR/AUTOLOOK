# Admin Backend - Next.js

Servidor backend seguro para autenticación del panel admin con validación de IP.

## Características

- ✅ Validación de IP whitelist (soporta CIDR)
- ✅ JWT con IP binding (token vinculado a IP)
- ✅ Rate limiting por IP
- ✅ Integración con Supabase Auth
- ✅ Logging de intentos fallidos
- ✅ Headers de seguridad (XSS, CSRF, Clickjacking)
- ✅ CORS configurado
- ✅ Vercel-ready

## Instalación

```bash
cd backend
npm install
```

## Variables de Entorno

Copiar `.env.example` a `.env.local` y configurar:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT Secret (mínimo 32 caracteres)
JWT_SECRET=your-super-secret-key-min-32-chars-long

# Token de admin (mismo valor que en .env frontend)
ADMIN_SECRET_TOKEN=<REDACTED_ADMIN_SECRET_TOKEN>

# Whitelist de IPs (separadas por coma, soporta CIDR: 192.168.1.0/24)
IP_WHITELIST=127.0.0.1,::1,192.168.1.100

# URLs
FRONTEND_URL=http://localhost:5173

# Rate limiting (en ms)
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=5
```

## Desarrollo

```bash
npm run dev
```

El backend corre en `http://localhost:3001`

## Endpoints

### POST /api/admin/login
Autentica un usuario y devuelve JWT token.

**Request:**
```json
{
  "email": "admin@autolook.com",
  "password": "secure-password",
   "token": "<REDACTED_ADMIN_SECRET_TOKEN>"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@autolook.com"
  }
}
```

**Validaciones:**
1. IP debe estar en whitelist
2. Rate limit (5 intentos / 15 min por IP)
3. Token secreto válido
4. Email/password válidos en Supabase
5. Usuario debe existir en tabla `public.admins`

### POST /api/admin/verify
Verifica que un JWT token sea válido y no haya cambiado la IP.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "admin@autolook.com",
    "role": "admin"
  }
}
```

### GET /api/admin/health
Health check del servidor.

```json
{
  "status": "ok",
  "timestamp": "2024-06-16T10:30:00.000Z",
  "clientIP": "192.168.1.100",
  "version": "1.0.0"
}
```

## Flujo de Seguridad

```
1. Cliente hace request a /api/admin/login
   ↓
2. Backend valida IP whitelist
   ↓
3. Backend verifica token secreto
   ↓
4. Backend autentica en Supabase
   ↓
5. Backend verifica que usuario está en public.admins
   ↓
6. Backend crea JWT con IP binding
   ↓
7. Cliente almacena JWT en sessionStorage
   ↓
8. Para operaciones, cliente envía JWT
   ↓
9. Frontend verifica JWT en Supabase RLS policies
```

## Deployment en Vercel

1. Conectar repositorio a Vercel
2. Agregar variables de entorno en Vercel Dashboard
3. Configurar root directory: `backend`
4. Desplegar

## IP Whitelist

La variable `IP_WHITELIST` soporta:
- IPs individuales: `192.168.1.100`
- Rangos CIDR: `192.168.1.0/24`
- IPv6: `2001:db8::/32`

```bash
# Ejemplo con múltiples IPs
IP_WHITELIST=127.0.0.1,192.168.1.0/24,203.0.113.50
```

## Logging de Seguridad

Cuando `LOG_FAILED_ATTEMPTS=true`, se registran:
- Intentos desde IPs no autorizadas
- Intentos fallidos de autenticación
- Intentos de rate limit excedido

Se pueden guardar en:
- Tabla Supabase `admin_access_logs`
- Servicio de logging externo
- Email de alerta (TODO)

## Verificación de IP

El backend obtiene la IP del cliente desde:
1. Header `x-forwarded-for` (Vercel)
2. Header `cf-connecting-ip` (Cloudflare)
3. Header `x-real-ip` (Nginx reverse proxy)
4. `req.ip` (fallback)

## JWT Token

- **Algoritmo**: HS256
- **Tiempo de expiración**: 24 horas (configurable)
- **Vinculación de IP**: El token solo es válido desde la IP que lo generó
- **Claims**: sub, email, role, boundIP, iat, exp

## Rate Limiting

- 5 intentos por IP
- Ventana de 15 minutos
- Se reinicia después de la ventana

**Nota**: En producción, considera usar Redis para rate limiting distribuido.

## Seguridad

- ✅ JWT con IP binding
- ✅ Rate limiting
- ✅ HTTPS enforced (Vercel)
- ✅ CORS restrictivo
- ✅ Headers de seguridad (XSS, Clickjacking, MIME type sniffing)
- ✅ Validación de entrada
- ✅ Tokens no se almacenan en backend

## Troubleshooting

### "IP not whitelisted"
Verifica que la IP está en `IP_WHITELIST` y es accesible desde Vercel.

### "Rate limit exceeded"
Espera 15 minutos o contacta al administrador para resetear.

### "Invalid credentials"
Asegúrate que el token secreto coincide entre frontend y backend.

### Token no válido después de cambiar de IP
Es por diseño. El token está vinculado a la IP que lo generó. Inicia sesión nuevamente desde la nueva IP.
