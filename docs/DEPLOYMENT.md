# Guía de Despliegue - EcoforMarket

## Despliegue en Vercel (Recomendado)

### 1. Preparación

Asegúrate de tener tu proyecto en GitHub:

\`\`\`bash
git init
git add .
git commit -m "Initial commit - EcoforMarket"
git remote add origin <tu-repo-url>
git push -u origin main
\`\`\`

### 2. Variables de Entorno

En el dashboard de Vercel, configura estas variables:

\`\`\`env
# JWT Secret (generar uno seguro)
JWT_SECRET=tu-secret-key-super-segura-aqui

# Base de datos (cuando integres PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database

# Opcional: URLs de redirección
NEXT_PUBLIC_BASE_URL=https://tu-dominio.vercel.app
\`\`\`

### 3. Configuración de Base de Datos

#### Opción A: Neon (Recomendado para Vercel)

1. Crear proyecto en [Neon](https://neon.tech)
2. Copiar connection string
3. Agregar como variable `DATABASE_URL` en Vercel
4. Ejecutar migraciones desde scripts/migrations/

#### Opción B: Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Obtener connection string PostgreSQL
3. Configurar en variables de entorno
4. Ejecutar scripts SQL desde el dashboard

### 4. Conectar con Vercel

\`\`\`bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel
\`\`\`

O desde el dashboard de Vercel:
1. Importar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy

## Despliegue Local con Docker

### 1. Iniciar PostgreSQL

\`\`\`bash
docker-compose up -d
\`\`\`

Esto inicia:
- PostgreSQL en puerto 5432
- pgAdmin en puerto 5050

### 2. Ejecutar Migraciones

\`\`\`bash
# Conectar a la base de datos
docker exec -i ecofor-postgres psql -U ecofor -d ecoformarket < scripts/migrations/001_initial_schema.sql
docker exec -i ecofor-postgres psql -U ecofor -d ecoformarket < scripts/migrations/002_seed_data.sql
\`\`\`

### 3. Configurar .env.local

\`\`\`env
DATABASE_URL=postgresql://ecofor:ecofor123@localhost:5432/ecoformarket
JWT_SECRET=local-development-secret-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
\`\`\`

### 4. Iniciar Aplicación

\`\`\`bash
npm install
npm run dev
\`\`\`

La aplicación estará en http://localhost:3000

## Post-Despliegue

### Verificación

1. Acceder a `/login`
2. Probar usuarios de prueba
3. Verificar roles y permisos
4. Revisar panel admin
5. Probar flujo de compra

### Monitoreo

- Analytics: Incluido por defecto con Vercel Analytics
- Logs: Dashboard de Vercel → Logs
- Errores: Considera agregar Sentry

### Backup

\`\`\`bash
# Backup de base de datos
pg_dump -U ecofor ecoformarket > backup-$(date +%Y%m%d).sql

# Restaurar
psql -U ecofor ecoformarket < backup-YYYYMMDD.sql
\`\`\`

## Checklist Pre-Producción

- [ ] Cambiar JWT_SECRET a valor seguro
- [ ] Configurar base de datos en producción
- [ ] Implementar bcrypt para contraseñas
- [ ] Habilitar HTTPS
- [ ] Configurar dominio personalizado
- [ ] Agregar políticas de CORS
- [ ] Implementar rate limiting
- [ ] Configurar emails (SendGrid/Resend)
- [ ] Agregar logs y monitoreo
- [ ] Optimizar imágenes
- [ ] Configurar CDN para assets
- [ ] Pruebas de carga
- [ ] Documentar API
