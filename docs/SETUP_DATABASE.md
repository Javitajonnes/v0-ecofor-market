# Setup de Base de Datos - Desarrollo Local

Guía rápida para configurar PostgreSQL con Docker para desarrollo local.

## Prerrequisitos

- Docker y Docker Compose instalados
- Node.js 18+ instalado

## Paso 1: Iniciar PostgreSQL con Docker

```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en `localhost:5432`
- PgAdmin en `http://localhost:5050` (opcional)

## Paso 2: Verificar que esté corriendo

```bash
docker-compose ps
```

Deberías ver `ecofor_postgres` y `ecofor_pgadmin` corriendo.

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
JWT_SECRET=ecofor-market-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
```

## Paso 4: Ejecutar Migraciones

Las migraciones se ejecutan automáticamente al iniciar Docker por primera vez.

**Para verificar que se aplicaron:**

```bash
npm run test:db
```

Este script verificará:
- ✅ Conexión a la base de datos
- ✅ Existencia de tablas
- ✅ Usuarios de prueba disponibles

**Si las migraciones no se aplicaron automáticamente:**

```bash
npm run db:migrate
```

O manualmente:

```bash
# Schema inicial
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/001_initial_schema.sql

# Datos de prueba
docker exec -i ecofor_postgres psql -U ecofor_user -d ecoformarket < scripts/migrations/002_seed_data.sql
```

## Paso 5: Verificar Conexión

```bash
npm run test:db
```

Deberías ver:
```
🔍 Verificando conexión a PostgreSQL...
✅ Conexión exitosa!
📊 Verificando tabla users...
✅ Tabla users existe. Total usuarios: 5
📊 Verificando tabla products...
✅ Tabla products existe. Total productos: 15
👥 Usuarios disponibles:
  - admin@ecoformarket.com (admin) - Administrador Sistema
  - cliente1@email.com (retail_client) - Juan Pérez
  ...
```

## Usuarios de Prueba

Después de ejecutar las migraciones, puedes usar:

| Email | Password | Rol | Tipo |
|-------|----------|-----|------|
| admin@ecoformarket.com | Admin123! | Admin | Empresa |
| cliente1@email.com | Admin123! | Retail Client | Persona |
| empresa1@email.com | Admin123! | Wholesale Client | Empresa |

## Acceso Directo a PostgreSQL

```bash
docker exec -it ecofor_postgres psql -U ecofor_user -d ecoformarket
```

Comandos útiles dentro de psql:
```sql
\dt              -- Listar tablas
\d users         -- Ver estructura de tabla users
SELECT * FROM users;  -- Ver usuarios
\q               -- Salir
```

## Acceso a PgAdmin (Opcional)

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

## Troubleshooting

### Error: "Connection refused"

**Problema**: Docker no está corriendo o PostgreSQL no inició.

**Solución**:
```bash
docker-compose up -d
docker-compose logs postgres
```

### Error: "password authentication failed"

**Problema**: Credenciales incorrectas en DATABASE_URL.

**Solución**: Verifica que `.env.local` tenga:
```
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5432/ecoformarket
```

### Error: "relation does not exist"

**Problema**: Las migraciones no se ejecutaron.

**Solución**:
```bash
npm run db:migrate
```

### Puerto 5432 ya en uso

**Problema**: Ya tienes PostgreSQL corriendo en otro lugar.

**Solución**: Cambiar puerto en `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Cambiar a 5433
```

Y actualizar `.env.local`:
```
DATABASE_URL=postgresql://ecofor_user:ecofor_pass_2024@localhost:5433/ecoformarket
```

## Comandos Útiles

```bash
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

# Backup de base de datos
docker exec ecofor_postgres pg_dump -U ecofor_user ecoformarket > backup.sql

# Restaurar backup
docker exec -i ecofor_postgres psql -U ecofor_user ecoformarket < backup.sql
```

## Próximos Pasos

Una vez que la base de datos esté funcionando:

1. ✅ Probar login con usuarios de prueba
2. ✅ Probar registro de nuevos usuarios
3. ✅ Implementar APIs de productos
4. ✅ Implementar APIs de pedidos

## Migración a Producción (Neon)

Cuando estés listo para producción:

1. Crear proyecto en [Neon](https://neon.tech)
2. Copiar connection string
3. Ejecutar migraciones en Neon
4. Actualizar `DATABASE_URL` en Vercel
5. ¡Listo! El código funciona igual

