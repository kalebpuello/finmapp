# 🚀 Finmapp V1 - Gestión Financiera Inteligente

Finmapp es una aplicación web de alto rendimiento diseñada para empoderar a los usuarios en la gestión de sus finanzas personales. Construida con un stack moderno de 2026, ofrece claridad inmediata sobre saldos, presupuestos y metas de ahorro con una experiencia de usuario premium y segura.

---

## 🛠 Stack Tecnológico

- **Frontend:** Next.js 14 (App Router) + TypeScript.
- **Estilos:** Tailwind CSS v4 (Modern Design System).
- **Backend as a Service (BaaS):** Supabase (PostgreSQL, Auth SSR, RLS).
- **Gráficos:** Recharts (Visualización de datos interactiva).
- **Seguridad:** Row Level Security (RLS) + Re-autenticación por contraseña para acciones críticas.
- **UI/UX:** Lucide React (Iconos), Driver.js (Guía interactiva), Next-Themes (Modo Claro/Oscuro).

---

## ✨ Características Principales

### 📊 Dashboard Inteligente
- Visualización de **Saldo Total** acumulado.
- Resumen dinámico de **Ingresos y Gastos** del mes actual.
- **Widget de Metas:** Muestra automáticamente la meta con mayor progreso.
- **Acceso Rápido:** Botón centralizado para registrar movimientos en segundos.

### 📜 Historial de Transacciones (CRUD Completo)
- Tabla detallada en desktop y **tarjetas expandibles en móvil** (sin scroll horizontal).
- Filtros rápidos por tipo (Ingresos/Egresos).
- **Seguridad:** Cada edición o eliminación requiere la contraseña del usuario.

### 🎯 Planificación de Presupuestos
- Creación de límites mensuales por categoría (Comida, Transporte, etc.).
- Gráficos de **Distribución** (Torta) y **Planeado vs Real** (Barras).
- Alertas visuales cuando se excede el límite planeado.

### 🏆 Metas de Ahorro
- Sistema de abono progresivo que descuenta automáticamente del saldo disponible.
- Registro automático en el historial como "Ahorro".
- Animaciones de éxito al completar el 100%.

### 👤 Perfil y Preferencias
- Soporte multimoneda: **COP ($)** y **USD ($...USD)**.
- Gestión de seguridad (Cambio de contraseña) y nombre de usuario.
- **Wizard de Bienvenida:** Tour guiado para nuevos usuarios.

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
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🔐 Configuración de Base de Datos (Supabase)

Para que el sistema funcione correctamente, ejecuta el contenido de `backup_sql_setup.sql` en el **SQL Editor** de Supabase. Esto configurará:
- **Tablas:** `profiles`, `transactions`, `budgets`, `goals`.
- **RLS:** Políticas de seguridad para que los usuarios solo vean sus propios datos.
- **Triggers:** Creación automática de perfil al registrarse un nuevo usuario.

---

## 🌐 Despliegue en Vercel

1. Sube tu código a GitHub.
2. Conecta el repositorio en Vercel.
3. Configura las **Environment Variables** en el panel de Vercel (las mismas del `.env.local`).
4. **Build Command:** `npm run build`.
5. **Install Command:** `npm install`.

---

## 📝 Notas del Proyecto
- **Internacionalización:** La aplicación cuenta con una arquitectura lista para inglés/español (i18n), actualmente fijada en español para fase de producción.
- **Email Marketing:** Preparado para integración con Resend (API Route `/api/send-auth-code` lista).

---

## 👨‍💻 Créditos
**Desarrollador Principal:** Kaleb Fuentes Puello - *Software Developer*  
**Fecha de Creación:** Febrero de 2026  
**Licencia:** Software Propietario

---
© 2026 Finmapp - Todos los derechos reservados.
