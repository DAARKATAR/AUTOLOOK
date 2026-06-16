# Vercel: conectar GitHub y activar despliegue automático (monorepo)

Sigue estos pasos para que al pushear a GitHub Vercel despliegue automáticamente `backend` y `frontend`:

1. Subir repo a GitHub

```bash
git init
git add .
git commit -m "Initial secure backend + frontend"
# crea repo en GitHub y añade remote
git remote add origin git@github.com:TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

2. Crear dos proyectos en Vercel (uno para cada subdirectorio)

- En Vercel Dashboard: "New Project" → "Import Git Repository" → seleccionar tu repo
- Cuando Vercel pregunte por Root Directory, pon `backend` para el primer proyecto (Project Name: `catalogo-backend`)
- Repite para `frontend` (Root Directory: `frontend`, Project Name: `catalogo-frontend`)

3. Configurar variables de entorno en cada proyecto (Production & Preview)

- En `catalogo-backend` (Backend):
  - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `ADMIN_SECRET_TOKEN`, `IP_WHITELIST`, `FRONTEND_URL`, `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX_REQUESTS`

- En `catalogo-frontend` (Frontend):
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_SECRET_TOKEN`, `VITE_BACKEND_URL`

4. Activar Deploys automáticos

- En cada proyecto Vercel → Settings → Git → "Automatic Deployments": ON
- Configurar la rama protegida (main) si deseas

5. Prueba

- Hacer un cambio en `frontend` o `backend`, commit y push
- Vercel detectará el cambio y hará build y deploy del proyecto correspondiente

6. Notas

- `vercel.json` en cada subdirectorio ayuda a Vercel a detectar cómo construir el proyecto
- Si necesitas un único dominio con routes API a `/api/*`, configura custom domains y rewrites en Vercel Dashboard

