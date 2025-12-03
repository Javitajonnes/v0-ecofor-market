# EcoforMarket - E-commerce Ecológico B2B/B2C

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/javitajonnes-projects/v0-ecofor-market)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/pl7Wh6yL0Jl)

## Overview

Plataforma de comercio electrónico completa para productos eco-friendly con gestión de roles, pedidos, cotizaciones y notificaciones automáticas. Diseñada para soportar ventas B2B (mayoristas) y B2C (minoristas) con precios diferenciados y funcionalidades específicas por tipo de cliente.

## Características Principales

- **Multi-rol**: Admin, Cliente Minorista, Cliente Mayorista, Invitado
- **Autenticación Completa**: Sistema de login/registro con JWT y bcrypt
- **Precios Diferenciados**: Precios retail y wholesale automáticos según rol
- **Gestión de Pedidos**: Sistema completo de tracking con estados
- **Cotizaciones**: Generación automática de cotizaciones para clientes
- **Facturas Electrónicas**: Exportación en PDF, JSON y CSV
- **Notificaciones**: Email y WhatsApp automáticos por cambios de estado
- **Búsqueda Avanzada**: Filtros por categoría, marca, precio, disponibilidad
- **Carrito Inteligente**: Persistencia local con Zustand
- **Validación RUT**: Validación automática de RUT chileno
- **Responsive Design**: Optimizado para móvil, tablet y desktop

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15 (App Router)
- **React**: 19.2 con Server Components y Client Components
- **Estilos**: Tailwind CSS v4 + shadcn/ui
- **Estado Global**: Zustand con persistencia
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React

### Backend
- **API**: Next.js Route Handlers (API Routes)
- **Autenticación**: JWT + bcrypt (12 rounds)
- **Base de Datos**: PostgreSQL 15+ con @neondatabase/serverless
- **ORM**: SQL directo con tagged templates (seguro contra SQL injection)

### Infraestructura
- **Desarrollo Local**: Docker + Docker Compose
- **Producción**: Vercel + Neon PostgreSQL
- **Almacenamiento**: Vercel Blob para imágenes

### Dependencias Principales

\`\`\`json
{
  "dependencies": {
    "next": "16.0.3",
    "react": "19.2.0",
    "@neondatabase/serverless": "^0.10.4",
    "bcrypt": "^6.0.0",
    "jose": "latest",
    "zustand": "latest",
    "zod": "3.25.76",
    "lucide-react": "^0.454.0"
  }
}
\`\`\`

## Deployment

Your project is live at:

**[https://vercel.com/javitajonnes-projects/v0-ecofor-market](https://vercel.com/javitajonnes-projects/v0-ecofor-market)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/pl7Wh6yL0Jl](https://v0.app/chat/pl7Wh6yL0Jl)**

---

## Instalación y Configuración

### Prerequisitos

- **Node.js**: 18.0 o superior
- **Docker**: 20.0 o superior
- **Docker Compose**: 2.0 o superior
- **Git**: Para clonar el repositorio

### 1. Clonar el Repositorio

\`\`\`bash
git clone https://github.com/tu-usuario/v0-ecofor-market.git
cd v0-ecofor-market
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y edita con tus credenciales:

\`\`\`bash
cp .env.local.example .env.local
\`\`\`

Variables requeridas:

\`\`\`env
# Base de Datos (Desarrollo Local)
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket

# Base de Datos (Producción - Neon)
POSTGRES_URL=your-neon-connection-string
DATABASE_URL_UNPOOLED=your-neon-unpooled-connection

# Autenticación
JWT_SECRET=tu-clave-secreta-jwt-super-segura-minimo-32-caracteres
NEXTAUTH_SECRET=tu-clave-secreta-nextauth
NEXTAUTH_URL=http://localhost:3000

# Opcional: APIs externas
RESEND_API_KEY=tu-api-key-resend
TWILIO_ACCOUNT_SID=tu-sid-twilio
TWILIO_AUTH_TOKEN=tu-token-twilio
BLOB_READ_WRITE_TOKEN=tu-token-vercel-blob
\`\`\`

### 4. Iniciar Base de Datos (Local con Docker)

\`\`\`bash
# Iniciar PostgreSQL y PgAdmin
docker-compose up -d

# Verificar que los servicios estén corriendo
docker ps
\`\`\`

Servicios disponibles:
- **PostgreSQL**: `localhost:5432`
- **PgAdmin**: `http://localhost:5050` (admin@ecofor.com / admin)

### 5. Ejecutar Migraciones

Las migraciones se ejecutan automáticamente al iniciar Docker. Para ejecutarlas manualmente:

\`\`\`bash
npm run db:migrate
\`\`\`

O directamente con Docker:

\`\`\`bash
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/002_seed_data.sql
\`\`\`

### 6. Iniciar Servidor de Desarrollo

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en: **http://localhost:3000**

### 7. Resetear Contraseñas de Prueba

Si necesitas resetear las contraseñas de los usuarios de prueba:

1. Ve a: **http://localhost:3000/test-login**
2. Haz clic en "Resetear Contraseñas en Base de Datos"
3. Las contraseñas se actualizarán a:
   - Admin: `admin123`
   - Clientes: `cliente123`
   - Empresas: `empresa123`

---

## Usuarios de Prueba

El sistema incluye 5 usuarios de prueba preconfigurados:

| Email | Contraseña | Rol | Tipo | RUT |
|-------|-----------|-----|------|-----|
| admin@ecoformarket.com | Admin123! | Admin | Empresa | 76.123.456-7 |
| cliente1@email.com | Admin123! | Cliente Minorista | Persona | 12.345.678-9 |
| cliente2@email.com | Admin123! | Cliente Minorista | Persona | 98.765.432-1 |
| empresa1@email.com | Admin123! | Cliente Mayorista | Empresa | 76.111.222-3 |
| empresa2@email.com | Admin123! | Cliente Mayorista | Empresa | 76.333.444-5 |

**Nota**: Si los usuarios de prueba no funcionan, ejecuta el endpoint de reset de contraseñas en `/test-login`.

### Diferencias por Rol

**Invitado (No autenticado)**
- Precios base de retail
- Sin descuentos
- Puede ver productos pero no comprar

**Cliente Minorista**
- Precios estándar de retail
- Puede comprar productos individuales
- Acceso a historial de órdenes

**Cliente Mayorista**
- Precios mayoristas (15-20% descuento)
- Información de cantidad mínima de pedido
- Puede solicitar cotizaciones
- Acceso a historial de órdenes empresariales

**Administrador**
- Vista completa de stock
- Acceso al panel de administración (`/admin`)
- Gestión de usuarios y productos
- Reportes y estadísticas

---

## Esquema de Base de Datos

### Tablas Principales

#### 1. **users** - Usuarios del Sistema
\`\`\`sql
id UUID PRIMARY KEY
email VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
user_type ENUM('person', 'company')
role ENUM('admin', 'retail_client', 'wholesale_client')
name VARCHAR(255) NOT NULL
company_name VARCHAR(255)
rut VARCHAR(20) UNIQUE NOT NULL
phone VARCHAR(20)
address TEXT
city VARCHAR(100)
region VARCHAR(100)
postal_code VARCHAR(10)
is_active BOOLEAN DEFAULT true
email_verified BOOLEAN DEFAULT false
created_at TIMESTAMP
updated_at TIMESTAMP
\`\`\`

#### 2. **products** - Catálogo de Productos
\`\`\`sql
id UUID PRIMARY KEY
name VARCHAR(255) NOT NULL
description TEXT
category VARCHAR(100) NOT NULL
brand VARCHAR(100)
sku VARCHAR(50) UNIQUE NOT NULL
price_retail DECIMAL(10,2) NOT NULL
price_wholesale DECIMAL(10,2) NOT NULL
min_wholesale_quantity INTEGER DEFAULT 10
stock INTEGER DEFAULT 0
image_url VARCHAR(500)
is_featured BOOLEAN DEFAULT false
is_active BOOLEAN DEFAULT true
weight_kg DECIMAL(8,2)
dimensions VARCHAR(50)
created_at TIMESTAMP
updated_at TIMESTAMP
\`\`\`

#### 3. **orders** - Pedidos
\`\`\`sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
order_number VARCHAR(50) UNIQUE NOT NULL
status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
total_amount DECIMAL(10,2) NOT NULL
payment_method VARCHAR(50)
shipping_address TEXT NOT NULL
shipping_city VARCHAR(100)
shipping_region VARCHAR(100)
shipping_postal_code VARCHAR(10)
notes TEXT
created_at TIMESTAMP
confirmed_at TIMESTAMP
shipped_at TIMESTAMP
delivered_at TIMESTAMP
\`\`\`

#### 4. **order_items** - Detalle de Pedidos
\`\`\`sql
id UUID PRIMARY KEY
order_id UUID REFERENCES orders(id)
product_id UUID REFERENCES products(id)
quantity INTEGER NOT NULL
unit_price DECIMAL(10,2) NOT NULL
subtotal DECIMAL(10,2) NOT NULL
created_at TIMESTAMP
\`\`\`

#### 5. **quotes** - Cotizaciones
\`\`\`sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
quote_number VARCHAR(50) UNIQUE NOT NULL
status ENUM('draft', 'sent', 'accepted', 'rejected', 'expired')
total_amount DECIMAL(10,2) NOT NULL
valid_until DATE NOT NULL
notes TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
\`\`\`

#### 6. **invoices** - Facturas
\`\`\`sql
id UUID PRIMARY KEY
order_id UUID REFERENCES orders(id)
invoice_number VARCHAR(50) UNIQUE NOT NULL
issue_date DATE NOT NULL
due_date DATE NOT NULL
subtotal DECIMAL(10,2) NOT NULL
tax DECIMAL(10,2) NOT NULL
total DECIMAL(10,2) NOT NULL
pdf_url VARCHAR(500)
status ENUM('pending', 'paid', 'overdue')
created_at TIMESTAMP
updated_at TIMESTAMP
\`\`\`

#### 7. **notifications** - Cola de Notificaciones
\`\`\`sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
order_id UUID REFERENCES orders(id)
type ENUM('email', 'whatsapp')
status ENUM('pending', 'sent', 'failed')
subject VARCHAR(255)
message TEXT NOT NULL
sent_at TIMESTAMP
error_message TEXT
created_at TIMESTAMP
\`\`\`

### Relaciones

\`\`\`
users (1) -----> (N) orders
users (1) -----> (N) quotes
users (1) -----> (N) notifications

orders (1) -----> (N) order_items
orders (1) -----> (1) invoices

quotes (1) -----> (N) quote_items

products (1) -----> (N) order_items
products (1) -----> (N) quote_items
\`\`\`

### Índices para Performance

\`\`\`sql
-- Búsqueda de usuarios
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_rut ON users(rut);
CREATE INDEX idx_users_role ON users(role);

-- Búsqueda de productos
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(is_active);

-- Búsqueda de órdenes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
\`\`\`

---

## Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev          # Servidor desarrollo (localhost:3000)
npm run build        # Build para producción
npm start            # Servidor producción
npm run lint         # Ejecutar ESLint

# Base de Datos
npm run db:migrate   # Ejecutar migraciones
npm run test:db      # Probar conexión a BD

# Testing
npm run test:login   # Probar sistema de login
npm run fix:passwords # Resetear contraseñas de prueba
\`\`\`

---

## Comandos Docker Útiles

### Gestión de Servicios

\`\`\`bash
# Iniciar servicios en background
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs específicos de PostgreSQL
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Borra todos los datos)
docker-compose down -v

# Reiniciar servicios
docker-compose restart
\`\`\`

### Base de Datos

\`\`\`bash
# Conectar a PostgreSQL con psql
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket

# Listar tablas
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket -c "\dt"

# Ver usuarios
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket -c "SELECT email, role, is_active FROM users;"

# Backup completo
docker exec ecofor_postgres pg_dump -U ecofor_user ecoformarket > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < backup.sql
\`\`\`

---

## Estructura del Proyecto

\`\`\`
ecoformarket/
├── app/                           # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── auth/                # Autenticación endpoints
│   │       ├── login/           # POST login
│   │       ├── register/        # POST registro
│   │       ├── logout/          # POST logout
│   │       ├── me/              # GET usuario actual
│   │       └── reset-test-passwords/ # POST reset contraseñas
│   ├── admin/                    # Panel administración
│   │   └── page.tsx             # Dashboard admin
│   ├── login/                    # Página de login
│   │   └── page.tsx
│   ├── registro/                 # Página de registro
│   │   └── page.tsx
│   ├── test-login/               # Testing de autenticación
│   │   └── page.tsx
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página principal (catálogo)
│   └── globals.css               # Estilos globales
├── components/                    # Componentes React
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── auth-provider.tsx         # Provider de autenticación
│   ├── header.tsx                # Header con roles
│   ├── product-card.tsx          # Tarjeta de producto
│   ├── cart-sheet.tsx            # Carrito lateral
│   └── filters-sidebar.tsx       # Filtros de productos
├── lib/                           # Utilidades y lógica
│   ├── db/                       # Database utilities
│   │   ├── index.ts             # Cliente Neon
│   │   ├── users.ts             # Funciones de usuarios
│   │   └── README.md            # Documentación DB
│   ├── utils/                    # Utilidades
│   │   └── rut.ts               # Validación RUT chileno
│   ├── types.ts                  # TypeScript types
│   ├── store.ts                  # Zustand store
│   ├── mock-data.ts              # Datos de prueba
│   └── utils.ts                  # Utilidades generales
├── scripts/                       # Scripts SQL y Node
│   ├── migrations/               # Migraciones SQL
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_seed_data.sql
│   │   └── 003_update_test_passwords.sql
│   ├── test-db-connection.ts     # Script de prueba DB
│   ├── test-login.ts             # Script de prueba login
│   └── reset-passwords.ts        # Script reset contraseñas
├── docs/                          # Documentación técnica
│   ├── ARCHITECTURE.md           # Arquitectura completa
│   ├── SETUP.md                  # Guía de configuración
│   ├── SECURITY.md               # Arquitectura de seguridad
│   ├── PROJECT_STATUS.md         # Estado del proyecto
│   ├── USERS_GUIDE.md            # Guía de usuarios
│   ├── NEON_MIGRATION.md         # Migración a Neon
│   └── DEPLOYMENT.md             # Guía de despliegue
├── docker-compose.yml             # PostgreSQL + PgAdmin
├── .env.local.example             # Variables de entorno ejemplo
├── next.config.mjs                # Configuración Next.js
├── tsconfig.json                  # Configuración TypeScript
├── package.json                   # Dependencias
└── README.md                      # Este archivo
\`\`\`

---

## Seguridad

El proyecto implementa múltiples capas de seguridad:

### 1. Arquitectura Separada
- La base de datos SOLO es accesible desde API Routes (servidor)
- Los componentes de cliente usan `fetch()` para llamar a API Routes
- NUNCA se ejecuta SQL directamente desde el navegador

### 2. Autenticación Robusta
- Contraseñas hasheadas con bcrypt (12 rounds, salt incluido)
- JWT para gestión de sesiones con expiración de 7 días
- Tokens almacenados en localStorage y cookies httpOnly

### 3. Validaciones
- RUT chileno validado con algoritmo oficial del dígito verificador
- Email verificado contra formato RFC 5322
- Contraseñas con longitud mínima de 6 caracteres
- Validación de tipos con Zod en formularios

### 4. SQL Seguro
- Tagged templates de `@neondatabase/serverless` previenen SQL injection
- Parámetros escapados automáticamente
- Sin concatenación manual de strings en queries

### 5. Variables de Entorno
- Credenciales sensibles en `.env.local` (no versionado)
- Secretos JWT separados para desarrollo y producción
- API keys protegidas y no expuestas al navegador

**Nota sobre el Warning de Neon**: El warning de seguridad de `@neondatabase/serverless` está suprimido (`disableWarningInBrowsers: true`) porque nuestra arquitectura es completamente segura. Ver [SECURITY.md](./docs/SECURITY.md) para detalles completos.

---

## Despliegue a Producción

### Opción 1: Vercel + Neon (Recomendado)

1. **Crear proyecto en Neon**
   - Registrarse en [neon.tech](https://neon.tech)
   - Crear nuevo proyecto PostgreSQL
   - Copiar connection string

2. **Configurar Variables en Vercel**
   \`\`\`env
   DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname
   POSTGRES_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname
   JWT_SECRET=tu-secret-produccion
   NEXTAUTH_URL=https://tu-dominio.vercel.app
   \`\`\`

3. **Ejecutar Migraciones en Neon**
   \`\`\`bash
   psql $DATABASE_URL < scripts/migrations/001_initial_schema.sql
   psql $DATABASE_URL < scripts/migrations/002_seed_data.sql
   \`\`\`

4. **Deploy desde v0.app**
   - El proyecto ya está conectado a Vercel
   - Cada push a `main` despliega automáticamente
   - Verificar en: https://vercel.com/javitajonnes-projects/v0-ecofor-market

### Opción 2: Docker + VPS

Ver [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para instrucciones detalladas.

---

## Troubleshooting

### Puerto 5432 ya en uso

Si tienes PostgreSQL instalado localmente:

\`\`\`bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"

# Actualizar DATABASE_URL en .env.local
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5433/ecoformarket
\`\`\`

### Migraciones no se aplicaron

\`\`\`bash
# Verificar estado de la base de datos
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket -c "\dt"

# Re-ejecutar migraciones manualmente
npm run db:migrate
\`\`\`

### Error de conexión a BD

1. Verificar Docker: `docker ps`
2. Ver logs: `docker-compose logs postgres`
3. Verificar `.env.local` tenga `DATABASE_URL` correcto
4. Reiniciar servicios: `docker-compose restart`

### Login no funciona

1. Verificar usuarios de prueba en `/test-login`
2. Resetear contraseñas con el botón en `/test-login`
3. Verificar que la base de datos tenga datos: `docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket -c "SELECT email FROM users;"`
4. Limpiar localStorage: `localStorage.clear()`

### Contraseñas incorrectas

Las contraseñas iniciales del seed son: `Admin123!` (con mayúscula y signo de exclamación).

Para usar contraseñas más simples (`admin123`, `cliente123`, `empresa123`):
1. Ve a `/test-login`
2. Haz clic en "Resetear Contraseñas en Base de Datos"

---

## Documentación Adicional

- **[Arquitectura Técnica](./docs/ARCHITECTURE.md)** - Sistema completo, capas y flujos
- **[Guía de Configuración](./docs/SETUP.md)** - Setup detallado paso a paso
- **[Arquitectura de Seguridad](./docs/SECURITY.md)** - Capas de seguridad implementadas
- **[Estado del Proyecto](./docs/PROJECT_STATUS.md)** - Features implementadas y roadmap
- **[Guía de Usuarios](./docs/USERS_GUIDE.md)** - Usuarios de prueba y diferencias por rol
- **[Migración a Neon](./docs/NEON_MIGRATION.md)** - Uso de @neondatabase/serverless
- **[Despliegue](./docs/DEPLOYMENT.md)** - Guía completa de deploy

---

## Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Código

- TypeScript estricto
- ESLint + Prettier
- Commits semánticos
- Comentarios en español para lógica de negocio

---

## Roadmap

### Fase 1 - MVP ✅
- [x] Arquitectura frontend/backend
- [x] Modelo de datos PostgreSQL
- [x] Docker Compose para desarrollo
- [x] UI base con sistema de roles
- [x] Sistema de autenticación
- [x] Catálogo de productos
- [x] Carrito de compras
- [x] Precios diferenciados

### Fase 2 - En Desarrollo 🚧
- [ ] Panel de administración completo
- [ ] CRUD de productos
- [ ] Gestión de pedidos
- [ ] Sistema de cotizaciones
- [ ] Generación de facturas PDF

### Fase 3 - Futuro ⏳
- [ ] Notificaciones Email + WhatsApp
- [ ] Búsqueda avanzada full-text
- [ ] Tests unitarios e integración
- [ ] Panel de reportes y analíticas
- [ ] Integración con pasarelas de pago

---

## Licencia

Este proyecto está bajo la Licencia MIT.

---

## Contacto

**EcoforMarket** - Plataforma E-commerce Sustentable

- **v0 Chat**: [https://v0.app/chat/pl7Wh6yL0Jl](https://v0.app/chat/pl7Wh6yL0Jl)
- **Deploy**: [https://vercel.com/javitajonnes-projects/v0-ecofor-market](https://vercel.com/javitajonnes-projects/v0-ecofor-market)

---

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
