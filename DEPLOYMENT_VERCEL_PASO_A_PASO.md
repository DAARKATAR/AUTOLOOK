# 🚀 Deployment Vercel - Paso a Paso Visual

## PASO 1: Preparar Proyecto

### 1.1 Estructura correcta
```
proyecto/
├── backend/
│   ├── src/
│   ├── package.json
│   ├── next.config.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env
│
└── supabase_security.sql
```

### 1.2 Verificar que backend funciona localmente

```bash
cd backend
npm install
npm run dev
# Debe estar en http://localhost:3001
```

Test local:
```bash
curl http://localhost:3001
# Debe mostrar "Admin Backend API"
```

---

## PASO 2: Deploy Backend en Vercel

### 2.1 Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Ir al directorio backend

```bash
cd backend
```

### 2.3 Ejecutar vercel

```bash
vercel
```

Vercel va a preguntar:

```
? Set up and deploy "~/Proyecto_Catalogo/backend"? [Y/n] Y
? Which scope do you want to deploy to? [Scope name]
? Link to existing project? [y/N] N
? What's your project's name? catalogo-backend
? In which directory is your code located? ./ (o ./backend si ejecutas desde raíz)
? Want to modify vercel.json? [y/N] N
```

✅ Backend deployado en: `https://catalogo-backend.vercel.app`

---

## PASO 3: Configurar Variables de Entorno en Vercel

### 3.1 Ir a Vercel Dashboard

https://vercel.com/dashboard

### 3.2 Seleccionar proyecto "catalogo-backend"

![Vercel Dashboard](./dashboard-select.png)

### 3.3 Settings → Environment Variables

![Settings](./settings-click.png)

### 3.4 Agregar variables

**Para todos los ambientes (Production y Preview):**

Hacer click en "Add New" y rellenar:

#### Variable 1: SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://yhaqhvabffziqavztjdp.supabase.co
```
✅ Guardar

#### Variable 2: SUPABASE_ANON_KEY
```
Name: SUPABASE_ANON_KEY
Value: sb_publishable_RZfSIWf_V1eFCeuUCcDdMQ_3Jwum4j1
```
✅ Guardar

#### Variable 3: SUPABASE_SERVICE_KEY
```
Name: SUPABASE_SERVICE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (completa)
```
✅ Guardar

#### Variable 4: JWT_SECRET
```
Name: JWT_SECRET
Value: [resultado de: openssl rand -hex 32]
Ejemplo: 8f3a9c2d1b4e6f7a9c1d3e5f7a9b2c4d6e8f9a1b3c5d7e9f1a3b5c7d9e1f3b
```
✅ Guardar

#### Variable 5: ADMIN_SECRET_TOKEN
```
Name: ADMIN_SECRET_TOKEN
Value: <REDACTED_ADMIN_SECRET_TOKEN>
```
✅ Guardar

#### Variable 6: IP_WHITELIST
```
Name: IP_WHITELIST
Value: [Tu IP pública - curl https://api.ipify.org]
Ejemplo: 203.0.113.42
```
✅ Guardar

#### Variable 7: FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://tu-proyecto-frontend.vercel.app
(Cambiar cuando sepas el dominio del frontend)
```
✅ Guardar

#### Variable 8: RATE_LIMIT_WINDOW
```
Name: RATE_LIMIT_WINDOW
Value: 900000
```
✅ Guardar

#### Variable 9: RATE_LIMIT_MAX_REQUESTS
```
Name: RATE_LIMIT_MAX_REQUESTS
Value: 5
```
✅ Guardar

### 3.5 Vista final de variables

```
✅ SUPABASE_URL = https://yhaqhvabffziqavztjdp.supabase.co
✅ SUPABASE_ANON_KEY = sb_publishable_...
✅ SUPABASE_SERVICE_KEY = eyJhbGc...
✅ JWT_SECRET = 8f3a9c2d1b4e6f7a...
✅ ADMIN_SECRET_TOKEN = 5f8e7c3a...
✅ IP_WHITELIST = 203.0.113.42
✅ FRONTEND_URL = https://tu-app.vercel.app
✅ RATE_LIMIT_WINDOW = 900000
✅ RATE_LIMIT_MAX_REQUESTS = 5
```

### 3.6 Redeploy automático

Vercel redeploya automáticamente con las nuevas variables.

```bash
# O fuerza redeploy:
vercel --prod
```

---

## PASO 4: Obtener URL del Backend

Ir a https://vercel.com/dashboard/catalogo-backend

URL será: `https://catalogo-backend.vercel.app`

---

## PASO 5: Actualizar Frontend

### 5.1 Editar `frontend/.env`

```bash
cd ../frontend
```

Reemplazar:
```env
VITE_BACKEND_URL=http://localhost:3001
```

Por:
```env
VITE_BACKEND_URL=https://catalogo-backend.vercel.app
```

### 5.2 Crear `frontend/.env.production`

```bash
# Opcional: Para tener diferentes URLs en dev vs prod
VITE_BACKEND_URL=https://catalogo-backend.vercel.app
```

### 5.3 Verificar que frontend se conecta

Test local:
```bash
npm run dev
```

Ir a http://localhost:5173/admin y verificar que:
- Muestra el formulario
- Headers de red muestran requests a `https://catalogo-backend.vercel.app`

---

## PASO 6: Deploy Frontend en Vercel

### 6.1 Ir a frontend

```bash
cd frontend
```

### 6.2 Ejecutar vercel

```bash
vercel
```

Responder:
```
? Set up and deploy? Y
? Which scope? [Tu scope]
? Link to existing project? N (si es primera vez)
? Project name? catalogo-frontend
? Which directory? ./
```

✅ Frontend deployado en: `https://catalogo-frontend.vercel.app`

### 6.3 Agregar variables de entorno frontend

En Vercel Dashboard → catalogo-frontend → Settings → Environment Variables

```
VITE_SUPABASE_URL=https://yhaqhvabffziqavztjdp.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_ADMIN_SECRET_TOKEN=5f8e7c3a...
VITE_BACKEND_URL=https://catalogo-backend.vercel.app
```

### 6.4 Redeploy frontend

```bash
vercel --prod
```

---

## PASO 7: Configurar Supabase para Producción

### 7.1 Ir a Supabase Dashboard

https://app.supabase.com/projects

### 7.2 Editar CORS en Authentication

Settings → API Configuration → CORS

Agregar:
```
https://catalogo-frontend.vercel.app
```

### 7.3 Verificar tabla admins

SQL Editor:
```sql
SELECT * FROM public.admins;
```

Debe tener tu UID. Si está vacía:
```sql
INSERT INTO public.admins (id) VALUES ('tu-uuid-aqui');
```

---

## PASO 8: Testing en Producción

### 8.1 Acceder a la app

Ir a: `https://catalogo-frontend.vercel.app/admin`

### 8.2 Intentar login con credenciales inválidas

**Caso 1: IP no en whitelist**
```
Desde diferente red/VPN
Resultado: "Access denied: IP not authorized" ✅
```

**Caso 2: Token inválido**
```
Token: 1234567890
Email: admin@autolook.com
Password: correct
Resultado: "Invalid credentials" ✅
```

**Caso 3: Email no existe**
```
Token: 5f8e7c3a...
Email: fake@test.com
Password: anything
Resultado: "Invalid email or password" ✅
```

**Caso 4: Credenciales correctas**
```
Token: 5f8e7c3a...
Email: admin@autolook.com
Password: your-real-password
Resultado: JWT guardado, acceso a dashboard ✅
```

### 8.3 Verificar JWT en localStorage

DevTools → Application → Session Storage

```
admin-jwt: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.4 Cerrar y reabrir navegador

```
JWT debe estar borrado
Debe volver a pedir login ✅
```

### 8.5 Cambiar de red/VPN

```
JWT debe ser inválido
Debe volver a pedir login desde nueva IP ✅
```

---

## PASO 9: Monitoreo en Vercel

### 9.1 Ver logs del backend

En Vercel Dashboard → catalogo-backend → Deployments → Logs

```bash
# O desde CLI:
vercel logs catalogo-backend
```

### 9.2 Ver metrics

Vercel Dashboard → Analytics

```
Requests: [número]
Response time: [ms]
Error rate: [%]
```

### 9.3 Alertas

Ir a Settings → Notifications

Configurar email para:
- Failed deployments
- High error rate

---

## PASO 10: Dominio Personalizado (Opcional)

### 10.1 Backend con dominio

Vercel → catalogo-backend → Settings → Domains

Agregar: `api.tudominio.com`

Configurar DNS records en registrador

### 10.2 Frontend con dominio

Vercel → catalogo-frontend → Settings → Domains

Agregar: `tudominio.com`

Configurar DNS records

### 10.3 Actualizar variables de entorno

Frontend → Settings → Environment Variables

```
VITE_BACKEND_URL=https://api.tudominio.com
```

Redeploy:
```bash
vercel --prod
```

---

## Troubleshooting

### ❌ "Build failed" en Vercel

**Causa**: Falta dependencia o error de compilación

**Solución**:
```bash
# Local
npm ci
npm run build
npm run dev

# Si funciona local, ver error en Vercel logs:
vercel logs --tail
```

### ❌ "IP not whitelisted" en producción

**Causa**: IP_WHITELIST no tiene tu IP o cambió

**Solución**:
```bash
# Obtén tu IP
curl https://api.ipify.org

# Vercel → Environment Variables → Edita IP_WHITELIST
# Redeploy:
vercel --prod
```

### ❌ "Invalid JWT" después de cambiar variables

**Causa**: JWT_SECRET cambió

**Solución**: 
- No cambiar JWT_SECRET en producción (invalida todos los tokens)
- Obligar nuevos logins

### ❌ CORS error

**Causa**: FRONTEND_URL no coincide

**Verificar**:
```
Backend FRONTEND_URL: https://catalogo-frontend.vercel.app
Frontend VITE_BACKEND_URL: https://catalogo-backend.vercel.app
```

---

## Checklist Final

- [ ] Backend deployado en Vercel
- [ ] Todas las variables de entorno backend configuradas
- [ ] Frontend actualizado con VITE_BACKEND_URL
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno frontend configuradas
- [ ] CORS configurado en Supabase
- [ ] Tabla public.admins tiene tu UID
- [ ] Test login con credenciales válidas
- [ ] Test rechazo desde IP no autorizada
- [ ] Test JWT se borra al cerrar navegador
- [ ] Dominios personalizados (si corresponde)

---

## URLs Finales

```
Producción Backend: https://catalogo-backend.vercel.app
Producción Frontend: https://catalogo-frontend.vercel.app
Supabase: https://app.supabase.com
Dashboard Admin: https://catalogo-frontend.vercel.app/admin
```

---

**Estado: LISTO PARA PRODUCCIÓN ✅**
