# EcoforMarket - E-commerce Ecológico B2B/B2C

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/javitajonnes-projects/v0-ecofor-market)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/pl7Wh6yL0Jl)

## Overview

Plataforma de comercio electrónico para productos eco-friendly con gestión de roles, pedidos, cotizaciones y notificaciones automáticas.

## Características Principales

- **Multi-rol**: Admin, Cliente Minorista, Cliente Mayorista
- **Precios Diferenciados**: Precios retail y wholesale automáticos según rol
- **Gestión de Pedidos**: Sistema completo de tracking con estados
- **Cotizaciones**: Generación automática de cotizaciones para clientes
- **Facturas Electrónicas**: Exportación en PDF, JSON y CSV
- **Notificaciones**: Email y WhatsApp automáticos por cambios de estado
- **Búsqueda Avanzada**: Filtros por categoría, precio, disponibilidad
- **Carrito Inteligente**: Persistencia local y gestión de cantidades

## Stack Tecnológico

- **Frontend**: Next.js 15, React 19, Tailwind CSS v4, shadcn/ui
- **Backend**: Next.js API Routes (Route Handlers)
- **Database**: PostgreSQL 15+ (local con Docker, producción en Neon/Supabase)
- **Auth**: JWT con PostgreSQL (NextAuth.js v5 pendiente)
- **Estado**: Zustand
- **PDF**: @react-pdf/renderer
- **Email**: Resend API
- **WhatsApp**: Twilio API

## Deployment

Your project is live at:

**[https://vercel.com/javitajonnes-projects/v0-ecofor-market](https://vercel.com/javitajonnes-projects/v0-ecofor-market)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/pl7Wh6yL0Jl](https://v0.app/chat/pl7Wh6yL0Jl)**

## Inicio Rápido

### Prerequisitos

- Node.js 18+
- Docker y Docker Compose
- Git

### Instalación Local

1. **Clonar e instalar dependencias**
\`\`\`bash
npm install
\`\`\`

2. **Iniciar base de datos PostgreSQL con Docker**
\`\`\`bash
docker-compose up -d
\`\`\`

Esto iniciará:
- PostgreSQL en `localhost:5432`
- PgAdmin en `http://localhost:5050`

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:

\`\`\`env
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
JWT_SECRET=ecofor-market-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Nota:** El archivo `.env.local` no está en el repositorio por seguridad. Debes crearlo manualmente.

4. **Verificar conexión y migraciones**

Las migraciones se ejecutan automáticamente al iniciar Docker. Para verificar:

\`\`\`bash
# Probar conexión (recomendado)
npm run test:db

# O manualmente
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket
\dt  # Listar tablas
\q   # Salir
\`\`\`

5. **Iniciar servidor de desarrollo**
\`\`\`bash
npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000)

## Usuarios de Prueba

Después del seed automático, puedes usar:

| Email | Password | Rol | Tipo |
|-------|----------|-----|------|
| admin@ecoformarket.com | Admin123! | Admin | Empresa |
| cliente1@email.com | Admin123! | Cliente Minorista | Persona |
| empresa1@email.com | Admin123! | Cliente Mayorista | Empresa |

## Documentación Completa

- **[Arquitectura Técnica](./docs/ARCHITECTURE.md)** - Sistema completo, capas y modelo de datos
- **[Guía de Configuración](./docs/SETUP.md)** - Setup detallado paso a paso
- **[Setup de Base de Datos](./docs/SETUP_DATABASE.md)** - Configuración de PostgreSQL con Docker
- **[Opciones de Base de Datos](./docs/DATABASE_OPTIONS.md)** - Análisis de opciones para producción
- **[Sistema de Autenticación](./docs/AUTH_SYSTEM.md)** - Documentación del sistema de auth
- **API Reference** _(próximamente)_

## Estructura del Proyecto

\`\`\`
ecoformarket/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (próximamente)
│   │   ├── auth/         # Autenticación
│   │   ├── products/     # CRUD Productos
│   │   ├── orders/       # Gestión Pedidos
│   │   └── users/        # Gestión Usuarios
│   ├── admin/            # Panel administración
│   └── page.tsx          # Catálogo principal
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header con roles
│   ├── product-card.tsx  # Tarjeta producto
│   ├── cart-sheet.tsx    # Carrito lateral
│   └── filters-sidebar.tsx # Filtros
├── lib/                   # Utilidades y lógica
│   ├── db/               # Database utilities (PostgreSQL)
│   │   ├── index.ts      # Pool de conexiones
│   │   ├── users.ts      # Funciones de usuarios
│   │   └── README.md     # Documentación de BD
│   ├── services/         # Business logic
│   ├── types.ts          # TypeScript types
│   ├── store.ts          # Zustand store
│   └── mock-data.ts      # Datos de prueba (frontend)
├── scripts/               # Scripts y utilidades
│   ├── migrations/       # Migraciones SQL versionadas
│   ├── test-db-connection.ts  # Test de conexión
│   ├── test-login.ts     # Test de login
│   └── fix-passwords.ts  # Regenerar contraseñas
├── docs/                  # Documentación técnica
├── docker-compose.yml     # PostgreSQL + PgAdmin
└── package.json
\`\`\`

## Scripts Disponibles

\`\`\`bash
npm run dev          # Servidor desarrollo (localhost:3000)
npm run build        # Build producción
npm start            # Servidor producción
npm run lint         # ESLint
npm run test:db      # Probar conexión a PostgreSQL
npm run test:login   # Probar sistema de login
npm run fix:passwords # Regenerar contraseñas de usuarios de prueba
npm run db:migrate   # Ejecutar migraciones manualmente
\`\`\`

## Comandos Docker Útiles

\`\`\`bash
# Gestión de servicios
docker-compose up -d        # Iniciar en background
docker-compose down         # Detener servicios
docker-compose logs -f      # Ver logs en tiempo real
docker-compose restart      # Reiniciar servicios

# Base de datos
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket  # Conectar
docker exec ecofor_postgres pg_dump -U ecofor_user ecoformarket > backup.sql  # Backup
\`\`\`

## Requerimientos Funcionales Implementados

### Fase 1 (Completado)
- ✅ Arquitectura frontend/backend con Next.js
- ✅ Modelo de datos PostgreSQL completo
- ✅ Docker Compose para desarrollo local
- ✅ UI base con sistema de roles
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras funcional
- ✅ Precios diferenciados por rol

### Fase 2 (En Desarrollo)
- ✅ Autenticación con PostgreSQL (login, registro, sesión)
- ✅ Hash de contraseñas con bcrypt
- ✅ Conexión a base de datos funcional
- 🔄 API Routes CRUD completo (productos, pedidos)
- 🔄 Panel de administración
- 🔄 Gestión de pedidos con estados
- 🔄 Sistema de cotizaciones

### Fase 3 (Planificado)
- ⏳ Generación de facturas PDF/JSON/CSV
- ⏳ Sistema de notificaciones (Email + WhatsApp)
- ⏳ Búsqueda avanzada con PostgreSQL full-text
- ⏳ Tests unitarios e integración
- ⏳ Deploy a producción

## Arquitectura

El sistema utiliza una arquitectura de capas:

\`\`\`
Frontend (Next.js RSC + Client)
    ↓
API Layer (Route Handlers)
    ↓
Business Logic (Services)
    ↓
Data Access (Repositories)
    ↓
PostgreSQL Database
\`\`\`

Ver [ARCHITECTURE.md](./docs/ARCHITECTURE.md) para detalles completos.

## Modelo de Datos

Entidades principales:
- **Users**: Gestión de usuarios con roles (admin, retail, wholesale)
- **Products**: Catálogo con precios diferenciados
- **Orders**: Pedidos con tracking de estados
- **OrderItems**: Detalle de productos por pedido
- **Quotes**: Cotizaciones con validez
- **Invoices**: Facturas electrónicas
- **Notifications**: Cola de notificaciones email/WhatsApp

## Troubleshooting

### Puerto 5432 ya en uso
\`\`\`bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"
# Actualizar DATABASE_URL en .env.local
\`\`\`

### Migraciones no se aplicaron
\`\`\`bash
# Re-ejecutar manualmente
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/002_seed_data.sql
\`\`\`

### Error de conexión a BD
1. Verificar Docker: `docker ps`
2. Ver logs: `docker-compose logs postgres`
3. Verificar `.env.local`

## Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.

## Contacto

EcoforMarket - Plataforma E-commerce Sustentable

Project Link: [https://v0.app/chat/pl7Wh6yL0Jl](https://v0.app/chat/pl7Wh6yL0Jl)

---

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
