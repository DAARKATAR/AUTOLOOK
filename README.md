# Manual de Instalación y Usuario: Proyecto Autolook

Bienvenido al manual oficial del proyecto **Autolook**. Este documento está dividido en dos secciones principales: una guía técnica para instalar y desplegar el proyecto, y un manual de uso para administradores y visitantes de la web.

---

## 🛠️ PARTE 1: Manual de Instalación (Para Desarrolladores)

El sistema Autolook es una Single Page Application (SPA) moderna, construida con React 19, Vite y respaldada por Supabase.

### 1. Requisitos Previos del Sistema
Antes de comenzar, asegúrate de tener instalado en tu computadora lo siguiente:
*   **Node.js**: Versión LTS recomendada (v18 o v20). [Descargar Node.js](https://nodejs.org/).
*   **Git**: Para control de versiones (opcional si descargas el `.zip`).
*   **Editor de Código**: Visual Studio Code es altamente recomendado.

### 2. Pasos de Instalación Local
Sigue estos pasos para correr el proyecto en tu entorno de desarrollo local:

1.  **Abre tu terminal** y navega hasta la carpeta raíz del proyecto (donde se encuentra la carpeta `frontend`).
2.  **Entra a la carpeta del frontend**:
    ```bash
    cd frontend
    ```
3.  **Instala las dependencias**:
    Utiliza NPM (viene con Node.js) para instalar todas las librerías necesarias:
    ```bash
    npm install
    ```
    *(Si usas Yarn, ejecuta `yarn install`)*.

### 3. Configuración de Variables de Entorno (Supabase)
El proyecto requiere una conexión a la base de datos (Supabase) para funcionar.

1.  Dentro de la carpeta `frontend`, crea o verifica que exista un archivo llamado **exactamente** `.env`.
2.  Abre el archivo `.env` y pega las credenciales de tu proyecto de Supabase. El formato debe ser estrictamente este:
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase_aqui
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima_publica_aqui
    ```
    > [!IMPORTANT]
    > Nunca compartas públicamente tu archivo `.env`. Este archivo ya se encuentra excluido del control de versiones gracias a `.gitignore`.

### 4. Ejecutar el Servidor de Desarrollo
Una vez instaladas las dependencias y configurado el `.env`, inicia el servidor local:
```bash
npm run dev
```
La terminal te mostrará una dirección local (por lo general `http://localhost:5173/`). Ábrela en tu navegador para ver la página web en funcionamiento.

### 5. Despliegue a Producción (Vercel)
El proyecto está optimizado para ser desplegado gratuitamente en **Vercel**:
1. Crea una cuenta en [Vercel](https://vercel.com).
2. Conecta tu repositorio de GitHub o arrastra la carpeta del proyecto.
3. En la configuración del proyecto en Vercel, en la sección **Environment Variables**, añade las mismas dos claves del archivo `.env` (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
4. Haz clic en "Deploy". En un par de minutos, tu sitio web estará público y con certificado HTTPS.

---

## 👥 PARTE 2: Manual de Usuario

### A. Para el Administrador del Negocio (Backoffice)
El panel administrativo te permite tener control total sobre el catálogo de la tienda de forma autónoma.

#### 1. Cómo acceder al Panel
1. En tu navegador web, dirígete a la ruta segura de tu página: `tu-pagina.com/admin-acceso-seguro`.
2. Ingresa tus credenciales de administrador (Email y Contraseña) configuradas previamente en Supabase Authentication.
3. Haz clic en "Entrar". Serás redirigido automáticamente al Dashboard.

#### 2. Gestión de Productos
Dentro del Dashboard (`/admin`), verás el listado de todo tu inventario:
*   **Crear un nuevo producto:** En el formulario principal, rellena los campos (Nombre, Categoría, Marca, Precio, Stock, URL de Imagen). Selecciona si pertenece a *Autolook* o *Motolook* y presiona "Guardar Producto".
*   **Editar un producto:** En la tabla de inventario, busca el producto que deseas modificar y haz clic en el botón de **Editar** (icono de lápiz). El formulario se llenará con los datos del producto; modifícalos y presiona "Actualizar Producto".
*   **Control de Stock:** El sistema lleva la cuenta de todo tu inventario. En la parte superior verás contadores con el total de productos y unidades. *Si el stock de un producto llega a 0, automáticamente aparecerá como "Agotado" para los clientes.*

> [!WARNING]
> Por motivos de seguridad, tu sesión administrativa se cerrará automáticamente tras **30 minutos de inactividad**. Guarda tus cambios periódicamente.

---

### B. Para el Cliente / Visitante (Front-end)
La página principal está diseñada para ser intuitiva y orientada a la venta asistida.

#### 1. Navegación por el Catálogo Dual
*   Al entrar a la página principal, el cliente verá la introducción general (Hero, Marcas, Servicios).
*   En la sección principal encontrará dos grandes tarjetas: **MOTOCICLETAS** y **AUTOMÓVILES**.
*   Al hacer clic en cualquiera de las tarjetas, se desplegará instantáneamente el catálogo interactivo correspondiente a esa categoría (línea Autolook o Motolook) sin salir de la página.

#### 2. Búsqueda y Filtros
Dentro del catálogo, el cliente puede encontrar productos de dos maneras:
*   **Por Categoría:** Usando los botones superiores (Ej. Aerodinámica, Rines, Repuestos).
*   **Por Marca:** Alternando el filtro a "Filtrar por Marca", lo que mostrará marcas específicas (Ej. Brembo, Michelin).

#### 3. Proceso de Cotización y Compra
1. Cuando el cliente encuentra el producto de su interés, debe presionar el botón **"Cotizar por WhatsApp"**.
2. Automáticamente, se abrirá la aplicación de WhatsApp (en celular) o WhatsApp Web (en computadora) hacia el número oficial de ventas.
3. El mensaje se redactará automáticamente incluyendo el nombre del producto exacto por el cual se hizo clic, agilizando el proceso de venta.
4. Para consultas generales que no son de un producto específico, el cliente puede usar el **Botón Flotante de WhatsApp** ubicado siempre en la esquina inferior derecha de la pantalla.
