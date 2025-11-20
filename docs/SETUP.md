# Guía de Configuración - EcoforMarket

## Requisitos Previos

- Node.js 18+ instalado
- Docker y Docker Compose instalados
- Git instalado

## Instalación Paso a Paso

### 1. Clonar el Repositorio

\`\`\`bash
git clone <repository-url>
cd ecoformarket
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Base de Datos Local

#### Iniciar PostgreSQL con Docker

\`\`\`bash
# Iniciar servicios (PostgreSQL + PgAdmin)
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
\`\`\`

Esto iniciará:
- **PostgreSQL** en `localhost:5432`
- **PgAdmin** en `http://localhost:5050`

#### Acceder a PgAdmin (Opcional)

1. Abrir navegador en `http://localhost:5050`
2. Login:
   - Email: `admin@ecoformarket.com`
   - Password: `admin123`
3. Agregar servidor:
   - Host: `postgres` (nombre del servicio Docker)
   - Port: `5432`
   - Database: `ecoformarket`
   - Username: `ecofor_user`
   - Password: `ecofor_pass_2024`

### 4. Configurar Variables de Entorno

\`\`\`bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local

# Editar con tus credenciales
nano .env.local
\`\`\`

**Mínimo requerido para desarrollo local:**

\`\`\`env
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
NEXTAUTH_SECRET=dev-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 5. Ejecutar Migraciones

Las migraciones se ejecutan automáticamente al iniciar Docker por primera vez.

**Para verificar que las tablas se crearon:**

\`\`\`bash
# Conectar a PostgreSQL
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket

# Listar tablas
\dt

# Ver estructura de una tabla
\d users

# Salir
\q
\`\`\`

**Para ejecutar migraciones manualmente:**

\`\`\`bash
# Ejecutar schema inicial
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql

# Ejecutar seed data
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/002_seed_data.sql
\`\`\`

### 6. Iniciar Servidor de Desarrollo

\`\`\`bash
npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Usuarios de Prueba

Después de ejecutar las migraciones y seed, tendrás estos usuarios:

| Email | Password | Rol | Tipo |
|-------|----------|-----|------|
| admin@ecoformarket.com | Admin123! | Admin | Company |
| cliente1@email.com | Admin123! | Retail Client | Person |
| empresa1@email.com | Admin123! | Wholesale Client | Company |

## Comandos Útiles

### Docker

\`\`\`bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f postgres

# Reiniciar servicios
docker-compose restart

# Eliminar todo (incluyendo datos)
docker-compose down -v
\`\`\`

### Base de Datos

\`\`\`bash
# Backup
docker exec ecofor_postgres pg_dump -U ecofor_user ecoformarket > backup.sql

# Restore
docker exec -i ecofor_postgres psql -U ecofor_user ecoformarket < backup.sql

# Acceso directo a PostgreSQL
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket
\`\`\`

### Next.js

\`\`\`bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
\`\`\`

## Estructura del Proyecto

\`\`\`
ecoformarket/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticación
│   │   ├── products/     # Productos
│   │   ├── orders/       # Pedidos
│   │   └── users/        # Usuarios
│   ├── (auth)/           # Páginas de autenticación
│   ├── admin/            # Panel admin
│   └── page.tsx          # Home page
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header principal
│   ├── product-card.tsx  # Tarjeta de producto
│   └── ...
├── lib/                   # Utilidades
│   ├── db/               # Database utilities
│   ├── services/         # Business logic
│   ├── types.ts          # TypeScript types
│   └── store.ts          # Zustand store
├── scripts/               # Scripts de base de datos
│   └── migrations/       # SQL migrations
├── docs/                  # Documentación
├── docker-compose.yml     # Docker configuration
└── package.json
\`\`\`

## Próximos Pasos

1. **Implementar Autenticación**: NextAuth.js con PostgreSQL
2. **Crear API Routes**: CRUD para productos, pedidos, usuarios
3. **Panel de Administración**: Gestión completa
4. **Sistema de Notificaciones**: Email y WhatsApp
5. **Generación de PDFs**: Facturas y cotizaciones

## Troubleshooting

### Puerto 5432 ya en uso

\`\`\`bash
# Verificar qué usa el puerto
lsof -i :5432

# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"

# Actualizar DATABASE_URL
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5433/ecoformarket
\`\`\`

### Error de conexión a base de datos

1. Verificar que Docker esté corriendo: `docker ps`
2. Ver logs: `docker-compose logs postgres`
3. Verificar variables de entorno en `.env.local`

### Migraciones no se aplicaron

\`\`\`bash
# Re-ejecutar manualmente
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql
\`\`\`

## Soporte

Para más información, consultar:
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura técnica completa
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
