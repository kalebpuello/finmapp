# GEMINI.md - Contexto del Proyecto Finmapp SaaS

Este archivo proporciona una visión general y directrices para el desarrollo de **Finmapp**, una aplicación SaaS de gestión financiera personal.

## 🚀 Resumen del Proyecto
Finmapp es una plataforma moderna diseñada para la gestión de ingresos, egresos, presupuestos y metas de ahorro. Está optimizada para 2026 con un enfoque en seguridad, rendimiento y UX premium.

### 🛠 Stack Tecnológico
- **Frontend:** Next.js (App Router) + TypeScript.
- **Estilos:** Tailwind CSS v4 + Lucide React (iconos).
- **Backend:** Supabase (PostgreSQL, Auth SSR, RLS).
- **Estado y Datos:** Zustand (estado global) + React Query (fetching/cache).
- **Visualización:** Recharts (gráficos interactivos).
- **UX:** Driver.js (tours guiados) + Next-Themes (modo oscuro/claro).

## 📂 Estructura del Proyecto
- `app/`: Rutas de Next.js (App Router). Incluye autenticación `(auth)`, dashboard `page.tsx`, presupuestos, metas y perfil.
- `components/`:
  - `dashboard/`: Componentes específicos del negocio (Modales de CRUD, listas, navegación).
  - `theme/`: Proveedores y switches de tema.
  - `ui/`: Componentes base reutilizables.
- `lib/`:
  - `supabase/`: Configuración de clientes (Client, Server, Middleware) para SSR.
  - `utils/`: Utilidades de moneda (`currency.ts`) y traducciones (`translations.ts`).
- `supabase/`: Plantillas de correo y scripts de base de datos.

## ⚙️ Comandos de Desarrollo
- **Instalación:** `npm install`
- **Desarrollo:** `npm run dev`
- **Construcción:** `npm run build`
- **Linting:** `npm run lint`

## 🔐 Configuración de Base de Datos (Supabase)
El esquema se encuentra en `DATABASE_SETUP.sql`. Tablas principales:
- `profiles`: Datos de usuario extendidos de `auth.users`.
- `transactions`: Historial de movimientos (income/expense).
- `budgets`: Límites de gasto por categoría.
- `goals`: Metas de ahorro con seguimiento de progreso.

**Importante:** Se utiliza Row Level Security (RLS) para asegurar que los usuarios solo accedan a sus propios datos.

## 📏 Convenciones de Desarrollo
1. **Tipado:** Uso estricto de TypeScript para todas las interfaces y componentes.
2. **Server vs Client:** Preferir Server Components para el fetch de datos inicial y Client Components para interactividad (modales, forms).
3. **i18n:** Aunque la arquitectura soporta múltiples idiomas (`lib/utils/translations.ts`), el proyecto está fijado actualmente en **Español (es)** por requerimiento.
4. **Moneda:** Soportado para `COP` ($) y `USD` ($...USD). Usar `formatCurrency` de `lib/utils/currency.ts`.
5. **Seguridad:** Las acciones críticas (Edición/Eliminación) deben ser validadas. La lógica de RLS en Supabase es la fuente de verdad.

## 📝 Notas de Implementación
- Las metas de ahorro se descuentan visualmente del saldo disponible para fomentar el ahorro.
- El Dashboard prioriza la visualización de la meta con mayor progreso.
- El tour guiado (`AppTour.tsx`) se dispara para nuevos usuarios.
