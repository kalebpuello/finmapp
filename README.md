# 🚀 Finmapp V1 - Gestión Financiera Inteligente

Finmapp es una aplicación SaaS de alto rendimiento diseñada para empoderar a los usuarios en la gestión de sus finanzas personales. Construida con un stack moderno de 2026, ofrece una experiencia de usuario premium, segura y altamente personalizable.

---

## 🛠 Stack Tecnológico

- **Frontend:** Next.js 14/15 (App Router) + TypeScript.
- **Estilos:** Tailwind CSS v4 (Modern Design System).
- **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth SSR, RLS).
- **Estado y Datos:** Zustand + React Query.
- **Gráficos:** Recharts (Visualización interactiva).
- **Seguridad:** Row Level Security (RLS) + Re-autenticación para acciones críticas.
- **PWA:** Instalable como aplicación nativa en escritorio y móvil.

---

## ✨ Características Principales

### 📊 Dashboard Inteligente
- **Saldo Dinámico:** Muestra 0 si el balance es negativo con alertas de deuda.
- **Rendimiento Mensual:** Comparativa porcentual automática vs el mes anterior.
- **Widget de Metas:** Seguimiento en tiempo real de la meta con mayor progreso.

### 🎨 Personalización y UX
- **Temas de Color:** 5 paletas (Esmeralda, Océano, Amatista, Sol, Cereza) que cambian toda la app al instante.
- **Modo Oscuro/Claro:** Soporte nativo con `next-themes`.
- **App Tour:** Guía interactiva para nuevos usuarios usando `driver.js`.

### 📜 Gestión Financiera (CRUD)
- **Transacciones:** Registro de ingresos y egresos con validación de seguridad.
- **Presupuestos:** Límites mensuales por categoría con alertas visuales de excedente.
- **Metas de Ahorro:** Sistema de abono que descuenta del saldo disponible.

### 🔐 Seguridad y Privacidad
- **Acciones Protegidas:** Cambio de contraseña y datos sensibles requieren contraseña actual.
- **Derecho al Olvido:** Función de eliminación permanente de cuenta y todos los datos asociados.
- **PWA Standalone:** Ejecución sin barras de navegador para una experiencia de app nativa.

### 🔔 Comunicación y Novedades
- **Sistema "¿Qué hay de nuevo?":** Modal automático que informa sobre nuevas funciones basadas en la versión de la App.
- **Centro de Notificaciones:** Infraestructura lista en base de datos para alertas personales y avisos del sistema.

---

## 🚀 Guía de Instalación (Local)

1. **Clonar el repositorio:**
   ```bash
   git clone <tu-repo-url>
   cd finmapp-SaaS
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env.local`):**
   Crea un archivo `.env.local` en la raíz con las siguientes variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase

   # Configuración de Soporte y Donaciones
   NEXT_PUBLIC_SUPPORT_EMAIL=tu_email_de_soporte
   NEXT_PUBLIC_PAYPAL_URL=tu_enlace_de_donacion_paypal
   NEXT_PUBLIC_BREB_KEY=tu_llave_breb_para_colombia
   NEXT_PUBLIC_JOIN_FORM_URL=tu_url_formulario_colaboradores

   # URL del Sitio
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🔐 Configuración de Base de Datos (Supabase)

Para que el sistema funcione correctamente, ejecuta el contenido de `DATABASE_SETUP.sql` en el **SQL Editor** de Supabase. Este script configura:
- **Esquema de Tablas:** `profiles`, `transactions`, `budgets`, `goals`.
- **Políticas RLS:** Aseguran que el usuario solo vea y edite su propia información.
- **Triggers:** Creación automática del perfil al registrarse un nuevo usuario.
- **Funciones RPC:** Incluye `delete_user_account` para la eliminación segura de cuentas.

---

## 📱 Instalación PWA
Finmapp está lista para ser usada como App:
- **Desktop:** Haz clic en el botón "Versión App" en el menú de usuario o en el icono de instalación de la barra de direcciones de Chrome/Edge.
- **Móvil:** Selecciona "Añadir a la pantalla de inicio" en el menú de compartir de tu navegador.

---

## 👨‍💻 Créditos y Colaboración
**Desarrollador Principal:** Kaleb Fuentes Puello  
Si estás interesado en colaborar con el desarrollo o apoyar el mantenimiento, puedes encontrar los enlaces correspondientes en el modal de **Soporte e Información** dentro de la aplicación.

---
© 2026 Finmapp - Software Propietario. Todos los derechos reservados.
