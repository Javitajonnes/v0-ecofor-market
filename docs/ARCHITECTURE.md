# Arquitectura Técnica - EcoforMarket

## Visión General

Sistema e-commerce B2B/B2C con gestión de roles, pedidos, cotizaciones y notificaciones automáticas.

## Stack Tecnológico

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI**: React 19, Tailwind CSS v4, shadcn/ui
- **Estado**: Zustand (cliente), React Server Components (servidor)
- **Validación**: Zod
- **Deployment**: Vercel

### Backend
- **API**: Next.js API Routes (Route Handlers)
- **Autenticación**: JWT con cookies HTTP-only
- **Database Client**: `pg` (node-postgres) para desarrollo local, compatible con `@neondatabase/serverless` para producción
- **Validación**: Zod schemas compartidos (pendiente implementación completa)

### Base de Datos
- **Motor**: PostgreSQL 15+
- **Local**: Docker Compose para desarrollo
- **Producción**: Neon/Supabase (compatible)
- **Migraciones**: Scripts SQL versionados

### Servicios Externos
- **Email**: Resend API
- **WhatsApp**: Twilio API
- **PDF**: @react-pdf/renderer
- **Storage**: Vercel Blob (imágenes de productos)

## Arquitectura de Capas

\`\`\`
┌─────────────────────────────────────────────┐
│           FRONTEND (Next.js)                │
│  ┌──────────────────────────────────────┐   │
│  │  Pages & Components (RSC + Client)   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         API LAYER (Route Handlers)          │
│  ┌──────────────────────────────────────┐   │
│  │  /api/auth/*     - Autenticación     │   │
│  │  /api/products/* - Productos         │   │
│  │  /api/orders/*   - Pedidos           │   │
│  │  /api/users/*    - Usuarios          │   │
│  │  /api/quotes/*   - Cotizaciones      │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│        BUSINESS LOGIC LAYER                 │
│  ┌──────────────────────────────────────┐   │
│  │  Services & Controllers              │   │
│  │  - ProductService                    │   │
│  │  - OrderService                      │   │
│  │  - NotificationService               │   │
│  │  - InvoiceService                    │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         DATA ACCESS LAYER                   │
│  ┌──────────────────────────────────────┐   │
│  │  Repository Pattern                  │   │
│  │  - UserRepository                    │   │
│  │  - ProductRepository                 │   │
│  │  - OrderRepository                   │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         DATABASE (PostgreSQL)               │
└─────────────────────────────────────────────┘
\`\`\`

## Modelo de Datos

### Entidades Principales

#### Users (Usuarios)
\`\`\`sql
- id: UUID (PK)
- email: VARCHAR(255) UNIQUE
- password_hash: VARCHAR(255)
- user_type: ENUM('person', 'company')
- role: ENUM('admin', 'retail_client', 'wholesale_client')
- name: VARCHAR(255)
- company_name: VARCHAR(255) NULL
- rut: VARCHAR(20) UNIQUE
- phone: VARCHAR(20)
- address: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

#### Products (Productos)
\`\`\`sql
- id: UUID (PK)
- name: VARCHAR(255)
- description: TEXT
- category: VARCHAR(100)
- brand: VARCHAR(100)
- sku: VARCHAR(50) UNIQUE
- price_retail: DECIMAL(10,2)
- price_wholesale: DECIMAL(10,2)
- min_wholesale_quantity: INTEGER
- stock: INTEGER
- image_url: VARCHAR(500)
- is_featured: BOOLEAN
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

#### Orders (Pedidos)
\`\`\`sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- order_number: VARCHAR(50) UNIQUE
- status: ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
- total_amount: DECIMAL(10,2)
- payment_method: VARCHAR(50)
- shipping_address: TEXT
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- confirmed_at: TIMESTAMP NULL
- shipped_at: TIMESTAMP NULL
- delivered_at: TIMESTAMP NULL
\`\`\`

#### OrderItems (Detalle de Pedidos)
\`\`\`sql
- id: UUID (PK)
- order_id: UUID (FK -> Orders)
- product_id: UUID (FK -> Products)
- quantity: INTEGER
- unit_price: DECIMAL(10,2)
- subtotal: DECIMAL(10,2)
- created_at: TIMESTAMP
\`\`\`

#### Quotes (Cotizaciones)
\`\`\`sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- quote_number: VARCHAR(50) UNIQUE
- status: ENUM('draft', 'sent', 'accepted', 'rejected', 'expired')
- total_amount: DECIMAL(10,2)
- valid_until: DATE
- notes: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

#### Invoices (Facturas)
\`\`\`sql
- id: UUID (PK)
- order_id: UUID (FK -> Orders)
- invoice_number: VARCHAR(50) UNIQUE
- issue_date: DATE
- due_date: DATE
- subtotal: DECIMAL(10,2)
- tax: DECIMAL(10,2)
- total: DECIMAL(10,2)
- pdf_url: VARCHAR(500)
- status: ENUM('pending', 'paid', 'overdue')
- created_at: TIMESTAMP
\`\`\`

#### Notifications (Notificaciones)
\`\`\`sql
- id: UUID (PK)
- user_id: UUID (FK -> Users)
- order_id: UUID (FK -> Orders) NULL
- type: ENUM('email', 'whatsapp')
- status: ENUM('pending', 'sent', 'failed')
- subject: VARCHAR(255)
- message: TEXT
- sent_at: TIMESTAMP NULL
- created_at: TIMESTAMP
\`\`\`

## Mapeo Requerimientos → Implementación

### RF1: Gestión de Usuarios
- **Tablas**: Users
- **API**: `/api/auth/register`, `/api/auth/login`, `/api/users/*`
- **Autenticación**: NextAuth.js con JWT
- **Implementación**: Formularios de registro, middleware de autenticación

### RF2: Catálogo de Productos
- **Tablas**: Products
- **API**: `/api/products` (GET, POST, PUT, DELETE)
- **Features**: CRUD completo, upload de imágenes a Vercel Blob
- **UI**: Panel admin para gestión, catálogo público

### RF3: Carrito de Compras
- **Storage**: Zustand store (cliente) + LocalStorage
- **API**: Sin persistencia en BD hasta checkout
- **UI**: Sheet lateral, gestión de cantidades

### RF4: Gestión de Pedidos
- **Tablas**: Orders, OrderItems
- **API**: `/api/orders` (POST, GET, PUT)
- **Features**: Crear pedido desde carrito, actualizar estados
- **UI**: Panel de pedidos, detalle de orden

### RF5: Búsqueda y Filtrado de Pedidos
- **API**: `/api/orders?customer={}&date={}&status={}`
- **Query Builder**: SQL con WHERE dinámico
- **UI**: Filtros en panel admin

### RF6: Búsqueda y Filtrado de Productos
- **API**: `/api/products?category={}&price={}&availability={}`
- **Features**: Full-text search, filtros múltiples
- **UI**: Sidebar de filtros (ya implementado)

### RF7: Visualización Estado de Pedidos
- **API**: `/api/orders/[id]`
- **Features**: Timeline de estados, tracking
- **UI**: Página de detalle con stepper

### RF8: Generación de Cotizaciones y Facturas
- **Tablas**: Quotes, Invoices
- **API**: `/api/quotes/generate`, `/api/invoices/generate`
- **Library**: @react-pdf/renderer
- **Formats**: PDF (primario), JSON/CSV export
- **Storage**: Vercel Blob para PDFs

### RF9: Notificaciones Automáticas
- **Tablas**: Notifications
- **API**: `/api/notifications/send`
- **Services**: Resend (email), Twilio (WhatsApp)
- **Triggers**: Webhooks en cambios de estado
- **Templates**: Email/WhatsApp templates

### RF10: Autenticación
- **Library**: NextAuth.js v5
- **Strategy**: Credentials provider
- **Session**: JWT con cookie segura
- **Middleware**: Protected routes

### RF11: Perfiles Diferenciados
- **Roles**: admin, retail_client, wholesale_client
- **Field**: User.role (ENUM)
- **Logic**: Precios dinámicos según rol

### RF12: Control de Acceso
- **Middleware**: Role-based access control (RBAC)
- **Implementation**: Higher-order functions para API routes
- **UI**: Conditional rendering según rol

## Configuración Local

### Docker Compose (PostgreSQL Local)

\`\`\`yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: ecofor_postgres
    environment:
      POSTGRES_DB: ecoformarket
      POSTGRES_USER: ecofor_user
      POSTGRES_PASSWORD: ecofor_pass_2024
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts:/docker-entrypoint-initdb.d
    restart: unless-stopped

volumes:
  postgres_data:
\`\`\`

### Variables de Entorno

\`\`\`bash
# Database
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_xxxxx

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxx
\`\`\`

## Flujos Principales

### Flujo de Compra (Cliente)
1. Cliente navega catálogo → Ve precios según su rol
2. Agrega productos al carrito → Validación de stock
3. Revisa carrito → Modifica cantidades
4. Checkout → Ingresa datos de envío
5. Confirma pedido → Se crea Order + OrderItems
6. Sistema genera factura → PDF almacenado
7. Notificación enviada → Email + WhatsApp
8. Cliente recibe confirmación

### Flujo de Gestión (Admin)
1. Admin accede a panel → Vista todos los pedidos
2. Filtra por criterios → Query personalizado
3. Selecciona pedido → Ve detalle completo
4. Actualiza estado → Trigger de notificación
5. Cliente recibe update → Email/WhatsApp automático

### Flujo de Cotización
1. Cliente solicita cotización → Selecciona productos
2. Admin recibe solicitud → Revisa y ajusta precios
3. Sistema genera PDF → Quote con validez
4. Envío automático → Email al cliente
5. Cliente acepta → Convierte en Order

## Seguridad

### Autenticación
- Passwords hasheados con bcrypt (12 rounds)
- JWT con expiración de 7 días
- Refresh tokens para sesiones largas
- Rate limiting en endpoints de auth

### Autorización
- Middleware RBAC en todas las rutas protegidas
- Validación de ownership (usuario solo ve sus pedidos)
- Admin tiene acceso completo
- SQL injection prevention (parametrized queries)

### Data Protection
- HTTPS obligatorio en producción
- CORS configurado específicamente
- Input validation con Zod en cliente y servidor
- XSS prevention con sanitización

## Escalabilidad

### Performance
- Server Components para reducir bundle JS
- Caching con `revalidateTag()` en productos
- Imágenes optimizadas con Next.js Image
- Database indexes en campos de búsqueda

### Monitoring
- Vercel Analytics para frontend
- Error tracking con Sentry (opcional)
- Database slow query logging
- API rate limiting

## Próximos Pasos

1. **Setup Inicial**
   - Configurar PostgreSQL local con Docker
   - Ejecutar migrations para crear tablas
   - Seed con datos de prueba

2. **Autenticación**
   - Implementar NextAuth.js
   - Crear páginas de login/register
   - Middleware de protección

3. **Backend API**
   - Implementar Route Handlers
   - Crear servicios de negocio
   - Repositorios de datos

4. **Features Avanzadas**
   - Sistema de notificaciones
   - Generación de PDFs
   - Panel de administración completo

5. **Testing & Deploy**
   - Tests unitarios y de integración
   - Deploy a Vercel
   - Migrar DB a Neon/Supabase
